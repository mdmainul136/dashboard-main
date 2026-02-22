"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Wallet,
    CreditCard,
    Loader2,
    DollarSign,
    Smartphone,
    ShieldCheck,
    ChevronRight,
    Zap,
    Banknote,
    Lock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WalletTopupModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WalletTopupModal({ open, onOpenChange }: WalletTopupModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<"bkash" | "nagad" | "card" | "ssl">("bkash");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsProcessing(true);
        // Mock payment initiation
        setTimeout(() => {
            setIsProcessing(false);
            toast.success(`Successfully added ৳${parseFloat(amount).toLocaleString()} to your wallet`);
            onOpenChange(false);
            setAmount("");
        }, 1500);
    };

    const paymentMethods = [
        { id: "bkash", name: "bKash", icon: Smartphone, color: "text-pink-500", bg: "bg-pink-50", ring: "ring-pink-500", border: "border-pink-200" },
        { id: "nagad", name: "Nagad", icon: Smartphone, color: "text-orange-500", bg: "bg-orange-50", ring: "ring-orange-500", border: "border-orange-200" },
        { id: "card", name: "International Card", icon: CreditCard, color: "text-indigo-500", bg: "bg-indigo-50", ring: "ring-indigo-500", border: "border-indigo-200" },
        { id: "ssl", name: "Net Banking", icon: Banknote, color: "text-blue-500", bg: "bg-blue-50", ring: "ring-blue-500", border: "border-blue-200" }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
                <div className="bg-slate-900 p-10 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sidebar-primary/20 blur-[60px] rounded-full translate-x-8 -translate-y-8" />
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="flex items-center gap-3 text-2xl font-black italic uppercase italic tracking-tighter">
                            <Wallet className="h-7 w-7 text-sidebar-primary" /> Liquidity Injection
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 animate-pulse">
                            Tenant Escrow • Secure Settlement Gateway
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white">
                    <div className="space-y-4">
                        <Label htmlFor="amount" className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] italic ml-1">Quantum of Capital (BDT)</Label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-slate-300 group-focus-within:text-sidebar-primary transition-colors italic">৳</div>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="5,000"
                                className="pl-14 h-20 text-3xl font-black rounded-3xl bg-slate-50 border-none focus-visible:ring-sidebar-primary/20 shadow-inner group-hover:bg-slate-100 transition-all placeholder:text-slate-200"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] italic ml-1">Gateway Pipeline</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {paymentMethods.map((pm) => (
                                <div
                                    key={pm.id}
                                    className={cn(
                                        "p-6 border-2 rounded-[1.5rem] cursor-pointer transition-all flex flex-col items-center gap-3 relative overflow-hidden group",
                                        method === pm.id
                                            ? `${pm.bg} ${pm.border} ring-2 ${pm.ring}`
                                            : "hover:bg-slate-50 border-slate-100"
                                    )}
                                    onClick={() => setMethod(pm.id as any)}
                                >
                                    {method === pm.id && (
                                        <div className="absolute top-3 right-3">
                                            <Zap className="h-3 w-3 fill-sidebar-primary text-sidebar-primary" />
                                        </div>
                                    )}
                                    <pm.icon className={cn("h-7 w-7 group-hover:scale-110 transition-transform", method === pm.id ? pm.color : "text-slate-300")} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-tight", method === pm.id ? "text-slate-900" : "text-slate-400")}>{pm.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                            <Lock className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                            Transactional metadata is encrypted via <span className="text-slate-900 font-black">256-bit AES</span>. Escrow release is subject to gateway latency and network verification.
                        </p>
                    </div>
                </form>

                <DialogFooter className="p-10 pt-0 bg-white">
                    <Button
                        className="w-full bg-slate-900 hover:bg-black text-white font-black h-16 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-[0.2em] text-[11px] italic gap-3"
                        onClick={handleSubmit}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Verifying Payload...
                            </>
                        ) : (
                            <>
                                Initialize Settlement <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
