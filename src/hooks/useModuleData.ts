"use client";

import { useState, useEffect } from "react";
import { restaurantDishes, restaurantOrders } from "@/data/restaurantMock";

export interface ModuleDataResult<T = any> {
    data: T[];
    isLoading: boolean;
    error: string | null;
}

/**
 * useModuleData — Abstraction hook for fetching feature-specific data.
 * In a real-world scenario, this would call your backend API.
 */
export function useModuleData(moduleId: string, featureId: string): ModuleDataResult {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            // Simulate network latency for high-fidelity feel
            await new Promise(resolve => setTimeout(resolve, 600));

            try {
                let mockData: any[] = [];

                // 1. Restaurant Vertical Logic
                if (moduleId.startsWith("restaurant-")) {
                    if (moduleId === "restaurant-menu") {
                        mockData = restaurantDishes;
                    } else {
                        mockData = restaurantOrders;
                    }
                }
                // 2. Cross-Border IOR Vertical Logic
                else if (moduleId.startsWith("ior-")) {
                    if (moduleId === "ior-customs") {
                        mockData = [
                            { name: "Commercial Invoice", status: "verified", date: "Feb 18, 2026", id: "DOC-2022-01" },
                            { name: "Packing List", status: "verified", date: "Feb 18, 2026", id: "DOC-2022-02" },
                            { name: "Bill of Lading", status: "pending", date: "Pending Upload", id: "DOC-2022-03" },
                            { name: "Certificate of Origin", status: "verified", date: "Feb 19, 2026", id: "DOC-2022-04" },
                        ];
                    } else {
                        mockData = [
                            { id: "IOR-9921", name: "Storage Units", source: "alibaba", status: "sourcing", payment: "partial", amount: "$14,200", deadline: "Mar 12" },
                            { id: "IOR-9918", name: "Smart Lighting", source: "amazon", status: "customs", payment: "paid", amount: "$3,450", deadline: "Mar 05" },
                            { id: "IOR-9892", name: "Industrial Sensors", source: "alibaba", status: "pending", payment: "unpaid", amount: "$2,100", deadline: "Mar 20" },
                        ];
                    }
                }
                // 3. Default / Ecommerce Logic
                else {
                    mockData = Array.from({ length: 6 }, (_, i) => ({
                        id: `ID-00${i + 1}`,
                        name: `${featureId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Item ${i + 1}`,
                        status: i % 2 === 0 ? "Active" : "Pending",
                        date: `Feb ${10 + i}, 2026`,
                        priority: i === 0 ? "High" : "Normal"
                    }));
                }

                setData(mockData);
            } catch (err) {
                console.error("Data fetch error:", err);
                setError("Failed to synchronize with business data source.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [moduleId, featureId]);

    return { data, isLoading, error };
}
