"use client";

import { useState, useCallback } from "react";
import trackingApi from "@/lib/trackingApi";
import { toast } from "sonner";

export interface TrackingContainer {
    id: string;
    container_id: string;
    name: string;
    domain: string;
    status: "running" | "stopped" | "provisioning" | "error";
    deployment_id?: string;
    created_at: string;
}

export interface TrackingStats {
    total_events: number;
    success_rate: number;
    avg_latency: number;
    uptime: number;
}

export function useServerTracking() {
    const [containers, setContainers] = useState<TrackingContainer[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchContainers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await trackingApi.get("/api/tracking/containers");
            setContainers(response.data);
        } catch (error) {
            toast.error("Failed to fetch tracking containers");
        } finally {
            setLoading(false);
        }
    }, []);

    const deployContainer = useCallback(async (id: string) => {
        try {
            await trackingApi.post(`/api/tracking/containers/${id}/deploy`);
            toast.success("Deployment initiated");
            fetchContainers();
        } catch (error) {
            toast.error("Deployment failed");
        }
    }, [fetchContainers]);

    const getStats = useCallback(async (id: string): Promise<TrackingStats | null> => {
        try {
            const response = await trackingApi.get(`/api/tracking/containers/${id}/stats`);
            return response.data;
        } catch (error) {
            return null;
        }
    }, []);

    const sendTestSignal = useCallback(async (eventData: any) => {
        try {
            const response = await trackingApi.post("/api/tracking/signals/send", eventData);
            toast.success("Test signal sent");
            return response.data;
        } catch (error) {
            toast.error("Signal broadcast failed");
            return null;
        }
    }, []);

    return {
        containers,
        loading,
        fetchContainers,
        deployContainer,
        getStats,
        sendTestSignal
    };
}
