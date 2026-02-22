import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  CreditCard, Smartphone, Banknote, CheckCircle2, Plus, TrendingUp, DollarSign, Shield, AlertTriangle, Globe, Wallet
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentGateway {
  id: string;
  name: string;
  icon: React.ReactNode;
  fee: string;
  shopifyEnabled: boolean;
  sallaEnabled: boolean;
  successRate: number;
  transactions: number;
  volume: number;
  region: "saudi" | "global" | "both";
  codRiskScore?: "low" | "medium" | "high";
}

const initialGateways: PaymentGateway[] = [
  { id: "pg1", name: "Visa / Mastercard", icon: <CreditCard className="h-5 w-5" />, fee: "2.5% + $0.30", shopifyEnabled: true, sallaEnabled: true, successRate: 97.2, transactions: 1245, volume: 45200, region: "global" },
  { id: "pg2", name: "Mada", icon: <CreditCard className="h-5 w-5" />, fee: "1.8%", shopifyEnabled: true, sallaEnabled: true, successRate: 98.5, transactions: 890, volume: 32100, region: "saudi" },
  { id: "pg3", name: "Apple Pay", icon: <Smartphone className="h-5 w-5" />, fee: "2.0%", shopifyEnabled: true, sallaEnabled: false, successRate: 99.1, transactions: 567, volume: 21800, region: "global" },
  { id: "pg4", name: "Tabby (BNPL)", icon: <CreditCard className="h-5 w-5" />, fee: "4.5%", shopifyEnabled: false, sallaEnabled: true, successRate: 94.3, transactions: 234, volume: 18900, region: "saudi" },
  { id: "pg5", name: "Tamara (BNPL)", icon: <CreditCard className="h-5 w-5" />, fee: "4.0%", shopifyEnabled: true, sallaEnabled: true, successRate: 95.1, transactions: 312, volume: 24500, region: "saudi" },
  { id: "pg6", name: "Cash on Delivery", icon: <Banknote className="h-5 w-5" />, fee: "0%", shopifyEnabled: true, sallaEnabled: true, successRate: 85.0, transactions: 678, volume: 15400, region: "both", codRiskScore: "medium" },
  { id: "pg7", name: "STC Pay", icon: <Smartphone className="h-5 w-5" />, fee: "1.5%", shopifyEnabled: false, sallaEnabled: true, successRate: 96.8, transactions: 423, volume: 19500, region: "saudi" },
  { id: "pg8", name: "Google Pay", icon: <Smartphone className="h-5 w-5" />, fee: "2.0%", shopifyEnabled: true, sallaEnabled: false, successRate: 98.2, transactions: 189, volume: 8700, region: "global" },
  { id: "pg9", name: "PayPal", icon: <Wallet className="h-5 w-5" />, fee: "2.9% + $0.30", shopifyEnabled: true, sallaEnabled: false, successRate: 96.5, transactions: 456, volume: 28900, region: "global" },
  { id: "pg10", name: "Bank Transfer", icon: <Banknote className="h-5 w-5" />, fee: "0%", shopifyEnabled: true, sallaEnabled: true, successRate: 100, transactions: 89, volume: 12300, region: "both" },
];

interface RefundEntry {
  id: string;
  orderId: string;
  amount: number;
  type: "full" | "partial" | "wallet";
  status: "processed" | "pending";
  date: string;
}

const mockRefunds: RefundEntry[] = [
  { id: "r1", orderId: "#SH-1042", amount: 129.99, type: "full", status: "processed", date: "2026-02-19" },
  { id: "r2", orderId: "#SA-2085", amount: 45.00, type: "partial", status: "pending", date: "2026-02-18" },
  { id: "r3", orderId: "#SH-1039", amount: 89.50, type: "wallet", status: "processed", date: "2026-02-17" },
  { id: "r4", orderId: "#SA-2081", amount: 200.00, type: "partial", status: "pending", date: "2026-02-16" },
];

const PaymentMethods = () => {
  const [gateways, setGateways] = useState(initialGateways);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState<"all" | "saudi" | "global">("all");
  const [newName, setNewName] = useState("");
  const [newFee, setNewFee] = useState("");
  const [newPlatform, setNewPlatform] = useState<"both" | "shopify" | "salla">("both");

  const filtered = regionFilter === "all" ? gateways : gateways.filter(g => g.region === regionFilter || g.region === "both");
  const totalTransactions = gateways.reduce((s, g) => s + g.transactions, 0);
  const totalVolume = gateways.reduce((s, g) => s + g.volume, 0);
  const avgSuccessRate = (gateways.reduce((s, g) => s + g.successRate, 0) / gateways.length).toFixed(1);

  const toggleGateway = (id: string, field: "shopifyEnabled" | "sallaEnabled") => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, [field]: !g[field] } : g));
    toast({ title: "Updated", description: "Gateway status changed" });
  };

  const riskBadge = (risk?: "low" | "medium" | "high") => {
    if (!risk) return null;
    if (risk === "low") return <Badge className="bg-success/10 text-success border-success/20 text-[10px] gap-1"><Shield className="h-3 w-3" /> Low Risk</Badge>;
    if (risk === "medium") return <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px] gap-1"><AlertTriangle className="h-3 w-3" /> Medium</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1"><AlertTriangle className="h-3 w-3" /> High Risk</Badge>;
  };

  const regionBadge = (region: string) => {
    if (region === "saudi") return <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-600">🇸🇦 Saudi</Badge>;
    if (region === "global") return <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">🌍 Global</Badge>;
    return <Badge variant="outline" className="text-[10px] bg-muted">Both</Badge>;
  };

  const refundTypeBadge = (type: RefundEntry["type"]) => {
    if (type === "full") return <Badge className="bg-destructive/10 text-destructive text-[10px]">Full Refund</Badge>;
    if (type === "partial") return <Badge className="bg-warning/10 text-warning text-[10px]">Partial</Badge>;
    return <Badge className="bg-primary/10 text-primary text-[10px]">Wallet Credit</Badge>;
  };

  const handleAddGateway = () => {
    if (!newName.trim() || newName.trim().length < 2) {
      toast({ title: "Error", description: "Gateway name required", variant: "destructive" }); return;
    }
    const gw: PaymentGateway = {
      id: `pg${Date.now()}`, name: newName.trim(), icon: <CreditCard className="h-5 w-5" />,
      fee: newFee || "0%", shopifyEnabled: newPlatform !== "salla", sallaEnabled: newPlatform !== "shopify",
      successRate: 0, transactions: 0, volume: 0, region: "both",
    };
    setGateways(prev => [...prev, gw]);
    setDialogOpen(false); setNewName(""); setNewFee(""); setNewPlatform("both");
    toast({ title: "Added!", description: `${gw.name} gateway added` });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Transactions</p><p className="text-2xl font-bold text-foreground">{totalTransactions.toLocaleString()}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Volume</p><p className="text-2xl font-bold text-foreground">${(totalVolume / 1000).toFixed(1)}k</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><DollarSign className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Avg. Success Rate</p><p className="text-2xl font-bold text-foreground">{avgSuccessRate}%</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><CheckCircle2 className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Payout Schedule</p><p className="text-2xl font-bold text-foreground">Weekly</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Wallet className="h-5 w-5 text-violet-500" /></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Region Filter + Add */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(["all", "saudi", "global"] as const).map(r => (
            <Button key={r} size="sm" variant={regionFilter === r ? "default" : "outline"} onClick={() => setRegionFilter(r)} className="text-xs capitalize">
              {r === "all" ? "🌐 All" : r === "saudi" ? "🇸🇦 Saudi" : "🌍 Global"}
            </Button>
          ))}
        </div>
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add Gateway
        </Button>
      </div>

      {/* Gateway Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(g => (
          <Card key={g.id} className="border transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{g.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{g.name}</p>
                  <p className="text-xs text-muted-foreground">Fee: {g.fee}</p>
                </div>
                {regionBadge(g.region)}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">{g.successRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Success</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">{g.transactions}</p>
                  <p className="text-[10px] text-muted-foreground">Txns</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">${(g.volume / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-muted-foreground">Volume</p>
                </div>
              </div>

              {g.codRiskScore && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">COD Risk</span>
                  {riskBadge(g.codRiskScore)}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px]">Shopify</Badge>
                  <Switch checked={g.shopifyEnabled} onCheckedChange={() => toggleGateway(g.id, "shopifyEnabled")} />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-600 text-[10px]">Salla</Badge>
                  <Switch checked={g.sallaEnabled} onCheckedChange={() => toggleGateway(g.id, "sallaEnabled")} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Refunds & Wallet Section */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Refunds & Wallet Credits</h3>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockRefunds.map(r => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{r.orderId}</td>
                    <td className="p-4 font-mono text-foreground">SAR {r.amount.toFixed(2)}</td>
                    <td className="p-4">{refundTypeBadge(r.type)}</td>
                    <td className="p-4">
                      {r.status === "processed"
                        ? <Badge className="bg-success/10 text-success text-[10px]">Processed</Badge>
                        : <Badge className="bg-warning/10 text-warning text-[10px]">Pending</Badge>}
                    </td>
                    <td className="p-4 text-muted-foreground">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Gateway Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Add Payment Gateway</DialogTitle>
            <DialogDescription>Configure a new payment method for your channels</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Gateway Name</Label>
              <Input placeholder="e.g. PayPal" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Fee / Commission</Label>
              <Input placeholder="e.g. 2.5% + $0.30" value={newFee} onChange={e => setNewFee(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Enable for</Label>
              <Select value={newPlatform} onValueChange={(v: "both" | "shopify" | "salla") => setNewPlatform(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both Platforms</SelectItem>
                  <SelectItem value="shopify">Shopify Only</SelectItem>
                  <SelectItem value="salla">Salla Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGateway} className="gap-1.5"><Plus className="h-4 w-4" /> Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;
