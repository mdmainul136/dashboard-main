/**
 * RealEstateSidebar — Real Estate vertical sidebar.
 * businessPurpose === "real-estate"
 * Backend: /api/properties, /api/leads, /api/agents, /api/contracts
 */
import { Home, Users, UserCog, Video, FileSignature, DollarSign, Radio, KeyRound, Megaphone, MessageCircle, Search, FileText } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const RealEstateSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Property Management" />
      <ul className="space-y-1">
        <NavItem icon={<Home className="h-5 w-5" />} label="Listings" to="/property-listings" currentPath={currentPath} />
        <NavItem icon={<Users className="h-5 w-5" />} label="Lead Management" to="/lead-management" currentPath={currentPath} />
        <NavItem icon={<UserCog className="h-5 w-5" />} label="Agent Management" to="/agent-management" currentPath={currentPath} />
        <NavItem icon={<Video className="h-5 w-5" />} label="Virtual Tours" to="/virtual-tours" currentPath={currentPath} />
        <NavItem icon={<FileSignature className="h-5 w-5" />} label="Contracts & Docs" to="/contracts" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Real Estate Growth" />
      <ul className="space-y-1">
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Valuations" to="/finance" currentPath={currentPath} />
        <NavItem icon={<Radio className="h-5 w-5" />} label="Portal Syndication" to="/sales-channels" currentPath={currentPath} />
        <NavItem icon={<KeyRound className="h-5 w-5" />} label="Tenant Management" to="/loyalty" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Marketing & CRM" />
      <ul className="space-y-1">
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        <NavItem icon={<FileText className="h-5 w-5" />} label={t("nav.pagesBlog")} to="/pages-blog" currentPath={currentPath} />
      </ul>
    </div>
  </>
);
