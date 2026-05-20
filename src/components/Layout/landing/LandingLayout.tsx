import Navbar from '../navbar/NavBar';
import Footer from '../footer/Footer';
import CtaSection from './CtaSection';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import PricingSection from './PricingSection';
 import TestimonialsSection from './TestimonialsSection';

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      <main className="pt-28 md:pt-32">
        <HeroSection />
         <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
