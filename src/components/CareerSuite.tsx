import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, ArrowRight } from "lucide-react";

const CareerSuite = () => {
  return (
    <section id="career-suite" className="py-20 bg-gradient-to-br from-secondary to-secondary/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070')] bg-cover bg-center opacity-5"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore the LA121 Career Suite for CV Revamp Service UK
          </h2>
          <p className="text-xl text-white/90">
            Your all-in-one hub for professional CV writing, graduate CV services, and interview
            preparation powered by AI-driven tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur">
            <CardHeader>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-secondary">AI CV Revamp Tool</CardTitle>
              <CardDescription className="text-base">
                Transform your CV instantly with AI-powered optimisation that mirrors our professional CV
                writing quality so you stand out fast.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">✓ AI-powered job matching</p>
                <p className="text-sm text-muted-foreground">✓ ATS-friendly formatting</p>
                <p className="text-sm text-muted-foreground">✓ Instant customization</p>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white group"
                onClick={() => window.open('https://cv.la121consultants.co.uk', '_blank')}
              >
                Start Revamping Your CV
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur">
            <CardHeader>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-secondary">ShowIntro Bio Builder</CardTitle>
              <CardDescription className="text-base">
                Create compelling professional bios for LinkedIn, Instagram, and other platforms to
                reinforce your wider career coaching UK and job search support plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">✓ Platform-optimized bios</p>
                <p className="text-sm text-muted-foreground">✓ Personal brand focus</p>
                <p className="text-sm text-muted-foreground">✓ Multiple variations</p>
              </div>
              <Button
                className="w-full bg-secondary hover:bg-secondary/90 text-white group"
                onClick={() => window.open('https://showintrobio.la121consultants.co.uk', '_blank')}
              >
                Build Your Bio
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CareerSuite;
