import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import successImg from "@/assets/woman-success.jpg";
import corineImg from "@/assets/testimonial-corine.jpg";
import teresaImg from "@/assets/testimonial-teresa.png";

const testimonials = [
  {
    name: "Corine Chiyembekeza",
    role: "Former Marketing Manager (May–October 2025)",
    content: "My experience at LA121 Consultants was truly transformative. I started as a Marketing Assistant and later advanced to Marketing Manager, where I learned the importance of strategy, teamwork, and creativity in digital marketing. I was able to manage social media campaigns, coordinate a team of volunteers, and contribute to projects that made a real impact. The supportive environment and hands-on experience helped me grow both professionally and personally. I'm grateful to have been part of such an inspiring and purpose-driven organization.",
    rating: 5,
    image: corineImg,
    program: "Digital Marketing Work Experience Program"
  },
  {
    name: "Teresa Waigwa",
    role: "Progressed from Marketing Assistant to Marketing Manager (Dec 2024–May 2025)",
    content: "The Marketing Program was a really fun and eye-opening experience for me. Every time I sat down to design a post, I felt like my creativity was growing. I enjoyed trying new ideas and seeing how much better I got with each one. One thing I really appreciated was how flexible the program was. It made it easy for me to manage my time, which helped me stay consistent without feeling overwhelmed. I also found the feedback super helpful, it pushed me to improve. Overall, I'm really glad I got to be part of this. Thank you for the support and for creating a space where I could learn and grow.",
    rating: 5,
    image: teresaImg,
    program: "Digital Marketing Work Experience Program"
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    content: "LA121 Consultants transformed my CV and helped me land my dream role in just 3 weeks. The AI tools are game-changing!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Software Developer",
    content: "The Career Accelerator Program gave me the structure and confidence I needed. Within 2 months, I had multiple job offers.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Recent Graduate",
    content: "The portfolio service showcased my projects beautifully. Recruiters were impressed, and I secured my first role much faster than expected.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${successImg})` }}
      >
        <div className="absolute inset-0 bg-background/97"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            What Our Career Coaching UK Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from professionals and graduates who chose our CV revamp service UK for professional CV
            writing, interview preparation, and job search support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-300 border-border/20 bg-card/95 backdrop-blur-sm hover:-translate-y-2">
              <CardContent className="pt-6 space-y-4">
                {testimonial.image && (
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {testimonial.program && (
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                    {testimonial.program}
                  </div>
                )}
                <Quote className="w-10 h-10 text-accent/30 mb-2" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed">{testimonial.content}</p>
                <div className="pt-4 border-t border-border/50">
                  <p className="font-semibold text-secondary">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
