"use client";

import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { allModules } from "@/data/regionModules";
import { Crown, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const UpgradeProBanner = () => {
  const { region, isAddonPurchased } = useMerchantRegion();
  const router = useRouter();

  if (!region) return null;

  const totalAddons = allModules.filter((m) => region.modules[m.id] === "addon");
  const purchasedCount = totalAddons.filter((m) => isAddonPurchased(m.id)).length;
  const availableAddons = totalAddons.filter((m) => !isAddonPurchased(m.id));
  const totalCount = totalAddons.length;
  const progressPercent = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  if (availableAddons.length === 0) return null;

  const topModules = availableAddons.slice(0, 4);
  const remaining = availableAddons.length - topModules.length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />

      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Info */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-primary/20 ring-2 ring-amber-500/20">
            <Crown className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              Unlock Pro Modules
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                <Zap className="h-3 w-3" />
                {availableAddons.length} available
              </span>
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Supercharge your store with premium modules tailored for {region.name}
            </p>

            {/* Module pills */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {topModules.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/80 px-2 py-1 text-[10px] font-medium text-foreground"
                >
                  <span>{m.icon}</span> {m.name}
                  {region.addonPricing[m.id] && (
                    <span className="text-primary font-semibold">
                      {region.currency.symbol}{region.addonPricing[m.id]}
                    </span>
                  )}
                </span>
              ))}
              {remaining > 0 && (
                <span className="inline-flex items-center rounded-lg border border-border/50 bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground">
                  +{remaining} more
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-2.5">
              <div className="h-2 flex-1 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
                {purchasedCount}/{totalCount} unlocked
              </span>
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="shrink-0 sm:text-right">
          <Button
            onClick={() => router.push("/settings")}
            className="gap-2 text-sm font-semibold shadow-lg shadow-primary/20"
          >
            View All Modules
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Starting from {region.currency.symbol}
            {Math.min(...Object.values(region.addonPricing))}/mo
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeProBanner;
