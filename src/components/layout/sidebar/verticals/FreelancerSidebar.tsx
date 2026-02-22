/**
 * FreelancerSidebar — Freelancer/Agency vertical.
 * businessPurpose === "freelancer"
 * Backend: /api/projects, /api/clients, /api/invoices, /api/proposals
 */
import { Briefcase, Image, FolderOpen, FileSignature, DollarSign, Receipt, Clock, Users, BookOpen, Pen, Mail, Search, Megaphone, MessageCircle } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const FreelancerSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Portfolio & Clients" />
      <ul className="space-y-1">
        <NavItem icon={<Briefcase className="h-5 w-5" />} label="Projects & Clients" to="/freelancer" currentPath={currentPath} />
        <NavItem icon={<Image className="h-5 w-5" />} label="Portfolio Showcase" to="/portfolio-gallery" currentPath={currentPath} />
        <NavItem icon={<FolderOpen className="h-5 w-5" />} label="Active Projects" to="/freelancer?tab=projects" currentPath={currentPath} />
        <NavItem icon={<FileSignature className="h-5 w-5" />} label="Proposals & Contracts" to="/contracts" currentPath={currentPath} />
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Invoices" to="/freelancer?tab=invoices" currentPath={currentPath} />
        <NavItem icon={<Receipt className="h-5 w-5" />} label="Invoicing" to="/freelancer?tab=invoicing" currentPath={currentPath} />
        <NavItem icon={<Clock className="h-5 w-5" />} label="Time Tracking" to="/freelancer?tab=timetracking" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Freelancer Growth" />
      <ul className="space-y-1">
        <NavItem icon={<Users className="h-5 w-5" />} label="Client Portal" to="/freelancer?tab=portal" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Blog & Thought Leadership" to="/pages-blog" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Website & Marketing" />
      <ul className="space-y-1">
        <NavItem icon={<Pen className="h-5 w-5" />} label="Page Builder" to="/page-builder" currentPath={currentPath} />
        <NavItem icon={<Mail className="h-5 w-5" />} label="Forms & Contact" to="/contact-forms" currentPath={currentPath} />
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        {isRouteVisible("/crm") && <NavItem icon={<Users className="h-5 w-5" />} label={t("nav.crm")} to="/crm" currentPath={currentPath} isAddon={isRouteAddon("/crm")} onAddonClick={setUpgradeModule} moduleId="crm" />}
      </ul>
    </div>
  </>
);
