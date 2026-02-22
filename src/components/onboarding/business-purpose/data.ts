/**
 * ============================================================================
 * Business Purpose Data — Vertical Definitions & Region Recommendations
 * ============================================================================
 *
 * PURPOSE:
 *   Contains all 13 business vertical definitions shown in the onboarding
 *   "What are you building?" selector. Also defines region-based and
 *   country-based recommendations to guide merchants to popular choices.
 *
 * KEY EXPORTS:
 *   - purposes[] → The 13 PurposeOption cards with icons, descriptions, examples
 *   - categoryOrder[] → Display order for the 5 category filters
 *   - regionRecommendations{} → Top 5 business types per region
 *   - countryRecommendations{} → Country-level overrides (e.g., Saudi → auto, salon)
 *   - popularIds → Set of trending business types (shown with badge)
 *
 * USED BY:
 *   - BusinessPurposeSelector.tsx → Renders the purpose cards
 *   - RecommendedCarousel.tsx → Shows region-based top picks
 *
 * ============================================================================
 */
import {
  ShoppingBag, Globe, Building, UtensilsCrossed, GraduationCap,
  Heart, Dumbbell, Scissors, Briefcase, Plane, Car, PartyPopper, Rocket, Home,
  School,
} from "lucide-react";
import type { BusinessPurpose, PurposeOption } from "./types";

// Popular types shown with a trending badge
export const popularIds: Set<BusinessPurpose> = new Set([
  "ecommerce", "restaurant", "salon", "saas", "healthcare", "cross-border-ior",
]);

// Region-based recommended business types
export const regionRecommendations: Record<string, { types: BusinessPurpose[]; reason: string }> = {
  mena: {
    types: ["ecommerce", "restaurant", "real-estate", "salon", "event"],
    reason: "Top business types in the MENA region",
  },
  europe: {
    types: ["ecommerce", "saas", "freelancer", "travel", "fitness"],
    reason: "Trending business types in Europe",
  },
  "south-asia": {
    types: ["ecommerce", "restaurant", "lms", "healthcare", "cross-border-ior"],
    reason: "Fast-growing sectors in South Asia",
  },
  global: {
    types: ["ecommerce", "saas", "business-website", "lms", "freelancer"],
    reason: "Most popular business types worldwide",
  },
};

// Country-specific overrides for more precision
export const countryRecommendations: Record<string, BusinessPurpose[]> = {
  "Saudi Arabia": ["ecommerce", "restaurant", "real-estate", "salon", "automotive"],
  UAE: ["ecommerce", "real-estate", "restaurant", "travel", "event"],
  Egypt: ["ecommerce", "restaurant", "freelancer", "lms", "healthcare"],
  Turkey: ["ecommerce", "restaurant", "travel", "salon", "automotive"],
  India: ["ecommerce", "lms", "freelancer", "healthcare", "restaurant"],
  Bangladesh: ["ecommerce", "restaurant", "lms", "cross-border-ior", "healthcare"],
  Pakistan: ["ecommerce", "restaurant", "real-estate", "freelancer", "lms"],
  UK: ["ecommerce", "saas", "freelancer", "salon", "fitness"],
  Germany: ["ecommerce", "saas", "automotive", "fitness", "freelancer"],
  France: ["ecommerce", "restaurant", "salon", "travel", "event"],
  USA: ["ecommerce", "saas", "freelancer", "fitness", "healthcare"],
};

export const purposes: PurposeOption[] = [
  { id: "ecommerce", icon: ShoppingBag, title: "Online Store", titleAr: "متجر إلكتروني", description: "Sell physical or digital products online with full eCommerce tools", examples: ["Fashion", "Electronics", "Grocery", "Handmade"], color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", category: "Commerce" },
  { id: "restaurant", icon: UtensilsCrossed, title: "Restaurant / Cafe", titleAr: "مطعم / كافيه", description: "Digital menu, online ordering, and table reservations", examples: ["Restaurant", "Cafe", "Bakery", "Cloud Kitchen"], color: "text-rose-500 bg-rose-500/10 border-rose-500/30", category: "Commerce" },
  { id: "business-website", icon: Globe, title: "Business Website", titleAr: "موقع تجاري", description: "Company portfolio, services showcase, or personal brand website", examples: ["Consulting", "Agency", "Freelancer", "Healthcare"], color: "text-blue-500 bg-blue-500/10 border-blue-500/30", category: "Services & Professionals" },
  { id: "freelancer", icon: Briefcase, title: "Freelancer / Agency", titleAr: "فريلانسر / وكالة", description: "Portfolio showcase, client management, and project booking", examples: ["Designer", "Developer", "Writer", "Marketing Agency"], color: "text-orange-500 bg-orange-500/10 border-orange-500/30", category: "Services & Professionals" },
  { id: "salon", icon: Scissors, title: "Salon / Spa", titleAr: "صالون / سبا", description: "Beauty services booking, staff management, and product sales", examples: ["Hair Salon", "Barber", "Spa", "Nail Studio"], color: "text-pink-500 bg-pink-500/10 border-pink-500/30", category: "Services & Professionals" },
  { id: "real-estate", icon: Building, title: "Real Estate", titleAr: "عقارات", description: "Property listings, real estate agency, or rental management site", examples: ["Apartments", "Villas", "Commercial", "Land"], color: "text-amber-500 bg-amber-500/10 border-amber-500/30", category: "Listings & Bookings" },
  { id: "travel", icon: Plane, title: "Travel / Tourism", titleAr: "سفر / سياحة", description: "Tour packages, booking system, and destination showcases", examples: ["Travel Agency", "Tour Operator", "Hotel", "Adventure"], color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30", category: "Listings & Bookings" },
  { id: "automotive", icon: Car, title: "Automotive", titleAr: "سيارات", description: "Vehicle listings, service booking, and parts catalog", examples: ["Car Dealer", "Auto Repair", "Car Rental", "Parts Store"], color: "text-slate-500 bg-slate-500/10 border-slate-500/30", category: "Listings & Bookings" },
  { id: "event", icon: PartyPopper, title: "Events / Wedding", titleAr: "فعاليات / أعراس", description: "Event planning, venue showcase, RSVP, and vendor management", examples: ["Wedding Planner", "Conference", "Venue", "DJ / Entertainment"], color: "text-purple-500 bg-purple-500/10 border-purple-500/30", category: "Listings & Bookings" },
  { id: "healthcare", icon: Heart, title: "Healthcare / Clinic", titleAr: "عيادة / رعاية صحية", description: "Manage appointments, patient records, and medical services online", examples: ["Clinic", "Hospital", "Dentist", "Pharmacy"], color: "text-sky-500 bg-sky-500/10 border-sky-500/30", category: "Health & Wellness" },
  { id: "fitness", icon: Dumbbell, title: "Gym / Fitness", titleAr: "جيم / لياقة", description: "Manage memberships, class schedules, and trainer profiles", examples: ["Gym", "Yoga Studio", "CrossFit", "Sports Academy"], color: "text-red-500 bg-red-500/10 border-red-500/30", category: "Health & Wellness" },
  { id: "lms", icon: GraduationCap, title: "Learning Platform", titleAr: "منصة تعليمية", description: "Create & sell online courses, manage students, and host live classes", examples: ["Online Academy", "Tutoring", "Corporate Training", "Skill Platform"], color: "text-violet-500 bg-violet-500/10 border-violet-500/30", category: "Tech & Education" },
  { id: "saas", icon: Rocket, title: "SaaS / Digital Product", titleAr: "منتج رقمي", description: "SaaS landing page, pricing plans, API docs, and user onboarding", examples: ["Analytics Tool", "CRM", "Project Mgmt", "AI Platform"], color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30", category: "Tech & Education" },
  { id: "landlord", icon: Home, title: "Landlord / Property Owner", titleAr: "مالك عقارات", description: "Manage rental properties, tenants, leases, and maintenance requests", examples: ["Apartments", "Houses", "Commercial", "Mixed-Use"], color: "text-teal-500 bg-teal-500/10 border-teal-500/30", category: "Listings & Bookings" },
  { id: "education", icon: School, title: "Education / Coaching", titleAr: "تعليم / مركز تدريب", description: "Manage classes, students, attendance, and fee collection for coaching centers", examples: ["Coaching Center", "Tuition", "Language School", "Skill Academy"], color: "text-lime-600 bg-lime-500/10 border-lime-500/30", category: "Tech & Education" },
  { id: "cross-border-ior", icon: Globe, title: "Product Sourcing & IOR", titleAr: "الاستيراد العابر للحدود", description: "Internal product sourcing tool, IOR compliance, and international logistics management", examples: ["Internal Sourcing", "Import/Export", "Logistics Hub", "Marketplace Importer"], color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/30", category: "Supply Chain & Logistics" },
];

export const categoryMeta: Record<string, { icon: React.ElementType; active: string; inactive: string }> = {
  Commerce: { icon: ShoppingBag, active: "bg-emerald-500 text-white border-emerald-500", inactive: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:border-emerald-500/50" },
  "Services & Professionals": { icon: Briefcase, active: "bg-blue-500 text-white border-blue-500", inactive: "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:border-blue-500/50" },
  "Listings & Bookings": { icon: Building, active: "bg-amber-500 text-white border-amber-500", inactive: "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:border-amber-500/50" },
  "Health & Wellness": { icon: Heart, active: "bg-rose-500 text-white border-rose-500", inactive: "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:border-rose-500/50" },
  "Tech & Education": { icon: Rocket, active: "bg-violet-500 text-white border-violet-500", inactive: "bg-violet-500/10 text-violet-600 border-violet-500/30 hover:border-violet-500/50" },
  "Supply Chain & Logistics": { icon: Globe, active: "bg-indigo-600 text-white border-indigo-600", inactive: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30 hover:border-indigo-600/50" },
};

export const categoryOrder = [
  "Commerce",
  "Services & Professionals",
  "Listings & Bookings",
  "Health & Wellness",
  "Tech & Education",
  "Supply Chain & Logistics",
];

// Load recently selected from localStorage
export function getRecentPurposes(): BusinessPurpose[] {
  try {
    const raw = localStorage.getItem("recentBusinessPurposes");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentPurpose(id: BusinessPurpose) {
  const recent = getRecentPurposes().filter((r) => r !== id);
  recent.unshift(id);
  localStorage.setItem("recentBusinessPurposes", JSON.stringify(recent.slice(0, 5)));
}
