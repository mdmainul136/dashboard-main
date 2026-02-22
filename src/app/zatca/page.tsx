"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ZATCACompliance from "@/components/sales-channels/ZATCACompliance";

const ZATCAPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ZATCA Compliance</h1>
        <p className="text-muted-foreground text-sm mt-1">E-invoicing & VAT management for Saudi Arabia</p>
      </div>
      <ZATCACompliance />
    </div>
  </DashboardLayout>
);

export default ZATCAPage;

