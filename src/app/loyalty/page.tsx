"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Gift, Crown, Ticket, Percent, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getLoyaltyCustomers, getCoupons, subscribeCustomers, subscribeCoupons,
  addCoupon, updateCoupon, deleteCoupon, type Coupon,
} from "@/data/loyalty";
import { toast } from "@/hooks/use-toast";

function useLoyaltyCustomers() { return useSyncExternalStore(subscribeCustomers, getLoyaltyCustomers, getLoyaltyCustomers); }
function useCoupons() { return useSyncExternalStore(subscribeCoupons, getCoupons, getCoupons); }

const tierColors: Record<string, string> = {
  Bronze: "bg-orange-500/10 text-orange-600",
  Silver: "bg-gray-400/10 text-gray-500",
  Gold: "bg-amber-500/10 text-amber-600",
  Platinum: "bg-violet-500/10 text-violet-600",
};

const couponStatusColors: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Expired: "bg-destructive/10 text-destructive",
  Disabled: "bg-muted text-muted-foreground",
};

const Loyalty = () => {
  const customers = useLoyaltyCustomers();
  const coupons = useCoupons();
  const [search, setSearch] = useState("");
  const [addCouponOpen, setAddCouponOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: "", type: "percentage" as "percentage" | "fixed", value: "", minOrder: "", maxUses: "", expiresAt: "" });

  const totalPoints = useMemo(() => customers.reduce((s, c) => s + c.points, 0), [customers]);
  const activeCoupons = useMemo(() => coupons.filter(c => c.status === "Active").length, [coupons]);

  const filteredCustomers = useMemo(() =>
    customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)),
    [customers, search]
  );

  const handleAddCoupon = () => {
    const { code, type, value, minOrder, maxUses, expiresAt } = couponForm;
    if (!code.trim()) { toast({ title: "Code required", variant: "destructive" }); return; }
    addCoupon({
      id: `c${Date.now()}`, code: code.toUpperCase(), type, value: parseFloat(value) || 0,
      minOrder: parseFloat(minOrder) || 0, maxUses: parseInt(maxUses) || 100,
      usedCount: 0, expiresAt: expiresAt || "2026-12-31", status: "Active",
    });
    setAddCouponOpen(false);
    setCouponForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "" });
    toast({ title: "Coupon created!" });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: code });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Loyalty & Coupons</h1>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Loyalty Members", value: customers.length, icon: <Crown className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600" },
          { label: "Total Points", value: totalPoints.toLocaleString(), icon: <Gift className="h-5 w-5" />, color: "bg-primary/10 text-primary" },
          { label: "Active Coupons", value: activeCoupons, icon: <Ticket className="h-5 w-5" />, color: "bg-success/10 text-success" },
          { label: "Total Coupons", value: coupons.length, icon: <Percent className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-5">
              <div className={cn("rounded-lg p-2.5", s.color)}>{s.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-card-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Loyalty Members</TabsTrigger>
          <TabsTrigger value="coupons">Coupons & Discounts</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Customer", "Phone", "Points", "Tier", "Total Spent", "Joined"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-card-foreground">{c.name}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{c.phone}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-card-foreground">{c.points.toLocaleString()}</td>
                      <td className="px-5 py-4"><Badge className={cn("text-xs", tierColors[c.tier])}>{c.tier}</Badge></td>
                      <td className="px-5 py-4 text-sm text-card-foreground">à§³{c.totalSpent.toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{c.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="coupons" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Button className="gap-1.5" onClick={() => setAddCouponOpen(true)}><Plus className="h-4 w-4" /> New Coupon</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map(c => (
              <Card key={c.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-sm font-bold text-card-foreground">{c.code}</code>
                      <button onClick={() => copyCode(c.code)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                    </div>
                    <Badge className={cn("text-xs", couponStatusColors[c.status])}>{c.status}</Badge>
                  </div>
                  <p className="text-sm text-card-foreground mb-1">
                    {c.type === "percentage" ? `${c.value}% off` : `à§³${c.value} off`} â€” Min order: à§³{c.minOrder.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Used: {c.usedCount}/{c.maxUses} â€¢ Expires: {c.expiresAt}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { updateCoupon(c.id, { status: c.status === "Active" ? "Disabled" : "Active" }); toast({ title: "Coupon updated" }); }}>
                      {c.status === "Active" ? "Disable" : "Enable"}
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => { deleteCoupon(c.id); toast({ title: "Coupon deleted" }); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Coupon Dialog */}
      <Dialog open={addCouponOpen} onOpenChange={setAddCouponOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Code *</Label><Input value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. SUMMER20" className="font-mono uppercase" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select value={couponForm.type} onValueChange={v => setCouponForm(f => ({ ...f, type: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Value</Label><Input type="number" value={couponForm.value} onChange={e => setCouponForm(f => ({ ...f, value: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Min Order (à§³)</Label><Input type="number" value={couponForm.minOrder} onChange={e => setCouponForm(f => ({ ...f, minOrder: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Max Uses</Label><Input type="number" value={couponForm.maxUses} onChange={e => setCouponForm(f => ({ ...f, maxUses: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Expires</Label><Input type="date" value={couponForm.expiresAt} onChange={e => setCouponForm(f => ({ ...f, expiresAt: e.target.value }))} /></div>
            <Button className="w-full" onClick={handleAddCoupon}>Create Coupon</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Loyalty;

