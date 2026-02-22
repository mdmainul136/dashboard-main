"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search, Filter, Download, ExternalLink, MoreVertical, Package, Globe,
    Eye, Truck, FileText, XCircle, ArrowUpDown, RefreshCw, Plus,
    Clock, CheckCircle2, ShoppingBag, DollarSign, ChevronLeft, ChevronRight
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIorOrders } from "@/hooks/ior/useIorOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDialog } from "@/components/ior/OrderDialog";
import { cn } from "@/lib/utils";

export default function IorOrdersPage() {
    const { orders, isLoading, fetchOrders, updateOrderStatus } = useIorOrders();
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusStyle = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-muted text-muted-foreground border-border",
            sourcing: "bg-info/10 text-info border-info/20",
            ordered: "bg-primary/10 text-primary border-primary/20",
            shipped: "bg-warning/10 text-warning border-warning/20",
            customs: "bg-chart-4/10 text-chart-4 border-chart-4/20",
            delivered: "bg-success/10 text-success border-success/20",
            cancelled: "bg-destructive/10 text-destructive border-destructive/20",
        };
        return styles[status] || styles.pending;
    };

    const filteredOrders = orders.filter(o => {
        const matchSearch = !searchQuery ||
            o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === "all" || o.order_status === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
        acc[o.order_status] = (acc[o.order_status] || 0) + 1;
        return acc;
    }, {});

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                                    <ShoppingBag className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold tracking-widest uppercase">
                                    Order Manager
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Foreign Orders</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Track, manage, and fulfill cross-border product imports across all marketplaces.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-2">
                                <Download className="h-3.5 w-3.5" /> Export CSV
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-indigo-500/20 text-sm"
                                onClick={() => setIsOrderDialogOpen(true)}
                            >
                                <Plus className="h-4 w-4" /> New Manual Order
                            </Button>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Orders", value: orders.length, icon: Package, color: "text-primary" },
                            { label: "Active", value: statusCounts["shipped"] || 0 + (statusCounts["sourcing"] || 0) + (statusCounts["ordered"] || 0), icon: Truck, color: "text-info" },
                            { label: "Delivered", value: statusCounts["delivered"] || 0, icon: CheckCircle2, color: "text-success" },
                            { label: "Pending", value: statusCounts["pending"] || 0, icon: Clock, color: "text-warning" },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all">
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
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders, products, customers..."
                                    className="pl-10 h-11 rounded-xl bg-background border-border"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {["all", "pending", "sourcing", "ordered", "shipped", "customs", "delivered"].map(s => (
                                    <Badge
                                        key={s}
                                        variant="outline"
                                        className={cn(
                                            "cursor-pointer capitalize transition-all text-[10px] font-bold px-3 py-1.5 rounded-lg",
                                            statusFilter === s
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "hover:bg-accent"
                                        )}
                                        onClick={() => setStatusFilter(s)}
                                    >
                                        {s === "all" ? "All" : s} {s !== "all" && statusCounts[s] ? `(${statusCounts[s]})` : ""}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/50">
                                        <TableHead className="w-[150px] text-[10px] font-bold uppercase tracking-wider">Order ID</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Product</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Marketplace</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">Amount (BDT)</TableHead>
                                        <TableHead className="w-[80px] text-center text-[10px] font-bold uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={6}><Skeleton className="h-14 w-full rounded-lg" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Package className="h-10 w-10 text-muted-foreground/30" />
                                                    <p className="text-sm text-muted-foreground font-semibold">No orders found</p>
                                                    <p className="text-xs text-muted-foreground/60">Adjust filters or create a new order</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-accent/50 transition-colors group">
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold text-primary">{order.order_number}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[400px] py-4">
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-semibold text-sm truncate text-foreground">{order.product_name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">Cust: {order.customer_name}</span>
                                                        <span className="h-1 w-1 rounded-full bg-border" />
                                                        <a href={order.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                                                            Source <ExternalLink className="h-2.5 w-2.5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="secondary" className="capitalize flex items-center gap-1 w-fit text-[10px] font-bold">
                                                    <Globe className="h-2.5 w-2.5" /> {order.source_marketplace}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className={cn("capitalize font-semibold text-[10px]", getStatusStyle(order.order_status))}>
                                                    {order.order_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-foreground">৳{order.final_price_bdt?.toLocaleString()}</span>
                                                    <span className="text-[10px] text-muted-foreground">BDT</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Order Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="gap-2 text-sm"><Eye className="h-3.5 w-3.5" /> View Details</DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-sm"><ArrowUpDown className="h-3.5 w-3.5" /> Update Status</DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-sm"><Truck className="h-3.5 w-3.5" /> Add Tracking</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 text-sm text-primary"><FileText className="h-3.5 w-3.5" /> View Invoice</DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-sm text-destructive"><XCircle className="h-3.5 w-3.5" /> Cancel Order</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 border-t border-border">
                            <p className="text-xs text-muted-foreground">Showing {filteredOrders.length} of {orders.length} orders</p>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"><ChevronLeft className="h-3.5 w-3.5" /></Button>
                                <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground border-primary">1</Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"><ChevronRight className="h-3.5 w-3.5" /></Button>
                            </div>
                        </div>
                    </div>

                    <OrderDialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen} />
                </div>
            </div>
        </DashboardLayout>
    );
}
