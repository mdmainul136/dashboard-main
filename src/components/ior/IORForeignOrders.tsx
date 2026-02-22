"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Search,
    Download,
    Eye,
    Globe,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    MoreHorizontal,
    DollarSign,
    ArrowRight
} from "lucide-react";

const marketplaceLabels: Record<string, { label: string; icon: string }> = {
    amazon: { label: "Amazon", icon: "🛒" },
    alibaba: { label: "Alibaba", icon: "🏭" },
    ebay: { label: "eBay", icon: "🏷️" },
    other: { label: "Global", icon: "🌐" },
};

const orderStatusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
    sourcing: { label: "Sourcing", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: Globe },
    customs: { label: "Customs", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: ShieldCheckIcon },
    delivered: { label: "Delivered", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
};

function ShieldCheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

export function IORForeignOrdersView() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border/60">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search foreign orders..."
                        className="w-full bg-muted/40 border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary/40 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Globe className="h-4 w-4" /> New Import Order
                    </Button>
                </div>
            </div>

            <Card className="border-border/60 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">International Shipments</CardTitle>
                            <CardDescription>Active orders from global marketplaces being processed.</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            Live Tracking
                        </Badge>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-border/60">
                                <TableHead className="w-[120px] font-bold text-[10px] uppercase tracking-wider">Order ID</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider">Product / Source</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider">Payment State</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider">IOR Progress</TableHead>
                                <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider">Amount</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border/60">
                            {[
                                { id: "IOR-9921", name: "High-Capacity Storage Units", source: "alibaba", status: "sourcing", payment: "partial", amount: "$14,200", deadline: "Mar 12" },
                                { id: "IOR-9918", name: "Smart Office Luminescence Set", source: "amazon", status: "customs", payment: "paid", amount: "$3,450", deadline: "Mar 05" },
                                { id: "IOR-9892", name: "Industrial Grade Sensors x20", source: "alibaba", status: "pending", payment: "unpaid", amount: "$2,100", deadline: "Mar 20" },
                                { id: "IOR-9884", name: "Custom Mesh Networking Gear", source: "other", status: "delivered", payment: "paid", amount: "$8,900", deadline: "Feb 28" },
                            ].map((order) => {
                                const status = orderStatusConfig[order.status];
                                const StatusIcon = status.icon;
                                const market = marketplaceLabels[order.source];

                                return (
                                    <TableRow key={order.id} className="hover:bg-muted/20 transition-colors group border-border/60">
                                        <TableCell className="font-mono text-xs font-bold text-primary">{order.id}</TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold leading-none">{order.name}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px]">{market.icon}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{market.label}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${order.payment === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    <span className="text-[10px] uppercase font-extrabold tracking-tighter">
                                                        {order.payment === 'paid' ? 'Settled' : 'Payment Due'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">Deadline: {order.deadline}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`${status.className} text-[10px] font-bold uppercase`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <p className="text-sm font-black">{order.amount}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">CIF Basis</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/60 bg-gradient-to-br from-card to-primary/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Truck className="h-4 w-4 text-primary" /> Active Logistics Path
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="relative space-y-4">
                            {[
                                { stage: "Sourcing Done", date: "Feb 20", active: true },
                                { stage: "Warehouse Transit", date: "Feb 24", active: true },
                                { stage: "Sea Freight (CN -> SA)", date: "Mar 02", active: false },
                                { stage: "ZATCA/Customs Clear", date: "Pending", active: false },
                            ].map((step, idx, arr) => (
                                <div key={step.stage} className="flex gap-4 relative">
                                    {idx !== arr.length - 1 && (
                                        <div className={`absolute left-[7px] top-4 w-[2px] h-full ${step.active ? 'bg-primary/30' : 'bg-border/60'}`} />
                                    )}
                                    <div className={`h-4 w-4 rounded-full border-2 border-background z-10 ${step.active ? 'bg-primary' : 'bg-muted'}`} />
                                    <div className="flex-1 -mt-1 pb-4">
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs font-bold ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>{step.stage}</p>
                                            <span className="text-[10px] font-medium text-muted-foreground">{step.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 flex flex-col justify-center p-8 bg-muted/20">
                    <div className="text-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                            <Package className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold italic">&quot;Your gate to global markets&quot;</h3>
                        <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
                            Efficient sourcing, bonded warehousing, and seamless customs clearance.
                        </p>
                        <Button className="w-full bg-primary font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                            Download IOR Framework
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
