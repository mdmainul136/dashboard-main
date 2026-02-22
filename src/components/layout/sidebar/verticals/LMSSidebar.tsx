/**
 * LMSSidebar — Learning Management System vertical.
 * businessPurpose === "lms"
 * Backend: /api/courses, /api/students, /api/quizzes, /api/certificates
 */
import { GraduationCap, BookOpen, Users, Video as VideoIcon, Target, Award, Trophy, MessageSquare, Sparkles, BarChart, DollarSign, Megaphone, MessageCircle, Search, FileText } from "lucide-react";
import { NavItem } from "../NavItem";
import { SectionHeader } from "../SectionHeader";
import type { VerticalSidebarProps } from "../types";

export const LMSSidebar = ({ currentPath, isRouteVisible, isRouteAddon, setUpgradeModule, t }: VerticalSidebarProps) => (
  <>
    <div>
      <SectionHeader label="Learning Management" />
      <ul className="space-y-1">
        <NavItem icon={<GraduationCap className="h-5 w-5" />} label="LMS Dashboard" to="/lms" currentPath={currentPath} />
        <NavItem icon={<BookOpen className="h-5 w-5" />} label="Course Builder" to="/lms?tab=courses" currentPath={currentPath} />
        <NavItem icon={<Users className="h-5 w-5" />} label="Students" to="/lms?tab=students" currentPath={currentPath} />
        <NavItem icon={<VideoIcon className="h-5 w-5" />} label="Live Classes" to="/lms?tab=live" currentPath={currentPath} />
        <NavItem icon={<Target className="h-5 w-5" />} label="Quizzes" to="/lms?tab=quizzes" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Engagement & Growth" />
      <ul className="space-y-1">
        <NavItem icon={<Award className="h-5 w-5" />} label="Certificates" to="/lms?tab=certificates" currentPath={currentPath} />
        <NavItem icon={<Trophy className="h-5 w-5" />} label="Gamification" to="/lms?tab=gamification" currentPath={currentPath} />
        <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Discussion Forum" to="/lms?tab=discussion" currentPath={currentPath} />
        <NavItem icon={<Sparkles className="h-5 w-5" />} label="AI Recommendations" to="/lms?tab=recommendations" currentPath={currentPath} />
        <NavItem icon={<BarChart className="h-5 w-5" />} label="Analytics" to="/lms?tab=analytics" currentPath={currentPath} />
      </ul>
    </div>
    <div>
      <SectionHeader label="Monetization & Marketing" />
      <ul className="space-y-1">
        <NavItem icon={<DollarSign className="h-5 w-5" />} label="Monetization" to="/lms?tab=monetization" currentPath={currentPath} />
        {isRouteVisible("/marketing") && <NavItem icon={<Megaphone className="h-5 w-5" />} label={t("nav.marketing")} to="/marketing" currentPath={currentPath} isAddon={isRouteAddon("/marketing")} onAddonClick={setUpgradeModule} moduleId="marketing" />}
        {isRouteVisible("/whatsapp-commerce") && <NavItem icon={<MessageCircle className="h-5 w-5" />} label={t("nav.whatsapp")} to="/whatsapp-commerce" currentPath={currentPath} isAddon={isRouteAddon("/whatsapp-commerce")} onAddonClick={setUpgradeModule} moduleId="whatsapp" />}
        <NavItem icon={<Search className="h-5 w-5" />} label={t("nav.seo")} to="/seo-manager" currentPath={currentPath} />
        <NavItem icon={<FileText className="h-5 w-5" />} label={t("nav.pagesBlog")} to="/pages-blog" currentPath={currentPath} />
      </ul>
    </div>
  </>
);
