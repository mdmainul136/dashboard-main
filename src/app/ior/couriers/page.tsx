"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Truck, MapPin, Search, ChevronRight, Activity, Globe,
    Plane, CheckCircle2, Clock, Zap, Navigation, ArrowRight,
    Loader2, RefreshCcw, Package, Info, MoreHorizontal
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useIorCourier } from "@/hooks/ior/useIorCourier";
import { useIorWarehouse } from "@/hooks/ior/useIorWarehouse";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function IorCouriersPage() {
    const { couriers, isLoading, fetchCouriers, bookCourier, trackShipment } = useIorCourier();
    const { batches, fetchBatches } = useIorWarehouse();
    const [isBooking, setIsBooking] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingResult, setTrackingResult] = useState<any>(null);

    useEffect(() => {
        fetchCouriers();
        fetchBatches();
    }, [fetchCouriers, fetchBatches]);

    const domesticCouriers = couriers.filter((c: any) => c.type === "Domestic");
    const internationalCouriers = couriers.filter((c: any) => c.type === "International");

    const handleTrack = async () => {
        if (!trackingNumber) return toast.error("Enter a tracking number");
        const result = await trackShipment(trackingNumber, "auto");
        if (result) setTrackingResult(result);
    };

    const handleBook = async (courier: any) => {
        setIsBooking(true);
        try {
            toast.info(`Initiating booking for ${courier.name}...`);
            await new Promise(r => setTimeout(r, 1000));
            toast.success("Courier API responded successfully");
        } finally {
            setIsBooking(false);
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
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                                    <Navigation className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold tracking-widest uppercase">
                                    Courier Engine
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Logistics & Tracking</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Intelligent routing and booking orchestration for domestic last-mile and global linehaul logistics.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="rounded-xl h-10 text-xs font-semibold gap-2">
                                <Activity className="h-4 w-4 text-success" /> API Health: 100%
                            </Button>
                            <Button className="bg-foreground dark:bg-card hover:bg-foreground text-white rounded-xl font-semibold h-10 px-6 text-sm">
                                Route Calculator
                            </Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Courier List */}
                        <div className="lg:col-span-8 space-y-6">
                            <Tabs defaultValue="international" className="w-full">
                                <TabsList className="bg-secondary/50 p-1 rounded-xl w-fit mb-6 border border-border">
                                    <TabsTrigger value="international" className="rounded-lg px-8 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                        <Globe className="h-3.5 w-3.5 mr-2" /> Global Linehauls
                                    </TabsTrigger>
                                    <TabsTrigger value="domestic" className="rounded-lg px-8 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                        <Truck className="h-3.5 w-3.5 mr-2" /> Domestic Last-Mile
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="international" className="animate-in fade-in duration-500 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {internationalCouriers.map((courier: any) => (
                                            <Card key={courier.id} className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden group">
                                                <div className="p-6 border-b border-border bg-secondary/30 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 bg-background rounded-xl flex items-center justify-center p-3 border border-border shadow-sm group-hover:scale-110 transition-transform">
                                                            <Plane className="h-full w-full text-primary" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-foreground">{courier.name}</h3>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Partner</p>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-success/10 text-success border-none text-[9px] px-2 py-0.5 uppercase tracking-widest font-black">Online</Badge>
                                                </div>
                                                <div className="p-6 space-y-6">
                                                    <div className="space-y-1.5">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                                            <Globe className="h-3 w-3 text-primary" /> Scope
                                                        </p>
                                                        <p className="text-xs font-medium text-foreground line-clamp-1">{courier.regions.join(", ") || "Worldwide"}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="p-3.5 rounded-xl border border-border bg-secondary/50">
                                                            <p className="text-[9px] text-muted-foreground font-bold uppercase mb-1">Transit Time</p>
                                                            <p className="text-sm font-bold text-foreground">3-5 Days</p>
                                                        </div>
                                                        <div className="p-3.5 rounded-xl border border-border bg-secondary/50">
                                                            <p className="text-[9px] text-muted-foreground font-bold uppercase mb-1">Yield Opt.</p>
                                                            <p className="text-sm font-bold text-success">$8.50 / KG</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs gap-2"
                                                        onClick={() => handleBook(courier)}
                                                        disabled={isBooking}
                                                    >
                                                        {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
                                                        Book Linehaul
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="domestic" className="animate-in fade-in duration-500 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {domesticCouriers.map((courier: any) => (
                                            <Card key={courier.id} className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                                <div className="p-6 border-b border-border bg-secondary/30 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 bg-background rounded-xl flex items-center justify-center p-3 border border-border shadow-sm">
                                                            <Truck className="h-full w-full text-warning" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-foreground">{courier.name}</h3>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last-Mile</p>
                                                        </div>
                                                    </div>
                                                    <Switch checked={courier.status === 'active'} />
                                                </div>
                                                <div className="p-6 space-y-6">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                                            <MapPin className="h-3 w-3 text-warning" /> Coverage
                                                        </p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {(courier.regions || []).map((r: any) => (
                                                                <Badge key={r} variant="secondary" className="text-[8px] font-bold uppercase px-2 py-0 border-none bg-secondary text-muted-foreground">
                                                                    {r}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Button className="w-full h-11 rounded-xl bg-foreground dark:bg-card hover:bg-foreground/90 text-white font-bold text-xs" onClick={() => handleBook(courier)}>
                                                        Dispatch Agent
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="rounded-2xl border border-border bg-foreground dark:bg-card p-8 shadow-xl shadow-foreground/10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full translate-x-8 -translate-y-8" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-6 w-6 text-primary" />
                                        <h3 className="text-xl font-bold">Global Pulse</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Radar Tracking</p>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="LHC-9218..."
                                                    className="h-12 bg-white/5 border-white/10 rounded-xl font-bold text-white placeholder:text-muted-foreground px-4 text-xs"
                                                    value={trackingNumber}
                                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                                />
                                                <Button className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white" onClick={handleTrack}>
                                                    <Search className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {trackingResult ? (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in">
                                                <div className="flex justify-between items-center">
                                                    <Badge className="bg-success text-black border-none text-[8px] font-black uppercase">Found</Badge>
                                                    <span className="text-[9px] text-muted-foreground font-mono">2s ago</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="w-1 h-10 bg-success rounded-full" />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold font-foreground text-white">Sort Facility Arrival</span>
                                                        <span className="text-[10px] text-muted-foreground">Dhaka, Bangladesh</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-10 rounded-xl border border-dashed border-white/10 text-center">
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-wider">
                                                    Waiting for payload...
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-secondary rounded-xl">
                                        <Info className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-sm font-bold text-foreground">Optimization Insight</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Neural router predicts consolidating 4 more orders into <span className="text-primary font-bold">#9918</span> will reduce freight costs by 12.4%.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
