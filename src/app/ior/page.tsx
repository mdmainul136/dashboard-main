"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    ClipboardList, TrendingUp, Clock, ShieldCheck,
    Truck, Globe, Zap, AlertCircle, ShoppingBag,
    ArrowUpRight, Package, Calculator, BarChart3,
    Calendar, Layers, Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIorDashboard } from "@/hooks/ior/useIorDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { IorMetricCard } from "@/components/ior/IorMetricCard";
import { IorSupplyChainChart } from "@/components/ior/IorSupplyChainChart";
import { MilestoneTimeline } from "@/components/ior/MilestoneTimeline";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "@/components/ui/table";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function IorDashboardPage() {
    const { stats, isLoading } = useIorDashboard();

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-pulse">
                    <div className="flex flex-col gap-4 border-b border-border pb-8">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 bg-card border-border rounded-xl" />)}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!stats) return null;

    const marketplaceData = Object.entries(stats.marketplace_breakdown).map(([name, value]) => ({ name, value }));
    const recentMilestones = stats.recent_orders?.[0]?.milestones || [];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                                    <Globe className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold tracking-widest uppercase">
                                    Enterprise Controller
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Supply Chain Intelligence</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Real-time global sourcing telemetry, HS-Code governance, and automated international logistics orchestration.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="h-10 border-border bg-card text-foreground hover:bg-secondary rounded-xl px-6 text-sm font-semibold" asChild>
                                <Link href="/ior/settings">
                                    <ShieldCheck className="mr-2 h-4 w-4 text-success" />
                                    System Config
                                </Link>
                            </Button>
                            <Button className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 shadow-lg shadow-primary/20 transition-all font-semibold text-sm" asChild>
                                <Link href="/ior/scraper">
                                    <Zap className="mr-2 h-4 w-4" />
                                    Smart Scraper
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* KPI Matrix */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <IorMetricCard
                            title="Order Volume"
                            value={stats.orders.total.toLocaleString()}
                            change={12.5}
                            positive={true}
                            icon={ClipboardList}
                            gradient="from-blue-600 to-indigo-600"
                        />
                        <IorMetricCard
                            title="Settled Revenue"
                            value={`৳${(stats.revenue.total / 1000).toFixed(1)}k`}
                            change={8.2}
                            positive={true}
                            icon={TrendingUp}
                            gradient="from-emerald-600 to-teal-600"
                        />
                        <IorMetricCard
                            title="Active Shipments"
                            value={stats.orders.active}
                            change={4.1}
                            positive={false}
                            icon={Truck}
                            gradient="from-amber-600 to-orange-600"
                        />
                        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Exchange Rate</p>
                                <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-bold text-foreground tabular-nums">৳{stats.exchange_rate}</p>
                                <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase">Live Swift</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-medium">Buffer: 2.5% applied</p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-12">
                        {/* Primary Analytics */}
                        <div className="md:col-span-8 space-y-8">
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)]">
                                <IorSupplyChainChart />
                            </div>

                            {/* Live Ledger */}
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-6 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Layers className="h-5 w-5 text-primary" />
                                        <h3 className="text-base font-bold text-foreground">Transaction Stream</h3>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5" asChild>
                                        <Link href="/ior/orders">
                                            Full Audit Log <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/50">
                                            <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">ID</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Product</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Lifecycle</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-right pr-6">Settlement</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats.recent_orders.map((o) => (
                                            <TableRow key={o.id} className="group hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-6 py-4 font-mono text-xs font-bold text-primary">#{o.order_number}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground truncate max-w-[250px]">{o.product_name}</span>
                                                        <span className="text-[10px] text-muted-foreground">{o.customer_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={cn(
                                                        "text-[9px] font-bold uppercase border-none",
                                                        o.status === 'delivered' ? "bg-success/10 text-success" :
                                                            o.status === 'customs' ? "bg-purple-500/10 text-purple-600" :
                                                                o.status === 'shipped' ? "bg-blue-500/10 text-blue-600" :
                                                                    "bg-muted text-muted-foreground"
                                                    )}>
                                                        {o.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 tabular-nums text-sm font-bold">
                                                    ৳{o.amount.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Secondary Analytics */}
                        <div className="md:col-span-4 space-y-8">
                            {/* Inventory Distribution */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">Marketplace Volume</h3>
                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={marketplaceData}
                                                innerRadius={65}
                                                outerRadius={85}
                                                paddingAngle={6}
                                                dataKey="value"
                                            >
                                                {marketplaceData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    {marketplaceData.map((m, i) => (
                                        <div key={m.name} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-xs font-semibold text-muted-foreground">{m.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Logistics Stream */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Logistics Radar</h3>
                                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                </div>
                                <MilestoneTimeline milestones={recentMilestones} />
                                <Button variant="outline" className="mt-6 w-full h-10 rounded-xl border-border bg-secondary/50 text-xs font-semibold">
                                    Track Global Fleet
                                </Button>
                            </div>

                            {/* ZATCA Stage 2 */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success/10 rounded-lg text-success">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <h4 className="text-sm font-bold">ZATCA Stage 2</h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                    Inbound Saudi transactions are hashed and synced to the clearance gateway.
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-success w-[100%]" />
                                    </div>
                                    <span className="text-[10px] font-bold text-success">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
