/**
 * SalonSidebar — Salon/Spa vertical.
 * businessPurpose === "salon"
 * Backend: /api/bookings, /api/services, /api/salon-staff, /api/clients
 */
import { Scissors, Calendar, ClipboardList, UserCog, Star, Sparkles, CalendarCheck, ScrollText, Pen, BookOpen, Image, Search, Megaphone, MessageCircle, Users } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const SalonSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Salon Management" />
      <ul className="space-y-1">
        <NavItem icon={<Scissors className="h-5 w-5" />} label="Bookings & Services" to="/salon" currentPath={currentPath} />
        <NavItem icon={<Calendar className="h-5 w-5" />} label="Bookings" to="/salon?tab=bookings" currentPath={currentPath} />
        <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Service Menu" to="/salon?tab=services" currentPath={currentPath} />
        <NavItem icon={<UserCog className="h-5 w-5" />} label="Staff Management" to="/salon?tab=staff" currentPath={currentPath} />
        <NavItem icon={<Star className="h-5 w-5" />} label="Client Loyalty" to="/salon?tab=loyalty" currentPath={currentPath} />
        <NavItem icon={<Sparkles className="h-5 w-5" />} label="Service Catalog" to="/salon?tab=catalog" currentPath={currentPath} />
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Staff Scheduling" to="/salon?tab=scheduling" currentPath={currentPath} />
        <NavItem icon={<ScrollText className="h-5 w-5" />} label="Customer History" to="/salon?tab=customers" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Salon Growth" />
      <ul className="space-y-1">
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Online Booking" to="/appointment-booking" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Website & Marketing" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Blog & Content" to="/pages-blog" currentPath={currentPath} />
        <NavItem icon={<Image className="h-5 w-5" />} label="Portfolio / Gallery" to="/portfolio-gallery" currentPath={currentPath} />
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
      </ul>
    </div>
  </>
);
