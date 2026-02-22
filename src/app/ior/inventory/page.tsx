"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Box, Activity, ArrowUpRight, ArrowDownLeft, RefreshCcw,
    Search, Filter, MapPin, Truck, AlertTriangle, Package,
    Layers, History, BarChart3, TrendingUp, Warehouse
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { useIorWarehouse } from "@/hooks/ior/useIorWarehouse";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function IorInventoryPage() {
    const { inventory, isProcessing, fetchInventory } = useIorWarehouse();
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const stockMovements = [
        { id: 1, type: "inbound", product: "MacBook Pro M3", qty: "+12", from: "Riyadh Hub", to: "Dhaka Warehouse", date: "2026-02-21 14:30", status: "completed" },
        { id: 2, type: "outbound", product: "Sony A7 IV", qty: "-2", from: "Dhaka Warehouse", to: "Customer Delivery", date: "2026-02-21 12:45", status: "completed" },
        { id: 3, type: "transfer", product: "iPhone 15 Pro", qty: "5", from: "Dubai Storage", to: "Dhaka Warehouse", date: "2026-02-21 10:15", status: "in_transit" },
        { id: 4, type: "adjustment", product: "AirPods Max", qty: "-1", from: "Dhaka Warehouse", to: "Damage Report", date: "2026-02-20 18:00", status: "completed" },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                                    <Box className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px] font-bold tracking-widest uppercase">
                                    Inventory Intelligence
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Stock & Asset Management</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Real-time global inventory telemetry, stock movement audits, and multi-warehouse reconciliation.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-2" onClick={fetchInventory}>
                                <RefreshCcw className={cn("h-3.5 w-3.5", isProcessing && "animate-spin")} /> Re-Sync Global
                            </Button>
                            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-amber-500/20 text-sm">
                                <Activity className="h-4 w-4" /> Run Audit
                            </Button>
                        </div>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "On Hand (Global)", value: "1,204", icon: Warehouse, color: "text-primary" },
                            { label: "Incoming Cargo", value: "482", icon: Truck, color: "text-info" },
                            { label: "Low Stock Items", value: "23", icon: AlertTriangle, color: "text-warning" },
                            { label: "Turnover Rate", value: "8.4x", icon: TrendingUp, color: "text-success" },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                                    <s.icon className={cn("h-4 w-4", s.color)} />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="bg-secondary/50 p-1 rounded-xl w-fit mb-6 border border-border">
                            <TabsTrigger value="overview" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Stock Overview
                            </TabsTrigger>
                            <TabsTrigger value="movements" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Stock Movements
                            </TabsTrigger>
                            <TabsTrigger value="warehouses" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Multi-Warehouse View
                            </TabsTrigger>
                            <TabsTrigger value="vendors" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Vendor Inventory
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="animate-in fade-in duration-500">
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-6 border-b border-border flex items-center justify-between">
                                    <h3 className="text-base font-bold text-foreground">Global Stock Ledger</h3>
                                    <div className="relative w-72">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search global stock..." className="pl-10 h-10 rounded-xl bg-background border-border text-xs" />
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/50">
                                            <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Product</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Global Qty</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Location Split</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Sync Status</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold uppercase pr-6">Value (Base)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inventory.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-20 text-center text-muted-foreground italic">No stock records found.</TableCell>
                                            </TableRow>
                                        ) : inventory.slice(0, 10).map((item) => (
                                            <TableRow key={item.id} className="hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center p-1 border border-border">
                                                            {item.product_image ? (
                                                                <img src={item.product_image} alt="" className="h-full w-full object-contain" />
                                                            ) : (
                                                                <Package className="h-5 w-5 text-muted-foreground/30" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-foreground line-clamp-1">{item.product_name}</span>
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.sku || "UNSPECIFIED"}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-foreground">12</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1.5 font-bold text-[10px] uppercase">
                                                        <Badge variant="secondary" className="bg-info/10 text-info border-none">DXB: 8</Badge>
                                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">DAC: 4</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className="bg-success/10 text-success border-success/20 text-[9px] font-black uppercase">LIVE</Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 font-mono text-xs font-bold">
                                                    ৳1,24,000
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="movements" className="animate-in fade-in duration-500">
                            <div className="grid gap-6 md:grid-cols-12">
                                <div className="md:col-span-8">
                                    <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                        <CardHeader className="border-b border-border bg-secondary/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <History className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <CardTitle className="text-sm font-bold">Chronological Movements</CardTitle>
                                                        <CardDescription className="text-[10px]">Audit trail of all stock changes in the last 24h.</CardDescription>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">Export CSV</Button>
                                            </div>
                                        </CardHeader>
                                        <div className="overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-secondary/30">
                                                        <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Event</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase text-center">Quantity</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase">Route</TableHead>
                                                        <TableHead className="text-right text-[10px] font-bold uppercase pr-6">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {stockMovements.map((move) => (
                                                        <TableRow key={move.id} className="hover:bg-accent/50 transition-colors">
                                                            <TableCell className="pl-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center gap-2">
                                                                        {move.type === 'inbound' ? <ArrowDownLeft className="h-3 w-3 text-success" /> :
                                                                            move.type === 'outbound' ? <ArrowUpRight className="h-3 w-3 text-destructive" /> :
                                                                                <Activity className="h-3 w-3 text-info" />}
                                                                        <span className="text-xs font-bold text-foreground capitalize">{move.type}</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-muted-foreground font-medium mt-0.5">{move.product}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className={cn("text-center font-mono font-bold text-xs",
                                                                move.qty.startsWith('+') ? "text-success" :
                                                                    move.qty.startsWith('-') ? "text-destructive" : "text-info"
                                                            )}>
                                                                {move.qty}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase">
                                                                    <span>{move.from}</span>
                                                                    <ArrowUpRight className="h-2 w-2" />
                                                                    <span>{move.to}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right pr-6">
                                                                <Badge variant="outline" className={cn("text-[9px] font-bold uppercase",
                                                                    move.status === 'completed' ? "bg-success/5 text-success border-success/20" : "bg-warning/5 text-warning border-warning/20"
                                                                )}>
                                                                    {move.status.replace('_', ' ')}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </Card>
                                </div>
                                <div className="md:col-span-4 space-y-6">
                                    <div className="p-6 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">Inventory Health</h4>
                                        <div className="space-y-6">
                                            {[
                                                { label: "Shrinkage Rate", val: "0.2%", color: "bg-success" },
                                                { label: "Cycle Count Accuracy", val: "99.8%", color: "bg-primary" },
                                                { label: "OOS Frequency", val: "4.1%", color: "bg-warning" },
                                            ].map(i => (
                                                <div key={i.label} className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-muted-foreground font-medium">{i.label}</span>
                                                        <span className="font-bold text-foreground">{i.val}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                        <div className={cn("h-full rounded-full", i.color)} style={{ width: i.val }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20">
                                        <BarChart3 className="h-8 w-8 mb-4 opacity-70" />
                                        <h3 className="text-xl font-bold">Predictive Restock</h3>
                                        <p className="text-xs text-white/70 leading-relaxed mt-2 font-medium">
                                            AI Neurons analyzed velocity and suggests restock for <span className="text-white font-bold">14 High-Demand SKUs</span> by Mar 02.
                                        </p>
                                        <Button className="w-full bg-white text-indigo-600 hover:bg-secondary font-bold rounded-xl h-11 text-xs mt-6">
                                            Review Suggestions
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="vendors" className="animate-in fade-in duration-500">
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Remote Stock Sync</h3>
                                        <p className="text-xs text-muted-foreground">Monitoring inventory availability across external vendor APIs.</p>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/30">
                                            <TableHead className="text-[10px] font-bold uppercase pl-8 py-5">Supplier / Platform</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Mapped SKUs</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Connection State</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Last Pulse</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold uppercase pr-8">Priority</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { vendor: "Amazon USA (FBA)", mapped: 420, pulse: "2m ago", status: "Healthy", priority: "L1" },
                                            { vendor: "Noon KSA", mapped: 156, pulse: "15m ago", status: "Healthy", priority: "L2" },
                                            { vendor: "AliExpress Pro", mapped: 2104, pulse: "1h ago", status: "Lagging", priority: "L4" },
                                        ].map((v) => (
                                            <TableRow key={v.vendor} className="hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-success" />
                                                        <span className="text-sm font-bold text-foreground">{v.vendor}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs font-bold text-primary">{v.mapped} Items</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest",
                                                        v.status === 'Healthy' ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                                                        {v.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-xs text-muted-foreground font-medium">{v.pulse}</TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold">{v.priority}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
}
