import HeroSection from "@/components/HeroSection";
import ComoFunciona from "@/components/ComoFunciona";
import Pilares from "@/components/Pilares";
import MaterialExclusivo from "@/components/MaterialExclusivo";
import ProvaSocial from "@/components/ProvaSocial";
import OQueVaiReceber from "@/components/OQueVaiReceber";
import ParaQuemE from "@/components/ParaQuemE";
import Devocional from "@/components/Devocional";
import Oferta from "@/components/Oferta";
import Autoridade from "@/components/Autoridade";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ComoFunciona />
      <Pilares />
      <MaterialExclusivo />
      <ProvaSocial />
      <OQueVaiReceber />
      <ParaQuemE />
      <Devocional />
      <Oferta />
      <Autoridade />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
