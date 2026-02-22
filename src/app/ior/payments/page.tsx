"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CreditCard, Wallet, Download, ArrowUpRight, ArrowDownLeft,
    TrendingUp, DollarSign, RefreshCw, Clock, CheckCircle2, XCircle,
    ChevronLeft, ChevronRight, Zap, Plus
} from "lucide-react";
import { useIorBilling } from "@/hooks/ior/useIorBilling";
import { WalletTopupModal } from "@/components/ior/WalletTopupModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function IorPaymentsPage() {
    const [isTopupOpen, setIsTopupOpen] = useState(false);
    const { stats, invoices, isProcessing, fetchBillingData } = useIorBilling();

    useEffect(() => {
        fetchBillingData();
    }, [fetchBillingData]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "paid": return <CheckCircle2 className="h-3 w-3" />;
            case "pending": return <Clock className="h-3 w-3" />;
            case "failed": return <XCircle className="h-3 w-3" />;
            default: return <Clock className="h-3 w-3" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "paid": return "bg-success/10 text-success border-success/20";
            case "pending": return "bg-warning/10 text-warning border-warning/20";
            case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                                    <Wallet className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-bold tracking-widest uppercase">
                                    Finance Hub
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Payments & Transactions</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Monitor wallet balance, track payment history, and manage financial operations for IOR orders.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-2">
                                <Download className="h-3.5 w-3.5" /> Download Report
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-emerald-500/20 text-sm"
                                onClick={() => setIsTopupOpen(true)}
                            >
                                <Plus className="h-4 w-4" /> Top-up Wallet
                            </Button>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 shadow-[var(--shadow-card)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Revenue (IOR)</p>
                                    <TrendingUp className="h-4 w-4 text-success" />
                                </div>
                                {stats ? (
                                    <>
                                        <p className="text-3xl font-bold text-foreground">৳{stats.total_spent?.toLocaleString() || "0"}</p>
                                        <p className="text-xs mt-2 text-success font-semibold flex items-center gap-1">
                                            <ArrowUpRight className="h-3 w-3" /> +12% from last month
                                        </p>
                                    </>
                                ) : (
                                    <Skeleton className="h-10 w-40 rounded-lg" />
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Wallet className="h-20 w-20" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Wallet Balance</p>
                                    <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                {stats ? (
                                    <>
                                        <p className="text-3xl font-bold text-foreground">৳{stats.balance?.toLocaleString() || "0"}</p>
                                        <p className="text-xs mt-2 text-muted-foreground">
                                            {stats.currency || "BDT"} • Last updated just now
                                        </p>
                                    </>
                                ) : (
                                    <Skeleton className="h-10 w-40 rounded-lg" />
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pending Payouts</p>
                                <Clock className="h-4 w-4 text-warning" />
                            </div>
                            {stats ? (
                                <>
                                    <p className="text-3xl font-bold text-foreground">৳{stats.pending_payments?.toLocaleString() || "0"}</p>
                                    <p className="text-xs mt-2 text-warning font-semibold">
                                        In verification
                                    </p>
                                </>
                            ) : (
                                <Skeleton className="h-10 w-40 rounded-lg" />
                            )}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { name: "bKash", color: "text-pink-500", bg: "bg-pink-500/10" },
                            { name: "Nagad", color: "text-orange-500", bg: "bg-orange-500/10" },
                            { name: "SSLCommerz", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { name: "Stripe", color: "text-purple-500", bg: "bg-purple-500/10" },
                        ].map(m => (
                            <div key={m.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer">
                                <div className={cn("p-2 rounded-lg", m.bg)}>
                                    <CreditCard className={cn("h-4 w-4", m.color)} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">{m.name}</p>
                                    <p className="text-[10px] text-success uppercase font-bold tracking-wider">Active</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transactions Table */}
                    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-foreground">Transaction History</h3>
                                <p className="text-xs text-muted-foreground">Payment records from the last 30 days</p>
                            </div>
                            <Button variant="outline" className="rounded-xl text-[10px] font-bold uppercase tracking-wider h-9 gap-2" onClick={fetchBillingData}>
                                <RefreshCw className={cn("h-3 w-3", isProcessing && "animate-spin")} /> Refresh
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/50">
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Invoice #</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Date</TableHead>
                                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">Amount</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Wallet className="h-10 w-10 text-muted-foreground/30" />
                                                    <p className="text-sm text-muted-foreground font-semibold">No transactions yet</p>
                                                    <p className="text-xs text-muted-foreground/60">Transactions will appear when you make payments</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : invoices.map((inv) => (
                                        <TableRow key={inv.id} className="hover:bg-accent/50 transition-colors group">
                                            <TableCell className="py-4 font-mono text-xs font-semibold text-primary">
                                                {inv.invoice_number}
                                            </TableCell>
                                            <TableCell className="py-4 text-xs text-muted-foreground">
                                                {new Date(inv.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right py-4 font-bold text-foreground">
                                                ৳{inv.amount?.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className={cn("capitalize font-semibold text-[10px] gap-1", getStatusStyle(inv.status))}>
                                                    {getStatusIcon(inv.status)} {inv.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                {inv.download_url && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                                        <a href={inv.download_url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <WalletTopupModal open={isTopupOpen} onOpenChange={setIsTopupOpen} />
                </div>
            </div>
        </DashboardLayout>
    );
}
