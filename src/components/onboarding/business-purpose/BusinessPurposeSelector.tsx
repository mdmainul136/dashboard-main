import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List, Clock, Check } from "lucide-react";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { useIsMobile } from "@/hooks/use-mobile";
import type { BusinessPurpose } from "./types";
import {
  purposes, popularIds, categoryMeta, categoryOrder,
  regionRecommendations, countryRecommendations,
  getRecentPurposes, saveRecentPurpose,
} from "./data";
import PurposeCard from "./PurposeCard";
import RecommendedCarousel from "./RecommendedCarousel";

interface BusinessPurposeSelectorProps {
  selected: BusinessPurpose | null;
  onSelect: (purpose: BusinessPurpose) => void;
}

const BusinessPurposeSelector = ({ selected, onSelect }: BusinessPurposeSelectorProps) => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">(isMobile ? "list" : "grid");
  const recentPurposes = useMemo(() => getRecentPurposes(), []);
  const { country, region } = useMerchantRegion();

  const recommended = useMemo(() => {
    if (country && countryRecommendations[country]) {
      return { types: countryRecommendations[country], reason: `Recommended for ${country}` };
    }
    if (region) {
      return regionRecommendations[region.id] || regionRecommendations["global"];
    }
    return regionRecommendations["global"];
  }, [country, region]);

  const handleSelect = (id: BusinessPurpose) => {
    saveRecentPurpose(id);
    onSelect(id);
  };

  const filtered = useMemo(() => {
    let items = purposes;
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleAr.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.examples.some((e) => e.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      items = items.filter((p) => p.category === activeCategory);
    }
    return items;
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof purposes>();
    for (const p of filtered) {
      const arr = map.get(p.category) || [];
      arr.push(p);
      map.set(p.category, arr);
    }
    return categoryOrder.filter((c) => map.has(c)).map((c) => ({ category: c, items: map.get(c)! }));
  }, [filtered]);

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">What are you building?</h2>
        <p className="text-muted-foreground mt-1">Choose your business type to get a tailored setup experience</p>
      </div>

      {/* Search + Category Chips */}
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search business type… e.g. Salon, Travel, SaaS" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`flex items-center justify-center h-10 w-10 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`} title="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`flex items-center justify-center h-10 w-10 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`} title="List view">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all flex items-center gap-1.5 ${
              !activeCategory ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            All ({purposes.length})
          </button>
          {categoryOrder.map((cat) => {
            const count = purposes.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;
            const meta = categoryMeta[cat];
            const CatIcon = meta.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all flex items-center gap-1.5 ${isActive ? meta.active + " shadow-sm" : meta.inactive}`}
              >
                <CatIcon className="h-3.5 w-3.5" />
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Recently Selected */}
      {recentPurposes.length > 0 && !search && !activeCategory && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Recently Selected
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentPurposes.map((rId) => {
              const p = purposes.find((x) => x.id === rId);
              if (!p) return null;
              const Icon = p.icon;
              return (
                <button
                  key={rId}
                  onClick={() => handleSelect(rId)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all hover:shadow-sm ${
                    selected === rId ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-card"
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${p.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium text-foreground">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Region Recommended */}
      {!search && !activeCategory && (
        <RecommendedCarousel recommended={recommended} selected={selected} onSelect={handleSelect} />
      )}

      {/* Grouped Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {grouped.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No business type found for "{search}"</p>
          </div>
        )}
        {grouped.map(({ category, items }) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{category}</h3>
            <div className={viewMode === "grid" ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-2"}>
              {items.map((purpose) => (
                <PurposeCard
                  key={purpose.id}
                  purpose={purpose}
                  selected={selected}
                  isPopular={popularIds.has(purpose.id)}
                  isRecent={recentPurposes.includes(purpose.id)}
                  isRecommended={recommended.types.includes(purpose.id)}
                  viewMode={viewMode}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessPurposeSelector;
