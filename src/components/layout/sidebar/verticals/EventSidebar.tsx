/**
 * EventSidebar — Events/Wedding vertical.
 * businessPurpose === "event"
 * Backend: /api/events, /api/venues, /api/vendors, /api/tickets
 */
import { PartyPopper, Calendar, Building2, Users, Ticket, Image, Megaphone, Pen, BookOpen, Search, MessageCircle } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const EventSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Event Management" />
      <ul className="space-y-1">
        <NavItem icon={<PartyPopper className="h-5 w-5" />} label="Events & Venues" to="/events" currentPath={currentPath} />
        <NavItem icon={<Calendar className="h-5 w-5" />} label="Event Manager" to="/events?tab=events" currentPath={currentPath} />
        <NavItem icon={<Building2 className="h-5 w-5" />} label="Venue Showcase" to="/events?tab=venues" currentPath={currentPath} />
        <NavItem icon={<Users className="h-5 w-5" />} label="Vendor Directory" to="/events?tab=vendors" currentPath={currentPath} />
        <NavItem icon={<Ticket className="h-5 w-5" />} label="RSVP & Tickets" to="/events?tab=rsvp" currentPath={currentPath} />
        <NavItem icon={<Image className="h-5 w-5" />} label="Event Gallery" to="/events?tab=gallery" currentPath={currentPath} />
        <NavItem icon={<Megaphone className="h-5 w-5" />} label="Event Marketing" to="/events?tab=marketing" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Event Growth" />
      <ul className="space-y-1">
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
      </ul>
    </div>
  </>
);
