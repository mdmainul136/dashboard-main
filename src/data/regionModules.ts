/**
 * ============================================================================
 * Region-Wise Module Strategy — Multi-Market Configuration
 * ============================================================================
 *
 * PURPOSE:
 *   Defines the module availability, pricing, payment methods, and compliance
 *   requirements for each geographic region. This is what makes the platform
 *   "multi-market" — the same platform adapts to MENA, Europe, South Asia, etc.
 *
 * KEY CONCEPTS:
 *   - Each region has a different set of "core" (free), "addon" (paid), and "na" (hidden) modules
 *   - Payment methods vary by region (MADA for Saudi, Stripe for Europe, UPI for India)
 *   - Pricing plans have region-specific currencies and feature sets
 *   - Compliance requirements differ (ZATCA for Saudi, GDPR for Europe)
 *
 * USED BY:
 *   - useMerchantRegion.ts → resolves country to region, checks module availability
 *   - Sidebar.tsx → filters navigation items based on region
 *   - PlanSelection.tsx → shows region-specific pricing plans
 *   - PaymentConnect.tsx → shows region-specific payment methods
 *   - Completion screen → shows region compliance info
 *
 * BACKEND INTEGRATION:
 *   This data can remain client-side (it's configuration, not user data).
 *   Alternatively, serve from GET /api/regions and GET /api/regions/:id
 *
 * ============================================================================
 */

/** Module availability status per region */
export type ModuleStatus = "core" | "addon" | "na";
// core  → Included free in the plan, always visible in sidebar
// addon → Available for purchase, shown with 🔒 lock icon in sidebar
// na    → Not available in this region, completely hidden from sidebar

/** Add-on module with pricing for the upgrade dialog */
export interface ModuleAddon {
  id: string;
  name: string;
  price: number; // USD equivalent monthly price
  icon: string;
}

/** Payment method available in a region (shown during onboarding & payment settings) */
export interface PaymentMethod {
  name: string;
  icon: string; // emoji
}

/** Subscription pricing plan per region */
export interface PricingPlan {
  name: string;
  price: string;       // Display string (e.g., "SAR 99/mo", "Free")
  target: string;      // Target audience description
  features: string[];  // Feature list for this plan
  popular?: boolean;   // Show "Popular" badge
}

/**
 * Complete configuration for a geographic region.
 * Each region defines its own module strategy, pricing, payments, and compliance.
 *
 * Backend: This could be a `regions` table or a static config served via API.
 */
export interface RegionConfig {
  id: "mena" | "europe" | "south-asia" | "global";
  name: string;                              // Display name (e.g., "Middle East (MENA)")
  flag: string;                              // Emoji flag
  countries: string[];                       // Countries belonging to this region
  currency: { code: string; symbol: string };
  modules: Record<string, ModuleStatus>;     // moduleId → core/addon/na
  addonPricing: Record<string, number>;      // moduleId → monthly USD price
  paymentMethods: PaymentMethod[];           // Available payment gateways
  pricingPlans: PricingPlan[];               // Subscription tiers
  compliance: string[];                      // Required compliance standards
  positioning: string;                       // Marketing tagline for this region
}

// All modules in the system
export const allModules = [
  // Core eCommerce (always core everywhere)
  { id: "storefront", name: "Storefront & CMS", category: "eCommerce Core", icon: "🛍️", features: ["Theme engine", "Theme gallery", "Store customizer", "Domain manager", "RTL/LTR", "Multi-currency"] },
  { id: "products", name: "Product & Catalog", category: "eCommerce Core", icon: "📦", features: ["Physical & digital products", "Variants & bundles", "SKU / barcode", "Inventory sync", "Collections", "CSV import"] },
  { id: "orders", name: "Order Management", category: "eCommerce Core", icon: "📋", features: ["Order lifecycle", "COD support", "Returns & exchange", "Draft orders", "Invoice PDF"] },
  { id: "payments", name: "Payment Engine", category: "eCommerce Core", icon: "💳", features: ["Rule-based routing", "Country-based visibility", "COD risk scoring", "Multi-gateway"] },
  { id: "delivery", name: "Delivery Engine", category: "eCommerce Core", icon: "🚚", features: ["Shipping zones", "Rate calculator", "Courier APIs", "Tracking", "Local pickup"] },
  { id: "seo", name: "SEO Manager", category: "eCommerce Core", icon: "🔍", features: ["Meta editor", "Sitemap", "Schema markup", "Open Graph", "Search Console"] },
  { id: "pages", name: "Pages & Blog", category: "eCommerce Core", icon: "📝", features: ["Static pages", "Blog editor", "Landing pages", "SEO per page", "Draft/publish"] },
  // Commerce Growth
  { id: "pos", name: "POS System", category: "Commerce Growth", icon: "🏪", features: ["Web POS", "Offline mode (PWA)", "Barcode scanner", "Split payments", "Receipt printing", "Branch-wise sales"] },
  { id: "crm", name: "CRM & Loyalty", category: "Commerce Growth", icon: "👥", features: ["Customer profiles", "Loyalty points", "Wallet / store credit", "Segmentation", "Support tickets"] },
  { id: "whatsapp", name: "WhatsApp Commerce", category: "Commerce Growth", icon: "💬", features: ["Product catalog via WhatsApp", "Order via chat", "Auto replies", "Broadcast lists", "Payment links"] },
  { id: "marketplace", name: "Marketplace (Multi-Vendor)", category: "Commerce Growth", icon: "🏬", features: ["Seller onboarding & KYC", "Commission rules", "Vendor payouts", "Seller analytics", "Dispute management"] },
  { id: "flash-sales", name: "Flash Sales & Affiliate", category: "Commerce Growth", icon: "⚡", features: ["Flash sales + countdown", "Affiliate program", "Referral tracking", "Commission payouts"] },
  { id: "marketing", name: "Marketing Campaigns", category: "Commerce Growth", icon: "📢", features: ["Email campaigns", "SMS campaigns", "WhatsApp broadcasts", "A/B testing", "Scheduled sending"] },
  // Enterprise / ERP
  { id: "erp", name: "ERP Module", category: "Enterprise", icon: "🏭", features: ["Inventory & warehouse", "Purchase orders", "Supplier management", "VAT accounting", "Financial reports"] },
  { id: "hrm", name: "HRM Module", category: "Enterprise", icon: "👨‍💼", features: ["Employee records", "Attendance & shifts", "Payroll", "Leave management", "Performance reviews"] },
  { id: "branches", name: "Branch Management", category: "Enterprise", icon: "🏢", features: ["Multi-branch", "Branch inventory", "Inter-branch transfer", "Branch performance"] },
  { id: "purchase-orders", name: "Purchase Orders", category: "Enterprise", icon: "📋", features: ["Create PO", "Auto-reorder", "Approval workflow", "Goods receipt", "PO tracking"] },
  { id: "warehouse", name: "Warehouse Management", category: "Enterprise", icon: "📦", features: ["Multi-warehouse", "Stock movement", "Bin locations", "Cycle count", "Transfer orders"] },
  { id: "expenses", name: "Expense Tracker", category: "Enterprise", icon: "🧾", features: ["Expense categories", "Receipt upload", "Budget tracking", "Approval workflow", "Reports"] },
  // Saudi-Specific
  { id: "zatca", name: "ZATCA E-Invoicing", category: "Saudi Services", icon: "🧾", features: ["E-invoice generation", "QR code", "Arabic preview", "Phase 1 & 2", "XML submission"] },
  { id: "maroof", name: "Maroof Integration", category: "Saudi Services", icon: "🏛️", features: ["Store verification", "Trust badge", "Auto-verification status"] },
  { id: "national-address", name: "National Address (SPL)", category: "Saudi Services", icon: "📍", features: ["Address lookup", "Short address", "Validation", "Delivery zone mapping"] },
  { id: "sadad", name: "Sadad Payment", category: "Saudi Services", icon: "💰", features: ["Bill presentment", "Auto-reconciliation", "Payment tracking"] },
  // Europe-Specific
  // Compliance
  { id: "gdpr", name: "GDPR Compliance", category: "Compliance", icon: "🔐", features: ["Data protection", "Cookie consent", "Right to erasure", "Data export", "Privacy policy"] },
  // Advanced Tracking & Logistics
  { id: "sgtm", name: "Server-Side GTM", category: "Advanced Tracking", icon: "⚡", features: ["First-party data", "CAPI integration", "Signal diagnostics", "Privacy redaction", "GTM Server provisioning"] },
  { id: "ior", name: "Cross-Border IOR", category: "Global Logistics", icon: "🚢", features: ["Global sourcing", "Customs clearance", "Duty mapping", "Real-time warehouse", "HS Code AI"] },
] as const;

export type ModuleId = (typeof allModules)[number]["id"];

// ============= Region Configs =============

export const regions: RegionConfig[] = [
  {
    id: "mena",
    name: "Middle East (MENA)",
    flag: "🇸🇦",
    countries: ["Saudi Arabia", "UAE", "Kuwait", "Bahrain", "Qatar", "Oman", "Egypt", "Jordan"],
    currency: { code: "SAR", symbol: "﷼" },
    modules: {
      storefront: "core", products: "core", orders: "core", payments: "core",
      delivery: "core", seo: "core", pages: "core",
      pos: "core", crm: "core", whatsapp: "core", marketplace: "addon",
      "flash-sales": "core", marketing: "addon",
      erp: "addon", hrm: "addon", branches: "addon", "purchase-orders": "addon",
      warehouse: "addon", expenses: "addon",
      zatca: "core", maroof: "core", "national-address": "core", sadad: "core",
      gdpr: "na", sgtm: "addon", ior: "addon",
    },
    addonPricing: {
      marketplace: 49, marketing: 19, erp: 79, hrm: 49,
      branches: 29, "purchase-orders": 19, warehouse: 29, expenses: 15,
      sgtm: 39, ior: 99,
    },
    paymentMethods: [
      { name: "MADA", icon: "💳" }, { name: "STC Pay", icon: "📱" },
      { name: "Tamara", icon: "🛍️" }, { name: "Tabby", icon: "🏷️" },
      { name: "COD", icon: "💵" }, { name: "Sadad", icon: "🏦" },
      { name: "Apple Pay", icon: "🍎" },
    ],
    pricingPlans: [
      { name: "Starter", price: "Free", target: "Small sellers", features: ["Storefront + Payments", "Up to 50 products", "POS + WhatsApp", "Basic analytics"] },
      { name: "Business", price: "SAR 99/mo", target: "Growing brands", features: ["Unlimited products", "CRM + Loyalty", "Multi-currency", "Priority support"], popular: true },
      { name: "Pro", price: "SAR 299/mo", target: "Enterprise", features: ["ERP Module", "Multi-vendor Marketplace", "API access", "Dedicated manager"] },
      { name: "Enterprise", price: "Custom", target: "Large org", features: ["HRM Module", "White-label", "SLA guarantee", "Custom development"] },
    ],
    compliance: ["ZATCA E-Invoicing (Phase 1 & 2)", "Maroof Verification", "Saudi National Address", "Sadad Payment"],
    positioning: "Salla alternative with global scale",
  },
  {
    id: "europe",
    name: "Europe & West Asia",
    flag: "🇪🇺",
    countries: ["UK", "Germany", "France", "Turkey", "Spain", "Italy", "Netherlands", "Sweden"],
    currency: { code: "EUR", symbol: "€" },
    modules: {
      storefront: "core", products: "core", orders: "core", payments: "core",
      delivery: "core", seo: "core", pages: "core",
      pos: "addon", crm: "addon", whatsapp: "addon", marketplace: "addon",
      "flash-sales": "addon", marketing: "addon",
      erp: "addon", hrm: "addon", branches: "addon", "purchase-orders": "addon",
      warehouse: "addon", expenses: "addon",
      zatca: "na", maroof: "na", "national-address": "na", sadad: "na",
      gdpr: "core", sgtm: "addon", ior: "addon",
    },
    addonPricing: {
      pos: 25, crm: 19, whatsapp: 15, marketplace: 49, "flash-sales": 15,
      marketing: 19, erp: 79, hrm: 49, branches: 29,
      "purchase-orders": 19, warehouse: 29, expenses: 15,
      sgtm: 39, ior: 99,
    },
    paymentMethods: [
      { name: "Stripe", icon: "💳" }, { name: "PayPal", icon: "🅿️" },
      { name: "Klarna", icon: "🛍️" }, { name: "SEPA", icon: "🏦" },
      { name: "Apple Pay", icon: "🍎" }, { name: "Google Pay", icon: "📱" },
    ],
    pricingPlans: [
      { name: "Starter", price: "Free", target: "Solo sellers", features: ["Storefront + Payments", "Up to 50 products", "GDPR compliant", "Basic analytics"] },
      { name: "Business", price: "€29/mo", target: "SMBs", features: ["Unlimited products", "Multi-currency EU", "Priority support", "SEO tools"], popular: true },
      { name: "Pro", price: "€79/mo", target: "Scale-ups", features: ["POS + CRM", "Marketplace", "API access", "Dedicated manager"] },
      { name: "Enterprise", price: "Custom", target: "Enterprise", features: ["Full ERP + HRM", "White-label", "SLA guarantee", "MENA expansion built-in"] },
    ],
    compliance: ["GDPR Data Protection", "EU VAT Rules", "PSD2 Payment Security"],
    positioning: "Shopify alternative with MENA expansion built-in",
  },
  {
    id: "south-asia",
    name: "South Asia",
    flag: "🇮🇳",
    countries: ["India", "Bangladesh", "Pakistan", "Sri Lanka", "Nepal"],
    currency: { code: "USD", symbol: "$" },
    modules: {
      storefront: "core", products: "core", orders: "core", payments: "core",
      delivery: "core", seo: "core", pages: "core",
      pos: "addon", crm: "addon", whatsapp: "core", marketplace: "addon",
      "flash-sales": "core", marketing: "addon",
      erp: "na", hrm: "na", branches: "na", "purchase-orders": "na",
      warehouse: "na", expenses: "na",
      zatca: "na", maroof: "na", "national-address": "na", sadad: "na",
      gdpr: "na", sgtm: "addon", ior: "addon",
    },
    addonPricing: {
      pos: 15, crm: 12, marketplace: 29, marketing: 12,
      sgtm: 29, ior: 79,
    },
    paymentMethods: [
      { name: "Razorpay", icon: "💳" }, { name: "bKash", icon: "📱" },
      { name: "JazzCash", icon: "🎵" }, { name: "UPI", icon: "🏦" },
      { name: "COD", icon: "💵" }, { name: "Bank Transfer", icon: "🏛️" },
    ],
    pricingPlans: [
      { name: "Starter", price: "Free", target: "New sellers", features: ["Storefront + Payments", "Up to 25 products", "WhatsApp Commerce", "Basic analytics"] },
      { name: "Starter+", price: "$9/mo", target: "eCommerce only", features: ["Unlimited products", "Flash Sales", "WhatsApp + COD", "No ERP/POS overhead"], popular: true },
      { name: "Business", price: "$29/mo", target: "Growing brands", features: ["POS + CRM", "Multi-currency", "Marketing tools", "Priority support"] },
      { name: "Pro", price: "$49/mo", target: "Enterprise needs", features: ["Marketplace", "API access", "Custom modules", "Dedicated manager"] },
    ],
    compliance: ["Local payment compliance"],
    positioning: "Affordable eCommerce — just what you need, nothing extra",
  },
  {
    id: "global",
    name: "Global (Default)",
    flag: "🌍",
    countries: ["USA", "Canada", "Australia", "Japan", "Brazil", "Mexico", "Nigeria", "Kenya"],
    currency: { code: "USD", symbol: "$" },
    modules: {
      storefront: "core", products: "core", orders: "core", payments: "core",
      delivery: "core", seo: "core", pages: "core",
      pos: "addon", crm: "addon", whatsapp: "addon", marketplace: "addon",
      "flash-sales": "addon", marketing: "addon",
      erp: "addon", hrm: "addon", branches: "addon", "purchase-orders": "addon",
      warehouse: "addon", expenses: "addon",
      zatca: "na", maroof: "na", "national-address": "na", sadad: "na",
      gdpr: "addon", sgtm: "addon", ior: "addon",
    },
    addonPricing: {
      pos: 20, crm: 15, whatsapp: 12, marketplace: 39, "flash-sales": 12,
      marketing: 15, erp: 59, hrm: 39, branches: 25,
      "purchase-orders": 15, warehouse: 25, expenses: 12, gdpr: 10,
      sgtm: 35, ior: 89,
    },
    paymentMethods: [
      { name: "Stripe", icon: "💳" }, { name: "PayPal", icon: "🅿️" },
      { name: "Apple Pay", icon: "🍎" }, { name: "Google Pay", icon: "📱" },
      { name: "COD", icon: "💵" },
    ],
    pricingPlans: [
      { name: "Starter", price: "Free", target: "Anyone", features: ["Storefront + Payments", "Up to 50 products", "Basic analytics", "Email support"] },
      { name: "Business", price: "$29/mo", target: "Growing brands", features: ["Unlimited products", "Multi-currency", "Priority support", "SEO tools"], popular: true },
      { name: "Pro", price: "$79/mo", target: "Scale-ups", features: ["POS + CRM + ERP", "Marketplace", "API access", "Dedicated manager"] },
      { name: "Enterprise", price: "Custom", target: "Large org", features: ["Full suite", "White-label", "SLA guarantee", "Custom dev"] },
    ],
    compliance: ["PCI-DSS", "SSL/TLS"],
    positioning: "All-in-one commerce platform — start anywhere, scale everywhere",
  },
];

export function getModulesByCategory() {
  const categories: Record<string, typeof allModules[number][]> = {};
  for (const mod of allModules) {
    if (!categories[mod.category]) categories[mod.category] = [];
    categories[mod.category].push(mod);
  }
  return categories;
}

// mapping of country names to ISO 3166-1 alpha-2 codes
export const COUNTRY_CODES: Record<string, string> = {
  "Saudi Arabia": "SA",
  "UAE": "AE",
  "Kuwait": "KW",
  "Bahrain": "BH",
  "Qatar": "QA",
  "Oman": "OM",
  "Egypt": "EG",
  "Jordan": "JO",
  "UK": "GB",
  "Germany": "DE",
  "France": "FR",
  "Turkey": "TR",
  "Spain": "ES",
  "Italy": "IT",
  "Netherlands": "NL",
  "Sweden": "SE",
  "India": "IN",
  "Bangladesh": "BD",
  "Pakistan": "PK",
  "Sri Lanka": "LK",
  "Nepal": "NP",
  "USA": "US",
  "Canada": "CA",
  "Australia": "AU",
  "Japan": "JP",
  "Brazil": "BR",
  "Mexico": "MX",
  "Nigeria": "NG",
  "Kenya": "KE"
};

// Get all countries flat list
export function getAllCountries() {
  return regions.flatMap(r => r.countries.map(c => ({
    name: c,
    flag: r.flag,
    code: COUNTRY_CODES[c] || "??",
    regionId: r.id
  })))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get region by country name
export function getRegionByCountry(country: string): RegionConfig | undefined {
  return regions.find(r => r.countries.includes(country));
}
