"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StaffAccess from "@/components/sales-channels/StaffAccess";

const StaffAccessPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Staff Access</h1>
        <p className="text-muted-foreground text-sm mt-1">Role-based permissions & channel access control</p>
      </div>
      <StaffAccess />
    </div>
  </DashboardLayout>
);

export default StaffAccessPage;

