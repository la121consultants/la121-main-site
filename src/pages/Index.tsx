import Navbar from "@/components/Navbar";
import EbookBanner from "@/components/EbookBanner";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import JobSeekersBenefits from "@/components/JobSeekersBenefits";
import DigitalMarketingProgram from "@/components/DigitalMarketingProgram";
import CareerSuite from "@/components/CareerSuite";
import Ebooks from "@/components/Ebooks";
import Testimonials from "@/components/Testimonials";
import RealCareerTransformations from "@/components/RealCareerTransformations";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <EbookBanner />
      <Hero />
      <About />
      <Services />
      <JobSeekersBenefits />
      <DigitalMarketingProgram />
      <CareerSuite />
      <Ebooks />
      <Testimonials />
      <RealCareerTransformations />
      <Booking />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
