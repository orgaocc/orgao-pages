import { Clock } from "lucide-react";
import { useLaunchConfig } from "@/hooks/useLaunchConfig";
import { formatStartLine } from "@/lib/dateRange";

const UrgencyBar = () => {
  const { config } = useLaunchConfig();
  const text = formatStartLine(config.week_start);
  const items = Array.from({ length: 8 });
  return (
    <div className="sticky top-0 z-50 bg-red-600 text-white font-bold overflow-hidden">
      <div className="relative flex overflow-hidden py-2">
        <div className="flex shrink-0 items-center gap-8 pr-8 animate-marquee whitespace-nowrap">
          {items.map((_, i) => (
            <span key={`a-${i}`} className="flex items-center gap-2 text-[13px] md:text-sm font-bold tracking-tight uppercase">
              <Clock className="w-4 h-4 shrink-0" aria-hidden />
              {text}
            </span>
          ))}
        </div>
        <div aria-hidden className="flex shrink-0 items-center gap-8 pr-8 animate-marquee whitespace-nowrap">
          {items.map((_, i) => (
            <span key={`b-${i}`} className="flex items-center gap-2 text-[13px] md:text-sm font-bold tracking-tight uppercase">
              <Clock className="w-4 h-4 shrink-0" aria-hidden />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UrgencyBar;