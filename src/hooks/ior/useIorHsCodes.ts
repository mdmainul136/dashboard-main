"use client";

import { useState } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface HsCode {
    id: number;
    code: string;
    description: string;
    duty_rate: number;
    category?: string;
}

export function useIorHsCodes() {
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<HsCode[]>([]);

    const searchHsCodes = async (query: string) => {
        if (!query) return;
        setIsSearching(true);
        try {
            // Laravel Route: GET /ior/hs/search
            const response = await iorApi.get("/api/ior/hs/search", { params: { q: query } });
            if (response.data.success) {
                setResults(response.data.data);
                return response.data.data;
            }
        } catch (error) {
            console.error("HS Code Search Error:", error);
            toast.error("Failed to search HS codes");
        } finally {
            setIsSearching(false);
        }
    };

    const inferHsCode = async (productTitle: string) => {
        setIsSearching(true);
        try {
            // Laravel Route: POST /ior/hs/infer
            const response = await iorApi.post("/api/ior/global/hs/infer", { title: productTitle });
            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            console.error("HS Code Inference Error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    return {
        results,
        isSearching,
        searchHsCodes,
        inferHsCode
    };
}
