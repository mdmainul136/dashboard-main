"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    FileText, Download, Eye, Printer, CheckCircle2, Clock, XCircle,
    Search, RefreshCw, ChevronLeft, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface IorInvoice {
    id: number;
    invoice_number: string;
    order_id: number;
    order_number: string;
    amount: number;
    status: string;
    created_at: string;
}

export default function IorInvoicesPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<IorInvoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await iorApi.get("/api/ior/invoices");
            if (res.data?.success) setInvoices(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch invoices", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    const handleDownload = async (id: number) => {
        try {
            const res = await iorApi.get(`/api/ior/invoices/${id}/download`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${id}.html`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Invoice downloaded");
        } catch {
            toast.error("Download failed");
        }
    };

    const handlePrint = async (id: number) => {
        try {
            const res = await iorApi.get(`/api/ior/invoices/${id}/download`);
            const printWindow = window.open("", "_blank");
            if (printWindow) {
                printWindow.document.write(res.data);
                printWindow.document.close();
                printWindow.print();
            }
        } catch {
            toast.error("Print failed");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "paid": return "bg-success/10 text-success border-success/20";
            case "pending": return "bg-warning/10 text-warning border-warning/20";
            case "overdue": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const filtered = invoices.filter(inv =>
        !searchQuery ||
        inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.order_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px] font-bold tracking-widest uppercase">
                                    Proforma & Tax
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                View, download, and print proforma invoices with duty breakdown for all IOR orders.
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Total Invoices", value: invoices.length, icon: FileText, color: "text-primary" },
                            { label: "Paid", value: invoices.filter(i => i.status === "paid").length, icon: CheckCircle2, color: "text-success" },
                            { label: "Pending", value: invoices.filter(i => i.status === "pending").length, icon: Clock, color: "text-warning" },
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
                                    placeholder="Search invoices..."
                                    className="pl-10 h-11 rounded-xl bg-background border-border"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="rounded-xl text-[10px] font-bold uppercase h-9 gap-2" onClick={fetchInvoices}>
                                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} /> Refresh
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/50">
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Invoice #</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Order #</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Date</TableHead>
                                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">Amount</TableHead>
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
                                                    <FileText className="h-10 w-10 text-muted-foreground/30" />
                                                    <p className="text-sm text-muted-foreground font-semibold">No invoices found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filtered.map(inv => (
                                        <TableRow key={inv.id} className="hover:bg-accent/50 transition-colors group">
                                            <TableCell className="py-4 font-mono text-xs font-semibold text-primary">{inv.invoice_number}</TableCell>
                                            <TableCell className="py-4 text-xs text-muted-foreground font-medium">{inv.order_number}</TableCell>
                                            <TableCell className="py-4 text-xs text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right py-4 font-bold text-foreground">৳{inv.amount?.toLocaleString()}</TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className={cn("capitalize text-[10px] font-semibold", getStatusStyle(inv.status))}>{inv.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="View" onClick={() => router.push(`/ior/invoices/${inv.id}`)}>
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Download" onClick={() => handleDownload(inv.id)}>
                                                        <Download className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Print" onClick={() => handlePrint(inv.id)}>
                                                        <Printer className="h-3.5 w-3.5" />
                                                    </Button>
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
