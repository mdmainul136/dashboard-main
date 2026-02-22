import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart, Mail, Clock, DollarSign, TrendingUp, Send, CheckCircle2, AlertCircle, Search
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AbandonedCart {
  id: string;
  customer: string;
  email: string;
  products: string[];
  total: number;
  platform: "shopify" | "salla";
  channel: string;
  abandonedAt: string;
  status: "pending" | "reminded" | "recovered" | "lost";
  reminders: number;
}

const mockCarts: AbandonedCart[] = [
  { id: "ac1", customer: "Ahmed Ali", email: "ahmed@email.com", products: ["Wireless Mouse", "USB-C Hub"], total: 89.99, platform: "shopify", channel: "My Shopify Store", abandonedAt: "2026-02-19 14:30", status: "pending", reminders: 0 },
  { id: "ac2", customer: "Sara Khan", email: "sara@email.com", products: ["Mechanical Keyboard"], total: 149.99, platform: "salla", channel: "Salla متجري", abandonedAt: "2026-02-19 12:15", status: "reminded", reminders: 1 },
  { id: "ac3", customer: "Omar Hassan", email: "omar@email.com", products: ["Webcam HD", "Headphones", "Desk Lamp"], total: 234.50, platform: "shopify", channel: "My Shopify Store", abandonedAt: "2026-02-18 22:40", status: "recovered", reminders: 2 },
  { id: "ac4", customer: "Fatima Noor", email: "fatima@email.com", products: ["Gaming Chair"], total: 399.00, platform: "salla", channel: "Salla متجري", abandonedAt: "2026-02-18 18:00", status: "lost", reminders: 3 },
  { id: "ac5", customer: "Khalid Raza", email: "khalid@email.com", products: ["Monitor Stand"], total: 59.99, platform: "shopify", channel: "My Shopify Store", abandonedAt: "2026-02-19 09:10", status: "pending", reminders: 0 },
  { id: "ac6", customer: "Layla Mahmoud", email: "layla@email.com", products: ["Wireless Charger", "Phone Case"], total: 45.00, platform: "salla", channel: "Salla متجري", abandonedAt: "2026-02-17 16:25", status: "reminded", reminders: 2 },
];

const platformColor = (p: "shopify" | "salla") => p === "shopify" ? "bg-emerald-500/10 text-emerald-600" : "bg-violet-500/10 text-violet-600";
const platformBorder = (p: "shopify" | "salla") => p === "shopify" ? "border-emerald-500/30" : "border-violet-500/30";

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: "bg-warning/10 text-warning border-warning/20", icon: <Clock className="h-3 w-3" />, label: "Pending" },
  reminded: { color: "bg-primary/10 text-primary border-primary/20", icon: <Mail className="h-3 w-3" />, label: "Reminded" },
  recovered: { color: "bg-success/10 text-success border-success/20", icon: <CheckCircle2 className="h-3 w-3" />, label: "Recovered" },
  lost: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: <AlertCircle className="h-3 w-3" />, label: "Lost" },
};

const AbandonedCarts = () => {
  const [carts, setCarts] = useState(mockCarts);
  const [autoRecovery, setAutoRecovery] = useState(true);
  const [reminderDelay, setReminderDelay] = useState("1");
  const [search, setSearch] = useState("");

  const filtered = carts.filter(c => 
    c.customer.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const recoveredRevenue = carts.filter(c => c.status === "recovered").reduce((s, c) => s + c.total, 0);
  const lostRevenue = carts.filter(c => c.status === "lost").reduce((s, c) => s + c.total, 0);
  const pendingRevenue = carts.filter(c => c.status === "pending" || c.status === "reminded").reduce((s, c) => s + c.total, 0);
  const recoveryRate = carts.length > 0 ? Math.round((carts.filter(c => c.status === "recovered").length / carts.length) * 100) : 0;

  const shopifyCarts = carts.filter(c => c.platform === "shopify").length;
  const sallaCarts = carts.filter(c => c.platform === "salla").length;

  const sendReminder = (id: string) => {
    setCarts(prev => prev.map(c => c.id === id ? { ...c, status: "reminded" as const, reminders: c.reminders + 1 } : c));
    toast({ title: "Reminder Sent!", description: "Recovery email has been sent to customer" });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recovery Rate</p>
                <p className="text-2xl font-bold text-foreground">{recoveryRate}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recovered Revenue</p>
                <p className="text-2xl font-bold text-success">${recoveredRevenue.toFixed(2)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Recovery</p>
                <p className="text-2xl font-bold text-warning">${pendingRevenue.toFixed(2)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                <ShoppingCart className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lost Revenue</p>
                <p className="text-2xl font-bold text-destructive">${lostRevenue.toFixed(2)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown & Settings */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-foreground mb-3">Platform Breakdown</p>
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg bg-emerald-500/10 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{shopifyCarts}</p>
                <p className="text-xs text-muted-foreground">Shopify</p>
              </div>
              <div className="flex-1 rounded-lg bg-violet-500/10 p-3 text-center">
                <p className="text-lg font-bold text-violet-600">{sallaCarts}</p>
                <p className="text-xs text-muted-foreground">Salla</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-foreground mb-3">Auto-Recovery Settings</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Auto send reminders</span>
              <Switch checked={autoRecovery} onCheckedChange={setAutoRecovery} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">Send after</Label>
              <Input type="number" min="1" max="72" value={reminderDelay} onChange={e => setReminderDelay(e.target.value)} className="w-20 h-8 text-sm" />
              <span className="text-xs text-muted-foreground">hours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by customer name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Cart List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Products</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Channel</th>
                <th className="p-4 font-medium">Abandoned</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sc = statusConfig[c.status];
                return (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{c.customer}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{c.products.join(", ")}</p>
                      <p className="text-xs text-muted-foreground">{c.products.length} item(s)</p>
                    </td>
                    <td className="p-4 font-mono font-medium text-foreground">${c.total.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={`${platformColor(c.platform)} border ${platformBorder(c.platform)} text-xs`}>
                        {c.platform === "shopify" ? "Shopify" : "Salla"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">{c.abandonedAt}</td>
                    <td className="p-4">
                      <Badge className={`${sc.color} gap-1`}>{sc.icon} {sc.label}</Badge>
                    </td>
                    <td className="p-4">
                      {(c.status === "pending" || c.status === "reminded") && (
                        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => sendReminder(c.id)}>
                          <Send className="h-3 w-3" /> Remind
                        </Button>
                      )}
                      {c.status === "recovered" && <span className="text-xs text-success">✓ Recovered</span>}
                      {c.status === "lost" && <span className="text-xs text-destructive">✗ Lost</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AbandonedCarts;
