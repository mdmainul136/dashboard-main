"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Calculator, ArrowRight, DollarSign, TrendingUp, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceItemProps {
    label: string;
    value: string;
    subValue?: string;
    isTotal?: boolean;
}

const PriceItem = ({ label, value, subValue, isTotal }: PriceItemProps) => (
    <div className={cn(
        "flex justify-between items-center py-3",
        isTotal ? "border-t mt-4 pt-5 border-dashed border-border" : "border-b border-border/50 last:border-0"
    )}>
        <div className="flex flex-col gap-0.5">
            <span className={cn(
                "text-xs font-semibold",
                isTotal ? "text-foreground" : "text-muted-foreground"
            )}>
                {label}
            </span>
            {subValue && <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{subValue}</span>}
        </div>
        <div className="text-right">
            <div className={cn(
                "font-bold",
                isTotal ? "text-xl text-primary" : "text-sm text-foreground font-mono"
            )}>
                {value}
            </div>
        </div>
    </div>
);

export function PriceBreakdown({ data, className }: { data: any, className?: string }) {
    if (!data) return null;

    return (
        <Card className={cn("rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden", className)}>
            <CardHeader className="p-6 border-b border-border bg-secondary/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-primary" />
                        Financial Breakdown
                    </CardTitle>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold uppercase tracking-widest">Landed Estimate</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-1">
                    <PriceItem
                        label="Sourcing Price"
                        value={`$${Number(data.price_usd).toFixed(2)}`}
                        subValue={`FX rate @ 120.00 BDT`}
                    />
                    <PriceItem
                        label="Base Conversion"
                        value={`৳${(data.price_usd * 120).toLocaleString()}`}
                    />
                    <PriceItem
                        label="Compliance & Duty"
                        value={`৳${data.estimated_duty_bdt.toLocaleString()}`}
                        subValue="Regulatory assessments"
                    />
                    <PriceItem
                        label="Logistics & Handling"
                        value={`৳${data.shipping_fee_bdt.toLocaleString()}`}
                        subValue="Last-mile delivery"
                    />
                    <PriceItem
                        label="Service Margin"
                        value={`৳${Math.round(data.price_usd * 120 * 0.15).toLocaleString()}`}
                        subValue="IOR Administration"
                    />

                    <PriceItem
                        label="Total Final Price"
                        value={`৳${data.total_landed_bdt.toLocaleString()}`}
                        isTotal
                    />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-success/5 border border-success/20 flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-success" />
                        <span className="text-[10px] font-bold text-success uppercase">Secured Quote</span>
                    </div>
                    <div className="p-3 rounded-xl bg-info/5 border border-info/20 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-info" />
                        <span className="text-[10px] font-bold text-info uppercase">Price Stable</span>
                    </div>
                </div>

                <div className="mt-6 flex gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <Info className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-orange-600/80 leading-relaxed font-medium">
                        Estimates based on real-time HS-code matrix and marketplace API data. Final duty finalized upon customs clearance.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
