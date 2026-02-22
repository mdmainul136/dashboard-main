/**
 * Merchant Dashboard — Main orchestration page.
 */
"use client";

import { useBusinessPurpose } from "@/context/BusinessPurposeContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import MerchantWelcome from "@/components/dashboard/MerchantWelcome";
import UpgradeProBanner from "@/components/dashboard/UpgradeProBanner";
import MerchantChecklist from "@/components/dashboard/MerchantChecklist";
import ModuleSummary from "@/components/dashboard/ModuleSummary";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LiveOrderFeed from "@/components/dashboard/LiveOrderFeed";
import TopDishes from "@/components/dashboard/TopDishes";
import { getMetricsByPurpose } from "@/hooks/useDashboardData";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { businessPurpose, isLoading } = useBusinessPurpose();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !businessPurpose) {
      router.push("/onboarding");
    }
  }, [businessPurpose, isLoading, router]);

  if (isLoading || !businessPurpose) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" suppressHydrationWarning>
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" suppressHydrationWarning />
      </div>
    );
  }

  const metrics = getMetricsByPurpose(businessPurpose);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome & Banner */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MerchantWelcome />
          </div>
          <div className="lg:col-span-4">
            <MerchantChecklist />
          </div>
        </div>

        <UpgradeProBanner />

        {/* Global Statistics/Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StatisticsChart />
          <MonthlySalesChart />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        {/* Orders & Feed */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <RecentOrders />
          </div>
          <div className="xl:col-span-4 space-y-6">
            {businessPurpose === "restaurant" && <TopDishes />}
            <LiveOrderFeed />
          </div>
        </div>

        {/* Module-specific summaries */}
        <ModuleSummary />
      </div>
    </DashboardLayout>
  );
}
