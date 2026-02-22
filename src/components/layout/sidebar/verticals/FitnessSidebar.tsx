/**
 * FitnessSidebar — Gym/Fitness vertical.
 * businessPurpose === "fitness"
 * Backend: /api/classes, /api/members, /api/trainers, /api/memberships
 */
import { Dumbbell, Calendar, Users, UserCog, CreditCard, Target, Leaf, Wrench, CalendarCheck, Pen, BookOpen, Search, Megaphone, MessageCircle } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const FitnessSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Fitness Management" />
      <ul className="space-y-1">
        <NavItem icon={<Dumbbell className="h-5 w-5" />} label="Classes & Members" to="/fitness" currentPath={currentPath} />
        <NavItem icon={<Calendar className="h-5 w-5" />} label="Class Schedule" to="/fitness?tab=schedule" currentPath={currentPath} />
        <NavItem icon={<Users className="h-5 w-5" />} label="Members" to="/fitness?tab=members" currentPath={currentPath} />
        <NavItem icon={<UserCog className="h-5 w-5" />} label="Trainer Profiles" to="/fitness?tab=trainers" currentPath={currentPath} />
        <NavItem icon={<CreditCard className="h-5 w-5" />} label="Membership Plans" to="/fitness?tab=plans" currentPath={currentPath} />
        <NavItem icon={<Target className="h-5 w-5" />} label="Progress Tracking" to="/fitness?tab=progress" currentPath={currentPath} />
        <NavItem icon={<Leaf className="h-5 w-5" />} label="Nutrition Plans" to="/fitness?tab=nutrition" currentPath={currentPath} />
        <NavItem icon={<Wrench className="h-5 w-5" />} label="Equipment" to="/fitness?tab=equipment" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Fitness Growth" />
      <ul className="space-y-1">
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Appointment Booking" to="/appointment-booking" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Website & Marketing" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Blog & Content" to="/pages-blog" currentPath={currentPath} />
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Appointment Booking" to="/appointment-booking" currentPath={currentPath} />
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
      </ul>
    </div>
  </>
);
