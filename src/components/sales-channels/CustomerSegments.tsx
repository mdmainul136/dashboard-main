import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users, Crown, UserPlus, AlertTriangle, Heart, Search, GitMerge, Eye,
  ShoppingBag, DollarSign, TrendingUp, X
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  platform: "shopify" | "salla" | "both";
  segment: "vip" | "new" | "at_risk" | "loyal";
  lastOrder: string;
  joinedAt: string;
  orders: { id: string; date: string; total: number; status: string }[];
}

const mockCustomers: Customer[] = [
  { id: "cu1", name: "Ahmed Ali", email: "ahmed@email.com", phone: "+966501234567", totalOrders: 24, totalSpent: 3420, platform: "both", segment: "vip", lastOrder: "2026-02-19", joinedAt: "2025-03-12",
    orders: [{ id: "#1042", date: "2026-02-19", total: 129.99, status: "Fulfilled" }, { id: "#1038", date: "2026-02-14", total: 89.50, status: "Fulfilled" }] },
  { id: "cu2", name: "Sara Khan", email: "sara@email.com", phone: "+966509876543", totalOrders: 2, totalSpent: 189, platform: "salla", segment: "new", lastOrder: "2026-02-18", joinedAt: "2026-02-01",
    orders: [{ id: "#SA-2085", date: "2026-02-18", total: 89.50, status: "Pending" }] },
  { id: "cu3", name: "Omar Hassan", email: "omar@email.com", phone: "+966551234567", totalOrders: 8, totalSpent: 1250, platform: "shopify", segment: "loyal", lastOrder: "2026-02-17", joinedAt: "2025-06-20",
    orders: [{ id: "#SH-1041", date: "2026-02-17", total: 249.00, status: "Fulfilled" }] },
  { id: "cu4", name: "Fatima Noor", email: "fatima@email.com", phone: "+966507654321", totalOrders: 5, totalSpent: 430, platform: "salla", segment: "at_risk", lastOrder: "2025-12-10", joinedAt: "2025-04-15",
    orders: [{ id: "#SA-1920", date: "2025-12-10", total: 54.99, status: "Fulfilled" }] },
  { id: "cu5", name: "Khalid Raza", email: "khalid@email.com", phone: "+966559876543", totalOrders: 15, totalSpent: 2100, platform: "both", segment: "vip", lastOrder: "2026-02-16", joinedAt: "2025-01-05",
    orders: [{ id: "#SH-1040", date: "2026-02-16", total: 199.99, status: "Fulfilled" }] },
  { id: "cu6", name: "Layla Mahmoud", email: "layla@email.com", phone: "+966501239876", totalOrders: 3, totalSpent: 275, platform: "shopify", segment: "new", lastOrder: "2026-02-15", joinedAt: "2026-01-20",
    orders: [{ id: "#SH-1035", date: "2026-02-15", total: 75.00, status: "Fulfilled" }] },
];

const platformColor = (p: string) => {
  if (p === "shopify") return "bg-emerald-500/10 text-emerald-600";
  if (p === "salla") return "bg-violet-500/10 text-violet-600";
  return "bg-primary/10 text-primary";
};

const segmentConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  vip: { icon: <Crown className="h-3 w-3" />, color: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "VIP" },
  new: { icon: <UserPlus className="h-3 w-3" />, color: "bg-primary/10 text-primary border-primary/20", label: "New" },
  at_risk: { icon: <AlertTriangle className="h-3 w-3" />, color: "bg-destructive/10 text-destructive border-destructive/20", label: "At Risk" },
  loyal: { icon: <Heart className="h-3 w-3" />, color: "bg-success/10 text-success border-success/20", label: "Loyal" },
};

const CustomerSegments = () => {
  const [customers] = useState(mockCustomers);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchSegment = segmentFilter === "all" || c.segment === segmentFilter;
    return matchSearch && matchSegment;
  });

  const totalCustomers = customers.length;
  const repeatRate = Math.round((customers.filter(c => c.totalOrders > 1).length / totalCustomers) * 100);
  const avgOrderValue = Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.reduce((s, c) => s + c.totalOrders, 0));

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Customers</p><p className="text-2xl font-bold text-foreground">{totalCustomers}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Repeat Rate</p><p className="text-2xl font-bold text-foreground">{repeatRate}%</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Avg. Order Value</p><p className="text-2xl font-bold text-foreground">${avgOrderValue}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><DollarSign className="h-5 w-5 text-warning" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Cross-Channel</p><p className="text-2xl font-bold text-foreground">{customers.filter(c => c.platform === "both").length}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><GitMerge className="h-5 w-5 text-violet-500" /></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "vip", "new", "loyal", "at_risk"].map(seg => (
            <Button key={seg} size="sm" variant={segmentFilter === seg ? "default" : "outline"}
              onClick={() => setSegmentFilter(seg)} className="text-xs capitalize">
              {seg === "all" ? "All" : segmentConfig[seg]?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Segment</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Last Order</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const seg = segmentConfig[c.segment];
                return (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="p-4"><Badge className={`${seg.color} gap-1`}>{seg.icon} {seg.label}</Badge></td>
                    <td className="p-4 font-mono text-foreground">{c.totalOrders}</td>
                    <td className="p-4 font-mono text-foreground">${c.totalSpent.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={`${platformColor(c.platform)} text-xs`}>
                        {c.platform === "both" ? "Both" : c.platform === "shopify" ? "Shopify" : "Salla"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{c.lastOrder}</td>
                    <td className="p-4">
                      <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => setSelectedCustomer(c)}>
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">{selectedCustomer.name}</DialogTitle>
                <DialogDescription>{selectedCustomer.email} · {selectedCustomer.phone}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-lg font-bold text-foreground">{selectedCustomer.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-lg font-bold text-foreground">${selectedCustomer.totalSpent}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <Badge className={`${segmentConfig[selectedCustomer.segment].color} gap-1`}>
                      {segmentConfig[selectedCustomer.segment].icon} {segmentConfig[selectedCustomer.segment].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Recent Orders</p>
                  <div className="space-y-2">
                    {selectedCustomer.orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{o.id}</p>
                          <p className="text-xs text-muted-foreground">{o.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-foreground">${o.total.toFixed(2)}</p>
                          <p className="text-xs text-success">{o.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedCustomer.platform === "both" && (
                  <Card className="border-primary/20">
                    <CardContent className="p-3 flex items-center gap-2">
                      <GitMerge className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">This customer exists on both Shopify & Salla</span>
                      <Button size="sm" variant="outline" className="ml-auto text-xs">Merge</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerSegments;
