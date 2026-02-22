/**
 * SaaSSidebar — SaaS/Digital Product vertical.
 * businessPurpose === "saas"
 * Backend: /api/saas/plans, /api/saas/changelog, /api/saas/analytics
 */
import { Rocket, DollarSign, FileText, Target, BarChart, CreditCard, Flag, UserPlus, Pen, Code, Search, Megaphone, MessageCircle, Users } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const SaaSSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Product Management" />
      <ul className="space-y-1">
        <NavItem icon={<Rocket className="h-5 w-5" />} label="Product Dashboard" to="/saas-product" currentPath={currentPath} />
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Plans & Pricing" to="/saas-product?tab=plans" currentPath={currentPath} />
        <NavItem icon={<FileText className="h-5 w-5" />} label="Changelog" to="/saas-product?tab=changelog" currentPath={currentPath} />
        <NavItem icon={<Target className="h-5 w-5" />} label="Roadmap" to="/saas-product?tab=roadmap" currentPath={currentPath} />
        <NavItem icon={<BarChart className="h-5 w-5" />} label="Product Analytics" to="/saas-product?tab=analytics" currentPath={currentPath} />
        <NavItem icon={<CreditCard className="h-5 w-5" />} label="Subscriptions" to="/saas-product?tab=subscriptions" currentPath={currentPath} />
        <NavItem icon={<Flag className="h-5 w-5" />} label="Feature Flags" to="/saas-product?tab=featureflags" currentPath={currentPath} />
        <NavItem icon={<UserPlus className="h-5 w-5" />} label="User Onboarding" to="/saas-product?tab=onboarding" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="SaaS Growth" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Landing Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<Code className="h-5 w-5" />} label="Integrations Hub" to="/developer" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Marketing & CRM" />
      <ul className="space-y-1">
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
      </ul>
    </div>
  </>
);
