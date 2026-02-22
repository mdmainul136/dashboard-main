export interface LoyaltyCustomer {
  id: string;
  name: string;
  phone: string;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  totalSpent: number;
  joinDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  status: "Active" | "Expired" | "Disabled";
}

const initialCustomers: LoyaltyCustomer[] = [
  { id: "lc1", name: "আহমেদ হাসান", phone: "+880-1711-111111", points: 2450, tier: "Gold", totalSpent: 124500, joinDate: "2023-01-15" },
  { id: "lc2", name: "ফারহানা ইসলাম", phone: "+880-1722-222222", points: 850, tier: "Silver", totalSpent: 45200, joinDate: "2023-06-20" },
  { id: "lc3", name: "রাকিব উদ্দিন", phone: "+880-1733-333333", points: 3200, tier: "Platinum", totalSpent: 189000, joinDate: "2022-11-10" },
  { id: "lc4", name: "তাসনিম আক্তার", phone: "+880-1744-444444", points: 120, tier: "Bronze", totalSpent: 8500, joinDate: "2024-08-01" },
  { id: "lc5", name: "শাকিল আহমেদ", phone: "+880-1755-555555", points: 1600, tier: "Gold", totalSpent: 98700, joinDate: "2023-04-05" },
];

const initialCoupons: Coupon[] = [
  { id: "c1", code: "WELCOME10", type: "percentage", value: 10, minOrder: 500, maxUses: 100, usedCount: 42, expiresAt: "2026-06-30", status: "Active" },
  { id: "c2", code: "SAVE500", type: "fixed", value: 500, minOrder: 3000, maxUses: 50, usedCount: 50, expiresAt: "2026-03-15", status: "Expired" },
  { id: "c3", code: "VIP20", type: "percentage", value: 20, minOrder: 2000, maxUses: 30, usedCount: 12, expiresAt: "2026-12-31", status: "Active" },
  { id: "c4", code: "FLASH100", type: "fixed", value: 100, minOrder: 1000, maxUses: 200, usedCount: 87, expiresAt: "2026-04-01", status: "Active" },
  { id: "c5", code: "SUMMER15", type: "percentage", value: 15, minOrder: 1500, maxUses: 75, usedCount: 75, expiresAt: "2025-09-30", status: "Disabled" },
];

type Listener = () => void;
const custListeners = new Set<Listener>();
let customers = [...initialCustomers];
const coupListeners = new Set<Listener>();
let coupons = [...initialCoupons];

export function getLoyaltyCustomers() { return customers; }
export function getCoupons() { return coupons; }

export function addCoupon(coupon: Coupon) {
  coupons = [...coupons, coupon];
  coupListeners.forEach(fn => fn());
}

export function updateCoupon(id: string, updates: Partial<Coupon>) {
  coupons = coupons.map(c => c.id === id ? { ...c, ...updates } : c);
  coupListeners.forEach(fn => fn());
}

export function deleteCoupon(id: string) {
  coupons = coupons.filter(c => c.id !== id);
  coupListeners.forEach(fn => fn());
}

export function subscribeCoupons(listener: Listener) {
  coupListeners.add(listener);
  return () => { coupListeners.delete(listener); };
}

export function subscribeCustomers(listener: Listener) {
  custListeners.add(listener);
  return () => { custListeners.delete(listener); };
}
