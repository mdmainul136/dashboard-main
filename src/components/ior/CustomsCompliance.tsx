"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    History,
    FileCheck
} from "lucide-react";

const complianceDocuments = [
    { name: "Commercial Invoice", status: "verified", date: "Feb 18, 2026", id: "DOC-2022-01" },
    { name: "Packing List", status: "verified", date: "Feb 18, 2026", id: "DOC-2022-02" },
    { name: "Bill of Lading", status: "pending", date: "Pending Upload", id: "DOC-2022-03" },
    { name: "Certificate of Origin", status: "verified", date: "Feb 19, 2026", id: "DOC-2022-04" },
    { name: "SASO Export Certificate", status: "rejected", date: "Requires Fix", id: "DOC-2022-05" },
];

export function CustomsComplianceView() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-border/60">
                    <CardHeader className="bg-muted/30 border-b border-border/60">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Document Audit Queue</CardTitle>
                                <CardDescription>Tracking mandatory compliance documentation for current imports.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <History className="h-4 w-4" /> Version History
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/60">
                            {complianceDocuments.map((doc) => (
                                <div key={doc.name} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${doc.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500' :
                                                doc.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                                                    'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{doc.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{doc.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:block text-right">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Activity</p>
                                            <p className="text-[11px] font-medium">{doc.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {doc.status === 'verified' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none uppercase text-[10px] font-black tracking-tighter">Verified</Badge>}
                                            {doc.status === 'pending' && <Badge className="bg-amber-500/10 text-amber-500 border-none uppercase text-[10px] font-black tracking-tighter">Pending</Badge>}
                                            {doc.status === 'rejected' && <Badge className="bg-rose-500/10 text-rose-500 border-none uppercase text-[10px] font-black tracking-tighter">Action Required</Badge>}

                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-muted/20 border-t border-border/60">
                            <Button className="w-full gap-2 font-bold uppercase text-[10px] tracking-widest" variant="outline">
                                <Download className="h-4 w-4" /> Download Audit Package (ZIP)
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border/60 bg-gradient-to-br from-card to-emerald-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Compliance Score</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center py-6">
                            <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
                                <svg className="h-full w-full -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="72.8" className="text-emerald-500" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black">80%</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Audit Ready</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wide text-emerald-600/80">Low Risk Profile</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-gradient-to-br from-card to-rose-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-rose-500" /> Critical Warnings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                <p className="text-xs font-bold text-rose-600 mb-1">SASO Certificate Discrepancy</p>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">The product HS code on SASO certificate does not match the commercial invoice.</p>
                                <Button variant="link" className="p-0 h-auto text-[10px] font-black text-rose-600 uppercase mt-2">Fix Discrepancy</Button>
                            </div>
                            <div className="flex items-start gap-3 p-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <p className="text-[11px] text-muted-foreground font-medium">Original Bill of Lading must be courierd to the Riyadh office by Friday.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
