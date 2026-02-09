import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const WebsiteBuildingServices = () => {
  const audiences = [
    "Personal websites (freelancers, tutors, consultants, portfolios)",
    "Small businesses and startups",
    "Anyone who needs a professional online presence without complexity",
  ];

  const includedItems = [
    "One-page website",
    "Mobile-friendly design",
    "Clean and professional layout",
    "Sections such as About, Services, and Contact",
    "Contact details",
  ];

  const addOns = [
    "Additional pages",
    "Basic SEO setup",
    "Google Analytics",
    "Social media links integration",
  ];

  const steps = ["Enquire", "Share your content", "Website is built", "Review and launch"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
            Website Building Services
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Website Building Services
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We build clean, modern, and mobile-friendly websites for individuals and businesses across the UK.
            Our focus is on simple, affordable, and professional sites that make it easy for you to be found
            online and trusted by your audience.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Who This Is For</h2>
            <ul className="space-y-3 text-lg text-muted-foreground">
              {audiences.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Website Packages</h3>
              <p className="text-muted-foreground">
                Website builds start from <span className="font-semibold text-foreground">£180</span>.
              </p>
              <p className="text-muted-foreground mt-2">
                £180 includes a basic one-page website, with custom quotes available for larger or more
                complex sites.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm md:col-span-2">
              <h3 className="text-xl font-semibold text-foreground mb-2">What’s Included in the £180 Package</h3>
              <ul className="grid gap-3 sm:grid-cols-2 text-muted-foreground">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-2">Optional Add-Ons (Priced Separately)</h3>
              <ul className="space-y-3 text-muted-foreground">
                {addOns.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-2">How It Works</h3>
              <ol className="space-y-3 text-muted-foreground">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground">
            Get in touch for a tailored quote or to begin building your website today. Email us at
            <span className="font-semibold text-foreground"> admin@la121consultants.co.uk</span> and we will
            guide you through the next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:admin@la121consultants.co.uk">
              <Button size="lg">Get started today</Button>
            </a>
            <a href="mailto:admin@la121consultants.co.uk">
              <Button size="lg" variant="outline">
                Contact us to build your website
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebsiteBuildingServices;
