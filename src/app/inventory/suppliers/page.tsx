"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier, type Supplier } from "@/data/suppliers";
import { useSyncExternalStore } from "react";
import { subscribe } from "@/data/suppliers";
import { getPurchaseOrders, subscribe as subscribePO } from "@/data/purchaseOrders";
import { currencies } from "@/data/currencies";
import { useCurrency } from "@/hooks/useCurrency";
import { Search, Plus, Star, Truck, Users, DollarSign, Clock, Trash2, Globe, FileText, Building, Pencil, Download, ClipboardList, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

function usePurchaseOrders() {
  return useSyncExternalStore(subscribePO, getPurchaseOrders, getPurchaseOrders);
}

function useSuppliers() {
  return useSyncExternalStore(subscribe, getSuppliers, getSuppliers);
}

const Suppliers = () => {
  const router = useRouter();
  const suppliers = useSuppliers();
  const purchaseOrders = usePurchaseOrders();
  const { formatShort } = useCurrency();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const emptyForm = {
    name: "", email: "", phone: "", address: "", city: "", country: "Saudi Arabia",
    paymentTerms: "Net 30", taxId: "", tradeLicense: "", currency: "SAR", website: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return suppliers.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || (s.taxId || "").includes(search);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [suppliers, search, statusFilter]);

  const stats = useMemo(() => ({
    total: suppliers.length,
    active: suppliers.filter(s => s.status === "Active").length,
    totalSpend: suppliers.reduce((sum, s) => sum + s.totalSpend, 0),
    avgLead: Math.round(suppliers.reduce((sum, s) => sum + s.leadTimeDays, 0) / suppliers.length),
    countries: new Set(suppliers.map(s => s.country)).size,
  }), [suppliers]);

  const handleAdd = () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    addSupplier({
      id: `s${Date.now()}`, ...form, rating: 0, lastOrderDate: "-", totalOrders: 0, totalSpend: 0, leadTimeDays: 0, status: "Active",
    });
    setForm(emptyForm);
    setDialogOpen(false);
    toast.success("Supplier added");
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setEditForm({
      name: supplier.name, email: supplier.email, phone: supplier.phone,
      address: supplier.address, city: supplier.city, country: supplier.country,
      paymentTerms: supplier.paymentTerms, taxId: supplier.taxId || "",
      tradeLicense: supplier.tradeLicense || "", currency: supplier.currency || "SAR",
      website: supplier.website || "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingSupplier) return;
    if (!editForm.name || !editForm.email) { toast.error("Name and email required"); return; }
    updateSupplier(editingSupplier.id, {
      name: editForm.name, email: editForm.email, phone: editForm.phone,
      address: editForm.address, city: editForm.city, country: editForm.country,
      paymentTerms: editForm.paymentTerms, taxId: editForm.taxId || undefined,
      tradeLicense: editForm.tradeLicense || undefined, currency: editForm.currency,
      website: editForm.website || undefined, status: editingSupplier.status,
    });
    setEditDialogOpen(false);
    setEditingSupplier(null);
    toast.success("Supplier updated");
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "City", "Country", "Tax ID", "Trade License", "Currency", "Payment Terms", "Rating", "Total Orders", "Total Spend", "Lead Time (days)", "Status", "Website"];
    const rows = filtered.map(s => [
      s.name, s.email, s.phone, s.city, s.country, s.taxId || "", s.tradeLicense || "",
      s.currency || "SAR", s.paymentTerms, s.rating, s.totalOrders, s.totalSpend,
      s.leadTimeDays, s.status, s.website || "",
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suppliers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Supplier Management</h1>
            <p className="text-muted-foreground">International supplier directory with tax & compliance data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Add Supplier</Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add New Supplier</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Company Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="TechParts Ltd." /></div>
                  <div><Label>Email *</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@company.com" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+966 5xx xxx xxxx" /></div>
                  <div><Label>Website</Label><Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://company.com" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>City</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
                  <div><Label>Country</Label><Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
                  <div>
                    <Label>Currency</Label>
                    <Select value={form.currency} onValueChange={v => setForm(f => ({ ...f, currency: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} â€” {c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Tax & Compliance</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Tax ID / VAT Number</Label><Input value={form.taxId} onChange={e => setForm(f => ({ ...f, taxId: e.target.value }))} placeholder="e.g. 300012345600003" /></div>
                  <div><Label>Trade License / CR Number</Label><Input value={form.tradeLicense} onChange={e => setForm(f => ({ ...f, tradeLicense: e.target.value }))} placeholder="e.g. CR-1234567890" /></div>
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select value={form.paymentTerms} onValueChange={v => setForm(f => ({ ...f, paymentTerms: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Advance">Advance Payment</SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="Net 90">Net 90</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="Letter of Credit">Letter of Credit (L/C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd}>Save Supplier</Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-primary/10 p-3"><Users className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Suppliers</p><p className="text-2xl font-bold">{stats.total}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-green-500/10 p-3"><Truck className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold">{stats.active}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-blue-500/10 p-3"><DollarSign className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-muted-foreground">Total Spend</p><p className="text-2xl font-bold">{formatShort(stats.totalSpend)}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-amber-500/10 p-3"><Clock className="h-5 w-5 text-amber-600" /></div><div><p className="text-sm text-muted-foreground">Avg Lead Time</p><p className="text-2xl font-bold">{stats.avgLead} days</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-violet-500/10 p-3"><Globe className="h-5 w-5 text-violet-600" /></div><div><p className="text-sm text-muted-foreground">Countries</p><p className="text-2xl font-bold">{stats.countries}</p></div></CardContent></Card>
        </div>

        {/* Performance Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Monthly PO Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Monthly PO Trend by Supplier</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={(() => {
                  const months = ["Oct", "Nov", "Dec", "Jan", "Feb"];
                  const monthKeys = ["2024-10", "2024-11", "2024-12", "2026-01", "2026-02"];
                  const activeSuppliers = suppliers.filter(s => s.status === "Active").slice(0, 4);
                  return months.map((m, mi) => {
                    const row: Record<string, string | number> = { month: m };
                    activeSuppliers.forEach(sup => {
                      row[sup.name] = purchaseOrders.filter(po => po.createdDate.startsWith(monthKeys[mi]) && po.supplierId === sup.id).length;
                    });
                    return row;
                  });
                })()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {suppliers.filter(s => s.status === "Active").slice(0, 4).map((sup, i) => (
                    <Bar key={sup.id} dataKey={sup.name} fill={["hsl(var(--primary))", "hsl(217 91% 60%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)"][i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lead Time & Orders Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Lead Time & Orders Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={suppliers.map(s => ({
                  name: s.name.split(" ").slice(0, 2).join(" "),
                  leadTime: s.leadTimeDays,
                  orders: s.totalOrders,
                }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="leadTime" name="Lead Time (days)" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="orders" name="Total Orders" fill="hsl(142 71% 45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spend Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Spend Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...suppliers].sort((a, b) => b.totalSpend - a.totalSpend).map(s => ({
                  name: s.name.split(" ").slice(0, 2).join(" "),
                  spend: s.totalSpend,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatShort(v)} />
                  <Bar dataKey="spend" name="Total Spend" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rating Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Supplier Rating Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...suppliers].sort((a, b) => b.rating - a.rating).map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-28 truncate text-card-foreground">{s.name.split(" ").slice(0, 2).join(" ")}</span>
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(s.rating / 5) * 100}%`,
                          backgroundColor: s.rating >= 4.5 ? "hsl(142 71% 45%)" : s.rating >= 4 ? "hsl(217 91% 60%)" : s.rating >= 3.5 ? "hsl(38 92% 50%)" : "hsl(var(--destructive))",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 w-12">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">{s.rating}</span>
                    </div>
                    <Badge variant={s.status === "Active" ? "default" : "secondary"} className="text-[10px]">{s.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by name, email, or Tax ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tax ID / VAT</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Total Spend</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map(s => {
                  const supplierPOs = purchaseOrders.filter(po => po.supplierId === s.id);
                  const isExpanded = expandedRows.has(s.id);
                  return (
                    <>
                      <TableRow key={s.id} className="cursor-pointer hover:bg-muted/40" onClick={() => supplierPOs.length > 0 && toggleExpand(s.id)}>
                        <TableCell className="w-8 px-2">
                          {supplierPOs.length > 0 ? (
                            isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          ) : <span className="h-4 w-4" />}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.city}, {s.country}</p>
                            {s.tradeLicense && <p className="text-[10px] text-muted-foreground">CR: {s.tradeLicense}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{s.email}</p>
                            <p className="text-xs text-muted-foreground">{s.phone}</p>
                            {s.website && <a href={s.website} target="_blank" rel="noopener" className="text-[10px] text-primary hover:underline" onClick={e => e.stopPropagation()}>{s.website}</a>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {s.taxId ? (
                            <div><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{s.taxId}</code></div>
                          ) : <span className="text-xs text-muted-foreground">â€”</span>}
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{s.currency || "SAR"}</Badge></TableCell>
                        <TableCell><div className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span>{s.rating}</span></div></TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{s.paymentTerms}</Badge></TableCell>
                        <TableCell className="font-semibold tabular-nums">{formatShort(s.totalSpend)}</TableCell>
                        <TableCell><Badge variant={s.status === "Active" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(s)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                            {s.status === "Active" && (
                              <Button variant="ghost" size="icon" title="Create PO" onClick={() => router.push("/inventory/purchase-orders", { state: { supplierId: s.id } })}>
                                <ClipboardList className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => { deleteSupplier(s.id); toast.success("Deleted"); }} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${s.id}-pos`} className="bg-muted/20 hover:bg-muted/30">
                          <TableCell colSpan={10} className="p-0">
                            <div className="px-6 py-3 space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Purchase Order History ({supplierPOs.length})</p>
                              <Table>
                                <TableHeader>
                                  <TableRow className="text-xs">
                                    <TableHead className="py-1.5">PO #</TableHead>
                                    <TableHead className="py-1.5">Items</TableHead>
                                    <TableHead className="py-1.5">Total</TableHead>
                                    <TableHead className="py-1.5">Created</TableHead>
                                    <TableHead className="py-1.5">Expected</TableHead>
                                    <TableHead className="py-1.5">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {supplierPOs.map(po => (
                                    <TableRow key={po.id} className="text-xs">
                                      <TableCell className="py-1.5 font-medium">{po.id}</TableCell>
                                      <TableCell className="py-1.5">{po.items.map(i => `${i.productName} Ã—${i.quantity}`).join(", ")}</TableCell>
                                      <TableCell className="py-1.5 font-semibold tabular-nums">{formatShort(po.total)}</TableCell>
                                      <TableCell className="py-1.5 text-muted-foreground">{po.createdDate}</TableCell>
                                      <TableCell className="py-1.5 text-muted-foreground">{po.expectedDate}</TableCell>
                                      <TableCell className="py-1.5">
                                        <Badge variant={po.status === "Received" ? "outline" : po.status === "Cancelled" ? "destructive" : "default"} className="text-[10px]">{po.status}</Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Supplier Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Supplier</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Company Name *</Label><Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><Label>Email *</Label><Input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Phone</Label><Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div><Label>Website</Label><Input value={editForm.website} onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>City</Label><Input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} /></div>
                <div><Label>Country</Label><Input value={editForm.country} onChange={e => setEditForm(f => ({ ...f, country: e.target.value }))} /></div>
                <div>
                  <Label>Currency</Label>
                  <Select value={editForm.currency} onValueChange={v => setEditForm(f => ({ ...f, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} â€” {c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Address</Label><Input value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} /></div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Tax & Compliance</p>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Tax ID / VAT Number</Label><Input value={editForm.taxId} onChange={e => setEditForm(f => ({ ...f, taxId: e.target.value }))} /></div>
                <div><Label>Trade License / CR Number</Label><Input value={editForm.tradeLicense} onChange={e => setEditForm(f => ({ ...f, tradeLicense: e.target.value }))} /></div>
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Select value={editForm.paymentTerms} onValueChange={v => setEditForm(f => ({ ...f, paymentTerms: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advance">Advance Payment</SelectItem>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Net 90">Net 90</SelectItem>
                    <SelectItem value="COD">Cash on Delivery</SelectItem>
                    <SelectItem value="Letter of Credit">Letter of Credit (L/C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingSupplier && (
                <div>
                  <Label>Status</Label>
                  <Select value={editingSupplier.status} onValueChange={v => setEditingSupplier(s => s ? { ...s, status: v as "Active" | "Inactive" } : null)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={handleUpdate}>Update Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Suppliers;

