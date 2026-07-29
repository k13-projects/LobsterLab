import ModalProvider from "@/components/ModalProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Values from "@/components/Values";
import MenuSection from "@/components/MenuSection";
import CateringSection from "@/components/CateringSection";
import Locations from "@/components/Locations";
import RollStrip from "@/components/RollStrip";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <ModalProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <Values />
        <MenuSection />
        <CateringSection />
        <Locations />
        <RollStrip />
        <Reviews />
      </main>
      <Footer />
    </ModalProvider>
  );
}
