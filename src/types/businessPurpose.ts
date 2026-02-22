/**
 * Business Purpose Types — Core Type Definitions
 * ============================================================================
 * Defines all 15 supported business verticals and their associated types.
 * These types are used across onboarding, dashboard, sidebar, and modules.
 * ============================================================================
 */

/** Union type of all supported business verticals */
export type BusinessPurpose =
    | "ecommerce"        // Online Store
    | "business-website" // Company/Portfolio
    | "real-estate"      // Property Listings
    | "restaurant"       // Restaurant/Cafe
    | "lms"              // Learning Platform
    | "healthcare"       // Clinic/Hospital
    | "fitness"          // Gym/Fitness
    | "salon"            // Salon/Spa
    | "freelancer"       // Freelancer/Agency
    | "travel"           // Travel/Tourism
    | "automotive"       // Car Dealer/Repair
    | "event"            // Events/Wedding
    | "saas"             // SaaS Product
    | "landlord"         // Property Landlord
    | "education"        // Education / Coaching
    | "cross-border-ior"; // Cross-Border Importer of Record

/** Configuration for a single purpose option card in the selector */
export interface PurposeOption {
    id: BusinessPurpose;
    icon: string | React.ElementType; // Emoji or Icon component
    title: string;          // English display name
    titleAr: string;        // Arabic display name
    description: string;    // One-line description
    examples: string[];     // Example sub-types
    color: string;          // Tailwind color classes
    category: string;       // Category grouping
}

/** Module availability status per region */
export type ModuleStatus = "core" | "addon" | "na";

/** Payment method available in a region */
export interface PaymentMethod {
    name: string;
    icon: string;
}

/** Subscription pricing plan per region */
export interface PricingPlan {
    name: string;
    price: string;
    target: string;
    features: string[];
    popular?: boolean;
}

/** Complete configuration for a geographic region */
export interface RegionConfig {
    id: "mena" | "europe" | "south-asia" | "global";
    name: string;
    flag: string;
    countries: string[];
    currency: { code: string; symbol: string };
    modules: Record<string, ModuleStatus>;
    addonPricing: Record<string, number>;
    paymentMethods: PaymentMethod[];
    pricingPlans: PricingPlan[];
    compliance: string[];
    positioning: string;
}

/** Module definition */
export interface ModuleDefinition {
    id: string;
    name: string;
    category: string;
    icon: string;
    features: string[];
    viewType?: "table" | "kanban" | "chart" | "form" | "grid" | "generic";
}

/** Configuration for vertical-specific core and addon modules */
export interface PurposeModule {
    id: string;
    name: string;
    category: string;
    icon: string;
    features: string[];
    viewType?: "table" | "kanban" | "chart" | "form" | "grid" | "generic";
}
/** Data collected during onboarding */
export interface MerchantData {
    ownerName?: string;
    email?: string;
    phone?: string;
    registrationType?: string;
    crNumber?: string;
    vatNumber?: string;
    storeNameEn?: string;
    storeNameAr?: string;
    siteNameEn?: string;
    siteNameAr?: string;
    subdomain?: string;
    country?: string;
    region?: string;
    plan?: string;
}
