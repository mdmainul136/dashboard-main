"use client";

import { useState, useCallback } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export function useIorAi() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [bestsellers, setBestsellers] = useState<any[]>([]);

    const generateContent = async (type: string, data: any) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/ai/${type}`, data);
            if (response.data.success) {
                return response.data.content || response.data.data;
            }
        } catch (error) {
            toast.error(`AI ${type} failed`);
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchBestsellers = useCallback(async () => {
        setIsProcessing(true);
        try {
            const response = await iorApi.get("/api/ior/ai/bestsellers");
            if (response.data.success) {
                setBestsellers(response.data.products || []);
            }
        } catch (error) {
            console.error("Fetch Bestsellers error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const generateSocialCaptions = async (productData: any, platform: string = "facebook") => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post("/api/ior/ai/social", { ...productData, platform });
            if (response.data.success) {
                return response.data.content;
            }
        } catch (error) {
            toast.error("Social caption generation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const analyzeImage = async (imageFile: File) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
            const response = await iorApi.post("/api/ior/ai/analyze-image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            toast.error("Image analysis failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const translateToBangla = async (text: string) => {
        setIsProcessing(true);
        try {
            // Support bulk translation if text is an array
            const isBulk = Array.isArray(text);
            const response = await iorApi.post("/api/ior/ai/translate", { text });
            if (response.data.success) {
                return response.data.translation;
            }
        } catch (error) {
            toast.error("Translation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const optimizeSeo = async (data: { title: string; keywords?: string }) => {
        return generateContent("optimize-seo", data);
    };

    const enrichOrder = async (orderId: string) => {
        setIsProcessing(true);
        try {
            const response = await iorApi.post(`/api/ior/ai/enrich-order/${orderId}`);
            if (response.data.success) {
                toast.success("Order enriched with AI metadata");
                return response.data.data;
            }
        } catch (error) {
            toast.error("Order enrichment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isProcessing,
        bestsellers,
        generateContent,
        fetchBestsellers,
        generateSocialCaptions,
        analyzeImage,
        translateToBangla,
        optimizeSeo,
        enrichOrder
    };
}
