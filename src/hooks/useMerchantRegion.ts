/**
 * ============================================================================
 * useMerchantRegion — Global Merchant State Management
 * ============================================================================
 *
 * PURPOSE:
 *   This is the CORE state hook for the entire SaaS platform. It manages:
 *   1. Which business vertical (purpose) the merchant selected
 *   2. Which country/region the merchant operates in
 *   3. Which add-on modules the merchant has purchased
 *
 * HOW IT WORKS:
 *   Uses React 18's `useSyncExternalStore` for a lightweight global store
 *   (no Redux/Zustand needed). State is persisted in localStorage.
 *
 * WHAT IT AFFECTS:
 *   - Sidebar navigation sections (Sidebar.tsx)
 *   - Dashboard KPIs and widgets (Index.tsx, MerchantWelcome, MerchantChecklist)
 *   - Onboarding flow steps (Onboarding.tsx)
 *   - Module availability and pricing (addon lock/unlock system)
 *   - Storefront theme options (ThemeGallery.tsx)
 *
 * BACKEND INTEGRATION:
 *   When adding a backend, replace localStorage reads/writes with API calls:
 *   - setMerchantCountry() → PUT /api/merchant { country }
 *   - setBusinessPurpose() → PUT /api/merchant { businessPurpose }
 *   - purchaseAddon()      → POST /api/merchant/addons { moduleId }
 *   - removeAddon()        → DELETE /api/merchant/addons/:moduleId
 *   - Initial load         → GET /api/merchant (returns full merchant state)
 *
 * ============================================================================
 */
import { useSyncExternalStore, useCallback } from "react";
import { COUNTRY_CODES, getRegionByCountry, type RegionConfig, type ModuleStatus } from "@/data/regionModules";
import { getMyModules } from "@/lib/moduleApi";

/**
 * All 15 supported business verticals.
 * Adding a new vertical requires updates in:
 * - This file (type)
 * - business-purpose/types.ts (duplicate type)
 * - business-purpose/data.ts (purpose option + category)
 * - businessPurposeModules.ts (module config)
 * - purposeThemes.ts (theme collection)
 * - Onboarding.tsx (onboarding steps)
 * - MerchantChecklist.tsx (checklist items)
 * - MerchantWelcome.tsx (welcome banner)
 * - useDashboardData.ts (KPI metrics)
 * - Sidebar.tsx (navigation section)
 * See docs/ARCHITECTURE.md for full guide.
 */
export type BusinessPurpose = "ecommerce" | "business-website" | "real-estate" | "restaurant" | "lms" | "healthcare" | "fitness" | "salon" | "freelancer" | "travel" | "automotive" | "event" | "saas" | "landlord" | "education" | "cross-border-ior";

/**
 * Global merchant state shape.
 * In a backend-integrated version, this would come from a /api/merchant endpoint.
 */
interface MerchantRegionState {
  /** Selected country (e.g., "Saudi Arabia") — determines region */
  country: string;
  /** Resolved region config (MENA/Europe/South Asia/Global) — derived from country */
  region: RegionConfig | null;
  /** Set of purchased add-on module IDs (e.g., "pos", "erp") */
  purchasedAddons: Set<string>;
  /** Selected business vertical — drives entire UI adaptation */
  businessPurpose: BusinessPurpose | null;
  /** Whether the merchant has completed the onboarding flow */
  isOnboarded: boolean;
  /** ISO 3166-1 alpha-2 country code */
  code: string;
}

function loadPersistedAddons(): Set<string> {
  try {
    const raw = localStorage.getItem("purchasedAddons");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function persistAddons(addons: Set<string>) {
  localStorage.setItem("purchasedAddons", JSON.stringify([...addons]));
}

function loadPersistedCountry(): { country: string; region: RegionConfig | null; code: string } {
  try {
    const country = localStorage.getItem("merchantCountry") || "";
    return {
      country,
      region: country ? (getRegionByCountry(country) || null) : null,
      code: country ? (COUNTRY_CODES[country] || "??") : ""
    };
  } catch { return { country: "", region: null, code: "" }; }
}

function loadPersistedPurpose(): BusinessPurpose | null {
  try {
    const raw = localStorage.getItem("businessPurpose");
    return raw as BusinessPurpose | null;
  } catch { return null; }
}

function loadPersistedOnboarding(): boolean {
  try {
    return localStorage.getItem("isOnboarded") === "true";
  } catch { return false; }
}

const initial = loadPersistedCountry();
let state: MerchantRegionState = {
  ...initial,
  purchasedAddons: loadPersistedAddons(),
  businessPurpose: loadPersistedPurpose(),
  isOnboarded: loadPersistedOnboarding()
};
const listeners = new Set<() => void>();
function notify() { listeners.forEach(fn => fn()); }

/**
 * Set merchant's country and auto-resolve their region.
 * Called during onboarding (BusinessInfo step) or from sidebar region picker.
 * Backend: PUT /api/merchant { country }
 */
export function setMerchantCountry(country: string) {
  const region = getRegionByCountry(country) || null;
  const code = COUNTRY_CODES[country] || "??";
  state = { ...state, country, region, code };
  localStorage.setItem("merchantCountry", country);
  notify();
}

/**
 * Set the business vertical/purpose for this merchant.
 * This is the MOST IMPORTANT state change — it affects:
 * - Sidebar sections shown/hidden
 * - Dashboard KPIs and widgets
 * - Onboarding steps
 * - Storefront themes available
 * Backend: PUT /api/merchant { businessPurpose }
 */
export function setBusinessPurpose(purpose: BusinessPurpose) {
  state = { ...state, businessPurpose: purpose };
  localStorage.setItem("businessPurpose", purpose);
  notify();
}

/**
 * Mark onboarding as completed and lock relevant fields.
 */
export function completeOnboarding() {
  state = { ...state, isOnboarded: true };
  localStorage.setItem("isOnboarded", "true");
  notify();
}

/**
 * Record that merchant purchased an add-on module.
 * Purchased addons are treated as "core" (unlocked) in the sidebar.
 * Backend: POST /api/merchant/addons { moduleId, price }
 */
export function purchaseAddon(moduleId: string) {
  const newSet = new Set(state.purchasedAddons);
  newSet.add(moduleId);
  state = { ...state, purchasedAddons: newSet };
  persistAddons(newSet);
  notify();
}

/**
 * Remove a purchased add-on (e.g., cancel subscription).
 * Backend: DELETE /api/merchant/addons/:moduleId
 */
export function removeAddon(moduleId: string) {
  const newSet = new Set(state.purchasedAddons);
  newSet.delete(moduleId);
  state = { ...state, purchasedAddons: newSet };
  persistAddons(newSet);
  notify();
}

/**
 * Refresh purchased addons from backend
 */
export async function refreshModules() {
  try {
    const modules = await getMyModules();
    const activeKeys = new Set(modules.filter(m => m.is_active).map(m => m.module_key));
    state = { ...state, purchasedAddons: activeKeys };
    persistAddons(activeKeys);
    notify();
  } catch (error) {
    console.error("Failed to sync modules with backend", error);
  }
}

export function getMerchantRegion() { return state; }

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function getSnapshot() { return state; }

/**
 * Main hook consumed by all components that need merchant context.
 *
 * Usage:
 *   const { businessPurpose, region, isModuleAvailable } = useMerchantRegion();
 *
 * Key methods:
 *   - isModuleAvailable(id) → Should this module's route be shown in sidebar?
 *   - getModuleStatus(id)   → "core" (free), "addon" (locked), "na" (hidden)
 *   - isAddonPurchased(id)  → Has merchant purchased this addon?
 *
 * Backend integration:
 *   Replace useSyncExternalStore with React Query:
 *   const { data } = useQuery(['merchant'], () => fetch('/api/merchant'));
 */
export function useMerchantRegion() {
  const { country, region, purchasedAddons, businessPurpose, isOnboarded, code } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  /** Check if module should be visible (not "na" and not undefined in region) */
  const isModuleAvailable = useCallback((moduleId: string): boolean => {
    if (!region) return true; // No region = show everything (global default)
    if (purchasedAddons.has(moduleId)) return true; // Purchased = always available
    const status = region.modules[moduleId];
    return status !== "na" && status !== undefined;
  }, [region, purchasedAddons]);

  /** Get module status for sidebar display (core=free, addon=locked🔒, na=hidden) */
  const getModuleStatus = useCallback((moduleId: string): ModuleStatus | "unknown" => {
    if (!region) return "unknown";
    if (purchasedAddons.has(moduleId)) return "core"; // Purchased addons treated as core
    return region.modules[moduleId] || "unknown";
  }, [region, purchasedAddons]);

  /** Check if a specific addon has been purchased */
  const isAddonPurchased = useCallback((moduleId: string): boolean => {
    return purchasedAddons.has(moduleId);
  }, [purchasedAddons]);

  return {
    country,
    region,
    businessPurpose,
    isOnboarded,
    code,
    isModuleAvailable,
    getModuleStatus,
    isAddonPurchased,
    setCountry: setMerchantCountry,
    purchaseAddon,
    removeAddon,
    setBusinessPurpose,
    completeOnboarding,
    refreshModules
  };
}
