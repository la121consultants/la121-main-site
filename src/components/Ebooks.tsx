import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";
import interviewImg from "@/assets/interview.jpg";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const ebooks = [
  {
    title: "Returning to Work After Having a Baby",
    description: "Comprehensive guide for parents re-entering the workforce with practical advice on work-life balance, CV updates, and career strategies.",
    priceId: "price_1SSLKQGTySjrCnV14vGRyhr0",
    price: "£9.99",
    pages: "Professional guide",
    filename: "returning-to-work-after-baby.pdf"
  },
  {
    title: "Smart Ways to Use AI to Land Your Next Job",
    description: "AI-powered job search guide with smart strategies for admin, marketing, project management, and finance professionals.",
    priceId: "price_1SSLL2GTySjrCnV1oLIbjToF",
    price: "£9.99",
    pages: "AI job search toolkit",
    filename: "smart-ways-to-use-ai.pdf"
  },
  {
    title: "Side Hustle Success Playbook",
    description: "Complete playbook for building and scaling your side hustle while maintaining work-life balance and achieving financial freedom.",
    priceId: "price_1SSLLGGTySjrCnV1AqToGd8x",
    price: "£14.99",
    pages: "Complete playbook",
    filename: "side-hustle-success-playbook.pdf"
  },
  {
    title: "Networking: Unlocking Career Success",
    description: "Build confidence and succeed in networking with practical strategies for career advancement and professional relationship building.",
    priceId: "price_1SSLLTGTySjrCnV1qjnXSY3J",
    price: "£9.99",
    pages: "Networking masterclass",
    filename: "networking-career-success.pdf"
  },
];

const Ebooks = () => {
  const [loadingEbook, setLoadingEbook] = useState<string | null>(null);

  const handlePurchase = async (ebook: typeof ebooks[0]) => {
    try {
      setLoadingEbook(ebook.priceId);
      
      const { data, error } = await supabase.functions.invoke('create-ebook-checkout', {
        body: { 
          priceId: ebook.priceId,
          customerEmail: "" // Optional: can collect email first
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setLoadingEbook(null);
    }
  };

  return (
    <section id="ebooks" className="relative py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${interviewImg})` }}
      >
        <div className="absolute inset-0 bg-secondary/95"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Free Resources</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Free UK Interview Preparation & Job Search Guides
          </h2>
          <p className="text-lg text-white/80">
            Download expert resources curated by our career coaching UK team to boost professional CV
            writing, interview preparation, and job search support.
          </p>
          <p className="text-accent font-semibold mt-2">
            🎁 Free for a limited time — grab yours today!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {ebooks.map((ebook, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-glow transition-all duration-300 border-border/20 bg-card/95 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-secondary">{ebook.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>{ebook.pages}</span>
                  <span className="text-primary font-semibold">{ebook.price}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {ebook.description}
                </p>
                <Button 
                  className="w-full group-hover:scale-105 transition-transform"
                  onClick={() => handlePurchase(ebook)}
                  disabled={loadingEbook === ebook.priceId}
                >
                  {loadingEbook === ebook.priceId ? (
                    "Loading..."
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Purchase Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ebooks;
