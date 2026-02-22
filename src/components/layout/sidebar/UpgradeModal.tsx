/**
 * UpgradeModal — Pro addon purchase dialog.
 * Shows module features, pricing, and purchase button.
 * Backend: purchaseAddon() should POST /api/merchant/addons { moduleId, price }
 */
import { X, Crown, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { RegionConfig } from "@/data/regionModules";

interface UpgradeModalProps {
  upgradeModule: string | null;
  selectedModule: { id: string; name: string; icon: string; category: string; features: readonly string[] | string[] } | null;
  selectedPrice: number | null;
  region: RegionConfig | null;
  purchaseAddon: (moduleId: string) => void;
  onClose: () => void;
}

export const UpgradeModal = ({ upgradeModule, selectedModule, selectedPrice, region, purchaseAddon, onClose }: UpgradeModalProps) => {
  if (!upgradeModule || !selectedModule) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 pb-5">
          <button onClick={onClose} className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl ring-2 ring-primary/20">
              {selectedModule.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Pro Add-on</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">{selectedModule.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedModule.category}</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{region?.currency.symbol}{selectedPrice}</span>
            <span className="text-sm text-muted-foreground">/ month</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Billed monthly · Cancel anytime</p>
        </div>

        {/* Features */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">What's included</p>
          <ul className="space-y-2.5">
            {selectedModule.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 space-y-2.5">
          <Button
            className="w-full gap-2 h-11 text-sm font-semibold"
            onClick={() => {
              purchaseAddon(upgradeModule);
              toast.success(`${selectedModule.name} activated! 🎉`, {
                description: `${region?.currency.symbol}${selectedPrice}/mo added to your subscription. Module is now accessible.`,
              });
              onClose();
            }}
          >
            <Sparkles className="h-4 w-4" />
            Upgrade Now — {region?.currency.symbol}{selectedPrice}/mo
          </Button>
          <button onClick={onClose} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
