import { ShieldCheck, Sparkles, Rocket, BadgeCheck, Zap, Users } from "lucide-react";

const benefits = [
  {
    title: "Faster job interviews",
    description:
      "We align your profile with the exact roles recruiters are filling right now, accelerating shortlists and interview invites.",
    icon: Rocket
  },
  {
    title: "Professional CV transformation",
    description:
      "Specialist writers rebuild your CV with proven frameworks, storytelling, and formatting that passes every ATS scan.",
    icon: BadgeCheck
  },
  {
    title: "Stronger interview confidence",
    description:
      "Interactive coaching sessions and battle-tested scripts ensure you walk into every interview with clarity and calm.",
    icon: ShieldCheck
  },
  {
    title: "AI-powered career tools",
    description:
      "Get exclusive access to AI templates, market insights, and trackers that keep your applications polished and on pace.",
    icon: Sparkles
  },
  {
    title: "Affordable and flexible packages",
    description:
      "Mix-and-match services with transparent pricing so you only pay for the support you need at each career moment.",
    icon: Zap
  },
  {
    title: "Real personalised support",
    description:
      "Your dedicated consultant stays with you from CV to offer letter, providing honest feedback and strategic next steps.",
    icon: Users
  }
];

const JobSeekersBenefits = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/40">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Why Job Seekers Choose LA121 Consultants
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mt-4">
            Results-focused support with real human expertise
          </h2>
          <p className="text-lg text-muted-foreground mt-6">
            Every benefit is engineered to remove friction from your job search so you can move from application to offer with
            confidence and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="relative h-full rounded-3xl border border-border/40 bg-card/80 backdrop-blur-lg p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary">{benefit.title}</h3>
                </div>
                <p className="relative mt-4 text-base text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JobSeekersBenefits;
