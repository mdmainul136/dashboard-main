"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Store, Link2, Unlink, RefreshCw, Package, ClipboardList,
  BarChart3, ArrowUpRight, CheckCircle2, AlertCircle, Clock,
  TrendingUp, Globe, ExternalLink, FileSpreadsheet, Webhook, Tag, Truck, PieChart,
  ShoppingCart, Users, Bell, FolderOpen, Gift
} from "lucide-react";
import CSVImportExport from "@/components/sales-channels/CSVImportExport";
import WebhookNotifications from "@/components/sales-channels/WebhookNotifications";
import DiscountCouponSync from "@/components/sales-channels/DiscountCouponSync";
import ShippingFulfillment from "@/components/sales-channels/ShippingFulfillment";
import AnalyticsComparison from "@/components/sales-channels/AnalyticsComparison";
import AbandonedCarts from "@/components/sales-channels/AbandonedCarts";
import CustomerSegments from "@/components/sales-channels/CustomerSegments";
import NotificationTemplates from "@/components/sales-channels/NotificationTemplates";
import ProductCollections from "@/components/sales-channels/ProductCollections";
import GiftCards from "@/components/sales-channels/GiftCards";

/* â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface Channel {
  id: string;
  name: string;
  platform: "shopify" | "salla";
  icon: string;
  url: string;
  connected: boolean;
  lastSync: string;
  products: number;
  orders: number;
  revenue: number;
}

const initialChannels: Channel[] = [
  { id: "ch1", name: "My Shopify Store", platform: "shopify", icon: "ðŸ›’", url: "myshop.myshopify.com", connected: true, lastSync: "2 min ago", products: 128, orders: 342, revenue: 24800 },
  { id: "ch2", name: "Salla Ù…ØªØ¬Ø±ÙŠ", platform: "salla", icon: "ðŸª", url: "mystore.salla.sa", connected: true, lastSync: "5 min ago", products: 95, orders: 218, revenue: 18200 },
  { id: "ch3", name: "Second Shopify", platform: "shopify", icon: "ðŸ›’", url: "brand2.myshopify.com", connected: false, lastSync: "Never", products: 0, orders: 0, revenue: 0 },
];

interface SyncProduct {
  id: string;
  name: string;
  sku: string;
  channel: string;
  platform: "shopify" | "salla";
  status: "synced" | "pending" | "error";
  localStock: number;
  remoteStock: number;
  lastSynced: string;
}

const mockSyncProducts: SyncProduct[] = [
  { id: "sp1", name: "Wireless Mouse", sku: "WM-001", channel: "My Shopify Store", platform: "shopify", status: "synced", localStock: 45, remoteStock: 45, lastSynced: "2 min ago" },
  { id: "sp2", name: "Mechanical Keyboard", sku: "MK-002", channel: "My Shopify Store", platform: "shopify", status: "pending", localStock: 8, remoteStock: 12, lastSynced: "1 hr ago" },
  { id: "sp3", name: "USB-C Hub", sku: "UH-003", channel: "Salla Ù…ØªØ¬Ø±ÙŠ", platform: "salla", status: "synced", localStock: 5, remoteStock: 5, lastSynced: "5 min ago" },
  { id: "sp4", name: "Webcam HD", sku: "WC-004", channel: "Salla Ù…ØªØ¬Ø±ÙŠ", platform: "salla", status: "error", localStock: 24, remoteStock: 20, lastSynced: "3 hrs ago" },
  { id: "sp5", name: "Headphones", sku: "NH-009", channel: "My Shopify Store", platform: "shopify", status: "synced", localStock: 2, remoteStock: 2, lastSynced: "2 min ago" },
  { id: "sp6", name: "Desk Lamp", sku: "DL-005", channel: "Salla Ù…ØªØ¬Ø±ÙŠ", platform: "salla", status: "pending", localStock: 56, remoteStock: 50, lastSynced: "30 min ago" },
];

interface SyncOrder {
  id: string;
  orderId: string;
  channel: string;
  platform: "shopify" | "salla";
  customer: string;
  total: number;
  status: "fulfilled" | "pending" | "cancelled";
  syncStatus: "synced" | "pending" | "error";
  date: string;
}

const mockSyncOrders: SyncOrder[] = [
  { id: "so1", orderId: "#SH-1042", channel: "My Shopify Store", platform: "shopify", customer: "Ahmed Ali", total: 129.99, status: "fulfilled", syncStatus: "synced", date: "2026-02-19" },
  { id: "so2", orderId: "#SA-2085", channel: "Salla Ù…ØªØ¬Ø±ÙŠ", platform: "salla", customer: "Sara Khan", total: 89.50, status: "pending", syncStatus: "synced", date: "2026-02-19" },
  { id: "so3", orderId: "#SH-1041", channel: "My Shopify Store", platform: "shopify", customer: "Omar Hassan", total: 249.00, status: "fulfilled", syncStatus: "synced", date: "2026-02-18" },
  { id: "so4", orderId: "#SA-2084", channel: "Salla Ù…ØªØ¬Ø±ÙŠ", platform: "salla", customer: "Fatima Noor", total: 54.99, status: "cancelled", syncStatus: "error", date: "2026-02-18" },
  { id: "so5", orderId: "#SH-1040", channel: "My Shopify Store", platform: "shopify", customer: "Khalid Raza", total: 199.99, status: "fulfilled", syncStatus: "pending", date: "2026-02-17" },
];

/* â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const platformColor = (p: "shopify" | "salla") => p === "shopify" ? "bg-emerald-500/10 text-emerald-600" : "bg-violet-500/10 text-violet-600";
const platformBorder = (p: "shopify" | "salla") => p === "shopify" ? "border-emerald-500/30" : "border-violet-500/30";

const syncBadge = (s: "synced" | "pending" | "error") => {
  if (s === "synced") return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Synced</Badge>;
  if (s === "pending") return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
  return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><AlertCircle className="h-3 w-3" /> Error</Badge>;
};

const orderStatusBadge = (s: "fulfilled" | "pending" | "cancelled") => {
  if (s === "fulfilled") return <Badge variant="outline" className="text-success border-success/30">Fulfilled</Badge>;
  if (s === "pending") return <Badge variant="outline" className="text-warning border-warning/30">Pending</Badge>;
  return <Badge variant="outline" className="text-destructive border-destructive/30">Cancelled</Badge>;
};

/* â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const SalesChannels = () => {
  const [channels, setChannels] = useState(initialChannels);
  const [autoSync, setAutoSync] = useState(true);

  const toggleConnection = (id: string) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, connected: !ch.connected } : ch));
  };

  const totalRevenue = channels.filter(c => c.connected).reduce((s, c) => s + c.revenue, 0);
  const totalOrders = channels.filter(c => c.connected).reduce((s, c) => s + c.orders, 0);
  const totalProducts = channels.filter(c => c.connected).reduce((s, c) => s + c.products, 0);
  const connectedCount = channels.filter(c => c.connected).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Channels</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage Shopify & Salla store integrations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Auto-sync</span>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            <Button size="sm" variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Sync All</Button>
          </div>
        </div>

        <Tabs defaultValue="channels" className="space-y-5">
          <div className="overflow-x-auto -mx-1 px-1">
            <TabsList className="inline-flex w-auto min-w-full gap-1">
              <TabsTrigger value="channels" className="gap-1.5"><Store className="h-4 w-4" /> Stores</TabsTrigger>
              <TabsTrigger value="products" className="gap-1.5"><Package className="h-4 w-4" /> Products</TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5"><ClipboardList className="h-4 w-4" /> Orders</TabsTrigger>
              <TabsTrigger value="customers" className="gap-1.5"><Users className="h-4 w-4" /> Customers</TabsTrigger>
              <TabsTrigger value="abandoned-carts" className="gap-1.5"><ShoppingCart className="h-4 w-4" /> Abandoned Carts</TabsTrigger>
              <TabsTrigger value="collections" className="gap-1.5"><FolderOpen className="h-4 w-4" /> Collections</TabsTrigger>
              <TabsTrigger value="discounts" className="gap-1.5"><Tag className="h-4 w-4" /> Discounts</TabsTrigger>
              <TabsTrigger value="gift-cards" className="gap-1.5"><Gift className="h-4 w-4" /> Gift Cards</TabsTrigger>
              <TabsTrigger value="shipping" className="gap-1.5"><Truck className="h-4 w-4" /> Shipping</TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
              <TabsTrigger value="webhooks" className="gap-1.5"><Webhook className="h-4 w-4" /> Webhooks</TabsTrigger>
              <TabsTrigger value="import-export" className="gap-1.5"><FileSpreadsheet className="h-4 w-4" /> Import/Export</TabsTrigger>
              <TabsTrigger value="analytics" className="gap-1.5"><PieChart className="h-4 w-4" /> Analytics</TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-1.5"><BarChart3 className="h-4 w-4" /> Dashboard</TabsTrigger>
            </TabsList>
          </div>

          {/* â”€â”€ Store Connection â”€â”€ */}
          <TabsContent value="channels" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {channels.map(ch => (
                <Card key={ch.id} className={`border ${ch.connected ? platformBorder(ch.platform) : "border-border"} transition-all`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${platformColor(ch.platform)}`}>
                          {ch.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{ch.name}</CardTitle>
                          <CardDescription className="text-xs flex items-center gap-1">
                            <Globe className="h-3 w-3" /> {ch.url}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={platformColor(ch.platform)}>{ch.platform === "shopify" ? "Shopify" : "Salla"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ch.connected ? (
                      <>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg bg-muted/50 p-2">
                            <p className="text-lg font-bold text-foreground">{ch.products}</p>
                            <p className="text-[10px] text-muted-foreground">Products</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2">
                            <p className="text-lg font-bold text-foreground">{ch.orders}</p>
                            <p className="text-[10px] text-muted-foreground">Orders</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2">
                            <p className="text-lg font-bold text-foreground">${(ch.revenue / 1000).toFixed(1)}k</p>
                            <p className="text-[10px] text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Connected</span>
                          <span>Last sync: {ch.lastSync}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 gap-1"><RefreshCw className="h-3 w-3" /> Sync</Button>
                          <Button size="sm" variant="ghost" className="text-destructive gap-1" onClick={() => toggleConnection(ch.id)}><Unlink className="h-3 w-3" /> Disconnect</Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 space-y-3">
                        <p className="text-sm text-muted-foreground">Not connected</p>
                        <Button size="sm" className="gap-1" onClick={() => toggleConnection(ch.id)}><Link2 className="h-4 w-4" /> Connect Store</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Add new */}
              <Card className="border-dashed flex items-center justify-center min-h-[240px]">
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted"><Store className="h-6 w-6 text-muted-foreground" /></div>
                  <p className="text-sm font-medium text-foreground">Add Sales Channel</p>
                  <p className="text-xs text-muted-foreground">Connect a new Shopify or Salla store</p>
                  <Button size="sm" variant="outline">+ Add Store</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* â”€â”€ Product Sync â”€â”€ */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{mockSyncProducts.length} products tracked across channels</p>
              <Button size="sm" variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Sync Products</Button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Product</th>
                      <th className="p-4 font-medium">Channel</th>
                      <th className="p-4 font-medium">Local Stock</th>
                      <th className="p-4 font-medium">Remote Stock</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Last Synced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSyncProducts.map(p => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.sku}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`${platformColor(p.platform)} border ${platformBorder(p.platform)}`}>
                            {p.channel}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono text-foreground">{p.localStock}</td>
                        <td className="p-4 font-mono text-foreground">{p.remoteStock}</td>
                        <td className="p-4">{syncBadge(p.status)}</td>
                        <td className="p-4 text-muted-foreground">{p.lastSynced}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* â”€â”€ Order Sync â”€â”€ */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{mockSyncOrders.length} recent orders across channels</p>
              <Button size="sm" variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Sync Orders</Button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Order</th>
                      <th className="p-4 font-medium">Channel</th>
                      <th className="p-4 font-medium">Customer</th>
                      <th className="p-4 font-medium">Total</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Sync</th>
                      <th className="p-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSyncOrders.map(o => (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-foreground">{o.orderId}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`${platformColor(o.platform)} border ${platformBorder(o.platform)}`}>
                            {o.channel}
                          </Badge>
                        </td>
                        <td className="p-4 text-foreground">{o.customer}</td>
                        <td className="p-4 font-mono text-foreground">${o.total.toFixed(2)}</td>
                        <td className="p-4">{orderStatusBadge(o.status)}</td>
                        <td className="p-4">{syncBadge(o.syncStatus)}</td>
                        <td className="p-4 text-muted-foreground">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="customers"><CustomerSegments /></TabsContent>
          <TabsContent value="abandoned-carts"><AbandonedCarts /></TabsContent>
          <TabsContent value="collections"><ProductCollections /></TabsContent>
          <TabsContent value="discounts"><DiscountCouponSync /></TabsContent>
          <TabsContent value="gift-cards"><GiftCards /></TabsContent>
          <TabsContent value="shipping"><ShippingFulfillment /></TabsContent>
          <TabsContent value="notifications"><NotificationTemplates /></TabsContent>
          <TabsContent value="webhooks"><WebhookNotifications /></TabsContent>
          <TabsContent value="import-export"><CSVImportExport products={mockSyncProducts} /></TabsContent>
          <TabsContent value="analytics"><AnalyticsComparison /></TabsContent>

          {/* â”€â”€ Multi-channel Dashboard â”€â”€ */}
          <TabsContent value="dashboard" className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                  </div>
                  <p className="text-xs text-success mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +12.5% vs last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-success mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +8.3% vs last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Synced Products</p>
                      <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                      <Package className="h-5 w-5 text-violet-500" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{connectedCount} active channels</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sync Health</p>
                      <p className="text-2xl font-bold text-foreground">92%</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  </div>
                  <Progress value={92} className="mt-3 h-1.5" />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {channels.filter(c => c.connected).map(ch => (
                <Card key={ch.id} className={`border ${platformBorder(ch.platform)}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${platformColor(ch.platform)}`}>{ch.icon}</div>
                        <div>
                          <CardTitle className="text-base">{ch.name}</CardTitle>
                          <CardDescription className="text-xs">{ch.platform === "shopify" ? "Shopify" : "Salla"} Â· Last sync: {ch.lastSync}</CardDescription>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="gap-1 text-xs"><ExternalLink className="h-3 w-3" /> Open</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{ch.products}</p>
                        <p className="text-xs text-muted-foreground">Products</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{ch.orders}</p>
                        <p className="text-xs text-muted-foreground">Orders</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">${(ch.revenue / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Sync progress</span>
                        <span className="text-foreground font-medium">{ch.platform === "shopify" ? "95%" : "88%"}</span>
                      </div>
                      <Progress value={ch.platform === "shopify" ? 95 : 88} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SalesChannels;

