/**
 * EcommerceSidebar — eCommerce vertical sidebar sections.
 * Shown when businessPurpose === "ecommerce" or null (default).
 *
 * Sections: Sales & Commerce | Marketplace & Growth | Inventory & Stock
 *
 * Backend data: Orders, Products, POS transactions, CRM contacts, Marketplace vendors
 * API endpoints: /api/orders, /api/products, /api/pos/sessions, /api/crm/contacts
 */
import {
  ClipboardList, ShoppingCart, RotateCcw, Store, CreditCard, Repeat, Truck,
  Users, Megaphone, MessageCircle, Zap, Search, FileText,
  Package, Warehouse, Activity, Shield, BarChart3, Globe
} from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const EcommerceSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t, isModuleAvailable }: VerticalSidebarProps) => {
  const region = !isModuleAvailable("__check__"); // dummy to keep signature; actual region check via isRouteVisible

  return (
    <>
      {/* Sales & Commerce */}
      <div>
        <SectionHeader label={t("nav.sales")} />
        <ul className="space-y-1">
          <NavItem icon={<ClipboardList className="h-5 w-5" />} label={t("nav.orders")} to="/ecommerce/orders" currentPath={currentPath} />
          {isRouteVisible("/pos") && <NavItem icon={<ShoppingCart className="h-5 w-5" />} label={t("nav.pos")} to="/pos" currentPath={currentPath} isAddon={isRouteAddon("/pos")} onAddonClick={setUpgradeModule} moduleId="pos" />}
          <NavItem icon={<RotateCcw className="h-5 w-5" />} label={t("nav.returns")} to="/ecommerce/returns" currentPath={currentPath} />
          <NavItem icon={<Store className="h-5 w-5" />} label={t("nav.salesChannels")} to="/ecommerce/sales-channels" currentPath={currentPath} />
          <NavItem icon={<CreditCard className="h-5 w-5" />} label={t("nav.payments")} to="/ecommerce/payment-channels" currentPath={currentPath} />
          {isRouteVisible("/ecommerce/subscription-plans") && <NavItem icon={<Repeat className="h-5 w-5" />} label={t("nav.subscriptions")} to="/ecommerce/subscription-plans" currentPath={currentPath} />}
          <NavItem icon={<Truck className="h-5 w-5" />} label={t("nav.delivery")} to="/ecommerce/delivery" currentPath={currentPath} />
        </ul>
      </div>

      {/* Marketplace & Growth */}
      <div>
        <SectionHeader label={t("nav.marketplace")} />
        <ul className="space-y-1">
          {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
          {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
          {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
          {isRouteVisible("/marketplace") && <NavItem icon={<Store className="h-5 w-5" />} label={t("nav.marketplaceItem")} to="/marketplace" currentPath={currentPath} isAddon={isRouteAddon("/marketplace")} onAddonClick={setUpgradeModule} moduleId="marketplace" />}
          {isRouteVisible("/flash-sales") && <NavItem icon={<Zap className="h-5 w-5" />} label={t("nav.flashSales")} to="/flash-sales" currentPath={currentPath} isAddon={isRouteAddon("/flash-sales")} onAddonClick={setUpgradeModule} moduleId="flash-sales" />}
          <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
          <NavItem icon={<FileText className="h-5 w-5" />} label={t("nav.pagesBlog")} to="/pages-blog" currentPath={currentPath} />
        </ul>
      </div>

      {/* Inventory & Stock */}
      {(isModuleAvailable("inventory") || isRouteAddon("/inventory/suppliers") || true) && (
        <div>
          <SectionHeader label={t("nav.inventory")} />
          <ul className="space-y-1">
            <NavItem
              icon={<Package className="h-5 w-5" />}
              label={t("nav.inventoryItem")}
              currentPath={currentPath}
              children={[
                { label: t("nav.stockOverview"), to: "/inventory" },
                { label: t("nav.products"), to: "/inventory/products" },
              ]}
            />
            {isRouteVisible("/inventory/suppliers") && <NavItem icon={<Truck className="h-5 w-5" />} label={t("nav.suppliers")} to="/inventory/suppliers" currentPath={currentPath} isAddon={isRouteAddon("/inventory/suppliers")} onAddonClick={setUpgradeModule} moduleId="inventory" />}
            {isRouteVisible("/inventory/purchase-orders") && <NavItem icon={<ClipboardList className="h-5 w-5" />} label={t("nav.purchaseOrders")} to="/inventory/purchase-orders" currentPath={currentPath} isAddon={isRouteAddon("/inventory/purchase-orders")} onAddonClick={setUpgradeModule} moduleId="inventory" />}
            {isRouteVisible("/inventory/warehouse") && <NavItem icon={<Warehouse className="h-5 w-5" />} label={t("nav.warehouse")} to="/inventory/warehouse" currentPath={currentPath} isAddon={isRouteAddon("/inventory/warehouse")} onAddonClick={setUpgradeModule} moduleId="inventory" />}
          </ul>
        </div>
      )}

      {/* Tracking & Intelligence */}
      {isRouteVisible("/tracking") && (
        <div>
          <SectionHeader label="Tracking & Intelligence" />
          <ul className="space-y-1">
            <NavItem
              icon={<Zap className="h-5 w-5 text-amber-500" />}
              label="Tracking Module"
              to="/tracking"
              currentPath={currentPath}
              isAddon={isRouteAddon("/tracking")}
              onAddonClick={setUpgradeModule}
              moduleId="tracking"
              children={[
                { label: "Fleet Overview", to: "/tracking" },
                { label: "Container Management", to: "/tracking/containers" },
                { label: "Signal Diagnostics", to: "/tracking/signals" },
                { label: "Compliance & Privacy", to: "/tracking/compliance" },
                { label: "Attribution Settings", to: "/tracking/attribution" },
              ]}
            />
            {isRouteVisible("/tracking/analytics") && (
              <NavItem
                icon={<BarChart3 className="h-5 w-5" />}
                label={t("nav.analytics")}
                to="/tracking/analytics"
                currentPath={currentPath}
              />
            )}
          </ul>
        </div>
      )}
    </>
  );
};
