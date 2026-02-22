export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  paymentTerms: string;
  lastOrderDate: string;
  totalOrders: number;
  totalSpend: number;
  leadTimeDays: number;
  status: "Active" | "Inactive";
  taxId?: string;
  tradeLicense?: string;
  currency?: string;
  bankAccount?: string;
  website?: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

let suppliers: Supplier[] = [
  { id: "s1", name: "TechParts Ltd.", email: "info@techparts.com", phone: "+966501234567", address: "12 Industrial Area", city: "Riyadh", country: "Saudi Arabia", rating: 4.5, paymentTerms: "Net 30", lastOrderDate: "2026-02-10", totalOrders: 24, totalSpend: 45200, leadTimeDays: 7, status: "Active", taxId: "300012345600003", tradeLicense: "CR-1234567890", currency: "SAR", website: "https://techparts.sa" },
  { id: "s2", name: "Global Electronics Co.", email: "sales@globalelec.com", phone: "+971501234567", address: "88 JAFZA", city: "Dubai", country: "UAE", rating: 4.2, paymentTerms: "Net 15", lastOrderDate: "2026-02-05", totalOrders: 18, totalSpend: 32800, leadTimeDays: 5, status: "Active", taxId: "100234567800003", currency: "AED", website: "https://globalelec.ae" },
  { id: "s3", name: "Office Supplies KSA", email: "order@officesupplies.sa", phone: "+966551234567", address: "45 Olaya District", city: "Riyadh", country: "Saudi Arabia", rating: 3.8, paymentTerms: "Net 45", lastOrderDate: "2026-01-20", totalOrders: 12, totalSpend: 15600, leadTimeDays: 3, status: "Active", taxId: "300098765400003", tradeLicense: "CR-9876543210", currency: "SAR" },
  { id: "s4", name: "Shenzhen Audio Tech", email: "export@szaudio.cn", phone: "+8613800138000", address: "Nanshan District", city: "Shenzhen", country: "China", rating: 4.7, paymentTerms: "Net 60", lastOrderDate: "2026-01-15", totalOrders: 8, totalSpend: 78500, leadTimeDays: 14, status: "Active", taxId: "91440300MA5EXAMPLE", currency: "USD", website: "https://szaudio.cn" },
  { id: "s5", name: "Delhi Accessories Hub", email: "bulk@delhiacc.in", phone: "+919876543210", address: "Nehru Place", city: "New Delhi", country: "India", rating: 3.5, paymentTerms: "Advance", lastOrderDate: "2025-12-28", totalOrders: 5, totalSpend: 8900, leadTimeDays: 10, status: "Inactive", taxId: "29AALCA1234C1Z5", currency: "USD" },
];

function notify() { listeners.forEach(fn => fn()); }

export function getSuppliers() { return suppliers; }
export function addSupplier(s: Supplier) { suppliers = [...suppliers, s]; notify(); }
export function updateSupplier(id: string, updates: Partial<Supplier>) {
  suppliers = suppliers.map(s => s.id === id ? { ...s, ...updates } : s); notify();
}
export function deleteSupplier(id: string) { suppliers = suppliers.filter(s => s.id !== id); notify(); }
export function subscribe(listener: Listener) { listeners.add(listener); return () => { listeners.delete(listener); }; }
