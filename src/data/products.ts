export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  image: string;
  images?: string[]; // gallery URLs
  stock: number;
  reorderLevel: number;
  barcode: string;
}

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export const LOW_STOCK_THRESHOLD = 10;

export function getProductStatus(product: Product): ProductStatus {
  if (product.stock === 0) return "Out of Stock";
  if (product.stock <= product.reorderLevel) return "Low Stock";
  return "In Stock";
}

const initialProducts: Product[] = [
  { id: "p1", name: "Wireless Mouse", sku: "WM-001", price: 29.99, category: "Electronics", image: "🖱️", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300"], stock: 45, reorderLevel: 10, barcode: "100001" },
  { id: "p2", name: "Mechanical Keyboard", sku: "MK-002", price: 89.99, category: "Electronics", image: "⌨️", images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300"], stock: 8, reorderLevel: 10, barcode: "100002" },
  { id: "p3", name: "USB-C Hub", sku: "UH-003", price: 49.99, category: "Electronics", image: "🔌", images: [], stock: 5, reorderLevel: 10, barcode: "100003" },
  { id: "p4", name: "Webcam HD", sku: "WC-004", price: 59.99, category: "Electronics", image: "📷", images: ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=300"], stock: 24, reorderLevel: 10, barcode: "100004" },
  { id: "p5", name: "Desk Lamp", sku: "DL-005", price: 34.99, category: "Office", image: "💡", images: ["https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=300"], stock: 56, reorderLevel: 10, barcode: "100005" },
  { id: "p6", name: "Notebook Set", sku: "NS-006", price: 12.99, category: "Office", image: "📓", images: [], stock: 3, reorderLevel: 10, barcode: "100006" },
  { id: "p7", name: "Pen Holder", sku: "PH-007", price: 9.99, category: "Office", image: "🖊️", images: [], stock: 89, reorderLevel: 10, barcode: "100007" },
  { id: "p8", name: "Monitor Stand", sku: "MS-008", price: 44.99, category: "Office", image: "🖥️", images: ["https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=300"], stock: 15, reorderLevel: 10, barcode: "100008" },
  { id: "p9", name: "Headphones", sku: "NH-009", price: 149.99, category: "Audio", image: "🎧", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300"], stock: 2, reorderLevel: 10, barcode: "100009" },
  { id: "p10", name: "Bluetooth Speaker", sku: "BS-010", price: 39.99, category: "Audio", image: "🔊", images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300"], stock: 37, reorderLevel: 10, barcode: "100010" },
  { id: "p11", name: "Phone Case", sku: "PC-011", price: 19.99, category: "Accessories", image: "📱", images: [], stock: 200, reorderLevel: 20, barcode: "100011" },
  { id: "p12", name: "Charging Cable", sku: "FC-012", price: 14.99, category: "Accessories", image: "🔋", images: [], stock: 7, reorderLevel: 10, barcode: "100012" },
  { id: "p13", name: "Laptop Sleeve 15\"", sku: "LS-013", price: 24.99, category: "Accessories", image: "💼", images: [], stock: 0, reorderLevel: 20, barcode: "100013" },
  { id: "p14", name: "Wireless Charger", sku: "WC-014", price: 34.99, category: "Electronics", image: "⚡", images: [], stock: 18, reorderLevel: 25, barcode: "100014" },
  { id: "p15", name: "Desk Organizer", sku: "DO-015", price: 22.99, category: "Office", image: "🗄️", images: [], stock: 72, reorderLevel: 15, barcode: "100015" },
];

// Simple in-memory store with subscriber pattern for cross-page sync
type Listener = () => void;
const listeners = new Set<Listener>();
let products = [...initialProducts];

export function getProducts(): Product[] {
  return products;
}

export function updateProductStock(productId: string, newStock: number) {
  products = products.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p);
  listeners.forEach(fn => fn());
}

export function updateProduct(productId: string, updates: Partial<Pick<Product, 'stock' | 'price' | 'reorderLevel'>>) {
  products = products.map(p => p.id === productId ? {
    ...p,
    ...(updates.stock !== undefined && { stock: Math.max(0, updates.stock) }),
    ...(updates.price !== undefined && { price: Math.max(0, updates.price) }),
    ...(updates.reorderLevel !== undefined && { reorderLevel: Math.max(0, updates.reorderLevel) }),
  } : p);
  listeners.forEach(fn => fn());
}

export function decrementStock(productId: string, qty: number) {
  products = products.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty) } : p);
  listeners.forEach(fn => fn());
}

export function addProduct(product: Product) {
  products = [...products, product];
  listeners.forEach(fn => fn());
}

export function deleteProduct(productId: string) {
  products = products.filter(p => p.id !== productId);
  listeners.forEach(fn => fn());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
