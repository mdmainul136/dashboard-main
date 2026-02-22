"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface BillingStats {
    balance: number;
    total_spent: number;
    pending_payments: number;
    currency: string;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    status: string;
    created_at: string;
    download_url: string;
}

export function useIorBilling() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [stats, setStats] = useState<BillingStats | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const fetchBillingData = useCallback(async () => {
        try {
            const [statsRes, invoicesRes] = await Promise.all([
                iorApi.get("/api/ior/billing/stats"),
                iorApi.get("/api/ior/invoices")
            ]);

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
            if (invoicesRes.data.success) {
                setInvoices(invoicesRes.data.data);
            }
        } catch (error) {
            console.error("Fetch Billing Error:", error);
        }
    }, []);

    const topupWallet = async (amount: number, method: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/billing/topup", { amount, method });
            if (response.data.success && response.data.redirect_url) {
                window.location.href = response.data.redirect_url;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Topup initiation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        stats,
        invoices,
        isProcessing,
        fetchBillingData,
        topupWallet
    };
}
