"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import {
  DollarSign, Users, TrendingUp, Store, Activity, ShieldCheck, Zap,
  ArrowUpRight, ArrowDownRight, CreditCard, Globe, Server, Search,
  Crown, Clock, AlertTriangle, CheckCircle2, Package, BarChart3,
  UserPlus, ShoppingBag, XCircle, RefreshCw, Star, Bell,
  Layers, ShoppingCart, Building2, Truck, Megaphone,
  FileText, Smartphone, CalendarDays, Rocket, Code2, MapPin,
  Check, Target, ChevronRight, Shield, Receipt, UserCog,
  LayoutGrid, Hash, Paintbrush, Code, Calendar, Wallet, Tag,
  Heart, MessageCircle, Gift, Repeat, Globe2, Map,
} from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const mrrData = [
  { month: "Sep", mrr: 42000, merchants: 38 },
  { month: "Oct", mrr: 58000, merchants: 52 },
  { month: "Nov", mrr: 73000, merchants: 67 },
  { month: "Dec", mrr: 89000, merchants: 81 },
  { month: "Jan", mrr: 112000, merchants: 96 },
  { month: "Feb", mrr: 134500, merchants: 112 },
];

const gmvData = [
  { month: "Sep", gmv: 890000, transactions: 4200 },
  { month: "Oct", gmv: 1120000, transactions: 5800 },
  { month: "Nov", gmv: 1450000, transactions: 7200 },
  { month: "Dec", gmv: 2100000, transactions: 11000 },
  { month: "Jan", gmv: 1780000, transactions: 8900 },
  { month: "Feb", gmv: 1950000, transactions: 9400 },
];

const planDistribution = [
  { name: "Starter", value: 34, color: "hsl(var(--muted-foreground))" },
  { name: "Business", value: 38, color: "hsl(217 91% 60%)" },
  { name: "Pro", value: 28, color: "hsl(var(--primary))" },
  { name: "Enterprise", value: 12, color: "hsl(38 92% 50%)" },
];

const paymentMethods = [
  { method: "Mada", share: 42, amount: 819000 },
  { method: "Visa/MC", share: 25, amount: 487500 },
  { method: "Apple Pay", share: 15, amount: 292500 },
  { method: "STC Pay", share: 8, amount: 156000 },
  { method: "Tamara (BNPL)", share: 6, amount: 117000 },
  { method: "COD", share: 4, amount: 78000 },
];

const recentMerchants = [
  { id: "m1", name: "Elegance Fashion", plan: "pro", gmv: 245000, orders: 1280, status: "active", joined: "2026-02-18", city: "Riyadh" },
  { id: "m2", name: "TechZone KSA", plan: "enterprise", gmv: 890000, orders: 4500, status: "active", joined: "2026-02-15", city: "Jeddah" },
  { id: "m3", name: "Oud & Rose", plan: "business", gmv: 67000, orders: 340, status: "active", joined: "2026-02-12", city: "Dammam" },
  { id: "m4", name: "Saudi Organic Co.", plan: "starter", gmv: 12000, orders: 89, status: "trial", joined: "2026-02-10", city: "Riyadh" },
  { id: "m5", name: "Gadget Hub", plan: "pro", gmv: 178000, orders: 920, status: "active", joined: "2026-02-08", city: "Riyadh" },
  { id: "m6", name: "Luxe Home", plan: "business", gmv: 54000, orders: 210, status: "active", joined: "2026-02-05", city: "Khobar" },
  { id: "m7", name: "Pet World SA", plan: "starter", gmv: 8000, orders: 45, status: "churned", joined: "2026-01-20", city: "Jeddah" },
  { id: "m8", name: "FitGear Pro", plan: "pro", gmv: 320000, orders: 1800, status: "active", joined: "2026-01-15", city: "Riyadh" },
];

const systemHealth = [
  { service: "API Gateway", status: "operational", uptime: "99.98%", latency: "42ms", errors: 3 },
  { service: "Payment Processing", status: "operational", uptime: "99.99%", latency: "180ms", errors: 0 },
  { service: "Storefront CDN", status: "operational", uptime: "99.97%", latency: "12ms", errors: 1 },
  { service: "Database Cluster", status: "operational", uptime: "99.99%", latency: "8ms", errors: 0 },
  { service: "Email Service", status: "degraded", uptime: "98.50%", latency: "850ms", errors: 24 },
  { service: "Webhook Delivery", status: "operational", uptime: "99.95%", latency: "95ms", errors: 5 },
];

const supportTickets = { open: 23, inProgress: 15, resolved: 142, avgResponse: "2.4h" };

interface PlatformEvent {
  id: string;
  type: "merchant_signup" | "payment" | "churn" | "upgrade" | "review" | "system";
  title: string;
  detail: string;
  time: string;
}

const seedEvents: PlatformEvent[] = [
  { id: "e1", type: "merchant_signup", title: "New Merchant Signup", detail: "Bloom Florists (Riyadh) joined on Business plan", time: "2m ago" },
  { id: "e2", type: "payment", title: "Payment Received", detail: "SAR 4,500 subscription from TechZone KSA", time: "5m ago" },
  { id: "e3", type: "upgrade", title: "Plan Upgrade", detail: "Gadget Hub upgraded Starter â†’ Pro", time: "12m ago" },
  { id: "e4", type: "review", title: "Store Review", detail: "Elegance Fashion rated 5â˜… by customer", time: "18m ago" },
  { id: "e5", type: "payment", title: "Payment Received", detail: "SAR 1,200 subscription from Oud & Rose", time: "25m ago" },
  { id: "e6", type: "churn", title: "Merchant Churned", detail: "Pet World SA cancelled subscription", time: "40m ago" },
  { id: "e7", type: "system", title: "System Alert", detail: "Email Service latency spike detected (850ms)", time: "1h ago" },
  { id: "e8", type: "merchant_signup", title: "New Merchant Signup", detail: "Desert Spice Co. (Jeddah) joined on Starter plan", time: "1.5h ago" },
  { id: "e9", type: "payment", title: "Payment Received", detail: "SAR 8,900 subscription from FitGear Pro", time: "2h ago" },
  { id: "e10", type: "upgrade", title: "Plan Upgrade", detail: "Saudi Organic Co. upgraded Starter â†’ Business", time: "3h ago" },
];

const liveEventPool: Omit<PlatformEvent, "id" | "time">[] = [
  { type: "merchant_signup", title: "New Merchant Signup", detail: "Quick Mart (Dammam) joined on Business plan" },
  { type: "payment", title: "Payment Received", detail: "SAR 2,800 subscription from Luxe Home" },
  { type: "upgrade", title: "Plan Upgrade", detail: "Oud & Rose upgraded Business â†’ Pro" },
  { type: "review", title: "Store Review", detail: "TechZone KSA rated 4â˜… by customer" },
  { type: "payment", title: "Payment Received", detail: "SAR 6,200 commission payout processed" },
  { type: "merchant_signup", title: "New Merchant Signup", detail: "Aroma Kitchen (Riyadh) joined on Starter plan" },
  { type: "system", title: "Webhook Retry", detail: "3 failed webhooks retried successfully" },
];

const eventConfig: Record<string, { icon: typeof UserPlus; color: string; bg: string }> = {
  merchant_signup: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  payment: { icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
  churn: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  upgrade: { icon: ArrowUpRight, color: "text-purple-500", bg: "bg-purple-500/10" },
  review: { icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  system: { icon: RefreshCw, color: "text-muted-foreground", bg: "bg-muted" },
};



// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PlanBadge = ({ plan }: { plan: string }) => {
  const styles: Record<string, string> = {
    starter: "bg-muted text-muted-foreground",
    business: "bg-blue-500/10 text-blue-600",
    pro: "bg-purple-500/10 text-purple-600",
    enterprise: "bg-amber-500/10 text-amber-600",
  };
  return <Badge className={`${styles[plan] || styles.starter} border-0 font-semibold capitalize`}>{plan}</Badge>;
};

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    active: "bg-emerald-500", verified: "bg-emerald-500",
    trial: "bg-blue-500", pending: "bg-amber-500",
    suspended: "bg-destructive", failed: "bg-destructive", expired: "bg-destructive",
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${colors[status] || "bg-muted"}`} />
      <span className="capitalize text-sm">{status}</span>
    </span>
  );
};

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PlatformDashboard = () => {
  const router = useRouter();
  const { formatShort } = useCurrency();
  const [feedFilter, setFeedFilter] = useState<string>("all");
  const [merchantSearch, setMerchantSearch] = useState("");
  const [period, setPeriod] = useState("feb");
  const [feedEvents, setFeedEvents] = useState<PlatformEvent[]>(seedEvents);


  // Simulate live events every 8-15 seconds
  useEffect(() => {
    let counter = seedEvents.length;
    const interval = setInterval(() => {
      const random = liveEventPool[Math.floor(Math.random() * liveEventPool.length)];
      counter++;
      setFeedEvents(prev => [
        { ...random, id: `live-${counter}`, time: "just now" },
        ...prev.slice(0, 19),
      ]);
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, []);

  const filteredMerchants = recentMerchants.filter(m =>
    m.name.toLowerCase().includes(merchantSearch.toLowerCase()) ||
    m.city.toLowerCase().includes(merchantSearch.toLowerCase())
  );

  const currentMRR = 134500;
  const prevMRR = 112000;
  const mrrGrowth = (((currentMRR - prevMRR) / prevMRR) * 100).toFixed(1);
  const arr = currentMRR * 12;
  const totalGMV = gmvData.reduce((s, d) => s + d.gmv, 0);
  const totalTx = gmvData.reduce((s, d) => s + d.transactions, 0);
  const churnRate = 2.3;
  const activeMerchants = recentMerchants.filter(m => m.status === "active").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        {/* â•â•â• HERO HEADER â•â•â• */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-border/60 p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    Platform Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">Unified Commerce SaaS â€” Real-time analytics & insights</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                  <span className="relative flex h-1.5 w-1.5 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>
                  All Systems Operational
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">â˜ï¸ Cloud SaaS</Badge>
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px]">ðŸ”’ Enterprise Grade</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-36 bg-card/80 backdrop-blur-sm border-border/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="feb">Feb 2026</SelectItem>
                  <SelectItem value="jan">Jan 2026</SelectItem>
                  <SelectItem value="dec">Dec 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* â•â•â• TOP KPI CARDS â•â•â• */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Monthly Revenue (MRR)", value: formatShort(currentMRR), change: `+${mrrGrowth}%`, up: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5", ring: "ring-1 ring-emerald-500/10" },
            { label: "Annual Run Rate (ARR)", value: formatShort(arr), change: "+20.1%", up: true, icon: TrendingUp, color: "text-blue-500", bg: "bg-gradient-to-br from-blue-500/15 to-blue-500/5", ring: "ring-1 ring-blue-500/10" },
            { label: "Active Merchants", value: `${activeMerchants}`, change: "+16 this month", up: true, icon: Store, color: "text-purple-500", bg: "bg-gradient-to-br from-purple-500/15 to-purple-500/5", ring: "ring-1 ring-purple-500/10" },
            { label: "Churn Rate", value: `${churnRate}%`, change: "-0.4%", up: false, icon: Users, color: "text-amber-500", bg: "bg-gradient-to-br from-amber-500/15 to-amber-500/5", ring: "ring-1 ring-amber-500/10" },
          ].map(kpi => (
            <Card key={kpi.label} className={`glass-card group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 ${kpi.ring}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                  <div className={`rounded-xl p-2.5 ${kpi.bg} transition-transform duration-300 group-hover:scale-110`}><kpi.icon className={`h-4.5 w-4.5 ${kpi.color}`} /></div>
                </div>
                <p className="text-3xl font-bold text-card-foreground tracking-tight">{kpi.value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {kpi.label === "Churn Rate" ? (
                    <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />
                  ) : kpi.up ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={`text-xs font-semibold ${kpi.label === "Churn Rate" ? "text-emerald-500" : kpi.up ? "text-emerald-500" : "text-destructive"}`}>{kpi.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* â•â•â• GMV ROW â•â•â• */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Platform GMV", value: formatShort(totalGMV), icon: Globe, color: "text-primary", bg: "bg-gradient-to-br from-primary/15 to-primary/5" },
            { label: "Total Transactions", value: totalTx.toLocaleString(), icon: CreditCard, color: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5" },
            { label: "Avg Order Value", value: formatShort(totalGMV / totalTx), icon: Package, color: "text-blue-500", bg: "bg-gradient-to-br from-blue-500/15 to-blue-500/5" },
            { label: "Platform Take Rate", value: "3.2%", icon: BarChart3, color: "text-violet-500", bg: "bg-gradient-to-br from-violet-500/15 to-violet-500/5" },
          ].map(kpi => (
            <Card key={kpi.label} className="glass-card group hover:shadow-md transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl p-3 ${kpi.bg} transition-transform duration-300 group-hover:scale-110`}><kpi.icon className={`h-5 w-5 ${kpi.color}`} /></div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-xl font-bold text-card-foreground tracking-tight">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* â•â•â• CHARTS ROW â•â•â• */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* MRR Growth */}
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  MRR Growth Trend
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">6 months</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mrrData}>
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="mrr" name="MRR (SAR)" stroke="hsl(var(--primary))" fill="url(#mrrGrad)" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="merchants" name="Merchants" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* GMV Trend */}
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Platform GMV & Transactions
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">Monthly</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gmvData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="gmv" name="GMV (SAR)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="transactions" name="Transactions" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ r: 3 }} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                Subscription Plan Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {planDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {planDistribution.map(p => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-sm text-card-foreground">{p.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-card-foreground">{p.value}</span>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-border flex justify-between text-xs text-muted-foreground">
                    <span>Total</span>
                    <span className="font-semibold text-card-foreground">{planDistribution.reduce((s, p) => s + p.value, 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                Payment Method Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map(pm => (
                  <div key={pm.method} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-card-foreground font-medium">{pm.method}</span>
                      <span className="text-muted-foreground">{pm.share}% Â· {formatShort(pm.amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pm.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* â•â•â• MERCHANTS TABLE â•â•â• */}
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                Merchant Directory
                <Badge variant="outline" className="text-[10px] ml-1">{recentMerchants.length} merchants</Badge>
              </CardTitle>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search merchants..." className="pl-9 h-8 text-sm" value={merchantSearch} onChange={e => setMerchantSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Merchant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>GMV</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map(m => (
                  <TableRow key={m.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-card-foreground">{m.name}</TableCell>
                    <TableCell><PlanBadge plan={m.plan} /></TableCell>
                    <TableCell className="font-semibold tabular-nums">{formatShort(m.gmv)}</TableCell>
                    <TableCell className="tabular-nums">{m.orders.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{m.city}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{m.joined}</TableCell>
                    <TableCell>
                      <Badge
                        variant={m.status === "active" ? "default" : m.status === "trial" ? "secondary" : "destructive"}
                        className="capitalize text-[10px]"
                      >
                        {m.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* â•â•â• SYSTEM HEALTH & SUPPORT â•â•â• */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* System Health */}
          <Card className="md:col-span-2 glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />System Health Monitor
                </CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">99.9% Overall</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Errors (24h)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemHealth.map(s => (
                    <TableRow key={s.service} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-card-foreground flex items-center gap-2">
                        <Server className="h-3.5 w-3.5 text-muted-foreground" />{s.service}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${s.status === "operational" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          <span className={`text-xs capitalize ${s.status === "operational" ? "text-emerald-600" : "text-amber-600"}`}>{s.status}</span>
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{s.uptime}</TableCell>
                      <TableCell className="font-mono text-sm">{s.latency}</TableCell>
                      <TableCell>
                        <span className={`font-mono text-sm ${s.errors > 10 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>{s.errors}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Support Tickets */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />Support Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Open Tickets", value: supportTickets.open, icon: AlertTriangle, color: "text-amber-500", bg: "bg-gradient-to-br from-amber-500/15 to-amber-500/5" },
                { label: "In Progress", value: supportTickets.inProgress, icon: Clock, color: "text-blue-500", bg: "bg-gradient-to-br from-blue-500/15 to-blue-500/5" },
                { label: "Resolved (Month)", value: supportTickets.resolved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5" },
                { label: "Avg Response", value: supportTickets.avgResponse, icon: Zap, color: "text-purple-500", bg: "bg-gradient-to-br from-purple-500/15 to-purple-500/5" },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-3 rounded-xl border border-border/60 p-3 hover:bg-accent/30 transition-colors">
                  <div className={`rounded-xl p-2.5 ${t.bg}`}><t.icon className={`h-4 w-4 ${t.color}`} /></div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{t.label}</p>
                    <p className="text-lg font-bold text-card-foreground">{t.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* â•â•â• TENANT CORE SAAS ROADMAP (Full) â•â•â• */}
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20">
                  <Rocket className="h-4 w-4 text-primary-foreground" />
                </div>
                Tenant Core SaaS Platform
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">42 Built âœ…</Badge>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">1 In Progress ðŸ”„</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="modules" className="w-full">
              <TabsList className="mb-4 flex-wrap bg-muted/50 p-1">
                <TabsTrigger value="modules" className="text-xs">Module Status</TabsTrigger>
                <TabsTrigger value="architecture" className="text-xs">Architecture</TabsTrigger>
                <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
              </TabsList>

              {/* â”€â”€ TAB: Module Status â”€â”€ */}
              <TabsContent value="modules" className="space-y-6">
                {[
                  { emoji: "ðŸ§±", title: "CORE PLATFORM", modules: [
                    { name: "Multi-Tenant SaaS Core", icon: Building2, status: "partial" as const, features: ["Tenant isolation", "Custom domain", "Feature flags", "Plan & billing engine", "Audit logs"], route: "/multi-tenant" },
                    { name: "Onboarding & Store Setup", icon: Globe, status: "built" as const, features: ["Business info wizard", "First product setup", "Payment connection", "Plan selection"], route: "/onboarding" },
                  ]},
                  { emoji: "ðŸ›ï¸", title: "E-COMMERCE CORE", modules: [
                    { name: "Storefront & CMS", icon: Paintbrush, status: "built" as const, features: ["Theme engine", "Theme gallery (10+)", "Store customizer", "Domain manager", "SEO"], route: "/storefront" },
                    { name: "Product & Catalog", icon: Package, status: "built" as const, features: ["Products (physical/digital)", "Variants & bundles", "SKU/barcode", "Inventory sync"], route: "/inventory" },
                    { name: "Order Management", icon: ShoppingBag, status: "built" as const, features: ["Order lifecycle", "COD", "Returns & exchange", "Invoice generation"], route: "/orders" },
                    { name: "Pages & Blog", icon: FileText, status: "built" as const, features: ["Static pages", "Blog", "Landing pages", "SEO meta"], route: "/pages-blog" },
                    { name: "SEO Manager", icon: Search, status: "built" as const, features: ["Meta editor", "Sitemap", "Schema markup", "Open Graph"], route: "/seo-manager" },
                  ]},
                  { emoji: "ðŸ’³", title: "PAYMENT ORCHESTRATION", modules: [
                    { name: "Payment Engine", icon: CreditCard, status: "built" as const, features: ["Visa/MC, Apple Pay, PayPal", "MADA, STC Pay, Tamara", "Country-based routing", "COD risk scoring"], route: "/payment-channels" },
                    { name: "Sadad Payment", icon: Wallet, status: "built" as const, features: ["Bill presentment", "Auto-reconciliation", "Payment confirmation"], route: "/saudi-services" },
                    { name: "Subscription Billing", icon: Repeat, status: "built" as const, features: ["Recurring billing", "Free trial", "Upgrades/downgrades", "Subscription analytics"], route: "/subscription-plans" },
                  ]},
                  { emoji: "ðŸšš", title: "SHIPPING & LOGISTICS", modules: [
                    { name: "Delivery Engine", icon: Truck, status: "built" as const, features: ["Shipping zones", "Rate calculator", "Courier APIs", "Tracking"], route: "/delivery" },
                    { name: "Tracking & Map View", icon: Map, status: "built" as const, features: ["Real-time tracking", "Gulf map view", "ETA calculation"], route: "/delivery" },
                  ]},
                  { emoji: "ðŸª", title: "MARKETPLACE & GROWTH", modules: [
                    { name: "Multi-Vendor Marketplace", icon: Store, status: "built" as const, features: ["Seller onboarding", "Commission rules", "Vendor payouts", "Dispute management"], route: "/marketplace" },
                    { name: "Marketing Campaigns", icon: Megaphone, status: "built" as const, features: ["Email/SMS/WhatsApp", "A/B testing", "Audience targeting"], route: "/marketing-channels" },
                    { name: "WhatsApp Commerce", icon: MessageCircle, status: "built" as const, features: ["Product catalog", "Order via chat", "Payment links"], route: "/whatsapp-commerce" },
                    { name: "Flash Sales & Affiliate", icon: Zap, status: "built" as const, features: ["Flash sales", "Affiliate program", "Referral tracking"], route: "/flash-sales" },
                    { name: "Gift Cards", icon: Gift, status: "built" as const, features: ["Digital gift cards", "Balance tracking", "Bulk generation"], route: "/sales-channels" },
                    { name: "Discount & Coupons", icon: Tag, status: "built" as const, features: ["Coupon generator", "Auto-apply rules", "Cross-channel sync"], route: "/sales-channels" },
                    { name: "Abandoned Cart Recovery", icon: ShoppingCart, status: "built" as const, features: ["Auto-detect", "Email/WhatsApp reminders", "Recovery analytics"], route: "/sales-channels" },
                  ]},
                  { emoji: "ðŸ§¾", title: "POS SYSTEM", modules: [
                    { name: "POS Module", icon: ShoppingBag, status: "built" as const, features: ["Web POS", "Offline (PWA)", "Barcode scanner", "Split payments", "Receipt printing"], route: "/pos" },
                  ]},
                  { emoji: "ðŸ‘¥", title: "CRM & CUSTOMER", modules: [
                    { name: "CRM Module", icon: Users, status: "built" as const, features: ["Customer profiles", "Purchase history", "Segmentation", "Support tickets"], route: "/crm" },
                    { name: "Loyalty & Rewards", icon: Heart, status: "built" as const, features: ["Points system", "Tiered rewards", "Referral bonuses"], route: "/loyalty" },
                    { name: "Customer Segments", icon: Users, status: "built" as const, features: ["Auto-segmentation", "RFM analysis", "VIP customers"], route: "/customer-insights" },
                    { name: "Reviews & Ratings", icon: Star, status: "built" as const, features: ["Product reviews", "Photo reviews", "Moderation"], route: "/product-reviews" },
                  ]},
                  { emoji: "ðŸ­", title: "ERP & OPERATIONS", modules: [
                    { name: "ERP Module", icon: Building2, status: "built" as const, features: ["Inventory & warehouse", "Purchase orders", "Invoicing", "VAT accounting"], route: "/finance" },
                    { name: "Expense Tracker", icon: Receipt, status: "built" as const, features: ["Categories", "Receipt upload", "Budget tracking"], route: "/expenses" },
                    { name: "Branch Management", icon: Building2, status: "built" as const, features: ["Multi-branch", "Inter-branch transfer", "Branch performance"], route: "/branches" },
                    { name: "Supplier Management", icon: Package, status: "built" as const, features: ["Supplier directory", "Performance tracking", "Bulk ordering"], route: "/suppliers" },
                    { name: "Multi-Currency & Tax", icon: Globe2, status: "built" as const, features: ["Multi-currency", "Auto exchange rates", "Tax profiles"], route: "/tax-currency" },
                  ]},
                  { emoji: "ðŸ‘¨â€ðŸ’¼", title: "HRM", modules: [
                    { name: "HRM Module", icon: UserCog, status: "built" as const, features: ["Employee records", "Attendance", "Payroll", "Leave management"], route: "/hr-staff" },
                    { name: "Staff Access & RBAC", icon: Shield, status: "built" as const, features: ["Role-based access", "Module-level permissions", "Activity log"], route: "/staff-access" },
                  ]},
                  { emoji: "ðŸ“Š", title: "ANALYTICS & AI", modules: [
                    { name: "Analytics Engine", icon: BarChart3, status: "built" as const, features: ["Sales dashboards", "Product performance", "VAT reports"], route: "/sales-report" },
                    { name: "Inventory Report", icon: Package, status: "built" as const, features: ["Stock levels", "Low stock alerts", "Valuation report"], route: "/inventory-report" },
                    { name: "Customer Insights", icon: Users, status: "built" as const, features: ["CLV", "Cohort analysis", "Churn prediction"], route: "/customer-insights" },
                  ]},
                  { emoji: "ðŸ”Œ", title: "APP ECOSYSTEM", modules: [
                    { name: "App Marketplace", icon: LayoutGrid, status: "built" as const, features: ["Third-party apps", "Install/uninstall", "App ratings"], route: "/app-marketplace" },
                    { name: "Developer Portal", icon: Code, status: "built" as const, features: ["API keys", "Webhooks", "Sandbox testing"], route: "/developer-portal" },
                    { name: "Webhook & Notifications", icon: Bell, status: "built" as const, features: ["Event subscriptions", "Retry logic", "Templates"], route: "/sales-channels" },
                    { name: "CSV Import/Export", icon: Hash, status: "built" as const, features: ["Product import", "Customer import", "Column mapping"], route: "/sales-channels" },
                  ]},
                  { emoji: "ðŸ”", title: "SECURITY & COMPLIANCE", modules: [
                    { name: "Security Layer", icon: Shield, status: "built" as const, features: ["SSL", "PCI-DSS", "Audit logs", "Fraud detection"], route: "/settings" },
                    { name: "ZATCA E-Invoicing", icon: Receipt, status: "built" as const, features: ["E-invoice", "QR code", "Phase 1 & 2 compliance"], route: "/zatca" },
                  ]},
                  { emoji: "ðŸ‡¸ðŸ‡¦", title: "SAUDI SERVICES", modules: [
                    { name: "Maroof Integration", icon: Shield, status: "built" as const, features: ["Store verification", "Trust badge", "Compliance"], route: "/saudi-services" },
                    { name: "National Address (SPL)", icon: MapPin, status: "built" as const, features: ["Address lookup", "Short address", "Auto-fill"], route: "/saudi-services" },
                    { name: "Sadad Payment", icon: Wallet, status: "built" as const, features: ["Bill presentment", "Payment matching"], route: "/saudi-services" },
                  ]},
                  { emoji: "ðŸ“…", title: "PRODUCTIVITY", modules: [
                    { name: "Calendar & Scheduling", icon: Calendar, status: "built" as const, features: ["Events", "Task scheduling", "Multi-view"], route: "/calendar" },
                    { name: "Audit Log", icon: FileText, status: "built" as const, features: ["Full activity log", "Export audit trail"], route: "/audit-log" },
                    { name: "PWA & Mobile Install", icon: Smartphone, status: "built" as const, features: ["Progressive Web App", "Offline support", "Push notifications"], route: "/install" },
                  ]},
                ].map(section => (
                  <div key={section.title}>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>{section.emoji}</span> {section.title}
                    </h4>
                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {section.modules.map(mod => {
                        const stMap = {
                          built: { badge: "bg-emerald-500/10 text-emerald-600", label: "Built âœ…" },
                          partial: { badge: "bg-amber-500/10 text-amber-600", label: "In Progress ðŸ”„" },
                          planned: { badge: "bg-muted text-muted-foreground", label: "Planned ðŸ“‹" },
                        };
                        const st = stMap[mod.status];
                        return (
                          <div
                            key={mod.name}
                            onClick={() => router.push(mod.route)}
                            className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-accent/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="rounded-lg p-2 bg-primary/10 shrink-0">
                              <mod.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-sm font-medium text-card-foreground truncate">{mod.name}</p>
                                <Badge className={`${st.badge} border-0 text-[9px] px-1.5 shrink-0`}>{st.label}</Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">{mod.features.join(" Â· ")}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </TabsContent>




              {/* â”€â”€ TAB: Architecture â”€â”€ */}
              <TabsContent value="architecture" className="space-y-4">
                <div className="rounded-xl border border-border p-5 space-y-4">
                  <h4 className="text-sm font-bold text-card-foreground">5-Layer System Architecture</h4>
                  {[
                    { layer: "Layer 1", name: "Multi-Tenant SaaS Core", desc: "Tenant isolation, subdomain routing, feature flags, billing engine", color: "bg-purple-500" },
                    { layer: "Layer 2", name: "E-Commerce + POS + CRM", desc: "Storefront, catalog, orders, POS, customer management, loyalty", color: "bg-blue-500" },
                    { layer: "Layer 3", name: "ERP + HRM + Finance", desc: "Inventory, warehouse, suppliers, purchase orders, HR, payroll, VAT", color: "bg-emerald-500" },
                    { layer: "Layer 4", name: "Marketplace + Growth", desc: "Multi-vendor, marketing, WhatsApp commerce, flash sales, affiliate", color: "bg-amber-500" },
                    { layer: "Layer 5", name: "API + Apps + Security", desc: "Developer portal, app marketplace, webhooks, ZATCA, Saudi compliance", color: "bg-red-500" },
                  ].map((l, i) => (
                    <div key={l.layer} className="flex items-center gap-3">
                      <div className={`h-10 w-1 rounded-full ${l.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{l.layer}</Badge>
                          <span className="text-sm font-semibold text-card-foreground">{l.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Flow */}
                <div className="rounded-xl border border-border p-5 space-y-3">
                  <h4 className="text-sm font-bold text-card-foreground">ðŸ’³ Payment Routing Logic</h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {["Country", "â†’", "Amount", "â†’", "Device", "â†’", "Risk", "â†’", "Payment Methods"].map((item, i) => (
                      item === "â†’"
                        ? <ChevronRight key={i} className="h-4 w-4 text-primary" />
                        : <Badge key={i} className="bg-primary/10 text-primary border-primary/30 px-2.5 py-1 text-[11px]">{item}</Badge>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">ðŸŒ Global</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Visa/MC", "Apple Pay", "Google Pay", "PayPal"].map(m => (
                          <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">ðŸ‡¸ðŸ‡¦ Saudi / ME</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["MADA", "STC Pay", "Tamara", "Tabby", "COD"].map(m => (
                          <Badge key={m} className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">{m}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why This Model Wins */}
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { icon: "âœ…", text: "Saudi-first (Salla power)", desc: "ZATCA, MADA, STC Pay, Sadad, Maroof" },
                    { icon: "âœ…", text: "Global-ready (Shopify scale)", desc: "Multi-currency, multi-language, global gateways" },
                    { icon: "âœ…", text: "POS + CRM + ERP + HRM unified", desc: "No data silos, one platform" },
                    { icon: "âœ…", text: "Modular (sell add-ons)", desc: "Each module = independent revenue stream" },
                    { icon: "âœ…", text: "Middle East expansion ready", desc: "COD, RTL, Islamic calendar, local couriers" },
                  ].map(item => (
                    <div key={item.text} className="flex items-start gap-2 rounded-lg border border-border p-3">
                      <span className="text-sm shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-card-foreground">{item.text}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* â”€â”€ TAB: Pricing â”€â”€ */}
              <TabsContent value="pricing">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { name: "Starter", price: "0", target: "Small sellers", icon: Zap, features: ["Storefront + Payments", "Up to 50 products", "Basic analytics", "Email support"] },
                    { name: "Business", price: "99", target: "Growing brands", icon: Target, features: ["POS Terminal", "CRM + Loyalty", "Unlimited products", "Multi-currency"], popular: true },
                    { name: "Pro", price: "299", target: "Marketplace", icon: Crown, features: ["ERP Module", "Multi-vendor", "Custom domain", "API access"] },
                    { name: "Enterprise", price: "Custom", target: "Large org", icon: Rocket, features: ["HRM Module", "Full API", "White-label", "SLA guarantee"] },
                  ].map(plan => {
                    const Icon = plan.icon;
                    return (
                      <div key={plan.name} className={`rounded-xl border p-4 text-center space-y-3 ${plan.popular ? "border-primary shadow-sm shadow-primary/10" : "border-border"}`}>
                        {plan.popular && <Badge className="bg-primary text-primary-foreground text-[9px]">Most Popular</Badge>}
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold text-card-foreground">{plan.name}</p>
                        <p className="text-[10px] text-muted-foreground">{plan.target}</p>
                        <p className="text-2xl font-bold text-card-foreground">
                          {plan.price === "Custom" ? "Custom" : `SAR ${plan.price}`}
                          {plan.price !== "Custom" && <span className="text-xs text-muted-foreground font-normal">/mo</span>}
                        </p>
                        <ul className="space-y-1.5 text-start">
                          {plan.features.map(f => (
                            <li key={f} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Check className="h-3 w-3 text-emerald-500 shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* â”€â”€ TAB: Timeline â”€â”€ */}
              <TabsContent value="timeline">
                <div className="relative ml-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
                  {[
                    { quarter: "Q1 2026", label: "Completed", items: ["POS, Inventory, Orders, CRM, Finance launched", "ZATCA & Saudi compliance certified", "Storefront builder with 12 themes", "Marketplace & WhatsApp Commerce", "Developer Portal & API Gateway"], color: "bg-emerald-500" },
                    { quarter: "Q2 2026", label: "In Progress", items: ["Multi-Tenant SaaS Core (isolation, billing)", "Delivery tracking with live map", "Marketing AI & campaign automation"], color: "bg-blue-500" },
                    { quarter: "Q3 2026", label: "Planned", items: ["B2B wholesale portal", "Advanced analytics & BI dashboards", "Native mobile app (iOS/Android)"], color: "bg-amber-500" },
                    { quarter: "Q4 2026", label: "Roadmap", items: ["Multi-currency & international expansion", "AI-powered inventory forecasting", "White-label enterprise tier"], color: "bg-muted-foreground/50" },
                  ].map((q, i) => (
                    <div key={q.quarter} className="relative pl-6 pb-6 last:pb-0">
                      <div className={`absolute left-0 top-1 h-3 w-3 rounded-full ${q.color} -translate-x-[5px] ring-4 ring-card`} />
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-bold text-card-foreground">{q.quarter}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5">{q.label}</Badge>
                      </div>
                      <ul className="space-y-1">
                        {q.items.map(item => (
                          <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <CheckCircle2 className={`h-3 w-3 mt-0.5 shrink-0 ${i === 0 ? "text-emerald-500" : "text-muted-foreground/40"}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* â•â•â• REAL-TIME PLATFORM ACTIVITY FEED â•â•â• */}
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                </div>
                Real-time Platform Activity
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </CardTitle>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "all", label: "All" },
                  { key: "merchant_signup", label: "Merchants" },
                  { key: "payment", label: "Payments" },
                  { key: "upgrade", label: "Upgrades" },
                  { key: "churn", label: "Churn" },
                  { key: "review", label: "Reviews" },
                  { key: "system", label: "System" },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFeedFilter(f.key)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      feedFilter === f.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[420px] overflow-y-auto divide-y divide-border/50">
              {feedEvents
                .filter(ev => feedFilter === "all" || ev.type === feedFilter)
                .map((ev) => {
                  const cfg = eventConfig[ev.type] || eventConfig.system;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={ev.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors ${ev.time === "just now" ? "bg-primary/5 animate-fade-in" : ""}`}
                    >
                      <div className={`mt-0.5 rounded-lg p-2 ${cfg.bg}`}>
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">{ev.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{ev.detail}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground/70 whitespace-nowrap mt-0.5">{ev.time}</span>
                    </div>
                  );
                })}
              {feedEvents.filter(ev => feedFilter === "all" || ev.type === feedFilter).length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">No events for this filter</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlatformDashboard;

