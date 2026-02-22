"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import FlashSalesAffiliate from "@/components/sales-channels/FlashSalesAffiliate";

const FlashSalesPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Flash Sales & Affiliate</h1>
        <p className="text-muted-foreground text-sm mt-1">Time-limited deals & influencer tracking</p>
      </div>
      <FlashSalesAffiliate />
    </div>
  </DashboardLayout>
);

export default FlashSalesPage;

