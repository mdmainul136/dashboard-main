"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    FileText, ShieldCheck, Clock, AlertCircle, Search, Download,
    Eye, ExternalLink, Gavel, History, Zap, Scale, Link, Activity,
    Plus, CheckCircle2, Database, Fingerprint, Cpu, ArrowUpRight,
    RefreshCcw, ChevronRight, SearchCode, Network, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useIorCustoms } from "@/hooks/ior/useIorCustoms";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentUploadOverlay } from "@/components/ior/DocumentUploadOverlay";
import { cn } from "@/lib/utils";

export default function IorCustomsPage() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadConfig, setUploadConfig] = useState<{ title: string; description: string; targetId?: string }>({
        title: "Upload Compliance Document",
        description: "Select or drag files here to upload. Supported formats: PDF, JPG, PNG."
    });

    const openUpload = (title: string, description: string, targetId?: string) => {
        setUploadConfig({ title, description, targetId });
        setIsUploadOpen(true);
    };

    const { documents, stats, isLoading, fetchDocuments, fetchComplianceStats } = useIorCustoms();

    useEffect(() => {
        fetchDocuments();
        fetchComplianceStats();
    }, [fetchDocuments, fetchComplianceStats]);

    const uiDocuments = documents.map((doc: any) => ({
        type: doc.document_type || "General Doc",
        order: doc.order_number || "N/A",
        date: new Date(doc.created_at).toLocaleDateString(),
        status: doc.status || "pending"
    }));

    const getStatusStyle = (status: string) => {
        const styles: Record<string, string> = {
            verified: "bg-success/10 text-success border-success/20",
            approved: "bg-success/10 text-success border-success/20",
            pending: "bg-warning/10 text-warning border-warning/20",
            rejected: "bg-destructive/10 text-destructive border-destructive/20",
        };
        return styles[status.toLowerCase()] || "bg-muted text-muted-foreground border-border";
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-bold tracking-widest uppercase">
                                    Compliance Hub
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Customs & Regulatory</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Monitoring VAT/Duty liability, statutory reporting, and multi-regional regulatory synchronization.
                            </p>
                        </div>
                        <Button
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-emerald-500/20 text-sm"
                            onClick={() => openUpload("Customs Document", "Upload general clearance documents.")}
                        >
                            <Plus className="h-4 w-4" /> Add Compliance Doc
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { label: "Duty Liability", value: "৳1,24,500", icon: Scale, color: "text-emerald-500", desc: "Next Remittance: Mar 05" },
                            { label: "Accrued VAT (15%)", value: "৳84,200", icon: Zap, color: "text-blue-500", desc: "Audit trail verified" },
                            { label: "Pending Assessment", value: "14 Items", icon: Activity, color: "text-warning", desc: "Awaiting Verification" },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                                    <s.icon className={cn("h-4 w-4", s.color)} />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 font-medium">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <Tabs defaultValue="vault" className="w-full">
                        <TabsList className="bg-secondary/50 p-1 rounded-xl w-fit mb-6 border border-border">
                            <TabsTrigger value="vault" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Document Vault
                            </TabsTrigger>
                            <TabsTrigger value="calculator" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Duty Calculator
                            </TabsTrigger>
                            <TabsTrigger value="compliance" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                Compliance Analysis
                            </TabsTrigger>
                            <TabsTrigger value="zatca" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                ZATCA Sync
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="vault" className="animate-in fade-in duration-500">
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="flex items-center justify-between p-6 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-foreground" />
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Compliance Archives</h3>
                                            <p className="text-xs text-muted-foreground">Required documentation for international clearance.</p>
                                        </div>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/50">
                                            <TableHead className="text-[10px] font-bold uppercase pl-6 py-4">Document Type</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Linked Order</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Upload Date</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Status</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {uiDocuments.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-20 text-center text-muted-foreground italic">
                                                    No compliance artifacts detected.
                                                </TableCell>
                                            </TableRow>
                                        ) : uiDocuments.map((doc: any, i: number) => (
                                            <TableRow key={i} className="group hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-secondary rounded-lg">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-foreground">{doc.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs font-bold text-primary">ORD-{doc.order}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground font-medium">{doc.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", getStatusStyle(doc.status))}>
                                                        {doc.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Eye className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Download className="h-4 w-4" /></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="calculator" className="animate-in fade-in duration-500">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="p-6 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                                    <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                                        <Calculator className="h-4 w-4 text-primary" /> Multi-Country Duty Simulator
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product Category</label>
                                            <Input placeholder="e.g. Consumer Electronics" className="h-11 rounded-xl bg-background border-border text-xs" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Declared Value (USD)</label>
                                            <Input type="number" placeholder="500.00" className="h-11 rounded-xl bg-background border-border text-xs" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button variant="outline" className="h-11 rounded-xl text-xs font-semibold">Origin: USA</Button>
                                            <Button variant="outline" className="h-11 rounded-xl text-xs font-semibold text-primary border-primary/20 bg-primary/5">Dest: BD</Button>
                                        </div>
                                        <Button className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 text-xs">
                                            Calculate Legal Liability
                                        </Button>
                                    </div>
                                </Card>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl border border-border bg-secondary/20 space-y-4">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">Customs Duty (25%)</span>
                                            <span className="font-bold text-foreground">৳15,000</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">Reg. Duty (3%)</span>
                                            <span className="font-bold text-foreground">৳1,800</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">VAT (15%)</span>
                                            <span className="font-bold text-foreground">৳9,000</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold text-primary pt-2 border-t border-border/50">
                                            <span>TOTAL LIABILITY</span>
                                            <span>৳25,800</span>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-warning/5 border border-warning/20 flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                                        <p className="text-[10px] text-warning/80 leading-relaxed font-medium">
                                            Calculations are based on National Board of Revenue (NBR) 2025/26 tariff data. Subject to port assessment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="compliance" className="animate-in fade-in duration-500">
                            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-6 border-b border-border bg-secondary/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">Banned & Restricted Watchlist</h3>
                                            <p className="text-xs text-muted-foreground">Automated checks against national restricted item lists.</p>
                                        </div>
                                        <Badge className="bg-success text-white border-none flex items-center gap-1.5 px-3 py-1">
                                            <CheckCircle2 className="h-3 w-3" /> System Live
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid gap-4">
                                        {[
                                            { item: "Lithium Ion Batteries (>100Wh)", status: "RESTRICTED", rule: "Special Handling Required / DG Fee" },
                                            { item: "E-Cigarettes & Vapes", status: "BANNED", rule: "Strict prohibition in destination" },
                                            { item: "Gold & Precious Metals", status: "PERMIT REQUIRED", rule: "Requires central bank clearance" },
                                            { item: "Medical Equipment", status: "RESTRICTED", rule: "DGDA Import Permit needed" },
                                        ].map(item => (
                                            <div key={item.item} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/20 transition-all group">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground">{item.item}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium mt-0.5">{item.rule}</span>
                                                </div>
                                                <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest px-2.5",
                                                    item.status === 'BANNED' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-warning/10 text-warning border-warning/20")}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="zatca" className="animate-in fade-in duration-500">
                            <div className="grid gap-6 md:grid-cols-12">
                                <Card className="md:col-span-8 overflow-hidden rounded-2xl border border-border bg-card">
                                    <div className="p-10 border-b border-border bg-emerald-500/5">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Badge className="bg-emerald-500 text-white border-none text-[8px] mb-2 uppercase tracking-widest">Live Terminal</Badge>
                                                <h3 className="text-xl font-bold text-foreground">Fatoora Phase 2 Sync</h3>
                                                <p className="text-xs text-muted-foreground">KSA Regulatory Clearing Engine Status.</p>
                                            </div>
                                            <Button variant="outline" className="rounded-xl h-10 text-xs font-semibold gap-2">
                                                <Fingerprint className="h-4 w-4 text-emerald-500" /> System Re-auth
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { label: "Stamp Status", val: "VALID", icon: ShieldCheck, color: "text-emerald-500" },
                                                { label: "XML Schema", val: "UBL 2.1", icon: Database, color: "text-blue-500" },
                                                { label: "Sync Latency", val: "84ms", icon: Activity, color: "text-primary" },
                                            ].map(s => (
                                                <div key={s.label} className="p-4 rounded-xl border border-border bg-secondary/20">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{s.label}</p>
                                                    <div className="flex items-center gap-2">
                                                        <s.icon className={cn("h-4 w-4", s.color)} />
                                                        <span className="text-sm font-bold text-foreground">{s.val}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transmission Stream</h4>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                                        <span className="text-xs font-bold font-mono">INV-428{i}-KSA</span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground font-medium">Cleared · 5m ago</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                                <div className="md:col-span-4 space-y-6">
                                    <div className="p-8 rounded-2xl bg-primary text-primary-foreground space-y-4 shadow-xl shadow-primary/20">
                                        <ShieldCheck className="h-10 w-10 text-success" />
                                        <h3 className="text-xl font-bold">Audit Guaranteed</h3>
                                        <p className="text-xs text-primary-foreground/80 leading-relaxed font-medium">
                                            All ZATCA responses are vaulted for 10 years as per KSA tax regulations.
                                        </p>
                                        <Button className="w-full bg-white text-primary hover:bg-secondary font-bold rounded-xl h-11 text-xs">
                                            Access Audit Package
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DocumentUploadOverlay
                        open={isUploadOpen}
                        onOpenChange={setIsUploadOpen}
                        title={uploadConfig.title}
                        description={uploadConfig.description}
                        targetId={uploadConfig.targetId}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
