export interface SaudiCity {
  name: string;
  nameAr: string;
  region: string;
  regionAr: string;
}

export const saudiCities: SaudiCity[] = [
  { name: "Riyadh", nameAr: "الرياض", region: "Riyadh", regionAr: "منطقة الرياض" },
  { name: "Jeddah", nameAr: "جدة", region: "Makkah", regionAr: "منطقة مكة المكرمة" },
  { name: "Makkah", nameAr: "مكة المكرمة", region: "Makkah", regionAr: "منطقة مكة المكرمة" },
  { name: "Madinah", nameAr: "المدينة المنورة", region: "Madinah", regionAr: "منطقة المدينة المنورة" },
  { name: "Dammam", nameAr: "الدمام", region: "Eastern", regionAr: "المنطقة الشرقية" },
  { name: "Khobar", nameAr: "الخبر", region: "Eastern", regionAr: "المنطقة الشرقية" },
  { name: "Dhahran", nameAr: "الظهران", region: "Eastern", regionAr: "المنطقة الشرقية" },
  { name: "Tabuk", nameAr: "تبوك", region: "Tabuk", regionAr: "منطقة تبوك" },
  { name: "Abha", nameAr: "أبها", region: "Asir", regionAr: "منطقة عسير" },
  { name: "Khamis Mushait", nameAr: "خميس مشيط", region: "Asir", regionAr: "منطقة عسير" },
  { name: "Buraidah", nameAr: "بريدة", region: "Qassim", regionAr: "منطقة القصيم" },
  { name: "Hail", nameAr: "حائل", region: "Hail", regionAr: "منطقة حائل" },
  { name: "Najran", nameAr: "نجران", region: "Najran", regionAr: "منطقة نجران" },
  { name: "Jazan", nameAr: "جازان", region: "Jazan", regionAr: "منطقة جازان" },
  { name: "Yanbu", nameAr: "ينبع", region: "Madinah", regionAr: "منطقة المدينة المنورة" },
  { name: "Al Ahsa", nameAr: "الأحساء", region: "Eastern", regionAr: "المنطقة الشرقية" },
  { name: "Jubail", nameAr: "الجبيل", region: "Eastern", regionAr: "المنطقة الشرقية" },
  { name: "Taif", nameAr: "الطائف", region: "Makkah", regionAr: "منطقة مكة المكرمة" },
];

export interface CourierProvider {
  id: string;
  name: string;
  nameAr: string;
  logo: string;
  description: string;
  baseRate: number;
  perKg: number;
  estimatedDays: string;
  coverage: string[];
  features: string[];
  active: boolean;
}

export const saudiCouriers: CourierProvider[] = [
  {
    id: "aramex",
    name: "Aramex",
    nameAr: "أرامكس",
    logo: "📦",
    description: "Leading logistics provider in the Middle East",
    baseRate: 20,
    perKg: 3,
    estimatedDays: "1-3 days",
    coverage: ["All Saudi Cities", "GCC", "International"],
    features: ["Cash on Delivery", "Same Day Delivery", "Return Pickup", "SMS Tracking"],
    active: true,
  },
  {
    id: "smsa",
    name: "SMSA Express",
    nameAr: "سمسا إكسبريس",
    logo: "🚚",
    description: "Saudi-based express delivery with nationwide coverage",
    baseRate: 18,
    perKg: 2.5,
    estimatedDays: "1-2 days",
    coverage: ["All Saudi Cities", "GCC"],
    features: ["Cash on Delivery", "Same Day Delivery", "Scheduled Delivery", "Fragile Handling"],
    active: true,
  },
  {
    id: "naqel",
    name: "Naqel Express",
    nameAr: "ناقل إكسبريس",
    logo: "📬",
    description: "Comprehensive last-mile delivery across Saudi Arabia",
    baseRate: 15,
    perKg: 2,
    estimatedDays: "2-4 days",
    coverage: ["All Saudi Cities"],
    features: ["Cash on Delivery", "Bulk Shipping", "Warehouse Solutions"],
    active: true,
  },
  {
    id: "fetchr",
    name: "Fetchr",
    nameAr: "فيتشر",
    logo: "📍",
    description: "GPS-based delivery for hard-to-find addresses",
    baseRate: 22,
    perKg: 3.5,
    estimatedDays: "1-3 days",
    coverage: ["Major Saudi Cities", "GCC"],
    features: ["GPS Delivery", "No Address Needed", "Real-time Tracking"],
    active: false,
  },
  {
    id: "jt-saudi",
    name: "J&T Express Saudi",
    nameAr: "جي آند تي السعودية",
    logo: "✈️",
    description: "Fast-growing express delivery network in Saudi Arabia",
    baseRate: 16,
    perKg: 2.5,
    estimatedDays: "2-3 days",
    coverage: ["All Saudi Cities"],
    features: ["Cash on Delivery", "Return Service", "E-commerce Integration"],
    active: true,
  },
];
