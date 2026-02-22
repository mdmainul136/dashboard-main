"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ShieldCheck, Globe, Gavel, Settings2, Lock, AlertTriangle,
    CheckCircle2, RefreshCcw, Plus, Activity, Database, Zap,
    Scale, Trash2, ExternalLink, Search, Server, ShieldAlert,
    ShoppingCart, MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RestrictedItemModal } from "@/components/ior/RestrictedItemModal";
import { useIorSourcing } from "@/hooks/ior/useIorSourcing";
import { cn } from "@/lib/utils";

export default function IorSourcingAdminPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
    const {
        stats,
        pendingItems,
        isProcessing,
        fetchSourcingStats,
        fetchPendingItems,
        approveItem,
        rewriteItem,
        blockSku,
        blockDomain
    } = useIorSourcing();

    useEffect(() => {
        fetchSourcingStats();
        fetchPendingItems();
    }, [fetchSourcingStats, fetchPendingItems]);

    const marketplaceHealth = stats?.marketplace_health || {};

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold tracking-widest uppercase">
                                    Global Governance
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Sourcing Control Center</h1>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                Administrative hub for marketplace health, automated quality control, proxy infrastructure, and platform-wide security protocols.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="rounded-xl h-10 text-xs font-semibold gap-2">
                                <RefreshCcw className={cn("h-4 w-4", isProcessing && "animate-spin")} onClick={fetchSourcingStats} /> Sync Node
                            </Button>
                            <Button className="bg-foreground dark:bg-card hover:bg-foreground/90 text-white rounded-xl font-semibold h-10 px-6 text-sm">
                                System Settings
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="bg-secondary/50 p-1 rounded-xl w-fit mb-8 border border-border">
                            <TabsTrigger value="overview" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Operations
                            </TabsTrigger>
                            <TabsTrigger value="qc" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm relative">
                                QC Queue
                                {pendingItems?.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-background">
                                        {pendingItems.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="proxy" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Proxy Vault
                            </TabsTrigger>
                            <TabsTrigger value="security" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Security Hub
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="animate-in fade-in duration-500 space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Scrapes", value: stats?.total_scrapes?.toLocaleString() || "1.2M", icon: Globe, pColor: "text-blue-500", trend: "+12%" },
                                    { label: "Success Rate", value: (stats?.success_rate || "98.4") + "%", icon: Zap, pColor: "text-amber-500", trend: "Stable" },
                                    { label: "Scraping Cost", value: "$" + (stats?.cost_mtd || "4,250"), icon: Scale, pColor: "text-indigo-500", trend: "-5%" },
                                    { label: "Proxy Uptime", value: (stats?.proxy_status || "99.9") + "%", icon: ShieldCheck, pColor: "text-success", trend: "Elite" },
                                ].map(s => (
                                    <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                                            <s.icon className={cn("h-4 w-4", s.pColor)} />
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                            <span className="text-[10px] font-bold text-success">{s.trend}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                    <div className="p-6 border-b border-border">
                                        <h3 className="text-base font-bold text-foreground">Marketplace Health</h3>
                                        <p className="text-xs text-muted-foreground">Real-time status of foreign market crawlers.</p>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        {["Amazon", "Walmart", "AliExpress", "eBay", "Target"].map(name => (
                                            <div key={name} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                                    <span className="text-sm font-semibold">{name}</span>
                                                </div>
                                                <Badge variant="outline" className="text-[9px] font-bold tracking-widest uppercase bg-success/5 text-success border-success/10">Active</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Platform Pricing Policy</h3>
                                            <p className="text-xs text-muted-foreground">Global margins and calculation rules.</p>
                                        </div>
                                        <Settings2 className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-row items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Standard Margin</p>
                                            <p className="text-xs text-muted-foreground font-medium">Applied to non-enterprise tenants.</p>
                                        </div>
                                        <span className="text-2xl font-black text-primary">15%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl border border-border bg-secondary/20">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">FX Buffer</p>
                                            <p className="text-lg font-bold text-foreground">2.5%</p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-border bg-secondary/20">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Min. Shipping</p>
                                            <p className="text-lg font-bold text-foreground">$12.00</p>
                                        </div>
                                    </div>
                                    <Button className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20">
                                        Update Policy Matrix
                                    </Button>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="qc" className="animate-in fade-in duration-500">
                            <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-6 border-b border-border flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Approval Queue</h3>
                                        <p className="text-xs text-muted-foreground">Review and moderate products before tenant injection.</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg text-xs font-semibold gap-2" onClick={fetchPendingItems}>
                                        <RefreshCcw className={cn("h-3.5 w-3.5", isProcessing && "animate-spin")} /> Refresh Queue
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/50">
                                            <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Product Payload</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Source</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">AI Status</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-right pr-6">Management</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingItems?.length > 0 ? (
                                            pendingItems.map((item) => (
                                                <TableRow key={item.id} className="group hover:bg-accent/50 transition-colors">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 bg-secondary rounded-lg flex flex-shrink-0 items-center justify-center border border-border overflow-hidden">
                                                                {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ShoppingCart className="h-4 w-4 text-muted-foreground" />}
                                                            </div>
                                                            <div className="flex flex-col max-w-[300px]">
                                                                <span className="text-sm font-bold text-foreground truncate">{item.name}</span>
                                                                <span className="text-[10px] text-muted-foreground truncate">{item.description?.substring(0, 50)}...</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2">{item.marketplace || "Amazon"}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="text-[9px] font-bold px-2 bg-primary/10 text-primary border-none">
                                                            {item.content_status || "PENDING"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary rounded-lg" title="Rewrite"><Zap className="h-4 w-4" /></Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive rounded-lg" title="Block"><Trash2 className="h-4 w-4" /></Button>
                                                            <Button size="sm" className="h-8 bg-success hover:bg-success/90 text-[10px] font-bold rounded-lg px-3 shadow-md">APPROVE</Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-24 text-center text-muted-foreground italic">
                                                    {isProcessing ? "Synchronizing registry..." : "No items pending approval."}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>
                        </TabsContent>

                        <TabsContent value="proxy" className="animate-in fade-in duration-500">
                            <div className="grid md:grid-cols-12 gap-6">
                                <Card className="md:col-span-8 rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
                                    <div className="p-6 border-b border-border flex flex-row items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Exit Node Infrastructure</h3>
                                            <p className="text-xs text-muted-foreground">Active residential and datacenter proxy rotation.</p>
                                        </div>
                                        <Button className="h-10 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground">
                                            <Plus className="h-4 w-4 mr-2" /> Lease New Pool
                                        </Button>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary/50">
                                                <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Node Identity</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase">Type</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase">Throughput</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase text-right pr-6">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                { id: 1, node: "US-RES-POOL-01", type: "Residential", load: "12%", status: "Healthy" },
                                                { id: 2, node: "EU-DC-POOL-04", type: "Datacenter", load: "45%", status: "Healthy" },
                                                { id: 3, node: "AS-RES-ST-09", type: "Residential", load: "89%", status: "Degraded" },
                                            ].map(p => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="pl-6 py-4 font-mono text-xs font-bold text-foreground">{p.node}</TableCell>
                                                    <TableCell><Badge variant="outline" className="text-[9px] font-bold uppercase">{p.type}</Badge></TableCell>
                                                    <TableCell className="text-xs font-bold text-foreground">{p.load}</TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <Badge className={cn("text-[9px] font-bold uppercase tracking-wider", p.status === 'Healthy' ? 'bg-success/10 text-success border-none' : 'bg-warning/10 text-warning border-none')}>
                                                            {p.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                                <div className="md:col-span-4 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-foreground dark:bg-card p-6 shadow-xl text-white space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-5 w-5 text-success" />
                                            <h4 className="text-sm font-bold">Real-time Pulse</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] font-bold uppercase text-white/60 tracking-wider">
                                                    <span>Bandwidth Utilization</span>
                                                    <span className="text-success">65.2%</span>
                                                </div>
                                                <Progress value={65} className="h-1.5 bg-white/10" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Active Endpoints</p>
                                                    <p className="text-xl font-black">4,208</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Failure Rate</p>
                                                    <p className="text-xl font-black text-destructive">0.02%</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 h-10 rounded-xl text-xs font-semibold">
                                                Forced IP Rotation
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <RestrictedItemModal open={isRestrictModalOpen} onOpenChange={setIsRestrictModalOpen} />
                </div>
            </div>
        </DashboardLayout>
    );
}
