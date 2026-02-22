"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus, Clock, ArrowUpRight, ArrowDownLeft, Wallet, FileText,
    CreditCard, Zap, History, RefreshCcw, Activity, ShieldCheck,
    Smartphone, Download, Eye, ChevronRight, MoreHorizontal,
    TrendingUp, AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIorBilling } from "@/hooks/ior/useIorBilling";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletTopupModal } from "@/components/ior/WalletTopupModal";
import { cn } from "@/lib/utils";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

export default function IorBillingPage() {
    const [isTopupOpen, setIsTopupOpen] = useState(false);
    const { stats, invoices, isLoading, fetchBillingData } = useIorBilling() as any;

    useEffect(() => {
        fetchBillingData();
    }, [fetchBillingData]);

    const transactions = invoices.map((inv: any) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        type: inv.type || "Service Charge",
        amount: inv.total_amount_bdt || inv.amount,
        method: inv.payment_method || "Wallet",
        date: new Date(inv.created_at).toLocaleDateString(),
        status: inv.status,
        is_credit: (inv.type || "").toLowerCase().includes('topup') || (inv.type || "").toLowerCase().includes('credit')
    }));

    const gateways = [
        { name: "bKash", status: "Operational", latency: "120ms", uptime: "99.9%", icon: Smartphone, color: "text-pink-500", bg: "bg-pink-500/10" },
        { name: "Nagad", status: "Operational", latency: "145ms", uptime: "99.8%", icon: Smartphone, color: "text-orange-500", bg: "bg-orange-500/10" },
        { name: "Stripe", status: "Operational", latency: "85ms", uptime: "100%", icon: CreditCard, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { name: "SSLCommerz", status: "Operational", latency: "160ms", uptime: "99.7%", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" }
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                                    <Wallet className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold tracking-widest uppercase">
                                    Treasury
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Financial Command</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Manage IOR treasury, liquidity corridors, and automated tax settlements.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-xl font-semibold h-10 px-5 gap-2 text-xs"
                                onClick={fetchBillingData}
                            >
                                <RefreshCcw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} /> Refresh
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-xl font-semibold h-10 px-6 gap-2 shadow-lg shadow-indigo-500/20 text-sm"
                                onClick={() => setIsTopupOpen(true)}
                            >
                                <Plus className="h-4 w-4" /> Top-up Wallet
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Column */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Balance Card */}
                                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-[var(--shadow-card)] relative overflow-hidden">
                                    <div className="absolute -right-12 -top-12 bg-primary/10 w-48 h-48 rounded-full blur-[80px]" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Available Liquidity</p>
                                            <div className="p-2 bg-success/10 rounded-lg">
                                                <TrendingUp className="h-4 w-4 text-success" />
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-4xl font-bold tracking-tight text-foreground">
                                                {stats ? `৳${stats.balance.toLocaleString()}` : <Skeleton className="h-10 w-40" />}
                                            </span>
                                            <span className="text-xs font-bold text-muted-foreground uppercase">BDT</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                <span>Reserve Health</span>
                                                <span className="text-success">Optimal</span>
                                            </div>
                                            <Progress value={85} className="h-1.5" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                                            Primary pool for Duty/VAT automation and Courier settlements.
                                        </p>
                                    </div>
                                </div>

                                {/* Service Plan Card */}
                                <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">Service Plan</h3>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Cross-Border Pro Tier</p>
                                            </div>
                                            <Badge className="bg-primary text-primary-foreground border-none font-bold text-[9px] px-3 py-1 uppercase tracking-widest">PRO</Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs py-2 border-b border-border font-medium">
                                                <span className="text-muted-foreground">AI Quota</span>
                                                <span className="font-semibold text-foreground">42 / 50</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs py-2 border-b border-border font-medium">
                                                <span className="text-muted-foreground">Auto-HS Mapping</span>
                                                <Badge variant="secondary" className="text-[10px] font-bold">UNLIMITED</Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-xs py-2 font-medium">
                                                <span className="text-muted-foreground">Renewal Date</span>
                                                <span className="font-semibold text-foreground">March 12, 2026</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="link" className="p-0 text-primary text-[10px] h-fit font-bold uppercase tracking-widest mt-4 gap-1">
                                        Elevate Tier <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Transaction Ledger */}
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="flex items-center justify-between p-6 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <History className="h-5 w-5 text-foreground" />
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Transaction Ledger</h3>
                                            <p className="text-xs text-muted-foreground">Auditable record of all tenant movement.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="rounded-xl font-semibold text-xs h-9 gap-2">
                                        <Download className="h-3.5 w-3.5" /> Export CSV
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/50">
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider pl-6">Identity & Type</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider">Method</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider">Date</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right">Value (BDT)</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Clock className="h-10 w-10 text-muted-foreground/30" />
                                                        <p className="text-sm text-muted-foreground font-semibold">No movement in the ledger</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : transactions.map((txn: any, i: number) => (
                                            <TableRow key={i} className="group hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "p-2 rounded-xl",
                                                            txn.is_credit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                                                        )}>
                                                            {txn.is_credit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-semibold text-foreground">{txn.type}</span>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{txn.invoice_number}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-bold uppercase text-muted-foreground">{txn.method}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">{txn.date}</TableCell>
                                                <TableCell className={cn(
                                                    "text-right font-bold text-sm",
                                                    txn.is_credit ? "text-success" : "text-foreground"
                                                )}>
                                                    {txn.is_credit ? "+" : "-"}{txn.amount?.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Badge variant="outline" className={cn(
                                                            "text-[9px] font-bold uppercase tracking-wider",
                                                            txn.status === 'paid' || txn.status === 'success' ? 'bg-success/10 text-success border-success/20' :
                                                                txn.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                                                                    'bg-muted text-muted-foreground'
                                                        )}>
                                                            {txn.status || 'Success'}
                                                        </Badge>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                                <DropdownMenuItem className="gap-2 text-xs"><Eye className="h-3.5 w-3.5" /> View Detail</DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-2 text-xs"><Download className="h-3.5 w-3.5" /> Download PDF</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Gateway Matrix */}
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-6 border-b border-border bg-secondary/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-primary/10 rounded-xl">
                                            <Activity className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">Gateway Matrix</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time sync status</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 space-y-4">
                                    {gateways.map((gw, i) => (
                                        <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent/50 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-lg", gw.bg)}>
                                                        <gw.icon className={cn("h-4 w-4", gw.color)} />
                                                    </div>
                                                    <span className="text-xs font-bold text-foreground uppercase">{gw.name}</span>
                                                </div>
                                                <Badge variant="secondary" className="text-[8px] font-bold uppercase tracking-wider text-success">OPERATIONAL</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Latency</span>
                                                    <p className="text-xs font-bold text-foreground">{gw.latency}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Uptime</span>
                                                    <p className="text-xs font-bold text-foreground">{gw.uptime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Note */}
                            <div className="rounded-2xl border border-warning/20 bg-warning/5 p-5">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold text-foreground">Security Protocol</h5>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            All transactions are vaulted in <span className="font-bold text-foreground">ISO-27001 compliant</span> infrastructure. Funds held in escrow for duty settlements.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-6 flex flex-col items-center text-center gap-4 shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <Zap className="h-8 w-8 text-amber-300 relative z-10" />
                                <div className="relative z-10 space-y-1">
                                    <h3 className="text-lg font-bold">Automated Treasury</h3>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Efficiency Multiplier</p>
                                </div>
                                <p className="text-xs text-white/80 leading-relaxed relative z-10">
                                    Connect your bank account for 1-click invoice settlements and automated tax pool replenishment.
                                </p>
                                <Button className="w-full bg-card text-indigo-600 hover:bg-white/90 font-bold rounded-xl h-10 text-xs relative z-10 shadow-lg">
                                    Configure Bank Link
                                </Button>
                            </div>
                        </div>
                    </div>

                    <WalletTopupModal open={isTopupOpen} onOpenChange={setIsTopupOpen} />
                </div>
            </div>
        </DashboardLayout>
    );
}
