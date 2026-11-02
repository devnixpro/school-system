import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import TrustedSchools from '@/components/sections/TrustedSchools';
import Features from '@/components/sections/Features';
import ModulesSection from '@/components/sections/ModulesSection';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import DemoModal from '@/components/modals/DemoModal';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedSchools />
        <Features />
        <ModulesSection />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <DemoModal />
    </>
  );
}