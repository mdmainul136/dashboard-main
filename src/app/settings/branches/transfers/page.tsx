"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowRightLeft,
    ArrowRight,
    Clock,
    CheckCircle,
    Truck,
    Plus,
    Box,
    LayoutGrid,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { format } from "date-fns";
import api from "@/lib/api";
import { toast } from "sonner";

const StockTransfersPage = () => {
    const [transfers, setTransfers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const response = await api.get("/api/stock-transfers");
            if (response.data.success) {
                setTransfers(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to load transfers");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending": return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
            case "in_transit": return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 gap-1"><Truck className="h-3 w-3" /> In Transit</Badge>;
            case "completed": return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
            case "cancelled": return <Badge variant="destructive" className="gap-1">Cancelled</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Inter-Branch Transfers</h1>
                        <p className="text-muted-foreground">Relocate stock between your physical warehouses.</p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> New Transfer
                    </Button>
                </div>

                <div className="flex gap-4 mb-6">
                    <Card className="flex-1">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">In Transit</p>
                                <p className="text-xl font-bold">{transfers.filter(t => t.status === "in_transit").length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Approval</p>
                                <p className="text-xl font-bold">{transfers.filter(t => t.status === "pending").length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Completed Today</p>
                                <p className="text-xl font-bold">12</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transfers List */}
                <div className="space-y-3">
                    {transfers.map((transfer) => (
                        <Card key={transfer.id} className="hover:border-primary/30 transition-all">
                            <CardContent className="p-4">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{transfer.transfer_number}</h4>
                                            <p className="text-xs text-muted-foreground">{format(new Date(transfer.created_at), "MMM dd, yyyy HH:mm")}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 flex-[2] bg-muted/30 p-2 rounded-lg border border-border/50">
                                        <div className="flex-1 text-center">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Source</p>
                                            <p className="text-sm font-semibold">{transfer.from_warehouse?.name || "Main WH"}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground animate-pulse" />
                                        <div className="flex-1 text-center">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Destination</p>
                                            <p className="text-sm font-semibold">{transfer.to_warehouse?.name || "Branch B WH"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 flex-1 justify-end">
                                        {getStatusBadge(transfer.status)}
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {transfers.length === 0 && !loading && (
                        <div className="text-center py-12 rounded-xl border border-dashed text-muted-foreground">
                            <Box className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p>No active stock transfers found</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StockTransfersPage;
