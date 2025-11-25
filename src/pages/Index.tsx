import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import CareerSuite from "@/components/CareerSuite";
import Ebooks from "@/components/Ebooks";
import Testimonials from "@/components/Testimonials";
import LeadMagnet from "@/components/LeadMagnet";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <CareerSuite />
      <Ebooks />
      <LeadMagnet />
      <Testimonials />
      <Booking />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
