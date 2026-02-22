"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface SourcingStats {
    proxy_status: string;
    fx_status: string;
    marketplace_health: Record<string, string>;
    total_scrapes: number;
    success_rate: number;
    cost_mtd: number;
}

export function useIorSourcing() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [stats, setStats] = useState<SourcingStats | null>(null);
    const [pendingItems, setPendingItems] = useState<any[]>([]);

    const fetchSourcingStats = useCallback(async () => {
        setIsProcessing(true);
        try {
            const response = await iorApi.get("/api/ior/admin/sourcing/dashboard");
            if (response.data.success) {
                setStats(response.data.data.stats || response.data.data);
            }
        } catch (error) {
            console.error("Fetch Sourcing Stats error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const fetchPendingItems = useCallback(async () => {
        setIsProcessing(true);
        try {
            const response = await iorApi.get("/api/ior/admin/sourcing/pending");
            if (response.data.success) {
                setPendingItems(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Pending Items error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const approveItem = async (id: number) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/admin/sourcing/approve/${id}`);
            if (response.data.success) {
                toast.success("Product approved for catalog");
                fetchPendingItems();
                return true;
            }
        } catch (error) {
            toast.error("Approval failed");
        } finally {
            setIsProcessing(false);
        }
        return false;
    };

    const rewriteItem = async (id: number, lang: string = 'both') => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/admin/sourcing/rewrite/${id}`, { lang });
            if (response.data.success) {
                toast.success("AI content regeneration complete");
                fetchPendingItems();
                return true;
            }
        } catch (error) {
            toast.error("AI rewrite failed");
        } finally {
            setIsProcessing(false);
        }
        return false;
    };

    const blockSku = async (id: number, reason: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/admin/sourcing/block-sku/${id}`, { reason });
            if (response.data.success) {
                toast.warning("SKU has been blocked");
                fetchPendingItems();
                return true;
            }
        } catch (error) {
            toast.error("Failed to block SKU");
        } finally {
            setIsProcessing(false);
        }
        return false;
    };

    const blockDomain = async (domain: string, reason: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/admin/sourcing/block-domain", { domain, reason });
            if (response.data.success) {
                toast.error(`Domain ${domain} blocked`);
                return true;
            }
        } catch (error) {
            toast.error("Failed to block domain");
        } finally {
            setIsProcessing(false);
        }
        return false;
    };

    const purchaseProxy = async (type: 'shared' | 'dedicated', provider: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/admin/sourcing/purchase-proxy", { type, provider });
            if (response.data.success) {
                toast.success("New proxy lease activated");
                fetchSourcingStats();
                return true;
            }
        } catch (error) {
            toast.error("Proxy lease failed");
        } finally {
            setIsProcessing(false);
        }
        return false;
    };

    return {
        isProcessing,
        stats,
        pendingItems,
        fetchSourcingStats,
        fetchPendingItems,
        approveItem,
        rewriteItem,
        blockSku,
        blockDomain,
        purchaseProxy
    };
}
