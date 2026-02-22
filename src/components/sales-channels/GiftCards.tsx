import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Gift, Plus, CheckCircle2, Clock, AlertCircle, DollarSign, CreditCard, TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GiftCard {
  id: string;
  code: string;
  initialValue: number;
  balance: number;
  status: "active" | "redeemed" | "expired";
  platform: "shopify" | "salla" | "both";
  expiresAt: string;
  createdAt: string;
  syncStatus: "synced" | "pending";
}

const mockGiftCards: GiftCard[] = [
  { id: "gc1", code: "GIFT-A1B2C3", initialValue: 100, balance: 75.50, status: "active", platform: "both", expiresAt: "2026-12-31", createdAt: "2026-01-15", syncStatus: "synced" },
  { id: "gc2", code: "GIFT-D4E5F6", initialValue: 50, balance: 0, status: "redeemed", platform: "shopify", expiresAt: "2026-06-30", createdAt: "2025-12-01", syncStatus: "synced" },
  { id: "gc3", code: "GIFT-G7H8I9", initialValue: 200, balance: 200, status: "active", platform: "salla", expiresAt: "2026-08-31", createdAt: "2026-02-10", syncStatus: "pending" },
  { id: "gc4", code: "GIFT-J0K1L2", initialValue: 75, balance: 30, status: "active", platform: "both", expiresAt: "2026-04-30", createdAt: "2026-01-20", syncStatus: "synced" },
  { id: "gc5", code: "GIFT-M3N4O5", initialValue: 150, balance: 0, status: "redeemed", platform: "shopify", expiresAt: "2026-03-31", createdAt: "2025-10-15", syncStatus: "synced" },
  { id: "gc6", code: "GIFT-P6Q7R8", initialValue: 25, balance: 25, status: "expired", platform: "salla", expiresAt: "2026-01-31", createdAt: "2025-08-01", syncStatus: "synced" },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  active: { color: "bg-success/10 text-success border-success/20", icon: <CheckCircle2 className="h-3 w-3" />, label: "Active" },
  redeemed: { color: "bg-primary/10 text-primary border-primary/20", icon: <CreditCard className="h-3 w-3" />, label: "Redeemed" },
  expired: { color: "bg-muted text-muted-foreground border-border", icon: <AlertCircle className="h-3 w-3" />, label: "Expired" },
};

const GiftCards = () => {
  const [cards, setCards] = useState(mockGiftCards);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newPlatform, setNewPlatform] = useState<"both" | "shopify" | "salla">("both");
  const [newExpiry, setNewExpiry] = useState("");

  const totalIssued = cards.reduce((s, c) => s + c.initialValue, 0);
  const totalRedeemed = cards.reduce((s, c) => s + (c.initialValue - c.balance), 0);
  const outstandingBalance = cards.reduce((s, c) => s + c.balance, 0);
  const activeCount = cards.filter(c => c.status === "active").length;

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "GIFT-";
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handleCreate = () => {
    const value = parseFloat(newValue);
    if (isNaN(value) || value < 5 || value > 10000) {
      toast({ title: "Error", description: "Value must be between $5 and $10,000", variant: "destructive" }); return;
    }
    if (!newExpiry) {
      toast({ title: "Error", description: "Expiry date required", variant: "destructive" }); return;
    }
    const gc: GiftCard = {
      id: `gc${Date.now()}`, code: generateCode(), initialValue: value, balance: value,
      status: "active", platform: newPlatform, expiresAt: newExpiry,
      createdAt: new Date().toISOString().slice(0, 10), syncStatus: "pending",
    };
    setCards(prev => [gc, ...prev]);
    setDialogOpen(false); setNewValue(""); setNewPlatform("both"); setNewExpiry("");
    toast({ title: "Created!", description: `Gift card ${gc.code} worth $${gc.initialValue} created` });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Issued</p><p className="text-2xl font-bold text-foreground">${totalIssued.toLocaleString()}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Gift className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Redeemed</p><p className="text-2xl font-bold text-success">${totalRedeemed.toLocaleString()}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Outstanding</p><p className="text-2xl font-bold text-warning">${outstandingBalance.toLocaleString()}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><DollarSign className="h-5 w-5 text-warning" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Active Cards</p><p className="text-2xl font-bold text-foreground">{activeCount}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Create Gift Card
        </Button>
      </div>

      {/* Gift Card Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(gc => {
          const sc = statusConfig[gc.status];
          const usedPercent = gc.initialValue > 0 ? ((gc.initialValue - gc.balance) / gc.initialValue) * 100 : 0;
          return (
            <Card key={gc.id} className="border transition-all">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-foreground text-sm">{gc.code}</p>
                      <p className="text-xs text-muted-foreground">Created: {gc.createdAt}</p>
                    </div>
                  </div>
                  <Badge className={`${sc.color} gap-1`}>{sc.icon} {sc.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold text-foreground">${gc.initialValue}</p>
                    <p className="text-[10px] text-muted-foreground">Value</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold text-foreground">${gc.balance.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">Balance</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Used</span>
                    <span className="text-foreground">{usedPercent.toFixed(0)}%</span>
                  </div>
                  <Progress value={usedPercent} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={
                    gc.platform === "shopify" ? "bg-emerald-500/10 text-emerald-600 text-[10px]" :
                    gc.platform === "salla" ? "bg-violet-500/10 text-violet-600 text-[10px]" :
                    "bg-primary/10 text-primary text-[10px]"
                  }>
                    {gc.platform === "both" ? "Both" : gc.platform === "shopify" ? "Shopify" : "Salla"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className={gc.syncStatus === "synced" ? "bg-success/10 text-success text-[10px]" : "bg-warning/10 text-warning text-[10px]"}>
                      {gc.syncStatus === "synced" ? "Synced" : "Pending"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Exp: {gc.expiresAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) { setNewValue(""); setNewPlatform("both"); setNewExpiry(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /> Create Gift Card</DialogTitle>
            <DialogDescription>Generate a new digital gift card</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Value ($)</Label>
              <Input type="number" min="5" max="10000" placeholder="e.g. 100" value={newValue} onChange={e => setNewValue(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={newPlatform} onValueChange={(v: "both" | "shopify" | "salla") => setNewPlatform(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both Platforms</SelectItem>
                  <SelectItem value="shopify">Shopify Only</SelectItem>
                  <SelectItem value="salla">Salla Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="gap-1.5"><Plus className="h-4 w-4" /> Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftCards;
