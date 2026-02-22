import { saudiCities, saudiCouriers, type CourierProvider } from "./saudiCities";

export interface DeliveryCity {
    name: string;
    nameLocal?: string;
    region: string;
}

export interface RegionalDeliveryData {
    cities: DeliveryCity[];
    couriers: CourierProvider[];
    currency: string;
}

export const bangladeshCities: DeliveryCity[] = [
    { name: "Dhaka", nameLocal: "ঢাকা", region: "Dhaka" },
    { name: "Chittagong", nameLocal: "চট্টগ্রাম", region: "Chittagong" },
    { name: "Sylhet", nameLocal: "সিলেট", region: "Sylhet" },
    { name: "Rajshahi", nameLocal: "রাজশাহী", region: "Rajshahi" },
    { name: "Khulna", nameLocal: "খুলنا", region: "Khulna" },
    { name: "Barisal", nameLocal: "বরিশাল", region: "Barisal" },
    { name: "Rangpur", nameLocal: "রংপুর", region: "Rangpur" },
    { name: "Mymensingh", nameLocal: "ময়মনসিংহ", region: "Mymensingh" },
];

export const bangladeshCouriers: CourierProvider[] = [
    {
        id: "pathao",
        name: "Pathao",
        nameAr: "pathao",
        logo: "🛵",
        description: "Leading delivery and logistics platform in Bangladesh",
        baseRate: 60,
        perKg: 15,
        estimatedDays: "1-2 days",
        coverage: ["Dhaka", "Chittagong", "Sylhet"],
        features: ["Cash on Delivery", "Next Day Delivery", "Live Tracking"],
        active: true,
    },
    {
        id: "redx",
        name: "RedX",
        nameAr: "redx",
        logo: "🚚",
        description: "Nationwide logistics and delivery network",
        baseRate: 50,
        perKg: 10,
        estimatedDays: "2-3 days",
        coverage: ["All Cities"],
        features: ["Cash on Delivery", "Bulk Shipping", "Warehouse Solutions"],
        active: true,
    },
    {
        id: "steadfast",
        name: "Steadfast Courier",
        nameAr: "steadfast",
        logo: "📬",
        description: "Reliable e-commerce delivery across Bangladesh",
        baseRate: 55,
        perKg: 12,
        estimatedDays: "1-3 days",
        coverage: ["All Cities"],
        features: ["Same Day Delivery", "Store Pickup", "SMS Alerts"],
        active: true,
    },
];

export const uaeCities: DeliveryCity[] = [
    { name: "Dubai", nameLocal: "دبي", region: "Dubai" },
    { name: "Abu Dhabi", nameLocal: "أبو ظبي", region: "Abu Dhabi" },
    { name: "Sharjah", nameLocal: "الشارقة", region: "Sharjah" },
    { name: "Ajman", nameLocal: "عجمان", region: "Ajman" },
];

export const uaeCouriers: CourierProvider[] = [
    {
        id: "aramex-uae",
        name: "Aramex UAE",
        nameAr: "أرامكس الإمارات",
        logo: "📦",
        description: "Leading express and logistics services in the UAE",
        baseRate: 25,
        perKg: 5,
        estimatedDays: "1-2 days",
        coverage: ["All UAE Cities"],
        features: ["Cash on Delivery", "Same Day Delivery", "Door-to-Door"],
        active: true,
    },
    {
        id: "careem-quikee",
        name: "Careem Quikee",
        nameAr: "كريم كويكي",
        logo: "🚲",
        description: "Ultra-fast delivery for smaller items across Dubai and Abu Dhabi",
        baseRate: 15,
        perKg: 2,
        estimatedDays: "Less than 60 mins",
        coverage: ["Dubai", "Abu Dhabi"],
        features: ["Hyper-local", "Live tracking", "Contactless"],
        active: true,
    }
];

export const indiaCities: DeliveryCity[] = [
    { name: "Mumbai", nameLocal: "मुंबई", region: "Maharashtra" },
    { name: "Delhi", nameLocal: "दिल्ली", region: "Delhi NCR" },
    { name: "Bangalore", nameLocal: "ಬೆಂಗಳೂರು", region: "Karnataka" },
    { name: "Chennai", nameLocal: "சென்னை", region: "Tamil Nadu" },
];

export const indiaCouriers: CourierProvider[] = [
    {
        id: "delhivery",
        name: "Delhivery",
        nameAr: "delhivery",
        logo: "🚚",
        description: "India's largest fully integrated logistics provider",
        baseRate: 40,
        perKg: 8,
        estimatedDays: "2-5 days",
        coverage: ["18,000+ Pin Codes"],
        features: ["Nationwide Reach", "Partial Returns", "Real-time Tracking"],
        active: true,
    },
    {
        id: "bluedart",
        name: "Blue Dart",
        nameAr: "bluedart",
        logo: "✈️",
        description: "Premier express air and integrated transportation company",
        baseRate: 80,
        perKg: 15,
        estimatedDays: "1-2 days",
        coverage: ["Metros", "Major Cities"],
        features: ["Punctual Delivery", "Heavy Shipping", "Security"],
        active: true,
    }
];

export const pakistanCities: DeliveryCity[] = [
    { name: "Karachi", nameLocal: "کراچی", region: "Sindh" },
    { name: "Lahore", nameLocal: "لاہور", region: "Punjab" },
    { name: "Islamabad", nameLocal: "اسلام آباد", region: "Capital" },
    { name: "Faisalabad", nameLocal: "فیصل آباد", region: "Punjab" },
];

export const pakistanCouriers: CourierProvider[] = [
    {
        id: "tcs",
        name: "TCS",
        nameAr: "tcs",
        logo: "🏇",
        description: "The most trusted logistics brand in Pakistan",
        baseRate: 150,
        perKg: 30,
        estimatedDays: "1-3 days",
        coverage: ["Nationwide"],
        features: ["TCS Hazir", "Cash on Delivery", "International"],
        active: true,
    },
    {
        id: "leopards",
        name: "Leopards Courier",
        nameAr: "leopards",
        logo: "🐆",
        description: "Comprehensive courier and logistics service provider",
        baseRate: 140,
        perKg: 25,
        estimatedDays: "2-4 days",
        coverage: ["Nationwide"],
        features: ["Overnight Express", "Leopards COD", "E-commerce Solutions"],
        active: true,
    }
];

export const regionalDeliveryMap: Record<string, RegionalDeliveryData> = {
    "Saudi Arabia": {
        cities: saudiCities.map(c => ({ name: c.name, nameLocal: c.nameAr, region: c.region })),
        couriers: saudiCouriers,
        currency: "SAR"
    },
    "Bangladesh": {
        cities: bangladeshCities,
        couriers: bangladeshCouriers,
        currency: "BDT"
    },
    "UAE": {
        cities: uaeCities,
        couriers: uaeCouriers,
        currency: "AED"
    },
    "India": {
        cities: indiaCities,
        couriers: indiaCouriers,
        currency: "INR"
    },
    "Pakistan": {
        cities: pakistanCities,
        couriers: pakistanCouriers,
        currency: "PKR"
    }
};

export const defaultDeliveryData: RegionalDeliveryData = {
    cities: [{ name: "International City", region: "Global" }],
    couriers: [
        {
            id: "dhl",
            name: "DHL Express",
            nameAr: "DHL",
            logo: "✈️",
            description: "Global leader in international shipping",
            baseRate: 50,
            perKg: 10,
            estimatedDays: "3-5 days",
            coverage: ["Global"],
            features: ["Worldwide Shipping", "Priority Handling"],
            active: true
        }
    ],
    currency: "USD"
};

export function getDeliveryData(country: string): RegionalDeliveryData {
    return regionalDeliveryMap[country] || defaultDeliveryData;
}
