"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export function useIorSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [exchangeData, setExchangeData] = useState<any>(null);
    const [shippingRates, setShippingRates] = useState<any[]>([]);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await iorApi.get("/api/ior/settings");
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Settings Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateSettings = async (newSettings: Record<string, any>) => {
        setIsLoading(true);
        try {
            const response = await iorApi.put("/api/ior/settings", { settings: newSettings });
            if (response.data.success) {
                toast.success("Settings saved successfully");
                setSettings((prev: any) => ({ ...prev, ...newSettings }));
                return true;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save settings");
        } finally {
            setIsLoading(false);
        }
        return false;
    };

    const fetchExchangeRate = useCallback(async () => {
        try {
            const response = await iorApi.get("/api/ior/settings/exchange-rate");
            if (response.data.success) {
                setExchangeData(response.data);
            }
        } catch (error) {
            console.error("Fetch Exchange Rate Error:", error);
        }
    }, []);

    const refreshExchangeRate = async () => {
        setIsLoading(true);
        try {
            const response = await iorApi.post("/api/ior/settings/exchange-rate/refresh");
            if (response.data.success) {
                toast.success("Exchange rate refreshed");
                setExchangeData((prev: any) => ({ ...prev, rate: response.data.rate }));
            }
        } catch (error) {
            toast.error("Failed to refresh exchange rate");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchShippingRates = useCallback(async () => {
        try {
            const response = await iorApi.get("/api/ior/settings/shipping-rates");
            if (response.data.success) {
                setShippingRates(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Shipping Rates Error:", error);
        }
    }, []);

    return {
        settings,
        exchangeData,
        shippingRates,
        isLoading,
        fetchSettings,
        updateSettings,
        fetchExchangeRate,
        refreshExchangeRate,
        fetchShippingRates
    };
}
