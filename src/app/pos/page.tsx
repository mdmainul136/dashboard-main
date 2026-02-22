"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useProducts } from "@/hooks/useProducts";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { type Product, LOW_STOCK_THRESHOLD, decrementStock } from "@/data/products";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search, Plus, Minus, ShoppingCart, Trash2, CreditCard, Banknote, X,
  CalendarIcon, Receipt, Clock, CheckCircle, Printer, Download, Eye,
  Filter, Package, ScanLine, Tag, Percent, Smartphone, User, Phone,
  RotateCcw, FileText, AlertTriangle, BarChart3, TrendingUp, DollarSign, Users,
  UtensilsCrossed, ChefHat, Bike, MapPin, Crown, Loader2, Split, Wallet, Wifi, WifiOff, Lock
} from "lucide-react";
import { Label } from "@/components/ui/label";
import BarcodeScanner from "@/components/pos/BarcodeScanner";
import PosPinPad from "@/components/pos/PosPinPad";
import PosReceipt from "@/components/pos/PosReceipt";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { usePosSync } from "@/hooks/usePosSync";
import { useLiveQuery } from "dexie-react-hooks";
import api from "@/lib/api";

interface CartItem extends Product {
  qty: number;
}

interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  label: string;
}

interface PosOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  membershipDiscount?: number;
  couponCode?: string;
  membershipTier?: string;
  tax: number;
  total: number;
  paymentMethod: "card" | "cash" | "bkash" | "nagad" | "split";
  splitDetails?: { card: number; cash: number };
  date: Date;
  status: "completed" | "refunded";
  customerName?: string;
  customerPhone?: string;
  cashReceived?: number;
  changeGiven?: number;
}

interface MembershipCustomer {
  phone: string;
  name: string;
  tier: "gold" | "silver" | "bronze";
  points: number;
  totalSpent: number;
  visits: number;
}

const membershipCustomers: MembershipCustomer[] = [
  { phone: "0171234567", name: "Abdullah Saleh", tier: "gold", points: 2450, totalSpent: 12500, visits: 45 },
  { phone: "0181234567", name: "Sara Ahmed", tier: "silver", points: 1200, totalSpent: 6800, visits: 22 },
  { phone: "0191234567", name: "Omar Khalid", tier: "bronze", points: 580, totalSpent: 3200, visits: 12 },
  { phone: "0161234567", name: "Nora Al-Faisal", tier: "gold", points: 3100, totalSpent: 15200, visits: 52 },
  { phone: "0151234567", name: "Huda Mohammad", tier: "silver", points: 890, totalSpent: 5100, visits: 18 },
];

const membershipDiscountRates: Record<string, number> = {
  gold: 15,
  silver: 10,
  bronze: 5,
};

const tierColors: Record<string, string> = {
  gold: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  silver: "bg-gray-400/15 text-gray-500 border-gray-400/30",
  bronze: "bg-orange-600/15 text-orange-600 border-orange-600/30",
};

const categories = ["All", "Electronics", "Office", "Audio", "Accessories"];
const restaurantCategories = ["All", "Appetizers", "Main Course", "Grills", "Beverages", "Desserts"];

const restaurantProducts: Product[] = [
  { id: "r1", name: "Grilled Chicken", sku: "GC-001", price: 42, category: "Grills", image: "ðŸ—", stock: 99, reorderLevel: 5, barcode: "200001" },
  { id: "r2", name: "Lamb Kabsa", sku: "LK-002", price: 55, category: "Main Course", image: "ðŸ›", stock: 99, reorderLevel: 5, barcode: "200002" },
  { id: "r3", name: "Shawarma Wrap", sku: "SW-003", price: 18, category: "Main Course", image: "ðŸŒ¯", stock: 99, reorderLevel: 5, barcode: "200003" },
  { id: "r4", name: "Hummus", sku: "HM-004", price: 12, category: "Appetizers", image: "ðŸ«•", stock: 99, reorderLevel: 5, barcode: "200004" },
  { id: "r5", name: "Caesar Salad", sku: "CS-005", price: 22, category: "Appetizers", image: "ðŸ¥—", stock: 99, reorderLevel: 5, barcode: "200005" },
  { id: "r6", name: "Mixed Grill", sku: "MG-006", price: 75, category: "Grills", image: "ðŸ¥©", stock: 99, reorderLevel: 5, barcode: "200006" },
  { id: "r7", name: "Burger Meal", sku: "BM-007", price: 35, category: "Main Course", image: "ðŸ”", stock: 99, reorderLevel: 5, barcode: "200007" },
  { id: "r8", name: "Fish & Chips", sku: "FC-008", price: 45, category: "Main Course", image: "ðŸŸ", stock: 99, reorderLevel: 5, barcode: "200008" },
  { id: "r9", name: "Arabic Coffee", sku: "AC-009", price: 8, category: "Beverages", image: "â˜•", stock: 99, reorderLevel: 5, barcode: "200009" },
  { id: "r10", name: "Fresh Juice", sku: "FJ-010", price: 14, category: "Beverages", image: "ðŸ§ƒ", stock: 99, reorderLevel: 5, barcode: "200010" },
  { id: "r11", name: "Kunafa", sku: "KN-011", price: 25, category: "Desserts", image: "ðŸ®", stock: 99, reorderLevel: 5, barcode: "200011" },
  { id: "r12", name: "Fries", sku: "FR-012", price: 10, category: "Appetizers", image: "ðŸŸ", stock: 99, reorderLevel: 5, barcode: "200012" },
  { id: "r13", name: "Chicken Biryani", sku: "CB-013", price: 48, category: "Main Course", image: "ðŸš", stock: 99, reorderLevel: 5, barcode: "200013" },
  { id: "r14", name: "Lemonade", sku: "LM-014", price: 10, category: "Beverages", image: "ðŸ‹", stock: 99, reorderLevel: 5, barcode: "200014" },
  { id: "r15", name: "Ice Cream", sku: "IC-015", price: 15, category: "Desserts", image: "ðŸ¨", stock: 99, reorderLevel: 5, barcode: "200015" },
];

const restaurantTables = ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06", "T-07", "T-08", "T-09", "T-10", "T-11", "T-12"];

type OrderType = "dine-in" | "takeaway" | "delivery";

const availableCoupons: Coupon[] = [
  { code: "SAVE10", type: "percent", value: 10, minOrder: 20, label: "10% off orders $20+" },
  { code: "FLAT5", type: "fixed", value: 5, minOrder: 30, label: "$5 off orders $30+" },
  { code: "VIP20", type: "percent", value: 20, minOrder: 100, label: "20% off orders $100+" },
  { code: "WELCOME", type: "fixed", value: 10, minOrder: 50, label: "$10 off orders $50+" },
];

// Mock order history with inline item data across multiple days
const mockOrders: PosOrder[] = [
  {
    id: "POS-1001", date: new Date(2026, 1, 18, 14, 30), paymentMethod: "card", status: "completed",
    items: [
      { id: "p1", name: "Wireless Mouse", sku: "WM-001", price: 29.99, category: "Electronics", image: "ðŸ–±ï¸", stock: 45, reorderLevel: 10, barcode: "100001", qty: 2 },
      { id: "p6", name: "Notebook Set", sku: "NS-006", price: 12.99, category: "Office", image: "ðŸ““", stock: 3, reorderLevel: 10, barcode: "100006", qty: 1 },
    ],
    subtotal: 72.97, discount: 0, tax: 5.84, total: 78.81,
  },
  {
    id: "POS-1002", date: new Date(2026, 1, 18, 10, 15), paymentMethod: "cash", status: "completed",
    items: [
      { id: "p9", name: "Headphones", sku: "NH-009", price: 149.99, category: "Audio", image: "ðŸŽ§", stock: 2, reorderLevel: 10, barcode: "100009", qty: 1 },
    ],
    subtotal: 149.99, discount: 0, tax: 12.0, total: 161.99,
  },
  {
    id: "POS-1003", date: new Date(2026, 1, 17, 16, 45), paymentMethod: "card", status: "refunded",
    items: [
      { id: "p3", name: "USB-C Hub", sku: "UH-003", price: 49.99, category: "Electronics", image: "ðŸ”Œ", stock: 5, reorderLevel: 10, barcode: "100003", qty: 1 },
      { id: "p12", name: "Charging Cable", sku: "FC-012", price: 14.99, category: "Accessories", image: "ðŸ”‹", stock: 7, reorderLevel: 10, barcode: "100012", qty: 3 },
    ],
    subtotal: 94.96, discount: 0, tax: 7.6, total: 102.56,
  },
  {
    id: "POS-1004", date: new Date(2026, 1, 17, 9, 20), paymentMethod: "cash", status: "completed",
    items: [
      { id: "p5", name: "Desk Lamp", sku: "DL-005", price: 34.99, category: "Office", image: "ðŸ’¡", stock: 56, reorderLevel: 10, barcode: "100005", qty: 2 },
      { id: "p7", name: "Pen Holder", sku: "PH-007", price: 9.99, category: "Office", image: "ðŸ–Šï¸", stock: 89, reorderLevel: 10, barcode: "100007", qty: 4 },
    ],
    subtotal: 109.94, discount: 0, tax: 8.8, total: 118.74,
  },
  {
    id: "POS-1005", date: new Date(2026, 1, 16, 13, 0), paymentMethod: "card", status: "completed",
    items: [
      { id: "p2", name: "Mechanical Keyboard", sku: "MK-002", price: 89.99, category: "Electronics", image: "âŒ¨ï¸", stock: 8, reorderLevel: 10, barcode: "100002", qty: 1 },
      { id: "p10", name: "Bluetooth Speaker", sku: "BS-010", price: 39.99, category: "Audio", image: "ðŸ”Š", stock: 37, reorderLevel: 10, barcode: "100010", qty: 1 },
    ],
    subtotal: 129.98, discount: 0, tax: 10.4, total: 140.38,
  },
  {
    id: "POS-1006", date: new Date(2026, 1, 15, 11, 10), paymentMethod: "bkash", status: "completed",
    items: [
      { id: "p1", name: "Wireless Mouse", sku: "WM-001", price: 29.99, category: "Electronics", image: "ðŸ–±ï¸", stock: 45, reorderLevel: 10, barcode: "100001", qty: 3 },
    ],
    subtotal: 89.97, discount: 0, tax: 7.2, total: 97.17,
  },
  {
    id: "POS-1007", date: new Date(2026, 1, 14, 15, 45), paymentMethod: "nagad", status: "completed",
    items: [
      { id: "p4", name: "Monitor Stand", sku: "MS-004", price: 59.99, category: "Office", image: "ðŸ–¥ï¸", stock: 30, reorderLevel: 10, barcode: "100004", qty: 1 },
      { id: "p8", name: "Webcam HD", sku: "WC-008", price: 79.99, category: "Electronics", image: "ðŸ“·", stock: 28, reorderLevel: 10, barcode: "100008", qty: 1 },
    ],
    subtotal: 139.98, discount: 10, tax: 10.4, total: 140.38,
  },
  {
    id: "POS-1008", date: new Date(2026, 1, 13, 9, 0), paymentMethod: "card", status: "completed",
    items: [
      { id: "p11", name: "Mouse Pad XL", sku: "MP-011", price: 19.99, category: "Accessories", image: "ðŸ–±ï¸", stock: 60, reorderLevel: 10, barcode: "100011", qty: 2 },
    ],
    subtotal: 39.98, discount: 0, tax: 3.2, total: 43.18,
  },
  {
    id: "POS-1009", date: new Date(2026, 1, 10, 14, 30), paymentMethod: "cash", status: "completed",
    items: [
      { id: "p9", name: "Headphones", sku: "NH-009", price: 149.99, category: "Audio", image: "ðŸŽ§", stock: 2, reorderLevel: 10, barcode: "100009", qty: 2 },
    ],
    subtotal: 299.98, discount: 20, tax: 22.4, total: 302.38,
  },
  {
    id: "POS-1010", date: new Date(2026, 1, 5, 12, 0), paymentMethod: "bkash", status: "completed",
    items: [
      { id: "p2", name: "Mechanical Keyboard", sku: "MK-002", price: 89.99, category: "Electronics", image: "âŒ¨ï¸", stock: 8, reorderLevel: 10, barcode: "100002", qty: 2 },
      { id: "p5", name: "Desk Lamp", sku: "DL-005", price: 34.99, category: "Office", image: "ðŸ’¡", stock: 56, reorderLevel: 10, barcode: "100005", qty: 1 },
    ],
    subtotal: 214.97, discount: 0, tax: 17.2, total: 232.17,
  },
  {
    id: "POS-1011", date: new Date(2026, 0, 28, 16, 0), paymentMethod: "card", status: "completed",
    items: [
      { id: "p3", name: "USB-C Hub", sku: "UH-003", price: 49.99, category: "Electronics", image: "ðŸ”Œ", stock: 5, reorderLevel: 10, barcode: "100003", qty: 3 },
    ],
    subtotal: 149.97, discount: 0, tax: 12.0, total: 161.97,
  },
  {
    id: "POS-1012", date: new Date(2026, 0, 20, 10, 30), paymentMethod: "cash", status: "completed",
    items: [
      { id: "p10", name: "Bluetooth Speaker", sku: "BS-010", price: 39.99, category: "Audio", image: "ðŸ”Š", stock: 37, reorderLevel: 10, barcode: "100010", qty: 2 },
      { id: "p6", name: "Notebook Set", sku: "NS-006", price: 12.99, category: "Office", image: "ðŸ““", stock: 3, reorderLevel: 10, barcode: "100006", qty: 5 },
    ],
    subtotal: 144.93, discount: 0, tax: 11.6, total: 156.53,
  },
];

const POSPage = () => {
  const { businessPurpose } = useMerchantRegion();
  const isRestaurant = businessPurpose === "restaurant";
  const products = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState<PosOrder[]>(mockOrders);
  const [receiptOrder, setReceiptOrder] = useState<PosOrder | null>(null);
  const [viewOrder, setViewOrder] = useState<PosOrder | null>(null);
  const [activeTab, setActiveTab] = useState("pos");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  // Order history filters
  const [historySearch, setHistorySearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  // Sales report view
  const [reportView, setReportView] = useState<"today" | "weekly" | "monthly">("today");
  const [reportDateFrom, setReportDateFrom] = useState<Date | undefined>(undefined);
  const [reportDateTo, setReportDateTo] = useState<Date | undefined>(undefined);
  // Restaurant-specific state
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  // Membership
  const [membershipPhone, setMembershipPhone] = useState("");
  const [foundMember, setFoundMember] = useState<MembershipCustomer | null>(null);
  // Cash change calculator
  const [cashReceived, setCashReceived] = useState<string>("");
  // Card processing
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardResult, setCardResult] = useState<"approved" | "declined" | null>(null);
  // Split payment
  const [splitMode, setSplitMode] = useState(false);
  const [splitCardAmount, setSplitCardAmount] = useState<string>("");

  // Hold & Recall state
  const [heldOrders, setHeldOrders] = useState<CartItem[][]>([]);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Offline & Staff state
  const { isOnline, pendingCount } = usePosSync();
  const [isLocked, setIsLocked] = useState(true);
  const [activeStaff, setActiveStaff] = useState<{ id: number, name: string } | null>(null);

  // Load products into IndexedDB for offline access
  useEffect(() => {
    const syncLocalProducts = async () => {
      const offlineProducts = activeProducts.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        price: p.price,
        stock: p.stock,
        category: p.category,
        image: p.image,
        updatedAt: Date.now()
      }));
      await db.products.bulkPut(offlineProducts);
    };
    syncLocalProducts();
  }, [activeProducts]);

  const syncedOrders = useLiveQuery(() => db.orders.orderBy('createdAt').reverse().toArray()) || [];

  // Merge synced orders with mock/backend orders for history
  const allOrders = useMemo(() => {
    // In a real app, this would be a merge of API orders and local ones
    const localMapped: PosOrder[] = syncedOrders.map(o => ({
      id: o.tempId,
      items: o.items as CartItem[],
      subtotal: o.subtotal,
      discount: o.discount,
      tax: o.tax,
      total: o.total,
      paymentMethod: o.paymentMethod as any,
      date: new Date(o.createdAt),
      status: o.status === 'synced' ? 'completed' : 'completed', // Local is always considered completed for UI
      customerName: o.customerData?.name,
      customerPhone: o.customerData?.phone,
    }));
    return [...localMapped, ...mockOrders];
  }, [syncedOrders]);

  const activeProducts = isRestaurant ? restaurantProducts : products;
  const activeCategories = isRestaurant ? restaurantCategories : categories;

  const filtered = useMemo(() => {
    return activeProducts.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.barcode.includes(q);
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category, activeProducts]);

  const handleBarcodeScan = useCallback((code: string) => {
    const product = activeProducts.find((p) => p.barcode === code || p.id === code);
    if (product) {
      addToCart(product);
      toast({ title: "Product scanned!", description: `${product.image} ${product.name} added to cart` });
    } else {
      toast({ title: "Product not found", description: `No product with barcode "${code}"`, variant: "destructive" });
    }
  }, [activeProducts]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      result = result.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom); from.setHours(0, 0, 0, 0);
      result = result.filter((o) => o.date >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo); to.setHours(23, 59, 59, 999);
      result = result.filter((o) => o.date <= to);
    }
    return result;
  }, [orders, historySearch, dateFrom, dateTo]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((c) => (c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const membershipDiscountPct = foundMember ? membershipDiscountRates[foundMember.tier] : 0;
  const membershipDiscountAmt = subtotal * (membershipDiscountPct / 100);
  const discount = couponDiscount + membershipDiscountAmt;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;

  const handleLookupMembership = () => {
    const phone = membershipPhone.trim();
    if (!phone) return;
    const member = membershipCustomers.find(m => m.phone === phone);
    if (member) {
      setFoundMember(member);
      setCustomerName(member.name);
      setCustomerPhone(member.phone);
      toast({ title: `Welcome back, ${member.name}! ðŸ‘‘`, description: `${member.tier.toUpperCase()} member â€” ${membershipDiscountRates[member.tier]}% discount applied` });
    } else {
      setFoundMember(null);
      toast({ title: "No membership found", description: `No member with phone "${phone}"`, variant: "destructive" });
    }
  };

  const handleRemoveMembership = () => {
    setFoundMember(null);
    setMembershipPhone("");
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const coupon = availableCoupons.find((c) => c.code === code);
    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order $${coupon.minOrder} required`);
      return;
    }
    setAppliedCoupon(coupon);
    setCouponInput("");
    toast({ title: "Coupon applied!", description: coupon.label });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleCheckout = useCallback(async (method: "card" | "cash" | "bkash" | "nagad" | "split", splitDetails?: { card: number; cash: number }) => {
    const cashReceivedNum = parseFloat(cashReceived) || 0;
    const changeGiven = method === "cash" && cashReceivedNum > total ? cashReceivedNum - total : 0;

    const tempId = `TEMP-${Date.now()}`;
    const newOrder: OfflineOrder = {
      tempId,
      items: [...cart],
      subtotal,
      discount: couponDiscount + (membershipDiscountAmt || 0),
      tax,
      total,
      paymentMethod: method,
      paymentDetails: splitDetails || (method === 'cash' ? { cashReceived: cashReceivedNum, changeGiven } : {}),
      status: 'pending',
      createdAt: Date.now(),
      branchId: 1, // Placeholder
      staffId: activeStaff?.id || 0,
      customerData: {
        name: customerName,
        phone: customerPhone
      }
    };

    // Store in IndexedDB for immediate feedback and offline safety
    await db.orders.add(newOrder);

    // Update local UI state
    setOrders((prev) => [{
      id: tempId,
      items: [...cart],
      subtotal,
      discount: newOrder.discount,
      tax, total,
      paymentMethod: method,
      date: new Date(),
      status: "completed",
    } as any, ...prev]);

    cart.forEach(item => decrementStock(item.id, item.qty));
    setCheckoutOpen(false);
    setCart([]);
    setAppliedCoupon(null);
    setFoundMember(null);
    setCustomerName("");
    setCustomerPhone("");
    setCashReceived("");

    toast({
      title: isOnline ? "Payment Successful!" : "Order Saved (Offline)",
      description: `Order queued for sync. Total: $${total.toFixed(2)}`,
      icon: isOnline ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-amber-500" />
    });
  }, [cart, subtotal, couponDiscount, membershipDiscountAmt, tax, total, customerName, customerPhone, cashReceived, activeStaff, isOnline]);

  const handleCardPayment = useCallback(() => {
    setCardProcessing(true);
    setCardResult(null);
    // Simulate card processing
    setTimeout(() => {
      setCardProcessing(false);
      setCardResult("approved");
      setTimeout(() => {
        handleCheckout("card");
      }, 1000);
    }, 2000);
  }, [handleCheckout]);

  const handleSplitPayment = useCallback(() => {
    const cardAmt = parseFloat(splitCardAmount) || 0;
    if (cardAmt <= 0 || cardAmt >= total) {
      toast({ title: "Invalid split", description: "Card amount must be between $0 and total", variant: "destructive" });
      return;
    }
    const cashAmt = total - cardAmt;
    handleCheckout("split", { card: cardAmt, cash: cashAmt });
  }, [splitCardAmount, total, handleCheckout]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = (order: PosOrder) => {
    const paymentLabel = order.paymentMethod === "card" ? "Card" : order.paymentMethod === "bkash" ? "bKash" : order.paymentMethod === "nagad" ? "Nagad" : "Cash";
    const discountLine = order.discount > 0 ? `Discount${order.couponCode ? ` (${order.couponCode})` : ""}:  -$${order.discount.toFixed(2)}` : "";
    const customerLine = (order.customerName || order.customerPhone)
      ? `Customer: ${[order.customerName, order.customerPhone].filter(Boolean).join(" â€¢ ")}`
      : "";

    const receiptContent = `
<!DOCTYPE html>
<html><head><title>Receipt ${order.id}</title>
<style>
  body { font-family: 'Courier New', monospace; max-width: 320px; margin: 0 auto; padding: 20px; color: #1a1a1a; }
  .center { text-align: center; }
  .bold { font-weight: bold; }
  .line { border-top: 1px dashed #ccc; margin: 10px 0; }
  .row { display: flex; justify-content: space-between; font-size: 13px; margin: 4px 0; }
  .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin: 8px 0; }
  h2 { margin: 0 0 4px; font-size: 18px; }
  .small { font-size: 11px; color: #666; }
  @media print { body { margin: 0; } }
</style></head><body>
<div class="center">
  <h2>TailAdmin Store</h2>
  <p class="small">123 Business Ave, Suite 100<br>Tel: (555) 123-4567</p>
</div>
<div class="line"></div>
<div class="row"><span>Order: <b>${order.id}</b></span><span>${format(order.date, "MMM dd, yyyy HH:mm")}</span></div>
${customerLine ? `<div class="row"><span>${customerLine}</span></div>` : ""}
<div class="line"></div>
${order.items.map(item => `<div class="row"><span>${item.name} Ã—${item.qty}</span><span>$${(item.price * item.qty).toFixed(2)}</span></div>`).join("")}
<div class="line"></div>
<div class="row"><span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
${discountLine ? `<div class="row" style="color: #2563eb;"><span>${discountLine.split(":")[0]}</span><span>${discountLine.split(":")[1]?.trim() || ""}</span></div>` : ""}
<div class="row"><span>Tax (8%)</span><span>$${order.tax.toFixed(2)}</span></div>
<div class="line"></div>
<div class="total-row"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
<div class="line"></div>
<div class="center">
  <p class="small bold">Paid via ${paymentLabel}</p>
  <p class="small">Thank you for your purchase!</p>
</div>
</body></html>`;

    const blob = new Blob([receiptContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank", "width=400,height=600");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    }
    toast({ title: "Receipt ready!", description: `Use print dialog to save as PDF` });
  };

  const handleRefund = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: "refunded" as const } : o)
    );
    if (viewOrder?.id === orderId) {
      setViewOrder((prev) => prev ? { ...prev, status: "refunded" } : null);
    }
    toast({ title: "Order Refunded", description: `Order ${orderId} has been refunded` });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{isRestaurant ? "Restaurant POS" : "Point of Sale"}</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            {isRestaurant ? "Take orders and manage tables" : "Process sales and manage transactions"}
            {isOnline ? (
              <Badge variant="outline" className="text-[10px] h-5 gap-1 text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                <Wifi className="h-3 w-3" /> Online
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] h-5 gap-1 text-amber-500 border-amber-500/20 bg-amber-500/5">
                <WifiOff className="h-3 w-3" /> Offline Mode
              </Badge>
            )}
            {pendingCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 animate-pulse">
                Syncing {pendingCount} orders...
              </Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{activeStaff?.name || "No Staff"}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Counter 01</p>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={() => setIsLocked(true)}>
            <Lock className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <PosPinPad
        isOpen={isLocked}
        onSuccess={(id, name) => {
          setActiveStaff({ id, name });
          setIsLocked(false);
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pos" className="gap-2"><ShoppingCart className="h-4 w-4" /> POS Terminal</TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><Clock className="h-4 w-4" /> Order History</TabsTrigger>
          <TabsTrigger value="reports" className="gap-2"><BarChart3 className="h-4 w-4" /> Sales Report</TabsTrigger>
        </TabsList>

        {/* ===== POS Tab ===== */}
        <TabsContent value="pos">
          {/* Restaurant Controls: Order Type + Table */}
          {isRestaurant && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Order Type:</span>
                <div className="flex gap-1">
                  {([
                    { value: "dine-in" as OrderType, label: "Dine-in", icon: <UtensilsCrossed className="h-3.5 w-3.5" /> },
                    { value: "takeaway" as OrderType, label: "Takeaway", icon: <Package className="h-3.5 w-3.5" /> },
                    { value: "delivery" as OrderType, label: "Delivery", icon: <Bike className="h-3.5 w-3.5" /> },
                  ]).map(t => (
                    <button
                      key={t.value}
                      onClick={() => setOrderType(t.value)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        orderType === t.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                      )}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {orderType === "dine-in" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Table:</span>
                  <div className="flex gap-1 flex-wrap">
                    {restaurantTables.map(table => (
                      <button
                        key={table}
                        onClick={() => setSelectedTable(table)}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                          selectedTable === table ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                        )}
                      >
                        {table}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Low Stock Alert */}
          {(() => {
            const lowStockProducts = products.filter(p => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0);
            const outOfStockProducts = products.filter(p => p.stock === 0);
            if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) return null;
            return (
              <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-destructive">Low Stock Alert</p>
                  <p className="text-muted-foreground mt-1">
                    {lowStockProducts.map(p => (
                      <span key={p.id} className="inline-flex items-center gap-1 mr-3">
                        <span>{p.image}</span>
                        <span className="font-medium text-card-foreground">{p.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-destructive/40 text-destructive">{p.stock} left</Badge>
                      </span>
                    ))}
                    {outOfStockProducts.map(p => (
                      <span key={p.id} className="inline-flex items-center gap-1 mr-3">
                        <span>{p.image}</span>
                        <span className="font-medium text-card-foreground">{p.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-destructive text-destructive font-bold">Out of stock</Badge>
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            );
          })()}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Product Grid */}
            <div className="xl:col-span-2">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID or barcode..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2" onClick={() => setScannerOpen(true)}>
                  <ScanLine className="h-4 w-4" /> Scan Barcode
                </Button>
                <div className="flex gap-1.5 flex-wrap">
                  {activeCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        category === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Package className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((product) => {
                    const inCart = cart.find((c) => c.id === product.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={cn(
                          "group relative rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md active:scale-[0.98]",
                          inCart ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                        )}
                      >
                        {inCart && (
                          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {inCart.qty}
                          </span>
                        )}
                        <div className="mb-2 text-3xl">{product.image}</div>
                        {product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0 && (
                          <span className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                            <AlertTriangle className="h-2.5 w-2.5" /> Low
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="absolute top-2 right-2 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground">
                            Out
                          </span>
                        )}
                        <p className="text-sm font-semibold text-card-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">âŠŸ {product.barcode}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
                          <span className={cn("text-xs", product.stock <= LOW_STOCK_THRESHOLD ? "text-destructive font-semibold" : "text-muted-foreground")}>Stock: {product.stock}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col h-fit sticky top-4">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-card-foreground">{isRestaurant ? "Order" : "Cart"}</h3>
                  {cart.length > 0 && (
                    <Badge className="bg-primary/10 text-primary border-transparent text-xs">{cart.length}</Badge>
                  )}
                  {isRestaurant && selectedTable && orderType === "dine-in" && (
                    <Badge variant="outline" className="text-xs gap-1"><MapPin className="h-3 w-3" />{selectedTable}</Badge>
                  )}
                  {isRestaurant && (
                    <Badge variant="outline" className="text-xs capitalize">{orderType}</Badge>
                  )}
                </div>
                {cart.length > 0 && (
                  <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">Cart is empty</p>
                  <p className="text-xs">Click a product to add it</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto max-h-[400px] divide-y divide-border">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="text-xl">{item.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQty(item.id, -1)} className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-foreground">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="w-16 text-right text-sm font-semibold text-card-foreground">${(item.price * item.qty).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Membership Lookup */}
                  <div className="border-t border-border px-5 py-3">
                    {foundMember ? (
                      <div className="flex items-center justify-between rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Crown className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs font-semibold text-foreground">{foundMember.name}</span>
                          <Badge variant="outline" className={cn("text-[10px]", tierColors[foundMember.tier])}>{foundMember.tier.toUpperCase()}</Badge>
                          <span className="text-[10px] text-emerald-500 font-medium">-{membershipDiscountPct}%</span>
                        </div>
                        <button onClick={handleRemoveMembership} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Member phone..."
                          value={membershipPhone}
                          onChange={(e) => setMembershipPhone(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLookupMembership()}
                          className="h-8 text-xs flex-1"
                        />
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleLookupMembership}>
                          <Crown className="h-3 w-3" /> Lookup
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Coupon Code */}
                  <div className="border-t border-border px-5 py-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold text-primary">{appliedCoupon.code}</span>
                          <span className="text-xs text-muted-foreground">({appliedCoupon.label})</span>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Coupon code..."
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                            className="h-8 text-xs flex-1"
                          />
                          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleApplyCoupon}>
                            <Percent className="h-3 w-3" /> Apply
                          </Button>
                        </div>
                        {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border px-5 py-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    {membershipDiscountAmt > 0 && (
                      <div className="flex justify-between text-sm text-amber-500 font-medium">
                        <span className="flex items-center gap-1"><Crown className="h-3 w-3" /> {foundMember?.tier} (-{membershipDiscountPct}%)</span>
                        <span>-${membershipDiscountAmt.toFixed(2)}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-primary font-medium">
                        <span>Coupon ({appliedCoupon?.code})</span><span>-${couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-base font-bold text-card-foreground pt-2 border-t border-border"><span>Total</span><span>${total.toFixed(2)}</span></div>
                  </div>

                  <div className="border-t border-border px-5 py-4 space-y-2">
                    {isRestaurant && (
                      <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {
                        if (orderType === "dine-in" && !selectedTable) {
                          toast({ title: "Select a table", description: "Please select a table for dine-in orders", variant: "destructive" });
                          return;
                        }
                        handleCheckout("cash");
                        toast({ title: "ðŸ³ Sent to Kitchen!", description: `Order sent${selectedTable ? ` for ${selectedTable}` : ""} (${orderType})` });
                      }}>
                        <ChefHat className="h-4 w-4" /> Send to Kitchen
                      </Button>
                    )}
                    <Button className="w-full gap-2" onClick={() => {
                      if (isRestaurant && orderType === "dine-in" && !selectedTable) {
                        toast({ title: "Select a table", description: "Please select a table for dine-in orders", variant: "destructive" });
                        return;
                      }
                      setCheckoutOpen(true);
                    }}>
                      <CreditCard className="h-4 w-4" /> Pay with Card
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => handleCheckout("cash")}>
                      <Banknote className="h-4 w-4" /> Pay with Cash
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-1.5 text-xs border-pink-500/30 text-pink-600 hover:bg-pink-50 hover:text-pink-700 dark:text-pink-400 dark:hover:bg-pink-950/30" onClick={() => handleCheckout("bkash")}>
                        <Smartphone className="h-3.5 w-3.5" /> bKash
                      </Button>
                      <Button variant="outline" className="flex-1 gap-1.5 text-xs border-orange-500/30 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30" onClick={() => handleCheckout("nagad")}>
                        <Smartphone className="h-3.5 w-3.5" /> Nagad
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ===== Order History Tab ===== */}
        <TabsContent value="history">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-card-foreground">Order History</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search orders..."
                    className="h-8 w-[160px] rounded-md border border-border bg-background pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-8 w-[120px] justify-start text-xs font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-8 w-[120px] justify-start text-xs font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      {dateTo ? format(dateTo, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                {(dateFrom || dateTo) && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date & Time</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Items</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Payment</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">No orders found</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-accent/50 cursor-pointer" onClick={() => setViewOrder(order)}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{order.id}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-card-foreground">{format(order.date, "MMM dd, yyyy HH:mm")}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">{order.items.reduce((s, i) => s + i.qty, 0)} items</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-card-foreground">${order.total.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-6 py-4 hidden md:table-cell">
                          <Badge className={cn("text-xs font-medium border-transparent",
                            order.paymentMethod === "card" ? "bg-primary/10 text-primary" :
                              order.paymentMethod === "bkash" ? "bg-pink-100 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400" :
                                order.paymentMethod === "nagad" ? "bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400" :
                                  "bg-success/10 text-success"
                          )}>
                            {order.paymentMethod === "card" ? "ðŸ’³ Card" : order.paymentMethod === "bkash" ? "ðŸ“± bKash" : order.paymentMethod === "nagad" ? "ðŸ“± Nagad" : "ðŸ’µ Cash"}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Badge className={cn("text-xs font-medium border-transparent", order.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                            {order.status === "completed" ? "Completed" : "Refunded"}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setViewOrder(order); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-primary transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setReceiptOrder(order); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-primary transition-colors">
                              <Receipt className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between border-t border-border px-6 py-3.5">
              <p className="text-sm text-muted-foreground">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} â€” Total: ${filteredOrders.reduce((s, o) => s + (o.status === "completed" ? o.total : 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </TabsContent>
        {/* ===== Sales Report Tab ===== */}
        <TabsContent value="reports">
          {(() => {
            const now = new Date();
            // Determine date range based on view
            let rangeStart: Date;
            let rangeEnd: Date;
            let periodLabel: string;

            if (reportDateFrom && reportDateTo) {
              // Custom date range
              rangeStart = new Date(reportDateFrom);
              rangeStart.setHours(0, 0, 0, 0);
              rangeEnd = new Date(reportDateTo);
              rangeEnd.setHours(23, 59, 59, 999);
              periodLabel = `${format(rangeStart, "MMM dd")} - ${format(rangeEnd, "MMM dd, yyyy")}`;
            } else if (reportView === "weekly") {
              rangeStart = new Date(now);
              rangeStart.setDate(now.getDate() - 6);
              rangeStart.setHours(0, 0, 0, 0);
              rangeEnd = new Date(now);
              rangeEnd.setHours(23, 59, 59, 999);
              periodLabel = `${format(rangeStart, "MMM dd")} - ${format(rangeEnd, "MMM dd, yyyy")}`;
            } else if (reportView === "monthly") {
              rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
              rangeEnd = new Date(now);
              rangeEnd.setHours(23, 59, 59, 999);
              periodLabel = format(rangeStart, "MMMM yyyy");
            } else {
              rangeStart = new Date(now);
              rangeStart.setHours(0, 0, 0, 0);
              rangeEnd = new Date(now);
              rangeEnd.setHours(23, 59, 59, 999);
              periodLabel = format(now, "MMMM dd, yyyy");
            }

            const periodOrders = orders.filter(o => {
              const d = new Date(o.date);
              return d >= rangeStart && d <= rangeEnd;
            });
            const completedPeriod = periodOrders.filter(o => o.status === "completed");
            const refundedPeriod = periodOrders.filter(o => o.status === "refunded");
            const periodSales = completedPeriod.reduce((s, o) => s + o.total, 0);
            const periodRefunds = refundedPeriod.reduce((s, o) => s + o.total, 0);
            const periodNet = periodSales - periodRefunds;
            const periodItems = completedPeriod.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);
            const periodDiscount = completedPeriod.reduce((s, o) => s + o.discount, 0);
            const avgOrder = completedPeriod.length > 0 ? periodSales / completedPeriod.length : 0;

            // Payment method breakdown
            const paymentBreakdown = completedPeriod.reduce((acc, o) => {
              acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
              return acc;
            }, {} as Record<string, number>);
            const paymentData = Object.entries(paymentBreakdown).map(([method, amount]) => ({
              name: method === "card" ? "Card" : method === "bkash" ? "bKash" : method === "nagad" ? "Nagad" : "Cash",
              value: Number(amount.toFixed(2)),
            }));
            const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

            // Time-based chart data
            let chartData: { label: string; sales: number; orders: number }[] = [];
            let chartLabel = "Sales";

            if (reportView === "today" && !reportDateFrom) {
              // Hourly
              chartData = Array.from({ length: 24 }, (_, h) => {
                const hourOrders = completedPeriod.filter(o => new Date(o.date).getHours() === h);
                return {
                  label: `${h.toString().padStart(2, "0")}:00`,
                  sales: Number(hourOrders.reduce((s, o) => s + o.total, 0).toFixed(2)),
                  orders: hourOrders.length,
                };
              }).filter(d => d.sales > 0 || d.orders > 0);
              chartLabel = "Hourly Sales";
            } else {
              // Daily breakdown
              const dayMap: Record<string, { sales: number; orders: number }> = {};
              completedPeriod.forEach(o => {
                const key = format(new Date(o.date), "MMM dd");
                if (!dayMap[key]) dayMap[key] = { sales: 0, orders: 0 };
                dayMap[key].sales += o.total;
                dayMap[key].orders += 1;
              });
              // Sort by date
              const sortedKeys = Object.keys(dayMap).sort((a, b) => new Date(a + ", 2026").getTime() - new Date(b + ", 2026").getTime());
              chartData = sortedKeys.map(k => ({ label: k, sales: Number(dayMap[k].sales.toFixed(2)), orders: dayMap[k].orders }));
              chartLabel = "Daily Sales";
            }

            // Top products
            const productSales: Record<string, { name: string; image: string; qty: number; revenue: number }> = {};
            completedPeriod.forEach(o => {
              o.items.forEach(item => {
                if (!productSales[item.id]) productSales[item.id] = { name: item.name, image: item.image, qty: 0, revenue: 0 };
                productSales[item.id].qty += item.qty;
                productSales[item.id].revenue += item.price * item.qty;
              });
            });
            const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

            const viewLabels = { today: "Today", weekly: "This Week", monthly: "This Month" };

            return (
              <div className="space-y-6">
                {/* View Toggle & Date Range */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
                    {(["today", "weekly", "monthly"] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => { setReportView(v); setReportDateFrom(undefined); setReportDateTo(undefined); }}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                          reportView === v && !reportDateFrom
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {viewLabels[v]}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("gap-2 text-xs", reportDateFrom && "text-foreground")}>
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {reportDateFrom ? format(reportDateFrom, "MMM dd, yyyy") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar mode="single" selected={reportDateFrom} onSelect={setReportDateFrom} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <span className="text-xs text-muted-foreground">â€”</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("gap-2 text-xs", reportDateTo && "text-foreground")}>
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {reportDateTo ? format(reportDateTo, "MMM dd, yyyy") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar mode="single" selected={reportDateTo} onSelect={setReportDateTo} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    {(reportDateFrom || reportDateTo) && (
                      <Button variant="ghost" size="sm" className="text-xs h-8 px-2" onClick={() => { setReportDateFrom(undefined); setReportDateTo(undefined); }}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Period Label */}
                <p className="text-sm text-muted-foreground">
                  Showing report for: <span className="font-medium text-card-foreground">{periodLabel}</span>
                </p>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><DollarSign className="h-4 w-4 text-primary" /> Total Sales</div>
                    <p className="text-2xl font-bold text-card-foreground">${periodSales.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{completedPeriod.length} orders</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><TrendingUp className="h-4 w-4 text-primary" /> Net Revenue</div>
                    <p className="text-2xl font-bold text-card-foreground">${periodNet.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">After {refundedPeriod.length} refund(s)</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Package className="h-4 w-4 text-primary" /> Items Sold</div>
                    <p className="text-2xl font-bold text-card-foreground">{periodItems}</p>
                    <p className="text-xs text-muted-foreground mt-1">Avg ${avgOrder.toFixed(2)}/order</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Tag className="h-4 w-4 text-primary" /> Discounts</div>
                    <p className="text-2xl font-bold text-card-foreground">${periodDiscount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Saved by customers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Sales Chart */}
                  <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> {chartLabel}</h3>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                          <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
                          />
                          <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">No sales data for this period</div>
                    )}
                  </div>

                  {/* Payment Method Pie */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment Methods</h3>
                    {paymentData.length > 0 ? (
                      <div>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie data={paymentData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                              {paymentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-2 space-y-1.5">
                          {paymentData.map((d, i) => (
                            <div key={d.name} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                <span className="text-muted-foreground">{d.name}</span>
                              </div>
                              <span className="font-medium text-card-foreground">${d.value.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">No payment data</div>
                    )}
                  </div>
                </div>

                {/* Top Products */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Top Selling Products</h3>
                  {topProducts.length > 0 ? (
                    <div className="space-y-3">
                      {topProducts.map((p, i) => (
                        <div key={p.name} className="flex items-center gap-3">
                          <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}.</span>
                          <span className="text-xl">{p.image}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                          </div>
                          <span className="text-sm font-bold text-primary">${p.revenue.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No sales in this period</p>
                  )}
                </div>
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { if (!cardProcessing) setCheckoutOpen(false); }}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Confirm Payment</h3>
              {!cardProcessing && <button onClick={() => setCheckoutOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>}
            </div>

            {/* Card Processing Overlay */}
            {cardProcessing && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                  <Loader2 className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-spin" />
                </div>
                <p className="text-lg font-semibold text-card-foreground">Processing Card...</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your payment</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="animate-pulse">â—</span> Connecting to payment gateway...
                </div>
              </div>
            )}

            {/* Card Approved */}
            {cardResult === "approved" && !cardProcessing && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                </div>
                <p className="text-lg font-semibold text-emerald-600">Payment Approved!</p>
                <p className="text-2xl font-bold text-card-foreground">${total.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Transaction complete. Generating receipt...</p>
              </div>
            )}

            {!cardProcessing && !cardResult && (
              <>
                {/* Customer Info */}
                <div className="space-y-3 mb-4 p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Customer Info (Optional)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="h-8 text-xs" />
                    <Input placeholder="Phone number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="h-8 text-xs" />
                  </div>
                  {foundMember && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2">
                      <Crown className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-foreground">{foundMember.name}</span>
                      <Badge variant="outline" className={cn("text-[10px]", tierColors[foundMember.tier])}>{foundMember.tier.toUpperCase()}</Badge>
                      <span className="text-[10px] text-emerald-500 font-medium ml-auto">-{membershipDiscountPct}%</span>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name} Ã— {item.qty}</span>
                      <span className="text-card-foreground font-medium">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    {membershipDiscountAmt > 0 && (
                      <div className="flex justify-between text-sm text-amber-500 font-medium">
                        <span className="flex items-center gap-1"><Crown className="h-3 w-3" /> {foundMember?.tier} (-{membershipDiscountPct}%)</span>
                        <span>-${membershipDiscountAmt.toFixed(2)}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-primary font-medium"><span>Coupon ({appliedCoupon?.code})</span><span>-${couponDiscount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-lg font-bold text-card-foreground pt-2 border-t border-border"><span>Total</span><span>${total.toFixed(2)}</span></div>
                  </div>
                </div>

                {/* Payment Methods */}
                {!splitMode ? (
                  <div className="space-y-3">
                    {/* Card Payment with Processing */}
                    <Button className="w-full gap-2" onClick={handleCardPayment}>
                      <CreditCard className="h-4 w-4" /> Pay with Card â€” ${total.toFixed(2)}
                    </Button>

                    {/* Cash Payment with Change Calculator */}
                    <div className="rounded-lg border border-border p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-card-foreground">Cash Payment</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder={`Amount received (min $${total.toFixed(2)})`}
                          value={cashReceived}
                          onChange={(e) => setCashReceived(e.target.value)}
                          className="h-9 text-sm flex-1"
                        />
                        <Button
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => {
                            const received = parseFloat(cashReceived);
                            if (!received || received < total) {
                              toast({ title: "Insufficient amount", description: `Need at least $${total.toFixed(2)}`, variant: "destructive" });
                              return;
                            }
                            handleCheckout("cash");
                          }}
                        >
                          <Banknote className="h-4 w-4" /> Pay
                        </Button>
                      </div>
                      {parseFloat(cashReceived) > total && (
                        <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                          <span className="text-sm text-emerald-600 font-medium">Change to return:</span>
                          <span className="text-lg font-bold text-emerald-600">${(parseFloat(cashReceived) - total).toFixed(2)}</span>
                        </div>
                      )}
                      {/* Quick cash buttons */}
                      <div className="flex gap-1.5 flex-wrap">
                        {[10, 20, 50, 100, 200, 500].filter(v => v >= Math.ceil(total)).slice(0, 4).map(v => (
                          <button
                            key={v}
                            onClick={() => setCashReceived(v.toString())}
                            className={cn(
                              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
                              cashReceived === v.toString() ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
                            )}
                          >
                            ${v}
                          </button>
                        ))}
                        <button
                          onClick={() => setCashReceived(total.toFixed(2))}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
                        >
                          Exact ${total.toFixed(2)}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Payments */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-1.5 border-pink-500/30 text-pink-600 hover:bg-pink-50 hover:text-pink-700 dark:text-pink-400 dark:hover:bg-pink-950/30" onClick={() => handleCheckout("bkash")}>
                        <Smartphone className="h-4 w-4" /> bKash
                      </Button>
                      <Button variant="outline" className="flex-1 gap-1.5 border-orange-500/30 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30" onClick={() => handleCheckout("nagad")}>
                        <Smartphone className="h-4 w-4" /> Nagad
                      </Button>
                    </div>

                    {/* Split Payment Toggle */}
                    <Button variant="outline" className="w-full gap-2 text-sm" onClick={() => setSplitMode(true)}>
                      <Wallet className="h-4 w-4" /> Split Payment (Card + Cash)
                    </Button>
                  </div>
                ) : (
                  /* Split Payment Mode */
                  <div className="space-y-3">
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-card-foreground flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Split Payment</span>
                        <button onClick={() => setSplitMode(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Card Amount</Label>
                          <Input
                            type="number"
                            placeholder="Enter card amount..."
                            value={splitCardAmount}
                            onChange={(e) => setSplitCardAmount(e.target.value)}
                            className="h-9 text-sm mt-1"
                          />
                        </div>
                        {parseFloat(splitCardAmount) > 0 && parseFloat(splitCardAmount) < total && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-card border border-border p-2 text-center">
                              <p className="text-muted-foreground">Card</p>
                              <p className="font-bold text-primary">${parseFloat(splitCardAmount).toFixed(2)}</p>
                            </div>
                            <div className="rounded-lg bg-card border border-border p-2 text-center">
                              <p className="text-muted-foreground">Cash</p>
                              <p className="font-bold text-emerald-500">${(total - parseFloat(splitCardAmount)).toFixed(2)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button className="w-full gap-2" onClick={handleSplitPayment} disabled={!parseFloat(splitCardAmount) || parseFloat(splitCardAmount) >= total || parseFloat(splitCardAmount) <= 0}>
                        <Wallet className="h-4 w-4" /> Confirm Split â€” ${total.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <Dialog open={!!receiptOrder} onOpenChange={(open) => !open && setReceiptOrder(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {receiptOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" /> Receipt
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2 print:text-black">
                {/* Receipt Header */}
                <div className="text-center border-b border-dashed border-border pb-4">
                  <h4 className="text-lg font-bold text-card-foreground">TailAdmin Store</h4>
                  <p className="text-xs text-muted-foreground">123 Business Ave, Suite 100</p>
                  <p className="text-xs text-muted-foreground">Tel: (555) 123-4567</p>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Order: <span className="font-medium text-card-foreground">{receiptOrder.id}</span></span>
                  <span>{format(receiptOrder.date, "MMM dd, yyyy HH:mm")}</span>
                </div>

                <div className="border-t border-dashed border-border pt-3 space-y-2">
                  {receiptOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-card-foreground">{item.image} {item.name} <span className="text-muted-foreground">Ã—{item.qty}</span></span>
                      <span className="font-medium text-card-foreground">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-border pt-3 space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>${receiptOrder.subtotal.toFixed(2)}</span></div>
                  {(receiptOrder.membershipDiscount ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-amber-500 font-medium">
                      <span className="flex items-center gap-1"><Crown className="h-3 w-3" /> {receiptOrder.membershipTier} member</span>
                      <span>-${receiptOrder.membershipDiscount!.toFixed(2)}</span>
                    </div>
                  )}
                  {receiptOrder.discount > 0 && (
                    <div className="flex justify-between text-sm text-primary font-medium">
                      <span>Coupon {receiptOrder.couponCode && `(${receiptOrder.couponCode})`}</span>
                      <span>-${receiptOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (8%)</span><span>${receiptOrder.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-base font-bold text-card-foreground pt-2 border-t border-dashed border-border">
                    <span>Total</span><span>${receiptOrder.total.toFixed(2)}</span>
                  </div>
                  {receiptOrder.cashReceived && receiptOrder.cashReceived > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-muted-foreground"><span>Cash Received</span><span>${receiptOrder.cashReceived.toFixed(2)}</span></div>
                      {(receiptOrder.changeGiven ?? 0) > 0 && (
                        <div className="flex justify-between text-sm text-emerald-500 font-medium"><span>Change</span><span>${receiptOrder.changeGiven!.toFixed(2)}</span></div>
                      )}
                    </>
                  )}
                  {receiptOrder.splitDetails && (
                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground"><span>ðŸ’³ Card</span><span>${receiptOrder.splitDetails.card.toFixed(2)}</span></div>
                      <div className="flex justify-between text-xs text-muted-foreground"><span>ðŸ’µ Cash</span><span>${receiptOrder.splitDetails.cash.toFixed(2)}</span></div>
                    </div>
                  )}
                </div>

                <div className="text-center border-t border-dashed border-border pt-3">
                  {(receiptOrder.customerName || receiptOrder.customerPhone) && (
                    <div className="mb-2 text-xs text-muted-foreground">
                      {receiptOrder.customerName && <span className="font-medium text-card-foreground">{receiptOrder.customerName}</span>}
                      {receiptOrder.customerName && receiptOrder.customerPhone && " â€¢ "}
                      {receiptOrder.customerPhone && <span>{receiptOrder.customerPhone}</span>}
                    </div>
                  )}
                  <Badge className={cn("text-xs font-medium border-transparent",
                    receiptOrder.paymentMethod === "card" ? "bg-primary/10 text-primary" :
                      receiptOrder.paymentMethod === "split" ? "bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400" :
                        receiptOrder.paymentMethod === "bkash" ? "bg-pink-100 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400" :
                          receiptOrder.paymentMethod === "nagad" ? "bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400" :
                            "bg-success/10 text-success"
                  )}>
                    Paid via {receiptOrder.paymentMethod === "card" ? "ðŸ’³ Card" : receiptOrder.paymentMethod === "split" ? "ðŸ’³ðŸ’µ Split" : receiptOrder.paymentMethod === "bkash" ? "ðŸ“± bKash" : receiptOrder.paymentMethod === "nagad" ? "ðŸ“± Nagad" : "ðŸ’µ Cash"}
                  </Badge>
                  <p className="mt-2 text-xs text-muted-foreground">Thank you for your purchase!</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => handleDownloadPDF(receiptOrder)}>
                    <Download className="h-4 w-4" /> PDF
                  </Button>
                  <Button className="flex-1 gap-2" onClick={() => setReceiptOrder(null)}>
                    <CheckCircle className="h-4 w-4" /> Done
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Detail Modal */}
      <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <DialogContent className="sm:max-w-[480px]">
          {viewOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Order Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{viewOrder.id}</span>
                  <Badge className={cn("text-xs font-medium border-transparent", viewOrder.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                    {viewOrder.status === "completed" ? "Completed" : "Refunded"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Clock className="h-3.5 w-3.5" /> Date & Time</div>
                    <p className="text-sm font-semibold text-card-foreground">{format(viewOrder.date, "MMM dd, yyyy HH:mm")}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><CreditCard className="h-3.5 w-3.5" /> Payment</div>
                    <p className="text-sm font-semibold text-card-foreground">{viewOrder.paymentMethod === "card" ? "ðŸ’³ Card" : viewOrder.paymentMethod === "bkash" ? "ðŸ“± bKash" : viewOrder.paymentMethod === "nagad" ? "ðŸ“± Nagad" : "ðŸ’µ Cash"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Items</p>
                  <div className="space-y-2">
                    {viewOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.image}</span>
                          <div>
                            <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} Ã— {item.qty}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-card-foreground">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3 space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>${viewOrder.subtotal.toFixed(2)}</span></div>
                  {viewOrder.discount > 0 && (
                    <div className="flex justify-between text-sm text-primary font-medium">
                      <span>Discount {viewOrder.couponCode && `(${viewOrder.couponCode})`}</span>
                      <span>-${viewOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (8%)</span><span>${viewOrder.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-base font-bold text-card-foreground pt-2 border-t border-border"><span>Total</span><span>${viewOrder.total.toFixed(2)}</span></div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full gap-2" onClick={() => { setViewOrder(null); setReceiptOrder(viewOrder); }}>
                    <Receipt className="h-4 w-4" /> View Receipt
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={() => handleDownloadPDF(viewOrder)}>
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  {viewOrder.status === "completed" && (
                    <Button variant="destructive" className="w-full gap-2" onClick={() => handleRefund(viewOrder.id)}>
                      <RotateCcw className="h-4 w-4" /> Refund Order
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner */}
      <BarcodeScanner open={scannerOpen} onClose={() => setScannerOpen(false)} onScan={handleBarcodeScan} />
    </DashboardLayout>
  );
};

export default POSPage;

