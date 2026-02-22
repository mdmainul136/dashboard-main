/**
 * ============================================================================
 * Business Purpose Module Configuration — Per-Vertical Module Definitions
 * ============================================================================
 *
 * PURPOSE:
 *   Each of the 13 business verticals has its OWN set of specialized modules
 *   that are separate from the eCommerce modules in regionModules.ts.
 *
 * RELATIONSHIP TO regionModules.ts:
 *   - regionModules.ts defines PLATFORM-LEVEL modules (Storefront, Products, Orders, POS, etc.)
 *     → These are the eCommerce backbone, gated by REGION (core/addon/na)
 *   - THIS FILE defines VERTICAL-SPECIFIC modules (e.g., Menu Management for restaurants)
 *     → These are always available for the selected vertical, not region-gated
 *
 * STRUCTURE:
 *   Each vertical has:
 *   - coreModules[] → The specialized tools for that business type
 *   - relevantAddons[] → IDs from regionModules.allModules that complement this vertical
 *
 * EXAMPLE:
 *   Restaurant vertical:
 *     coreModules = [Menu Management, Order Management, Table Management, KDS, POS]
 *     relevantAddons = ["crm", "whatsapp", "marketing", "seo", "pages"]
 *
 * USED BY:
 *   - ModuleSummary.tsx → Shows purpose-specific module widgets on dashboard
 *   - Settings.tsx → Module toggle/management for non-ecommerce types
 *   - SaaSRoadmapTab.tsx → Full module listing on platform dashboard
 *
 * BACKEND INTEGRATION:
 *   This is configuration data. Can remain client-side or be served via:
 *   GET /api/verticals/:purposeId/modules
 *
 * ============================================================================
 */

import type { BusinessPurpose } from "@/hooks/useMerchantRegion";

export interface PurposeModule {
  id: string;
  name: string;
  category: string;
  icon: string;
  features: string[];
}

// ============= Real Estate Modules =============
export const realEstateModules: PurposeModule[] = [
  // Real Estate Core
  { id: "re-listings", name: "Property Listings", category: "Real Estate Core", icon: "🏠", features: ["Listing management", "Property types", "Price ranges", "Location mapping", "Photo galleries", "Floor plans"] },
  { id: "re-leads", name: "Lead Management", category: "Real Estate Core", icon: "📋", features: ["Inquiry tracking", "Lead scoring", "Auto-assignment", "Follow-up reminders", "Pipeline view"] },
  { id: "re-agents", name: "Agent Management", category: "Real Estate Core", icon: "👔", features: ["Agent profiles", "Commission tracking", "Performance metrics", "Territory assignment", "Listing assignment"] },
  { id: "re-virtual-tours", name: "Virtual Tours", category: "Real Estate Core", icon: "🎥", features: ["360° tours", "Video walkthroughs", "Photo slideshows", "Embed on listings", "Scheduling"] },
  { id: "re-contracts", name: "Contracts & Docs", category: "Real Estate Core", icon: "📄", features: ["Lease agreements", "Sale contracts", "E-signatures", "Document templates", "Version history"] },
  // Real Estate Growth
  { id: "re-valuations", name: "Property Valuations", category: "Real Estate Growth", icon: "💰", features: ["Market comparisons", "Price history", "Rental yield calculator", "Investment analysis"] },
  { id: "re-portals", name: "Portal Syndication", category: "Real Estate Growth", icon: "🌐", features: ["Auto-publish to portals", "Bayut / Zameen sync", "Property Finder", "Listing analytics"] },
  { id: "re-tenant", name: "Tenant Management", category: "Real Estate Growth", icon: "🔑", features: ["Tenant profiles", "Rent collection", "Maintenance requests", "Lease renewals", "Payment history"] },
];

// ============= Restaurant Modules =============
export const restaurantModules: PurposeModule[] = [
  // Restaurant Core
  { id: "rst-menu", name: "Menu Management", category: "Restaurant Core", icon: "📖", features: ["Menu categories", "Item variants", "Dietary tags", "Pricing tiers", "Seasonal menus", "Photo uploads"] },
  { id: "rst-orders", name: "Order Management", category: "Restaurant Core", icon: "🧾", features: ["Dine-in orders", "Takeout orders", "Delivery orders", "Order queue", "Kitchen display", "Order history"] },
  { id: "rst-tables", name: "Table Management", category: "Restaurant Core", icon: "🪑", features: ["Table layout", "Reservations", "Walk-in queue", "Table status", "Capacity planning", "Turn time tracking"] },
  { id: "rst-kitchen", name: "Kitchen Display (KDS)", category: "Restaurant Core", icon: "👨‍🍳", features: ["Order tickets", "Prep stations", "Priority queue", "Timer alerts", "Course management"] },
  { id: "rst-pos", name: "Restaurant POS", category: "Restaurant Core", icon: "💳", features: ["Quick checkout", "Split bills", "Tips management", "Tab system", "Receipt printing"] },
  // Restaurant Growth
  { id: "rst-delivery", name: "Delivery & Takeout", category: "Restaurant Growth", icon: "🛵", features: ["Delivery zones", "Driver assignment", "Live tracking", "Delivery fees", "Third-party integration"] },
  { id: "rst-inventory", name: "Ingredient Inventory", category: "Restaurant Growth", icon: "🥬", features: ["Stock tracking", "Recipe costing", "Waste tracking", "Auto reorder", "Supplier orders"] },
  { id: "rst-loyalty", name: "Customer Loyalty", category: "Restaurant Growth", icon: "⭐", features: ["Points program", "Stamp cards", "Birthday rewards", "VIP tiers", "Referral bonuses"] },
];

// ============= Business Website Modules =============
export const websiteModules: PurposeModule[] = [
  // Website Core
  { id: "web-pages", name: "Page Builder", category: "Website Core", icon: "📄", features: ["Drag-and-drop editor", "Templates library", "Custom sections", "Mobile responsive", "Landing pages"] },
  { id: "web-blog", name: "Blog & Content", category: "Website Core", icon: "✍️", features: ["Blog editor", "Categories & tags", "Scheduled publishing", "Author profiles", "RSS feed"] },
  { id: "web-forms", name: "Forms & Contact", category: "Website Core", icon: "📬", features: ["Contact forms", "Custom fields", "Form submissions", "Email notifications", "Spam protection"] },
  { id: "web-portfolio", name: "Portfolio / Gallery", category: "Website Core", icon: "🖼️", features: ["Project showcase", "Case studies", "Image galleries", "Testimonials", "Client logos"] },
  { id: "web-booking", name: "Appointment Booking", category: "Website Core", icon: "📅", features: ["Service booking", "Calendar sync", "Time slots", "Reminders", "Payment integration"] },
  // Website Growth
  { id: "web-newsletter", name: "Email Newsletter", category: "Website Growth", icon: "📧", features: ["Subscriber management", "Email templates", "Campaign analytics", "Auto-responders", "Segmentation"] },
  { id: "web-analytics", name: "Website Analytics", category: "Website Growth", icon: "📊", features: ["Visitor tracking", "Page views", "Bounce rate", "Traffic sources", "Conversion goals"] },
  { id: "web-chat", name: "Live Chat", category: "Website Growth", icon: "💬", features: ["Chat widget", "Canned responses", "Visitor info", "Chat history", "Offline messages"] },
];

// ============= LMS Modules =============
export const lmsModules: PurposeModule[] = [
  // LMS Core
  { id: "lms-courses", name: "Course Builder", category: "LMS Core", icon: "📚", features: ["Lesson editor", "Video uploads", "Quizzes", "Assignments", "Module structure", "Drip content"] },
  { id: "lms-students", name: "Student Management", category: "LMS Core", icon: "👨‍🎓", features: ["Enrollment tracking", "Progress reports", "Certificates", "Grading", "Student profiles"] },
  { id: "lms-live", name: "Live Classes", category: "LMS Core", icon: "🎥", features: ["Zoom integration", "Session scheduling", "Attendance", "Recording", "Webinars"] },
  { id: "lms-quizzes", name: "Quizzes & Exams", category: "LMS Core", icon: "📝", features: ["Multiple choice", "Essay questions", "Timed exams", "Auto-grading", "Question bank"] },
  { id: "lms-certificates", name: "Certificates", category: "LMS Core", icon: "🏆", features: ["Custom templates", "Auto-issue", "Verification", "Badge system", "LinkedIn share"] },
  // LMS Growth
  { id: "lms-monetize", name: "Monetization", category: "LMS Growth", icon: "💰", features: ["Course pricing", "Subscriptions", "Coupons", "Bundle deals", "Revenue dashboard"] },
  { id: "lms-community", name: "Community & Forum", category: "LMS Growth", icon: "💬", features: ["Discussion boards", "Q&A", "Study groups", "Peer review", "Mentoring"] },
  { id: "lms-analytics", name: "Learning Analytics", category: "LMS Growth", icon: "📊", features: ["Completion rates", "Quiz scores", "Engagement metrics", "Drop-off analysis", "Revenue reports"] },
];

// ============= eCommerce Modules (reference from existing allModules) =============
// eCommerce uses the existing allModules from regionModules.ts

// ============= Purpose Config =============
export interface PurposeConfig {
  id: BusinessPurpose;
  label: string;
  tagline: string;
  icon: string;
  coreModules: PurposeModule[];
  // Which existing module IDs from allModules are also relevant as add-ons
  relevantAddons: string[];
}

export const purposeConfigs: Record<BusinessPurpose, PurposeConfig> = {
  ecommerce: { id: "ecommerce", label: "Online Store", tagline: "Full-stack eCommerce platform", icon: "🛒", coreModules: [], relevantAddons: ["sgtm", "ior"] },
  "real-estate": { id: "real-estate", label: "Real Estate", tagline: "Property management & listing platform", icon: "🏢", coreModules: realEstateModules, relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"] },
  restaurant: { id: "restaurant", label: "Restaurant / Cafe", tagline: "Restaurant operations & ordering platform", icon: "🍽️", coreModules: restaurantModules, relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"] },
  "business-website": { id: "business-website", label: "Business Website", tagline: "Professional web presence platform", icon: "🌐", coreModules: websiteModules, relevantAddons: ["crm", "whatsapp", "marketing", "seo", "sgtm"] },
  lms: { id: "lms", label: "Learning Platform", tagline: "Online course & education platform", icon: "🎓", coreModules: lmsModules, relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"] },
  healthcare: {
    id: "healthcare", label: "Healthcare / Clinic", tagline: "Patient management & appointment platform", icon: "🏥",
    coreModules: [
      { id: "hc-appointments", name: "Appointment Booking", category: "Healthcare Core", icon: "📅", features: ["Online booking", "Calendar management", "Reminders", "Recurring visits", "Walk-in queue"] },
      { id: "hc-patients", name: "Patient Records", category: "Healthcare Core", icon: "📋", features: ["Patient profiles", "Medical history", "Prescriptions", "Lab results", "Document uploads"] },
      { id: "hc-doctors", name: "Doctor Profiles", category: "Healthcare Core", icon: "👨‍⚕️", features: ["Specialties", "Schedules", "Reviews", "Credentials", "Consultation fees"] },
      { id: "hc-pharmacy", name: "Pharmacy / Prescriptions", category: "Healthcare Core", icon: "💊", features: ["E-prescriptions", "Medication tracking", "Refill reminders", "Drug interactions"] },
      { id: "hc-billing", name: "Medical Billing", category: "Healthcare Growth", icon: "💰", features: ["Insurance claims", "Invoicing", "Payment plans", "Insurance verification"] },
      { id: "hc-telemedicine", name: "Telemedicine", category: "Healthcare Growth", icon: "🎥", features: ["Video consultations", "Chat", "Remote monitoring", "Follow-ups"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  fitness: {
    id: "fitness", label: "Gym / Fitness", tagline: "Membership & class management platform", icon: "🏋️",
    coreModules: [
      { id: "fit-classes", name: "Class Schedule", category: "Fitness Core", icon: "📅", features: ["Class timetable", "Booking system", "Capacity limits", "Waitlist", "Recurring classes"] },
      { id: "fit-members", name: "Membership Plans", category: "Fitness Core", icon: "💳", features: ["Plan tiers", "Auto-renewal", "Freeze/Cancel", "Family plans", "Trial periods"] },
      { id: "fit-trainers", name: "Trainer Profiles", category: "Fitness Core", icon: "🏃", features: ["Certifications", "Specialties", "Availability", "Ratings", "Personal training"] },
      { id: "fit-progress", name: "Progress Tracking", category: "Fitness Core", icon: "📊", features: ["Body metrics", "Workout logs", "Goal setting", "Before/After", "Achievements"] },
      { id: "fit-nutrition", name: "Nutrition Plans", category: "Fitness Growth", icon: "🥗", features: ["Meal plans", "Calorie tracking", "Macros", "Diet templates", "Supplements"] },
      { id: "fit-equipment", name: "Equipment Management", category: "Fitness Growth", icon: "🏗️", features: ["Inventory", "Maintenance", "Booking", "Usage tracking"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  salon: {
    id: "salon", label: "Salon / Spa", tagline: "Beauty services & booking platform", icon: "💇",
    coreModules: [
      { id: "sal-booking", name: "Online Booking", category: "Salon Core", icon: "📅", features: ["Service selection", "Stylist choice", "Time slots", "Reminders", "Rescheduling"] },
      { id: "sal-services", name: "Service Menu", category: "Salon Core", icon: "📋", features: ["Categories", "Pricing tiers", "Duration", "Add-ons", "Packages"] },
      { id: "sal-staff", name: "Staff Management", category: "Salon Core", icon: "👤", features: ["Stylist profiles", "Schedules", "Commission tracking", "Performance", "Specialties"] },
      { id: "sal-loyalty", name: "Client Loyalty", category: "Salon Core", icon: "⭐", features: ["Points system", "Referral rewards", "Birthday specials", "VIP tiers", "Gift cards"] },
      { id: "sal-products", name: "Retail Products", category: "Salon Growth", icon: "🧴", features: ["Product catalog", "Inventory", "POS", "Recommendations", "Online sales"] },
      { id: "sal-reviews", name: "Reviews & Ratings", category: "Salon Growth", icon: "💬", features: ["Client reviews", "Photo gallery", "Before/After", "Social sharing"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  freelancer: {
    id: "freelancer", label: "Freelancer / Agency", tagline: "Portfolio & client management platform", icon: "💼",
    coreModules: [
      { id: "fl-portfolio", name: "Portfolio Showcase", category: "Freelancer Core", icon: "🖼️", features: ["Project gallery", "Case studies", "Tech stack", "Client logos", "Testimonials"] },
      { id: "fl-services", name: "Service Offerings", category: "Freelancer Core", icon: "📋", features: ["Service packages", "Pricing", "Custom quotes", "Add-ons", "Retainers"] },
      { id: "fl-proposals", name: "Proposals & Contracts", category: "Freelancer Core", icon: "📄", features: ["Proposal builder", "E-signatures", "Terms", "Milestones", "Version history"] },
      { id: "fl-invoicing", name: "Invoicing", category: "Freelancer Core", icon: "💰", features: ["Invoice generation", "Time tracking", "Expense logging", "Payment reminders", "Tax reports"] },
      { id: "fl-clients", name: "Client Portal", category: "Freelancer Growth", icon: "👥", features: ["Project updates", "File sharing", "Feedback", "Approvals", "Communication"] },
      { id: "fl-blog", name: "Blog & Thought Leadership", category: "Freelancer Growth", icon: "✍️", features: ["Blog editor", "SEO", "Categories", "Newsletter", "Social sharing"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo"],
  },
  travel: {
    id: "travel", label: "Travel / Tourism", tagline: "Tour booking & destination platform", icon: "✈️",
    coreModules: [
      { id: "tr-tours", name: "Tour Packages", category: "Travel Core", icon: "🗺️", features: ["Package builder", "Itineraries", "Pricing tiers", "Seasonal pricing", "Group discounts"] },
      { id: "tr-booking", name: "Booking System", category: "Travel Core", icon: "📅", features: ["Online booking", "Availability", "Payment gateway", "Confirmations", "Cancellation policy"] },
      { id: "tr-destinations", name: "Destinations", category: "Travel Core", icon: "🏝️", features: ["Destination pages", "Photo galleries", "Reviews", "Maps", "Weather info"] },
      { id: "tr-guides", name: "Tour Guides", category: "Travel Core", icon: "🧭", features: ["Guide profiles", "Languages", "Specialties", "Ratings", "Availability"] },
      { id: "tr-transport", name: "Transport & Hotels", category: "Travel Growth", icon: "🏨", features: ["Hotel listings", "Car rentals", "Flight add-ons", "Transfers", "Partner deals"] },
      { id: "tr-reviews", name: "Traveler Reviews", category: "Travel Growth", icon: "⭐", features: ["Trip reviews", "Photo uploads", "Ratings", "Featured stories", "Social proof"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  automotive: {
    id: "automotive", label: "Automotive", tagline: "Vehicle listing & service platform", icon: "🚗",
    coreModules: [
      { id: "auto-listings", name: "Vehicle Listings", category: "Automotive Core", icon: "🚙", features: ["Car catalog", "Filters", "Comparison", "360° photos", "Video tours"] },
      { id: "auto-service", name: "Service Booking", category: "Automotive Core", icon: "🔧", features: ["Service menu", "Online booking", "Status updates", "History", "Estimates"] },
      { id: "auto-finance", name: "Finance Calculator", category: "Automotive Core", icon: "💰", features: ["EMI calculator", "Trade-in value", "Insurance quotes", "Loan options"] },
      { id: "auto-parts", name: "Parts Catalog", category: "Automotive Core", icon: "⚙️", features: ["Parts search", "Compatibility checker", "Pricing", "Availability", "Orders"] },
      { id: "auto-crm", name: "Lead Management", category: "Automotive Growth", icon: "📋", features: ["Test drive booking", "Lead scoring", "Follow-ups", "Pipeline", "Analytics"] },
      { id: "auto-fleet", name: "Fleet Management", category: "Automotive Growth", icon: "🚐", features: ["Fleet tracking", "Maintenance schedule", "Fuel logs", "Driver management"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  event: {
    id: "event", label: "Events / Wedding", tagline: "Event planning & venue management platform", icon: "🎉",
    coreModules: [
      { id: "ev-events", name: "Event Manager", category: "Event Core", icon: "📅", features: ["Event creation", "Timeline", "Checklist", "Budget tracker", "Guest list"] },
      { id: "ev-venues", name: "Venue Showcase", category: "Event Core", icon: "🏛️", features: ["Venue gallery", "Capacity", "Floor plans", "Pricing", "Virtual tours"] },
      { id: "ev-rsvp", name: "RSVP & Ticketing", category: "Event Core", icon: "🎫", features: ["RSVP tracking", "Ticket sales", "Seating chart", "QR check-in", "Waitlist"] },
      { id: "ev-vendors", name: "Vendor Directory", category: "Event Core", icon: "👥", features: ["Vendor categories", "Reviews", "Portfolios", "Booking", "Contracts"] },
      { id: "ev-gallery", name: "Event Gallery", category: "Event Growth", icon: "📸", features: ["Photo galleries", "Video highlights", "Client stories", "Social sharing"] },
      { id: "ev-marketing", name: "Event Marketing", category: "Event Growth", icon: "📢", features: ["Email invites", "Social campaigns", "Landing pages", "Countdown", "Early bird"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  saas: {
    id: "saas", label: "SaaS / Digital Product", tagline: "SaaS landing & product platform", icon: "🚀",
    coreModules: [
      { id: "ss-landing", name: "Landing Page Builder", category: "SaaS Core", icon: "📄", features: ["Hero sections", "Feature grids", "Social proof", "CTA optimization", "A/B testing"] },
      { id: "ss-pricing", name: "Pricing & Plans", category: "SaaS Core", icon: "💰", features: ["Pricing tables", "Feature comparison", "Annual/Monthly toggle", "Custom plans", "Trials"] },
      { id: "ss-docs", name: "Documentation", category: "SaaS Core", icon: "📚", features: ["API docs", "Guides", "Tutorials", "Search", "Versioning"] },
      { id: "ss-changelog", name: "Changelog & Roadmap", category: "SaaS Core", icon: "📋", features: ["Release notes", "Public roadmap", "Feature voting", "Status updates"] },
      { id: "ss-integrations", name: "Integrations Hub", category: "SaaS Growth", icon: "🔗", features: ["Integration catalog", "API keys", "Webhooks", "OAuth", "Marketplace"] },
      { id: "ss-analytics", name: "Product Analytics", category: "SaaS Growth", icon: "📊", features: ["User metrics", "Funnel analysis", "Cohort analysis", "Feature usage", "Revenue tracking"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages", "sgtm"],
  },
  landlord: {
    id: "landlord", label: "Property Landlord", tagline: "Property & tenant management platform", icon: "🏠",
    coreModules: [
      { id: "ll-properties", name: "Property Portfolio", category: "Landlord Core", icon: "🏠", features: ["Property listing", "Unit management", "Photos & details", "Occupancy status", "Property documents"] },
      { id: "ll-tenants", name: "Tenant Management", category: "Landlord Core", icon: "👥", features: ["Tenant profiles", "Contact info", "Lease history", "Communication log", "Tenant screening"] },
      { id: "ll-leases", name: "Lease Tracking", category: "Landlord Core", icon: "📄", features: ["Lease agreements", "Renewal alerts", "Terms & conditions", "E-signatures", "Document storage"] },
      { id: "ll-rent", name: "Rent Collection", category: "Landlord Core", icon: "💰", features: ["Rent invoicing", "Payment tracking", "Late fee automation", "Receipt generation", "Payment history"] },
      { id: "ll-maintenance", name: "Maintenance System", category: "Landlord Growth", icon: "🔧", features: ["Work orders", "Vendor assignment", "Priority levels", "Photo uploads", "Status tracking"] },
      { id: "ll-vacancy", name: "Vacancy Tracker", category: "Landlord Growth", icon: "📊", features: ["Vacancy rates", "Listing syndication", "Applicant tracking", "Showing scheduler"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  education: {
    id: "education", label: "Education / Coaching", tagline: "Coaching center & academy management platform", icon: "🏫",
    coreModules: [
      { id: "edu-classes", name: "Class Schedule", category: "Education Core", icon: "📅", features: ["Timetable builder", "Batch management", "Room assignment", "Recurring classes", "Holiday calendar"] },
      { id: "edu-students", name: "Student Management", category: "Education Core", icon: "👨‍🎓", features: ["Student profiles", "Enrollment", "Guardian info", "Academic history", "ID cards"] },
      { id: "edu-attendance", name: "Attendance Tracking", category: "Education Core", icon: "✅", features: ["Daily attendance", "Class-wise tracking", "Absence alerts", "Monthly reports", "Parent notifications"] },
      { id: "edu-fees", name: "Fee Collection", category: "Education Core", icon: "💰", features: ["Fee structures", "Installment plans", "Payment tracking", "Receipts", "Overdue reminders"] },
      { id: "edu-exams", name: "Exams & Results", category: "Education Growth", icon: "📝", features: ["Exam scheduling", "Grade entry", "Report cards", "Performance analytics", "Parent sharing"] },
      { id: "edu-staff", name: "Staff Management", category: "Education Growth", icon: "👨‍🏫", features: ["Teacher profiles", "Subject assignment", "Payroll tracking", "Performance reviews", "Leave management"] },
    ],
    relevantAddons: ["crm", "whatsapp", "marketing", "seo", "pages"],
  },
  "cross-border-ior": {
    id: "cross-border-ior",
    label: "Product Sourcing & IOR",
    tagline: "International procurement and local fulfillment platform",
    icon: "🌐",
    coreModules: [
      { id: "ior-foreign-sourcing", name: "Product Sourcing", category: "IOR Core", icon: "🔍", features: ["Internal sourcing tool", "One-time URL import", "Supplier catalog management", "Review & Approve workflow"] },
      { id: "ior-customs", name: "Customs Compliance", category: "IOR Core", icon: "🛡️", features: ["Duty/VAT tracking", "ZATCA integration", "HS code mapping", "Compliance logs"] },
      { id: "ior-logistics", name: "Internal Logistics", category: "IOR Core", icon: "🚢", features: ["Warehouse tracking", "QC & Relabeling", "Local fulfillment", "Inventory management"] },
    ],
    relevantAddons: ["crm", "erp", "inventory", "orders"],
  },
};

export function getPurposeModulesByCategory(purpose: BusinessPurpose) {
  const config = purposeConfigs[purpose];
  const categories: Record<string, PurposeModule[]> = {};
  for (const mod of config.coreModules) {
    if (!categories[mod.category]) categories[mod.category] = [];
    categories[mod.category].push(mod);
  }
  return categories;
}
