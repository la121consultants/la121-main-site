import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, TrendingUp, Rocket, Crown, Check, Sparkles, GraduationCap, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";

const studentOffer = {
  icon: GraduationCap,
  name: "Student Winter Offer",
  price: "£49.99",
  originalPrice: "£69.99",
  description: "Special student pricing for essential career tools",
  features: [
    "CV Review",
    "CV Revamp",
    "1-Page Career Portfolio"
  ],
  badge: "Limited Time"
};

const packages = [
  {
    icon: Briefcase,
    name: "Basic Plus Package",
    price: "£99",
    studentPrice: "£69.99",
    description: "Perfect for students and entry-level professionals",
    features: [
      "CV Review",
      "CV Revamp",
      "1-Page Portfolio"
    ],
    popular: false
  },
  {
    icon: TrendingUp,
    name: "Essential Career Starter",
    price: "£129",
    description: "Complete package to kickstart your career journey",
    features: [
      "CV Review",
      "CV Revamp",
      "Cover Letter",
      "Interview Prep (30 mins)",
      "Starter Portfolio",
      "Unlimited CV AI Tool Access",
      "WhatsApp Community"
    ],
    popular: false
  },
  {
    icon: Rocket,
    name: "Career Accelerator",
    price: "£249",
    description: "Comprehensive support for serious job seekers",
    features: [
      "CV Review",
      "CV Revamp",
      "Cover Letter",
      "Interview Prep (45 mins)",
      "Job Strategy",
      "Application Support (1 role)",
      "Starter Portfolio",
      "Unlimited CV AI Access",
      "Unlimited ShowIntroBio Access"
    ],
    popular: true
  },
  {
    icon: Crown,
    name: "Premium Mentorship Programme",
    price: "£499",
    description: "Full career transformation with premium support",
    features: [
      "Full CV Revamp",
      "LinkedIn Optimisation",
      "Cover Letter",
      "2× Interview Prep Sessions",
      "Job Search Support",
      "Application Support (2 roles)",
      "Professional Portfolio (3–4 Pages)",
      "Unlimited CV AI Access",
      "Unlimited ShowIntroBio Access"
    ],
    popular: false
  }
];

const addOns = [
  { name: "Unlimited CV Access", price: "£199", category: "Tools" },
  { name: "Unlimited ShowIntroBio Access", price: "£39", category: "Tools" },
  { name: "Additional CV Revamp", price: "£49", category: "CV Services" },
  { name: "Multiple CV Pack (Up to 3)", price: "£99", category: "CV Services" },
  { name: "Cover Letter Rewrite", price: "£35", category: "Cover Letter" },
  { name: "Cover Letter Review", price: "£20", category: "Cover Letter" },
  { name: "Application Support (Per Role)", price: "£50", category: "Job Search" },
  { name: "Job Search Strategy Session", price: "£69", category: "Job Search" },
  { name: "Interview Prep (Standard)", price: "£65", category: "Interview" },
  { name: "Premium Interview Prep", price: "£99", category: "Interview" },
  { name: "Multiple Interview Pack (4)", price: "£399", category: "Interview" },
  { name: "Starter Portfolio", price: "£99", category: "Portfolio" },
  { name: "Professional Portfolio", price: "£149–£179", category: "Portfolio" },
  { name: "Personal Brand Portfolio", price: "£249–£299", category: "Portfolio" },
  { name: "Premium Portfolio", price: "£399–£499", category: "Portfolio" },
  { name: "Custom Domain", price: "£25–£30", category: "Portfolio" },
  { name: "Domain Subscription", price: "£5/month", category: "Portfolio" },
  { name: "Maintenance & Updates", price: "£10/month or £79.99/year", category: "Portfolio" },
  { name: "Portfolio + Bio Combo", price: "£69", category: "Portfolio" },
  { name: "1:1 Portfolio Review Call", price: "£35", category: "Consultation" },
  { name: "1:1 Mentorship Hour", price: "£60", category: "Consultation" },
  { name: "Email Support (30 Days)", price: "£25", category: "Support" },
  { name: "Career Roadmap Session", price: "£50", category: "Consultation" }
];

const Services = () => {
  const [showAddOns, setShowAddOns] = useState(false);

  const handleBookNow = () => {
    const bookingElement = document.getElementById('booking');
    bookingElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            One-to-One Career Coaching UK Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from tailored CV revamp service UK packages with professional CV writing,
            interview preparation, graduate CV services, and hands-on job search support.
          </p>
        </div>
        
        {/* Main Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`group hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 border-border/50 ${
                pkg.popular ? 'border-primary border-2' : ''
              }`}
            >
              <CardHeader>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <pkg.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mt-2">{pkg.price}</div>
                <CardDescription className="text-base mt-2">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-white"
                  onClick={() => {
                    const bookingSection = document.getElementById('booking');
                    bookingSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Optional Add-Ons - Compact View */}
        <div className="max-w-4xl mx-auto text-center">
          <Dialog open={showAddOns} onOpenChange={setShowAddOns}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="group">
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                View Optional Add-Ons & Extras
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Optional Add-Ons for CV Revamp Service UK</DialogTitle>
                <DialogDescription>
                  Enhance your professional CV writing, career coaching UK, and job search support
                  with targeted extras.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {addOns.map((addon, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-tight flex-1">{addon.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {addon.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-lg font-bold text-primary">{addon.price}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-6 pt-4 border-t">
                <Button onClick={() => { setShowAddOns(false); handleBookNow(); }} size="lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Book a Consultation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Services;
