"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Layers, Package, Truck, Search, RefreshCw,
    CheckCircle2, Clock, AlertCircle, ChevronRight,
    ArrowRight, Plane, Ship, MapPin, Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

interface ShipmentBatch {
    id: number;
    batch_number: string;
    status: string;
    total_orders: number;
    courier: string;
    dispatched_at: string | null;
    created_at: string;
    orders?: any[];
}

export default function IorShipmentBatchesPage() {
    const [batches, setBatches] = useState<ShipmentBatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBatch, setSelectedBatch] = useState<ShipmentBatch | null>(null);
    const [batchDetail, setBatchDetail] = useState<any>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const fetchBatches = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await iorApi.get("/api/ior/shipment-batches");
            if (res.data?.success) setBatches(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch batches:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchBatches(); }, [fetchBatches]);

    const viewBatchDetail = async (batch: ShipmentBatch) => {
        setSelectedBatch(batch);
        setIsDetailLoading(true);
        try {
            const res = await iorApi.get(`/api/ior/shipment-batches/${batch.id}`);
            if (res.data?.success) setBatchDetail(res.data.data);
        } catch {
            toast.error("Failed to load batch details");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "dispatched": return "bg-success/10 text-success border-success/20";
            case "in_transit": return "bg-info/10 text-info border-info/20";
            case "pending": return "bg-warning/10 text-warning border-warning/20";
            case "delivered": return "bg-success/10 text-success border-success/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "dispatched": return <Truck className="h-3 w-3" />;
            case "in_transit": return <Plane className="h-3 w-3" />;
            case "pending": return <Clock className="h-3 w-3" />;
            case "delivered": return <CheckCircle2 className="h-3 w-3" />;
            default: return <AlertCircle className="h-3 w-3" />;
        }
    };

    const filtered = batches.filter(b =>
        !searchQuery ||
        b.batch_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.courier?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
                                    <Layers className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-info/10 text-info border-info/20 text-[10px] font-bold tracking-widest uppercase">
                                    Logistics Hub
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Shipment Batches</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Manage grouped shipments — view dispatch status, track courier assignments, and drill into batch details.
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Batches", value: batches.length, icon: Layers, color: "text-primary" },
                            { label: "Dispatched", value: batches.filter(b => b.status === "dispatched").length, icon: Truck, color: "text-success" },
                            { label: "In Transit", value: batches.filter(b => b.status === "in_transit").length, icon: Plane, color: "text-info" },
                            { label: "Pending", value: batches.filter(b => b.status === "pending").length, icon: Clock, color: "text-warning" },
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

                    {/* Table */}
                    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                        <div className="flex items-center justify-between gap-4 p-6 border-b border-border">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search batches, couriers..."
                                    className="pl-10 h-11 rounded-xl bg-background border-border"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="rounded-xl text-[10px] font-bold uppercase h-9 gap-2" onClick={fetchBatches}>
                                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} /> Refresh
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/50">
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Batch #</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Courier</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider">Orders</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Dispatched</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(4).fill(0).map((_, i) => (
                                            <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-14 w-full rounded-lg" /></TableCell></TableRow>
                                        ))
                                    ) : filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Layers className="h-10 w-10 text-muted-foreground/30" />
                                                    <p className="text-sm text-muted-foreground font-semibold">No shipment batches found</p>
                                                    <p className="text-xs text-muted-foreground/60">Batches are created when orders are dispatched from the warehouse</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filtered.map(batch => (
                                        <TableRow key={batch.id} className="hover:bg-accent/50 transition-colors group cursor-pointer" onClick={() => viewBatchDetail(batch)}>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold text-primary">{batch.batch_number}</span>
                                                    <span className="text-[10px] text-muted-foreground">{new Date(batch.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="secondary" className="text-[10px] font-bold uppercase gap-1">
                                                    <Truck className="h-2.5 w-2.5" /> {batch.courier}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <span className="text-sm font-bold text-foreground">{batch.total_orders}</span>
                                            </TableCell>
                                            <TableCell className="py-4 text-xs text-muted-foreground">
                                                {batch.dispatched_at ? new Date(batch.dispatched_at).toLocaleDateString() : "—"}
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className={cn("capitalize text-[10px] font-semibold gap-1", getStatusStyle(batch.status))}>
                                                    {getStatusIcon(batch.status)} {batch.status?.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Batch Detail Dialog */}
                    <Dialog open={!!selectedBatch} onOpenChange={() => { setSelectedBatch(null); setBatchDetail(null); }}>
                        <DialogContent className="max-w-2xl rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3 text-lg">
                                    <Layers className="h-5 w-5 text-primary" />
                                    Batch: {selectedBatch?.batch_number}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 pt-4">
                                {/* Batch Info */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="rounded-xl bg-secondary p-4 border border-border">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Courier</p>
                                        <p className="text-sm font-semibold text-foreground">{selectedBatch?.courier}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary p-4 border border-border">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Orders</p>
                                        <p className="text-sm font-semibold text-foreground">{selectedBatch?.total_orders}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary p-4 border border-border">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                                        <Badge variant="outline" className={cn("capitalize text-[10px] font-semibold", getStatusStyle(selectedBatch?.status || ""))}>
                                            {selectedBatch?.status?.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Orders in batch */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Orders in Batch</h4>
                                    {isDetailLoading ? (
                                        <div className="space-y-2">
                                            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                                        </div>
                                    ) : batchDetail?.orders?.length > 0 ? (
                                        <div className="space-y-2 max-h-[300px] overflow-auto">
                                            {batchDetail.orders.map((order: any) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all">
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">{order.order_number}</p>
                                                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">{order.product_name}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-foreground">৳{order.final_price_bdt?.toLocaleString()}</p>
                                                        <Badge variant="outline" className={cn("capitalize text-[9px] font-semibold", getStatusStyle(order.order_status))}>
                                                            {order.order_status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-muted-foreground">No order details available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </DashboardLayout>
    );
}
