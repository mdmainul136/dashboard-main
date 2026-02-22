/**
 * RegionPicker — Country/region selector dropdown in the sidebar.
 * Backend: Calls setMerchantCountry() which should PUT /api/merchant { country }
 */
import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RegionConfig } from "@/data/regionModules";

interface RegionPickerProps {
  region: RegionConfig | null;
  country: string;
  setCountry: (country: string) => void;
  allCountries: { name: string; flag: string; code: string }[];
  isOnboarded?: boolean;
}

export const RegionPicker = ({ region, country, setCountry, allCountries, isOnboarded }: RegionPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search
    ? allCountries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
    : allCountries;

  const currentCountry = allCountries.find(c => c.name === country);

  return (
    <div className="px-4 mb-4 relative group">
      <button
        onClick={() => { if (!isOnboarded) setOpen(!open); }}
        disabled={isOnboarded}
        className={`w-full text-left transition-all duration-300 ${isOnboarded ? 'cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
      >
        <div className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all duration-300
          ${isOnboarded
            ? 'bg-sidebar-accent/20 border-sidebar-border/40 text-sidebar-foreground/50'
            : 'bg-gradient-to-br from-sidebar-accent/50 to-sidebar-accent/10 border-sidebar-border hover:border-sidebar-primary/30 hover:shadow-lg hover:shadow-sidebar-primary/5 shadow-sm'}
        `}>
          {/* Flag & Status icon */}
          <div className="relative">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 backdrop-blur-md shadow-inner text-base transition-transform duration-300 ${open ? 'scale-110' : ''}`}>
              {region ? region.flag : "🌍"}
            </div>
            {isOnboarded && (
              <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sidebar-primary shadow-sm border border-sidebar animate-in zoom-in duration-300">
                <Lock className="h-2 w-2 text-white" />
              </div>
            )}
          </div>

          {/* Region Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold text-sidebar-foreground/40 uppercase tracking-widest leading-none mb-1">
              {isOnboarded ? "Locked Market" : "Active Region"}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate max-w-[100px]">
                {region ? region.name.split("(")[0].trim() : "Select Market"}
              </span>
              {currentCountry && (
                <span className="px-1.5 py-0.5 rounded-lg bg-sidebar-primary/20 text-sidebar-primary text-[9px] font-black tracking-tighter border border-sidebar-primary/20">
                  {currentCountry.code}
                </span>
              )}
            </div>
          </div>

          {/* Chevron */}
          {!isOnboarded && (
            <ChevronDown className={`h-4 w-4 text-sidebar-foreground/30 transition-all duration-300 ${open ? "rotate-180 text-sidebar-primary" : "group-hover:text-sidebar-foreground/50"}`} />
          )}
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 mx-1 rounded-2xl border border-sidebar-border bg-sidebar/95 backdrop-blur-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
          <div className="p-3 border-b border-sidebar-border/30 bg-sidebar-accent/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Find your country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-sidebar-border bg-sidebar/50 px-3.5 py-2 text-xs text-sidebar-foreground outline-none placeholder:text-sidebar-foreground/30 focus:border-sidebar-primary/40 focus:ring-4 focus:ring-sidebar-primary/5 transition-all"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
            {filtered.map((c) => (
              <button
                key={c.name}
                onClick={() => { setCountry(c.name); setOpen(false); setSearch(""); }}
                className={`
                  flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all duration-200 group/item
                  ${country === c.name
                    ? "bg-sidebar-primary/15 text-white font-bold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"}
                `}
              >
                <span className="text-lg transition-transform group-hover/item:scale-125 duration-300">{c.flag}</span>
                <span className="flex-1 text-left font-medium">{c.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${country === c.name ? "bg-sidebar-primary/20 border-sidebar-primary/30 text-sidebar-primary" : "bg-sidebar-accent/30 border-sidebar-border/50 text-sidebar-foreground/40"}`}>
                  {c.code}
                </span>
                {country === c.name && <div className="h-1.5 w-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_rgba(var(--sidebar-primary),0.8)]" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center space-y-2">
                <div className="text-2xl opacity-20">🏳️</div>
                <p className="text-xs text-sidebar-foreground/40 font-medium">We couldn't find that country</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
