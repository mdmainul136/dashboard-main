"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { refreshModules } from "@/hooks/useMerchantRegion";

function ModuleInitializer() {
    useEffect(() => {
        // Only run if user might be logged in / onboarded
        const isOnboarded = localStorage.getItem("isOnboarded") === "true";
        if (isOnboarded) {
            refreshModules();
        }
    }, []);
    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <CartProvider>
                <TooltipProvider>
                    <ModuleInitializer />
                    {children}
                </TooltipProvider>
            </CartProvider>
        </QueryClientProvider>
    );
}
