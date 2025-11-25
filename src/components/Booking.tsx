import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

const Booking = () => {
  const benefits = [
    "10-minute free consultation",
    "Discuss your career goals",
    "Get expert advice",
    "No obligation required"
  ];

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              Book Your Free Career Consultant UK Strategy Call
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Use this 10-minute call to map out CV revamp service UK needs, interview preparation, graduate CV
              services, or wider job search support — no obligation, just expert guidance.
            </p>
          </div>

          <Card className="border-border/50 shadow-elevated">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground/80">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-secondary">Quick & Easy</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a time that works for you — we'll confirm and share how our professional CV writing
                      and career coaching UK services fit your goals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white px-12 py-6 text-lg w-full md:w-auto"
                  onClick={() => window.open('https://calendar.google.com', '_blank')}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule My Free Call
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Powered by Google Calendar • Instant confirmation via email
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Booking;
