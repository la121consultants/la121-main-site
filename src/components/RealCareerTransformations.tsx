import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Compass, Rocket, Sparkles, Trophy, ShieldCheck } from "lucide-react";

const caseStudies = [
  {
    title: "From Burnout to Brand Strategist",
    client: "Amelia, Fintech Product Manager",
    challenge:
      "After a layoff, Amelia had three conflicting versions of her story and no portfolio proof of her impact, leaving her anxious about re-entering leadership roles.",
    solution:
      "We hosted a narrative-clarity intensive, rebuilt her portfolio with before/after product launch visuals, and rehearsed strategic storytelling with AI-powered mock interviews.",
    result: "4 senior-brand interviews in 14 days and a renewed sense of executive presence.",
    accent: "from-primary/20 via-primary/5 to-transparent",
    Icon: Rocket,
    badge: "VP Track"
  },
  {
    title: "Career Switcher to UX Lead",
    client: "Noah, Ex-teacher Turned Designer",
    challenge:
      "Noah's CV sounded academic, his case studies felt like lesson plans, and he froze when recruiters asked for measurable impact.",
    solution:
      "Our consultants built a storytelling grid, layered in design metrics, and produced a clickable portfolio with recruiter-ready talking points.",
    result: "3 UX lead interviews secured plus a 40% salary lift offer within 6 weeks.",
    accent: "from-secondary/20 via-secondary/5 to-transparent",
    Icon: Compass,
    badge: "Career Pivot"
  },
  {
    title: "Confidence Reset for a Global Analyst",
    client: "Priya, Emerging Markets Analyst",
    challenge:
      "Despite strong technical skills, Priya had imposter syndrome after relocating to the UK and struggled to articulate her cross-border wins.",
    solution:
      "We created a wins library, designed a visual impact dashboard, and ran weekly executive communication labs focused on UK hiring nuances.",
    result: "Multiple first-round interviews plus glowing feedback on her clarity and confidence.",
    accent: "from-accent/20 via-accent/5 to-transparent",
    Icon: Briefcase,
    badge: "Global Mobility"
  }
];

const highlights = [
  {
    label: "Story-first playbooks",
    Icon: Sparkles,
    description: "Every case study is mapped to recruiter psychology and market data."
  },
  {
    label: "Interview armor",
    Icon: ShieldCheck,
    description: "Live simulations plus async AI feedback keep clients calm and ready."
  },
  {
    label: "Offer momentum",
    Icon: Trophy,
    description: "We track micro-wins weekly until offers are signed."
  }
];

const RealCareerTransformations = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background via-background/95 to-muted/30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-20 w-72 h-72 bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-border/40 bg-card/80 text-sm font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="w-4 h-4" /> Real Career Transformations
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary">
            Case studies built to earn trust with every detail
          </h2>
          <p className="text-lg text-muted-foreground">
            These snapshots show how LA121 Consultants pairs strategy, design, and accountability to unlock life-changing opportunities.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {caseStudies.map(({ title, client, challenge, solution, result, accent, Icon, badge }) => (
            <Card key={title} className="group border-border/30 bg-card/80 backdrop-blur">
              <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                      {badge}
                    </p>
                    <h3 className="text-2xl font-semibold text-secondary">{title}</h3>
                    <p className="text-sm text-muted-foreground">{client}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                      <Compass className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground/80">Starting Challenge</p>
                      <p className="text-base text-foreground/90 leading-relaxed">{challenge}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground/80">What LA121 Provided</p>
                      <p className="text-base text-foreground/90 leading-relaxed">{solution}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground/80">Final Result</p>
                      <p className="text-base text-foreground/90 leading-relaxed">{result}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ label, Icon, description }) => (
            <div key={label} className="p-6 rounded-2xl border border-border/40 bg-background/80 backdrop-blur">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{label}</p>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealCareerTransformations;
