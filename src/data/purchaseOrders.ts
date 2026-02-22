export interface POItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: POItem[];
  status: "Draft" | "Sent" | "Received" | "Cancelled";
  createdDate: string;
  expectedDate: string;
  total: number;
  notes: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

let orders: PurchaseOrder[] = [
  { id: "PO-001", supplierId: "s1", supplierName: "TechParts Ltd.", items: [{ productId: "p1", productName: "Wireless Mouse", quantity: 50, unitPrice: 18 }, { productId: "p2", productName: "Mechanical Keyboard", quantity: 20, unitPrice: 55 }], status: "Received", createdDate: "2026-01-15", expectedDate: "2026-01-22", total: 2000, notes: "Monthly restock" },
  { id: "PO-002", supplierId: "s4", supplierName: "Shenzhen Audio Tech", items: [{ productId: "p9", productName: "Headphones", quantity: 30, unitPrice: 85 }], status: "Sent", createdDate: "2026-02-10", expectedDate: "2026-02-24", total: 2550, notes: "Urgent reorder" },
  { id: "PO-003", supplierId: "s3", supplierName: "Office Supplies BD", items: [{ productId: "p5", productName: "Desk Lamp", quantity: 40, unitPrice: 20 }, { productId: "p6", productName: "Notebook Set", quantity: 100, unitPrice: 6 }], status: "Draft", createdDate: "2026-02-18", expectedDate: "2026-02-21", total: 1400, notes: "" },
  { id: "PO-004", supplierId: "s2", supplierName: "Global Electronics Co.", items: [{ productId: "p3", productName: "USB-C Hub", quantity: 25, unitPrice: 30 }], status: "Cancelled", createdDate: "2026-01-05", expectedDate: "2026-01-10", total: 750, notes: "Supplier unable to fulfill" },
];

function notify() { listeners.forEach(fn => fn()); }

export function getPurchaseOrders() { return orders; }
export function addPurchaseOrder(po: PurchaseOrder) { orders = [...orders, po]; notify(); }
export function updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>) {
  orders = orders.map(o => o.id === id ? { ...o, ...updates } : o); notify();
}
export function deletePurchaseOrder(id: string) { orders = orders.filter(o => o.id !== id); notify(); }
export function subscribe(listener: Listener) { listeners.add(listener); return () => { listeners.delete(listener); }; }
