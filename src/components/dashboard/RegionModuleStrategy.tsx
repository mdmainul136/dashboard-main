import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, X, Plus, Globe, CreditCard, TrendingUp, Search, Rocket, Zap, ShieldCheck, Trophy, Calculator } from "lucide-react";
import { regions, allModules, getModulesByCategory, type RegionConfig, type ModuleStatus } from "@/data/regionModules";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<ModuleStatus, { label: string; color: string; icon: React.ElementType }> = {
  core: { label: "Core", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: Check },
  addon: { label: "Add-on", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Plus },
  na: { label: "N/A", color: "bg-muted/50 text-muted-foreground/50 border-border/30", icon: X },
};

// All countries mapped to region
const countryToRegion: Record<string, string> = {};
regions.forEach(r => r.countries.forEach(c => { countryToRegion[c] = r.id; }));
const allCountries = regions.flatMap(r => r.countries.map(c => ({ name: c, flag: r.flag, regionId: r.id }))).sort((a, b) => a.name.localeCompare(b.name));

// Competitor data per region
const competitorData: Record<string, { competitors: { name: string; icon: string; features: Record<string, boolean | string> }[]; ourFeatures: Record<string, boolean | string> }> = {
  mena: {
    competitors: [
      { name: "Salla", icon: "🟣", features: { "Multi-Vendor Marketplace": false, "POS System": true, "ERP Module": false, "HRM Module": false, "WhatsApp Commerce": true, "ZATCA Compliance": true, "Global Multi-Currency": false, "API/Developer Portal": "Limited", "Flash Sales": true, "Multi-Branch": false } },
      { name: "Shopify", icon: "🟢", features: { "Multi-Vendor Marketplace": "App", "POS System": true, "ERP Module": false, "HRM Module": false, "WhatsApp Commerce": "App", "ZATCA Compliance": false, "Global Multi-Currency": true, "API/Developer Portal": true, "Flash Sales": "App", "Multi-Branch": "App" } },
    ],
    ourFeatures: { "Multi-Vendor Marketplace": true, "POS System": true, "ERP Module": true, "HRM Module": true, "WhatsApp Commerce": true, "ZATCA Compliance": true, "Global Multi-Currency": true, "API/Developer Portal": true, "Flash Sales": true, "Multi-Branch": true },
  },
  europe: {
    competitors: [
      { name: "Shopify", icon: "🟢", features: { "GDPR Built-in": "App", "Multi-Currency EU": true, "POS System": true, "ERP Module": false, "MENA Expansion": false, "WhatsApp Commerce": "App", "Marketplace": "App", "Klarna/SEPA": true, "API Access": true, "HRM Module": false } },
      { name: "WooCommerce", icon: "🔵", features: { "GDPR Built-in": "Plugin", "Multi-Currency EU": "Plugin", "POS System": "Plugin", "ERP Module": "Plugin", "MENA Expansion": false, "WhatsApp Commerce": "Plugin", "Marketplace": "Plugin", "Klarna/SEPA": "Plugin", "API Access": true, "HRM Module": false } },
    ],
    ourFeatures: { "GDPR Built-in": true, "Multi-Currency EU": true, "POS System": true, "ERP Module": true, "MENA Expansion": true, "WhatsApp Commerce": true, "Marketplace": true, "Klarna/SEPA": true, "API Access": true, "HRM Module": true },
  },
  "south-asia": {
    competitors: [
      { name: "Shopify", icon: "🟢", features: { "Affordable Starter": false, "bKash/JazzCash/UPI": false, "WhatsApp Commerce": "App", "COD Support": true, "Flash Sales": "App", "No ERP Overhead": false, "Local Payment": false, "Low-cost Plan": false, "Marketplace": "App", "Arabic/RTL": true } },
      { name: "Daraz/Seller", icon: "🟠", features: { "Affordable Starter": true, "bKash/JazzCash/UPI": true, "WhatsApp Commerce": false, "COD Support": true, "Flash Sales": true, "No ERP Overhead": true, "Local Payment": true, "Low-cost Plan": true, "Marketplace": false, "Arabic/RTL": false } },
    ],
    ourFeatures: { "Affordable Starter": true, "bKash/JazzCash/UPI": true, "WhatsApp Commerce": true, "COD Support": true, "Flash Sales": true, "No ERP Overhead": true, "Local Payment": true, "Low-cost Plan": true, "Marketplace": true, "Arabic/RTL": true },
  },
  global: {
    competitors: [
      { name: "Shopify", icon: "🟢", features: { "All-in-One Platform": false, "POS + CRM + ERP": false, "Saudi/MENA Ready": false, "Modular Pricing": false, "WhatsApp Commerce": "App", "Multi-Vendor": "App", "API Portal": true, "HRM Module": false, "Flash Sales": "App", "White-Label": false } },
      { name: "BigCommerce", icon: "🔴", features: { "All-in-One Platform": false, "POS + CRM + ERP": false, "Saudi/MENA Ready": false, "Modular Pricing": false, "WhatsApp Commerce": false, "Multi-Vendor": "App", "API Portal": true, "HRM Module": false, "Flash Sales": false, "White-Label": false } },
    ],
    ourFeatures: { "All-in-One Platform": true, "POS + CRM + ERP": true, "Saudi/MENA Ready": true, "Modular Pricing": true, "WhatsApp Commerce": true, "Multi-Vendor": true, "API Portal": true, "HRM Module": true, "Flash Sales": true, "White-Label": true },
  },
};

const RegionModuleStrategy = () => {
  const [activeRegion, setActiveRegion] = useState<string>("mena");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const categories = getModulesByCategory();

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const regionId = countryToRegion[country];
    if (regionId) setActiveRegion(regionId);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
            <Globe className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">🌍 Region-Wise Module Strategy</h2>
            <p className="text-xs text-muted-foreground">Different regions, different needs — modular bundling per market</p>
          </div>
        </div>

        {/* Country Auto-Detect Selector */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[200px] h-9 text-xs">
              <SelectValue placeholder="🔍 Select your country..." />
            </SelectTrigger>
            <SelectContent>
              {allCountries.map(c => (
                <SelectItem key={c.name} value={c.name} className="text-xs">
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Region Tabs */}
      <Tabs value={activeRegion} onValueChange={(v) => { setActiveRegion(v); setSelectedCountry(""); }}>
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1.5 bg-muted/50">
          {regions.map(r => (
            <TabsTrigger key={r.id} value={r.id} className="flex items-center gap-1.5 text-xs px-3 py-2">
              <span className="text-base">{r.flag}</span>
              <span className="hidden sm:inline">{r.name}</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">{r.countries.length}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {regions.map(r => (
          <TabsContent key={r.id} value={r.id} className="space-y-6 mt-6">
            {/* South Asia CTA Banner */}
            {r.id === "south-asia" && <SouthAsiaCTA />}

            <RegionDetail region={r} categories={categories} />

            {/* Competitor Comparison */}
            <CompetitorComparison regionId={r.id} />

            {/* Interactive Pricing Calculator */}
            <ModulePricingCalculator region={r} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Cross-Region Comparison Table */}
      <ComparisonMatrix />
    </div>
  );
};

/* ─── South Asia CTA Banner ─── */
const SouthAsiaCTA = () => (
  <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
    <CardContent className="pt-6 pb-5 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-xl shadow-primary/30">
          <Rocket className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">🚀 Start Selling in 5 Minutes!</h3>
            <Badge className="bg-primary text-primary-foreground text-[10px]">Starter+ $9/mo</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            শুধু eCommerce — <strong>WhatsApp + Flash Sales + COD</strong> সহ। কোনো ERP, POS বা HRM এর জটিলতা নেই।
            India, Bangladesh, Pakistan-এর entrepreneurs দের জন্য পারফেক্ট।
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["Storefront", "Products", "Orders", "Payments", "Delivery", "WhatsApp", "Flash Sales"].map(f => (
              <Badge key={f} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                <Check className="h-3 w-3 mr-0.5" /> {f}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-3xl font-bold text-primary">$9</span>
          <span className="text-[10px] text-muted-foreground">/month</span>
          <Badge variant="outline" className="text-[9px] mt-1">No hidden fees</Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ─── Region Detail Panel ─── */
const RegionDetail = ({
  region,
  categories,
}: {
  region: RegionConfig;
  categories: Record<string, typeof allModules[number][]>;
}) => {
  return (
    <div className="space-y-6">
      {/* Region Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="text-2xl">{region.flag}</span> {region.name}
              </h3>
              <p className="text-sm text-primary font-medium mt-1 italic">"{region.positioning}"</p>
            </div>
            <Collapsible>
              <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground underline">
                📍 {region.countries.length} Countries
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {region.countries.map(c => (
                    <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid by Category */}
      <div className="space-y-4">
        {Object.entries(categories).map(([cat, mods]) => {
          const visibleMods = mods.filter(m => region.modules[m.id] !== undefined);
          if (visibleMods.length === 0) return null;

          return (
            <div key={cat}>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h4>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visibleMods.map(mod => {
                  const status = region.modules[mod.id] || "na";
                  const cfg = statusConfig[status];
                  const Icon = cfg.icon;
                  const addonPrice = status === "addon" ? region.addonPricing[mod.id] : null;

                  return (
                    <div
                      key={mod.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                        status === "core"
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : status === "addon"
                          ? "border-blue-500/20 bg-blue-500/5"
                          : "border-border/20 bg-muted/20 opacity-50"
                      }`}
                    >
                      <span className="text-lg">{mod.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{mod.name}</p>
                        {addonPrice && (
                          <p className="text-[10px] text-blue-400">+{region.currency.symbol}{addonPrice}/mo</p>
                        )}
                      </div>
                      <Badge className={`text-[9px] shrink-0 ${cfg.color}`}>
                        <Icon className="h-3 w-3 mr-0.5" />
                        {cfg.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {region.paymentMethods.map(pm => (
              <Badge key={pm.name} variant="outline" className="px-3 py-1.5 text-xs">
                <span className="mr-1.5">{pm.icon}</span> {pm.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance */}
      {region.compliance.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">Compliance:</span>
          {region.compliance.map(c => (
            <Badge key={c} className="bg-amber-500/10 text-amber-400 border-amber-500/25 text-[10px]">{c}</Badge>
          ))}
        </div>
      )}

      {/* Pricing Plans */}
      <div>
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" /> Pricing ({region.currency.code})
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {region.pricingPlans.map(plan => (
            <Card
              key={plan.name}
              className={`relative transition-all hover:shadow-md ${plan.popular ? "border-primary shadow-primary/10 shadow-md" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-[9px]">★ Popular</Badge>
                </div>
              )}
              <CardContent className="pt-5 text-center space-y-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{plan.name}</p>
                  <p className="text-[10px] text-muted-foreground">{plan.target}</p>
                </div>
                <p className="text-xl font-bold text-foreground">{plan.price}</p>
                <ul className="space-y-1.5 text-start">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <Check className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Competitor Comparison ─── */
const CompetitorComparison = ({ regionId }: { regionId: string }) => {
  const data = competitorData[regionId];
  if (!data) return null;

  const featureKeys = Object.keys(data.ourFeatures);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" /> ⚔️ Competitor Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-start px-3 py-2.5 font-semibold text-foreground min-w-[150px]">Feature</th>
                <th className="text-center px-3 py-2.5 font-semibold text-primary min-w-[100px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base">🏆</span>
                    <span>Ours</span>
                  </div>
                </th>
                {data.competitors.map(c => (
                  <th key={c.name} className="text-center px-3 py-2.5 font-semibold text-muted-foreground min-w-[100px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-base">{c.icon}</span>
                      <span>{c.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureKeys.map(feat => (
                <tr key={feat} className="border-b border-border/20 hover:bg-muted/20">
                  <td className="px-3 py-2 font-medium text-foreground">{feat}</td>
                  <td className="text-center px-3 py-2">
                    <FeatureCell value={data.ourFeatures[feat]} isOurs />
                  </td>
                  {data.competitors.map(c => (
                    <td key={c.name} className="text-center px-3 py-2">
                      <FeatureCell value={c.features[feat]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const FeatureCell = ({ value, isOurs }: { value: boolean | string | undefined; isOurs?: boolean }) => {
  if (value === true) {
    return (
      <Badge className={`text-[9px] ${isOurs ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-500/10 text-emerald-400/70 border-emerald-500/20"}`}>
        <Check className="h-3 w-3" />
      </Badge>
    );
  }
  if (value === false || value === undefined) {
    return (
      <Badge className="text-[9px] bg-destructive/10 text-destructive/60 border-destructive/20">
        <X className="h-3 w-3" />
      </Badge>
    );
  }
  // string value like "App", "Plugin", "Limited"
  return (
    <Badge className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/25">{String(value)}</Badge>
  );
};

/* ─── Interactive Module Pricing Calculator ─── */
const ModulePricingCalculator = ({ region }: { region: RegionConfig }) => {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  const addonModules = useMemo(() => {
    return allModules.filter(m => region.modules[m.id] === "addon" && region.addonPricing[m.id] !== undefined);
  }, [region]);

  const toggleAddon = useCallback((id: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const basePlan = region.pricingPlans.find(p => p.popular) || region.pricingPlans[1];
  const basePriceNum = parseFloat(basePlan?.price.replace(/[^0-9.]/g, "") || "0");

  const addonTotal = useMemo(() => {
    let total = 0;
    selectedAddons.forEach(id => { total += region.addonPricing[id] || 0; });
    return total;
  }, [selectedAddons, region]);

  const monthlyTotal = basePriceNum + addonTotal;
  const yearlyTotal = monthlyTotal * 12;
  const yearlySaved = monthlyTotal * 12 * 0.2; // 20% annual discount

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          🧮 Module Pricing Calculator
          <Badge variant="outline" className="text-[9px] ml-auto">{region.flag} {region.currency.code}</Badge>
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          Base plan: <strong>{basePlan?.name}</strong> ({basePlan?.price}) — select add-ons to calculate total
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add-on Module Grid */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {addonModules.map(mod => {
            const isSelected = selectedAddons.has(mod.id);
            const price = region.addonPricing[mod.id];
            return (
              <div key={mod.id} className="group relative">
                <button
                  onClick={() => toggleAddon(mod.id)}
                  className={`w-full flex items-center gap-3 rounded-lg border p-3 text-start transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/40 bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                    isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                  }`}>
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span className="text-base">{mod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{mod.name}</p>
                    <p className="text-[10px] text-primary font-semibold">+{region.currency.symbol}{price}/mo</p>
                  </div>
                </button>
                {/* Feature Tooltip */}
                {"features" in mod && (mod as any).features && (
                  <div className="absolute z-50 bottom-full left-0 right-0 mb-1.5 hidden group-hover:block">
                    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl text-xs space-y-1.5">
                      <p className="font-bold text-foreground text-[11px]">{mod.icon} {mod.name}</p>
                      <ul className="space-y-1">
                        {((mod as any).features as string[]).map((f: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                            <Check className="h-3 w-3 text-emerald-400 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[9px] text-primary font-medium pt-1">+{region.currency.symbol}{price}/mo</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cost Summary */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Base Plan ({basePlan?.name})</span>
            <span className="font-medium text-foreground">{region.currency.symbol}{basePriceNum.toFixed(0)}/mo</span>
          </div>
          {selectedAddons.size > 0 && (
            <div className="space-y-1.5">
              {Array.from(selectedAddons).map(id => {
                const mod = allModules.find(m => m.id === id);
                const price = region.addonPricing[id];
                return (
                  <div key={id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">+ {mod?.icon} {mod?.name}</span>
                    <span className="text-foreground">{region.currency.symbol}{price}/mo</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="border-t border-border/40 pt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Monthly Total</span>
            <span className="text-xl font-bold text-primary">{region.currency.symbol}{monthlyTotal.toFixed(0)}/mo</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Annual (20% discount)</span>
            <span className="text-emerald-400 font-medium">
              {region.currency.symbol}{(yearlyTotal - yearlySaved).toFixed(0)}/yr
              <span className="line-through ml-1.5 text-muted-foreground/50">{region.currency.symbol}{yearlyTotal.toFixed(0)}</span>
            </span>
          </div>
          {selectedAddons.size === 0 && (
            <p className="text-[10px] text-muted-foreground/70 text-center italic pt-1">
              👆 Select add-on modules above to calculate your custom pricing
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* ─── Cross-Region Comparison Matrix ─── */
const ComparisonMatrix = () => {
  const keyModules = allModules.filter(m =>
    ["pos", "crm", "whatsapp", "marketplace", "flash-sales", "erp", "hrm", "zatca", "gdpr"].includes(m.id)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">📊 Cross-Region Module Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-start px-3 py-2.5 font-semibold text-foreground min-w-[160px]">Module</th>
                {regions.map(r => (
                  <th key={r.id} className="text-center px-3 py-2.5 font-semibold text-foreground">
                    <span className="text-base block">{r.flag}</span>
                    <span className="text-[10px] text-muted-foreground">{r.name.split(" ")[0]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keyModules.map(mod => (
                <tr key={mod.id} className="border-b border-border/20 hover:bg-muted/20">
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {mod.icon} {mod.name}
                  </td>
                  {regions.map(r => {
                    const status = r.modules[mod.id] || "na";
                    const cfg = statusConfig[status];
                    return (
                      <td key={r.id} className="text-center px-3 py-2.5">
                        <Badge className={`text-[9px] ${cfg.color}`}>{cfg.label}</Badge>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionModuleStrategy;
