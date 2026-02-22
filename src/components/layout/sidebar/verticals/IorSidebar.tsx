/**
 * IorSidebar — Cross-Border IOR vertical sidebar sections.
 * Shown when businessPurpose === "cross-border-ior".
 */
import {
    Zap,
    Search,
    ClipboardList,
    Warehouse,
    Truck,
    Globe,
    CreditCard,
    Settings2,
    Sparkles,
    ShieldCheck,
    FileText,
    Layers,
    Shield,
    Wallet,
    Package,
    Box,
    Calculator,
    Undo2
} from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const IorSidebar = ({ currentPath, t }: VerticalSidebarProps) => {
    return (
        <>
            {/* IOR Sourcing & Management */}
            <div>
                <SectionHeader label="Sourcing & Management" />
                <ul className="space-y-1">
                    <NavItem icon={<Zap className="h-5 w-5" />} label="Product Scraper" to="/ior/scraper" currentPath={currentPath} />
                    <NavItem icon={<Sparkles className="h-5 w-5" />} label="AI Studio" to="/ior/ai-studio" currentPath={currentPath} />
                    <NavItem icon={<Package className="h-5 w-5" />} label="Product Catalog" to="/ior/products" currentPath={currentPath} />
                    <NavItem icon={<Box className="h-5 w-5" />} label="Inventory Ledger" to="/ior/inventory" currentPath={currentPath} />
                </ul>
            </div>

            {/* Operations */}
            <div>
                <SectionHeader label="Operations" />
                <ul className="space-y-1">
                    <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Foreign Orders" to="/ior/orders" currentPath={currentPath} />
                    <NavItem icon={<Warehouse className="h-5 w-5" />} label="Logistics Hub" to="/ior/warehouse" currentPath={currentPath} />
                    <NavItem icon={<Layers className="h-5 w-5" />} label="Shipment Batches" to="/ior/shipment-batches" currentPath={currentPath} />
                    <NavItem icon={<Truck className="h-5 w-5" />} label="Courier Hub" to="/ior/couriers" currentPath={currentPath} />
                </ul>
            </div>

            {/* Finance & Compliance */}
            <div>
                <SectionHeader label="Finance & Compliance" />
                <ul className="space-y-1">
                    <NavItem icon={<Calculator className="h-5 w-5" />} label="Pricing Engine" to="/ior/pricing" currentPath={currentPath} />
                    <NavItem icon={<Search className="h-5 w-5" />} label="HS Code Matrix" to="/ior/hs-codes" currentPath={currentPath} />
                    <NavItem icon={<ShieldCheck className="h-5 w-5" />} label="IOR Compliance" to="/ior/customs" currentPath={currentPath} />
                    <NavItem icon={<CreditCard className="h-5 w-5" />} label="Billing Center" to="/ior/billing" currentPath={currentPath} />
                    <NavItem icon={<Wallet className="h-5 w-5" />} label="Payments" to="/ior/payments" currentPath={currentPath} />
                    <NavItem icon={<Undo2 className="h-5 w-5" />} label="Refund Manager" to="/ior/refunds" currentPath={currentPath} />
                    <NavItem icon={<FileText className="h-5 w-5" />} label="Invoices" to="/ior/invoices" currentPath={currentPath} />
                </ul>
            </div>

            {/* Administration */}
            <div>
                <SectionHeader label="Administration" />
                <ul className="space-y-1">
                    <NavItem icon={<Settings2 className="h-5 w-5" />} label="Module Settings" to="/ior/settings" currentPath={currentPath} />
                    <NavItem icon={<Globe className="h-5 w-5" />} label="Marketplace Admin" to="/ior/sourcing" currentPath={currentPath} />
                    <NavItem icon={<Shield className="h-5 w-5" />} label="System Tools" to="/ior/admin" currentPath={currentPath} />
                </ul>
            </div>
        </>
    );
};
