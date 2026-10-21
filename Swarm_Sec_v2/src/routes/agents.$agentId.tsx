import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Zap } from "lucide-react";
import { Badge, Card, CodePane, CopyButton, SectionTitle } from "@/components/swarm/ui";
import { AGENTS, EXPLOIT_TESTS, HARDENED_NETWORK, NET_FINDINGS, PARITY_TESTS, RAW_NETWORK, SECURE_CODE } from "@/lib/swarm-data";
import astSchema from "@/data/ast_schema.json";
import report from "@/data/vulnerability_report.json";
import vulnCode from "@/data/vulnerable_example.py.txt?raw";
import { Playground } from "@/components/swarm/Playground";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agents/$agentId")({
  loader: ({ params }) => {
    const agent = AGENTS.find((a) => a.id === params.agentId);
    if (!agent) throw notFound();
    return { agent };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `Agent ${loaderData.agent.id}: ${loaderData.agent.name} — SWARM-SEC` : "Agent workspace — SWARM-SEC";
    const d = loaderData?.agent.role ?? "SWARM-SEC agent workspace";
    return { meta: [{ property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: AgentPage,
});

function AgentPage() {
  const { agent } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap gap-2">
        {AGENTS.map((a) => (
          <Link key={a.id} to="/agents/$agentId" params={{ agentId: a.id }}
            className="rounded-sm border px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "border-primary bg-primary/15 text-primary" }}>
            A{a.id} · {a.short}
          </Link>
        ))}
      </div>
      <div key={agent.id} className="fade-up">
        <SectionTitle eyebrow={`Agent ${agent.id} Workspace`} title={agent.name}  />
        <Playground />
        <h2 className="mb-5 text-xl text-muted-foreground">Reference Project Artifacts</h2>
        {agent.id === "0" && <Agent0 />}
        {agent.id === "1" && <Agent1 />}
        {agent.id === "2" && <Agent2 />}
        {agent.id === "3" && <Agent3 />}
        {agent.id === "4" && <Agent4 />}
        {agent.id === "5" && <Agent5 />}
      </div>
    </div>
  );
}

function Agent0() {
  const json = JSON.stringify(astSchema, null, 2);
  const fn = astSchema.functions[0];
  if (!fn) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Card><p className="font-mono text-2xl text-success">0</p><p className="text-xs text-muted-foreground">LLM tokens</p></Card>
          <Card><p className="font-mono text-2xl text-primary">4.2ms</p><p className="text-xs text-muted-foreground">parse time</p></Card>
          <Card><p className="font-mono text-2xl text-warning">{astSchema.raw_sql_patterns.length}</p><p className="text-xs text-muted-foreground">raw SQL hits</p></Card>
        </div>
        <Card>
          <p className="mb-3 font-mono text-xs text-muted-foreground">STRUCTURAL MAP · {astSchema.source_file}</p>
          <div className="font-mono text-sm">
            <p>📦 module</p>
            <p className="ml-4">↳ import <span className="text-cyan">{astSchema.imports.join(", ")}</span></p>
            <p className="ml-4">↳ def <span className="text-primary">{fn.name}</span>({fn.args.join(", ")}) <span className="text-muted-foreground">L{fn.lineno}</span></p>
            {fn.calls.map((c) => <p key={c} className="ml-10 text-muted-foreground">· call {c}()</p>)}
            {astSchema.raw_sql_patterns.map((p) => (
              <p key={p.lineno} className="ml-10 text-destructive">⚠ raw SQL L{p.lineno}: {p.snippet}</p>
            ))}
          </div>
        </Card>
      </div>
      <CodePane title="ast_schema.json" code={json} />
    </div>
  );
}

function Agent1() {
  const [sel, setSel] = useState(report.vulnerabilities[0]?.id ?? "");
  const v = report.vulnerabilities.find((x) => x.id === sel);
  if (!v) return null;
  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center gap-6">
        <span className="text-sm">{report.audit_summary}</span>
        <span className="font-mono text-xs text-muted-foreground">Scanned: {report.total_functions_scanned} fn · Vulnerable: {report.vulnerable_function_count}</span>
      </Card>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left font-mono text-xs text-muted-foreground">
            <tr><th className="p-3">ID</th><th className="p-3">CWE</th><th className="p-3">OWASP</th><th className="p-3">Severity</th><th className="p-3">CVSS v3.1</th><th className="p-3">Line</th></tr>
          </thead>
          <tbody>
            {report.vulnerabilities.map((x) => (
              <tr key={x.id} onClick={() => setSel(x.id)} className={cn("cursor-pointer border-t transition hover:bg-accent/40", sel === x.id && "bg-accent/60")}>
                <td className="p-3 font-mono">{x.id}</td>
                <td className="p-3">{x.cwe.split(":")[0]}</td>
                <td className="p-3 text-muted-foreground">{x.owasp_category}</td>
                <td className="p-3"><Badge level={x.severity} /></td>
                <td className="p-3">
                  <div className="flex items-center gap-2"><span className="w-8 font-mono">{x.cvss_score}</span>
                    <div className="h-1.5 w-24 rounded bg-muted"><div className={cn("h-full rounded", x.cvss_score >= 9 ? "bg-destructive" : x.cvss_score >= 7 ? "bg-warning" : "bg-cyan")} style={{ width: `${x.cvss_score * 10}%` }} /></div>
                  </div>
                </td>
                <td className="p-3 font-mono">L{x.lineno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card key={v.id}>
          <div className="flex items-center gap-2"><Badge level={v.severity} /><span className="font-mono text-sm">{v.id}</span></div>
          <h3 className="mt-3 font-semibold">{v.cwe}</h3>
          {v.cwe.includes("89") && <p className="mt-2 text-xs text-warning">Non-Compliant with SOC2 CC6.1 &amp; ISO 27001 A.14.2</p>}
          <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
          <p className="mt-4 font-mono text-xs text-primary">REMEDIATION</p>
          <p className="mt-1 text-sm">{v.remediation.strategy}</p>
          {"evidence" in v && v.evidence && (
            <pre className="mt-4 overflow-auto rounded bg-terminal p-3 font-mono text-xs">{JSON.stringify(v.evidence, null, 2)}</pre>
          )}
        </Card>
        <CodePane title={`${report.source_file} · alert L${v.lineno}`} code={vulnCode.trim()} tone="bad" />
      </div>
    </div>
  );
}

function Agent2() {
  const [ran, setRan] = useState(0);
  const [running, setRunning] = useState(false);
  const run = () => {
    setRan(0); setRunning(true);
    let i = 0;
    const t = setInterval(() => { i++; setRan(i); if (i >= EXPLOIT_TESTS.length) { clearInterval(t); setRunning(false); } }, 260);
  };
  useEffect(() => { run(); }, []);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button onClick={run} disabled={running} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
          <Play className="h-4 w-4" /> Re-run against legacy code
        </button>
        <span className="font-mono text-sm">{ran}/{EXPLOIT_TESTS.length} PoC tests executed · <span className="text-destructive">{ran} failed</span> (exploit confirmed)</span>
      </div>
      <div className="rounded-lg border bg-terminal p-4 font-mono text-[13px]">
        <p className="text-muted-foreground">$ pytest dev/tests/test_exploit.py dev/tests/test_exploit_poc.py -v</p>
        {EXPLOIT_TESTS.slice(0, ran).map((t) => (
          <div key={t.name} className="fade-up mt-1 flex flex-wrap gap-x-3">
            <span className="text-destructive">FAILED</span>
            <span>{t.cls}::{t.name}</span>
            <span className="text-muted-foreground">payload={t.payload}</span>
          </div>
        ))}
        {ran === EXPLOIT_TESTS.length && <p className="mt-3 text-warning">========= 9 failed in 0.21s — legacy code is EXPLOITABLE =========</p>}
      </div>
    </div>
  );
}

function Agent3() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {["FastAPI async", "SQLAlchemy 2.0 ORM", "Pydantic v2", "Dependency-injected session", "Regex-validated path param"].map((t) => <Badge key={t} level="PASS">{t}</Badge>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CodePane title="LEGACY · vulnerable_example.py" code={vulnCode.trim()} tone="bad" />
        <CodePane title="SECURE · app/routers/users.py" code={SECURE_CODE} tone="good" />
      </div>
    </div>
  );
}

const FLOW = [
  { id: "src", label: "Legacy Monolith", sub: "vulnerable_example.py" },
  { id: "a0", label: "A0 · AST Parser", sub: "ast_schema.json" },
  { id: "a1", label: "A1 · SAST Auditor", sub: "vulnerability_report.json" },
  { id: "a2", label: "A2 · Exploit Sim", sub: "9 failing PoCs" },
  { id: "a3", label: "A3 · Refactor Arch", sub: "FastAPI + ORM" },
  { id: "a4", label: "A4 · QA Verifier", sub: "20 passed" },
  { id: "a5", label: "A5 · NetSec Cisco", sub: "hardened IOS" },
  { id: "out", label: "Zero-Trust Service", sub: "CVSS 0.0" },
];

function Agent4() {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive((a) => (a + 1) % FLOW.length), 1100); return () => clearInterval(t); }, []);
  return (
    <div className="space-y-6">
      <Card>
        <p className="mb-4 font-mono text-xs text-muted-foreground">graph TD · refactoring lifecycle (click a node)</p>
        <div className="flex flex-wrap items-center gap-2">
          {FLOW.map((n, i) => (
            <div key={n.id} className="flex items-center gap-2">
              <button onClick={() => setActive(i)} className={cn("rounded-md border px-3 py-2 text-left transition", i === active ? "glow border-primary bg-primary/20" : i < active ? "border-success/50" : "")}>
                <span className="block text-sm font-medium">{n.label}</span>
                <span className="block font-mono text-[10px] text-muted-foreground">{n.sub}</span>
              </button>
              {i < FLOW.length - 1 && <span className={cn("font-mono", i < active ? "text-success" : "text-muted-foreground")}>→</span>}
            </div>
          ))}
        </div>
      </Card>
      <div className="rounded-lg border bg-terminal p-4 font-mono text-[13px]">
        <p className="text-muted-foreground">$ pytest dev/tests/test_secure_parity.py -v</p>
        {PARITY_TESTS.map((t) => (
          <p key={t} className="mt-0.5"><span className="text-success">PASSED</span> test_secure_parity.py::{t}</p>
        ))}
        <p className="mt-3 text-success">========================= 20 passed in 0.38s =========================</p>
      </div>
    </div>
  );
}

function Agent5() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-5">
        {NET_FINDINGS.map((f) => (
          <Card key={f.issue} className="p-4">
            <Badge level={f.sev} />
            <p className="mt-2 text-sm font-medium">{f.issue}</p>
            {/Telnet|VLAN/.test(f.issue) && <p className="mt-2 text-xs text-warning">Violates NIST SP 800-53 SC-8 (Transmission Confidentiality)</p>}
            <p className="mt-2 flex gap-1 text-xs text-success"><Zap className="h-3 w-3 shrink-0" />{f.fix}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CodePane title="network_config.txt (raw)" code={RAW_NETWORK} tone="bad" />
        <CodePane title="hardened_network_config.txt" code={HARDENED_NETWORK} tone="good"
          action={<CopyButton text={HARDENED_NETWORK.split("\n").filter((l) => !l.startsWith("!")).join("\n")} label="Copy Cisco CLI Script" />} />
      </div>
      <p className="text-xs text-muted-foreground">Paste into Packet Tracer: <span className="font-mono">enable → configure terminal</span>, then paste the script.</p>
    </div>
  );
}
