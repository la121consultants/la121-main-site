import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User } from "lucide-react";
import logo from "@/assets/la121-logo.png";

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  onClose: () => void;
}

const NavDropdown = ({ label, items, onClose }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-secondary hover:text-primary transition-colors font-medium"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
          {items.map((item, index) => (
            item.href ? (
              <Link
                key={index}
                to={item.href}
                className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                  onClose();
                }}
                className="block w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

const MobileDropdown = ({ label, items, onItemClick }: { label: string; items: DropdownItem[]; onItemClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-secondary hover:text-primary transition-colors font-medium"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="pb-3 pl-4 space-y-1">
          {items.map((item, index) => (
            item.href ? (
              <Link
                key={index}
                to={item.href}
                className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={onItemClick}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  onItemClick();
                }}
                className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    // If not on home page, navigate there first
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const servicesItems: DropdownItem[] = [
    { label: "CV & LinkedIn Support", onClick: () => scrollToSection("services") },
    { label: "Interview Preparation", onClick: () => scrollToSection("services") },
    { label: "Career Coaching", onClick: () => scrollToSection("services") },
    { label: "Graduate Support", onClick: () => scrollToSection("services") },
    { label: "Career Accelerator Programme", href: "/work-experience" },
  ];

  const careerToolsItems: DropdownItem[] = [
    { label: "LA121 Job Ready AI", onClick: () => scrollToSection("career-suite") },
    { label: "Interview Practice Tool", onClick: () => scrollToSection("career-suite") },
    { label: "CV Templates", onClick: () => scrollToSection("career-suite") },
    { label: "Career E-Books", href: "/ebooks" },
  ];

  const aboutItems: DropdownItem[] = [
    { label: "About LA121", href: "/about" },
    { label: "Our Approach", onClick: () => scrollToSection("testimonials") },
    { label: "Success Stories", onClick: () => scrollToSection("real-career-transformations") },
    { label: "Partnerships", href: "/partnership" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="LA121 Consultants" className="h-12 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-secondary hover:text-primary transition-colors font-medium">
              Home
            </Link>
            
            <NavDropdown label="Services" items={servicesItems} onClose={closeMenu} />
            <NavDropdown label="Career Tools" items={careerToolsItems} onClose={closeMenu} />
            
            <Link to="/jobs" className="text-secondary hover:text-primary transition-colors font-medium">
              Jobs
            </Link>
            
            <NavDropdown label="About" items={aboutItems} onClose={closeMenu} />
            
            <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
              <User className="h-5 w-5" />
            </Link>
            
            <Link to="/book-call">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
                Book a Call
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-secondary p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <Link 
              to="/" 
              className="block py-3 text-secondary hover:text-primary transition-colors font-medium border-b border-border/50" 
              onClick={closeMenu}
            >
              Home
            </Link>
            
            <MobileDropdown label="Services" items={servicesItems} onItemClick={closeMenu} />
            <MobileDropdown label="Career Tools" items={careerToolsItems} onItemClick={closeMenu} />
            
            <Link 
              to="/jobs" 
              className="block py-3 text-secondary hover:text-primary transition-colors font-medium border-b border-border/50" 
              onClick={closeMenu}
            >
              Jobs
            </Link>
            
            <MobileDropdown label="About" items={aboutItems} onItemClick={closeMenu} />
            
            <Link 
              to="/auth" 
              className="block py-3 text-muted-foreground hover:text-primary transition-colors font-medium border-b border-border/50" 
              onClick={closeMenu}
            >
              Sign In
            </Link>
            
            <div className="pt-4">
              <Link to="/book-call" className="block" onClick={closeMenu}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Book a Call
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
