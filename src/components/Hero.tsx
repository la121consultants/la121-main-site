import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatedShaderHero
      trustBadge={{
        text: "Trusted by 2,500+ UK professionals",
        icons: ["⭐"]
      }}
      headline={{
        line1: "Land the roles you deserve",
        line2: "with strategic career consulting"
      }}
      subtitle="Interview-ready CVs, confident storytelling, and proven job-search strategies that lead to more interviews, offers, and clarity for graduates, job changers, and ambitious UK professionals."
      buttons={{
        primary: {
          text: "Book a Free Strategy Call",
          onClick: () => navigate("/book-call")
        },
        secondary: {
          text: "Explore Services",
          onClick: () => scrollToSection("services")
        }
      }}
      logoCloud={{
        heading: "LA121 consultants have powered careers within leading UK employers",
        logos: [
          {
            name: "Capgemini",
            imageSrc: "/logos/capgemini.svg",
            alt: "Capgemini logo"
          },
          {
            name: "KPMG",
            imageSrc: "/logos/kpmg.svg",
            alt: "KPMG logo"
          },
          {
            name: "Microsoft",
            imageSrc: "/logos/microsoft.svg",
            alt: "Microsoft logo"
          },
          {
            name: "Enterprise Rent-A-Car",
            imageSrc: "/logos/enterprise.svg",
            alt: "Enterprise Rent-A-Car logo"
          },
          {
            name: "Unilabs",
            imageSrc: "/logos/unilabs.svg",
            alt: "Unilabs logo"
          },
          {
            name: "Hammersmith & Fulham Council",
            imageSrc: "/logos/hammersmith-fulham.svg",
            alt: "Hammersmith and Fulham Council logo"
          }
        ]
      }}
    />
  );
};

export default Hero;
