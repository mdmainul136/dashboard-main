import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RegionModuleStrategy from "./RegionModuleStrategy";
import {
  Globe, Package, ClipboardList, CreditCard, Truck, Store,
  ShoppingBag, Users, Building2, UserCog, BarChart3, LayoutGrid, Shield,
  Check, Zap, Crown, Rocket, Target, ChevronRight,
  MessageCircle, Megaphone, Gift, Star, Receipt, Search, FileText,
  Repeat, ShoppingCart, Bell, Map, Paintbrush, Code, Calendar,
  Wallet, Tag, Heart, Smartphone, Globe2, Hash,
  Stethoscope, Dumbbell, Scissors, Briefcase, Plane, Car, PartyPopper,
  GraduationCap, UtensilsCrossed, Home, Camera, Contact, FileSignature,
  BarChart, MonitorSmartphone, Bot, Landmark,
} from "lucide-react";

/* ───────────── Types ───────────── */
interface ModuleData {
  icon: React.ElementType;
  num: string;
  name: string;
  status: "built" | "partial" | "planned";
  features: string[];
  note?: string;
  saudiReady?: string[];
}

interface SectionData {
  emoji: string;
  title: string;
  subtitle: string;
  modules: ModuleData[];
}

/* ───────────── Section Data ───────────── */
const sections: SectionData[] = [
  {
    emoji: "🧱", title: "CORE PLATFORM LAYER", subtitle: "Foundation",
    modules: [
      { icon: Building2, num: "1️⃣", name: "Multi-Tenant SaaS Core", status: "partial", features: ["Tenant isolation (DB per tenant)", "Subdomain + custom domain", "Country-based configuration", "Feature flags per tenant", "Plan & billing engine", "Usage quota engine", "Audit logs"] },
      { icon: Globe, num: "🌐", name: "Onboarding & Store Setup", status: "built", features: ["Business info wizard", "First product setup", "Payment connection", "Plan selection", "Store branding setup"] },
    ],
  },
  {
    emoji: "🛍️", title: "E-COMMERCE CORE", subtitle: "Shopify + Salla",
    modules: [
      { icon: Paintbrush, num: "2️⃣", name: "Storefront & CMS", status: "built", features: ["Theme engine (no-code builder)", "Theme gallery (10+ templates)", "Store customizer (live preview)", "Domain manager (custom + subdomain)", "Arabic + English (RTL/LTR)", "Multi-currency", "SEO (local + global)"] },
      { icon: FileText, num: "📝", name: "Pages & Blog", status: "built", features: ["Static pages builder", "Blog with rich editor", "Landing pages", "Custom URL slugs", "SEO meta per page", "Draft / publish workflow"] },
      { icon: Search, num: "🔍", name: "SEO Manager", status: "built", features: ["Meta title & description editor", "Sitemap generation", "Schema markup (JSON-LD)", "Canonical URLs", "Open Graph tags", "Google Search Console integration"] },
      { icon: Package, num: "3️⃣", name: "Product & Catalog", status: "built", features: ["Products (physical / digital)", "Variants & bundles", "SKU / barcode", "Inventory sync", "Category & collections", "Bulk import/export (CSV)", "Product reviews & ratings"] },
      { icon: ClipboardList, num: "4️⃣", name: "Order Management", status: "built", features: ["Order lifecycle", "COD support", "Partial fulfillment", "Returns & exchange", "Draft orders", "Abandoned checkout recovery", "Invoice generation (PDF)"] },
    ],
  },
  {
    emoji: "💳", title: "PAYMENT ORCHESTRATION", subtitle: "Saudi + Global",
    modules: [
      { icon: CreditCard, num: "5️⃣", name: "Payment Engine (Rule-Based)", status: "built", features: ["🌍 Global: Visa / Mastercard, Apple Pay, Google Pay, PayPal", "🇸🇦 Saudi / Middle East: MADA, STC Pay, Tamara, Tabby, COD", "Country-based payment visibility", "COD risk scoring"], note: "Logic: Country → Amount → Device → Risk → Payment Methods" },
      { icon: Wallet, num: "💰", name: "Sadad Payment", status: "built", features: ["Sadad bill presentment", "Bill payment tracking", "Auto-reconciliation", "Payment confirmation"], saudiReady: ["Sadad Integration"] },
      { icon: Repeat, num: "🔄", name: "Subscription Billing", status: "built", features: ["Recurring billing plans", "Free trial support", "Plan upgrades/downgrades", "Auto-renewal", "Subscription analytics", "Cancellation management"] },
    ],
  },
  {
    emoji: "🚚", title: "SHIPPING & LOGISTICS", subtitle: "Delivery Engine",
    modules: [
      { icon: Truck, num: "6️⃣", name: "Delivery Engine", status: "built", features: ["Shipping zones", "Rate rules / calculator", "Courier APIs", "COD remittance", "Tracking", "Local pickup", "Shipping fulfillment dashboard"], saudiReady: ["Aramex", "SMSA Express"] },
      { icon: Map, num: "🗺️", name: "Tracking & Map View", status: "built", features: ["Real-time shipment tracking", "Gulf region map view", "Delivery status updates", "ETA calculation", "Driver assignment"] },
    ],
  },
  {
    emoji: "🏪", title: "MARKETPLACE & GROWTH", subtitle: "Multi-Channel Commerce",
    modules: [
      { icon: Store, num: "7️⃣", name: "Multi-Vendor Marketplace", status: "built", features: ["Seller onboarding & KYC", "Seller dashboard", "Commission rules", "Vendor payouts", "Seller analytics", "Dispute management"] },
      { icon: Megaphone, num: "📢", name: "Marketing Campaigns", status: "built", features: ["Email campaigns", "SMS campaigns", "WhatsApp broadcasts", "Campaign analytics", "A/B testing", "Audience targeting", "Scheduled sending"] },
      { icon: Zap, num: "⚡", name: "Flash Sales & Affiliate", status: "built", features: ["Time-limited flash sales", "Countdown timers", "Affiliate program", "Referral tracking", "Commission payouts", "Performance dashboard"] },
      { icon: MessageCircle, num: "💬", name: "WhatsApp Commerce", status: "built", features: ["Product catalog via WhatsApp", "Order via chat", "Automated replies", "Broadcast lists", "Payment links in chat", "Order notifications"] },
      { icon: Tag, num: "🏷️", name: "Discount & Coupons", status: "built", features: ["Coupon code generator", "Percentage / fixed discounts", "Min order requirements", "Usage limits", "Auto-apply rules", "Cross-channel sync"] },
      { icon: Gift, num: "🎁", name: "Gift Cards", status: "built", features: ["Digital gift cards", "Custom amounts", "Email delivery", "Balance tracking", "Expiry management", "Bulk generation"] },
      { icon: ShoppingCart, num: "🛒", name: "Abandoned Cart Recovery", status: "built", features: ["Auto-detect abandoned carts", "Email reminders", "WhatsApp reminders", "Discount incentives", "Recovery analytics", "Multi-step sequences"] },
    ],
  },
  {
    emoji: "🧾", title: "POS SYSTEM", subtitle: "ONLINE + OFFLINE",
    modules: [{ icon: ShoppingBag, num: "8️⃣", name: "POS Module", status: "built", features: ["Web POS", "Offline mode (PWA)", "Barcode scanner (camera)", "Cash / card / wallet", "Inventory sync", "Staff PIN login", "Branch-wise sales", "Receipt printing", "Split payments", "Hold & recall orders"], note: "👉 Same POS works for: Saudi retail + Global retail" }],
  },
  {
    emoji: "👥", title: "CRM & CUSTOMER", subtitle: "Customer Relationship Management",
    modules: [
      { icon: Users, num: "9️⃣", name: "CRM Module", status: "built", features: ["Customer profiles", "Purchase history", "Loyalty points", "Wallet / store credit", "Segmentation", "Email / SMS / WhatsApp campaigns", "Support tickets"] },
      { icon: Heart, num: "❤️", name: "Loyalty & Rewards", status: "built", features: ["Points system", "Tiered rewards", "Cashback rules", "Referral bonuses", "Birthday rewards", "Points expiry", "Coupon integration"] },
      { icon: Users, num: "👤", name: "Customer Segments", status: "built", features: ["Auto-segmentation rules", "RFM analysis", "VIP customers", "At-risk detection", "Custom tags", "Segment-based campaigns"] },
      { icon: Star, num: "⭐", name: "Reviews & Ratings", status: "built", features: ["Product reviews", "Star ratings", "Photo reviews", "Review moderation", "Auto-publish rules", "Review analytics"] },
    ],
  },
  {
    emoji: "🏭", title: "ERP & OPERATIONS", subtitle: "Business Operations",
    modules: [
      { icon: Building2, num: "🔟", name: "ERP Module", status: "built", features: ["Inventory & warehouse", "Purchase orders", "Supplier management", "Cost tracking", "Invoicing", "VAT accounting", "Financial reports", "Multi-warehouse support"], saudiReady: ["ZATCA VAT compliance", "Arabic invoices"] },
      { icon: Receipt, num: "🧾", name: "Expense Tracker", status: "built", features: ["Expense categories", "Receipt upload", "Recurring expenses", "Budget tracking", "Approval workflow", "Expense reports"] },
      { icon: Building2, num: "🏢", name: "Branch Management", status: "built", features: ["Multi-branch support", "Branch-wise inventory", "Branch-wise sales", "Inter-branch transfer", "Branch performance", "Branch staff assignment"] },
      { icon: ClipboardList, num: "📋", name: "Purchase Orders", status: "built", features: ["Create PO", "Supplier selection", "Auto-reorder rules", "PO approval workflow", "Goods receipt", "PO tracking"] },
      { icon: Package, num: "📦", name: "Supplier Management", status: "built", features: ["Supplier directory", "Supplier performance", "Payment terms", "Lead time tracking", "Supplier portal", "Bulk ordering"] },
      { icon: Globe2, num: "💱", name: "Multi-Currency & Tax", status: "built", features: ["Multi-currency support", "Auto exchange rates", "Tax profiles", "VAT calculation", "Tax-inclusive pricing", "Tax reports"] },
    ],
  },
  {
    emoji: "👨‍💼", title: "HRM", subtitle: "Internal Operations",
    modules: [
      { icon: UserCog, num: "1️⃣1️⃣", name: "HRM Module", status: "built", features: ["Employee records", "Roles & permissions", "Attendance", "Shifts", "Payroll (manual / automated)", "Leave management", "Performance reviews"] },
      { icon: Shield, num: "🔑", name: "Staff Access & RBAC", status: "built", features: ["Role-based access control", "Custom permission sets", "Module-level access", "Action-level restrictions", "Staff activity log", "Two-factor auth"] },
    ],
  },
  {
    emoji: "📊", title: "ANALYTICS & AI", subtitle: "Analytics Engine",
    modules: [
      { icon: BarChart3, num: "1️⃣2️⃣", name: "Analytics Engine", status: "built", features: ["Sales dashboards", "Product performance", "Seller performance", "COD vs prepaid ratio", "VAT reports", "Export CSV", "Predictive insights (future)"] },
      { icon: BarChart3, num: "📈", name: "Sales Report", status: "built", features: ["Revenue trends", "Top products", "Sales by channel", "Sales by region", "Profit margins", "Custom date ranges"] },
      { icon: Package, num: "📦", name: "Inventory Report", status: "built", features: ["Stock levels", "Low stock alerts", "Dead stock report", "Stock movement", "Valuation report", "Reorder suggestions"] },
      { icon: Users, num: "🎯", name: "Customer Insights", status: "built", features: ["Customer lifetime value", "Cohort analysis", "Purchase frequency", "Geographic distribution", "Retention rate", "Churn prediction"] },
    ],
  },
  {
    emoji: "🔌", title: "APP ECOSYSTEM & DEVELOPER", subtitle: "Shopify Power",
    modules: [
      { icon: LayoutGrid, num: "1️⃣3️⃣", name: "App Marketplace", status: "built", features: ["Third-party apps", "Internal modules as apps", "App install/uninstall", "App settings panel", "App ratings & reviews", "Category browsing"] },
      { icon: Code, num: "🛠️", name: "Developer Portal", status: "built", features: ["API key management (prod + test)", "API documentation (8+ endpoints)", "Webhooks (event-based)", "Sandbox testing environment", "OAuth flow", "Rate limiting"] },
      { icon: Bell, num: "🔔", name: "Webhook & Notifications", status: "built", features: ["Webhook endpoints", "Event subscriptions", "Retry logic", "Notification templates (email/SMS/push)", "Real-time notifications", "Notification center"] },
      { icon: Hash, num: "📤", name: "CSV Import/Export", status: "built", features: ["Product import/export", "Customer import/export", "Order export", "Inventory import", "Column mapping", "Validation & error handling"] },
    ],
  },
  {
    emoji: "🔐", title: "SECURITY & COMPLIANCE", subtitle: "Security Layer",
    modules: [
      { icon: Shield, num: "1️⃣4️⃣", name: "Security Layer", status: "built", features: ["SSL", "PCI-DSS", "Role-based access", "Audit logs", "Fraud detection", "DDoS protection", "Backup & restore"] },
      { icon: Receipt, num: "🧾", name: "ZATCA E-Invoicing", status: "built", features: ["E-invoice generation", "QR code embedding", "Arabic invoice preview", "XML submission", "Phase 1 & 2 compliance", "Validation engine"], saudiReady: ["ZATCA Phase 1", "ZATCA Phase 2"] },
    ],
  },
  {
    emoji: "🇸🇦", title: "SAUDI-SPECIFIC SERVICES", subtitle: "Kingdom of Saudi Arabia",
    modules: [
      { icon: Shield, num: "🏛️", name: "Maroof Integration", status: "built", features: ["Maroof store verification", "Trust badge display", "Business registration link", "Auto-verification status", "Compliance dashboard"], saudiReady: ["Maroof verified"] },
      { icon: Map, num: "📍", name: "National Address (SPL)", status: "built", features: ["Saudi Post address lookup", "Short address support", "Address validation", "Auto-fill from national ID", "Delivery zone mapping"], saudiReady: ["Saudi Post (SPL)"] },
      { icon: Wallet, num: "💳", name: "Sadad Payment System", status: "built", features: ["Sadad bill presentment", "Auto payment matching", "Bill status tracking", "Reconciliation reports"], saudiReady: ["Sadad"] },
    ],
  },
  {
    emoji: "🏥", title: "SERVICE VERTICALS — HEALTH & WELLNESS", subtitle: "Healthcare, Fitness, Salon",
    modules: [
      { icon: Stethoscope, num: "🏥", name: "Healthcare Management", status: "built", features: ["Patient records with medical history", "Vitals tracking (BP, heart rate, glucose, SpO2)", "6-month vitals trend chart", "Allergy & condition management", "Patient PDF report export (jsPDF)", "Appointment scheduling", "Doctor assignment", "Prescription management"] },
      { icon: Dumbbell, num: "🏋️", name: "Fitness Center Management", status: "built", features: ["Class scheduling (weekly timetable)", "Trainer profiles & assignment", "Membership plans (monthly/yearly)", "Attendance tracking", "Equipment inventory", "Member progress dashboard", "Workout plan builder"] },
      { icon: Scissors, num: "💇", name: "Salon & Spa Management", status: "built", features: ["Booking calendar (list + 7-day timetable view)", "Stylist management with performance metrics", "Service catalog with popularity & revenue tracking", "Client retention analytics", "Stylist rating & review system", "Revenue per stylist dashboard", "Walk-in & appointment booking"] },
    ],
  },
  {
    emoji: "💼", title: "SERVICE VERTICALS — PROFESSIONAL", subtitle: "Freelancer, Travel, Automotive, Event",
    modules: [
      { icon: Briefcase, num: "💼", name: "Freelancer Hub", status: "built", features: ["Project hub with task & milestone tracking", "Client management with interaction history", "Invoice tracking (paid/pending/overdue)", "Revenue & rating per client", "Time tracking per project", "Contract management", "Payment reminders"] },
      { icon: Plane, num: "✈️", name: "Travel Management", status: "built", features: ["Tour packages (5 categories: adventure/luxury/cultural/beach/mountain)", "Booking management with payment tracking", "Itinerary builder (day-by-day timeline with tips)", "Destination directory with popularity stats", "Travel insurance policies (Basic/Premium/Platinum)", "Capacity management & progress bars", "Guest details with special requests"] },
      { icon: Car, num: "🚗", name: "Automotive Dealership", status: "built", features: ["Vehicle inventory with search/filter/sort", "Vehicle comparison tool with PDF export", "Service booking with KPI dashboard", "Parts catalog with reorder alerts", "Fleet management with fuel tracking", "Service history with technician filter", "Customer vehicle registry", "Finance calculator (EMI + loan comparison + trade-in)"] },
      { icon: PartyPopper, num: "🎉", name: "Event Management", status: "built", features: ["Event planner dashboard", "Venue management", "Vendor coordination", "Ticketing system", "Guest list management", "Budget tracking", "Timeline scheduling"] },
    ],
  },
  {
    emoji: "📚", title: "SERVICE VERTICALS — EDUCATION & FOOD", subtitle: "LMS, Restaurant",
    modules: [
      { icon: GraduationCap, num: "📚", name: "LMS (Learning Management)", status: "built", features: ["Course creation & management", "Quiz builder (MCQ/T-F/short answer)", "Certificate builder with templates", "Student progress dashboard", "Gamification (points, badges, leaderboard)", "Course recommendations (AI-powered)", "Enrollment tracking", "Completion analytics"] },
      { icon: UtensilsCrossed, num: "🍽️", name: "Restaurant Management", status: "built", features: ["Menu management with categories", "Table management & reservations", "Kitchen display system (KDS)", "Order management (dine-in/takeaway/delivery)", "Table reservation calendar", "Staff shift management", "Menu item variants & modifiers"] },
    ],
  },
  {
    emoji: "🏠", title: "SERVICE VERTICALS — LISTINGS & REAL ESTATE", subtitle: "Property, Virtual Tours, Landlord",
    modules: [
      { icon: Home, num: "🏠", name: "Real Estate / Property Listings", status: "built", features: ["Property listing management", "Advanced property search & filters", "Virtual tour integration", "Agent management with performance", "Lead management & tracking", "Contract management", "Property comparison tool", "Location-based search"] },
      { icon: Home, num: "🏘️", name: "Landlord Management", status: "built", features: ["Property portfolio dashboard", "Tenant management & screening", "Lease agreement tracking", "Rent collection & receipts", "Maintenance request system", "Vacancy tracker", "ROI calculator", "Expense reports & insurance"] },
    ],
  },
  {
    emoji: "🌐", title: "BUSINESS WEBSITE MODULE", subtitle: "Website Builder & Tools",
    modules: [
      { icon: Paintbrush, num: "🎨", name: "Page Builder", status: "built", features: ["Drag & drop page builder", "Responsive preview (Desktop/Tablet/Mobile)", "Section templates library", "Custom CSS support", "Publishing workflow", "Page versioning"] },
      { icon: Contact, num: "📋", name: "Contact Form Builder", status: "built", features: ["10+ field types (text/email/phone/select/file/etc)", "Form validation rules", "Submission inbox with read/unread", "Email notifications on submit", "Spam protection", "Custom thank-you page"] },
      { icon: Camera, num: "🖼️", name: "Portfolio Gallery", status: "built", features: ["Grid/masonry/carousel layouts", "Project categories & tags", "Lightbox preview", "Client testimonials", "Before/after comparisons", "Filterable gallery"] },
      { icon: Calendar, num: "📅", name: "Appointment Booking System", status: "built", features: ["Visual calendar with day/week/month views", "Service-based booking", "Staff availability management", "Booking rules (min notice, max advance)", "Automated reminders", "Buffer time between appointments", "Cancellation policy"] },
      { icon: BarChart, num: "📊", name: "Website Analytics Dashboard", status: "built", features: ["Traffic sources breakdown", "Geographic visitor stats", "Page performance metrics", "Bounce rate tracking", "Session duration analytics", "Real-time visitor count", "UTM tracking"] },
      { icon: MonitorSmartphone, num: "🔍", name: "SEO Manager (Advanced)", status: "built", features: ["SEO score per page", "Meta title & description editor", "Schema markup (JSON-LD)", "Sitemap generation", "Open Graph tags", "Keyword density checker", "Canonical URLs"] },
    ],
  },
  {
    emoji: "🤖", title: "PLATFORM INTELLIGENCE", subtitle: "Multi-Tenant & AI",
    modules: [
      { icon: Building2, num: "🏢", name: "Multi-Tenant Core", status: "built", features: ["Tenant dashboard with KPIs", "Plan management & billing", "Feature flags per tenant", "Usage monitoring & quotas", "Tenant onboarding wizard", "White-label support", "Tenant analytics"] },
      { icon: Bot, num: "🤖", name: "AI Agent Management", status: "built", features: ["AI-powered support agents", "Lead qualification bots", "Automated responses", "Agent performance metrics", "Multi-channel support", "Training data management"] },
      { icon: Landmark, num: "🏛️", name: "Platform Dashboard", status: "built", features: ["Enterprise-grade master dashboard", "Glass-card KPI widgets", "System health monitoring", "Region-wise module strategy", "Real-time tenant metrics", "Revenue analytics", "40+ module overview"] },
    ],
  },
  {
    emoji: "📅", title: "PRODUCTIVITY & TOOLS", subtitle: "Business Tools",
    modules: [
      { icon: Calendar, num: "📅", name: "Calendar & Scheduling", status: "built", features: ["Event management", "Task scheduling", "Delivery scheduling", "Staff shift calendar", "Reminders", "Multi-view (day/week/month)"] },
      { icon: ClipboardList, num: "📜", name: "Audit Log", status: "built", features: ["Full activity log", "User action tracking", "Filter by action type", "Date range search", "Export audit trail", "Compliance reporting"] },
      { icon: Smartphone, num: "📱", name: "PWA & Mobile Install", status: "built", features: ["Progressive Web App", "Install prompt", "Offline support", "Push notifications", "Home screen icon", "Auto-update"] },
      { icon: FileSignature, num: "📃", name: "Contract Management", status: "built", features: ["Contract templates", "Digital signatures", "Expiry tracking", "Renewal reminders", "Document versioning", "Client-facing portal"] },
    ],
  },
];

const statusBadge = {
  built: { label: "Built ✅", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  partial: { label: "In Progress 🔄", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  planned: { label: "Planned 📋", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
};

const pricingPlans = [
  { name: "Starter", price: "0", target: "Small sellers", includes: "Store + payments", features: ["Storefront + Payments", "Up to 50 products", "Basic analytics", "Email support"], icon: Zap },
  { name: "Business", price: "99", target: "Growing brands", includes: "POS + CRM", features: ["POS Terminal", "CRM + Loyalty", "Unlimited products", "Multi-currency", "Priority support"], icon: Target, popular: true },
  { name: "Pro", price: "299", target: "Marketplace", includes: "ERP + multi-vendor", features: ["ERP Module", "Multi-vendor Marketplace", "Custom domain", "API access", "Dedicated manager"], icon: Crown },
  { name: "Enterprise", price: "Custom", target: "Large org", includes: "HRM + API + custom", features: ["HRM Module", "Full REST + GraphQL API", "White-label", "SLA guarantee", "On-premise option"], icon: Rocket },
];

/* ───────────── Module Card ───────────── */
const ModuleItem = ({ mod }: { mod: ModuleData }) => {
  const Icon = mod.icon;
  const st = statusBadge[mod.status];

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg">{mod.num}</span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{mod.name}</p>
        </div>
        <Badge className={`text-[10px] shrink-0 ${st.color}`}>{st.label}</Badge>
      </div>

      <ul className="space-y-1.5 ps-12">
        {mod.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {mod.note && (
        <div className="ms-12 mt-3 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
          <p className="text-xs text-primary font-medium">{mod.note}</p>
        </div>
      )}

      {mod.saudiReady && (
        <div className="ms-12 mt-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2.5">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">🇸🇦 Saudi Ready</p>
          <div className="flex flex-wrap gap-1.5">
            {mod.saudiReady.map((s, i) => (
              <Badge key={i} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">{s}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ───────────── Main Component ───────────── */
const SaaSRoadmapTab = () => {
  const builtCount = sections.reduce((acc, s) => acc + s.modules.filter(m => m.status === "built").length, 0);
  const totalCount = sections.reduce((acc, s) => acc + s.modules.length, 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-border/60 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="relative space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">🇸🇦 Saudi-First</Badge>
            <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30">🌍 Global-Ready</Badge>
            <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30">☁️ Cloud SaaS</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            🌍 Global + Saudi Ready Unified Commerce SaaS
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl">
            (Shopify + Salla model) — POS, CRM, ERP, HRM সহ সম্পূর্ণ SaaS প্ল্যাটফর্ম। Saudi retail থেকে global marketplace পর্যন্ত সব কিছু এক জায়গায়।
          </p>
          <p className="text-sm text-muted-foreground/60 italic">
            📐 System Design Document &nbsp;•&nbsp; 💼 Investor Deck &nbsp;•&nbsp; 🗺️ SaaS Roadmap
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> {totalCount} Modules</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> {builtCount} Built</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> ZATCA Compliant</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> AR/EN Bilingual</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> PWA Offline</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{section.emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">{section.title}</h2>
              <p className="text-xs text-muted-foreground">({section.subtitle})</p>
            </div>
          </div>
          <div className="space-y-2">
            {section.modules.map((mod) => (
              <ModuleItem key={mod.name} mod={mod} />
            ))}
          </div>
        </section>
      ))}

      {/* Payment Flow */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">💳 Payment Routing Logic</h2>
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-6">
            {["Country", "→", "Amount", "→", "Device", "→", "Risk", "→", "Payment Methods"].map((item, i) => (
              item === "→"
                ? <ChevronRight key={i} className="h-5 w-5 text-primary" />
                : <Badge key={i} className="bg-primary/10 text-primary border-primary/30 px-3 py-1.5 text-xs">{item}</Badge>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/40 p-4 space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">🌍 Global</p>
              <div className="flex flex-wrap gap-1.5">
                {["Visa / Mastercard", "Apple Pay", "Google Pay", "PayPal"].map(m => (
                  <Badge key={m} variant="outline" className="text-[11px]">{m}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">🇸🇦 Saudi / Middle East</p>
              <div className="flex flex-wrap gap-1.5">
                {["MADA", "STC Pay", "Tamara", "Tabby", "COD"].map(m => (
                  <Badge key={m} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px]">{m}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Pricing */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">💰 SaaS Pricing Structure</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="text-start px-4 py-3 font-semibold text-foreground">Plan</th>
                  <th className="text-start px-4 py-3 font-semibold text-foreground">Target</th>
                  <th className="text-start px-4 py-3 font-semibold text-foreground">Price</th>
                  <th className="text-start px-4 py-3 font-semibold text-foreground">Includes</th>
                </tr>
              </thead>
              <tbody>
                {pricingPlans.map((plan) => (
                  <tr key={plan.name} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {plan.popular && <Badge className="bg-primary text-primary-foreground text-[9px] me-2">★</Badge>}
                      {plan.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{plan.target}</td>
                    <td className="px-4 py-3 font-bold text-foreground">
                      {plan.price === "Custom" ? "Custom" : `SAR ${plan.price}/mo`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{plan.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.name} className={`relative transition-all duration-300 hover:shadow-lg ${plan.popular ? "border-primary shadow-primary/10 shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{plan.target}</p>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <span className="text-3xl font-bold text-foreground">
                      {plan.price === "Custom" ? "Custom" : `SAR ${plan.price}`}
                    </span>
                    {plan.price !== "Custom" && <span className="text-xs text-muted-foreground">/mo</span>}
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground text-start">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Region-Wise Module Strategy */}
      <RegionModuleStrategy />

      {/* Why This Model Wins */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">🧠 Why This Model Wins</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "✅", text: "Saudi-first (Salla power)", desc: "ZATCA, MADA, STC Pay, Sadad, Arabic invoices, Maroof — built for Saudi regulations" },
            { icon: "✅", text: "Global-ready (Shopify scale)", desc: "Multi-currency, multi-language, global gateways, any courier API" },
            { icon: "✅", text: "POS + CRM + ERP + HRM unified", desc: "One platform — no fragmented tools, no data silos" },
            { icon: "✅", text: "Modular (sell add-ons)", desc: "Each module = independent revenue stream per tenant" },
            { icon: "✅", text: "Perfect for Middle East expansion", desc: "COD, RTL, Islamic calendar, local couriers, VAT compliance" },
          ].map((item) => (
            <Card key={item.text} className="hover:border-primary/40 transition-all duration-300">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SaaSRoadmapTab;
