import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { SectionTitle } from "@/components/swarm/ui";
import { AGENTS, PIPELINE_LOGS } from "@/lib/swarm-data";
import { Playground } from "@/components/swarm/Playground";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orchestrator")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Live Pipeline Orchestrator — SWARM-SEC" },
      { name: "description", content: "Watch all six IBM Bob agents execute the SWARM-SEC pipeline in real time." },
      { property: "og:title", content: "Live Pipeline Orchestrator — SWARM-SEC" },
      { property: "og:description", content: "Streaming execution logs from AST parsing to Cisco IOS hardening." },
    ],
  }),
  component: Orchestrator,
});

const kindCls = { cmd: "text-cyan", ok: "text-success", err: "text-destructive", warn: "text-warning" } as const;

function Orchestrator() {
  const [n, setN] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!playing || n >= PIPELINE_LOGS.length) return;
    const t = setTimeout(() => setN((x) => x + 1), 550);
    return () => clearTimeout(t);
  }, [n, playing]);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [n]);
  const current = n === 0 ? 0 : PIPELINE_LOGS[Math.min(n, PIPELINE_LOGS.length) - 1]?.agent ?? 0;
  const done = n >= PIPELINE_LOGS.length;
  const status = (i: number) => (done || i < current ? "done" : i === current && n > 0 ? "active" : "idle");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle eyebrow="IBM Bob Agentic Workflow" title="Live Pipeline Orchestrator Terminal" />
      <Playground />
      <h2 className="mb-4 text-xl">Reference Pipeline Replay</h2>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {AGENTS.map((a, i) => {
          const s = status(i);
          return (
            <div key={a.id} className={cn("glass rounded-md p-3 transition", s === "active" && "glow border-primary", s === "done" && "border-success/40")}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary">AGENT {a.id}</span>
                <span className={cn("h-2 w-2 rounded-full", s === "done" ? "bg-success" : s === "active" ? "dot-live" : "bg-muted-foreground/40")} />
              </div>
              <p className="mt-1 text-sm">{a.short}</p>
              <p className={cn("mt-1 font-mono text-[10px] uppercase", s === "done" ? "text-success" : s === "active" ? "text-primary" : "text-muted-foreground")}>{s === "done" ? "complete" : s === "active" ? "running…" : "queued"}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(n / PIPELINE_LOGS.length) * 100}%` }} /></div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-terminal">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">bob@swarm-sec:~/pipeline</span>
          <div className="flex gap-2">
            <button onClick={() => setPlaying(!playing)} className="rounded-sm border p-1.5 hover:border-primary" aria-label="Play/Pause">{playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</button>
            <button onClick={() => { setN(0); setPlaying(true); }} className="rounded-sm border p-1.5 hover:border-primary" aria-label="Restart"><RotateCcw className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        <div ref={ref} className="h-[460px] overflow-auto p-4 font-mono text-[13px] leading-relaxed">
          {PIPELINE_LOGS.slice(0, n).map((l, i) => (
            <p key={i} className={cn("fade-up", l.kind && kindCls[l.kind])}>
              <span className="text-muted-foreground/60">[A{l.agent}] </span>{l.line}
            </p>
          ))}
          {!done && <span className="inline-block h-4 w-2 animate-pulse bg-primary" />}
        </div>
      </div>
    </div>
  );
}
