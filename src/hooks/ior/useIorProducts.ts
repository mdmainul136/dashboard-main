"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface IorProduct {
    id: number;
    name: string;
    sku: string;
    local_sku?: string;
    source_url: string;
    source_marketplace: string;
    price_usd: number;
    base_price_bdt: number;
    landed_cost_bdt: number;
    stock_status: "in_stock" | "out_of_stock" | "low_stock";
    inventory_count: number;
    sync_status: "synced" | "pending" | "failed";
    last_sync: string;
    image_url?: string;
    variants?: any[];
}

export function useIorProducts() {
    const [products, setProducts] = useState<IorProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await iorApi.get("/api/ior/products");
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Products error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateSkuMapping = async (productId: number, localSku: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/products/${productId}/map-sku`, { local_sku: localSku });
            if (response.data.success) {
                toast.success("SKU mapping updated");
                fetchProducts();
                return true;
            }
        } catch (error) {
            toast.error("Mapping failed");
        } finally {
            setIsProcessing(false);
        }
        return false;
    };

    const toggleStockSync = async (productId: number, enabled: boolean) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/products/${productId}/toggle-sync`, { enabled });
            if (response.data.success) {
                toast.success(`Inventory sync ${enabled ? "enabled" : "disabled"}`);
                fetchProducts();
            }
        } catch (error) {
            toast.error("Transition failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        products,
        isLoading,
        isProcessing,
        fetchProducts,
        updateSkuMapping,
        toggleStockSync
    };
}
