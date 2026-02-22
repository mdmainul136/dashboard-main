"use client";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    FileText, Download, Printer, Calculator,
    ShieldCheck, Truck, Percent
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProformaInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    orderNumber: string;
}

export function ProformaInvoiceModal({ isOpen, onClose, data, orderNumber }: ProformaInvoiceModalProps) {
    if (!data) return null;

    const { breakdown } = data;

    const Row = ({ label, value, icon: Icon, bold = false }: any) => (
        <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-3.5 w-3.5 text-white/40" />}
                <span className="text-xs text-white/50">{label}</span>
            </div>
            <span className={`text-xs ${bold ? "font-bold text-white" : "text-white/80"}`}>
                {value}
            </span>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-black/90 border-white/10 backdrop-blur-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-white">Pro-forma Invoice</DialogTitle>
                            <DialogDescription className="text-white/40">
                                Detailed Landed-Cost Breakdown for {orderNumber}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Financials */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
                            <Calculator className="h-3 w-3" />
                            Landed Cost Breakdown (USD)
                        </h4>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <Row label="Product Price" value={`$${breakdown.financials.price_usd}`} />
                            <Row label="Platform Fee (Nagad/SSL)" value={`$${breakdown.financials.platform_fee_usd}`} />
                            <Row label="Service Fee" value={`$${breakdown.service_fee.amount_usd}`} />
                            <Row label="Customs & Duty" value={`$${breakdown.financials.customs_total_usd}`} icon={ShieldCheck} />
                            <Row label="Intl. Shipping" value={`$${breakdown.financials.shipping_cost_usd}`} icon={Truck} />
                            <div className="mt-2 pt-2 border-t border-white/10">
                                <Row label="Total Value (USD)" value={`$${breakdown.grand_total.usd}`} bold />
                            </div>
                        </div>
                    </div>

                    {/* Right: Bangladesh Conversion */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
                            <Percent className="h-3 w-3" />
                            Conversion & Payable (BDT)
                        </h4>
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <Row label="Exchange Rate" value={`${breakdown.currency.effective_rate} BDT/$`} />
                            <Row label="Product Subtotal" value={`৳${breakdown.currency.product_bdt}`} />
                            <div className="mt-4 space-y-1">
                                <p className="text-[10px] font-medium text-white/40 uppercase">Grand Total Payable</p>
                                <h3 className="text-3xl font-black text-white tracking-tighter">
                                    ৳{breakdown.grand_total.bdt.toLocaleString()}
                                </h3>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-none text-[9px]">
                                    ZATCA Stage 2 Compliant
                                </Badge>
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-none text-[9px]">
                                    HS Code: {breakdown.financials.hs_code}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-8 flex gap-3">
                    <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Quote
                    </Button>
                    <Button className="bg-primary text-white hover:bg-primary/80">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
