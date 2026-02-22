"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { RotateCcw, DollarSign, Percent, Plus } from "lucide-react";
import { toast } from "sonner";

type ReturnStatus = "Requested" | "Approved" | "Refunded" | "Rejected";
type ReturnReason = "Defective" | "Wrong Item" | "Not as Described" | "Changed Mind";

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  reason: ReturnReason;
  status: ReturnStatus;
  amount: number;
  refundMethod: "Original Payment" | "Store Credit" | "Exchange";
  date: string;
  items: string[];
}

const sampleReturns: ReturnRequest[] = [
  { id: "RET-001", orderId: "ORD-1001", customerName: "à¦†à¦¹à¦®à§‡à¦¦ à¦¹à¦¾à¦¸à¦¾à¦¨", reason: "Defective", status: "Requested", amount: 29.99, refundMethod: "Original Payment", date: "2026-02-18", items: ["Wireless Mouse"] },
  { id: "RET-002", orderId: "ORD-1002", customerName: "à¦«à¦¾à¦¤à¦¿à¦®à¦¾ à¦–à¦¾à¦¨", reason: "Not as Described", status: "Approved", amount: 149.99, refundMethod: "Exchange", date: "2026-02-17", items: ["Headphones"] },
  { id: "RET-003", orderId: "ORD-1003", customerName: "à¦°à¦¾à¦¹à§à¦² à¦¸à§‡à¦¨", reason: "Changed Mind", status: "Refunded", amount: 9.99, refundMethod: "Store Credit", date: "2026-02-15", items: ["Pen Holder"] },
];

const statusColors: Record<ReturnStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Requested: "secondary", Approved: "default", Refunded: "outline", Rejected: "destructive",
};

const Returns = () => {
  const { orders } = useCart();
  const [returns, setReturns] = useState<ReturnRequest[]>(sampleReturns);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Create return form
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState<ReturnReason>("Defective");
  const [refundMethod, setRefundMethod] = useState<"Original Payment" | "Store Credit" | "Exchange">("Original Payment");

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const filtered = useMemo(() => statusFilter === "all" ? returns : returns.filter(r => r.status === statusFilter), [returns, statusFilter]);

  const stats = useMemo(() => ({
    open: returns.filter(r => r.status === "Requested" || r.status === "Approved").length,
    refunded: returns.filter(r => r.status === "Refunded").reduce((s, r) => s + r.amount, 0),
    rate: returns.length > 0 ? ((returns.length / 10) * 100).toFixed(1) : "0",
  }), [returns]);

  const updateStatus = (id: string, status: ReturnStatus) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Return ${status.toLowerCase()}`);
  };

  const toggleItem = (itemName: string) => {
    setSelectedItems(prev => prev.includes(itemName) ? prev.filter(n => n !== itemName) : [...prev, itemName]);
  };

  const handleCreateReturn = () => {
    if (!selectedOrder) { toast.error("Select an order"); return; }
    if (selectedItems.length === 0) { toast.error("Select at least one item"); return; }

    const returnAmount = selectedOrder.items
      .filter(i => selectedItems.includes(i.product.name))
      .reduce((s, i) => s + i.product.price * i.quantity, 0);

    const newReturn: ReturnRequest = {
      id: `RET-${String(returns.length + 4).padStart(3, "0")}`,
      orderId: selectedOrder.id,
      customerName: selectedOrder.customer.name,
      reason,
      status: "Requested",
      amount: returnAmount,
      refundMethod,
      date: new Date().toISOString().slice(0, 10),
      items: selectedItems,
    };

    setReturns(prev => [newReturn, ...prev]);
    setSelectedOrderId("");
    setSelectedItems([]);
    setReason("Defective");
    setRefundMethod("Original Payment");
    setDialogOpen(false);
    toast.success("Return request created");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Returns & Refunds</h1>
            <p className="text-muted-foreground">Process returns, refunds, and exchanges</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Create Return</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create Return Request</DialogTitle></DialogHeader>
              <div className="space-y-5 py-4">
                {/* Order Selection */}
                <div>
                  <Label>Select Order</Label>
                  <Select value={selectedOrderId} onValueChange={v => { setSelectedOrderId(v); setSelectedItems([]); }}>
                    <SelectTrigger><SelectValue placeholder="Choose an order..." /></SelectTrigger>
                    <SelectContent>
                      {orders.map(o => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.id} â€” {o.customer.name} â€” à§³{o.total.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Items Checkbox */}
                {selectedOrder && (
                  <div>
                    <Label className="mb-2 block">Select Items to Return</Label>
                    <div className="space-y-2 rounded-lg border p-3">
                      {selectedOrder.items.map(item => (
                        <label key={item.product.id} className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={selectedItems.includes(item.product.name)}
                            onCheckedChange={() => toggleItem(item.product.name)}
                          />
                          <span className="text-sm">{item.product.name} x{item.quantity} â€” à§³{(item.product.price * item.quantity).toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <Label>Reason</Label>
                  <Select value={reason} onValueChange={v => setReason(v as ReturnReason)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Defective">Defective</SelectItem>
                      <SelectItem value="Wrong Item">Wrong Item</SelectItem>
                      <SelectItem value="Not as Described">Not as Described</SelectItem>
                      <SelectItem value="Changed Mind">Changed Mind</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Refund Method */}
                <div>
                  <Label>Refund Method</Label>
                  <Select value={refundMethod} onValueChange={v => setRefundMethod(v as typeof refundMethod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Original Payment">Original Payment</SelectItem>
                      <SelectItem value="Store Credit">Store Credit</SelectItem>
                      <SelectItem value="Exchange">Exchange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleCreateReturn}>Submit Return Request</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-primary/10 p-3"><RotateCcw className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Open Returns</p><p className="text-2xl font-bold">{stats.open}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-destructive/10 p-3"><DollarSign className="h-5 w-5 text-destructive" /></div><div><p className="text-sm text-muted-foreground">Refunded (MTD)</p><p className="text-2xl font-bold">à§³{stats.refunded.toFixed(2)}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-accent p-3"><Percent className="h-5 w-5 text-accent-foreground" /></div><div><p className="text-sm text-muted-foreground">Return Rate</p><p className="text-2xl font-bold">{stats.rate}%</p></div></CardContent></Card>
        </div>

        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Requested">Requested</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Refunded">Refunded</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Return #</TableHead><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Reason</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.orderId}</TableCell>
                    <TableCell>{r.customerName}</TableCell>
                    <TableCell>{r.items.join(", ")}</TableCell>
                    <TableCell><Badge variant="outline">{r.reason}</Badge></TableCell>
                    <TableCell>à§³{r.amount.toFixed(2)}</TableCell>
                    <TableCell>{r.refundMethod}</TableCell>
                    <TableCell><Badge variant={statusColors[r.status]}>{r.status}</Badge></TableCell>
                    <TableCell className="space-x-1">
                      {r.status === "Requested" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "Approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, "Rejected")}>Reject</Button>
                        </>
                      )}
                      {r.status === "Approved" && <Button size="sm" onClick={() => updateStatus(r.id, "Refunded")}>Refund</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Returns;

