"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Package, Search, Filter, Plus, ExternalLink, RefreshCw,
    MoreHorizontal, ArrowUpRight, Globe, Layers, Eye, Edit,
    Link as LinkIcon, AlertCircle, ShoppingCart, Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useIorProducts } from "@/hooks/ior/useIorProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function IorProductsPage() {
    const { products, isLoading, fetchProducts, toggleStockSync } = useIorProducts();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.local_sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockBadge = (status: string) => {
        switch (status) {
            case "in_stock": return <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-bold">IN STOCK</Badge>;
            case "low_stock": return <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px] font-bold">LOW STOCK</Badge>;
            case "out_of_stock": return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-bold">OOS</Badge>;
            default: return <Badge variant="outline">UNKNOWN</Badge>;
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
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold tracking-widest uppercase">
                                    Catalog Manager
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Foreign Product Catalog</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Manage international product listings, local SKU mappings, and cross-border inventory synchronization.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-2" onClick={fetchProducts}>
                                <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} /> Re-Sync
                            </Button>
                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-indigo-500/20 text-sm" asChild>
                                <Link href="/ior/scraper">
                                    <Plus className="h-4 w-4" /> Import from Source
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Catalog", value: products.length, icon: Database, color: "text-primary" },
                            { label: "Mapped SKUs", value: products.filter(p => p.local_sku).length, icon: LinkIcon, color: "text-success" },
                            { label: "Synced Assets", value: products.filter(p => p.sync_status === 'synced').length, icon: RefreshCw, color: "text-info" },
                            { label: "OOS Alert", value: products.filter(p => p.stock_status === 'out_of_stock').length, icon: AlertCircle, color: "text-destructive" },
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
                                    placeholder="Search by name, SKU, or Mapping..."
                                    className="pl-10 h-11 rounded-xl bg-background border-border text-xs"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 text-xs font-semibold gap-2">
                                    <Filter className="h-3.5 w-3.5" /> Filter
                                </Button>
                                <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 text-xs font-semibold gap-2">
                                    <Layers className="h-3.5 w-3.5" /> Bulk Operations
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/50">
                                        <TableHead className="w-[80px] text-center text-[10px] font-bold uppercase pl-6 py-4">Image</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase">Product Identity</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-center">Pricing (BDT)</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-center">Local Mapping</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-center">Inventory</TableHead>
                                        <TableHead className="text-right text-[10px] font-bold uppercase pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i}><TableCell colSpan={6} className="py-8 px-6"><Skeleton className="h-12 w-full rounded-xl" /></TableCell></TableRow>
                                        ))
                                    ) : filteredProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-40">
                                                    <Package className="h-12 w-12" />
                                                    <p className="text-sm font-bold uppercase tracking-widest">No products found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredProducts.map((p) => (
                                        <TableRow key={p.id} className="group hover:bg-accent/50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="h-12 w-12 rounded-xl bg-secondary overflow-hidden border border-border flex items-center justify-center p-1">
                                                    {p.image_url ? (
                                                        <img src={p.image_url} alt="" className="h-full w-full object-contain" />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground line-clamp-1">{p.name}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[9px] font-mono h-4 px-1.5">{p.sku}</Badge>
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            <Globe className="h-2.5 w-2.5" /> {p.source_marketplace}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground">৳{p.landed_cost_bdt?.toLocaleString()}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-medium">Landed Cost</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {p.local_sku ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-bold">{p.local_sku}</Badge>
                                                        <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Mapped</span>
                                                    </div>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-primary hover:bg-primary/5 gap-1.5">
                                                        <LinkIcon className="h-3 w-3" /> Map SKU
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    {getStockBadge(p.stock_status)}
                                                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{p.inventory_count} Units</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl w-48">
                                                        <DropdownMenuItem className="text-xs gap-2" asChild>
                                                            <Link href={`/ior/products/${p.id}`}><Eye className="h-3.5 w-3.5" /> View Analysis</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs gap-2"><Edit className="h-3.5 w-3.5" /> Editing Mapping</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs gap-2"><RefreshCw className="h-3.5 w-3.5" /> Force Sync Price</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs gap-2"><ShoppingCart className="h-3.5 w-3.5" /> Create Mock Order</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs gap-2 text-primary" asChild>
                                                            <a href={p.source_url} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="h-3.5 w-3.5" /> Open Source URL
                                                            </a>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
