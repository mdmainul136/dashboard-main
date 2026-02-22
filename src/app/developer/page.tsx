"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Key, Copy, Eye, EyeOff, RefreshCw, Code2, Webhook, BookOpen,
  Terminal, CheckCircle2, Clock, XCircle, Plus, Trash2, Globe,
  ShoppingCart, Package, Users, CreditCard, ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DeveloperPortal = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { toast } = useToast();

  const [showSecret, setShowSecret] = useState(false);
  const [apiKeys] = useState([
    { id: "key_live_sa_1a2b3c4d5e", name: "Production Key", type: "live", created: "2026-01-15", lastUsed: "2026-02-19", status: "active" },
    { id: "key_test_sa_9z8y7x6w5v", name: "Test Key", type: "test", created: "2026-02-01", lastUsed: "2026-02-18", status: "active" },
  ]);

  const [webhooks] = useState([
    { id: "wh_01", url: "https://myapp.com/webhooks/orders", events: ["order.created", "order.updated"], status: "active", lastTriggered: "2 min ago" },
    { id: "wh_02", url: "https://myapp.com/webhooks/inventory", events: ["product.stock_changed"], status: "active", lastTriggered: "15 min ago" },
    { id: "wh_03", url: "https://erp.company.sa/api/sync", events: ["order.fulfilled", "payment.received"], status: "failed", lastTriggered: "1 hour ago" },
  ]);

  const apiEndpoints = [
    { method: "GET", path: "/api/v1/products", description: isAr ? "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª" : "List all products", icon: <Package className="h-4 w-4" /> },
    { method: "POST", path: "/api/v1/products", description: isAr ? "Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬" : "Create a product", icon: <Package className="h-4 w-4" /> },
    { method: "GET", path: "/api/v1/orders", description: isAr ? "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø·Ù„Ø¨Ø§Øª" : "List all orders", icon: <ShoppingCart className="h-4 w-4" /> },
    { method: "POST", path: "/api/v1/orders", description: isAr ? "Ø¥Ù†Ø´Ø§Ø¡ Ø·Ù„Ø¨" : "Create an order", icon: <ShoppingCart className="h-4 w-4" /> },
    { method: "GET", path: "/api/v1/customers", description: isAr ? "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡" : "List customers", icon: <Users className="h-4 w-4" /> },
    { method: "POST", path: "/api/v1/payments/charge", description: isAr ? "ØªØ­ØµÙŠÙ„ Ø¯ÙØ¹Ø©" : "Charge a payment", icon: <CreditCard className="h-4 w-4" /> },
    { method: "GET", path: "/api/v1/inventory", description: isAr ? "Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø®Ø²ÙˆÙ†" : "Inventory status", icon: <Package className="h-4 w-4" /> },
    { method: "POST", path: "/api/v1/webhooks", description: isAr ? "ØªØ³Ø¬ÙŠÙ„ ÙˆÙŠØ¨ Ù‡ÙˆÙƒ" : "Register webhook", icon: <Webhook className="h-4 w-4" /> },
  ];

  const methodColor: Record<string, string> = {
    GET: "bg-green-500/10 text-green-600 border-green-500/30",
    POST: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    PUT: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    DELETE: "bg-red-500/10 text-red-600 border-red-500/30",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: isAr ? "ØªÙ… Ø§Ù„Ù†Ø³Ø®" : "Copied!", description: text.slice(0, 30) + "..." });
  };

  const usageStats = {
    totalCalls: 24580,
    todayCalls: 1342,
    avgLatency: 45,
    errorRate: 0.3,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isAr ? "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…Ø·ÙˆØ±ÙŠÙ†" : "Developer Portal"}
          </h1>
          <p className="text-muted-foreground">
            {isAr ? "Ù…ÙØ§ØªÙŠØ­ APIØŒ Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚ØŒ ÙˆØ§Ù„ÙˆÙŠØ¨ Ù‡ÙˆÙƒØ³" : "API keys, documentation & webhooks"}
          </p>
        </div>

        {/* Usage Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{usageStats.totalCalls.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{isAr ? "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨Ø§Øª" : "Total API Calls"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{usageStats.todayCalls.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{isAr ? "Ø·Ù„Ø¨Ø§Øª Ø§Ù„ÙŠÙˆÙ…" : "Today's Calls"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{usageStats.avgLatency}ms</p>
              <p className="text-xs text-muted-foreground">{isAr ? "Ù…ØªÙˆØ³Ø· Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø©" : "Avg Latency"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{usageStats.errorRate}%</p>
              <p className="text-xs text-muted-foreground">{isAr ? "Ù†Ø³Ø¨Ø© Ø§Ù„Ø£Ø®Ø·Ø§Ø¡" : "Error Rate"}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keys" className="gap-2"><Key className="h-4 w-4" />{isAr ? "Ø§Ù„Ù…ÙØ§ØªÙŠØ­" : "API Keys"}</TabsTrigger>
            <TabsTrigger value="docs" className="gap-2"><BookOpen className="h-4 w-4" />{isAr ? "Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚" : "Docs"}</TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2"><Webhook className="h-4 w-4" />{isAr ? "ÙˆÙŠØ¨ Ù‡ÙˆÙƒØ³" : "Webhooks"}</TabsTrigger>
            <TabsTrigger value="sandbox" className="gap-2"><Terminal className="h-4 w-4" />{isAr ? "ØªØ¬Ø±Ø¨Ø©" : "Sandbox"}</TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{isAr ? "Ù…ÙØ§ØªÙŠØ­ API" : "API Keys"}</h2>
              <Button className="gap-2"><Plus className="h-4 w-4" />{isAr ? "Ù…ÙØªØ§Ø­ Ø¬Ø¯ÙŠØ¯" : "New Key"}</Button>
            </div>
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${key.type === "live" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                    <Key className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{key.name}</p>
                      <Badge variant="outline" className={`text-[10px] ${key.type === "live" ? "border-green-500 text-green-600" : "border-yellow-500 text-yellow-600"}`}>
                        {key.type === "live" ? "Live" : "Test"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs font-mono text-muted-foreground">
                        {showSecret ? key.id : key.id.slice(0, 12) + "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
                      </code>
                      <button onClick={() => setShowSecret(!showSecret)} className="text-muted-foreground hover:text-foreground">
                        {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => copyToClipboard(key.id)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {isAr ? "Ø¢Ø®Ø± Ø§Ø³ØªØ®Ø¯Ø§Ù…" : "Last used"}: {key.lastUsed}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1"><RefreshCw className="h-3.5 w-3.5" />{isAr ? "ØªØ¯ÙˆÙŠØ±" : "Rotate"}</Button>
                    <Button variant="outline" size="sm" className="text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* API Docs Tab */}
          <TabsContent value="docs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  {isAr ? "Ù†Ù‚Ø§Ø· Ø§Ù„Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ù…ØªØ§Ø­Ø©" : "Available Endpoints"}
                </CardTitle>
                <CardDescription>
                  {isAr ? "Base URL: https://api.tailadmin.sa/v1" : "Base URL: https://api.tailadmin.sa/v1"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {apiEndpoints.map((ep, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border/30 p-3 transition-colors hover:bg-muted/30 cursor-pointer group">
                      {ep.icon}
                      <Badge variant="outline" className={`font-mono text-[10px] ${methodColor[ep.method]}`}>
                        {ep.method}
                      </Badge>
                      <code className="text-sm font-mono text-foreground flex-1">{ep.path}</code>
                      <span className="text-xs text-muted-foreground">{ep.description}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Code Example */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{isAr ? "Ù…Ø«Ø§Ù„ Ø³Ø±ÙŠØ¹" : "Quick Example"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg bg-muted/50 p-4">
                  <Button variant="ghost" size="sm" className="absolute top-2 end-2 gap-1" onClick={() => copyToClipboard(`curl -X GET https://api.tailadmin.sa/v1/products \\\n  -H "Authorization: Bearer YOUR_API_KEY"`)}>
                    <Copy className="h-3.5 w-3.5" />{isAr ? "Ù†Ø³Ø®" : "Copy"}
                  </Button>
                  <pre className="text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
{`curl -X GET https://api.tailadmin.sa/v1/products \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Response
{
  "data": [
    {
      "id": "prod_001",
      "name": "Premium Arabic Coffee",
      "name_ar": "Ù‚Ù‡ÙˆØ© Ø¹Ø±Ø¨ÙŠØ© ÙØ§Ø®Ø±Ø©",
      "price": 89.00,
      "currency": "SAR",
      "stock": 150
    }
  ],
  "meta": { "total": 45, "page": 1 }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{isAr ? "Ø§Ù„ÙˆÙŠØ¨ Ù‡ÙˆÙƒØ³" : "Webhooks"}</h2>
              <Button className="gap-2"><Plus className="h-4 w-4" />{isAr ? "Ø¥Ø¶Ø§ÙØ© ÙˆÙŠØ¨ Ù‡ÙˆÙƒ" : "Add Webhook"}</Button>
            </div>
            {webhooks.map((wh) => (
              <Card key={wh.id} className={wh.status === "failed" ? "border-red-500/30" : ""}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                      wh.status === "active" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}>
                      {wh.status === "active" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-foreground truncate">{wh.url}</code>
                        <Badge variant="outline" className={`text-[10px] ${wh.status === "active" ? "border-green-500 text-green-600" : "border-red-500 text-red-600"}`}>
                          {wh.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {wh.events.map((ev) => (
                          <Badge key={ev} variant="secondary" className="text-[10px] font-mono">{ev}</Badge>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {isAr ? "Ø¢Ø®Ø± ØªØ´ØºÙŠÙ„" : "Last triggered"}: {wh.lastTriggered}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Sandbox Tab */}
          <TabsContent value="sandbox" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  {isAr ? "Ø¨ÙŠØ¦Ø© Ø§Ù„ØªØ¬Ø±Ø¨Ø©" : "API Sandbox"}
                </CardTitle>
                <CardDescription>{isAr ? "Ø¬Ø±Ù‘Ø¨ Ø·Ù„Ø¨Ø§Øª API Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ù† Ù‡Ù†Ø§" : "Test API requests directly from here"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>{isAr ? "Ø§Ù„Ø·Ø±ÙŠÙ‚Ø©" : "Method"}</Label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>GET</option>
                      <option>POST</option>
                      <option>PUT</option>
                      <option>DELETE</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{isAr ? "Ù†Ù‚Ø·Ø© Ø§Ù„Ù†Ù‡Ø§ÙŠØ©" : "Endpoint"}</Label>
                    <Input defaultValue="/api/v1/products" className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{isAr ? "Ø¬Ø³Ù… Ø§Ù„Ø·Ù„Ø¨ (JSON)" : "Request Body (JSON)"}</Label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono min-h-[100px] resize-y"
                    defaultValue={'{\n  "name": "Test Product",\n  "price": 99.00\n}'}
                  />
                </div>
                <Button className="gap-2">
                  <Globe className="h-4 w-4" />
                  {isAr ? "Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨" : "Send Request"}
                </Button>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">{isAr ? "Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø©" : "Response"}</p>
                  <pre className="text-xs font-mono text-foreground whitespace-pre">
{`{
  "status": 200,
  "data": {
    "id": "prod_new_001",
    "name": "Test Product",
    "price": 99.00,
    "currency": "SAR",
    "created_at": "2026-02-19T10:30:00Z"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperPortal;

