import { useRef } from "react";
import { Check, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { purposes } from "./data";
import type { BusinessPurpose } from "./types";

interface RecommendedCarouselProps {
  recommended: { types: BusinessPurpose[]; reason: string };
  selected: BusinessPurpose | null;
  onSelect: (id: BusinessPurpose) => void;
}

const RecommendedCarousel = ({ recommended, selected, onSelect }: RecommendedCarouselProps) => {
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          {recommended.reason}
        </h3>
        {isMobile && (
          <div className="flex gap-1">
            <button onClick={() => scrollCarousel("left")} className="h-7 w-7 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scrollCarousel("right")} className="h-7 w-7 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={carouselRef}
        className={
          isMobile
            ? "flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1"
            : "grid gap-2 sm:grid-cols-3 lg:grid-cols-5"
        }
      >
        {recommended.types.map((rId) => {
          const p = purposes.find((x) => x.id === rId);
          if (!p) return null;
          const Icon = p.icon;
          const isSelected = selected === rId;
          return (
            <button
              key={rId}
              onClick={() => onSelect(rId)}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all hover:shadow-md ${
                isMobile ? "min-w-[130px] snap-start shrink-0" : ""
              } ${
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 bg-card"
              }`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${p.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground leading-tight">{p.title}</span>
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedCarousel;
