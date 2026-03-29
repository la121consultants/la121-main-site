import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Laptop, Award, Play } from "lucide-react";
import { useRef, useState } from "react";

const DigitalMarketingProgram = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-20 bg-secondary/5" id="work-experience">
      <div className="container px-4 mx-auto">
        {/* Top section: Info + Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <p className="text-primary font-semibold uppercase tracking-wide mb-3">
              Digital Marketing Work Experience Program
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Kickstart Your Career in Digital Marketing
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Whether you're an <strong className="text-secondary">undergraduate</strong>,{" "}
              <strong className="text-secondary">recent graduate</strong>, or{" "}
              <strong className="text-secondary">looking for a job and want to fill that gap on your CV</strong> —
              this program is designed for you.
            </p>
            <p className="text-muted-foreground mb-4">
              Join <strong className="text-secondary">remotely</strong> with just a minimum of{" "}
              <strong className="text-secondary">2 hours a week</strong> and gain real-world experience that
              employers actually value.
            </p>

            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="font-bold text-secondary mb-3 text-lg">What You'll Learn:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "How to use Canva for design",
                  "Social media scheduling tools",
                  "Social media marketing strategy",
                  "Office 365 / G Suite for project management",
                  "Content creation & copywriting",
                  "And much more..."
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 rounded-xl p-5 mb-6">
              <p className="text-secondary font-bold text-lg mb-1">
                Only £299 <span className="text-muted-foreground font-normal text-sm line-through">£1,000</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Minimum 2 months, fully flexible. All you need is a laptop and internet.
              </p>
              <p className="text-primary font-semibold mt-2 text-sm">
                🎓 Get a certificate and job reference at the end!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: GraduationCap, label: "Certificate Included" },
                { icon: Clock, label: "Min. 2hrs/week" },
                { icon: Laptop, label: "Fully Remote" },
                { icon: Award, label: "Job Reference" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1 p-3 bg-card rounded-lg border border-border">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <a
                  href="https://buy.stripe.com/3cIfZhgJD5kubjlf6Kdwc0I"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join the Program Today
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="mailto:admin@la121consultants.co.uk?subject=Question%20about%20Work%20Experience%20Program">
                  Ask a Question
                </a>
              </Button>
            </div>

            {/* 1-to-1 Digital Marketing Course */}
            <div className="mt-8 bg-gradient-to-r from-primary/15 to-accent/15 border-2 border-primary rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold text-secondary">1-to-1 Digital Marketing Course</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Want personalised, hands-on training? Our <strong className="text-secondary">1-to-1 Digital Marketing Course</strong> gives you 
                dedicated mentorship tailored to your goals — whether you're launching a business, building a personal brand, or levelling up your career. 
                <strong className="text-secondary">Fully remote</strong>, fits around your schedule including <strong className="text-secondary">evenings and weekends</strong>, delivered over <strong className="text-secondary">6–8 weeks</strong>.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-secondary font-bold text-2xl">
                  Only £499
                </p>
                <span className="text-muted-foreground font-normal text-base line-through">£1,500</span>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">SAVE 67%</span>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a
                  href="https://buy.stripe.com/cNiaEX50V6oy1ILbUydwc0J"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enrol Now — Limited Offer
                </a>
              </Button>
            </div>
          </div>

          {/* Video Testimonial */}
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-1">
                🎤 What Our Alumni Had to Say
              </p>
              <h3 className="text-xl font-bold text-secondary">
                Hear It Straight From Our Graduates
              </h3>
            </div>
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group aspect-[9/16] max-h-[520px] mx-auto"
              onClick={handlePlayVideo}
            >
              <video
                ref={videoRef}
                src="/videos/blessing-review.mp4"
                className="w-full h-full object-cover"
                playsInline
                controls={isPlaying}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground italic">
              "This program changed my career path" — Blessing, Program Graduate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalMarketingProgram;
