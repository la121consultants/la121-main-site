import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/la121-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="LA121 Consultants" className="h-12 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-secondary hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-secondary hover:text-primary transition-colors font-medium">
              About
            </Link>
            <button onClick={() => scrollToSection("services")} className="text-secondary hover:text-primary transition-colors font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection("career-suite")} className="text-secondary hover:text-primary transition-colors font-medium">
              Career Suite
            </button>
            <Link to="/work-experience" className="text-secondary hover:text-primary transition-colors font-medium">
              Work Experience
            </Link>
            <Link to="/ebooks" className="text-secondary hover:text-primary transition-colors font-medium">
              E-Books
            </Link>
            <Link to="/partnership" className="text-secondary hover:text-primary transition-colors font-medium">
              Partnerships
            </Link>
            <Link to="/jobs" className="text-secondary hover:text-primary transition-colors font-medium">
              Jobs
            </Link>
            <Link to="/auth" className="text-secondary hover:text-primary transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/book-call">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Book a Call
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block text-secondary hover:text-primary transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="block text-secondary hover:text-primary transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <button onClick={() => scrollToSection("services")} className="block w-full text-left text-secondary hover:text-primary transition-colors font-medium py-2">
              Services
            </button>
            <button onClick={() => scrollToSection("career-suite")} className="block w-full text-left text-secondary hover:text-primary transition-colors font-medium py-2">
              Career Suite
            </button>
            <Link to="/work-experience" className="block text-secondary hover:text-primary transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
              Work Experience
            </Link>
            <Link to="/ebooks" className="block text-secondary hover:text-primary transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
              E-Books
            </Link>
            <Link to="/partnership" className="block text-secondary hover:text-primary transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
              Partnerships
            </Link>
            <Link to="/jobs" className="block text-secondary hover:text-primary transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
              Jobs
            </Link>
            <Link to="/auth" className="block text-secondary hover:text-primary transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
            <Link to="/book-call" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => setIsOpen(false)}>
                Book a Call
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
