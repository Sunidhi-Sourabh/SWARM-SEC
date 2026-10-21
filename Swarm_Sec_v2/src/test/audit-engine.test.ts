import { describe, expect, it } from 'vitest';
import { PRESETS, runAudit, SECURITY_WORKFLOW } from '@/lib/audit-engine';
import { contactSchema } from '@/lib/contact-schema';
import { parse } from 'yaml';
describe('Requested sandbox security rules', () => {
 it('detects concatenated SQL as CWE-89 with SOC2 and ISO mapping', () => { const r = runAudit(PRESETS.Python, 'Python'); expect(r.findings.some(f => f.code === 'CWE-89' && f.compliance.includes('SOC2 CC6.1') && f.compliance.includes('ISO 27001 A.14.2'))).toBe(true); expect(r.remediated).toContain('Users.username == value'); });
 it('does not flag bound SQL parameter calls', () => { expect(runAudit('cursor.execute("SELECT * FROM users WHERE username = ?", (username,))', 'Python').findings).toHaveLength(0); });
 it('finds Telnet and migrates VLAN 1 to VLAN 10, SSH v2 and port security', () => { const r = runAudit(PRESETS['Cisco IOS CLI'], 'Cisco IOS CLI'); expect(r.findings.some(f => f.code === 'TELNET' && f.compliance.includes('NIST SP 800-53 SC-8'))).toBe(true); expect(r.remediated).toContain('switchport access vlan 10'); expect(r.remediated).toContain('ip ssh version 2'); expect(r.remediated).toContain('switchport port-security'); expect(r.remediated).not.toContain('transport input telnet'); });
 it('closes publicly exposed AWS ports 22/80 and encrypts storage', () => { const r = runAudit(PRESETS['Terraform AWS VPC'], 'Terraform AWS VPC'); expect(r.findings.some(f => f.code === 'PUBLIC_INGRESS')).toBe(true); expect(r.remediated).not.toContain('0.0.0.0/0'); expect(r.remediated).toContain('encrypted = true'); });
 it('removes privileged Docker mode and socket mounts', () => { const r = runAudit(PRESETS['Docker Compose'], 'Docker Compose'); expect(r.remediated).toContain('privileged: false'); expect(r.remediated).toContain('127.0.0.1:80:8000'); expect(r.remediated).not.toContain('/var/run/docker.sock'); });
 it('generates a PR-blocking GitHub security gate', () => { const workflow = parse(SECURITY_WORKFLOW); expect(workflow.on).toHaveProperty('pull_request'); expect(workflow.jobs['security-gate'].steps.at(-1).run).toContain('sys.exit(1 if problems else 0)'); });
 it('bounds submitted inquiry text', () => { const base = { name: 'Tester', org: '', email: 'test@example.com', subject: 'Test', type: 'Security Audit Request', message: 'a'.repeat(2000) }; expect(contactSchema.safeParse(base).success).toBe(true); expect(contactSchema.safeParse({ ...base, message: 'a'.repeat(2001) }).success).toBe(false); });
});
