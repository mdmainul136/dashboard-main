"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gavel, Info, AlertCircle, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HsCode } from "@/hooks/ior/useIorHsCodes";

interface HsCodeDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hsCode: HsCode | null;
}

export function HsCodeDetailDialog({ open, onOpenChange, hsCode }: HsCodeDetailDialogProps) {
    if (!hsCode) return null;

    const taxBreakdown = [
        { label: "Customs Duty (CD)", rate: hsCode.duty_rate, color: "bg-blue-500" },
        { label: "VAT", rate: 15, color: "bg-emerald-500" },
        { label: "AIT", rate: 5, color: "bg-amber-500" },
        { label: "AT", rate: 5, color: "bg-purple-500" },
        { label: "RD (Regulatory Duty)", rate: 3, color: "bg-red-500" },
    ];

    const totalTax = taxBreakdown.reduce((sum, item) => sum + item.rate, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-sidebar-primary" /> HS Code Details
                    </DialogTitle>
                    <DialogDescription>
                        Comprehensive duty and tax profile for code <span className="font-mono font-bold text-foreground">{hsCode.code}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</h4>
                        <p className="text-sm leading-relaxed">{hsCode.description}</p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tax & Duty Breakdown</h4>
                        <div className="space-y-2">
                            {taxBreakdown.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${item.color}`} />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    <Badge variant="outline" className="font-mono">{item.rate}%</Badge>
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-3 mt-4 rounded-xl bg-sidebar-primary/5 border border-sidebar-primary/10">
                                <span className="font-bold text-sidebar-primary">Total Estimated Tax</span>
                                <Badge className="bg-sidebar-primary font-bold text-lg px-3 py-1">
                                    {totalTax}%
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex gap-3">
                        <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-600 leading-relaxed italic">
                            Rates shown are for general commercial imports as of the latest gazette. Specific SRO exemptions may apply for different industries.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90">
                        <Calculator className="mr-2 h-4 w-4" /> Calculator
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
