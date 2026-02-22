"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SubscriptionPlans from "@/components/sales-channels/SubscriptionPlans";

const SubscriptionPlansPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
        <p className="text-muted-foreground text-sm mt-1">Recurring billing & subscription management</p>
      </div>
      <SubscriptionPlans />
    </div>
  </DashboardLayout>
);

export default SubscriptionPlansPage;

