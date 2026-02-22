"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Calculator, Settings2, TrendingUp, DollarSign, RefreshCw,
    ArrowRight, Percent, ShieldCheck, Info, History,
    Globe, Zap, Gauge, Coins, Table as TableIcon, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { useIorPricing } from "@/hooks/ior/useIorPricing";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function IorPricingPage() {
    const { rules, fxRates, isProcessing, fetchPricingRules, fetchFxRates } = useIorPricing();
    const [activeTab, setActiveTab] = useState("calculator");

    useEffect(() => {
        fetchPricingRules();
        fetchFxRates();
    }, [fetchPricingRules, fetchFxRates]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                                    <Calculator className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-bold tracking-widest uppercase">
                                    Financial Engine
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Landed Cost & Pricing</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Configure global margin rules, manage FX propagation, and audit landed cost calculations for cross-border trade.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-2" onClick={fetchFxRates}>
                                <RefreshCw className={cn("h-3.5 w-3.5", isProcessing && "animate-spin")} /> Update Rates
                            </Button>
                            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-emerald-500/20 text-sm">
                                <Save className="h-4 w-4" /> Save Global Rules
                            </Button>
                        </div>
                    </div>

                    {/* FX Matrix */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "USD/BDT (Base)", value: "120.45", icon: Coins, color: "text-primary", sub: "Swift Interbank" },
                            { label: "SAR/BDT", value: "32.12", icon: Globe, color: "text-emerald-500", sub: "Mid-Market" },
                            { label: "AED/BDT", value: "32.80", icon: ShieldCheck, color: "text-info", sub: "Mid-Market" },
                            { label: "Profit Margin Avg.", value: "18.4%", icon: TrendingUp, color: "text-success", sub: "Rolling 30d" },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                                    <s.icon className={cn("h-4 w-4", s.color)} />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 font-medium">{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    <Tabs defaultValue="calculator" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="bg-secondary/50 p-1 rounded-xl w-fit mb-8 border border-border">
                            <TabsTrigger value="calculator" className="rounded-lg px-8 py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Cost Calculator
                            </TabsTrigger>
                            <TabsTrigger value="rules" className="rounded-lg px-8 py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Pricing Rules (Global)
                            </TabsTrigger>
                            <TabsTrigger value="fx" className="rounded-lg px-8 py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                FX Historical Trace
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="calculator" className="animate-in fade-in duration-500">
                            <div className="grid gap-8 md:grid-cols-12">
                                <Card className="md:col-span-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                                    <div className="p-8 border-b border-border bg-secondary/10">
                                        <h3 className="text-base font-bold text-foreground">Interactive Simulation</h3>
                                        <p className="text-xs text-muted-foreground">Estimate total landed costs for any foreign SKU.</p>
                                    </div>
                                    <div className="p-8 grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Source Price (USD)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" defaultValue="499.00" className="pl-10 h-11 rounded-xl bg-background border-border text-xs font-bold" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">HS Code Rate (%)</label>
                                                <div className="relative">
                                                    <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" defaultValue="25.0" className="pl-10 h-11 rounded-xl bg-background border-border text-xs font-bold" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight (KG)</label>
                                                    <Input type="number" defaultValue="2.5" className="h-11 rounded-xl bg-background border-border text-xs font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Service Fee (%)</label>
                                                    <Input type="number" defaultValue="15.0" className="h-11 rounded-xl bg-background border-border text-xs font-bold" />
                                                </div>
                                            </div>
                                            <Button className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 text-xs gap-2">
                                                <Zap className="h-4 w-4" /> Run Simulation
                                            </Button>
                                        </div>

                                        <div className="p-6 rounded-2xl border border-border bg-secondary/20 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-xs border-b border-border/50 pb-3">
                                                    <span className="text-muted-foreground">Currency Conversion</span>
                                                    <span className="font-bold text-foreground">৳60,104.55</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs border-b border-border/50 pb-3">
                                                    <span className="text-muted-foreground">Total Duty & VAT</span>
                                                    <span className="font-bold text-foreground">৳15,026.14</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs border-b border-border/50 pb-3">
                                                    <span className="text-muted-foreground">Logistics Estimate</span>
                                                    <span className="font-bold text-foreground">৳3,200.00</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs font-bold text-primary pt-2">
                                                    <span className="text-primary/70 uppercase tracking-widest text-[10px]">Landed Result</span>
                                                    <span className="text-2xl tracking-tighter">৳78,330.69</span>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                                <p className="text-[9px] text-blue-600 font-medium leading-relaxed">
                                                    Calculation includes standard buffer and IOR governance fees. Actual clearance may vary slightly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <div className="md:col-span-4 space-y-6">
                                    <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 flex flex-col items-center text-center">
                                        <Gauge className="h-12 w-12 mb-4 opacity-70" />
                                        <h3 className="text-xl font-bold">Auto-Pricing Engine</h3>
                                        <p className="text-xs text-white/70 leading-relaxed mt-2 font-medium">
                                            Dynamic pricing is currently <span className="text-white font-bold underline">ENABLED</span> across all marketplaces.
                                        </p>
                                        <Button className="w-full bg-white text-indigo-600 hover:bg-secondary font-bold rounded-xl h-11 text-xs mt-8">
                                            Modify Logic Hooks
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="rules" className="animate-in fade-in duration-500">
                            <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <CardHeader className="p-8 border-b border-border bg-secondary/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-bold">Global Margin Matrix</CardTitle>
                                            <CardDescription className="text-xs">Define systematic markup and logistics surcharges.</CardDescription>
                                        </div>
                                        <Button className="h-10 rounded-xl bg-primary text-primary-foreground font-bold px-6 text-xs gap-2">
                                            <Plus className="h-3.5 w-3.5" /> Create Override
                                        </Button>
                                    </div>
                                </CardHeader>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/30">
                                            <TableHead className="text-[10px] font-bold uppercase pl-8 py-5">Category / Channel</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Margin (%)</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Fixed Fee (BDT)</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Shipping Surcharge</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold uppercase pr-8">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { channel: "Electronic Goods", margin: "12%", fee: "1,500", ship: "৳850/KG", status: "Active" },
                                            { channel: "Luxury Items", margin: "25%", fee: "5,000", ship: "৳1,200/KG", status: "Active" },
                                            { channel: "Amazon Global", margin: "15%", fee: "0", ship: "৳750/KG", status: "Active" },
                                            { channel: "Fashion & Apparel", margin: "18%", fee: "500", ship: "৳650/KG", status: "Experimental" },
                                        ].map((r) => (
                                            <TableRow key={r.channel} className="hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-8 py-5">
                                                    <span className="text-sm font-bold text-foreground">{r.channel}</span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono font-bold">{r.margin}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-xs font-bold">৳{r.fee}</TableCell>
                                                <TableCell className="text-center font-mono text-xs font-bold">{r.ship}</TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Badge className={cn("text-[10px] font-bold uppercase tracking-widest",
                                                        r.status === 'Active' ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                                                        {r.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </TabsContent>
                        <TabsContent value="fx" className="animate-in fade-in duration-500">
                            <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <CardHeader className="p-8 border-b border-border bg-secondary/10">
                                    <div>
                                        <CardTitle className="text-base font-bold">FX Transmission Log</CardTitle>
                                        <CardDescription className="text-xs">Audit trail of automated exchange rate propagation.</CardDescription>
                                    </div>
                                </CardHeader>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/30">
                                            <TableHead className="text-[10px] font-bold uppercase pl-8 py-4">Timestamp</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Pair</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Rate (Old)</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Rate (New)</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold uppercase pr-8">Variance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { time: "2026-02-22 09:00", pair: "USD/BDT", old: "120.10", new: "120.45", var: "+0.29%" },
                                            { time: "2026-02-22 08:30", pair: "SAR/BDT", old: "32.08", new: "32.12", var: "+0.12%" },
                                            { time: "2026-02-22 08:00", pair: "AED/BDT", old: "32.85", new: "32.80", var: "-0.15%" },
                                        ].map((log) => (
                                            <TableRow key={log.time} className="hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-8 py-5 text-xs text-muted-foreground font-medium">{log.time}</TableCell>
                                                <TableCell className="font-bold text-foreground font-mono text-xs">{log.pair}</TableCell>
                                                <TableCell className="text-xs font-mono">{log.old}</TableCell>
                                                <TableCell className="text-xs font-mono font-bold text-primary">{log.new}</TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase",
                                                        log.var.startsWith('+') ? "bg-success/5 text-success border-success/20" : "bg-destructive/5 text-destructive border-destructive/20")}>
                                                        {log.var}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
}
