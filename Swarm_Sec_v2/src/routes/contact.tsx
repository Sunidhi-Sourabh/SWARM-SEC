import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BookOpen, Github, Send, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { submitInquiry } from "@/lib/contact.functions";
import { contactSchema as schema } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/swarm/ui";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact & Feedback — SWARM-SEC" },
      { name: "description", content: "Request a security audit, partnership, or share feedback with the SWARM-SEC team." },
      { property: "og:title", content: "Contact & Feedback — SWARM-SEC" },
      { property: "og:description", content: "Enterprise inquiries and security audit requests." },
    ],
  }),
  component: Contact,
});

const field = "w-full rounded-sm border bg-input/40 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const send = useServerFn(submitInquiry);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(data);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    const form = e.currentTarget;
    setBusy(true);
    try {
      const result = await send({ data: r.data });
      form.reset();
      if (result.sent) toast.success("Inquiry Received! Sent to sunidhi11s.gdg@gmail.com. Our SecOps team will reach out shortly.");
      else toast.warning("Inquiry saved. Email delivery is not configured correctly; your message remains available to Team Innovatrix.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Submission failed. Please try again."); }
    finally { setBusy(false); }
  };
  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle eyebrow="Contact" title="Enterprise Inquiry & Feedback" sub="Request a security audit, explore a partnership, or tell us what you think." />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
            <div><label htmlFor="contact-name" className="mb-1 block text-xs text-muted-foreground">Full Name</label><input id="contact-name" name="name" className={field} />{err("name")}</div>
            <div><label htmlFor="contact-org" className="mb-1 block text-xs text-muted-foreground">Organization / Institution</label><input id="contact-org" name="org" className={field} /></div>
            <div><label htmlFor="contact-email" className="mb-1 block text-xs text-muted-foreground">Email</label><input id="contact-email" name="email" type="email" className={field} />{err("email")}</div>
            <div><label htmlFor="contact-subject" className="mb-1 block text-xs text-muted-foreground">Subject</label><input id="contact-subject" name="subject" className={field} />{err("subject")}</div>
            <div className="sm:col-span-2"><label htmlFor="contact-type" className="mb-1 block text-xs text-muted-foreground">Query Type</label>
              <select id="contact-type" name="type" className={field}>
                <option>Security Audit Request</option><option>Partnership / IBM Integration</option><option>Product Feedback</option><option>Research Collaboration</option>
              </select>
            </div>
            <div className="sm:col-span-2"><label htmlFor="contact-message" className="mb-1 block text-xs text-muted-foreground">Message</label><textarea id="contact-message" name="message" rows={6} className={field} />{err("message")}</div>
            <Button disabled={busy} className="glow inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110 sm:col-span-2">
              {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {busy ? "Submitting…" : "Submit Security Audit Inquiry"}
            </Button>
          </form>
        </Card>
        <div className="space-y-3">
          {[
            [Github, "GitHub Repository", "Source, agents & notebooks", "https://github.com/Sunidhi-Sourabh/SWARM-SEC"],
            [BookOpen, "Documentation Hub", "Architecture, cost model, roadmap", "https://github.com/Sunidhi-Sourabh/SWARM-SEC#readme"],
          ].map(([Icon, t, d, href]) => {
            const I = Icon as typeof Github;
            return (
              <a key={t as string} href={href as string} target="_blank" rel="noreferrer" className="glass flex items-center gap-4 rounded-lg p-4 transition hover:border-primary/60">
                <I className="h-6 w-6 text-primary" />
                <span><span className="block text-sm font-medium">{t as string}</span><span className="block text-xs text-muted-foreground">{d as string}</span></span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
