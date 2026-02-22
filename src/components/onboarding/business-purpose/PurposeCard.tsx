import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Flame, Clock, Sparkles } from "lucide-react";
import type { PurposeOption, BusinessPurpose } from "./types";

interface PurposeCardProps {
  purpose: PurposeOption;
  selected: BusinessPurpose | null;
  isPopular: boolean;
  isRecent: boolean;
  isRecommended: boolean;
  viewMode: "grid" | "list";
  onSelect: (id: BusinessPurpose) => void;
}

const PurposeCard = ({ purpose, selected, isPopular, isRecent, isRecommended, viewMode, onSelect }: PurposeCardProps) => {
  const Icon = purpose.icon;
  const isSelected = selected === purpose.id;

  if (viewMode === "list") {
    return (
      <div
        onClick={() => onSelect(purpose.id)}
        className={`flex items-center gap-4 rounded-xl border p-3 cursor-pointer transition-all duration-200 hover:shadow-sm ${
          isSelected
            ? "ring-2 ring-primary border-primary bg-primary/5"
            : "border-border hover:border-primary/40 bg-card"
        }`}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${purpose.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm">{purpose.title}</h3>
            <span className="text-xs text-muted-foreground">{purpose.titleAr}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{purpose.description}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isRecommended && (
            <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] gap-0.5 font-medium">
              <Sparkles className="h-3 w-3" /> Recommended
            </Badge>
          )}
          {isPopular && !isRecommended && (
            <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px] gap-0.5 font-medium">
              <Flame className="h-3 w-3" /> Popular
            </Badge>
          )}
          {isSelected && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card
      onClick={() => onSelect(purpose.id)}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-lg" : "hover:border-primary/40"
      }`}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${purpose.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {isRecommended && (
              <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] gap-0.5 font-medium">
                <Sparkles className="h-3 w-3" /> Recommended
              </Badge>
            )}
            {isPopular && !isRecommended && (
              <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px] gap-0.5 font-medium">
                <Flame className="h-3 w-3" /> Popular
              </Badge>
            )}
            {isRecent && !isPopular && !isRecommended && (
              <Badge variant="outline" className="text-[10px] gap-0.5 font-medium text-muted-foreground">
                <Clock className="h-3 w-3" /> Recent
              </Badge>
            )}
            {isSelected && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{purpose.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{purpose.titleAr}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{purpose.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {purpose.examples.map((ex) => (
            <Badge key={ex} variant="outline" className="text-[10px] font-normal">
              {ex}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurposeCard;
