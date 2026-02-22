/**
 * AutomotiveSidebar — Automotive vertical.
 * businessPurpose === "automotive"
 * Backend: /api/vehicles, /api/service-bookings, /api/parts, /api/fleet
 */
import { Car, Wrench, Gauge, DollarSign, Package, History, UserCheck, Users, Truck, Pen, BookOpen, Search, Megaphone, MessageCircle } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const AutomotiveSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Auto Management" />
      <ul className="space-y-1">
        <NavItem icon={<Car className="h-5 w-5" />} label="Vehicles & Services" to="/automotive" currentPath={currentPath} />
        <NavItem icon={<Wrench className="h-5 w-5" />} label="Service Booking" to="/automotive?tab=services" currentPath={currentPath} />
        <NavItem icon={<Gauge className="h-5 w-5" />} label="Test Drives" to="/automotive?tab=testdrives" currentPath={currentPath} />
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Finance Calculator" to="/automotive?tab=finance" currentPath={currentPath} />
        <NavItem icon={<Package className="h-5 w-5" />} label="Parts Catalog" to="/automotive?tab=parts" currentPath={currentPath} />
        <NavItem icon={<History className="h-5 w-5" />} label="Service History" to="/automotive?tab=servicehistory" currentPath={currentPath} />
        <NavItem icon={<UserCheck className="h-5 w-5" />} label="Customer Vehicles" to="/automotive?tab=customersvehicles" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Automotive Growth" />
      <ul className="space-y-1">
        <NavItem icon={<Users className="h-5 w-5" />} label="Lead Management" to="/lead-management" currentPath={currentPath} />
        <NavItem icon={<Truck className="h-5 w-5" />} label="Fleet Management" to="/automotive?tab=fleet" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Website & Marketing" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Blog & Content" to="/pages-blog" currentPath={currentPath} />
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
      </ul>
    </div>
  </>
);
