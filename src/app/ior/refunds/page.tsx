"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Undo2, Search, Filter, RefreshCw, MoreVertical,
    AlertCircle, CheckCircle2, Clock, XCircle, DollarSign,
    ArrowDownLeft, FileText, ChevronLeft, ChevronRight, HelpCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function IorRefundsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const refunds = [
        { id: 1, order_number: "IOR-8492", customer: "Ariful Islam", amount: "৳12,400", reason: "Damaged in Transit", status: "pending", date: "2026-02-21" },
        { id: 2, order_number: "IOR-8490", customer: "Farhana Ahmed", amount: "৳8,500", reason: "Product Mismatch", status: "processed", date: "2026-02-20" },
        { id: 3, order_number: "IOR-8485", customer: "Tanvir Hossain", amount: "৳45,000", reason: "HS-Code Rejection", status: "failed", date: "2026-02-19" },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "processed": return "bg-success/10 text-success border-success/20";
            case "pending": return "bg-warning/10 text-warning border-warning/20";
            case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20">
                                    <Undo2 className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-bold tracking-widest uppercase">
                                    Resolutions
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Refund Manager</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Manage customer claims, reverse duty settlements, and handle cross-border financial reversals.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-2">
                                <HelpCircle className="h-3.5 w-3.5" /> Policy Config
                            </Button>
                            <Button className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-rose-500/20 text-sm">
                                <Plus className="h-4 w-4" /> New Reverse Entry
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Claims Pending", value: "12", icon: Clock, color: "text-warning" },
                            { label: "Resolved (MTD)", value: "84", icon: CheckCircle2, color: "text-success" },
                            { label: "Total Reversed", value: "৳4.2L", icon: DollarSign, color: "text-primary" },
                            { label: "Rejection Rate", value: "1.2%", icon: AlertCircle, color: "text-destructive" },
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

                    {/* Table Card */}
                    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by Order # or Customer..."
                                    className="pl-10 h-11 rounded-xl bg-background border-border text-xs"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="rounded-xl text-[10px] font-bold uppercase h-9 gap-2">
                                <RefreshCw className="h-3 w-3" /> Refresh
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/50">
                                        <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Reference</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase">Customer</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase">Reason</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase">Value</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase">Status</TableHead>
                                        <TableHead className="text-right text-[10px] font-bold uppercase pr-6">Management</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(3).fill(0).map((_, i) => (
                                            <TableRow key={i}><TableCell colSpan={6} className="py-6 px-6"><Skeleton className="h-10 w-full rounded-lg" /></TableCell></TableRow>
                                        ))
                                    ) : refunds.map((r) => (
                                        <TableRow key={r.id} className="group hover:bg-accent/50 transition-colors">
                                            <TableCell className="pl-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-primary font-mono">{r.order_number}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">{r.date}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-semibold text-foreground">{r.customer}</span>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{r.reason}</p>
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-xs font-black text-foreground">{r.amount}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-widest", getStatusStyle(r.status))}>
                                                    {r.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-tight text-success hover:bg-success/5">Approve</Button>
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-tight text-destructive hover:bg-destructive/5">Reject</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
