import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, CheckCircle2, Shield, DownloadCloud } from "lucide-react";

const highlights = [
  "CV tips that stand out in 2025",
  "Modern interview questions & answers",
  "Weekly job search strategy sprint",
  "Career tools & templates you can duplicate"
];

const LeadMagnet = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real flow this would send the email to your marketing platform
    setEmail("");
  };

  return (
    <section id="lead-magnet" className="relative py-20 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container px-4 mx-auto">
        <Card className="relative overflow-hidden border-0 bg-card/95 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" aria-hidden="true" />
          <CardContent className="relative grid gap-12 p-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Free guide download
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                  New for 2025
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-secondary">
                  2025 Job Search Starter Kit
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Everything you need to refresh your career story this year—actionable CV upgrades, confidence-boosting
                  interview prep, and a proven search rhythm designed for competitive job markets.
                </p>
              </div>

              <ul className="grid gap-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 text-sm text-primary font-medium">
                <Shield className="w-4 h-4" />
                Free access for a limited time—secure your copy before it locks.
              </div>
            </div>

            <div className="bg-background/90 border border-border/50 rounded-2xl p-8 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <DownloadCloud className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Grow your career faster</p>
                  <p className="text-xl font-bold text-secondary">Get instant access now</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your best email to receive the PDF plus a weekly micro-lesson on building a standout career narrative.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12"
                  />
                  <Button type="submit" className="h-12 px-8 flex-shrink-0">
                    Download Free Guide
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We respect your inbox. Unsubscribe anytime. Offer available free until the end of the quarter.
                </p>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LeadMagnet;
