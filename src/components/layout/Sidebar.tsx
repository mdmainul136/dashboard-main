"use client";

/**
 * ============================================================================
 * Sidebar â€” Dynamic Navigation Based on Business Purpose & Region
 * ============================================================================
 *
 * REFACTORED: This file is now an orchestrator that delegates to vertical-specific
 * sidebar components in ./sidebar/verticals/. Each vertical has its own file.
 *
 * See: src/components/layout/sidebar/ for all sub-components.
 * See: docs/ARCHITECTURE.md for the full sidebar architecture guide.
 *
 * ============================================================================
 */
import { useState, useCallback } from "react";
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BarChart3, Paintbrush, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { allModules, getAllCountries } from "@/data/regionModules";

import { NavItem } from "./sidebar/NavItem";
import { SectionHeader } from "./sidebar/SectionHeader";
import { RegionPicker } from "./sidebar/RegionPicker";
import { UpgradeModal } from "./sidebar/UpgradeModal";
import { SharedSections } from "./sidebar/SharedSections";

import {
  EcommerceSidebar,
  RealEstateSidebar,
  RestaurantSidebar,
  BusinessWebsiteSidebar,
  LMSSidebar,
  HealthcareSidebar,
  FitnessSidebar,
  SalonSidebar,
  FreelancerSidebar,
  TravelSidebar,
  AutomotiveSidebar,
  EventSidebar,
  SaaSSidebar,
  LandlordSidebar,
  EducationSidebar,
  IorSidebar
} from "./sidebar/verticals";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
  const { t, isRTL } = useLanguage();
  const { region, isModuleAvailable, getModuleStatus, setCountry, country, purchaseAddon, businessPurpose, isOnboarded } = useMerchantRegion();
  // ... (rest of variables omitted but I need to keep them)
  const isEcommerce = !businessPurpose || businessPurpose === "ecommerce";
  const [upgradeModule, setUpgradeModule] = useState<string | null>(null);

  const selectedModule = upgradeModule ? allModules.find(m => m.id === upgradeModule) : null;
  const selectedPrice = upgradeModule && region ? region.addonPricing[upgradeModule] : null;
  const allCountries = getAllCountries();

  /** Route-to-Module mapping for addon lock system - Synced with Backend keys */
  const moduleMap: Record<string, string> = {
    "/pos": "pos",
    "/crm": "crm",
    "/whatsapp-commerce": "whatsapp",
    "/marketplace": "marketplace",
    "/flash-sales": "flash-sales",
    "/marketing": "marketing",
    "/seo-manager": "seo",
    "/pages-blog": "pages",
    "/zatca": "zatca",
    "/saudi-services": "zatca",
    "/hrm": "hrm",
    "/hr": "hrm",
    "/branches": "branches",
    "/expenses": "finance",
    "/finance": "finance",
    "/inventory": "inventory",
    "/inventory/suppliers": "inventory",
    "/inventory/purchase-orders": "inventory",
    "/inventory/warehouse": "inventory",
    "/subscription-plans": "finance",
    "/staff-access": "hrm",
    "/ior": "ior",
    "/tracking": "tracking",
    "/website-analytics/server-tracking": "tracking",
    "/tracking/containers": "tracking",
    "/tracking/signals": "tracking",
    "/tracking/compliance": "tracking",
    "/tracking/attribution": "tracking"
  };

  const isRouteVisible = (route: string): boolean => {
    const moduleId = moduleMap[route];
    if (!moduleId) return true;
    return isModuleAvailable(moduleId);
  };

  const isRouteAddon = (route: string): boolean => {
    const moduleId = moduleMap[route];
    if (!moduleId || !region) return false;
    return getModuleStatus(moduleId) === "addon";
  };

  /** Shared props for all vertical sidebar components */
  const verticalProps = { currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t, isModuleAvailable };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-screen flex-col overflow-y-auto bg-sidebar scrollbar-thin transition-all duration-300 lg:static ${isRTL ? "right-0" : "left-0"
          } ${isOpen
            ? "w-72 translate-x-0"
            : isRTL
              ? "w-0 translate-x-full lg:translate-x-0 lg:overflow-hidden"
              : "w-0 -translate-x-full lg:translate-x-0 lg:overflow-hidden"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border/50">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 shadow-lg shadow-sidebar-primary/20">
              <LayoutDashboard className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TailAdmin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden rounded-lg p-1 text-sidebar-foreground hover:text-white hover:bg-sidebar-accent transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-6">
          {/* Region Picker */}
          <RegionPicker region={region} country={country} setCountry={setCountry} allCountries={allCountries} isOnboarded={isOnboarded} />

          {/* Main */}
          <div>
            <SectionHeader label={t("nav.main")} />
            <ul className="space-y-1">
              <NavItem icon={<LayoutDashboard className="h-5 w-5" />} label={t("nav.dashboard")} to="/" currentPath={currentPath} />
              <NavItem
                icon={<BarChart3 className="h-5 w-5" />}
                label={t("nav.platformDashboard")}
                currentPath={currentPath}
                children={[
                  { label: "Overview", to: "/platform-dashboard" },
                  { label: "Tenant Core", to: "/platform-dashboard/tenant-core" },
                  { label: "SaaS Platform", to: "/platform-dashboard/saas-platform" },
                ]}
              />
            </ul>
          </div>

          {/* Storefront */}
          <div>
            <SectionHeader label={t("nav.storefront")} />
            <ul className="space-y-1">
              <NavItem icon={<Paintbrush className="h-5 w-5" />} label={t("nav.themeBuilder")} to="/storefront" currentPath={currentPath} />
            </ul>
          </div>

          {/* ===== Vertical-specific sections ===== */}
          {isEcommerce && <EcommerceSidebar {...verticalProps} />}
          {businessPurpose === "real-estate" && <RealEstateSidebar {...verticalProps} />}
          {businessPurpose === "restaurant" && <RestaurantSidebar {...verticalProps} />}
          {businessPurpose === "business-website" && <BusinessWebsiteSidebar {...verticalProps} />}
          {businessPurpose === "lms" && <LMSSidebar {...verticalProps} />}
          {businessPurpose === "healthcare" && <HealthcareSidebar {...verticalProps} />}
          {businessPurpose === "fitness" && <FitnessSidebar {...verticalProps} />}
          {businessPurpose === "salon" && <SalonSidebar {...verticalProps} />}
          {businessPurpose === "freelancer" && <FreelancerSidebar {...verticalProps} />}
          {businessPurpose === "travel" && <TravelSidebar {...verticalProps} />}
          {businessPurpose === "automotive" && <AutomotiveSidebar {...verticalProps} />}
          {businessPurpose === "event" && <EventSidebar {...verticalProps} />}
          {businessPurpose === "saas" && <SaaSSidebar {...verticalProps} />}
          {businessPurpose === "landlord" && <LandlordSidebar {...verticalProps} />}
          {businessPurpose === "education" && <EducationSidebar {...verticalProps} />}
          {businessPurpose === "cross-border-ior" && <IorSidebar {...verticalProps} />}

          {/* ===== Shared sections (all verticals) ===== */}
          <SharedSections {...verticalProps} isEcommerce={isEcommerce} region={region} />
        </nav>
      </aside>

      {/* Upgrade Modal */}
      <UpgradeModal
        upgradeModule={upgradeModule}
        selectedModule={selectedModule ? { id: selectedModule.id, name: selectedModule.name, icon: selectedModule.icon, category: selectedModule.category, features: [...selectedModule.features] } : null}
        selectedPrice={selectedPrice}
        region={region}
        purchaseAddon={purchaseAddon}
        onClose={() => setUpgradeModule(null)}
      />
    </>
  );
};

export default Sidebar;
