"use client";

import { useMemo, useSyncExternalStore } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, DollarSign, Package, Plus, MapPin, Phone } from "lucide-react";
import { getBranches, subscribeBranches, addBranch, updateBranch, type Branch } from "@/data/branches";
import { useState } from "react";

const Branches = () => {
  const branches = useSyncExternalStore(subscribeBranches, getBranches, getBranches);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return branches;
    return branches.filter((b) => b.status === filter);
  }, [branches, filter]);

  const stats = useMemo(() => ({
    total: branches.length,
    active: branches.filter((b) => b.status === "active").length,
    totalRevenue: branches.filter((b) => b.status === "active").reduce((s, b) => s + b.monthlyRevenue, 0),
    totalStaff: branches.reduce((s, b) => s + b.totalStaff, 0),
  }), [branches]);

  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "", manager: "" });

  const handleAdd = () => {
    addBranch({ ...form, status: "active", totalStaff: 0, monthlyRevenue: 0, stockValue: 0, createdAt: new Date().toISOString().slice(0, 10) });
    setForm({ name: "", address: "", city: "", phone: "", manager: "" });
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Branch Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your stores and branches</p>
          </div>
          <Button className="rounded-xl shadow-sm" onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Branch</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Branches", value: stats.total, icon: <Building2 className="h-5 w-5" />, gradient: "from-primary/15 to-primary/5", color: "text-primary" },
            { label: "Active", value: stats.active, icon: <Building2 className="h-5 w-5" />, gradient: "from-[hsl(160,84%,39%)]/15 to-[hsl(160,84%,39%)]/5", color: "text-success" },
            { label: "Monthly Revenue", value: `à§³${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, gradient: "from-[hsl(231,74%,56%)]/15 to-[hsl(231,74%,56%)]/5", color: "text-primary" },
            { label: "Total Staff", value: stats.totalStaff, icon: <Users className="h-5 w-5" />, gradient: "from-[hsl(280,68%,60%)]/15 to-[hsl(280,68%,60%)]/5", color: "text-[hsl(280,68%,60%)]" },
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

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Branches</CardTitle>
            <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Revenue/mo</TableHead>
                  <TableHead>Stock Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{b.address}</div>
                    </TableCell>
                    <TableCell>{b.city}</TableCell>
                    <TableCell>{b.manager}</TableCell>
                    <TableCell>{b.totalStaff}</TableCell>
                    <TableCell>à§³{b.monthlyRevenue.toLocaleString()}</TableCell>
                    <TableCell>à§³{b.stockValue.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={b.status === "active" ? "default" : "secondary"}>{b.status}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => updateBranch(b.id, { status: b.status === "active" ? "inactive" : "active" })}>
                        {b.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Branch</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Branch Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Manager Name" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
            </div>
            <DialogFooter><Button onClick={handleAdd}>Add Branch</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Branches;

