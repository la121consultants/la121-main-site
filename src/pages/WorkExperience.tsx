import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkExperienceProgrammeBanner from "@/components/WorkExperienceProgrammeBanner";
import { Briefcase, Users, TrendingUp, Award } from "lucide-react";
import { z } from "zod";
import workExpCorine from "@/assets/work-exp-corine.jpg";
import workExpTeresa from "@/assets/work-exp-teresa.png";

// Input validation schema
const leadFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(/^[0-9+\s()-]+$/, { message: "Invalid phone number format" }),
  message: z.string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be less than 1000 characters" })
});

const WorkExperience = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const validation = leadFormSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Encode data for email
      const subject = encodeURIComponent("Work Experience Program - New Lead");
      const body = encodeURIComponent(
        `Name: ${validation.data.name}\n` +
        `Email: ${validation.data.email}\n` +
        `Phone: ${validation.data.phone}\n\n` +
        `Message:\n${validation.data.message}`
      );
      
      // Send to both email addresses
      const mailtoLink = `mailto:admin@la121consultants.co.uk,la121consultants@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;

      toast({
        title: "Application Submitted!",
        description: "We'll get back to you within 24-48 hours.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const benefits = [
    {
      icon: Briefcase,
      title: "Real-World Experience",
      description: "Gain hands-on experience in digital marketing with real projects and campaigns."
    },
    {
      icon: Users,
      title: "Mentorship & Support",
      description: "Work alongside experienced professionals who will guide your development."
    },
    {
      icon: TrendingUp,
      title: "Career Progression",
      description: "Proven track record of participants advancing from assistant to manager roles."
    },
    {
      icon: Award,
      title: "Portfolio Building",
      description: "Build a professional portfolio showcasing your marketing projects and achievements."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <WorkExperienceProgrammeBanner />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Digital Marketing <span className="text-primary">Work Experience Program</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join LA121 Consultants' transformative work experience program and launch your career in 
            digital marketing with real-world projects, expert mentorship, and proven results.
          </p>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Join Our Program?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories / Reviews */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Success Stories from Our Program
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Corine's Review */}
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={workExpCorine} 
                alt="Corine Chiyembekeza - Former Marketing Manager testimonial for LA121 Digital Marketing Work Experience Program"
                className="w-full h-auto"
              />
            </div>
            
            {/* Teresa's Review */}
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={workExpTeresa} 
                alt="Teresa Waigwa - Marketing Manager testimonial for LA121 Digital Marketing Work Experience Program"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="py-20 px-4" id="apply">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Apply for the Program
            </h2>
            <p className="text-lg text-muted-foreground">
              Take the first step towards transforming your career. Fill out the form below and 
              we'll get back to you within 24-48 hours.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-destructive" : ""}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={errors.email ? "border-destructive" : ""}
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 123 456 7890"
                  className={errors.phone ? "border-destructive" : ""}
                  maxLength={20}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Why are you interested in this program? *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your career goals and why you want to join our work experience program..."
                  rows={6}
                  className={errors.message ? "border-destructive" : ""}
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground ml-auto">
                    {formData.message.length}/1000
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to be contacted by LA121 Consultants regarding 
                the work experience program.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Have Questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Get in touch with us for more information about the program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:admin@la121consultants.co.uk">
                Email Us
              </a>
            </Button>
            <Button size="lg" asChild>
              <a 
                href="https://tinyurl.com/la121channel" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Join WhatsApp Channel
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkExperience;
