"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Warehouse as WarehouseIcon, ArrowRightLeft, Package, CheckCircle, XCircle, Clock, TrendingUp, Building2, Plus, Trash2, AlertTriangle, Bell, BellOff, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

import { getBranches, subscribeBranches } from "@/data/branches";
import { getProducts, subscribe as subscribeProducts } from "@/data/products";
import {
  getWarehouseStock, getTransfers, getReorderAlerts, subscribeWarehouse,
  createTransfer, createBatchTransfer, completeTransfer, cancelTransfer,
  getStockForWarehouse, acknowledgeAlert, resolveAlert, setReorderLevel,
  type BatchTransferItem,
} from "@/data/warehouses";

const statusStyles: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  in_transit: "bg-warning/10 text-warning border-transparent",
  completed: "bg-success/10 text-success border-transparent",
  cancelled: "bg-destructive/10 text-destructive border-transparent",
};

const alertStatusStyles: Record<string, string> = {
  active: "bg-destructive/10 text-destructive border-transparent",
  acknowledged: "bg-warning/10 text-warning border-transparent",
  resolved: "bg-success/10 text-success border-transparent",
};

const WarehousePage = () => {
  const branches = useSyncExternalStore(subscribeBranches, getBranches, getBranches);
  const products = useSyncExternalStore(subscribeProducts, getProducts, getProducts);
  const warehouseStock = useSyncExternalStore(subscribeWarehouse, getWarehouseStock, getWarehouseStock);
  const transfers = useSyncExternalStore(subscribeWarehouse, getTransfers, getTransfers);
  const reorderAlerts = useSyncExternalStore(subscribeWarehouse, getReorderAlerts, getReorderAlerts);

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferMode, setTransferMode] = useState<"single" | "batch">("single");
  const [fromWh, setFromWh] = useState("");
  const [toWh, setToWh] = useState("");
  const [transferProduct, setTransferProduct] = useState("");
  const [transferQty, setTransferQty] = useState("");
  const [transferNotes, setTransferNotes] = useState("");

  // Batch transfer state
  const [batchItems, setBatchItems] = useState<BatchTransferItem[]>([]);
  const [batchProduct, setBatchProduct] = useState("");
  const [batchQty, setBatchQty] = useState("");

  const activeBranches = useMemo(() => branches.filter(b => b.status === "active"), [branches]);

  const warehouseInventory = useMemo(() => {
    const target = selectedWarehouse === "all" ? warehouseStock : warehouseStock.filter(s => s.warehouseId === selectedWarehouse);
    return target.map(s => {
      const product = products.find(p => p.id === s.productId);
      const branch = branches.find(b => b.id === s.warehouseId);
      return { ...s, productName: product?.name ?? s.productId, productSku: product?.sku ?? "", productImage: product?.image ?? "ðŸ“¦", warehouseName: branch?.name ?? s.warehouseId, price: product?.price ?? 0 };
    }).filter(s => s.quantity > 0 || selectedWarehouse !== "all");
  }, [warehouseStock, selectedWarehouse, products, branches]);

  const stats = useMemo(() => {
    const totalUnits = warehouseStock.reduce((s, ws) => s + ws.quantity, 0);
    const totalValue = warehouseStock.reduce((s, ws) => {
      const p = products.find(pr => pr.id === ws.productId);
      return s + ws.quantity * (p?.price ?? 0);
    }, 0);
    const inTransit = transfers.filter(t => t.status === "in_transit").length;
    const completed = transfers.filter(t => t.status === "completed").length;
    const activeAlerts = reorderAlerts.filter(a => a.status === "active").length;
    return { totalUnits, totalValue, inTransit, completed, warehouses: activeBranches.length, activeAlerts };
  }, [warehouseStock, transfers, products, activeBranches, reorderAlerts]);

  // Single transfer handler
  const handleCreateTransfer = () => {
    if (!fromWh || !toWh || !transferProduct || !transferQty) {
      toast({ title: "All fields required", variant: "destructive" }); return;
    }
    if (fromWh === toWh) {
      toast({ title: "Source and destination must differ", variant: "destructive" }); return;
    }
    const qty = parseInt(transferQty, 10);
    if (isNaN(qty) || qty <= 0) {
      toast({ title: "Invalid quantity", variant: "destructive" }); return;
    }
    const result = createTransfer({ fromWarehouseId: fromWh, toWarehouseId: toWh, productId: transferProduct, quantity: qty, notes: transferNotes });
    if (!result) {
      toast({ title: "Insufficient stock at source warehouse", variant: "destructive" }); return;
    }
    toast({ title: "Transfer created!", description: `${qty} units in transit` });
    resetDialog();
  };

  // Batch transfer handlers
  const addBatchItem = () => {
    if (!batchProduct || !batchQty) return;
    const qty = parseInt(batchQty, 10);
    if (isNaN(qty) || qty <= 0) { toast({ title: "Invalid quantity", variant: "destructive" }); return; }
    if (batchItems.find(i => i.productId === batchProduct)) {
      toast({ title: "Product already in batch", variant: "destructive" }); return;
    }
    // Check available stock
    const available = warehouseStock.find(ws => ws.warehouseId === fromWh && ws.productId === batchProduct);
    if (!available || available.quantity < qty) {
      toast({ title: "Insufficient stock", variant: "destructive" }); return;
    }
    setBatchItems(prev => [...prev, { productId: batchProduct, quantity: qty }]);
    setBatchProduct(""); setBatchQty("");
  };

  const removeBatchItem = (productId: string) => {
    setBatchItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleBatchTransfer = () => {
    if (!fromWh || !toWh || batchItems.length === 0) {
      toast({ title: "Select warehouses and add products", variant: "destructive" }); return;
    }
    if (fromWh === toWh) {
      toast({ title: "Source and destination must differ", variant: "destructive" }); return;
    }
    const results = createBatchTransfer({ fromWarehouseId: fromWh, toWarehouseId: toWh, items: batchItems, notes: transferNotes });
    if (results.length === 0) {
      toast({ title: "All transfers failed â€” check stock levels", variant: "destructive" }); return;
    }
    const totalQty = results.reduce((s, t) => s + t.quantity, 0);
    toast({ title: `Batch transfer created!`, description: `${results.length} products, ${totalQty} total units in transit` });
    resetDialog();
  };

  const resetDialog = () => {
    setTransferOpen(false);
    setFromWh(""); setToWh(""); setTransferProduct(""); setTransferQty(""); setTransferNotes("");
    setBatchItems([]); setBatchProduct(""); setBatchQty(""); setTransferMode("single");
  };

  const availableStock = useMemo(() => {
    if (!fromWh || !transferProduct) return 0;
    const s = warehouseStock.find(ws => ws.warehouseId === fromWh && ws.productId === transferProduct);
    return s?.quantity ?? 0;
  }, [fromWh, transferProduct, warehouseStock]);

  const batchAvailableStock = useMemo(() => {
    if (!fromWh || !batchProduct) return 0;
    const s = warehouseStock.find(ws => ws.warehouseId === fromWh && ws.productId === batchProduct);
    return s?.quantity ?? 0;
  }, [fromWh, batchProduct, warehouseStock]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">ðŸ­ Warehouse Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Multi-warehouse inventory tracking & stock transfers</p>
          </div>
          <Button className="gap-2 rounded-xl shadow-sm" onClick={() => setTransferOpen(true)}>
            <ArrowRightLeft className="h-4 w-4" /> New Transfer
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {[
            { icon: Building2, label: "Warehouses", value: stats.warehouses, color: "text-primary", bg: "bg-primary/10" },
            { icon: Package, label: "Total Units", value: stats.totalUnits.toLocaleString(), color: "text-success", bg: "bg-success/10" },
            { icon: TrendingUp, label: "Total Value", value: `$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "text-primary", bg: "bg-primary/10" },
            { icon: Clock, label: "In Transit", value: stats.inTransit, color: "text-warning", bg: "bg-warning/10" },
            { icon: CheckCircle, label: "Completed", value: stats.completed, color: "text-success", bg: "bg-success/10" },
            { icon: AlertTriangle, label: "Reorder Alerts", value: stats.activeAlerts, color: stats.activeAlerts > 0 ? "text-destructive" : "text-success", bg: stats.activeAlerts > 0 ? "bg-destructive/10" : "bg-success/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", s.bg, s.color)}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-card-foreground">{s.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Warehouse Inventory</TabsTrigger>
            <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
            <TabsTrigger value="alerts" className="gap-1.5">
              Reorder Alerts
              {stats.activeAlerts > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center">{stats.activeAlerts}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="summary">Warehouse Summary</TabsTrigger>
          </TabsList>

          {/* Tab 1: Warehouse Inventory */}
          <TabsContent value="inventory">
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Inventory by Warehouse</CardTitle>
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {activeBranches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      {selectedWarehouse === "all" && <TableHead>Warehouse</TableHead>}
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Reorder Level</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseInventory.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No stock data</TableCell></TableRow>
                    ) : warehouseInventory.map((item, i) => {
                      const reorderLevel = item.reorderLevel ?? 5;
                      const isLow = item.quantity <= reorderLevel;
                      return (
                        <TableRow key={`${item.warehouseId}-${item.productId}-${i}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{item.productImage}</span>
                              <span className="font-medium">{item.productName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">{item.productSku}</TableCell>
                          {selectedWarehouse === "all" && <TableCell>{item.warehouseName}</TableCell>}
                          <TableCell className={cn("text-right font-semibold", isLow && "text-destructive")}>{item.quantity}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{reorderLevel}</TableCell>
                          <TableCell className="text-right">${(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            {isLow ? (
                              <Badge className="bg-destructive/10 text-destructive border-transparent text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Low</Badge>
                            ) : (
                              <Badge className="bg-success/10 text-success border-transparent text-xs">OK</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Stock Transfers */}
          <TabsContent value="transfers">
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader><CardTitle>Transfer History</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfers.length === 0 ? (
                      <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No transfers yet</TableCell></TableRow>
                    ) : [...transfers].reverse().map(t => {
                      const product = products.find(p => p.id === t.productId);
                      const from = branches.find(b => b.id === t.fromWarehouseId);
                      const to = branches.find(b => b.id === t.toWarehouseId);
                      return (
                        <TableRow key={t.id}>
                          <TableCell className="font-mono text-xs">{t.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product?.image ?? "ðŸ“¦"}</span>
                              <span>{product?.name ?? t.productId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{from?.name ?? t.fromWarehouseId}</TableCell>
                          <TableCell className="text-sm">{to?.name ?? t.toWarehouseId}</TableCell>
                          <TableCell className="text-right font-semibold">{t.quantity}</TableCell>
                          <TableCell>
                            {t.batchId ? <Badge variant="outline" className="text-[10px] font-mono">BATCH</Badge> : <span className="text-xs text-muted-foreground">â€”</span>}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs capitalize", statusStyles[t.status])}>{t.status.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {t.status === "in_transit" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { completeTransfer(t.id); toast({ title: "Transfer completed!" }); }}>
                                  <CheckCircle className="h-3 w-3" /> Complete
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => { cancelTransfer(t.id); toast({ title: "Transfer cancelled" }); }}>
                                  <XCircle className="h-3 w-3" /> Cancel
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Reorder Alerts */}
          <TabsContent value="alerts">
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" /> Reorder Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Reorder Level</TableHead>
                      <TableHead className="text-right">Suggested Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reorderAlerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ShieldCheck className="h-10 w-10 text-success" />
                            <p className="font-medium">All stock levels are healthy</p>
                            <p className="text-xs">No reorder alerts at this time</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : [...reorderAlerts].reverse().map(alert => {
                      const product = products.find(p => p.id === alert.productId);
                      const branch = branches.find(b => b.id === alert.warehouseId);
                      return (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product?.image ?? "ðŸ“¦"}</span>
                              <span className="font-medium">{product?.name ?? alert.productId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{branch?.name ?? alert.warehouseId}</TableCell>
                          <TableCell className="text-right font-semibold text-destructive">{alert.currentStock}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{alert.reorderLevel}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">{alert.suggestedQty}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs capitalize", alertStatusStyles[alert.status])}>{alert.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {alert.status === "active" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { acknowledgeAlert(alert.id); toast({ title: "Alert acknowledged" }); }}>
                                  <BellOff className="h-3 w-3" /> Ack
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-success" onClick={() => { resolveAlert(alert.id); toast({ title: "Alert resolved" }); }}>
                                  <CheckCircle className="h-3 w-3" /> Resolve
                                </Button>
                              </div>
                            )}
                            {alert.status === "acknowledged" && (
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-success" onClick={() => { resolveAlert(alert.id); toast({ title: "Alert resolved" }); }}>
                                <CheckCircle className="h-3 w-3" /> Resolve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Warehouse Summary */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeBranches.map(branch => {
                const branchStock = getStockForWarehouse(branch.id);
                const totalUnits = branchStock.reduce((s, ws) => s + ws.quantity, 0);
                const totalValue = branchStock.reduce((s, ws) => {
                  const p = products.find(pr => pr.id === ws.productId);
                  return s + ws.quantity * (p?.price ?? 0);
                }, 0);
                const productCount = branchStock.filter(ws => ws.quantity > 0).length;
                const lowStockCount = branchStock.filter(ws => ws.quantity <= (ws.reorderLevel ?? 5)).length;
                const topItems = branchStock
                  .map(ws => ({ ...ws, name: products.find(p => p.id === ws.productId)?.name ?? ws.productId, image: products.find(p => p.id === ws.productId)?.image ?? "ðŸ“¦" }))
                  .sort((a, b) => b.quantity - a.quantity)
                  .slice(0, 3);

                return (
                  <Card key={branch.id} className="rounded-2xl border-border/60 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Building2 className="h-5 w-5 text-primary" />
                        {branch.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{branch.city} Â· {branch.address}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="rounded-lg bg-primary/5 p-2">
                          <p className="text-lg font-bold text-primary">{productCount}</p>
                          <p className="text-[10px] text-muted-foreground">Products</p>
                        </div>
                        <div className="rounded-lg bg-success/5 p-2">
                          <p className="text-lg font-bold text-success">{totalUnits}</p>
                          <p className="text-[10px] text-muted-foreground">Units</p>
                        </div>
                        <div className="rounded-lg bg-warning/5 p-2">
                          <p className="text-lg font-bold text-warning">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          <p className="text-[10px] text-muted-foreground">Value</p>
                        </div>
                        <div className={cn("rounded-lg p-2", lowStockCount > 0 ? "bg-destructive/5" : "bg-success/5")}>
                          <p className={cn("text-lg font-bold", lowStockCount > 0 ? "text-destructive" : "text-success")}>{lowStockCount}</p>
                          <p className="text-[10px] text-muted-foreground">Low Stock</p>
                        </div>
                      </div>
                      {topItems.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Top Items</p>
                          <div className="space-y-1">
                            {topItems.map(item => (
                              <div key={item.productId} className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5">{item.image} {item.name}</span>
                                <span className={cn("font-medium tabular-nums", item.quantity <= (item.reorderLevel ?? 5) && "text-destructive")}>{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Transfer Dialog â€” supports single & batch */}
        <Dialog open={transferOpen} onOpenChange={v => { if (!v) resetDialog(); else setTransferOpen(true); }}>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><ArrowRightLeft className="h-5 w-5 text-primary" /> New Stock Transfer</DialogTitle>
              <DialogDescription>Transfer stock between warehouses â€” single or batch</DialogDescription>
            </DialogHeader>

            {/* Mode Toggle */}
            <div className="flex gap-2 border rounded-lg p-1 bg-muted/30">
              <Button variant={transferMode === "single" ? "default" : "ghost"} size="sm" className="flex-1 text-xs" onClick={() => setTransferMode("single")}>
                Single Product
              </Button>
              <Button variant={transferMode === "batch" ? "default" : "ghost"} size="sm" className="flex-1 text-xs" onClick={() => setTransferMode("batch")}>
                Batch Transfer
              </Button>
            </div>

            <div className="space-y-4 py-2">
              {/* Source & destination (shared) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">From Warehouse</Label>
                  <Select value={fromWh} onValueChange={v => { setFromWh(v); setBatchItems([]); }}>
                    <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>
                      {activeBranches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">To Warehouse</Label>
                  <Select value={toWh} onValueChange={setToWh}>
                    <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                    <SelectContent>
                      {activeBranches.filter(b => b.id !== fromWh).map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Single mode */}
              {transferMode === "single" && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Product</Label>
                    <Select value={transferProduct} onValueChange={setTransferProduct}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.image} {p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Quantity</Label>
                    <Input type="number" min="1" placeholder="Enter quantity" value={transferQty} onChange={e => setTransferQty(e.target.value)} />
                    {fromWh && transferProduct && (
                      <p className="text-xs text-muted-foreground">Available at source: <span className="font-semibold text-foreground">{availableStock}</span> units</p>
                    )}
                  </div>
                </>
              )}

              {/* Batch mode */}
              {transferMode === "batch" && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-dashed border-border p-3 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add Products to Batch</p>
                    <div className="grid grid-cols-[1fr_80px_auto] gap-2 items-end">
                      <div>
                        <Select value={batchProduct} onValueChange={setBatchProduct}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Product" /></SelectTrigger>
                          <SelectContent>
                            {products.filter(p => !batchItems.find(bi => bi.productId === p.id)).map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.image} {p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input type="number" min="1" className="h-9" placeholder="Qty" value={batchQty} onChange={e => setBatchQty(e.target.value)} />
                      <Button size="sm" variant="outline" className="h-9" onClick={addBatchItem} disabled={!fromWh}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {fromWh && batchProduct && (
                      <p className="text-xs text-muted-foreground">Available: <span className="font-semibold text-foreground">{batchAvailableStock}</span> units</p>
                    )}
                  </div>

                  {/* Batch items list */}
                  {batchItems.length > 0 && (
                    <div className="rounded-lg border border-border">
                      <div className="px-3 py-2 bg-muted/30 border-b">
                        <p className="text-xs font-semibold">{batchItems.length} product(s) in batch</p>
                      </div>
                      <div className="divide-y">
                        {batchItems.map(item => {
                          const prod = products.find(p => p.id === item.productId);
                          return (
                            <div key={item.productId} className="flex items-center justify-between px-3 py-2">
                              <div className="flex items-center gap-2 text-sm">
                                <span>{prod?.image ?? "ðŸ“¦"}</span>
                                <span>{prod?.name ?? item.productId}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold tabular-nums">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeBatchItem(item.productId)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
                <Textarea placeholder="Transfer reason..." value={transferNotes} onChange={e => setTransferNotes(e.target.value)} rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>Cancel</Button>
              {transferMode === "single" ? (
                <Button onClick={handleCreateTransfer}>Create Transfer</Button>
              ) : (
                <Button onClick={handleBatchTransfer} disabled={batchItems.length === 0}>
                  Transfer {batchItems.length} Product{batchItems.length !== 1 ? "s" : ""}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WarehousePage;

