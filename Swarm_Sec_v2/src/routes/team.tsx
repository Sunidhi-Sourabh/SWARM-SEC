import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Trophy, Globe } from "lucide-react";
import { Card, SectionTitle } from "@/components/swarm/ui";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Team Innovatrix — SWARM-SEC Founders" },
      { name: "description", content: "Meet Sunidhi Sourabh and Sanvi Jain, founders of SWARM-SEC." },
      { property: "og:title", content: "Team Innovatrix — SWARM-SEC Founders" },
      { property: "og:description", content: "Top 25 Regional Finalists — IBM SkillsBuild & HackIndia Spark-12." },
    ],
  }),
  component: Team,
});

const founders = [
  { name: "Sunidhi Sourabh", initials: "SS", role: "Founder & Lead Architect",
    contrib: "B.Tech CSE student, AI Builder, and IEEE Student Leader. Sunidhi conceptually architected SWARM-SEC from the ground up—designing the 6-agent orchestration framework and leveraging Gemini & IBM Bob to build zero-token AST parsing and automated security refactoring pipelines. She brings rich technical exposure spanning Region 10 (IEEEXtreme 20.0 Media Volunteer), IEEE Delhi Section, IEEE ComSoc Engineer Intern, and 25+ Industry credentials across Google Cloud, AWS, IBM, Cisco (CCNA ITN & SRWE), and Goldman Sachs.",
    links: [[Linkedin, "https://www.linkedin.com/in/sunidhi-sourabh-6745063a1", "LinkedIn"], [Github, "https://github.com/Sunidhi-Sourabh", "GitHub"], [Globe, "https://sunidhisourabh.blog", "Personal Blog"]] },
  { name: "Sanvi Jain", initials: "SJ", role: "Co-Founder & Operations Lead",
    contrib: "B.Tech CSE student, Finance Executive at IEEE WIE, and Salesforce & GDG Core Member. Sanvi brings technical expertise backed by Cisco CCNA ITN & SRWE credentials. She spearheaded GitHub repository management, code integration via Copilot, and hackathon compliance. She actively gathers real enterprise and industry insights to align SWARM-SEC with market demands, manages official submissions, coordinates directly with project mentors, leads pitch presentations, and serves as the operational backbone during late-night hackathon sprints.",
    links: [[Linkedin, "https://www.linkedin.com/in/sanvi-jain-bb14873b5/", "LinkedIn"], [Github, "https://github.com/Sanvijain07", "GitHub"]] },
];

function Team() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionTitle eyebrow="Founders" title="Meet Team Innovatrix" />
      <div className="glow mb-8 flex items-center gap-3 rounded-md border border-primary/50 bg-primary/10 p-4">
        <Trophy className="h-5 w-5 text-warning" />
        <span className="font-medium">Top 25 Regional Finalists — IBM SkillsBuild &amp; HackIndia Spark-12</span>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {founders.map((f) => (
          <Card key={f.name} className="transition hover:border-primary/60">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-mono text-xl font-semibold text-primary-foreground">{f.initials}</div>
              <div><h3 className="text-lg font-semibold">{f.name}</h3><p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-primary">{f.role}</p></div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{f.contrib}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {f.links.map(([Icon, href, label]) => {
                const I = Icon as typeof Github;
                return (
                  <a key={label as string} href={href as string} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs transition hover:border-primary hover:text-primary">
                    <I className="h-3.5 w-3.5" /> {label as string}
                  </a>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
