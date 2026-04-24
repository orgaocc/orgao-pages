import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import IndexLo2 from "./pages/IndexLo2.tsx";
import IndexLo2B from "./pages/IndexLo2B.tsx";
import IndexLo3 from "./pages/IndexLo3.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/jpe/lo1/" element={<Index />} />
          <Route path="/lo" element={<Index />} />
          <Route path="/jpe/lo2/" element={<IndexLo2 />} />
          <Route path="/jpe/lo2b" element={<IndexLo2B />} />
          <Route path="/jpe/lo2b/" element={<IndexLo2B />} />
          <Route path="/jpe/lo3/" element={<IndexLo3 />} />
          <Route path="/" element={<Navigate to="/jpe/lo1/" replace />} />
          <Route path="*" element={<Navigate to="/jpe/lo1/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
