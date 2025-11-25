import { Link } from "react-router-dom";
import { Linkedin, Instagram, Music2 } from "lucide-react";
import logo from "@/assets/la121-logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <img src={logo} alt="LA121 Consultants" className="h-16 w-auto" />
            <p className="text-white/80 text-sm">
              Empowering UK professionals with CV revamp service UK expertise, professional CV writing,
              interview preparation, and ongoing job search support.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-primary transition-colors">About</Link></li>
              <li><a href="#services" className="text-white/80 hover:text-primary transition-colors">Services</a></li>
              <li><a href="#career-suite" className="text-white/80 hover:text-primary transition-colors">Career Suite</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Services</h3>
            <ul className="space-y-2">
              <li><a href="https://cv.la121consultants.co.uk" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors">CV Revamp</a></li>
              <li><a href="https://showintrobio.la121consultants.co.uk" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors">Bio Builder</a></li>
              <li><a href="#services" className="text-white/80 hover:text-primary transition-colors">Career Portfolio</a></li>
              <li><a href="#services" className="text-white/80 hover:text-primary transition-colors">Career Accelerator</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a href="https://linkedin.com/company/la121consultants" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/la121consultants" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@la121consultants" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Music2 className="w-5 h-5" />
              </a>
            </div>
            <a href="mailto:admin@la121consultants.co.uk" className="text-white/80 hover:text-primary transition-colors text-sm block mb-2">
              admin@la121consultants.co.uk
            </a>
            <a href="https://tinyurl.com/la121channel" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors text-sm">
              WhatsApp Community
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} LA121 Consultants. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ by LA121 Consultants</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
