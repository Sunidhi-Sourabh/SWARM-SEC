import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-lg p-5 fade-up", className)}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
      <h1 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">{title}</h1>
      {sub && <p className="mt-3 max-w-3xl text-muted-foreground">{sub}</p>}
    </div>
  );
}

const sevStyles: Record<string, string> = {
  CRITICAL: "bg-destructive/15 text-destructive border-destructive/40",
  HIGH: "bg-warning/15 text-warning border-warning/40",
  MEDIUM: "bg-cyan/15 text-cyan border-cyan/40",
  PASS: "bg-success/15 text-success border-success/40",
};
export function Badge({ level, children }: { level: string; children?: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold", sevStyles[level] ?? sevStyles["MEDIUM"])}>
      {children ?? level}
    </span>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-sm border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {label}
    </button>
  );
}

export function CodePane({ title, code, tone, action }: { title: string; code: string; tone?: "bad" | "good"; action?: ReactNode }) {
  const lines = code.split("\n");
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-terminal", tone === "bad" && "border-destructive/40", tone === "good" && "border-success/40")}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className={cn("h-2 w-2 rounded-full", tone === "bad" ? "bg-destructive" : tone === "good" ? "bg-success" : "bg-primary")} />
          {title}
        </span>
        {action ?? <CopyButton text={code} />}
      </div>
      <pre className="max-h-[520px] overflow-auto p-4 font-mono text-[12.5px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className="flex">
            <span className="w-8 shrink-0 select-none pr-3 text-right text-muted-foreground/50">{i + 1}</span>
            <span className={cn(l.includes("❌") || /\+ username/.test(l) ? "text-destructive" : l.includes("✅") ? "text-success" : l.trim().startsWith("#") || l.trim().startsWith("!") ? "text-muted-foreground" : "")}>{l || " "}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-primary" />
      <p className="font-mono text-3xl font-semibold text-primary">{value}</p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
}
