"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search, Plus, MapPin, Package, RefreshCcw, Box, Activity,
    Printer, Truck, ChevronRight, CheckCircle2, Clock,
    MoreHorizontal, Plane, Container, Eye, Download, Globe
} from "lucide-react";
import { useIorWarehouse } from "@/hooks/ior/useIorWarehouse";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { WarehouseItemModal } from "@/components/ior/WarehouseItemModal";
import { BatchModal } from "@/components/ior/BatchModal";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function IorWarehousePage() {
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const {
        batches,
        inventory,
        isProcessing,
        fetchBatches,
        fetchInventory,
        updateBatchStatus
    } = useIorWarehouse();

    useEffect(() => {
        fetchBatches();
        fetchInventory();
    }, [fetchBatches, fetchInventory]);

    const getBatchStatusStyle = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-warning/10 text-warning border-warning/20",
            manifested: "bg-info/10 text-info border-info/20",
            shipped: "bg-primary/10 text-primary border-primary/20",
            in_transit: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
            customs: "bg-chart-4/10 text-chart-4 border-chart-4/20",
            delivered: "bg-success/10 text-success border-success/20",
        };
        return styles[status.toLowerCase()] || "bg-muted text-muted-foreground border-border";
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                                    <Container className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-info/10 text-info border-info/20 text-[10px] font-bold tracking-widest uppercase">
                                    Warehouse Ops
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Logistics Hub</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Orchestrate global inventory, manage consolidated batches, and fulfill outbound linehauls.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-2" onClick={() => { fetchInventory(); fetchBatches(); }}>
                                <RefreshCcw className={cn("h-3.5 w-3.5", isProcessing && "animate-spin")} /> Force Sync
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-blue-500/20 text-sm"
                                onClick={() => setIsItemModalOpen(true)}
                            >
                                <Plus className="h-4 w-4" /> Receive Cargo
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Active Batches", value: batches.length, icon: Box, color: "text-primary" },
                            { label: "Ready to Batch", value: inventory.filter(i => !i.shipment_batch_id).length, icon: Package, color: "text-warning" },
                            { label: "In Transit", value: batches.filter(b => b.status === 'in_transit').length, icon: Plane, color: "text-info" },
                            { label: "System Status", value: "Optimal", icon: Activity, color: "text-success" },
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

                    <Tabs defaultValue="batches" className="w-full">
                        <TabsList className="bg-secondary/50 p-1 rounded-xl w-fit mb-6 border border-border">
                            <TabsTrigger value="batches" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Shipment Batches
                            </TabsTrigger>
                            <TabsTrigger value="inventory" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Inventory Tracker
                            </TabsTrigger>
                            <TabsTrigger value="incoming" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Incoming Shipments
                            </TabsTrigger>
                            <TabsTrigger value="milestones" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Global Milestones
                            </TabsTrigger>
                            <TabsTrigger value="qc" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                QC Desk
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="batches" className="animate-in fade-in duration-500">
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="flex items-center justify-between p-6 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-5 w-5 text-foreground" />
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Active Linehauls</h3>
                                            <p className="text-xs text-muted-foreground">Consolidated outbound shipments.</p>
                                        </div>
                                    </div>
                                    <Button
                                        className="h-9 rounded-xl bg-primary text-primary-foreground font-semibold px-4 text-xs gap-2"
                                        onClick={() => setIsBatchModalOpen(true)}
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Create New Batch
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/50">
                                            <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Batch Identity</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Carrier & Route</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Load Factor</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Status</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-20 text-center text-muted-foreground">
                                                    No active batches found.
                                                </TableCell>
                                            </TableRow>
                                        ) : batches.map((batch) => (
                                            <TableRow key={batch.id} className="group hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground">{batch.batch_number}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase mt-0.5">{new Date(batch.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="secondary" className="px-2 py-0.5 rounded-lg text-[10px] font-bold gap-1 bg-secondary text-foreground">
                                                            <Truck className="h-3 w-3" /> {batch.carrier}
                                                        </Badge>
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                                                            <span>{batch.origin}</span>
                                                            <ChevronRight className="h-2 w-2" />
                                                            <span>{batch.destination}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1.5 max-w-[120px]">
                                                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                                                            <span>{batch.order_count} Items</span>
                                                            <span>{batch.total_weight} KG</span>
                                                        </div>
                                                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full w-[70%]" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", getBatchStatusStyle(batch.status))}>
                                                        {batch.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="text-xs" onClick={() => updateBatchStatus(batch.id, 'shipped')}>Mark as Shipped</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs" onClick={() => updateBatchStatus(batch.id, 'in_transit')}>Move to Transit</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs text-success" onClick={() => updateBatchStatus(batch.id, 'delivered')}>Confirm Delivery</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs border-t mt-1 gap-2"><Download className="h-3.5 w-3.5" /> Manifest</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="inventory" className="animate-in fade-in duration-500">
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="flex items-center justify-between p-6 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-foreground" />
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Inventory Tracker</h3>
                                            <p className="text-xs text-muted-foreground">Items staged and ready for consolidation.</p>
                                        </div>
                                    </div>
                                    <div className="relative w-72">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search cargo..." className="pl-10 h-10 rounded-xl bg-background border-border text-xs" />
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/50">
                                            <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Product Details</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Order ID</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Location</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Batch Status</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inventory.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-secondary overflow-hidden flex items-center justify-center p-2 border border-border">
                                                            {item.product_image ? (
                                                                <img src={item.product_image} alt="" className="h-full w-full object-contain" />
                                                            ) : (
                                                                <Package className="h-6 w-6 text-muted-foreground/30" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-foreground line-clamp-1">{item.product_name}</span>
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.sku || 'No SKU'}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs font-bold text-primary">{item.order_number}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        <span>SECTION-A // BIN-04</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {item.shipment_batch_id ? (
                                                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-[9px] font-bold uppercase">BATCHED</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground border-border text-[9px] font-bold uppercase">UNBATCHED</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-bold uppercase h-9 gap-2">
                                                        <Printer className="h-3.5 w-3.5" /> Relabel
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="qc" className="animate-in fade-in duration-500">
                            <div className="grid md:grid-cols-12 gap-8">
                                <Card className="md:col-span-8 overflow-hidden rounded-2xl border border-border bg-card">
                                    <div className="p-16 flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center shadow-inner">
                                            <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold text-foreground">QC Protocol Active</h3>
                                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                                Scan a barcode or select an item from the inventory tracker to initiate quality inspection.
                                            </p>
                                        </div>
                                        <Button className="bg-primary text-primary-foreground font-semibold px-8 h-12 rounded-xl">
                                            Start Inspection Queue
                                        </Button>
                                    </div>
                                </Card>
                                <Card className="md:col-span-4 rounded-2xl border border-border bg-card p-6">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Relabeling Terminal</h4>
                                    <div className="space-y-4">
                                        <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] font-bold text-primary uppercase">Template: V4.0 BD</p>
                                                <Badge className="bg-success/20 text-success border-none text-[8px]">READY</Badge>
                                            </div>
                                            <div className="aspect-[3/2] bg-background rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2">
                                                <div className="h-2 w-16 bg-muted rounded-full" />
                                                <div className="h-8 w-24 bg-muted/30 rounded-lg" />
                                            </div>
                                            <Button className="w-full bg-primary text-primary-foreground font-bold h-10 rounded-xl text-xs gap-2">
                                                <Printer className="h-3.5 w-3.5" /> Test Print
                                            </Button>
                                        </div>
                                        <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Region Accuracy</span>
                                                <span className="font-bold text-foreground">99.8%</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Labels Printed</span>
                                                <span className="font-bold text-foreground">1,204</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="incoming" className="animate-in fade-in duration-500">
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Awaiting Offload</h3>
                                        <p className="text-xs text-muted-foreground">Shipments currently in-bound from external fulfillment centers.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider gap-2">
                                            <Download className="h-3.5 w-3.5" /> Manifest (PDF)
                                        </Button>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/30">
                                            <TableHead className="text-[10px] font-bold uppercase pl-8 py-5">Origin Hub</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Estimated Arrival</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Items Count</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Net Weight</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold uppercase pr-8">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { origin: "Jebel Ali, Dubai", arrival: "Feb 23, 2026", items: 124, weight: "420.5 KG", status: "In Transit" },
                                            { origin: "New Jersey, USA", arrival: "Feb 28, 2026", items: 84, weight: "115.0 KG", status: "Processing" },
                                            { origin: "Guangzhou, China", arrival: "Mar 02, 2026", items: 256, weight: "890.2 KG", status: "Booked" },
                                        ].map((ship) => (
                                            <TableRow key={ship.origin} className="hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-bold text-foreground">{ship.origin}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground font-medium">{ship.arrival}</TableCell>
                                                <TableCell className="text-center font-bold text-foreground">{ship.items}</TableCell>
                                                <TableCell className="text-center font-mono text-xs font-bold">{ship.weight}</TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase text-primary hover:bg-primary/5">View Details</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="milestones" className="animate-in fade-in duration-500">
                            <div className="grid gap-6 md:grid-cols-12">
                                <Card className="md:col-span-8 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-8">
                                    <h3 className="text-base font-bold text-foreground mb-8">Supply Chain Pathing</h3>
                                    <div className="relative space-y-12 pb-10">
                                        <div className="absolute left-4 top-0 bottom-10 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-secondary" />
                                        {[
                                            { step: "Foreign Intake", desc: "Product received at origin warehouse", date: "Feb 20, 10:45 AM", completed: true },
                                            { step: "Consolidation", desc: "Added to Batch #SR-8492-DAC", date: "Feb 21, 02:15 PM", completed: true },
                                            { step: "Customs Clearance (Origin)", desc: "Export documentation approved", date: "Feb 22, 09:30 AM", completed: true },
                                            { step: "Linehaul Departure", desc: "In-transit via Emirates SkyCargo", date: "Feb 22, 11:50 PM", completed: false, current: true },
                                            { step: "Port Inspection", desc: "Dhaka Customs Bonded Area", date: "Pending", completed: false },
                                            { step: "Local Last-Mile", desc: "Dispatch to Customer Address", date: "Pending", completed: false },
                                        ].map((m, idx) => (
                                            <div key={idx} className="relative pl-10">
                                                <div className={cn("absolute left-0 top-1 h-8 w-8 rounded-full border-4 border-card flex items-center justify-center -translate-x-[15px] transition-all",
                                                    m.completed ? "bg-primary text-white" : m.current ? "bg-card border-primary text-primary animate-pulse" : "bg-secondary text-muted-foreground")}>
                                                    {m.completed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("text-xs font-bold uppercase tracking-wider", m.completed ? "text-foreground" : m.current ? "text-primary font-black" : "text-muted-foreground")}>
                                                        {m.step}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground/80 mt-1 font-medium">{m.desc}</span>
                                                    <span className="text-[10px] text-muted-foreground/60 font-mono mt-2">{m.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <div className="md:col-span-4 space-y-6">
                                    <div className="p-8 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Live Route Telemetry</h4>
                                        <div className="aspect-square bg-secondary/50 rounded-2xl border border-border relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                                <Globe className="h-40 w-40" />
                                            </div>
                                            <div className="absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-dashed border-t-2 border-primary/30 border-dashed" />
                                            <div className="absolute top-1/2 left-1/4 h-2 w-2 bg-primary rounded-full -translate-y-1" />
                                            <div className="absolute top-1/2 right-1/4 h-2 w-2 bg-primary rounded-full -translate-y-1 animate-ping" />
                                            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-card border border-border shadow-lg">
                                                <p className="text-[10px] font-bold text-foreground">DXB → DAC</p>
                                                <div className="h-1.5 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                                                    <div className="h-full bg-primary w-2/3" />
                                                </div>
                                                <p className="text-[9px] text-muted-foreground mt-2 font-medium">ETA: 4h 12m remaining</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <WarehouseItemModal open={isItemModalOpen} onOpenChange={setIsItemModalOpen} />
                    <BatchModal open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen} />
                </div>
            </div>
        </DashboardLayout>
    );
}
