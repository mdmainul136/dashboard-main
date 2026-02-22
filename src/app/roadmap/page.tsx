"use client";

import { useLanguage } from "@/hooks/useLanguage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe, Package, ClipboardList, CreditCard, Truck, Store,
  ShoppingBag, Users, Building2, UserCog, BarChart3, LayoutGrid, Shield,
  Check, Zap, Crown, Rocket, Target, ChevronDown, ChevronRight,
  MessageCircle, Megaphone, Gift, Star, Receipt, Search, FileText,
  Repeat, ShoppingCart, Bell, Map, Paintbrush, Code, Calendar,
  Wallet, Tag, Heart, Mail, Smartphone, Percent, Globe2, Hash,
} from "lucide-react";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface ModuleData {
  icon: React.ElementType;
  num: string;
  name: string;
  nameAr: string;
  status: "built" | "partial" | "planned";
  features: string[];
  note?: string;
  saudiReady?: string[];
}

interface SectionData {
  emoji: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  modules: ModuleData[];
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Section Data (matches user's roadmap exactly) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const sections: SectionData[] = [
  {
    emoji: "ðŸ§±", title: "CORE PLATFORM LAYER", titleAr: "Ø·Ø¨Ù‚Ø© Ø§Ù„Ù…Ù†ØµØ© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©",
    subtitle: "Foundation", subtitleAr: "Ø§Ù„Ø£Ø³Ø§Ø³",
    modules: [
      {
        icon: Building2, num: "1ï¸âƒ£", name: "Multi-Tenant SaaS Core", nameAr: "Ù†ÙˆØ§Ø© SaaS Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ù…Ø³ØªØ£Ø¬Ø±ÙŠÙ†", status: "partial",
        features: ["Tenant isolation (DB per tenant)", "Subdomain + custom domain", "Country-based configuration", "Feature flags per tenant", "Plan & billing engine", "Usage quota engine", "Audit logs"],
      },
      {
        icon: Globe, num: "ðŸŒ", name: "Onboarding & Store Setup", nameAr: "Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯ ÙˆØ¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ù…ØªØ¬Ø±", status: "built",
        features: ["Business info wizard", "First product setup", "Payment connection", "Plan selection", "Store branding setup"],
      },
    ],
  },
  {
    emoji: "ðŸ›ï¸", title: "E-COMMERCE CORE", titleAr: "Ù†ÙˆØ§Ø© Ø§Ù„ØªØ¬Ø§Ø±Ø© Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ©",
    subtitle: "Shopify + Salla", subtitleAr: "Shopify + Salla",
    modules: [
      {
        icon: Paintbrush, num: "2ï¸âƒ£", name: "Storefront & CMS", nameAr: "ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ù…ØªØ¬Ø± ÙˆÙ†Ø¸Ø§Ù… Ø§Ù„Ù…Ø­ØªÙˆÙ‰", status: "built",
        features: ["Theme engine (no-code builder)", "Theme gallery (10+ templates)", "Store customizer (live preview)", "Domain manager (custom + subdomain)", "Arabic + English (RTL/LTR)", "Multi-currency", "SEO (local + global)"],
      },
      {
        icon: FileText, num: "ðŸ“", name: "Pages & Blog", nameAr: "Ø§Ù„ØµÙØ­Ø§Øª ÙˆØ§Ù„Ù…Ø¯ÙˆÙ†Ø©", status: "built",
        features: ["Static pages builder", "Blog with rich editor", "Landing pages", "Custom URL slugs", "SEO meta per page", "Draft / publish workflow"],
      },
      {
        icon: Search, num: "ðŸ”", name: "SEO Manager", nameAr: "Ø¥Ø¯Ø§Ø±Ø© SEO", status: "built",
        features: ["Meta title & description editor", "Sitemap generation", "Schema markup (JSON-LD)", "Canonical URLs", "Open Graph tags", "Google Search Console integration"],
      },
      {
        icon: Package, num: "3ï¸âƒ£", name: "Product & Catalog", nameAr: "Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª ÙˆØ§Ù„ÙƒØªØ§Ù„ÙˆØ¬", status: "built",
        features: ["Products (physical / digital)", "Variants & bundles", "SKU / barcode", "Inventory sync", "Category & collections", "Bulk import/export (CSV)", "Product reviews & ratings"],
      },
      {
        icon: ClipboardList, num: "4ï¸âƒ£", name: "Order Management", nameAr: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø·Ù„Ø¨Ø§Øª", status: "built",
        features: ["Order lifecycle", "COD support", "Partial fulfillment", "Returns & exchange", "Draft orders", "Abandoned checkout recovery", "Invoice generation (PDF)"],
      },
    ],
  },
  {
    emoji: "ðŸ’³", title: "PAYMENT ORCHESTRATION", titleAr: "ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª",
    subtitle: "Saudi + Global", subtitleAr: "Ø³Ø¹ÙˆØ¯ÙŠ + Ø¹Ø§Ù„Ù…ÙŠ",
    modules: [
      {
        icon: CreditCard, num: "5ï¸âƒ£", name: "Payment Engine (Rule-Based)", nameAr: "Ù…Ø­Ø±Ùƒ Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª (Ù‚Ø§Ø¦Ù… Ø¹Ù„Ù‰ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯)", status: "built",
        features: [
          "ðŸŒ Global: Visa / Mastercard, Apple Pay, Google Pay, PayPal",
          "ðŸ‡¸ðŸ‡¦ Saudi / Middle East: MADA, STC Pay, Tamara, Tabby, COD",
          "Country-based payment visibility",
          "COD risk scoring",
        ],
        note: "Logic: Country â†’ Amount â†’ Device â†’ Risk â†’ Payment Methods",
      },
      {
        icon: Wallet, num: "ðŸ’°", name: "Sadad Payment", nameAr: "Ù…Ø¯ÙÙˆØ¹Ø§Øª Ø³Ø¯Ø§Ø¯", status: "built",
        features: ["Sadad bill presentment", "Bill payment tracking", "Auto-reconciliation", "Payment confirmation"],
        saudiReady: ["Sadad Integration"],
      },
      {
        icon: Repeat, num: "ðŸ”„", name: "Subscription Billing", nameAr: "ÙÙˆØªØ±Ø© Ø§Ù„Ø§Ø´ØªØ±Ø§ÙƒØ§Øª", status: "built",
        features: ["Recurring billing plans", "Free trial support", "Plan upgrades/downgrades", "Auto-renewal", "Subscription analytics", "Cancellation management"],
      },
    ],
  },
  {
    emoji: "ðŸšš", title: "SHIPPING & LOGISTICS", titleAr: "Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù„ÙˆØ¬Ø³ØªÙŠØ©",
    subtitle: "Delivery Engine", subtitleAr: "Ù…Ø­Ø±Ùƒ Ø§Ù„ØªÙˆØµÙŠÙ„",
    modules: [
      {
        icon: Truck, num: "6ï¸âƒ£", name: "Delivery Engine", nameAr: "Ù…Ø­Ø±Ùƒ Ø§Ù„ØªÙˆØµÙŠÙ„", status: "built",
        features: ["Shipping zones", "Rate rules / calculator", "Courier APIs", "COD remittance", "Tracking", "Local pickup", "Shipping fulfillment dashboard"],
        saudiReady: ["Aramex", "SMSA Express"],
      },
      {
        icon: Map, num: "ðŸ—ºï¸", name: "Tracking & Map View", nameAr: "Ø§Ù„ØªØªØ¨Ø¹ ÙˆØ¹Ø±Ø¶ Ø§Ù„Ø®Ø±ÙŠØ·Ø©", status: "built",
        features: ["Real-time shipment tracking", "Gulf region map view", "Delivery status updates", "ETA calculation", "Driver assignment"],
      },
    ],
  },
  {
    emoji: "ðŸª", title: "MARKETPLACE & GROWTH", titleAr: "Ø§Ù„Ø³ÙˆÙ‚ ÙˆØ§Ù„Ù†Ù…Ùˆ",
    subtitle: "Multi-Channel Commerce", subtitleAr: "ØªØ¬Ø§Ø±Ø© Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ù‚Ù†ÙˆØ§Øª",
    modules: [
      {
        icon: Store, num: "7ï¸âƒ£", name: "Multi-Vendor Marketplace", nameAr: "Ø³ÙˆÙ‚ Ù…ØªØ¹Ø¯Ø¯ Ø§Ù„Ø¨Ø§Ø¦Ø¹ÙŠÙ†", status: "built",
        features: ["Seller onboarding & KYC", "Seller dashboard", "Commission rules", "Vendor payouts", "Seller analytics", "Dispute management"],
      },
      {
        icon: Megaphone, num: "ðŸ“¢", name: "Marketing Campaigns", nameAr: "Ø§Ù„Ø­Ù…Ù„Ø§Øª Ø§Ù„ØªØ³ÙˆÙŠÙ‚ÙŠØ©", status: "built",
        features: ["Email campaigns", "SMS campaigns", "WhatsApp broadcasts", "Campaign analytics", "A/B testing", "Audience targeting", "Scheduled sending"],
      },
      {
        icon: Zap, num: "âš¡", name: "Flash Sales & Affiliate", nameAr: "Ø¹Ø±ÙˆØ¶ Ø³Ø±ÙŠØ¹Ø© ÙˆØªØ³ÙˆÙŠÙ‚ Ø¨Ø§Ù„Ø¹Ù…ÙˆÙ„Ø©", status: "built",
        features: ["Time-limited flash sales", "Countdown timers", "Affiliate program", "Referral tracking", "Commission payouts", "Performance dashboard"],
      },
      {
        icon: MessageCircle, num: "ðŸ’¬", name: "WhatsApp Commerce", nameAr: "ØªØ¬Ø§Ø±Ø© ÙˆØ§ØªØ³Ø§Ø¨", status: "built",
        features: ["Product catalog via WhatsApp", "Order via chat", "Automated replies", "Broadcast lists", "Payment links in chat", "Order notifications"],
      },
      {
        icon: Tag, num: "ðŸ·ï¸", name: "Discount & Coupons", nameAr: "Ø§Ù„Ø®ØµÙˆÙ…Ø§Øª ÙˆØ§Ù„ÙƒÙˆØ¨ÙˆÙ†Ø§Øª", status: "built",
        features: ["Coupon code generator", "Percentage / fixed discounts", "Min order requirements", "Usage limits", "Auto-apply rules", "Cross-channel sync"],
      },
      {
        icon: Gift, num: "ðŸŽ", name: "Gift Cards", nameAr: "Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„Ù‡Ø¯Ø§ÙŠØ§", status: "built",
        features: ["Digital gift cards", "Custom amounts", "Email delivery", "Balance tracking", "Expiry management", "Bulk generation"],
      },
      {
        icon: ShoppingCart, num: "ðŸ›’", name: "Abandoned Cart Recovery", nameAr: "Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù„Ø³Ù„Ø§Øª Ø§Ù„Ù…ØªØ±ÙˆÙƒØ©", status: "built",
        features: ["Auto-detect abandoned carts", "Email reminders", "WhatsApp reminders", "Discount incentives", "Recovery analytics", "Multi-step sequences"],
      },
    ],
  },
  {
    emoji: "ðŸ§¾", title: "POS SYSTEM", titleAr: "Ù†Ø¸Ø§Ù… Ù†Ù‚Ø§Ø· Ø§Ù„Ø¨ÙŠØ¹",
    subtitle: "ONLINE + OFFLINE", subtitleAr: "Ø£ÙˆÙ†Ù„Ø§ÙŠÙ† + Ø£ÙˆÙÙ„Ø§ÙŠÙ†",
    modules: [{
      icon: ShoppingBag, num: "8ï¸âƒ£", name: "POS Module", nameAr: "ÙˆØ­Ø¯Ø© Ù†Ù‚Ø§Ø· Ø§Ù„Ø¨ÙŠØ¹", status: "built",
      features: ["Web POS", "Offline mode (PWA)", "Barcode scanner (camera)", "Cash / card / wallet", "Inventory sync", "Staff PIN login", "Branch-wise sales", "Receipt printing", "Split payments", "Hold & recall orders"],
      note: "ðŸ‘‰ Same POS works for: Saudi retail + Global retail",
    }],
  },
  {
    emoji: "ðŸ‘¥", title: "CRM & CUSTOMER", titleAr: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡",
    subtitle: "Customer Relationship Management", subtitleAr: "Ø¥Ø¯Ø§Ø±Ø© Ø¹Ù„Ø§Ù‚Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡",
    modules: [
      {
        icon: Users, num: "9ï¸âƒ£", name: "CRM Module", nameAr: "ÙˆØ­Ø¯Ø© CRM", status: "built",
        features: ["Customer profiles", "Purchase history", "Loyalty points", "Wallet / store credit", "Segmentation", "Email / SMS / WhatsApp campaigns", "Support tickets"],
      },
      {
        icon: Heart, num: "â¤ï¸", name: "Loyalty & Rewards", nameAr: "Ø§Ù„ÙˆÙ„Ø§Ø¡ ÙˆØ§Ù„Ù…ÙƒØ§ÙØ¢Øª", status: "built",
        features: ["Points system", "Tiered rewards", "Cashback rules", "Referral bonuses", "Birthday rewards", "Points expiry", "Coupon integration"],
      },
      {
        icon: Users, num: "ðŸ‘¤", name: "Customer Segments", nameAr: "Ø´Ø±Ø§Ø¦Ø­ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡", status: "built",
        features: ["Auto-segmentation rules", "RFM analysis", "VIP customers", "At-risk detection", "Custom tags", "Segment-based campaigns"],
      },
      {
        icon: Star, num: "â­", name: "Reviews & Ratings", nameAr: "Ø§Ù„ØªÙ‚ÙŠÙŠÙ…Ø§Øª ÙˆØ§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø§Øª", status: "built",
        features: ["Product reviews", "Star ratings", "Photo reviews", "Review moderation", "Auto-publish rules", "Review analytics"],
      },
    ],
  },
  {
    emoji: "ðŸ­", title: "ERP & OPERATIONS", titleAr: "ØªØ®Ø·ÙŠØ· Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ ÙˆØ§Ù„Ø¹Ù…Ù„ÙŠØ§Øª",
    subtitle: "Business Operations", subtitleAr: "Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©",
    modules: [
      {
        icon: Building2, num: "ðŸ”Ÿ", name: "ERP Module", nameAr: "ÙˆØ­Ø¯Ø© ERP", status: "built",
        features: ["Inventory & warehouse", "Purchase orders", "Supplier management", "Cost tracking", "Invoicing", "VAT accounting", "Financial reports", "Multi-warehouse support"],
        saudiReady: ["ZATCA VAT compliance", "Arabic invoices"],
      },
      {
        icon: Receipt, num: "ðŸ§¾", name: "Expense Tracker", nameAr: "ØªØªØ¨Ø¹ Ø§Ù„Ù…ØµØ§Ø±ÙŠÙ", status: "built",
        features: ["Expense categories", "Receipt upload", "Recurring expenses", "Budget tracking", "Approval workflow", "Expense reports"],
      },
      {
        icon: Building2, num: "ðŸ¢", name: "Branch Management", nameAr: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„ÙØ±ÙˆØ¹", status: "built",
        features: ["Multi-branch support", "Branch-wise inventory", "Branch-wise sales", "Inter-branch transfer", "Branch performance", "Branch staff assignment"],
      },
      {
        icon: ClipboardList, num: "ðŸ“‹", name: "Purchase Orders", nameAr: "Ø£ÙˆØ§Ù…Ø± Ø§Ù„Ø´Ø±Ø§Ø¡", status: "built",
        features: ["Create PO", "Supplier selection", "Auto-reorder rules", "PO approval workflow", "Goods receipt", "PO tracking"],
      },
      {
        icon: Package, num: "ðŸ“¦", name: "Supplier Management", nameAr: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ÙˆØ±Ø¯ÙŠÙ†", status: "built",
        features: ["Supplier directory", "Supplier performance", "Payment terms", "Lead time tracking", "Supplier portal", "Bulk ordering"],
      },
      {
        icon: Globe2, num: "ðŸ’±", name: "Multi-Currency & Tax", nameAr: "Ø§Ù„Ø¹Ù…Ù„Ø§Øª ÙˆØ§Ù„Ø¶Ø±Ø§Ø¦Ø¨", status: "built",
        features: ["Multi-currency support", "Auto exchange rates", "Tax profiles", "VAT calculation", "Tax-inclusive pricing", "Tax reports"],
      },
    ],
  },
  {
    emoji: "ðŸ‘¨â€ðŸ’¼", title: "HRM", titleAr: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©",
    subtitle: "Internal Operations", subtitleAr: "Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠØ©",
    modules: [
      {
        icon: UserCog, num: "1ï¸âƒ£1ï¸âƒ£", name: "HRM Module", nameAr: "ÙˆØ­Ø¯Ø© Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©", status: "built",
        features: ["Employee records", "Roles & permissions", "Attendance", "Shifts", "Payroll (manual / automated)", "Leave management", "Performance reviews"],
      },
      {
        icon: Shield, num: "ðŸ”‘", name: "Staff Access & RBAC", nameAr: "ØµÙ„Ø§Ø­ÙŠØ§Øª Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†", status: "built",
        features: ["Role-based access control", "Custom permission sets", "Module-level access", "Action-level restrictions", "Staff activity log", "Two-factor auth"],
      },
    ],
  },
  {
    emoji: "ðŸ“Š", title: "ANALYTICS & AI", titleAr: "Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª ÙˆØ§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ",
    subtitle: "Analytics Engine", subtitleAr: "Ù…Ø­Ø±Ùƒ Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª",
    modules: [
      {
        icon: BarChart3, num: "1ï¸âƒ£2ï¸âƒ£", name: "Analytics Engine", nameAr: "Ù…Ø­Ø±Ùƒ Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª", status: "built",
        features: ["Sales dashboards", "Product performance", "Seller performance", "COD vs prepaid ratio", "VAT reports", "Export CSV", "Predictive insights (future)"],
      },
      {
        icon: BarChart3, num: "ðŸ“ˆ", name: "Sales Report", nameAr: "ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª", status: "built",
        features: ["Revenue trends", "Top products", "Sales by channel", "Sales by region", "Profit margins", "Custom date ranges"],
      },
      {
        icon: Package, num: "ðŸ“¦", name: "Inventory Report", nameAr: "ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ù…Ø®Ø²ÙˆÙ†", status: "built",
        features: ["Stock levels", "Low stock alerts", "Dead stock report", "Stock movement", "Valuation report", "Reorder suggestions"],
      },
      {
        icon: Users, num: "ðŸŽ¯", name: "Customer Insights", nameAr: "Ø±Ø¤Ù‰ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡", status: "built",
        features: ["Customer lifetime value", "Cohort analysis", "Purchase frequency", "Geographic distribution", "Retention rate", "Churn prediction"],
      },
    ],
  },
  {
    emoji: "ðŸ”Œ", title: "APP ECOSYSTEM & DEVELOPER", titleAr: "Ù†Ø¸Ø§Ù… Ø§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª ÙˆØ§Ù„Ù…Ø·ÙˆØ±ÙŠÙ†",
    subtitle: "Shopify Power", subtitleAr: "Ù‚ÙˆØ© Shopify",
    modules: [
      {
        icon: LayoutGrid, num: "1ï¸âƒ£3ï¸âƒ£", name: "App Marketplace", nameAr: "Ù…ØªØ¬Ø± Ø§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª", status: "built",
        features: ["Third-party apps", "Internal modules as apps", "App install/uninstall", "App settings panel", "App ratings & reviews", "Category browsing"],
      },
      {
        icon: Code, num: "ðŸ› ï¸", name: "Developer Portal", nameAr: "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…Ø·ÙˆØ±ÙŠÙ†", status: "built",
        features: ["API key management (prod + test)", "API documentation (8+ endpoints)", "Webhooks (event-based)", "Sandbox testing environment", "OAuth flow", "Rate limiting"],
      },
      {
        icon: Bell, num: "ðŸ””", name: "Webhook & Notifications", nameAr: "ÙˆÙŠØ¨ Ù‡ÙˆÙƒ ÙˆØ§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª", status: "built",
        features: ["Webhook endpoints", "Event subscriptions", "Retry logic", "Notification templates (email/SMS/push)", "Real-time notifications", "Notification center"],
      },
      {
        icon: Hash, num: "ðŸ“¤", name: "CSV Import/Export", nameAr: "Ø§Ø³ØªÙŠØ±Ø§Ø¯/ØªØµØ¯ÙŠØ± CSV", status: "built",
        features: ["Product import/export", "Customer import/export", "Order export", "Inventory import", "Column mapping", "Validation & error handling"],
      },
    ],
  },
  {
    emoji: "ðŸ”", title: "SECURITY & COMPLIANCE", titleAr: "Ø§Ù„Ø£Ù…Ø§Ù† ÙˆØ§Ù„Ø§Ù…ØªØ«Ø§Ù„",
    subtitle: "Security Layer", subtitleAr: "Ø·Ø¨Ù‚Ø© Ø§Ù„Ø£Ù…Ø§Ù†",
    modules: [
      {
        icon: Shield, num: "1ï¸âƒ£4ï¸âƒ£", name: "Security Layer", nameAr: "Ø·Ø¨Ù‚Ø© Ø§Ù„Ø£Ù…Ø§Ù†", status: "built",
        features: ["SSL", "PCI-DSS", "Role-based access", "Audit logs", "Fraud detection", "DDoS protection", "Backup & restore"],
      },
      {
        icon: Receipt, num: "ðŸ§¾", name: "ZATCA E-Invoicing", nameAr: "Ø§Ù„ÙÙˆØªØ±Ø© Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ© Ø²Ø§ØªÙƒØ§", status: "built",
        features: ["E-invoice generation", "QR code embedding", "Arabic invoice preview", "XML submission", "Phase 1 & 2 compliance", "Validation engine"],
        saudiReady: ["ZATCA Phase 1", "ZATCA Phase 2"],
      },
    ],
  },
  {
    emoji: "ðŸ‡¸ðŸ‡¦", title: "SAUDI-SPECIFIC SERVICES", titleAr: "Ø®Ø¯Ù…Ø§Øª Ø³Ø¹ÙˆØ¯ÙŠØ©",
    subtitle: "Kingdom of Saudi Arabia", subtitleAr: "Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©",
    modules: [
      {
        icon: Shield, num: "ðŸ›ï¸", name: "Maroof Integration", nameAr: "ØªÙƒØ§Ù…Ù„ Ù…Ø¹Ø±ÙˆÙ", status: "built",
        features: ["Maroof store verification", "Trust badge display", "Business registration link", "Auto-verification status", "Compliance dashboard"],
        saudiReady: ["Maroof verified"],
      },
      {
        icon: Map, num: "ðŸ“", name: "National Address (SPL)", nameAr: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙˆØ·Ù†ÙŠ", status: "built",
        features: ["Saudi Post address lookup", "Short address support", "Address validation", "Auto-fill from national ID", "Delivery zone mapping"],
        saudiReady: ["Saudi Post (SPL)"],
      },
      {
        icon: Wallet, num: "ðŸ’³", name: "Sadad Payment System", nameAr: "Ù†Ø¸Ø§Ù… Ø³Ø¯Ø§Ø¯", status: "built",
        features: ["Sadad bill presentment", "Auto payment matching", "Bill status tracking", "Reconciliation reports"],
        saudiReady: ["Sadad"],
      },
    ],
  },
  {
    emoji: "ðŸ“…", title: "PRODUCTIVITY & TOOLS", titleAr: "Ø§Ù„Ø¥Ù†ØªØ§Ø¬ÙŠØ© ÙˆØ§Ù„Ø£Ø¯ÙˆØ§Øª",
    subtitle: "Business Tools", subtitleAr: "Ø£Ø¯ÙˆØ§Øª Ø§Ù„Ø£Ø¹Ù…Ø§Ù„",
    modules: [
      {
        icon: Calendar, num: "ðŸ“…", name: "Calendar & Scheduling", nameAr: "Ø§Ù„ØªÙ‚ÙˆÙŠÙ… ÙˆØ§Ù„Ø¬Ø¯ÙˆÙ„Ø©", status: "built",
        features: ["Event management", "Task scheduling", "Delivery scheduling", "Staff shift calendar", "Reminders", "Multi-view (day/week/month)"],
      },
      {
        icon: ClipboardList, num: "ðŸ“œ", name: "Audit Log", nameAr: "Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©", status: "built",
        features: ["Full activity log", "User action tracking", "Filter by action type", "Date range search", "Export audit trail", "Compliance reporting"],
      },
      {
        icon: Smartphone, num: "ðŸ“±", name: "PWA & Mobile Install", nameAr: "ØªØ·Ø¨ÙŠÙ‚ ÙˆÙŠØ¨ ØªÙ‚Ø¯Ù…ÙŠ", status: "built",
        features: ["Progressive Web App", "Install prompt", "Offline support", "Push notifications", "Home screen icon", "Auto-update"],
      },
    ],
  },
];

const statusBadge = {
  built: { label: "Built âœ…", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  partial: { label: "In Progress ðŸ”„", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  planned: { label: "Planned ðŸ“‹", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
};

const pricingPlans = [
  { name: "Starter", price: "0", target: "Small sellers", includes: "Store + payments", features: ["Storefront + Payments", "Up to 50 products", "Basic analytics", "Email support"], icon: Zap },
  { name: "Business", price: "99", target: "Growing brands", includes: "POS + CRM", features: ["POS Terminal", "CRM + Loyalty", "Unlimited products", "Multi-currency", "Priority support"], icon: Target, popular: true },
  { name: "Pro", price: "299", target: "Marketplace", includes: "ERP + multi-vendor", features: ["ERP Module", "Multi-vendor Marketplace", "Custom domain", "API access", "Dedicated manager"], icon: Crown },
  { name: "Enterprise", price: "Custom", target: "Large org", includes: "HRM + API + custom", features: ["HRM Module", "Full REST + GraphQL API", "White-label", "SLA guarantee", "On-premise option"], icon: Rocket },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Module Card Component (always open, flat document style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">ðŸ‡¸ðŸ‡¦ Saudi Ready</p>
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const RoadmapPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const builtCount = sections.reduce((acc, s) => acc + s.modules.filter(m => m.status === "built").length, 0);
  const totalCount = sections.reduce((acc, s) => acc + s.modules.length, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">

        {/* â•â•â• HERO â•â•â• */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-border/60 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_70%)]" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">ðŸ‡¸ðŸ‡¦ Saudi-First</Badge>
              <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30">ðŸŒ Global-Ready</Badge>
              <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30">â˜ï¸ Cloud SaaS</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              ðŸŒ Global + Saudi Ready Unified Commerce SaaS
            </h1>
            <p className="text-base text-muted-foreground max-w-3xl">
              (Shopify + Salla model) â€” POS, CRM, ERP, HRM à¦¸à¦¹ à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£ SaaS à¦ªà§à¦²à§à¦¯à¦¾à¦Ÿà¦«à¦°à§à¦®à¥¤ Saudi retail à¦¥à§‡à¦•à§‡ global marketplace à¦ªà¦°à§à¦¯à¦¨à§à¦¤ à¦¸à¦¬ à¦•à¦¿à¦›à§ à¦à¦• à¦œà¦¾à¦¯à¦¼à¦—à¦¾à¦¯à¦¼à¥¤
            </p>
            <p className="text-sm text-muted-foreground/60 italic">
              ðŸ“ System Design Document &nbsp;â€¢&nbsp; ðŸ’¼ Investor Deck &nbsp;â€¢&nbsp; ðŸ—ºï¸ SaaS Roadmap
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

        {/* â•â•â• SYSTEM DESIGN â€” Grouped Sections â•â•â• */}
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

        {/* â•â•â• PAYMENT FLOW VISUALIZATION â•â•â• */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">ðŸ’³ Payment Routing Logic</h2>
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2 text-sm mb-6">
              {["Country", "â†’", "Amount", "â†’", "Device", "â†’", "Risk", "â†’", "Payment Methods"].map((item, i) => (
                item === "â†’"
                  ? <ChevronRight key={i} className="h-5 w-5 text-primary" />
                  : <Badge key={i} className="bg-primary/10 text-primary border-primary/30 px-3 py-1.5 text-xs">{item}</Badge>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/40 p-4 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ðŸŒ Global</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Visa / Mastercard", "Apple Pay", "Google Pay", "PayPal"].map(m => (
                    <Badge key={m} variant="outline" className="text-[11px]">{m}</Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">ðŸ‡¸ðŸ‡¦ Saudi / Middle East</p>
                <div className="flex flex-wrap gap-1.5">
                  {["MADA", "STC Pay", "Tamara", "Tabby", "COD"].map(m => (
                    <Badge key={m} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px]">{m}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* â•â•â• SAAS PRICING STRUCTURE â•â•â• */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">ðŸ’° SaaS Pricing Structure</h2>
          {/* Table view */}
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
                        {plan.popular && <Badge className="bg-primary text-primary-foreground text-[9px] me-2">â˜…</Badge>}
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

          {/* Card view */}
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

        {/* â•â•â• WHY THIS MODEL WINS â•â•â• */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">ðŸ§  Why This Model Wins</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "âœ…", text: "Saudi-first (Salla power)", desc: "ZATCA, MADA, STC Pay, Sadad, Arabic invoices, Maroof â€” built for Saudi regulations" },
              { icon: "âœ…", text: "Global-ready (Shopify scale)", desc: "Multi-currency, multi-language, global gateways, any courier API" },
              { icon: "âœ…", text: "POS + CRM + ERP + HRM unified", desc: "One platform â€” no fragmented tools, no data silos" },
              { icon: "âœ…", text: "Modular (sell add-ons)", desc: "Each module = independent revenue stream per tenant" },
              { icon: "âœ…", text: "Perfect for Middle East expansion", desc: "COD, RTL, Islamic calendar, local couriers, VAT compliance" },
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
    </DashboardLayout>
  );
};

export default RoadmapPage;

