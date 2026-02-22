"use client";

import React, { useState } from "react";
import {
    Palette,
    Layout,
    Globe,
    Eye,
    Smartphone,
    Monitor,
    Sparkles,
    Save,
    Code2,
    ShieldCheck
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ThemeGallery from "@/components/storefront/ThemeGallery";
import StoreCustomizer from "@/components/storefront/StoreCustomizer";
import DomainManager from "@/components/storefront/DomainManager";
import AiThemeAssistant from "@/components/storefront/AiThemeAssistant";
import AiConfigSettings from "@/components/storefront/AiConfigSettings";
import SeoManager from "@/components/storefront/SeoManager";
import CurrencyManager from "@/components/storefront/CurrencyManager";
import DeveloperPortal from "@/components/storefront/DeveloperPortal";
import AdminThemeReview from "@/components/storefront/AdminThemeReview";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { purposeStorefrontConfig } from "@/data/purposeThemes";

const StorefrontPage = () => {
    const { businessPurpose } = useMerchantRegion();
    const [activeTab, setActiveTab] = useState("gallery");
    const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
    const [sandboxConfig, setSandboxConfig] = useState<any>(null);

    const config = businessPurpose ? purposeStorefrontConfig[businessPurpose] : null;

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full space-y-6">
                {/* Header omitted for brevity in chunking */}
                {/* ... (lines 38-75) ... */}

                {/* Builder Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => {
                    setActiveTab(v);
                    if (v !== "customize") setSandboxConfig(null); // Reset sandbox when leaving
                }} className="flex-1 flex flex-col">
                    <TabsList className="grid w-full max-w-4xl grid-cols-7 mb-6">
                        <TabsTrigger value="ai" className="gap-2">
                            <Sparkles className="h-4 w-4 text-primary" /> AI Engine
                        </TabsTrigger>
                        <TabsTrigger value="gallery" className="gap-2">
                            <Palette className="h-4 w-4" /> Themes
                        </TabsTrigger>
                        <TabsTrigger value="customize" className="gap-2">
                            <Layout className="h-4 w-4" /> Customize
                        </TabsTrigger>
                        <TabsTrigger value="optimization" className="gap-2">
                            <Sparkles className="h-4 w-4 text-primary" /> SEO
                        </TabsTrigger>
                        <TabsTrigger value="developers" className="gap-2">
                            <Code2 className="h-4 w-4" /> Developers
                        </TabsTrigger>
                        <TabsTrigger value="moderation" className="gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Moderation
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Globe className="h-4 w-4" /> Settings
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 min-h-0">
                        {/* AI, Gallery, Customize Content ... */}

                        <TabsContent value="ai" className="h-full mt-0 focus-visible:ring-0">
                            <AiThemeAssistant onGenerate={(data) => {
                                setActiveTab("customize");
                            }} />
                        </TabsContent>

                        <TabsContent value="gallery" className="h-full mt-0 focus-visible:ring-0">
                            <ThemeGallery />
                        </TabsContent>

                        <TabsContent value="customize" className="h-full mt-0 focus-visible:ring-0">
                            <StoreCustomizer device={device} sandboxConfig={sandboxConfig} />
                        </TabsContent>

                        <TabsContent value="optimization" className="h-full mt-0 focus-visible:ring-0">
                            <SeoManager />
                        </TabsContent>

                        <TabsContent value="developers" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto pr-2 custom-scrollbar">
                            <DeveloperPortal onSandboxPreview={(config) => {
                                setSandboxConfig(config);
                                setActiveTab("customize");
                            }} />
                        </TabsContent>

                        <TabsContent value="moderation" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto pr-2 custom-scrollbar">
                            <AdminThemeReview />
                        </TabsContent>

                        <TabsContent value="settings" className="h-full mt-0 focus-visible:ring-0 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-12 pb-20">
                                <DomainManager />
                                <div className="border-t pt-12">
                                    <AiConfigSettings />
                                </div>
                                <div className="border-t pt-12">
                                    <CurrencyManager />
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Floating Sparkles for Premium Feel */}
            <div className="fixed bottom-8 right-8 pointer-events-none opacity-20">
                <Sparkles className="h-32 w-32 text-primary" />
            </div>
        </DashboardLayout>
    );
};

export default StorefrontPage;
