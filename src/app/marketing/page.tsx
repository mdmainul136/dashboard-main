"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MarketingCampaigns from "@/components/sales-channels/MarketingCampaigns";

const MarketingPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marketing Center</h1>
        <p className="text-muted-foreground text-sm mt-1">Social commerce, campaigns & upsell rules</p>
      </div>
      <MarketingCampaigns />
    </div>
  </DashboardLayout>
);

export default MarketingPage;

