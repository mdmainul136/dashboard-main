"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { type BusinessPurpose, type RegionConfig, type ModuleStatus, type MerchantData } from "@/types/businessPurpose";
import { getRegionByCountry } from "@/data/regionModules";

interface BusinessPurposeState {
    businessPurpose: BusinessPurpose | null;
    country: string | null;
    region: RegionConfig | null;
    merchantData: MerchantData | null;
    currentStep: number;
    purchasedAddons: string[]; // List of module IDs
    isLoading: boolean;
}

interface BusinessPurposeContextType extends BusinessPurposeState {
    setBusinessPurpose: (purpose: BusinessPurpose) => void;
    setCountry: (country: string) => void;
    setMerchantData: (data: Partial<MerchantData>) => void;
    setCurrentStep: (step: number) => void;
    purchaseAddon: (moduleId: string) => void;
    removeAddon: (moduleId: string) => void;
    isModuleAvailable: (moduleId: string) => boolean;
    getModuleStatus: (moduleId: string) => ModuleStatus | "unknown";
    isAddonPurchased: (moduleId: string) => boolean;
    resetOnboarding: () => void;
}

const BusinessPurposeContext = createContext<BusinessPurposeContextType | undefined>(undefined);

export function BusinessPurposeProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<BusinessPurposeState>({
        businessPurpose: null,
        country: null,
        region: null,
        merchantData: null,
        currentStep: 0,
        purchasedAddons: [],
        isLoading: true,
    });

    // Hydrate from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("merchant_context");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const region = parsed.country ? getRegionByCountry(parsed.country) : null;
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setState({
                    ...parsed,
                    region,
                    isLoading: false,
                });
            } catch (e) {
                console.error("Failed to parse merchant context", e);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (!state.isLoading) {
            const toSave = { ...state };
            // Exclude these from persistence to ensure fresh state on reload
            delete (toSave as any).region;
            delete (toSave as any).isLoading;
            localStorage.setItem("merchant_context", JSON.stringify(toSave));
        }
    }, [state]);

    const setBusinessPurpose = useCallback((purpose: BusinessPurpose) => {
        setState(prev => ({ ...prev, businessPurpose: purpose }));
    }, []);

    const setCountry = useCallback((country: string) => {
        const region = getRegionByCountry(country);
        setState(prev => ({ ...prev, country, region: region || null }));
    }, []);

    const setMerchantData = useCallback((data: Partial<MerchantData>) => {
        setState(prev => ({
            ...prev,
            merchantData: prev.merchantData ? { ...prev.merchantData, ...data } : (data as MerchantData),
        }));
    }, []);

    const setCurrentStep = useCallback((step: number) => {
        setState(prev => ({ ...prev, currentStep: step }));
    }, []);

    const purchaseAddon = useCallback((moduleId: string) => {
        setState(prev => ({
            ...prev,
            purchasedAddons: Array.from(new Set([...prev.purchasedAddons, moduleId])),
        }));
    }, []);

    const removeAddon = useCallback((moduleId: string) => {
        setState(prev => ({
            ...prev,
            purchasedAddons: prev.purchasedAddons.filter(id => id !== moduleId),
        }));
    }, []);

    const isAddonPurchased = useCallback((moduleId: string) => {
        return state.purchasedAddons.includes(moduleId);
    }, [state.purchasedAddons]);

    const getModuleStatus = useCallback((moduleId: string): ModuleStatus | "unknown" => {
        if (!state.region) return "unknown";

        // Check if it's explicitly defined in the region
        const regionStatus = state.region.modules[moduleId];
        if (regionStatus) {
            if (regionStatus === "addon" && isAddonPurchased(moduleId)) {
                return "core"; // Purchased addons behave like core
            }
            return regionStatus;
        }

        return "unknown";
    }, [state.region, isAddonPurchased]);

    const isModuleAvailable = useCallback((moduleId: string): boolean => {
        const status = getModuleStatus(moduleId);
        return status === "core" || status === "addon";
    }, [getModuleStatus]);

    const resetOnboarding = useCallback(() => {
        setState({
            businessPurpose: null,
            country: null,
            region: null,
            merchantData: null,
            currentStep: 0,
            purchasedAddons: [],
            isLoading: false,
        });
        localStorage.removeItem("merchant_context");
    }, []);

    const value = useMemo(() => ({
        ...state,
        setBusinessPurpose,
        setCountry,
        setMerchantData,
        setCurrentStep,
        purchaseAddon,
        removeAddon,
        isModuleAvailable,
        getModuleStatus,
        isAddonPurchased,
        resetOnboarding,
    }), [state, setBusinessPurpose, setCountry, setMerchantData, setCurrentStep, purchaseAddon, removeAddon, isModuleAvailable, getModuleStatus, isAddonPurchased, resetOnboarding]);

    return (
        <BusinessPurposeContext.Provider value={value}>
            {children}
        </BusinessPurposeContext.Provider>
    );
}

export function useBusinessPurpose() {
    const context = useContext(BusinessPurposeContext);
    if (context === undefined) {
        throw new Error("useBusinessPurpose must be used within a BusinessPurposeProvider");
    }
    return context;
}
