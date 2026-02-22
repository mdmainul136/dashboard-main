"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Palette, Globe } from "lucide-react";
import ThemeGallery from "@/components/storefront/ThemeGallery";
import StoreCustomizer from "@/components/storefront/StoreCustomizer";
import DomainManager from "@/components/storefront/DomainManager";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { getThemesForPurpose, purposeStorefrontConfig } from "@/data/purposeThemes";

const Storefront = () => {
  const { businessPurpose } = useMerchantRegion();
  const purpose = businessPurpose || "ecommerce";
  const themes = getThemesForPurpose(purpose);
  const config = purposeStorefrontConfig[purpose];
  const [activeTheme, setActiveTheme] = useState(themes[0]?.id || "");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="page-header">
          <div>
            <h1 className="page-title">{config.title}</h1>
            <p className="page-subtitle">{config.description}</p>
          </div>
        </div>

        <Tabs defaultValue="themes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="themes" className="gap-1.5">
              <Paintbrush className="h-4 w-4" /> Theme Gallery
            </TabsTrigger>
            <TabsTrigger value="customize" className="gap-1.5">
              <Palette className="h-4 w-4" /> Customize
            </TabsTrigger>
            <TabsTrigger value="domain" className="gap-1.5">
              <Globe className="h-4 w-4" /> Domain & SSL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes">
            <ThemeGallery themes={themes} onSelectTheme={setActiveTheme} />
          </TabsContent>

          <TabsContent value="customize">
            <StoreCustomizer defaults={config.customizerDefaults} />
          </TabsContent>

          <TabsContent value="domain">
            <DomainManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Storefront;

