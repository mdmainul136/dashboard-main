import { useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Rocket, Plus, X } from "lucide-react";
import { getRegionByCountry, allModules, regions, type RegionConfig } from "@/data/regionModules";
import type { BusinessPurpose } from "@/hooks/useMerchantRegion";

interface PlanSelectionProps {
  selected: string;
  onSelect: (plan: string) => void;
  country?: string;
  businessPurpose?: BusinessPurpose | null;
}

const ecommerceFeatures = {
  free: ["Up to 50 products", "Free subdomain", "Basic analytics", "Email support", "Core modules included", "1 staff account"],
  pro: ["Unlimited products", "Custom domain", "Advanced analytics", "Priority support", "5 staff accounts", "Multi-currency", "Marketing campaigns"],
  enterprise: ["Everything in Pro", "Unlimited staff", "Multi-branch support", "Dedicated account manager", "Custom API access", "SLA guarantee", "White-label option"],
};

const websiteFeatures = {
  free: ["Pages & Blog", "Free subdomain", "SEO Manager", "Email support", "Contact forms", "1 staff account"],
  pro: ["Custom domain", "Advanced SEO tools", "CRM integration", "Priority support", "5 staff accounts", "Marketing campaigns", "Analytics dashboard"],
  enterprise: ["Everything in Pro", "Unlimited staff", "Multi-site support", "Dedicated account manager", "Custom API access", "SLA guarantee", "White-label option"],
};

const realEstateFeatures = {
  free: ["Up to 20 listings", "Free subdomain", "Property search", "Email support", "Location maps", "1 staff account"],
  pro: ["Unlimited listings", "Custom domain", "Advanced filters", "Priority support", "5 agents", "Lead management", "Virtual tours"],
  enterprise: ["Everything in Pro", "Unlimited agents", "Multi-branch offices", "Dedicated account manager", "MLS integration", "SLA guarantee", "White-label option"],
};

const restaurantFeatures = {
  free: ["Digital menu", "Free subdomain", "QR code menu", "Email support", "Up to 50 items", "1 staff account"],
  pro: ["Online ordering", "Custom domain", "Table reservations", "Priority support", "5 staff accounts", "Delivery integration", "Analytics"],
  enterprise: ["Everything in Pro", "Unlimited staff", "Multi-branch support", "Dedicated account manager", "POS integration", "SLA guarantee", "White-label option"],
};

const iorFeatures = {
  free: ["Up to 5 scrapes/day", "Standard duty lookup", "Basic dashboard", "Email support", "1 staff account"],
  pro: ["Unlimited scraping", "Bulk import (up to 20)", "AI HS Code detection", "Advanced tax calculation", "5 staff accounts", "Sourcing filters"],
  enterprise: ["Bulk API access", "Unlimited staff", "White-label tracking portal", "Dedicated account manager", "Custom duty registry", "SLA guarantee"],
};

const getFeaturesForPurpose = (purpose: BusinessPurpose | null | undefined) => {
  switch (purpose) {
    case "business-website": return websiteFeatures;
    case "real-estate": return realEstateFeatures;
    case "restaurant": return restaurantFeatures;
    case "cross-border-ior": return iorFeatures;
    default: return ecommerceFeatures;
  }
};

const getPlanLabel = (purpose: BusinessPurpose | null | undefined) => {
  const labels: Partial<Record<BusinessPurpose, string>> = {
    "business-website": "Website Plan",
    "real-estate": "Property Plan",
    restaurant: "Restaurant Plan",
    lms: "Academy Plan",
    healthcare: "Healthcare Plan",
    fitness: "Fitness Plan",
    salon: "Salon Plan",
    freelancer: "Freelancer Plan",
    travel: "Travel Plan",
    automotive: "Auto Plan",
    event: "Event Plan",
    saas: "SaaS Plan",
    "cross-border-ior": "Sourcing Plan",
  };
  return labels[purpose || "ecommerce"] || "Store Plan";
};

const getDefaultPlans = (purpose: BusinessPurpose | null | undefined) => {
  const features = getFeaturesForPurpose(purpose);
  return [
    {
      id: "free", name: "Free", nameAr: "مجاني", price: 0, icon: Zap,
      description: "Perfect for getting started", color: "from-emerald-500 to-teal-600",
      features: features.free,
      limits: ["No custom domain", "Platform branding", "Limited storage (500MB)"],
    },
    {
      id: "pro", name: "Pro", nameAr: "احترافي", price: 99, icon: Crown,
      description: "For growing businesses", color: "from-primary to-blue-600", popular: true,
      features: features.pro,
      limits: [],
    },
    {
      id: "enterprise", name: "Enterprise", nameAr: "مؤسسات", price: -1, icon: Rocket,
      description: "Custom solutions for large businesses", color: "from-violet-500 to-purple-700",
      features: features.enterprise,
      limits: [],
    },
  ];
};
const PlanSelection = ({ selected, onSelect, country, businessPurpose }: PlanSelectionProps) => {
  const region = country ? getRegionByCountry(country) : null;
  const plans = region ? region.pricingPlans : null;
  const planLabel = getPlanLabel(businessPurpose);

  // Module selection for add-ons
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  const addonModules = useMemo(() => {
    if (!region) return [];
    return allModules.filter(m => region.modules[m.id] === "addon" && region.addonPricing[m.id] !== undefined);
  }, [region]);

  const coreModules = useMemo(() => {
    if (!region) return [];
    return allModules.filter(m => region.modules[m.id] === "core");
  }, [region]);

  const toggleAddon = useCallback((id: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const addonTotal = useMemo(() => {
    if (!region) return 0;
    let total = 0;
    selectedAddons.forEach(id => { total += region.addonPricing[id] || 0; });
    return total;
  }, [selectedAddons, region]);

  // If region detected, show region-specific plans + module picker
  if (region && plans) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Choose Your {planLabel}</h2>
          <p className="text-muted-foreground mt-1">
            {region.flag} {region.name} — <span className="text-primary italic">"{region.positioning}"</span>
          </p>
        </div>

        {/* Region Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isSelected = selected === plan.name.toLowerCase().replace(/\+/g, "plus").replace(/\s/g, "-");
            const planId = plan.name.toLowerCase().replace(/\+/g, "plus").replace(/\s/g, "-");
            return (
              <Card
                key={plan.name}
                className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:ring-1 hover:ring-border"
                  } ${plan.popular ? "sm:-mt-2" : ""}`}
                onClick={() => onSelect(planId)}
              >
                {plan.popular && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-blue-600" />}
                <CardContent className="p-5 text-center space-y-3">
                  <div className="flex items-start justify-between">
                    <div />
                    {plan.popular && <Badge className="bg-primary text-primary-foreground text-[9px]">★ Popular</Badge>}
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{plan.target}</p>
                  <p className="text-2xl font-bold text-foreground">{plan.price}</p>
                  <ul className="space-y-1.5 text-start">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Core Modules (included) */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">✅ Core Modules (Included)</h3>
          <div className="flex flex-wrap gap-1.5">
            {coreModules.map(mod => (
              <Badge key={mod.id} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                {mod.icon} {mod.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add-on Modules */}
        {addonModules.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">
              ➕ Add-on Modules <span className="text-[10px] text-muted-foreground font-normal">(select what you need)</span>
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {addonModules.map(mod => {
                const isAddonSelected = selectedAddons.has(mod.id);
                const price = region.addonPricing[mod.id];
                return (
                  <div key={mod.id} className="group relative">
                    <button
                      onClick={() => toggleAddon(mod.id)}
                      className={`w-full flex items-center gap-3 rounded-lg border p-3 text-start transition-all ${isAddonSelected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/40 bg-card hover:border-primary/30"
                        }`}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${isAddonSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                        }`}>
                        {isAddonSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className="text-base">{mod.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{mod.name}</p>
                        <p className="text-[10px] text-primary font-semibold">+{region.currency.symbol}{price}/mo</p>
                      </div>
                    </button>
                    {/* Tooltip */}
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
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add-on total */}
            {selectedAddons.size > 0 && (
              <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectedAddons.size} add-on{selectedAddons.size > 1 ? "s" : ""} selected
                </span>
                <span className="text-sm font-bold text-primary">
                  +{region.currency.symbol}{addonTotal}/mo
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback: default plans (no country selected)
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Choose Your {planLabel}</h2>
        <p className="text-muted-foreground mt-1">Start free, upgrade anytime as you grow</p>
        <p className="text-xs text-amber-400 mt-2">⚠️ Go back and select your country to see region-specific plans & modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {getDefaultPlans(businessPurpose).map((plan) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.id;
          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:ring-1 hover:ring-border"
                } ${plan.popular ? "md:-mt-3" : ""}`}
              onClick={() => onSelect(plan.id)}
            >
              {plan.popular && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-blue-600" />}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {plan.popular && <Badge className="bg-primary text-primary-foreground text-[10px]">Most Popular</Badge>}
                  {isSelected && (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{plan.nameAr} · {plan.description}</p>
                <div className="mb-5">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold text-foreground">Free</div>
                  ) : plan.price === -1 ? (
                    <div className="text-2xl font-bold text-foreground">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">SAR {plan.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  )}
                </div>
                <Button
                  variant={isSelected ? "default" : plan.popular ? "default" : "outline"}
                  className="w-full mb-5"
                  onClick={(e) => { e.stopPropagation(); onSelect(plan.id); }}
                >
                  {isSelected ? "Selected" : plan.price === -1 ? "Contact Sales" : "Select Plan"}
                </Button>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                  {plan.limits.map((l) => (
                    <li key={l} className="flex items-start gap-2 text-sm text-muted-foreground line-through">
                      <span className="h-4 w-4 mt-0.5 shrink-0 text-center text-xs">✕</span> {l}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelection;
