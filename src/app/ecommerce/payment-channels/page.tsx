"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PaymentMethods from "@/components/sales-channels/PaymentMethods";

const PaymentChannelsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment Channels</h1>
        <p className="text-muted-foreground text-sm mt-1">Payment gateways, refunds & wallet management</p>
      </div>
      <PaymentMethods />
    </div>
  </DashboardLayout>
);

export default PaymentChannelsPage;

