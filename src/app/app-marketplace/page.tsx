"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AppMarketplace from "@/components/sales-channels/AppMarketplace";
import { LayoutGrid } from "lucide-react";

const AppMarketplacePage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <LayoutGrid className="h-7 w-7 text-primary" />
          App Marketplace
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Discover & install apps tailored to your business and region</p>
      </div>
      <AppMarketplace />
    </div>
  </DashboardLayout>
);

export default AppMarketplacePage;

