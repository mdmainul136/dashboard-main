"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCart, type Order } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InvoiceDialog, { type InvoiceData } from "@/components/InvoiceDialog";
import { Package, Eye, ClipboardList, FileText } from "lucide-react";
import { useState } from "react";

const statusColors: Record<Order["status"], string> = {
  Processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const Orders = () => {
  const { orders, updateOrderStatus } = useCart();
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const openInvoice = (order: Order) => {
    setInvoiceData({
      id: order.id,
      date: order.date,
      type: "Sales Invoice",
      from: { name: "TailAdmin Store", address: "123 Business Ave, Dhaka 1000", email: "sales@tailadmin.com", phone: "+880-1700-000000" },
      to: { name: order.customer.name, address: `${order.customer.address}, ${order.customer.city} ${order.customer.zip}`, email: order.customer.email, phone: order.customer.phone },
      items: order.items.map(i => ({ name: i.product.name, quantity: i.quantity, unitPrice: i.product.price })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      paymentMethod: order.paymentMethod,
    });
  };

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === "Processing").length,
    shipped: orders.filter(o => o.status === "Shipped").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Order Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage all orders</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Orders", value: stats.total, icon: <Package className="h-5 w-5" />, gradient: "from-primary/15 to-primary/5", color: "text-primary" },
          { label: "Processing", value: stats.processing, icon: <Eye className="h-5 w-5" />, gradient: "from-[hsl(38,92%,50%)]/15 to-[hsl(38,92%,50%)]/5", color: "text-warning" },
          { label: "Shipped", value: stats.shipped, icon: <ClipboardList className="h-5 w-5" />, gradient: "from-[hsl(231,74%,56%)]/15 to-[hsl(231,74%,56%)]/5", color: "text-primary" },
          { label: "Delivered", value: stats.delivered, icon: <FileText className="h-5 w-5" />, gradient: "from-[hsl(160,84%,39%)]/15 to-[hsl(160,84%,39%)]/5", color: "text-success" },
        ].map((s, i) => (
          <div key={s.label} className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} ${s.color} transition-transform duration-300 group-hover:scale-110`}>{s.icon}</div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-card-foreground tabular-nums">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ClipboardList className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items.reduce((s, i) => s + i.quantity, 0)}</TableCell>
                    <TableCell className="font-bold">${order.total.toFixed(2)}</TableCell>
                    <TableCell><Badge variant="outline">{order.paymentMethod}</Badge></TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setSelected(order)}><Eye className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => openInvoice(order)} title="Invoice"><FileText className="h-4 w-4" /></Button>
                        {order.status === "Processing" && (
                          <Button size="sm" variant="outline" onClick={() => { updateOrderStatus(order.id, "Shipped"); }}>Ship</Button>
                        )}
                        {order.status === "Shipped" && (
                          <Button size="sm" variant="outline" onClick={() => { updateOrderStatus(order.id, "Delivered"); }}>Deliver</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Order {selected.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{selected.customer.name}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selected.customer.email}</span></div>
                  <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selected.customer.phone}</span></div>
                  <div><span className="text-muted-foreground">Payment:</span> <Badge variant="outline">{selected.paymentMethod}</Badge></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <span className="font-medium">{selected.customer.address}, {selected.customer.city} {selected.customer.zip}</span></div>
                </div>
                <Separator />
                <div className="space-y-2">
                  {selected.items.map(i => (
                    <div key={i.product.id} className="flex items-center gap-3">
                      <span className="text-2xl">{i.product.image}</span>
                      <div className="flex-1">
                        <p className="font-medium">{i.product.name}</p>
                        <p className="text-xs text-muted-foreground">${i.product.price.toFixed(2)} Ã— {i.quantity}</p>
                      </div>
                      <p className="font-bold">${(i.product.price * i.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${selected.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{selected.shipping === 0 ? "Free" : `$${selected.shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">${selected.total.toFixed(2)}</span></div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <InvoiceDialog open={!!invoiceData} onOpenChange={open => !open && setInvoiceData(null)} data={invoiceData} />
    </DashboardLayout>
  );
};

export default Orders;

