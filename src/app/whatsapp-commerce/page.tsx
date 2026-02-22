"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import WhatsAppCommerce from "@/components/sales-channels/WhatsAppCommerce";

const WhatsAppCommercePage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">WhatsApp Commerce</h1>
        <p className="text-muted-foreground text-sm mt-1">Chat-to-order & WhatsApp notifications</p>
      </div>
      <WhatsAppCommerce />
    </div>
  </DashboardLayout>
);

export default WhatsAppCommercePage;

