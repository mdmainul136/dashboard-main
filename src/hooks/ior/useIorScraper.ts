"use client";

import { useState } from "react";
import iorApi from "@/lib/iorApi";
import { toast } from "sonner";

export interface ScrapeResult {
    title: string;
    price_usd: number;
    currency: string;
    marketplace: string;
    availability: string;
    image: string;
    thumbnail?: string;
    estimated_bdt: number;
    duty: number;
    shipping: number;
    total: number;
    source_url: string;
}

export function useIorScraper() {
    const [isScraping, setIsScraping] = useState(false);
    const [result, setResult] = useState<ScrapeResult | null>(null);

    const scrapeProduct = async (url: string) => {
        setIsScraping(true);
        try {
            // Laravel Route: POST /ior/scraper/scrape
            const response = await iorApi.post("/api/ior/scraper/scrape", { url });

            if (response.data.success) {
                setResult(response.data.data);
                toast.success("Product scraped successfully!");
                return response.data.data;
            } else {
                throw new Error(response.data.message || "Scraping failed");
            }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to scrape product";
            toast.error(message);
            console.error("Scraper Hook Error:", error);
            return null;
        } finally {
            setIsScraping(false);
        }
    };

    const bulkScrape = async (urls: string[]) => {
        setIsScraping(true);
        try {
            const response = await iorApi.post("/api/ior/scraper/bulk-scrape", { urls });
            if (response.data.success) {
                toast.success(`Bulk scrape complete: ${response.data.results.length} items.`);
                return response.data.results;
            }
        } catch (error: any) {
            toast.error("Bulk scrape failed");
            return null;
        } finally {
            setIsScraping(false);
        }
    };

    const getQuote = async (usdAmount: number, categoryId?: string) => {
        try {
            const response = await iorApi.post("/api/ior/quote", {
                amount: usdAmount,
                category_id: categoryId
            });
            return response.data.data;
        } catch (error) {
            console.error("Quote Hook Error:", error);
            return null;
        }
    };

    const fetchCatalog = async (query: string = "") => {
        setIsScraping(true);
        try {
            const response = await iorApi.get("/api/ior/scraper/catalog", { params: { q: query } });
            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            console.error("Fetch Catalog Error:", error);
            toast.error("Failed to fetch discovery catalog");
        } finally {
            setIsScraping(false);
        }
        return [];
    };

    const importBulkCatalog = async (file: File) => {
        setIsScraping(true);
        const formData = new FormData();
        formData.append("catalog", file);
        try {
            const response = await iorApi.post("/api/ior/scraper/bulk-import", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data.success) {
                toast.success(`Import queued: ${response.data.import_id}`);
                return response.data;
            }
        } catch (error) {
            toast.error("Bulk import failed");
        } finally {
            setIsScraping(false);
        }
        return null;
    };

    return {
        isScraping,
        result,
        setResult,
        scrapeProduct,
        bulkScrape,
        getQuote,
        fetchCatalog,
        importBulkCatalog
    };
}
