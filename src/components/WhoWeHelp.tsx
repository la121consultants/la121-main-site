import { GraduationCap, Briefcase, LayoutDashboard, RefreshCcw, Target } from "lucide-react";

const categories = [
  {
    title: "Students & Graduates",
    description:
      "Craft standout CVs, portfolios, and LinkedIn profiles that make the leap from education to employment feel seamless.",
    icon: GraduationCap,
  },
  {
    title: "Job Seekers & Career Changers",
    description:
      "Reposition your experience, highlight transferable skills, and build a clear narrative for your next chapter.",
    icon: Target,
  },
  {
    title: "Marketing, Admin, and Project Professionals",
    description:
      "Showcase measurable impact with modern templates, compelling case studies, and metrics employers love.",
    icon: LayoutDashboard,
  },
  {
    title: "Mid-career professionals",
    description:
      "Refresh your professional brand with strategic storytelling, leadership positioning, and executive-ready assets.",
    icon: Briefcase,
  },
  {
    title: "Those returning to work after a break",
    description:
      "Close employment gaps with confidence through future-focused CVs and career coaching tailored to your goals.",
    icon: RefreshCcw,
  },
];

const WhoWeHelp = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/80 font-semibold">
            Who We Help
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary">
            Career support for every stage of the journey
          </h2>
          <p className="text-lg text-foreground/70">
            Our consultants tailor every engagement to the realities of your industry, experience level, and ambitions.
          </p>
        </div>

        <div className="grid gap-6 mt-12 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="relative overflow-hidden rounded-3xl border border-border bg-background/80 backdrop-blur-sm shadow-lg shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" aria-hidden />
                <div className="relative p-8 space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-secondary">{category.title}</h3>
                    <p className="text-base text-foreground/70 leading-relaxed">{category.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoWeHelp;
