"use client";

import { useState, useMemo, useEffect } from "react";
import {} from 'next/navigation';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getPurchaseOrders, addPurchaseOrder, updatePurchaseOrder, type PurchaseOrder, type POItem } from "@/data/purchaseOrders";
import { subscribe } from "@/data/purchaseOrders";
import { getSuppliers, subscribe as subscribeSup } from "@/data/suppliers";
import { getProducts, updateProductStock } from "@/data/products";
import { subscribe as subscribeProd } from "@/data/products";
import { useSyncExternalStore } from "react";
import { ClipboardList, DollarSign, Truck, Plus, Trash2, FileText, Star, Clock, CreditCard, MapPin, Globe, Phone, Mail, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import InvoiceDialog, { type InvoiceData } from "@/components/InvoiceDialog";
import { useCurrency } from "@/hooks/useCurrency";

function usePurchaseOrders() {
  return useSyncExternalStore(subscribe, getPurchaseOrders, getPurchaseOrders);
}
function useSuppliers() {
  return useSyncExternalStore(subscribeSup, getSuppliers, getSuppliers);
}
function useProducts() {
  return useSyncExternalStore(subscribeProd, getProducts, getProducts);
}

const statusColors: Record<PurchaseOrder["status"], "default" | "secondary" | "destructive" | "outline"> = {
  Draft: "secondary", Sent: "default", Received: "outline", Cancelled: "destructive",
};

const PurchaseOrdersPage = () => {
  const { formatShort } = useCurrency();
  const orders = usePurchaseOrders();
  const suppliers = useSuppliers();
  const products = useProducts();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const pathname = usePathname();

  // Auto-open dialog if navigated from Supplier page with supplierId
  useEffect(() => {
    const state = location.state as { supplierId?: string } | null;
    if (state?.supplierId) {
      const sup = suppliers.find(s => s.id === state.supplierId);
      if (sup) {
        setSelectedSupplier(sup.id);
        const d = new Date();
        d.setDate(d.getDate() + sup.leadTimeDays);
        setExpectedDate(d.toISOString().slice(0, 10));
        setDialogOpen(true);
      }
      // Clear state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state, suppliers]);

  const openInvoice = (po: PurchaseOrder) => {
    const supplier = suppliers.find(s => s.id === po.supplierId);
    setInvoiceData({
      id: po.id,
      date: po.createdDate,
      type: "Purchase Order",
      from: { name: "TailAdmin Store", address: "123 Business Ave, Dhaka 1000", email: "purchase@tailadmin.com" },
      to: { name: po.supplierName, address: supplier?.address ? `${supplier.address}, ${supplier.city}` : "", email: supplier?.email, phone: supplier?.phone },
      items: po.items.map(i => ({ name: i.productName, quantity: i.quantity, unitPrice: i.unitPrice })),
      subtotal: po.total,
      total: po.total,
      notes: po.notes || undefined,
    });
  };

  // New PO form state
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [poItems, setPoItems] = useState<POItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [itemQty, setItemQty] = useState(10);
  const [itemPrice, setItemPrice] = useState(0);

  const filtered = useMemo(() => statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter), [orders, statusFilter]);

  const stats = useMemo(() => ({
    open: orders.filter(o => o.status === "Draft" || o.status === "Sent").length,
    monthSpend: orders.filter(o => o.status !== "Cancelled" && o.createdDate >= "2026-02-01").reduce((s, o) => s + o.total, 0),
    pending: orders.filter(o => o.status === "Sent").length,
  }), [orders]);

  const poTotal = poItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const addItem = () => {
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) { toast.error("Select a product"); return; }
    if (poItems.some(i => i.productId === prod.id)) { toast.error("Product already added"); return; }
    setPoItems(prev => [...prev, { productId: prod.id, productName: prod.name, quantity: itemQty, unitPrice: itemPrice || prod.price * 0.6 }]);
    setSelectedProduct("");
    setItemQty(10);
    setItemPrice(0);
  };

  const removeItem = (productId: string) => {
    setPoItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleCreatePO = () => {
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (!supplier) { toast.error("Select a supplier"); return; }
    if (poItems.length === 0) { toast.error("Add at least one item"); return; }
    if (!expectedDate) { toast.error("Set expected date"); return; }

    addPurchaseOrder({
      id: `PO-${String(orders.length + 5).padStart(3, "0")}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      items: [...poItems],
      status: "Draft",
      createdDate: new Date().toISOString().slice(0, 10),
      expectedDate,
      total: poTotal,
      notes,
    });

    // Reset form
    setSelectedSupplier("");
    setExpectedDate("");
    setNotes("");
    setPoItems([]);
    setDialogOpen(false);
    toast.success("Purchase Order created");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
            <p className="text-muted-foreground">Track and manage purchase orders</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Create PO</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
              <div className="space-y-5 py-4">
                {/* Supplier Selection */}
                <div>
                  <Label>Supplier</Label>
                  <Select value={selectedSupplier} onValueChange={v => {
                    setSelectedSupplier(v);
                    const sup = suppliers.find(s => s.id === v);
                    if (sup) {
                      const d = new Date();
                      d.setDate(d.getDate() + sup.leadTimeDays);
                      setExpectedDate(d.toISOString().slice(0, 10));
                    }
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select supplier..." /></SelectTrigger>
                    <SelectContent>
                      {suppliers.filter(s => s.status === "Active").map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          <span className="flex items-center gap-2">
                            {s.name}
                            <span className="text-xs text-muted-foreground">â€” {s.city}, {s.country}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Supplier Info Card */}
                {selectedSupplier && (() => {
                  const sup = suppliers.find(s => s.id === selectedSupplier);
                  if (!sup) return null;
                  return (
                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-card-foreground">{sup.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{sup.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" />{sup.city}, {sup.country}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" />Lead: {sup.leadTimeDays} days</span>
                        <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3 w-3" />{sup.paymentTerms}</span>
                        <span className="inline-flex items-center gap-1.5"><Globe className="h-3 w-3" />{sup.currency || "SAR"}</span>
                        <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" />{sup.email}</span>
                        <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" />{sup.phone}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">Orders: <strong className="text-card-foreground">{sup.totalOrders}</strong></span>
                        <span className="text-muted-foreground">Total Spend: <strong className="text-card-foreground">{formatShort(sup.totalSpend)}</strong></span>
                        {sup.website && (
                          <a href={sup.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                            <ExternalLink className="h-3 w-3" />Website
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <Label>Expected Delivery</Label>
                  <Input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
                  {selectedSupplier && expectedDate && (
                    <p className="text-xs text-muted-foreground mt-1">Auto-calculated from supplier lead time ({suppliers.find(s => s.id === selectedSupplier)?.leadTimeDays} days)</p>
                  )}
                </div>

                {/* Add Product Row */}
                <div>
                  <Label className="mb-2 block">Add Products</Label>
                  <div className="flex gap-2">
                    <Select value={selectedProduct} onValueChange={v => {
                      setSelectedProduct(v);
                      const p = products.find(pr => pr.id === v);
                      if (p) setItemPrice(+(p.price * 0.6).toFixed(2));
                    }}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Select product..." /></SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" className="w-20" placeholder="Qty" value={itemQty} onChange={e => setItemQty(Number(e.target.value))} min={1} />
                    <Input type="number" className="w-24" placeholder={`Unit ${formatShort(0).charAt(0)}`} value={itemPrice} onChange={e => setItemPrice(Number(e.target.value))} min={0} step={0.01} />
                    <Button variant="outline" onClick={addItem}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>

                {/* Items Table */}
                {poItems.length > 0 && (
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Product</TableHead><TableHead>Qty</TableHead><TableHead>Unit Price</TableHead><TableHead>Subtotal</TableHead><TableHead></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {poItems.map(item => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                           <TableCell>{formatShort(item.unitPrice)}</TableCell>
                           <TableCell>{formatShort(item.quantity * item.unitPrice)}</TableCell>
                          <TableCell><Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="font-bold text-right">Total</TableCell>
                        <TableCell className="font-bold">{formatShort(poTotal)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}

                <div>
                  <Label>Notes</Label>
                  <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
                </div>

                <Button className="w-full" onClick={handleCreatePO}>Create Purchase Order</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-primary/10 p-3"><ClipboardList className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Open POs</p><p className="text-2xl font-bold">{stats.open}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-green-500/10 p-3"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">This Month Spend</p><p className="text-2xl font-bold">{formatShort(stats.monthSpend)}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-amber-500/10 p-3"><Truck className="h-5 w-5 text-amber-600" /></div><div><p className="text-sm text-muted-foreground">Pending Delivery</p><p className="text-2xl font-bold">{stats.pending}</p></div></CardContent></Card>
        </div>

        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Sent">Sent</SelectItem><SelectItem value="Received">Received</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>PO #</TableHead><TableHead>Supplier</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Created</TableHead><TableHead>Expected</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map(po => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.id}</TableCell>
                    <TableCell>{po.supplierName}</TableCell>
                    <TableCell>{po.items.map(i => `${i.productName} x${i.quantity}`).join(", ")}</TableCell>
                    <TableCell>{formatShort(po.total)}</TableCell>
                    <TableCell>{po.createdDate}</TableCell>
                    <TableCell>{po.expectedDate}</TableCell>
                    <TableCell><Badge variant={statusColors[po.status]}>{po.status}</Badge></TableCell>
                    <TableCell className="space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => openInvoice(po)} title="Invoice"><FileText className="h-4 w-4" /></Button>
                      {po.status === "Draft" && <Button size="sm" variant="outline" onClick={() => { updatePurchaseOrder(po.id, { status: "Sent" }); toast.success("PO sent"); }}>Send</Button>}
                      {po.status === "Sent" && <Button size="sm" variant="outline" onClick={() => {
                        updatePurchaseOrder(po.id, { status: "Received" });
                        const currentProducts = getProducts();
                        po.items.forEach(item => {
                          const prod = currentProducts.find(p => p.id === item.productId);
                          if (prod) updateProductStock(item.productId, prod.stock + item.quantity);
                        });
                        toast.success(`Received â€” ${po.items.length} product(s) stock updated`);
                      }}>Receive</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <InvoiceDialog open={!!invoiceData} onOpenChange={open => !open && setInvoiceData(null)} data={invoiceData} />
    </DashboardLayout>
  );
};

export default PurchaseOrdersPage;

