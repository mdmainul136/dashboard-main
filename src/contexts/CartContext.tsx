import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  paymentMethod: string;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (customer: Order["customer"], paymentMethod: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

const sampleOrders: Order[] = [
  {
    id: "ORD-1001", items: [{ product: { id: "p1", name: "Wireless Mouse", sku: "WM-001", price: 29.99, category: "Electronics", image: "🖱️", stock: 45, reorderLevel: 10, barcode: "100001" }, quantity: 2 }],
    total: 64.98, subtotal: 59.98, discount: 0, shipping: 5, status: "Delivered", date: "2026-02-15",
    customer: { name: "আহমেদ হাসান", email: "ahmed@mail.com", phone: "01712345678", address: "123 Gulshan Ave", city: "Dhaka", zip: "1212" }, paymentMethod: "bKash",
  },
  {
    id: "ORD-1002", items: [{ product: { id: "p9", name: "Headphones", sku: "NH-009", price: 149.99, category: "Audio", image: "🎧", stock: 2, reorderLevel: 10, barcode: "100009" }, quantity: 1 }],
    total: 154.99, subtotal: 149.99, discount: 0, shipping: 5, status: "Shipped", date: "2026-02-17",
    customer: { name: "ফাতিমা খান", email: "fatima@mail.com", phone: "01898765432", address: "45 Dhanmondi", city: "Dhaka", zip: "1205" }, paymentMethod: "Card",
  },
  {
    id: "ORD-1003", items: [
      { product: { id: "p5", name: "Desk Lamp", sku: "DL-005", price: 34.99, category: "Office", image: "💡", stock: 56, reorderLevel: 10, barcode: "100005" }, quantity: 1 },
      { product: { id: "p7", name: "Pen Holder", sku: "PH-007", price: 9.99, category: "Office", image: "🖊️", stock: 89, reorderLevel: 10, barcode: "100007" }, quantity: 3 },
    ],
    total: 69.96, subtotal: 64.96, discount: 0, shipping: 5, status: "Processing", date: "2026-02-19",
    customer: { name: "রাহুল সেন", email: "rahul@mail.com", phone: "01611223344", address: "78 Uttara", city: "Dhaka", zip: "1230" }, paymentMethod: "Nagad",
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = useCallback((customer: Order["customer"], paymentMethod: string) => {
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 5;
    const order: Order = {
      id: `ORD-${1004 + orders.length}`,
      items: [...items],
      subtotal,
      discount: 0,
      shipping,
      total: subtotal + shipping,
      status: "Processing",
      date: new Date().toISOString().slice(0, 10),
      customer,
      paymentMethod,
    };
    setOrders(prev => [order, ...prev]);
    setItems([]);
    return order;
  }, [items, orders.length]);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  return (
    <CartContext.Provider value={{ items, orders, addToCart, removeFromCart, updateQuantity, clearCart, placeOrder, updateOrderStatus, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
