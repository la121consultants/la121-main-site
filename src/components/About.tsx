import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary">
            About LA121 Consultants
          </h2>

          <div className="space-y-5 text-lg md:text-xl text-foreground/80 leading-relaxed text-left">
            <p>
              LA121 Consultants is a results-driven career consulting company helping individuals and businesses stand out, grow, and succeed in an increasingly competitive world of work.
            </p>
            
            <p>
              We specialise in CV reviews and revamps, interview preparation, career coaching, and job-readiness support — empowering early-career professionals, experienced managers, career changers, and returners to confidently secure roles that align with their skills, goals, and lifestyle.
            </p>
            
            <p>
              What sets LA121 Consultants apart is our understanding that success today isn't just about a strong CV — it's also about visibility, positioning, and professional presence. Alongside our core career services, we offer Social Media & Marketing Management as an add-on service for businesses, managers, and influencers who want to remain consistent and credible online without sacrificing time or energy.
            </p>
            
            <p>
              Whether you're building a personal brand, growing a business, or navigating your next career move, LA121 Consultants provides practical, strategic support that delivers clarity, confidence, and results — both on paper and online.
            </p>
          </div>
          
          <div className="pt-6">
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
