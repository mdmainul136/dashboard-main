import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Bell, CheckCircle2, AlertCircle, Clock, Package, ShoppingCart, RefreshCw,
  Webhook, ArrowRight, ExternalLink, Plus, Trash2, Globe
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WebhookEvent {
  id: string;
  event: string;
  channel: string;
  platform: "shopify" | "salla";
  status: "delivered" | "failed" | "pending";
  payload: string;
  timestamp: string;
}

const mockEvents: WebhookEvent[] = [
  { id: "wh1", event: "order.created", channel: "My Shopify Store", platform: "shopify", status: "delivered", payload: "Order #SH-1042 - $129.99", timestamp: "2 min ago" },
  { id: "wh2", event: "product.updated", channel: "Salla متجري", platform: "salla", status: "delivered", payload: "USB-C Hub stock → 5", timestamp: "5 min ago" },
  { id: "wh3", event: "order.fulfilled", channel: "My Shopify Store", platform: "shopify", status: "delivered", payload: "Order #SH-1041 shipped", timestamp: "15 min ago" },
  { id: "wh4", event: "inventory.low", channel: "Salla متجري", platform: "salla", status: "failed", payload: "Headphones stock: 2 (below threshold)", timestamp: "30 min ago" },
  { id: "wh5", event: "order.cancelled", channel: "Salla متجري", platform: "salla", status: "delivered", payload: "Order #SA-2084 cancelled", timestamp: "1 hr ago" },
  { id: "wh6", event: "product.created", channel: "My Shopify Store", platform: "shopify", status: "pending", payload: "New product: Wireless Charger Pro", timestamp: "2 hrs ago" },
  { id: "wh7", event: "refund.created", channel: "My Shopify Store", platform: "shopify", status: "delivered", payload: "Refund $54.99 for Order #SH-1039", timestamp: "3 hrs ago" },
  { id: "wh8", event: "inventory.updated", channel: "Salla متجري", platform: "salla", status: "delivered", payload: "Bulk stock update: 12 products", timestamp: "4 hrs ago" },
];

interface WebhookConfig {
  event: string;
  label: string;
  icon: React.ReactNode;
  shopify: boolean;
  salla: boolean;
}

const initialConfigs: WebhookConfig[] = [
  { event: "order.created", label: "New Order", icon: <ShoppingCart className="h-4 w-4" />, shopify: true, salla: true },
  { event: "order.fulfilled", label: "Order Fulfilled", icon: <CheckCircle2 className="h-4 w-4" />, shopify: true, salla: true },
  { event: "order.cancelled", label: "Order Cancelled", icon: <AlertCircle className="h-4 w-4" />, shopify: true, salla: false },
  { event: "product.updated", label: "Product Updated", icon: <Package className="h-4 w-4" />, shopify: true, salla: true },
  { event: "inventory.low", label: "Low Stock Alert", icon: <Bell className="h-4 w-4" />, shopify: false, salla: true },
  { event: "refund.created", label: "Refund Created", icon: <RefreshCw className="h-4 w-4" />, shopify: true, salla: true },
];

const platformColor = (p: "shopify" | "salla") => p === "shopify" ? "bg-emerald-500/10 text-emerald-600" : "bg-violet-500/10 text-violet-600";

const statusBadge = (s: "delivered" | "failed" | "pending") => {
  if (s === "delivered") return <Badge className="bg-success/10 text-success border-success/20 gap-1 text-[10px]"><CheckCircle2 className="h-2.5 w-2.5" /> Delivered</Badge>;
  if (s === "failed") return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1 text-[10px]"><AlertCircle className="h-2.5 w-2.5" /> Failed</Badge>;
  return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1 text-[10px]"><Clock className="h-2.5 w-2.5" /> Pending</Badge>;
};

const eventIcon = (event: string) => {
  if (event.startsWith("order")) return <ShoppingCart className="h-3.5 w-3.5" />;
  if (event.startsWith("product") || event.startsWith("inventory")) return <Package className="h-3.5 w-3.5" />;
  return <RefreshCw className="h-3.5 w-3.5" />;
};

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  platform: "shopify" | "salla" | "both";
  active: boolean;
  createdAt: string;
}

const initialEndpoints: WebhookEndpoint[] = [
  { id: "ep1", url: "https://api.myapp.com/webhooks/orders", events: ["order.created", "order.fulfilled"], platform: "both", active: true, createdAt: "2026-01-10" },
  { id: "ep2", url: "https://hooks.slack.com/services/T00/B00/xxx", events: ["inventory.low"], platform: "salla", active: true, createdAt: "2026-02-01" },
];

const allEventOptions = [
  { value: "order.created", label: "New Order" },
  { value: "order.fulfilled", label: "Order Fulfilled" },
  { value: "order.cancelled", label: "Order Cancelled" },
  { value: "product.updated", label: "Product Updated" },
  { value: "inventory.low", label: "Low Stock Alert" },
  { value: "refund.created", label: "Refund Created" },
];

const WebhookNotifications = () => {
  const [configs, setConfigs] = useState(initialConfigs);
  const [endpoints, setEndpoints] = useState(initialEndpoints);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newPlatform, setNewPlatform] = useState<"shopify" | "salla" | "both">("both");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleConfig = (event: string, platform: "shopify" | "salla") => {
    setConfigs(prev => prev.map(c =>
      c.event === event ? { ...c, [platform]: !c[platform] } : c
    ));
  };

  const delivered = mockEvents.filter(e => e.status === "delivered").length;
  const failed = mockEvents.filter(e => e.status === "failed").length;

  const resetForm = () => {
    setNewUrl(""); setNewPlatform("both"); setSelectedEvents([]);
  };

  const toggleEvent = (ev: string) => {
    setSelectedEvents(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev]);
  };

  const handleCreateEndpoint = () => {
    const url = newUrl.trim();
    if (!url || !/^https?:\/\/.+/.test(url)) {
      toast({ title: "Error", description: "Please enter a valid URL starting with http:// or https://", variant: "destructive" }); return;
    }
    if (url.length > 500) {
      toast({ title: "Error", description: "URL is too long (max 500 characters)", variant: "destructive" }); return;
    }
    if (selectedEvents.length === 0) {
      toast({ title: "Error", description: "Select at least one event", variant: "destructive" }); return;
    }
    const ep: WebhookEndpoint = {
      id: `ep${Date.now()}`, url, events: selectedEvents, platform: newPlatform,
      active: true, createdAt: new Date().toISOString().slice(0, 10),
    };
    setEndpoints(prev => [ep, ...prev]);
    setDialogOpen(false);
    resetForm();
    toast({ title: "Endpoint Created!", description: `Webhook endpoint added for ${selectedEvents.length} event(s)` });
  };

  const deleteEndpoint = (id: string) => {
    setEndpoints(prev => prev.filter(e => e.id !== id));
    toast({ title: "Deleted", description: "Webhook endpoint removed" });
  };

  const toggleEndpoint = (id: string) => {
    setEndpoints(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e));
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{delivered}</p>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Webhook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{mockEvents.length}</p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Webhook Endpoints
              </CardTitle>
              <CardDescription>Manage webhook URLs that receive event notifications</CardDescription>
            </div>
            <Button size="sm" className="gap-1.5" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Add Endpoint
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {endpoints.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No endpoints configured. Add one to start receiving webhooks.</p>
          )}
          {endpoints.map(ep => (
            <div key={ep.id} className={`rounded-lg border p-3 space-y-2 transition-all ${ep.active ? "border-border" : "border-border/30 opacity-60"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-mono text-foreground truncate flex-1">{ep.url}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={ep.active} onCheckedChange={() => toggleEndpoint(ep.id)} />
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteEndpoint(ep.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {ep.events.map(ev => (
                  <Badge key={ev} variant="outline" className="text-[9px]">{ev}</Badge>
                ))}
                <Badge variant="outline" className={`text-[9px] capitalize ${ep.platform === "shopify" ? "text-emerald-600 border-emerald-500/30" : ep.platform === "salla" ? "text-violet-600 border-violet-500/30" : "text-primary border-primary/30"}`}>
                  {ep.platform}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">Created: {ep.createdAt}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Create Endpoint Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Webhook className="h-4 w-4 text-primary" /> Add Webhook Endpoint</DialogTitle>
            <DialogDescription>Configure a URL to receive webhook event notifications</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ep-url">Endpoint URL</Label>
              <Input id="ep-url" placeholder="https://your-api.com/webhooks" value={newUrl} onChange={e => setNewUrl(e.target.value)} maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={newPlatform} onValueChange={(v: "shopify" | "salla" | "both") => setNewPlatform(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both (Shopify & Salla)</SelectItem>
                  <SelectItem value="shopify">Shopify Only</SelectItem>
                  <SelectItem value="salla">Salla Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Events <span className="text-muted-foreground text-xs">({selectedEvents.length} selected)</span></Label>
              <div className="grid grid-cols-2 gap-2">
                {allEventOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleEvent(opt.value)}
                    className={`rounded-lg border p-2.5 text-left text-xs transition-all ${
                      selectedEvents.includes(opt.value)
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{opt.value}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreateEndpoint} className="gap-1.5"><Plus className="h-4 w-4" /> Add Endpoint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Webhook className="h-4 w-4 text-primary" /> Webhook Configuration
            </CardTitle>
            <CardDescription>Enable or disable webhook events per channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_80px_80px] gap-2 text-xs font-medium text-muted-foreground px-3 pb-2">
                <span>Event</span>
                <span className="text-center">Shopify</span>
                <span className="text-center">Salla</span>
              </div>
              {configs.map(c => (
                <div key={c.event} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-muted-foreground">{c.icon}</span>
                    <span className="text-sm text-foreground">{c.label}</span>
                  </div>
                  <div className="flex justify-center">
                    <Switch checked={c.shopify} onCheckedChange={() => toggleConfig(c.event, "shopify")} />
                  </div>
                  <div className="flex justify-center">
                    <Switch checked={c.salla} onCheckedChange={() => toggleConfig(c.event, "salla")} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Recent Events
            </CardTitle>
            <CardDescription>Latest webhook events from all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-auto">
              {mockEvents.map(ev => (
                <div key={ev.id} className="flex items-start gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/20 transition-colors">
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg ${platformColor(ev.platform)}`}>
                    {eventIcon(ev.event)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{ev.event}</span>
                      {statusBadge(ev.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{ev.payload}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span>{ev.channel}</span>
                      <span>·</span>
                      <span>{ev.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebhookNotifications;
