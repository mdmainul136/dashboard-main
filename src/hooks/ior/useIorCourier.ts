"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface Courier {
    id: string;
    name: string;
    type: "Domestic" | "International";
    status: string;
    regions: string[];
}

export function useIorCourier() {
    const [isLoading, setIsLoading] = useState(false);
    const [couriers, setCouriers] = useState<Courier[]>([]);

    const fetchCouriers = useCallback(async () => {
        setIsLoading(true);
        try {
            // This endpoint might need to be refined in routes/api.php if not exists
            const response = await iorApi.get("/api/ior/couriers");
            if (response.data.success) {
                setCouriers(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Couriers Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const bookCourier = async (orderId: number, courierCode: string) => {
        setIsLoading(true);
        try {
            const response = await iorApi.post("/api/ior/couriers/book", { order_id: orderId, courier_code: courierCode });
            if (response.data.success) {
                toast.success("Courier booked successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Booking failed");
        } finally {
            setIsLoading(false);
        }
    };

    const trackShipment = async (trackingNumber: string, courierCode: string) => {
        setIsLoading(true);
        try {
            const response = await iorApi.get(`/api/ior/couriers/track`, { params: { tracking_number: trackingNumber, courier_code: courierCode } });
            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            toast.error("Tracking update failed");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        couriers,
        isLoading,
        fetchCouriers,
        bookCourier,
        trackShipment
    };
}
