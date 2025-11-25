import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Create mailto link with form data
    const subject = encodeURIComponent(`New Consultation Request from ${formData.name}`);
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Service Interest: ${formData.service || 'General Inquiry'}

Message:
${formData.message}
    `);
    
    const mailtoLink = `mailto:admin@la121consultants.co.uk?subject=${subject}&body=${body}`;
    const secondaryEmail = `mailto:la121consultants@gmail.com?subject=${subject}&body=${body}`;
    
    // Open both email clients
    window.open(mailtoLink);
    window.open(secondaryEmail);

    toast({
      title: "Email Client Opened",
      description: "Your email client has been opened with your message. Please send it to complete your inquiry.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    });
    
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Get in Touch with a Career Consultant UK
          </h2>
          <p className="text-lg text-muted-foreground">
            Tell us what you need — CV revamp service UK support, professional CV writing, graduate CV
            services, interview preparation, or broader job search support — and we'll reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Email Us</CardTitle>
                <CardDescription>
                  <a href="mailto:admin@la121consultants.co.uk" className="text-primary hover:underline">
                    admin@la121consultants.co.uk
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">WhatsApp</CardTitle>
                <CardDescription>
                  <a 
                    href="https://tinyurl.com/la121channel" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Join our WhatsApp Channel
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-lg">Office Hours</CardTitle>
                <CardDescription>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Weekend: By appointment only
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Share your goals so we can tailor professional CV writing, career coaching UK, or interview preparation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+44 123 456 7890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Interest</Label>
                      <Input
                        id="service"
                        placeholder="e.g., CV Revamp, Interview Prep"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your career goals and how we can help..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to receive communications from LA121 Consultants
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
