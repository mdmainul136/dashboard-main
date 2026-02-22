/**
 * RestaurantSidebar — Restaurant/Cafe vertical sidebar.
 * businessPurpose === "restaurant"
 * Backend: /api/menu, /api/restaurant-orders, /api/tables, /api/kitchen
 */
import { BookOpen, ClipboardList, Table2, ChefHat, CreditCard, Bike, Leaf, Star, Users, Megaphone, MessageCircle, Search, FileText } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const RestaurantSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Restaurant Operations" />
      <ul className="space-y-1">
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Menu Management" to="/menu-management" currentPath={currentPath} />
        <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Order Management" to="/restaurant-orders" currentPath={currentPath} />
        <NavItem icon={<Table2 className="h-5 w-5" />} label="Table & Reservations" to="/table-reservations" currentPath={currentPath} />
        <NavItem icon={<ChefHat className="h-5 w-5" />} label="Kitchen Display" to="/kitchen-display" currentPath={currentPath} />
        <NavItem icon={<CreditCard className="h-5 w-5" />} label="Restaurant POS" to="/pos" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Delivery & Growth" />
      <ul className="space-y-1">
        <NavItem icon={<Bike className="h-5 w-5" />} label="Delivery & Takeout" to="/delivery" currentPath={currentPath} />
        <NavItem icon={<Leaf className="h-5 w-5" />} label="Ingredient Inventory" to="/inventory" currentPath={currentPath} />
        <NavItem icon={<Star className="h-5 w-5" />} label="Customer Loyalty" to="/loyalty" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Marketing & CRM" />
      <ul className="space-y-1">
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        <NavItem icon={<FileText className="h-5 w-5" />} label={t("nav.pagesBlog")} to="/pages-blog" currentPath={currentPath} />
      </ul>
    </div>
  </>
);
