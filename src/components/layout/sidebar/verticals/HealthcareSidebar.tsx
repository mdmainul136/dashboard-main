/**
 * HealthcareSidebar — Healthcare/Clinic vertical.
 * businessPurpose === "healthcare"
 * Backend: /api/patients, /api/appointments, /api/doctors, /api/prescriptions
 */
import { Heart, CalendarCheck, ClipboardList, CalendarDays, FileCheck, UserCog, Pill, DollarSign, Video, Pen, BookOpen, Mail, Search, Megaphone, MessageCircle, Users } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const HealthcareSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Healthcare Management" />
      <ul className="space-y-1">
        <NavItem icon={<Heart className="h-5 w-5" />} label="Patient Management" to="/healthcare" currentPath={currentPath} />
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Appointments" to="/healthcare?tab=appointments" currentPath={currentPath} />
        <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Patient Records" to="/healthcare?tab=records" currentPath={currentPath} />
        <NavItem icon={<CalendarDays className="h-5 w-5" />} label="Appointment Calendar" to="/healthcare?tab=calendar" currentPath={currentPath} />
        <NavItem icon={<FileCheck className="h-5 w-5" />} label="Prescriptions" to="/healthcare?tab=prescriptions" currentPath={currentPath} />
        <NavItem icon={<UserCog className="h-5 w-5" />} label="Doctor Profiles" to="/healthcare?tab=doctors" currentPath={currentPath} />
        <NavItem icon={<Pill className="h-5 w-5" />} label="Pharmacy" to="/healthcare?tab=pharmacy" currentPath={currentPath} />
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Medical Billing" to="/healthcare?tab=billing" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Healthcare Growth" />
      <ul className="space-y-1">
        <NavItem icon={<Video className="h-5 w-5" />} label="Telemedicine" to="/healthcare?tab=telemedicine" currentPath={currentPath} />
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Appointment Booking" to="/appointment-booking" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Website & Marketing" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Blog & Content" to="/pages-blog" currentPath={currentPath} />
        <NavItem icon={<Mail className="h-5 w-5" />} label="Forms & Contact" to="/contact-forms" currentPath={currentPath} />
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
      </ul>
    </div>
  </>
);
