"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface IorOrder {
    id: number;
    order_number: string;
    product_name: string;
    customer_name: string;
    order_status: string;
    payment_status: string;
    final_price_bdt: number;
    source_url: string;
    source_marketplace: string;
    created_at: string;
}

export function useIorOrders() {
    const [orders, setOrders] = useState<IorOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchOrders = useCallback(async (searchParams: any = {}) => {
        setIsLoading(true);
        try {
            // Laravel Route: GET /ior/orders
            const response = await iorApi.get("/api/ior/orders", { params: searchParams });
            if (response.data.success) {
                setOrders(response.data.data.data || response.data.data);
                setTotal(response.data.data.total || response.data.data.length);
            }
        } catch (error) {
            console.error("Orders Hook Error:", error);
            toast.error("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateOrderStatus = async (orderId: number, status: string) => {
        try {
            // Laravel Route: PUT /ior/orders/{id}/status
            const response = await iorApi.put(`/api/ior/orders/${orderId}/status`, { status });
            if (response.data.success) {
                toast.success("Order status updated");
                fetchOrders(); // Refresh list
                return true;
            }
        } catch (error) {
            toast.error("Failed to update status");
            return false;
        }
    };

    const createOrder = async (orderData: any) => {
        setIsLoading(true);
        try {
            // Laravel Route: POST /api/ior/orders
            const response = await iorApi.post("/api/ior/orders", orderData);
            if (response.data.success) {
                toast.success("Order created successfully");
                fetchOrders(); // Refresh list
                return true;
            }
        } catch (error) {
            console.error("Create Order Error:", error);
            toast.error("Failed to create order");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        orders,
        isLoading,
        total,
        fetchOrders,
        updateOrderStatus,
        createOrder
    };
}
