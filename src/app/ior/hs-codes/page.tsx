"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search, Gavel, FileText, Info, ArrowRight, Zap, History,
    Calculator, ShieldAlert, Globe, Cpu, Coins, TrendingUp,
    CheckCircle2, RefreshCcw, MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DutyBadge } from "@/components/ior/DutyBadge";
import { useIorHsCodes } from "@/hooks/ior/useIorHsCodes";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HsCodeDetailDialog } from "@/components/ior/HsCodeDetailDialog";
import { HsCode } from "@/hooks/ior/useIorHsCodes";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function IorHsCodesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCode, setSelectedCode] = useState<HsCode | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const { results, isSearching, searchHsCodes, inferHsCode } = useIorHsCodes();

    const handleSearch = async () => {
        if (!searchTerm) return;
        await searchHsCodes(searchTerm);
    };

    const handleInfer = async () => {
        if (!searchTerm) {
            toast.error("Please enter a product title to infer HS code");
            return;
        }
        toast.info("AI Neurons analyzing product semantics...");
        const inferred = await inferHsCode(searchTerm);
        if (inferred) {
            setSelectedCode(inferred);
            setIsDetailOpen(true);
            toast.success("HS Code inferred with high confidence");
        }
    };

    const openDetails = (code: HsCode) => {
        setSelectedCode(code);
        setIsDetailOpen(true);
    };

    const restrictions = [
        { category: "Communication", items: ["Drones", "RF Transmitters", "Satellite Gear"], status: "Restricted", color: "text-warning" },
        { category: "Banned", items: ["Used Clothing", "Reconditioned Engines"], status: "Banned", color: "text-destructive" },
        { category: "Regulated", items: ["Cosmetics", "Pharmaceuticals"], status: "IP Required", color: "text-info" }
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                                    <Gavel className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 text-[10px] font-bold tracking-widest uppercase">
                                    Duty Intelligence
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">HS Code Lookup</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Harmonized System registry and automated duty rate orchestration for global trade compliance.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="hidden lg:flex flex-col items-end gap-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Credits</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-500 w-[68%]" />
                                    </div>
                                    <span className="text-xs font-bold font-mono">342/500</span>
                                </div>
                            </div>
                            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-violet-500/20 text-sm">
                                <Calculator className="h-4 w-4" /> Tax Simulator
                            </Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Main Search */}
                        <div className="lg:col-span-8 space-y-6">
                            <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-6 border-b border-border bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <Search className="h-5 w-5 text-foreground" />
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Global Registry Search</h3>
                                            <p className="text-xs text-muted-foreground">Query cross-border tariff matrix and tax schedules.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Keyword, category, or partial code..."
                                                className="pl-10 h-12 rounded-xl bg-background border-border text-xs"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-12 px-6 rounded-xl border-violet-100 bg-violet-50/10 text-violet-600 hover:bg-violet-50 transition-all font-semibold text-xs gap-2"
                                            onClick={handleInfer}
                                            disabled={isSearching}
                                        >
                                            <Cpu className={cn("h-3.5 w-3.5", isSearching && "animate-spin")} /> Neural Infer
                                        </Button>
                                        <Button
                                            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                        >
                                            Search
                                        </Button>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary/50">
                                                <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Code</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase">Description</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase text-center">Duty Rate</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase text-right pr-6">Details</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isSearching ? (
                                                Array(4).fill(0).map((_, i) => (
                                                    <TableRow key={i}><TableCell colSpan={4} className="py-8 px-6"><Skeleton className="h-10 w-full rounded-lg" /></TableCell></TableRow>
                                                ))
                                            ) : results.length > 0 ? results.map((item) => (
                                                <TableRow key={item.id} className="group hover:bg-accent/50 transition-colors">
                                                    <TableCell className="pl-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-primary font-mono">{item.code}</span>
                                                            <span className="text-[9px] text-muted-foreground uppercase mt-0.5">Section XVI / Ch. 85</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[300px]">
                                                        <p className="text-xs text-foreground leading-relaxed line-clamp-2 font-medium">
                                                            {item.description}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <DutyBadge rate={item.duty_rate} />
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-lg text-[10px] font-bold tracking-wider uppercase h-8 px-3"
                                                            onClick={() => openDetails(item)}
                                                        >
                                                            Analysis <ArrowRight className="ml-1.5 h-3 w-3" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="py-20 text-center text-muted-foreground text-sm italic">
                                                        Search result will appear here.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                                <div className="flex items-center gap-3 mb-6">
                                    <ShieldAlert className="h-4 w-4 text-destructive" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Restriction Overview</h4>
                                </div>
                                <div className="space-y-4">
                                    {restrictions.map(res => (
                                        <div key={res.category} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{res.category}</span>
                                                <Badge variant="outline" className={cn("text-[8px] font-bold uppercase",
                                                    res.status === 'Banned' ? 'bg-destructive/10 text-destructive border-transparent' :
                                                        res.status === 'Restricted' ? 'bg-warning/10 text-warning border-transparent' : 'bg-info/10 text-info border-transparent'
                                                )}>
                                                    {res.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {res.items.map(it => (
                                                    <span key={it} className="text-[10px] font-medium text-foreground/80">{it}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Market Volatility</h4>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-muted-foreground">Weighted Duty Avg.</span>
                                            <span className="text-foreground">12.4%</span>
                                        </div>
                                        <Progress value={45} className="h-1" />
                                    </div>
                                    <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                                        <p className="text-[10px] text-destructive font-medium leading-relaxed">
                                            New <span className="font-bold">Electronics Surcharge</span> implemented for Section XVI imports as of Feb 2026.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <HsCodeDetailDialog
                        open={isDetailOpen}
                        onOpenChange={setIsDetailOpen}
                        hsCode={selectedCode}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
