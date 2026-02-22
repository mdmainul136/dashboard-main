import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Tag, Percent, CheckCircle2, AlertCircle, Clock, Copy, Trash2, Plus
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  channel: string;
  platform: "shopify" | "salla";
  status: "active" | "expired" | "scheduled";
  usageCount: number;
  usageLimit: number;
  startsAt: string;
  endsAt: string;
}

const mockDiscounts: DiscountCode[] = [
  { id: "d1", code: "SUMMER25", type: "percentage", value: 25, channel: "My Shopify Store", platform: "shopify", status: "active", usageCount: 142, usageLimit: 500, startsAt: "2026-01-01", endsAt: "2026-03-31" },
  { id: "d2", code: "WELCOME10", type: "percentage", value: 10, channel: "Salla متجري", platform: "salla", status: "active", usageCount: 89, usageLimit: 200, startsAt: "2026-01-15", endsAt: "2026-06-30" },
  { id: "d3", code: "FLAT50", type: "fixed", value: 50, channel: "My Shopify Store", platform: "shopify", status: "active", usageCount: 34, usageLimit: 100, startsAt: "2026-02-01", endsAt: "2026-02-28" },
  { id: "d4", code: "EID2026", type: "percentage", value: 30, channel: "Salla متجري", platform: "salla", status: "scheduled", usageCount: 0, usageLimit: 300, startsAt: "2026-03-15", endsAt: "2026-04-15" },
  { id: "d5", code: "FLASH20", type: "percentage", value: 20, channel: "My Shopify Store", platform: "shopify", status: "expired", usageCount: 200, usageLimit: 200, startsAt: "2025-12-01", endsAt: "2026-01-15" },
  { id: "d6", code: "FREE99", type: "fixed", value: 99, channel: "Salla متجري", platform: "salla", status: "expired", usageCount: 50, usageLimit: 50, startsAt: "2025-11-01", endsAt: "2025-12-31" },
];

const platformColor = (p: "shopify" | "salla") => p === "shopify" ? "bg-emerald-500/10 text-emerald-600" : "bg-violet-500/10 text-violet-600";
const platformBorder = (p: "shopify" | "salla") => p === "shopify" ? "border-emerald-500/30" : "border-violet-500/30";

const statusBadge = (s: "active" | "expired" | "scheduled") => {
  if (s === "active") return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Active</Badge>;
  if (s === "scheduled") return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="h-3 w-3" /> Scheduled</Badge>;
  return <Badge className="bg-muted text-muted-foreground border-border gap-1"><AlertCircle className="h-3 w-3" /> Expired</Badge>;
};

const DiscountCouponSync = () => {
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [syncAll, setSyncAll] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState("");
  const [newPlatform, setNewPlatform] = useState<"shopify" | "salla">("shopify");
  const [newLimit, setNewLimit] = useState("100");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const activeCount = discounts.filter(d => d.status === "active").length;
  const totalSaved = discounts.filter(d => d.status !== "scheduled").reduce((s, d) => s + (d.type === "percentage" ? d.usageCount * d.value * 0.5 : d.usageCount * d.value), 0);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard` });
  };

  const deleteDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
    toast({ title: "Deleted", description: "Discount code removed" });
  };

  const resetForm = () => {
    setNewCode(""); setNewType("percentage"); setNewValue(""); setNewPlatform("shopify");
    setNewLimit("100"); setNewStart(""); setNewEnd("");
  };

  const handleCreate = () => {
    const code = newCode.trim().toUpperCase();
    const value = parseFloat(newValue);
    if (!code || code.length < 3 || code.length > 20) {
      toast({ title: "Error", description: "Code must be 3-20 characters", variant: "destructive" }); return;
    }
    if (discounts.some(d => d.code === code)) {
      toast({ title: "Error", description: "Code already exists", variant: "destructive" }); return;
    }
    if (isNaN(value) || value <= 0 || (newType === "percentage" && value > 100)) {
      toast({ title: "Error", description: newType === "percentage" ? "Value must be 1-100" : "Value must be > 0", variant: "destructive" }); return;
    }
    if (!newStart || !newEnd || newEnd <= newStart) {
      toast({ title: "Error", description: "Invalid date range", variant: "destructive" }); return;
    }
    const now = new Date().toISOString().slice(0, 10);
    const status: DiscountCode["status"] = newStart > now ? "scheduled" : "active";
    const newDiscount: DiscountCode = {
      id: `d${Date.now()}`, code, type: newType, value, usageCount: 0,
      usageLimit: parseInt(newLimit) || 100,
      channel: newPlatform === "shopify" ? "My Shopify Store" : "Salla متجري",
      platform: newPlatform, status, startsAt: newStart, endsAt: newEnd,
    };
    setDiscounts(prev => [newDiscount, ...prev]);
    setDialogOpen(false);
    resetForm();
    toast({ title: "Created!", description: `Discount ${code} created successfully` });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Codes</p>
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Codes</p>
            <p className="text-2xl font-bold text-foreground">{discounts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Usage</p>
            <p className="text-2xl font-bold text-foreground">{discounts.reduce((s, d) => s + d.usageCount, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Est. Savings</p>
            <p className="text-2xl font-bold text-foreground">${totalSaved.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Auto-sync discounts</span>
          <Switch checked={syncAll} onCheckedChange={setSyncAll} />
        </div>
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Create Discount
        </Button>
      </div>

      {/* Create Discount Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Create Discount Code</DialogTitle>
            <DialogDescription>Add a new discount code for Shopify or Salla</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="disc-code">Discount Code</Label>
              <Input id="disc-code" placeholder="e.g. SAVE20" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} maxLength={20} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newType} onValueChange={(v: "percentage" | "fixed") => setNewType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disc-value">Value</Label>
                <Input id="disc-value" type="number" min="1" max={newType === "percentage" ? 100 : 9999} placeholder={newType === "percentage" ? "25" : "50"} value={newValue} onChange={e => setNewValue(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={newPlatform} onValueChange={(v: "shopify" | "salla") => setNewPlatform(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopify">Shopify</SelectItem>
                    <SelectItem value="salla">Salla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disc-limit">Usage Limit</Label>
                <Input id="disc-limit" type="number" min="1" max="99999" value={newLimit} onChange={e => setNewLimit(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="disc-start">Start Date</Label>
                <Input id="disc-start" type="date" value={newStart} onChange={e => setNewStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disc-end">End Date</Label>
                <Input id="disc-end" type="date" value={newEnd} onChange={e => setNewEnd(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} className="gap-1.5"><Plus className="h-4 w-4" /> Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {discounts.map(d => (
          <Card key={d.id} className={`border ${d.status === "active" ? platformBorder(d.platform) : "border-border"} transition-all`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${d.type === "percentage" ? "bg-primary/10" : "bg-warning/10"}`}>
                    {d.type === "percentage" ? <Percent className="h-4 w-4 text-primary" /> : <Tag className="h-4 w-4 text-warning" />}
                  </div>
                  <div>
                    <p className="font-mono font-bold text-foreground">{d.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.type === "percentage" ? `${d.value}% off` : `$${d.value} off`}
                    </p>
                  </div>
                </div>
                {statusBadge(d.status)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="text-foreground font-medium">{d.usageCount} / {d.usageLimit}</span>
                </div>
                <Progress value={(d.usageCount / d.usageLimit) * 100} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`${platformColor(d.platform)} border ${platformBorder(d.platform)} text-[10px]`}>
                  {d.channel}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{d.startsAt} → {d.endsAt}</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs" onClick={() => copyCode(d.code)}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive text-xs" onClick={() => deleteDiscount(d.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscountCouponSync;
