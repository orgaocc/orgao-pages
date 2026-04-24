import { lazy, Suspense } from "react";
import HeroLo3 from "@/components/lo3/HeroLo3";
import UrgencyBar from "@/components/UrgencyBar";

const Mecanismo = lazy(() => import("@/components/lo3/MecanismoLo3"));
const ComoFunciona = lazy(() => import("@/components/lo3/ComoFuncionaLo3"));
const MaterialExclusivo = lazy(() => import("@/components/lo3/MaterialExclusivoLo3"));
const ProvaSocial = lazy(() => import("@/components/lo3/ProvaSocialLo3"));
const OQueVaiReceber = lazy(() => import("@/components/lo3/OQueVaiReceberLo3"));
const ParaQuemE = lazy(() => import("@/components/lo3/ParaQuemELo3"));
const Devocional = lazy(() => import("@/components/lo3/DevocionalLo3"));
const Oferta = lazy(() => import("@/components/lo3/OfertaLo3"));
const Autoridade = lazy(() => import("@/components/lo3/AutoridadeLo3"));
const FAQ = lazy(() => import("@/components/lo3/FAQLo3"));
const Footer = lazy(() => import("@/components/Footer"));

const IndexLo3 = () => {
  return (
    <div className="min-h-screen bg-background theme-lo3">
      <UrgencyBar />
      <HeroLo3 />
      <Suspense fallback={null}>
        <Mecanismo />
        <ComoFunciona />
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

export default IndexLo3;