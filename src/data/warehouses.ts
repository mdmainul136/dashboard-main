import { getBranches } from "./branches";
import { getProducts } from "./products";

export interface WarehouseStock {
  warehouseId: string; // maps to branch id
  productId: string;
  quantity: number;
  reorderLevel?: number; // minimum stock threshold
}

export interface StockTransfer {
  id: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  productId: string;
  quantity: number;
  status: "pending" | "in_transit" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;
  notes?: string;
  batchId?: string; // groups items in a batch transfer
}

export interface ReorderAlert {
  id: string;
  warehouseId: string;
  productId: string;
  currentStock: number;
  reorderLevel: number;
  suggestedQty: number;
  status: "active" | "acknowledged" | "resolved";
  createdAt: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach(l => l()); }

// Default reorder levels by rough category
const DEFAULT_REORDER_LEVEL = 5;

function initWarehouseStock(): WarehouseStock[] {
  const branches = getBranches();
  const products = getProducts();
  const stock: WarehouseStock[] = [];
  
  products.forEach(p => {
    const activeBranches = branches.filter(b => b.status === "active");
    if (activeBranches.length === 0) return;
    
    let remaining = p.stock;
    activeBranches.forEach((b, i) => {
      const qty = i === activeBranches.length - 1
        ? remaining
        : Math.floor(p.stock / activeBranches.length);
      remaining -= qty;
      stock.push({ warehouseId: b.id, productId: p.id, quantity: Math.max(0, qty), reorderLevel: DEFAULT_REORDER_LEVEL });
    });
  });
  
  return stock;
}

let warehouseStock: WarehouseStock[] = initWarehouseStock();
let transfers: StockTransfer[] = [
  {
    id: "TRF-001",
    fromWarehouseId: "BR-001",
    toWarehouseId: "BR-002",
    productId: "p1",
    quantity: 5,
    status: "completed",
    createdAt: "2025-02-15T10:30:00",
    completedAt: "2025-02-16T14:00:00",
    notes: "Routine restock",
  },
  {
    id: "TRF-002",
    fromWarehouseId: "BR-001",
    toWarehouseId: "BR-003",
    productId: "p5",
    quantity: 10,
    status: "in_transit",
    createdAt: "2025-02-18T09:00:00",
    notes: "Urgent stock request",
  },
];

let reorderAlerts: ReorderAlert[] = [];

export function getWarehouseStock(): WarehouseStock[] { return warehouseStock; }
export function getTransfers(): StockTransfer[] { return transfers; }
export function getReorderAlerts(): ReorderAlert[] { return reorderAlerts; }
export function subscribeWarehouse(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; }

export function getStockForWarehouse(warehouseId: string): WarehouseStock[] {
  return warehouseStock.filter(s => s.warehouseId === warehouseId);
}

export function getStockForProduct(productId: string): WarehouseStock[] {
  return warehouseStock.filter(s => s.productId === productId);
}

export function setReorderLevel(warehouseId: string, productId: string, level: number) {
  warehouseStock = warehouseStock.map(s =>
    s.warehouseId === warehouseId && s.productId === productId
      ? { ...s, reorderLevel: level }
      : s
  );
  checkReorderAlerts();
  emit();
}

function checkReorderAlerts() {
  const products = getProducts();
  const branches = getBranches();
  warehouseStock.forEach(s => {
    const level = s.reorderLevel ?? DEFAULT_REORDER_LEVEL;
    const existingAlert = reorderAlerts.find(
      a => a.warehouseId === s.warehouseId && a.productId === s.productId && a.status === "active"
    );
    if (s.quantity <= level && s.quantity >= 0) {
      if (!existingAlert) {
        reorderAlerts = [...reorderAlerts, {
          id: `RA-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          warehouseId: s.warehouseId,
          productId: s.productId,
          currentStock: s.quantity,
          reorderLevel: level,
          suggestedQty: Math.max(level * 3, 10),
          status: "active",
          createdAt: new Date().toISOString(),
        }];
      } else {
        // Update current stock in existing alert
        reorderAlerts = reorderAlerts.map(a =>
          a.id === existingAlert.id ? { ...a, currentStock: s.quantity } : a
        );
      }
    } else if (s.quantity > level && existingAlert) {
      // Auto-resolve if stock is above level
      reorderAlerts = reorderAlerts.map(a =>
        a.id === existingAlert.id ? { ...a, status: "resolved" } : a
      );
    }
  });
}

export function acknowledgeAlert(alertId: string) {
  reorderAlerts = reorderAlerts.map(a =>
    a.id === alertId ? { ...a, status: "acknowledged" } : a
  );
  emit();
}

export function resolveAlert(alertId: string) {
  reorderAlerts = reorderAlerts.map(a =>
    a.id === alertId ? { ...a, status: "resolved" } : a
  );
  emit();
}

export function createTransfer(data: {
  fromWarehouseId: string;
  toWarehouseId: string;
  productId: string;
  quantity: number;
  notes?: string;
  batchId?: string;
}): StockTransfer | null {
  const sourceStock = warehouseStock.find(
    s => s.warehouseId === data.fromWarehouseId && s.productId === data.productId
  );
  if (!sourceStock || sourceStock.quantity < data.quantity) return null;

  const transfer: StockTransfer = {
    id: `TRF-${String(transfers.length + 1).padStart(3, "0")}`,
    ...data,
    status: "in_transit",
    createdAt: new Date().toISOString(),
  };

  warehouseStock = warehouseStock.map(s =>
    s.warehouseId === data.fromWarehouseId && s.productId === data.productId
      ? { ...s, quantity: s.quantity - data.quantity }
      : s
  );

  transfers = [...transfers, transfer];
  checkReorderAlerts();
  emit();
  return transfer;
}

export interface BatchTransferItem {
  productId: string;
  quantity: number;
}

export function createBatchTransfer(data: {
  fromWarehouseId: string;
  toWarehouseId: string;
  items: BatchTransferItem[];
  notes?: string;
}): StockTransfer[] {
  const batchId = `BATCH-${Date.now()}`;
  const created: StockTransfer[] = [];

  for (const item of data.items) {
    const result = createTransfer({
      fromWarehouseId: data.fromWarehouseId,
      toWarehouseId: data.toWarehouseId,
      productId: item.productId,
      quantity: item.quantity,
      notes: data.notes,
      batchId,
    });
    if (result) created.push(result);
  }

  return created;
}

export function completeTransfer(transferId: string) {
  const transfer = transfers.find(t => t.id === transferId);
  if (!transfer || transfer.status !== "in_transit") return;

  const existing = warehouseStock.find(
    s => s.warehouseId === transfer.toWarehouseId && s.productId === transfer.productId
  );
  if (existing) {
    warehouseStock = warehouseStock.map(s =>
      s.warehouseId === transfer.toWarehouseId && s.productId === transfer.productId
        ? { ...s, quantity: s.quantity + transfer.quantity }
        : s
    );
  } else {
    warehouseStock = [...warehouseStock, {
      warehouseId: transfer.toWarehouseId,
      productId: transfer.productId,
      quantity: transfer.quantity,
    }];
  }

  transfers = transfers.map(t =>
    t.id === transferId
      ? { ...t, status: "completed", completedAt: new Date().toISOString() }
      : t
  );
  checkReorderAlerts();
  emit();
}

export function cancelTransfer(transferId: string) {
  const transfer = transfers.find(t => t.id === transferId);
  if (!transfer || transfer.status !== "in_transit") return;

  warehouseStock = warehouseStock.map(s =>
    s.warehouseId === transfer.fromWarehouseId && s.productId === transfer.productId
      ? { ...s, quantity: s.quantity + transfer.quantity }
      : s
  );

  transfers = transfers.map(t =>
    t.id === transferId ? { ...t, status: "cancelled" } : t
  );
  checkReorderAlerts();
  emit();
}

// Initialize alerts on load
checkReorderAlerts();
