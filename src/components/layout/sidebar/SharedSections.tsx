/**
 * SharedSections — Sidebar sections shown for ALL business verticals.
 * Includes: Platform & Compliance, Finance, Reports, Operations, Others.
 *
 * Backend note: These sections use the same routes regardless of businessPurpose.
 * The isRouteVisible/isRouteAddon checks are region-based (from useMerchantRegion).
 */
import {
  Receipt, Shield, LayoutGrid, Globe, Layers, BarChart3,
  TrendingUp, FileBarChart, PieChart, UserCog, Gift,
  Building2, ScrollText, Star, Calendar, UserCircle, Lock,
} from "lucide-react";
import { NavItem } from "./NavItem";
import { SectionHeader } from "./SectionHeader";
import type { VerticalSidebarProps } from "./types";

interface SharedSectionsProps extends VerticalSidebarProps {
  isEcommerce: boolean;
  region: any;
}

export const SharedSections = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t, isModuleAvailable, isEcommerce, region }: SharedSectionsProps) => (
  <>
    {/* Platform & Compliance */}
    <div>
      <SectionHeader label={t("nav.platform")} />
      <ul className="space-y-1">
        {isRouteVisible("/zatca") && <NavItem icon={<Receipt className="h-5 w-5" />} label={t("nav.zatca")} to="/zatca" currentPath={currentPath} />}
        {isRouteVisible("/staff-access") && <NavItem icon={<Shield className="h-5 w-5" />} label={t("nav.staffAccess")} to="/staff-access" currentPath={currentPath} isAddon={isRouteAddon("/staff-access")} onAddonClick={setUpgradeModule} moduleId="hrm" />}
        <NavItem icon={<LayoutGrid className="h-5 w-5" />} label={t("nav.appMarketplace")} to="/app-marketplace" currentPath={currentPath} />
        {isRouteVisible("/saudi-services") && <NavItem icon={<Globe className="h-5 w-5" />} label={t("nav.saudiServices")} to="/saudi-services" currentPath={currentPath} />}
        <NavItem icon={<Layers className="h-5 w-5" />} label={t("nav.developer")} to="/developer" currentPath={currentPath} />
      </ul>
    </div>

    {/* Finance & Accounting */}
    <div>
      <SectionHeader label={t("nav.finance")} />
      <ul className="space-y-1">
        <NavItem icon={<BarChart3 className="h-5 w-5" />} label={t("nav.financeOverview")} to="/finance" currentPath={currentPath} />
        <NavItem icon={<Globe className="h-5 w-5" />} label={t("nav.taxCurrency")} to="/finance/tax" currentPath={currentPath} />
      </ul>
    </div>

    {/* Reports & Analytics */}
    <div>
      <SectionHeader label={t("nav.reports")} />
      <ul className="space-y-1">
        <NavItem icon={<TrendingUp className="h-5 w-5" />} label={isEcommerce ? t("nav.salesReport") : "Performance Report"} to="/reports/sales" currentPath={currentPath} />
        {isEcommerce && <NavItem icon={<FileBarChart className="h-5 w-5" />} label={t("nav.inventoryReport")} to="/reports/inventory" currentPath={currentPath} />}
        <NavItem icon={<PieChart className="h-5 w-5" />} label={isEcommerce ? t("nav.customerInsights") : "Visitor Insights"} to="/reports/customers" currentPath={currentPath} />
      </ul>
    </div>

    {/* HR & Loyalty (eCommerce only) */}
    {isEcommerce && (isModuleAvailable("hrm") || isRouteAddon("/hrm") || !region) && (
      <div>
        <SectionHeader label={t("nav.hr")} />
        <ul className="space-y-1">
          <NavItem icon={<UserCog className="h-5 w-5" />} label={t("nav.staffManagement")} to="/hrm" currentPath={currentPath} isAddon={isRouteAddon("/hrm")} onAddonClick={setUpgradeModule} moduleId="hrm" />
          <NavItem icon={<Gift className="h-5 w-5" />} label={t("nav.loyalty")} to="/loyalty" currentPath={currentPath} />
        </ul>
      </div>
    )}

    {/* Operations */}
    <div>
      <SectionHeader label={t("nav.operations")} />
      <ul className="space-y-1">
        {isRouteVisible("/branches") && <NavItem icon={<Building2 className="h-5 w-5" />} label={t("nav.branches")} to="/branches" currentPath={currentPath} isAddon={isRouteAddon("/branches")} onAddonClick={setUpgradeModule} moduleId="branches" />}
        {isRouteVisible("/expenses") && <NavItem icon={<Receipt className="h-5 w-5" />} label={t("nav.expenses")} to="/finance/expenses" currentPath={currentPath} isAddon={isRouteAddon("/expenses")} onAddonClick={setUpgradeModule} moduleId="finance" />}
        <NavItem icon={<ScrollText className="h-5 w-5" />} label={t("nav.auditLog")} to="/audit-log" currentPath={currentPath} />
        {isEcommerce && <NavItem icon={<Star className="h-5 w-5" />} label={t("nav.reviews")} to="/reviews" currentPath={currentPath} />}
      </ul>
    </div>

    {/* Others */}
    <div>
      <SectionHeader label={t("nav.others")} />
      <ul className="space-y-1">
        <NavItem icon={<Calendar className="h-5 w-5" />} label={t("nav.calendar")} to="/calendar" currentPath={currentPath} />
        <NavItem icon={<UserCircle className="h-5 w-5" />} label={t("nav.profile")} to="/profile" currentPath={currentPath} />
        <NavItem
          icon={<Layers className="h-5 w-5" />}
          label={t("nav.pages")}
          currentPath={currentPath}
          children={[{ label: t("nav.settings"), to: "/settings" }]}
        />
        <NavItem
          icon={<Lock className="h-5 w-5" />}
          label={t("nav.auth")}
          currentPath={currentPath}
          children={[
            { label: t("nav.signIn"), to: "/auth/signin" },
            { label: t("nav.signUp"), to: "/auth/signup" },
          ]}
        />
      </ul>
    </div>
  </>
);
