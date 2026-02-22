"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface ShipmentBatch {
    id: number;
    batch_number: string;
    carrier: string;
    origin: string;
    destination: string;
    status: string;
    order_count: number;
    total_weight: number;
    tracking_number: string | null;
    created_at: string;
}

export function useIorWarehouse() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [batches, setBatches] = useState<ShipmentBatch[]>([]);

    const receiveOrder = async (identifier: string, location?: string, note?: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/warehouse/receive", { identifier, location, note });
            if (response.data.success) {
                toast.success(response.data.message);
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to receive order");
        } finally {
            setIsProcessing(false);
        }
    };

    const dispatchOrder = async (orderId: number, courierCode: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/warehouse/dispatch", { order_id: orderId, courier_code: courierCode });
            if (response.data.success) {
                toast.success("Order dispatched successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Dispatch failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const customsClear = async (orderId: number, note?: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/warehouse/customs-clear", { order_id: orderId, note });
            if (response.data.success) {
                toast.success("Customs cleared successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Customs clearance failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const deliverOrder = async (orderId: number, deliveredBy?: string, note?: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/warehouse/deliver", { order_id: orderId, delivered_by: deliveredBy, note });
            if (response.data.success) {
                toast.success("Order delivered successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Delivery confirmation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchBatches = useCallback(async () => {
        try {
            const response = await iorApi.get("/api/ior/shipment-batches");
            if (response.data.success) {
                setBatches(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Batches Error:", error);
        }
    }, []);

    const [inventory, setInventory] = useState<any[]>([]);
    const fetchInventory = useCallback(async () => {
        try {
            const response = await iorApi.get("/api/ior/orders", { params: { status: 'warehouse' } });
            if (response.data.success) {
                setInventory(response.data.data.data);
            }
        } catch (error) {
            console.error("Fetch Inventory Error:", error);
        }
    }, []);

    const createBatch = async (batchData: any) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/shipment-batches", batchData);
            if (response.data.success) {
                toast.success("Shipment batch created");
                fetchBatches();
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create batch");
        } finally {
            setIsProcessing(false);
        }
    };

    const updateBatchStatus = async (batchId: number, status: string, trackingNumber?: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.patch(`/api/ior/shipment-batches/${batchId}`, { status, tracking_number: trackingNumber });
            if (response.data.success) {
                toast.success(`Batch status updated to ${status}`);
                fetchBatches();
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update batch");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isProcessing,
        batches,
        inventory,
        receiveOrder,
        dispatchOrder,
        customsClear,
        deliverOrder,
        fetchBatches,
        fetchInventory,
        createBatch,
        updateBatchStatus
    };
}
