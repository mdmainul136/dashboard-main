/**
 * TravelSidebar — Travel/Tourism vertical.
 * businessPurpose === "travel"
 * Backend: /api/tours, /api/bookings, /api/destinations, /api/guides
 */
import { Plane, MapPin, CalendarCheck, Globe, ClipboardList, FileText, Shield, Pen, BookOpen, Search, Megaphone, MessageCircle, Users } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const TravelSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Travel Management" />
      <ul className="space-y-1">
        <NavItem icon={<Plane className="h-5 w-5" />} label="Tours & Bookings" to="/travel" currentPath={currentPath} />
        <NavItem icon={<MapPin className="h-5 w-5" />} label="Tour Packages" to="/travel?tab=tours" currentPath={currentPath} />
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Booking System" to="/travel?tab=bookings" currentPath={currentPath} />
        <NavItem icon={<Globe className="h-5 w-5" />} label="Destinations" to="/travel?tab=destinations" currentPath={currentPath} />
        <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Booking Management" to="/travel?tab=management" currentPath={currentPath} />
        <NavItem icon={<FileText className="h-5 w-5" />} label="Tour Itinerary" to="/travel?tab=itinerary" currentPath={currentPath} />
        <NavItem icon={<Shield className="h-5 w-5" />} label="Travel Insurance" to="/travel?tab=insurance" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Travel Growth" />
      <ul className="space-y-1">
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
