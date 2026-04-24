import { Clock } from "lucide-react";

const UrgencyBar = () => {
  return (
    <div className="sticky top-0 z-50 bg-red-600 text-white">
      <div className="flex items-center justify-center gap-2 py-2 px-4 text-center">
        <Clock className="w-4 h-4 shrink-0" aria-hidden />
        <p className="text-[13px] md:text-sm font-semibold tracking-tight">
          <span className="hidden sm:inline">Começa na próxima segunda — 27 de Abril</span>
          <span className="sm:hidden">Começa segunda · 27/04</span>
        </p>
      </div>
    </div>
  );
};

export default UrgencyBar;