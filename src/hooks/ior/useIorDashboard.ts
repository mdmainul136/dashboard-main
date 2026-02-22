"use client";

import { useState, useEffect } from "react";
import iorApi from "@/lib/iorApi";

export interface DashboardStats {
    orders: {
        total: number;
        pending: number;
        active: number;
        delivered: number;
        this_month: number;
    };
    revenue: {
        total: number;
        this_month: number;
        currency: string;
    };
    status_breakdown: Record<string, number>;
    payment_breakdown: Record<string, number>;
    marketplace_breakdown: Record<string, number>;
    recent_orders: Array<{
        id: number;
        order_number: string;
        product_name: string;
        customer_name: string;
        status: string;
        amount: number;
        created_at: string;
    }>;
    monthly_trend: Array<{
        month: string;
        orders: number;
        revenue: number;
    }>;
    exchange_rate: number;
}

export function useIorDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Laravel Route: GET /ior/dashboard
            const response = await iorApi.get("/api/ior/dashboard");
            if (response.data.success) {
                setStats(response.data.data);
            } else {
                throw new Error(response.data.message || "Failed to fetch dashboard stats");
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Error connecting to server";
            setError(message);
            console.error("Dashboard Hook Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, isLoading, error, refresh: fetchStats };
}
