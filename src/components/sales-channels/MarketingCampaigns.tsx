"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlashSaleForm from "@/components/marketing/FlashSaleForm";
import { DollarSign, Target, TrendingUp, BarChart3, Plus, Facebook, Instagram, ShoppingBag, Tv, Zap, Clock, Package, MessageSquare, Award, Settings } from "lucide-react";

interface MarketingChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  products: number;
  revenue: number;
}

interface Campaign {
  id: string;
  name: string;
  type: "social" | "search" | "upsell" | "email";
  budget: number;
  spent: number;
  roi: number;
  conversions: number;
  status: "active" | "paused" | "ended";
}

const MarketingCampaigns = () => {
  const [channels, setChannels] = useState<MarketingChannel[]>([
    { id: "fb", name: "Facebook Shop", icon: <Facebook className="h-5 w-5" />, connected: true, products: 86, revenue: 4200 },
    { id: "ig", name: "Instagram Shopping", icon: <Instagram className="h-5 w-5" />, connected: true, products: 64, revenue: 3100 },
    { id: "google", name: "Google Shopping", icon: <ShoppingBag className="h-5 w-5" />, connected: false, products: 0, revenue: 0 },
    { id: "tiktok", name: "TikTok Shop", icon: <Tv className="h-5 w-5" />, connected: false, products: 0, revenue: 0 },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "c1", name: "Summer Sale Push", type: "social", budget: 500, spent: 320, roi: 4.2, conversions: 48, status: "active" },
    { id: "c2", name: "Google Smart Shopping", type: "search", budget: 1000, spent: 780, roi: 3.8, conversions: 92, status: "active" },
  ]);

  const [loyaltyTiers] = useState([
    { id: 1, name: "Bronze", min_points: 0, multiplier: 1.0 },
    { id: 2, name: "Silver", min_points: 1000, multiplier: 1.2 },
    { id: 3, name: "Gold", min_points: 5000, multiplier: 1.5 },
  ]);

  const [whatsappLogs] = useState([
    { id: 1, to: "+8801700000000", template: "order_placed", status: "sent", time: "2 mins ago" },
    { id: 2, to: "+8801800000000", template: "order_shipped", status: "delivered", time: "1 hour ago" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", type: "social" as "social" | "search" | "upsell" | "email", budget: "" });

  const totalSpend = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalRevenue = channels.reduce((s, c) => s + c.revenue, 0);

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, connected: !c.connected } : c));
  };

  const handleCreate = () => {
    if (!newCampaign.name || !newCampaign.budget) return;
    setCampaigns(prev => [...prev, {
      id: `c${Date.now()}`, name: newCampaign.name, type: newCampaign.type,
      budget: parseFloat(newCampaign.budget), spent: 0, roi: 0, conversions: 0, status: "active",
    }]);
    setNewCampaign({ name: "", type: "social", budget: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-5 text-card-foreground"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">Ad Spend</p><p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p></div><div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5 text-card-foreground"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">Revenue</p><p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p></div><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5 text-card-foreground"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">Conversions</p><p className="text-2xl font-bold">{totalConversions}</p></div><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><Target className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5 text-card-foreground"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">Points Awarded</p><p className="text-2xl font-bold">12.4K</p></div><div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center"><Award className="h-5 w-5 text-amber-600" /></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-4">
          <TabsTrigger value="overview" className="gap-2"><BarChart3 className="h-3.5 w-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="flash-sales" className="gap-2"><Zap className="h-3.5 w-3.5" /> Flash Sales</TabsTrigger>
          <TabsTrigger value="loyalty" className="gap-2"><Award className="h-3.5 w-3.5" /> Loyalty & Tiers</TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2"><MessageSquare className="h-3.5 w-3.5" /> WhatsApp Hub</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Sales Channels</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {channels.map(ch => (
                  <div key={ch.id} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                      {ch.icon}
                      <div><p className="text-sm font-medium">{ch.name}</p><p className="text-xs text-muted-foreground">{ch.products} items synced</p></div>
                    </div>
                    <Switch checked={ch.connected} onCheckedChange={() => toggleChannel(ch.id)} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold">Active Campaigns</CardTitle>
                <Button size="icon" variant="ghost" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaigns.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
                    <div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">${c.spent} spent · {c.roi}x ROI</p></div>
                    <Badge variant={c.status === "active" ? "default" : "outline"}>{c.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flash-sales" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader><CardTitle className="text-sm font-bold">New Promotion</CardTitle></CardHeader>
              <CardContent><FlashSaleForm onSuccess={() => { }} /></CardContent>
            </Card>
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold">Active & Upcoming</h3>
              <div className="grid gap-3">
                <Card className="border-amber-200 bg-amber-50/20">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center animate-pulse"><Zap className="h-5 w-5 text-white" /></div>
                      <div><p className="font-bold">Midnight Madness</p><p className="text-xs text-muted-foreground">25% OFF · Ends in 02:14:10</p></div>
                    </div>
                    <Badge>LIVE</Badge>
                  </CardContent>
                </Card>
                <div className="rounded-xl border border-dashed p-8 flex flex-col items-center justify-center text-muted-foreground">
                  <Clock className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs">No other sales scheduled</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><Settings className="h-4 w-4" /> Earning Rules</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Points per $1 spent</Label>
                  <Input type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label>Point Value (in $)</Label>
                  <Input type="number" defaultValue="0.1" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Program Active</Label>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full">Save Rules</Button>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-sm font-bold">Membership Tiers</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loyaltyTiers.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                      <div><p className="font-bold">{t.name}</p><p className="text-xs text-muted-foreground">Threshold: {t.min_points} points</p></div>
                      <div className="text-right"><p className="text-xs font-bold text-amber-600">{t.multiplier}x multiplier</p><Button variant="ghost" size="sm">Edit</Button></div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed"><Plus className="h-4 w-4 mr-2" /> Add New Tier</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader><CardTitle className="text-sm font-bold">Automation Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Order Confirmation</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Shipping Updates</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Abandoned Cart</Label>
                  <Switch />
                </div>
                <hr />
                <div className="space-y-2">
                  <Label>WhatsApp Business API Key</Label>
                  <Input type="password" value="************" readOnly />
                  <p className="text-[10px] text-muted-foreground">Powered by Zosair/Twilio Cloud API</p>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-sm font-bold">Communication Logs</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {whatsappLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-600"><MessageSquare className="h-4 w-4" /></div>
                        <div><p className="text-xs font-bold">{log.to}</p><p className="text-[10px] text-muted-foreground">{log.template} · {log.time}</p></div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">{log.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Marketing Campaign</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Campaign Name</Label><Input placeholder="Summer Sale 2024" value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Budget ($)</Label><Input type="number" placeholder="500" value={newCampaign.budget} onChange={e => setNewCampaign({ ...newCampaign, budget: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={handleCreate}>Launch</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingCampaigns;
