/**
 * BusinessWebsiteSidebar — Company/Portfolio website vertical.
 * businessPurpose === "business-website"
 * Backend: /api/pages, /api/blog, /api/forms, /api/portfolio
 */
import { Pen, BookOpen, Mail, Image, CalendarCheck, BarChart, MessageSquare, Search } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const BusinessWebsiteSidebar = ({ currentPath, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Website Management" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Blog & Content" to="/pages-blog" currentPath={currentPath} />
        <NavItem icon={<Mail className="h-5 w-5" />} label="Forms & Contact" to="/contact-forms" currentPath={currentPath} />
        <NavItem icon={<Image className="h-5 w-5" />} label="Portfolio / Gallery" to="/portfolio-gallery" currentPath={currentPath} />
        <NavItem icon={<CalendarCheck className="h-5 w-5" />} label="Appointment Booking" to="/appointment-booking" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Website Growth" />
      <ul className="space-y-1">
        <NavItem icon={<BarChart className="h-5 w-5" />} label="Website Analytics" to="/tracking/analytics" currentPath={currentPath} />
        <NavItem icon={<Mail className="h-5 w-5" />} label="Email Newsletter" to="/marketing" currentPath={currentPath} />
        <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Live Chat" to="/whatsapp-commerce" currentPath={currentPath} />
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
      </ul>
    </div>
  </>
);
