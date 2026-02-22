"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export function useIorCustoms() {
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            // This might use a 'documents' endpoint or order-related logs
            const response = await iorApi.get("/api/ior/customs/documents");
            if (response.data.success) {
                setDocuments(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Documents Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchComplianceStats = useCallback(async () => {
        try {
            const response = await iorApi.get("/api/ior/customs/stats");
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Compliance Stats Error:", error);
        }
    }, []);

    return {
        documents,
        stats,
        isLoading,
        fetchDocuments,
        fetchComplianceStats
    };
}
