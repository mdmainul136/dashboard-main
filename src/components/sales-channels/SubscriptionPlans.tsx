import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, DollarSign, TrendingDown, BarChart3, Plus, Pause, Play, XCircle, RefreshCw } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  cycle: "monthly" | "yearly";
  subscribers: number;
  status: "active" | "paused" | "cancelled";
  trialDays: number;
  platform: "shopify" | "salla";
  mrr: number;
}

const mockPlans: SubscriptionPlan[] = [
  { id: "sub1", name: "Premium Coffee Box", price: 29.99, cycle: "monthly", subscribers: 145, status: "active", trialDays: 7, platform: "shopify", mrr: 4348.55 },
  { id: "sub2", name: "Snack Pack Weekly", price: 19.99, cycle: "monthly", subscribers: 89, status: "active", trialDays: 0, platform: "shopify", mrr: 1779.11 },
  { id: "sub3", name: "Beauty Essentials", price: 49.99, cycle: "monthly", subscribers: 62, status: "active", trialDays: 14, platform: "salla", mrr: 3099.38 },
  { id: "sub4", name: "Yearly Wellness Kit", price: 299.99, cycle: "yearly", subscribers: 34, status: "active", trialDays: 30, platform: "salla", mrr: 849.97 },
  { id: "sub5", name: "Tech Gadget Monthly", price: 39.99, cycle: "monthly", subscribers: 0, status: "paused", trialDays: 7, platform: "shopify", mrr: 0 },
];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: "", price: "", cycle: "monthly" as "monthly" | "yearly", trialDays: "" });

  const totalSubscribers = plans.filter(p => p.status === "active").reduce((s, p) => s + p.subscribers, 0);
  const totalMRR = plans.reduce((s, p) => s + p.mrr, 0);
  const churnRate = 3.2;
  const avgValue = totalSubscribers > 0 ? totalMRR / totalSubscribers : 0;

  const toggleStatus = (id: string, action: "pause" | "resume" | "cancel") => {
    setPlans(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (action === "pause") return { ...p, status: "paused" as const, mrr: 0 };
      if (action === "resume") return { ...p, status: "active" as const, mrr: p.price * p.subscribers };
      return { ...p, status: "cancelled" as const, subscribers: 0, mrr: 0 };
    }));
  };

  const handleCreate = () => {
    if (!newPlan.name || !newPlan.price) return;
    const plan: SubscriptionPlan = {
      id: `sub${Date.now()}`,
      name: newPlan.name,
      price: parseFloat(newPlan.price),
      cycle: newPlan.cycle,
      subscribers: 0,
      status: "active",
      trialDays: parseInt(newPlan.trialDays) || 0,
      platform: "shopify",
      mrr: 0,
    };
    setPlans(prev => [...prev, plan]);
    setNewPlan({ name: "", price: "", cycle: "monthly", trialDays: "" });
    setDialogOpen(false);
  };

  const statusBadge = (s: string) => {
    if (s === "active") return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    if (s === "paused") return <Badge className="bg-warning/10 text-warning border-warning/20">Paused</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>;
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active Subscribers</p><p className="text-2xl font-bold text-foreground">{totalSubscribers}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p><p className="text-2xl font-bold text-foreground">${totalMRR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><DollarSign className="h-5 w-5 text-success" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Churn Rate</p><p className="text-2xl font-bold text-foreground">{churnRate}%</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><TrendingDown className="h-5 w-5 text-destructive" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Avg Subscription Value</p><p className="text-2xl font-bold text-foreground">${avgValue.toFixed(2)}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><BarChart3 className="h-5 w-5 text-violet-500" /></div></div></CardContent></Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{plans.length} subscription plans</p>
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> Create Plan</Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Plan Name</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Cycle</th>
                <th className="p-4 font-medium">Subscribers</th>
                <th className="p-4 font-medium">MRR</th>
                <th className="p-4 font-medium">Trial</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 font-mono text-foreground">${p.price}</td>
                  <td className="p-4 text-foreground capitalize">{p.cycle}</td>
                  <td className="p-4 font-mono text-foreground">{p.subscribers}</td>
                  <td className="p-4 font-mono text-foreground">${p.mrr.toFixed(0)}</td>
                  <td className="p-4 text-muted-foreground">{p.trialDays > 0 ? `${p.trialDays} days` : "—"}</td>
                  <td className="p-4"><Badge variant="outline" className={p.platform === "shopify" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-violet-500/10 text-violet-600 border-violet-500/30"}>{p.platform === "shopify" ? "Shopify" : "Salla"}</Badge></td>
                  <td className="p-4">{statusBadge(p.status)}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {p.status === "active" && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleStatus(p.id, "pause")}><Pause className="h-3.5 w-3.5" /></Button>}
                      {p.status === "paused" && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleStatus(p.id, "resume")}><Play className="h-3.5 w-3.5" /></Button>}
                      {p.status !== "cancelled" && <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => toggleStatus(p.id, "cancel")}><XCircle className="h-3.5 w-3.5" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subscription Plan</DialogTitle>
            <DialogDescription>Add a new recurring subscription product</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Plan Name</Label><Input value={newPlan.name} onChange={e => setNewPlan(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Monthly Coffee Box" /></div>
            <div><Label>Price ($)</Label><Input type="number" value={newPlan.price} onChange={e => setNewPlan(p => ({ ...p, price: e.target.value }))} placeholder="29.99" /></div>
            <div><Label>Billing Cycle</Label>
              <Select value={newPlan.cycle} onValueChange={(v: "monthly" | "yearly") => setNewPlan(p => ({ ...p, cycle: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="yearly">Yearly</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Trial Days</Label><Input type="number" value={newPlan.trialDays} onChange={e => setNewPlan(p => ({ ...p, trialDays: e.target.value }))} placeholder="0" /></div>
          </div>
          <DialogFooter><Button onClick={handleCreate}>Create Plan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
