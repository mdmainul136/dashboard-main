"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PagesAndBlog from "@/components/sales-channels/PagesAndBlog";

const PagesAndBlogPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pages & Blog</h1>
        <p className="text-muted-foreground text-sm mt-1">Store pages & content management</p>
      </div>
      <PagesAndBlog />
    </div>
  </DashboardLayout>
);

export default PagesAndBlogPage;

