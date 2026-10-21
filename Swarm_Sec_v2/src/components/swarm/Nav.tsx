import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AGENTS } from "@/lib/swarm-data";

const linkCls = "rounded-sm px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground";
const activeCls = { className: "bg-secondary text-foreground shadow-[inset_0_-2px_0_var(--primary)]" };

export function Nav() {
  const { user } = useAccount();
  const navigate = useNavigate(); const qc = useQueryClient();
  const [accountOpen, setAccountOpen] = useState(false);
  const profile = useQuery({ queryKey: ["profile", user?.id], enabled: Boolean(user), queryFn: async () => { if (!user) return null; return (await supabase.from("profiles").select("display_name, avatar_url").eq("id", user.id).single()).data; } });
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-mono text-sm font-bold tracking-wider">SWARM-SEC</span>
          <span className="hidden text-xs text-muted-foreground 2xl:inline">| Autonomous AppSec + NetSecOps Engine</span>
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[10px] text-success 2xl:flex">
          <span className="dot-live" /> IBM Bob Multi-Agent Core v2.0 - ACTIVE
        </span>
        <Button className="ml-auto md:hidden" onClick={() => setMobile(!mobile)} aria-label="Menu"><Menu /></Button>
        <nav className={`${mobile ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col border-b bg-background p-3 md:static md:ml-auto md:flex md:flex-row md:border-0 md:bg-transparent md:p-0`}>
          <Link to="/" activeOptions={{ exact: true }} activeProps={activeCls} className={linkCls} onClick={() => setMobile(false)}>Home</Link>
          <div className="relative" onMouseLeave={() => setOpen(false)}>
            <Button className={`${linkCls} flex items-center gap-1`} onClick={() => setOpen(!open)} onMouseEnter={() => setOpen(true)}>
              Agent Workspaces <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            {open && (
              <div className="glass absolute left-0 top-full z-50 w-80 rounded-md p-1 fade-up md:right-0 md:left-auto">
                {AGENTS.map((a) => (
                  <Link key={a.id} to="/agents/$agentId" params={{ agentId: a.id }} onClick={() => { setOpen(false); setMobile(false); }}
                    className="flex items-start gap-3 rounded-sm px-3 py-2 hover:bg-accent" activeProps={{ className: "bg-accent" }}>
                    <span className="mt-0.5 font-mono text-xs text-primary">A{a.id}</span>
                    <span><span className="block text-sm">{a.name}</span></span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/orchestrator" activeProps={activeCls} className={linkCls} onClick={() => setMobile(false)}>Orchestrator</Link>
          <Link to="/team" activeProps={activeCls} className={linkCls} onClick={() => setMobile(false)}>Team</Link>
          <Link to="/contact" activeProps={activeCls} className={linkCls} onClick={() => setMobile(false)}>Contact</Link>
        </nav>
        <div className="relative">
          {user ? <Button variant="outline" onClick={() => setAccountOpen(!accountOpen)} aria-label="User profile menu">{profile.data?.avatar_url && <img src={profile.data.avatar_url} alt="" className="h-6 w-6 rounded-full" />}<span className="max-w-24 truncate">{profile.data?.display_name || "My Profile"}</span><ChevronDown /></Button> : <Button asChild size="sm"><Link to="/auth">Sign In / Register</Link></Button>}
          {user && accountOpen && <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded border bg-popover p-2"><Link to="/saved-audits" className="block p-3 text-sm hover:bg-accent" onClick={() => setAccountOpen(false)}>My Saved Security Audits</Link><Link to="/privacy-settings" className="block p-3 text-sm hover:bg-accent" onClick={() => setAccountOpen(false)}>Privacy Settings</Link><Button variant="ghost" className="w-full justify-start" onClick={async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); setAccountOpen(false); await navigate({ to: "/auth", replace: true }); }}>Logout</Button></div>}
        </div>
      </div>
    </header>
  );
}
