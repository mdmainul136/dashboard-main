import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Zap, Users, TrendingUp, Link2, Plus, Clock, Timer, MousePointerClick, DollarSign
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FlashSale {
  id: string;
  name: string;
  discount: number;
  startTime: string;
  endTime: string;
  status: "active" | "scheduled" | "ended";
  soldCount: number;
  targetCount: number;
}

interface Affiliate {
  id: string;
  name: string;
  code: string;
  clicks: number;
  conversions: number;
  commission: number;
  totalEarned: number;
}

const initialFlashSales: FlashSale[] = [
  { id: "fs1", name: "Winter Clearance", discount: 40, startTime: "2026-02-19T10:00", endTime: "2026-02-19T22:00", status: "active", soldCount: 89, targetCount: 150 },
  { id: "fs2", name: "Electronics Deal", discount: 25, startTime: "2026-02-20T08:00", endTime: "2026-02-20T20:00", status: "scheduled", soldCount: 0, targetCount: 200 },
  { id: "fs3", name: "Fashion Friday", discount: 50, startTime: "2026-02-14T00:00", endTime: "2026-02-14T23:59", status: "ended", soldCount: 234, targetCount: 200 },
  { id: "fs4", name: "Beauty Blitz", discount: 30, startTime: "2026-02-21T12:00", endTime: "2026-02-21T18:00", status: "scheduled", soldCount: 0, targetCount: 100 },
];

const initialAffiliates: Affiliate[] = [
  { id: "af1", name: "Tech Reviews KSA", code: "TECHKSA", clicks: 4520, conversions: 312, commission: 8, totalEarned: 12400 },
  { id: "af2", name: "Fashion Influencer", code: "FASHION25", clicks: 8900, conversions: 567, commission: 10, totalEarned: 28500 },
  { id: "af3", name: "Lifestyle Blog", code: "LIFE10", clicks: 2100, conversions: 98, commission: 5, totalEarned: 4200 },
  { id: "af4", name: "Deal Hunter SA", code: "DEALS20", clicks: 6300, conversions: 445, commission: 7, totalEarned: 18900 },
];

const FlashSalesAffiliate = () => {
  const [flashSales] = useState(initialFlashSales);
  const [affiliates] = useState(initialAffiliates);
  const [flashDialogOpen, setFlashDialogOpen] = useState(false);
  const [affDialogOpen, setAffDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Simple countdown for active flash sale
  useEffect(() => {
    const active = flashSales.find(f => f.status === "active");
    if (!active) return;
    const interval = setInterval(() => {
      const end = new Date(active.endTime).getTime();
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) { setCountdown("Ended"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [flashSales]);

  const activeFlashSales = flashSales.filter(f => f.status === "active").length;
  const totalAffRevenue = affiliates.reduce((s, a) => s + a.totalEarned, 0);
  const topInfluencer = affiliates.sort((a, b) => b.totalEarned - a.totalEarned)[0];
  const avgConversion = ((affiliates.reduce((s, a) => s + (a.conversions / a.clicks) * 100, 0)) / affiliates.length).toFixed(1);

  const statusBadge = (status: FlashSale["status"]) => {
    if (status === "active") return <Badge className="bg-success/10 text-success border-success/20 gap-1"><Zap className="h-3 w-3" /> Active</Badge>;
    if (status === "scheduled") return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><Clock className="h-3 w-3" /> Scheduled</Badge>;
    return <Badge className="bg-muted text-muted-foreground border-border gap-1">Ended</Badge>;
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Active Flash Sales</p><p className="text-2xl font-bold text-foreground">{activeFlashSales}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><Zap className="h-5 w-5 text-warning" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Affiliate Revenue</p><p className="text-2xl font-bold text-foreground">SAR {(totalAffRevenue / 1000).toFixed(0)}k</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><DollarSign className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Top Influencer</p><p className="text-2xl font-bold text-foreground truncate max-w-[120px]">{topInfluencer?.name}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Users className="h-5 w-5 text-violet-500" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Avg Conversion</p><p className="text-2xl font-bold text-foreground">{avgConversion}%</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Flash Sales Section */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Zap className="h-4 w-4 text-warning" /> Flash Sales</h3>
        <Button size="sm" className="gap-2" onClick={() => setFlashDialogOpen(true)}><Plus className="h-4 w-4" /> Create Flash Sale</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {flashSales.map(fs => (
          <Card key={fs.id} className={`border transition-all ${fs.status === "active" ? "border-warning/30" : ""}`}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{fs.name}</p>
                  <p className="text-xs text-muted-foreground">{fs.discount}% off</p>
                </div>
                {statusBadge(fs.status)}
              </div>
              {fs.status === "active" && countdown && (
                <div className="flex items-center gap-2 rounded-lg bg-warning/5 p-2">
                  <Timer className="h-4 w-4 text-warning" />
                  <span className="text-sm font-mono font-bold text-warning">{countdown}</span>
                  <span className="text-xs text-muted-foreground">remaining</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">{fs.soldCount}</p>
                  <p className="text-[10px] text-muted-foreground">Sold</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">{fs.targetCount}</p>
                  <p className="text-[10px] text-muted-foreground">Target</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(fs.startTime).toLocaleDateString()} — {new Date(fs.endTime).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Affiliate Section */}
      <div className="flex items-center justify-between mt-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> Affiliates & Influencers</h3>
        <Button size="sm" variant="outline" className="gap-2" onClick={() => setAffDialogOpen(true)}><Plus className="h-4 w-4" /> Create Link</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Clicks</th>
                <th className="p-4 font-medium">Conversions</th>
                <th className="p-4 font-medium">Commission</th>
                <th className="p-4 font-medium">Total Earned</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{a.name}</td>
                  <td className="p-4"><Badge variant="outline" className="font-mono text-xs">{a.code}</Badge></td>
                  <td className="p-4 text-foreground flex items-center gap-1"><MousePointerClick className="h-3 w-3 text-muted-foreground" /> {a.clicks.toLocaleString()}</td>
                  <td className="p-4 text-foreground">{a.conversions}</td>
                  <td className="p-4 text-foreground">{a.commission}%</td>
                  <td className="p-4 font-mono font-medium text-success">SAR {a.totalEarned.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Flash Sale Dialog */}
      <Dialog open={flashDialogOpen} onOpenChange={setFlashDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Zap className="h-4 w-4 text-warning" /> Create Flash Sale</DialogTitle>
            <DialogDescription>Set up a time-limited discount deal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Sale Name</Label><Input placeholder="e.g. Summer Blowout" /></div>
            <div className="space-y-2"><Label>Discount (%)</Label><Input type="number" placeholder="25" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Start</Label><Input type="datetime-local" /></div>
              <div className="space-y-2"><Label>End</Label><Input type="datetime-local" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlashDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { setFlashDialogOpen(false); toast({ title: "Created!", description: "Flash sale created" }); }} className="gap-1.5"><Plus className="h-4 w-4" /> Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Affiliate Link Dialog */}
      <Dialog open={affDialogOpen} onOpenChange={setAffDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> Create Affiliate Link</DialogTitle>
            <DialogDescription>Generate an affiliate/influencer tracking link</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Affiliate Name</Label><Input placeholder="e.g. Tech Reviews KSA" /></div>
            <div className="space-y-2"><Label>Coupon Code</Label><Input placeholder="e.g. TECHKSA" /></div>
            <div className="space-y-2"><Label>Commission Rate (%)</Label><Input type="number" placeholder="8" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAffDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAffDialogOpen(false); toast({ title: "Created!", description: "Affiliate link created" }); }} className="gap-1.5"><Plus className="h-4 w-4" /> Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashSalesAffiliate;
