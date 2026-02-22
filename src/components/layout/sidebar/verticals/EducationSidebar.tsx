/**
 * EducationSidebar — Education / Coaching Center vertical (15th).
 * businessPurpose === "education"
 *
 * For coaching centers, tuition classes, language schools, skill academies.
 *
 * Backend endpoints:
 *   GET/POST /api/education/classes    — class schedule & batches
 *   GET/POST /api/education/students   — student enrollment & profiles
 *   GET/POST /api/education/attendance — daily attendance tracking
 *   GET/POST /api/education/fees       — fee collection & receipts
 *   GET/POST /api/education/exams      — exam scheduling & results
 */
import {
  School, Users, CalendarCheck, DollarSign, ClipboardList, BarChart,
  Pen, BookOpen, Search, Megaphone, MessageCircle,
} from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const EducationSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Education Management" />
      <ul className="space-y-1">
        <NavItem icon={<School className="h-5 w-5" />} label="Education Hub" to="/education" currentPath={currentPath} />
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Class Schedule" to="/appointment-booking" currentPath={currentPath} />
        <NavItem icon={<Users className="h-5 w-5" />} label="Students" to="/lead-management" currentPath={currentPath} />
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Fee Collection" to="/finance" currentPath={currentPath} />
        <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Attendance" to="/expenses" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Academic Growth" />
      <ul className="space-y-1">
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Exams & Results" to="/reviews" currentPath={currentPath} />
        <NavItem icon={<BarChart className="h-5 w-5" />} label="Performance Reports" to="/reports/sales" currentPath={currentPath} />
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
