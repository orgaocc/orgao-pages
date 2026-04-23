import { lazy, Suspense } from "react";
import HeroSection from "@/components/HeroSection";

const ComoFunciona = lazy(() => import("@/components/ComoFunciona"));
const Pilares = lazy(() => import("@/components/Pilares"));
const MaterialExclusivo = lazy(() => import("@/components/MaterialExclusivo"));
const ProvaSocial = lazy(() => import("@/components/ProvaSocial"));
const OQueVaiReceber = lazy(() => import("@/components/OQueVaiReceber"));
const ParaQuemE = lazy(() => import("@/components/ParaQuemE"));
const Devocional = lazy(() => import("@/components/Devocional"));
const Oferta = lazy(() => import("@/components/Oferta"));
const Autoridade = lazy(() => import("@/components/Autoridade"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

const IndexTeste1 = () => {
  return (
    <div className="min-h-screen bg-background theme-teste1">
      <HeroSection />
      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
};

export default IndexTeste1;
