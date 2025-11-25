import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary">
            About LA121 Consultants: Your Career Consultant UK Team
          </h2>

          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
            Our CV Revamp Service UK combines professional CV writing, interview preparation,
            and career coaching UK expertise to help you stand out. From graduate CV services
            to leadership mentoring, our consultants understand what employers want and guide
            you with tailored job search support at every stage.
          </p>
          
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
