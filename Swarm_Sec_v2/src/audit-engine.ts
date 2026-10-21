import { parser } from '@lezer/python';
import { RAW_NETWORK } from './swarm-data';
export type Environment = 'Python' | 'Cisco IOS CLI' | 'Terraform AWS VPC' | 'Docker Compose';
export type Finding = { code: string; line: number; severity: 'CRITICAL' | 'HIGH'; title: string; compliance: string };
export type AuditResult = { environment: Environment; findings: Finding[]; sourceLines: number; structure: string[]; tests: string; remediated: string; generatedAt: string; elapsedMs: number; input: string };
export const SQL_PRESET = `import sqlite3\ndef get_user_data(username):\n    conn = sqlite3.connect("users.db")\n    query = "SELECT * FROM users WHERE username = '" + username + "'"\n    return conn.execute(query).fetchall()`;
export const PRESETS: Record<Environment, string> = {
  Python: SQL_PRESET,
  'Cisco IOS CLI': RAW_NETWORK,
  'Terraform AWS VPC': `resource "aws_security_group" "app" {\n  ingress {\n    from_port = 22\n    to_port = 80\n    protocol = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n}\nresource "aws_ebs_volume" "data" {\n  availability_zone = "us-east-1a"\n  encrypted = false\n}`,
  'Docker Compose': `services:\n  app:\n    image: python:3.12-slim\n    privileged: true\n    ports: ["80:8000"]\n    volumes: ["/var/run/docker.sock:/var/run/docker.sock"]`,
};
const SQL_COMPLIANCE = 'Non-Compliant with SOC2 CC6.1 & ISO 27001 A.14.2';
const NET_COMPLIANCE = 'Violates NIST SP 800-53 SC-8 (Transmission Confidentiality)';
export function runAudit(input: string, environment: Environment): AuditResult {
  if (!input.trim()) throw new Error('Paste code or a configuration first.');
  if (input.length > 100000) throw new Error('Input exceeds the 100 KB playground limit.');
  const start = performance.now();
  const lines = input.split('\n');
  const findings: Finding[] = [];
  const add = (code: string, line: number, title: string, compliance: string, severity: Finding['severity'] = 'HIGH') => findings.push({ code, line, title, compliance, severity });
  const structure: string[] = [];
  let remediated = input;
  if (environment === 'Python') {
    const tree = parser.parse(input);
    const dynamicSQL = new Set<number>();
    tree.iterate({ enter(node) {
      if (node.name === 'FunctionDefinition' || node.name === 'ImportStatement') structure.push(`${node.name} · L${input.slice(0, node.from).split('\n').length}`);
      if (node.name === 'AssignStatement' && /\b(SELECT|INSERT|UPDATE|DELETE)\b/i.test(input.slice(node.from, node.to))) {
        const text = input.slice(node.from, node.to);
        if (/\+|f["']|\.format\s*\(|%\s*\(?[A-Za-z_]/.test(text)) {
          dynamicSQL.add(input.slice(0, node.from).split('\n').length);
        }
      }
      if (node.name === 'CallExpression') {
        const text = input.slice(node.from, node.to);
        if (/\.execute\s*\(/.test(text) && /\b(SELECT|INSERT|UPDATE|DELETE)\b/i.test(text) && /\+|f["']|\.format\s*\(|%\s*\(?[A-Za-z_]/.test(text)) dynamicSQL.add(input.slice(0, node.from).split('\n').length);
      }
    }});
    for (const line of dynamicSQL) add('CWE-89', line, 'Dynamic SQL interpolation / concatenation', SQL_COMPLIANCE, 'CRITICAL');
    let hasParseError = false;
    tree.iterate({ enter(node) { if (node.type.isError) hasParseError = true; } });
    if (hasParseError) add('PARSE', 1, 'Python syntax requires review', 'Parser diagnostic');
    if (findings.some(f => f.code === 'CWE-89')) {
      const query = input.match(/SELECT\s+\*\s+FROM\s+([A-Za-z_]\w*)\s+WHERE\s+([A-Za-z_]\w*)\s*=/i);
      const table = query?.[1]; const column = query?.[2];
      if (table && column) {
        remediated = `# Review-ready replacement for SELECT * FROM ${table} WHERE ${column} = ...\n# Requires app.db.get_session and the matching model in app.models.\nfrom fastapi import APIRouter, Depends, HTTPException, Path\nfrom sqlalchemy import select\nfrom sqlalchemy.ext.asyncio import AsyncSession\nfrom app.db import get_session\nfrom app.models import ${table[0]?.toUpperCase()}${table.slice(1)}\n\nrouter = APIRouter()\n\n@router.get("/${table}/{value}")\nasync def lookup(value: str = Path(..., min_length=1, max_length=64),\n                 session: AsyncSession = Depends(get_session)):\n    stmt = select(${table[0]?.toUpperCase()}${table.slice(1)}).where(${table[0]?.toUpperCase()}${table.slice(1)}.${column} == value)\n    rows = (await session.execute(stmt)).scalars().all()\n    if not rows:\n        raise HTTPException(status_code=404, detail="Not found")\n    return rows\n`;
      } else remediated = '# Automatic ORM conversion unavailable for this query shape.\n# Replace interpolation with bound parameters; review schema and behavior.\n' + input;
    }
  } else if (environment === 'Cisco IOS CLI') {
    lines.forEach((line, i) => {
      if (/^\s*transport input (?:.*\s)?(?:telnet|all)\b/i.test(line)) add('TELNET', i + 1, 'Unencrypted remote access', NET_COMPLIANCE, 'CRITICAL');
      if (/^\s*(switchport (?:access|trunk native) vlan 1|interface vlan\s*1)\s*$/i.test(line)) add('VLAN1', i + 1, 'Default VLAN 1 exposed', NET_COMPLIANCE);
    });
    const blocks = input.split(/(?=^interface\s)/m);
    for (const block of blocks) if (/^interface\s+(?!vlan)/i.test(block) && /switchport mode access/i.test(block) && !/^\s*switchport port-security\s*$/im.test(block)) {
      const pos = input.indexOf(block); add('PORT_SECURITY', input.slice(0, pos).split('\n').length, 'Access port has no MAC protection', 'CIS Cisco IOS access-port control');
    }
    const out: string[] = ['! Review management connectivity and provision unique secrets before applying.', 'configure terminal', 'vlan 10', ' name USERS_SECURE', 'vlan 999', ' name BLACKHOLE_NATIVE', 'exit'];
    let inAccess = false, inVlan1 = false;
    const close = () => { if (inAccess) out.push(' switchport port-security', ' switchport port-security maximum 2', ' switchport port-security mac-address sticky', ' switchport port-security violation shutdown'); inAccess = false; };
    lines.forEach(line => {
      const t = line.trim();
      if (/^(interface|line|end|!)\b/.test(t) || t === '!') close();
      if (/^interface/i.test(t)) inVlan1 = /^interface vlan\s*1$/i.test(t);
      if (/^(line|end)$/i.test(t) || /^line\s/i.test(t)) inVlan1 = false;
      if (t === 'end' || t === 'configure terminal' || /^enable password|^username .*secret|^password\s/.test(t)) return;
      if (inVlan1 && /^ip address|^no shutdown/.test(t)) return;
      if (inVlan1 && /^interface/i.test(t)) { out.push(line, ' no ip address', ' shutdown'); return; }
      if (/switchport mode access/i.test(t)) inAccess = true;
      if (/^switchport port-security/.test(t)) return;
      if (/^switchport access vlan 1$/.test(t)) { out.push(' switchport access vlan 10'); return; }
      if (/^switchport trunk native vlan 1$/.test(t)) { out.push(' switchport trunk native vlan 999'); return; }
      if (/^transport input/.test(t)) { out.push(' transport input ssh'); return; }
      if (/^login$/.test(t)) { out.push(' login local'); return; }
      if (/^no service password-encryption/.test(t)) return;
      out.push(line);
    }); close();
    out.push('service password-encryption', '! Set hostname / domain-name and unique enable secret / local username separately.', 'ip ssh version 2', 'crypto key generate rsa general-keys modulus 2048', 'end');
    remediated = out.join('\n');
    structure.push(...lines.filter(l => /^interface|^line|^hostname/.test(l)));
  } else if (environment === 'Terraform AWS VPC') {
    const ingress = /ingress\s*\{[\s\S]*?\}/g;
    remediated = input.replace(ingress, block => {
      if (/0\.0\.0\.0\/0|::\/0/.test(block)) {
        const from = Number(block.match(/from_port\s*=\s*(\d+)/)?.[1] ?? -1); const to = Number(block.match(/to_port\s*=\s*(\d+)/)?.[1] ?? from);
        if ((from <= 22 && to >= 22) || (from <= 80 && to >= 80) || /protocol\s*=\s*"-1"/.test(block)) {
          add('PUBLIC_INGRESS', input.slice(0, input.indexOf(block)).split('\n').length, 'Public security-group ports 22/80', 'SOC2 CC6.1 · NIST SC-7');
          return '# Public ingress removed. Add an approved private CIDR rule.';
        }
      }
      return block;
    });
    remediated = remediated.replace(/encrypted\s*=\s*false/g, (value, offset: number) => { add('STORAGE', input.slice(0, offset).split('\n').length, 'Unencrypted storage', 'SOC2 CC6.1 · NIST SC-28'); return 'encrypted = true'; });
    structure.push(...lines.filter(l => /^resource\s/.test(l)));
  } else {
    lines.forEach((line, i) => { if (/privileged:\s*true|docker\.sock|["']?80:/.test(line)) add('CONTAINER', i + 1, 'Privileged container or public endpoint', 'CIS Docker Benchmark · NIST SC-7'); });
    remediated = input.replace(/privileged:\s*true/g, 'privileged: false').replace(/["']80:(\d+)["']/g, '"127.0.0.1:80:$1"');
    // A docker socket mount cannot be made safe by changing its permissions.
    remediated = remediated.split('\n').filter(l => !l.includes('docker.sock')).join('\n');
    if (/volumes:\s*\[[^\]]*docker\.sock/.test(input)) remediated += '\n# Removed Docker socket mount; configure approved application volumes separately.';
    structure.push(...lines.filter(l => /^\s{2}\w+:/.test(l)));
  }
  const tests = `# Generated assertions, not executed by this browser playground.\n# Save source as input.txt and run: pytest test_swarmsec.py\nfrom pathlib import Path\nimport pytest\n\nSOURCE = Path("input.txt").read_text()\n\n@pytest.mark.parametrize("unsafe_line", ${JSON.stringify(findings.map(f => lines[f.line - 1]?.trim() ?? ''))})\ndef test_detected_unsafe_lines_removed(unsafe_line):\n    assert unsafe_line not in SOURCE, "Detected unsafe source remains"\n`;
  return { environment, findings, sourceLines: lines.length, structure, tests, remediated, generatedAt: new Date().toISOString(), elapsedMs: performance.now() - start, input };
}
export const SECURITY_WORKFLOW = `name: SWARM-SEC Security Gate\non:\n  pull_request:\n  push:\n    branches: [main]\npermissions:\n  contents: read\njobs:\n  security-gate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: '3.12'\n      - name: Block unsafe SQL and unhardened Cisco configurations\n        shell: bash\n        run: |\n          python - <<'PY'\n          import ast, pathlib, re, sys\n          problems = []\n          for path in pathlib.Path('.').rglob('*'):\n              if any(p in ('.git', 'node_modules', '.venv', 'venv') for p in path.parts):\n                  continue\n              if path.suffix == '.py':\n                  try:\n                      tree = ast.parse(path.read_text())\n                  except (SyntaxError, UnicodeError) as exc:\n                      problems.append(str(path) + ': Python parse failure')\n                      continue\n                  dynamic = set()\n                  def unsafe(node):\n                      return any(isinstance(n, (ast.JoinedStr, ast.BinOp)) or (isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) and n.func.attr == 'format') for n in ast.walk(node))\n                  for node in ast.walk(tree):\n                      if isinstance(node, ast.Assign) and unsafe(node.value):\n                          dynamic.update(t.id for t in node.targets if isinstance(t, ast.Name))\n                  for node in ast.walk(tree):\n                      if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr in ('execute', 'executemany') and node.args:\n                          arg = node.args[0]\n                          if unsafe(arg) or (isinstance(arg, ast.Name) and arg.id in dynamic):\n                              problems.append(f'{path}:{node.lineno}: CWE-89 dynamic SQL')\n              elif path.suffix in ('.cfg', '.conf', '.txt', '.ios'):\n                  try:\n                      text = path.read_text()\n                  except UnicodeError:\n                      continue\n                  if not re.search(r'^\\s*(interface|hostname|line vty)\\b', text, re.M):\n                      continue\n                  if re.search(r'transport input.*(?:telnet|all)|switchport (?:access|trunk native) vlan 1\\s*$|interface Vlan1\\s*\\n\\s*ip address', text, re.I | re.M):\n                      problems.append(str(path) + ': insecure Telnet / VLAN 1')\n                  if not re.search(r'^\\s*ip ssh version 2\\s*$', text, re.M):\n                      problems.append(str(path) + ': SSH v2 absent')\n                  for block in re.split(r'(?=^interface\\s)', text, flags=re.M):\n                      if 'switchport mode access' in block and not re.search(r'^\\s*switchport port-security\\s*$', block, re.M):\n                          problems.append(str(path) + ': port security absent')\n          print('\\n'.join(problems) if problems else 'SWARM-SEC gate passed')\n          sys.exit(1 if problems else 0)\n          PY\n`;
