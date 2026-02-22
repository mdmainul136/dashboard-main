/**
 * ============================================================================
 * Business Purpose Types — Core Type Definitions
 * ============================================================================
 *
 * NOTE: The BusinessPurpose type is also defined in:
 *   - src/hooks/useMerchantRegion.ts (canonical source for the hook)
 *   - src/data/purposeThemes.ts (for theme mapping)
 *   These MUST stay in sync. When adding a new vertical, update ALL three.
 *
 * ============================================================================
 */

/**
 * Union type of all supported business verticals.
 * Each vertical gets tailored onboarding, dashboard, sidebar, and modules.
 */
export type BusinessPurpose =
  | "ecommerce"        // Online Store — full eCommerce (Products, Orders, POS, etc.)
  | "business-website" // Company/Portfolio — Pages, Blog, SEO, Contact Forms
  | "real-estate"      // Property Listings — Listings, Agents, Virtual Tours, Contracts
  | "restaurant"       // Restaurant/Cafe — Menu, KDS, Table Management, Delivery
  | "lms"              // Learning Platform — Courses, Quizzes, Certificates, Students
  | "healthcare"       // Clinic/Hospital — Patients, Appointments, Prescriptions, Telemedicine
  | "fitness"          // Gym/Fitness — Classes, Memberships, Trainers, Progress Tracking
  | "salon"            // Salon/Spa — Bookings, Services, Staff, Client Loyalty
  | "freelancer"       // Freelancer/Agency — Portfolio, Proposals, Invoicing, Client Portal
  | "travel"           // Travel/Tourism — Tour Packages, Bookings, Itineraries, Guides
  | "automotive"       // Car Dealer/Repair — Vehicle Listings, Service Booking, Parts, Finance
  | "event"            // Events/Wedding — Event Manager, Venues, RSVP, Ticketing, Vendors
  | "saas"             // SaaS Product — Landing Page, Pricing, Docs, Changelog, Analytics
  | "landlord"         // Property Landlord — My Properties, Tenants, Leases, Rent, Maintenance
  | "education"        // Education / Coaching — Class Schedule, Students, Fee Collection, Attendance
  | "cross-border-ior"; // Cross-Border Importer of Record

/**
 * Configuration for a single purpose option card in the selector.
 * Displayed during onboarding Step 1.
 */
export interface PurposeOption {
  id: BusinessPurpose;           // Unique identifier matching the type union
  icon: React.ElementType;       // Lucide icon component
  title: string;                 // English display name
  titleAr: string;               // Arabic display name
  description: string;           // One-line description
  examples: string[];            // 4 example sub-types (e.g., "Gym", "Yoga Studio")
  color: string;                 // Tailwind color classes for the card
  category: string;              // Category grouping (Commerce, Services, etc.)
}
