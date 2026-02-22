"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface PricingRule {
    id: number;
    category?: string;
    marketplace?: string;
    margin_percentage: number;
    fixed_fee_bdt: number;
    is_active: boolean;
}

export function useIorPricing() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [fxRates, setFxRates] = useState<any>(null);

    const fetchPricingRules = useCallback(async () => {
        setIsProcessing(true);
        try {
            const response = await iorApi.get("/api/ior/pricing/rules");
            if (response.data.success) {
                setRules(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Pricing Rules error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const fetchFxRates = useCallback(async () => {
        setIsProcessing(true);
        try {
            const response = await iorApi.get("/api/ior/pricing/fx-rates");
            if (response.data.success) {
                setFxRates(response.data.data);
            }
        } catch (error) {
            console.error("Fetch FX Rates error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const updateRule = async (id: number, data: Partial<PricingRule>) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/pricing/rules/${id}`, data);
            if (response.data.success) {
                toast.success("Pricing rule updated");
                fetchPricingRules();
            }
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        rules,
        fxRates,
        isProcessing,
        fetchPricingRules,
        fetchFxRates,
        updateRule
    };
}
