"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Rocket } from "lucide-react";
import SaaSRoadmapTab from "@/components/dashboard/SaaSRoadmapTab";

const SaaSPlatformPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-border/60 p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_70%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
              <Rocket className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">SaaS Platform</h1>
              <p className="text-sm text-muted-foreground">Full SaaS roadmap â€” 40+ modules, architecture & pricing</p>
            </div>
          </div>
        </div>

        <SaaSRoadmapTab />
      </div>
    </DashboardLayout>
  );
};

export default SaaSPlatformPage;

