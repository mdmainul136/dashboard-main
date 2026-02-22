"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SEOManager from "@/components/sales-channels/SEOManager";

const SEOManagerPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Search engine optimization & meta management</p>
      </div>
      <SEOManager />
    </div>
  </DashboardLayout>
);

export default SEOManagerPage;

