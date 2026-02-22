/**
 * LandlordSidebar — Property Landlord Management vertical (14th).
 * businessPurpose === "landlord"
 *
 * Different from Real Estate Agent — this is the OWNER's perspective:
 * managing owned properties, tenants, leases, rent collection, maintenance.
 *
 * Backend endpoints:
 *   GET/POST /api/properties — landlord's property portfolio
 *   GET/POST /api/tenants — tenant profiles & lease info
 *   GET/POST /api/leases — lease agreements & renewals
 *   GET/POST /api/rent-collection — rent payments & receipts
 *   GET/POST /api/maintenance — maintenance requests & work orders
 */
import {
  Home, Users, FileSignature, DollarSign, Wrench, BarChart,
  Building2, Shield, Calculator, Pen, BookOpen, Search,
  Megaphone, MessageCircle,
} from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const LandlordSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Property Portfolio" />
      <ul className="space-y-1">
        <NavItem icon={<Home className="h-5 w-5" />} label="Landlord Hub" to="/landlord" currentPath={currentPath} />
        <NavItem icon={<Home className="h-5 w-5" />} label="My Properties" to="/property-listings" currentPath={currentPath} />
        <NavItem icon={<Users className="h-5 w-5" />} label="Tenants" to="/lead-management" currentPath={currentPath} />
        <NavItem icon={<FileSignature className="h-5 w-5" />} label="Lease Agreements" to="/contracts" currentPath={currentPath} />
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Rent Collection" to="/finance" currentPath={currentPath} />
        <NavItem icon={<Wrench className="h-5 w-5" />} label="Maintenance Requests" to="/finance/expenses" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Landlord Growth" />
      <ul className="space-y-1">
        <NavItem icon={<Building2 className="h-5 w-5" />} label="Vacancy Tracker" to="/inventory" currentPath={currentPath} />
        <NavItem icon={<BarChart className="h-5 w-5" />} label="Expense Reports" to="/reports/sales" currentPath={currentPath} />
        <NavItem icon={<Calculator className="h-5 w-5" />} label="ROI Calculator" to="/finance/tax" currentPath={currentPath} />
        <NavItem icon={<Shield className="h-5 w-5" />} label="Insurance Tracker" to="/settings" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Website & Marketing" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Blog & Content" to="/pages-blog" currentPath={currentPath} />
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
      </ul>
    </div>
  </>
);
