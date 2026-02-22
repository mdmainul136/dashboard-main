"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield, RefreshCw, Database, Calculator, Zap, Settings2,
    AlertTriangle, CheckCircle2, ArrowRight, Server, Activity,
    CloudUpload, Lock, BarChart3
} from "lucide-react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function IorAdminPage() {
    const [syncIds, setSyncIds] = useState("");
    const [recalcIds, setRecalcIds] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [syncResult, setSyncResult] = useState<any>(null);
    const [recalcResult, setRecalcResult] = useState<any>(null);

    const handleSync = async () => {
        const ids = syncIds.split(",").map(id => id.trim()).filter(Boolean);
        if (ids.length === 0) return toast.error("Enter at least one product ID");
        setIsSyncing(true);
        try {
            const res = await iorApi.post("/api/ior/admin/sync-products", { product_ids: ids });
            setSyncResult(res.data);
            toast.success(`Synced ${ids.length} products`);
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Sync failed");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleRecalculate = async () => {
        const ids = recalcIds ? recalcIds.split(",").map(id => id.trim()).filter(Boolean) : undefined;
        setIsRecalculating(true);
        try {
            const res = await iorApi.post("/api/ior/admin/recalculate-prices", {
                order_ids: ids,
                force: true,
            });
            setRecalcResult(res.data);
            toast.success("Price recalculation complete");
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Recalculation failed");
        } finally {
            setIsRecalculating(false);
        }
    };

    const handleSeedHsCodes = async () => {
        try {
            const res = await iorApi.post("/api/ior/seed-hs-codes");
            toast.success(res.data?.message || "HS Codes seeded successfully");
        } catch {
            toast.error("Failed to seed HS codes");
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
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/20">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-bold tracking-widest uppercase">
                                    Admin Only
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Admin Tools</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                System-level operations — product sync, price recalculation, and data seeding. Use with caution.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-warning uppercase tracking-widest">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Destructive Operations
                        </div>
                    </div>

                    {/* Admin Cards */}
                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Sync Products */}
                        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-info/10 rounded-xl">
                                        <CloudUpload className="h-5 w-5 text-info" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Product Sync</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Oxylabs / Apify Gateway</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                                    Re-fetch product prices from source marketplaces via Oxylabs or Apify. Updates the local catalog with fresh pricing data.
                                </p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Product IDs (comma-separated)</label>
                                    <Textarea
                                        placeholder="e.g. 1, 2, 3, 4"
                                        className="min-h-[80px] rounded-xl bg-background border-border text-sm"
                                        value={syncIds}
                                        onChange={e => setSyncIds(e.target.value)}
                                    />
                                </div>
                                <Button
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 text-sm gap-2"
                                >
                                    {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                                    {isSyncing ? "Syncing..." : "Sync Products"}
                                </Button>
                                {syncResult && (
                                    <div className="p-4 rounded-xl border border-success/20 bg-success/5 animate-in fade-in duration-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="h-4 w-4 text-success" />
                                            <span className="text-xs font-bold text-success uppercase tracking-wider">Sync Complete</span>
                                        </div>
                                        <pre className="text-[10px] text-muted-foreground overflow-auto max-h-[100px]">{JSON.stringify(syncResult, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Recalculation */}
                        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-warning/10 rounded-xl">
                                        <Calculator className="h-5 w-5 text-warning" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Price Recalculation</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Exchange Rate Propagation</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                                    Bulk recalculate BDT prices for IOR orders when exchange rates change. Leave IDs empty to recalculate all.
                                </p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order IDs (optional, comma-separated)</label>
                                    <Textarea
                                        placeholder="Leave empty for all orders..."
                                        className="min-h-[80px] rounded-xl bg-background border-border text-sm"
                                        value={recalcIds}
                                        onChange={e => setRecalcIds(e.target.value)}
                                    />
                                </div>
                                <Button
                                    onClick={handleRecalculate}
                                    disabled={isRecalculating}
                                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 text-sm gap-2"
                                >
                                    {isRecalculating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
                                    {isRecalculating ? "Recalculating..." : "Recalculate Prices"}
                                </Button>
                                {recalcResult && (
                                    <div className="p-4 rounded-xl border border-success/20 bg-success/5 animate-in fade-in duration-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="h-4 w-4 text-success" />
                                            <span className="text-xs font-bold text-success uppercase tracking-wider">Recalculation Complete</span>
                                        </div>
                                        <pre className="text-[10px] text-muted-foreground overflow-auto max-h-[100px]">{JSON.stringify(recalcResult, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seed HS Codes */}
                        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-chart-4/10 rounded-xl border border-chart-4/20">
                                    <Database className="h-6 w-6 text-chart-4" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-foreground">Seed Common HS Codes</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Populate the database with commonly used HS tariff codes for cross-border classification.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-xl font-semibold text-xs h-10 gap-2 border-chart-4/30 text-chart-4 hover:bg-chart-4/10"
                                    onClick={handleSeedHsCodes}
                                >
                                    <Zap className="h-3.5 w-3.5" /> Seed
                                </Button>
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-secondary rounded-xl border border-border">
                                    <Server className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-foreground">System Status</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        IOR module runtime info and API health.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                    Healthy
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
