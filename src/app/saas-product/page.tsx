"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rocket, Users, DollarSign, TrendingUp, Code, FileText, Zap, BarChart3, ArrowUpRight, ArrowDownRight, Plus, CheckCircle2, Clock, Star, ToggleLeft, ToggleRight, Flag, UserPlus, Activity, CreditCard, RefreshCw, AlertTriangle, Eye, Shield, Target, Percent } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const metrics = {
  mrr: 42500, mrrChange: 18.2,
  users: 5840, usersChange: 24.6,
  churn: 2.1, churnChange: -0.3,
  nps: 72, npsChange: 4.8,
  trialConversion: 34, arpu: 72.8,
};

const plans = [
  { name: "Free", users: 2340, revenue: 0, features: 5, conversion: "12%" },
  { name: "Starter", users: 1850, revenue: 18500, features: 12, conversion: "28%" },
  { name: "Pro", users: 1200, revenue: 36000, features: 25, conversion: "45%" },
  { name: "Enterprise", users: 450, revenue: 67500, features: "All", conversion: "62%" },
];

const changelog = [
  { version: "2.4.0", date: "2026-02-18", title: "AI-Powered Analytics Dashboard", type: "feature", description: "Real-time AI insights and predictive analytics for all plan tiers" },
  { version: "2.3.2", date: "2026-02-10", title: "Performance Optimizations", type: "improvement", description: "50% faster load times for dashboard and reports" },
  { version: "2.3.1", date: "2026-02-05", title: "Bug Fix: Export CSV", type: "fix", description: "Fixed CSV export for large datasets (>100K rows)" },
  { version: "2.3.0", date: "2026-01-28", title: "Webhook Integrations", type: "feature", description: "Support for custom webhooks with retry logic and event filtering" },
  { version: "2.2.0", date: "2026-01-15", title: "Team Collaboration", type: "feature", description: "Real-time collaboration features with commenting and mentions" },
];

const roadmap = [
  { title: "Mobile App", status: "in-progress", votes: 342, eta: "Q2 2026" },
  { title: "GraphQL API", status: "planned", votes: 256, eta: "Q2 2026" },
  { title: "SSO Integration", status: "in-progress", votes: 198, eta: "Q1 2026" },
  { title: "White-label Option", status: "planned", votes: 175, eta: "Q3 2026" },
  { title: "Advanced Reporting", status: "in-progress", votes: 312, eta: "Q1 2026" },
  { title: "Marketplace & Plugins", status: "planned", votes: 145, eta: "Q3 2026" },
];

const typeColors: Record<string, string> = {
  feature: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  improvement: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  fix: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "in-progress": "bg-blue-500/15 text-blue-500 border-blue-500/30",
  planned: "bg-muted text-muted-foreground border-border",
};

const subscriptionData = [
  { month: "Sep", newSubs: 82, churned: 12, mrr: 34200, upgrades: 18, downgrades: 5 },
  { month: "Oct", newSubs: 95, churned: 14, mrr: 36800, upgrades: 22, downgrades: 3 },
  { month: "Nov", newSubs: 110, churned: 11, mrr: 38500, upgrades: 28, downgrades: 4 },
  { month: "Dec", newSubs: 88, churned: 18, mrr: 37200, upgrades: 15, downgrades: 8 },
  { month: "Jan", newSubs: 124, churned: 10, mrr: 40100, upgrades: 32, downgrades: 3 },
  { month: "Feb", newSubs: 136, churned: 9, mrr: 42500, upgrades: 38, downgrades: 2 },
];

const cohortRetention = [
  { cohort: "Sep 2025", m1: 100, m2: 82, m3: 74, m4: 68, m5: 64, m6: 61 },
  { cohort: "Oct 2025", m1: 100, m2: 85, m3: 76, m4: 71, m5: 67 },
  { cohort: "Nov 2025", m1: 100, m2: 88, m3: 79, m4: 73 },
  { cohort: "Dec 2025", m1: 100, m2: 80, m3: 72 },
  { cohort: "Jan 2026", m1: 100, m2: 86 },
  { cohort: "Feb 2026", m1: 100 },
];

const initialFeatureFlags = [
  { id: "ff-1", name: "ai_analytics_v2", label: "AI Analytics V2", description: "Next-gen AI-powered analytics dashboard with predictive insights", enabled: true, rollout: 100, environment: "production" as const, lastUpdated: "2026-02-18", createdBy: "Ahmed K." },
  { id: "ff-2", name: "dark_mode_beta", label: "Dark Mode Beta", description: "New dark theme with improved contrast and OLED support", enabled: true, rollout: 45, environment: "staging" as const, lastUpdated: "2026-02-15", createdBy: "Sara M." },
  { id: "ff-3", name: "graphql_api", label: "GraphQL API", description: "GraphQL endpoint for advanced integrations", enabled: false, rollout: 0, environment: "development" as const, lastUpdated: "2026-02-12", createdBy: "Omar Y." },
  { id: "ff-4", name: "team_collaboration", label: "Team Collaboration", description: "Real-time collaboration with commenting and mentions", enabled: true, rollout: 80, environment: "production" as const, lastUpdated: "2026-02-10", createdBy: "Ahmed K." },
  { id: "ff-5", name: "advanced_export", label: "Advanced Export", description: "Export to PDF, Excel, and Google Sheets with custom templates", enabled: true, rollout: 100, environment: "production" as const, lastUpdated: "2026-02-08", createdBy: "Nora H." },
  { id: "ff-6", name: "sso_integration", label: "SSO Integration", description: "Single Sign-On with SAML 2.0 and OpenID Connect", enabled: true, rollout: 25, environment: "staging" as const, lastUpdated: "2026-02-05", createdBy: "Sara M." },
  { id: "ff-7", name: "webhooks_v2", label: "Webhooks V2", description: "Improved webhook system with retry logic and event filtering", enabled: false, rollout: 0, environment: "development" as const, lastUpdated: "2026-02-01", createdBy: "Omar Y." },
  { id: "ff-8", name: "white_label", label: "White Label", description: "Custom branding and domain for enterprise customers", enabled: true, rollout: 10, environment: "staging" as const, lastUpdated: "2026-01-28", createdBy: "Ahmed K." },
];

const envColors: Record<string, string> = {
  production: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  staging: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  development: "bg-blue-500/15 text-blue-500 border-blue-500/30",
};

const onboardingSteps = [
  { id: 1, name: "Account Creation", completionRate: 100, avgTime: "45s", dropoff: 0 },
  { id: 2, name: "Email Verification", completionRate: 92, avgTime: "2m 10s", dropoff: 8 },
  { id: 3, name: "Profile Setup", completionRate: 84, avgTime: "1m 30s", dropoff: 8.7 },
  { id: 4, name: "Connect First Integration", completionRate: 62, avgTime: "3m 45s", dropoff: 26.2 },
  { id: 5, name: "Import Data", completionRate: 48, avgTime: "5m 20s", dropoff: 22.6 },
  { id: 6, name: "Invite Team Members", completionRate: 35, avgTime: "1m 50s", dropoff: 27.1 },
  { id: 7, name: "Complete First Workflow", completionRate: 28, avgTime: "8m 15s", dropoff: 20 },
];

const onboardingCohorts = [
  { period: "This Week", started: 136, completed: 38, rate: 27.9, avgDays: 2.4 },
  { period: "Last Week", started: 124, completed: 31, rate: 25.0, avgDays: 2.8 },
  { period: "2 Weeks Ago", started: 110, completed: 26, rate: 23.6, avgDays: 3.1 },
  { period: "3 Weeks Ago", started: 95, completed: 20, rate: 21.1, avgDays: 3.5 },
];

const SaaSProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["plans", "changelog", "roadmap", "analytics", "subscriptions", "featureflags", "onboarding"] as const;
  type TabVal = typeof validTabs[number];
  const tabFromUrl = searchParams.get("tab") as TabVal | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "plans";
  const [featureFlags, setFeatureFlags] = useState(initialFeatureFlags);
  const handleTabChange = (value: string) => {
    if (value === "plans") { searchParams.delete("tab"); } else { searchParams.set("tab", value); }
    setSearchParams(searchParams, { replace: true });
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SaaS Product Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor product metrics, manage plans, and track roadmap</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">MRR</span>
              <span className={`text-xs flex items-center gap-0.5 ${metrics.mrrChange > 0 ? "text-emerald-500" : "text-destructive"}`}>
                {metrics.mrrChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{metrics.mrrChange}%
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">${metrics.mrr.toLocaleString()}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Users</span>
              <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />{metrics.usersChange}%</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metrics.users.toLocaleString()}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Churn Rate</span>
              <span className={`text-xs flex items-center gap-0.5 ${metrics.churnChange < 0 ? "text-emerald-500" : "text-destructive"}`}>
                {metrics.churnChange < 0 ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}{Math.abs(metrics.churnChange)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metrics.churn}%</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">NPS Score</span>
              <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />{metrics.npsChange}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metrics.nps}</p>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="plans" className="gap-1.5"><DollarSign className="h-4 w-4" /> Plans & Pricing</TabsTrigger>
            <TabsTrigger value="changelog" className="gap-1.5"><FileText className="h-4 w-4" /> Changelog</TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-1.5"><Rocket className="h-4 w-4" /> Roadmap</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
            <TabsTrigger value="subscriptions" className="gap-1.5"><CreditCard className="h-4 w-4" /> Subscriptions</TabsTrigger>
            <TabsTrigger value="featureflags" className="gap-1.5"><Flag className="h-4 w-4" /> Feature Flags</TabsTrigger>
            <TabsTrigger value="onboarding" className="gap-1.5"><UserPlus className="h-4 w-4" /> Onboarding</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map(p => (
                <Card key={p.name} className={p.name === "Pro" ? "ring-2 ring-primary" : ""}>
                  <CardContent className="p-5 space-y-4">
                    {p.name === "Pro" && <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>}
                    <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Users</span><span className="font-medium text-foreground">{p.users.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="font-medium text-foreground">${p.revenue.toLocaleString()}/mo</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Features</span><span className="font-medium text-foreground">{p.features}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Conversion</span><span className="font-medium text-foreground">{p.conversion}</span></div>
                    </div>
                    <Button variant={p.name === "Pro" ? "default" : "outline"} size="sm" className="w-full">Edit Plan</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="changelog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Release History</CardTitle>
                <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Release</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {changelog.map(c => (
                    <div key={c.version} className="flex gap-4 rounded-xl border border-border p-4">
                      <div className="text-center shrink-0">
                        <Badge variant="outline" className={typeColors[c.type]}>{c.type}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{c.title} <span className="text-xs text-muted-foreground font-normal">v{c.version}</span></h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <div className="space-y-3">
              {roadmap.map(r => (
                <Card key={r.title} className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {r.status === "in-progress" ? <Clock className="h-5 w-5 text-blue-500" /> : <CheckCircle2 className="h-5 w-5 text-muted-foreground" />}
                      <div>
                        <h4 className="font-semibold text-foreground">{r.title}</h4>
                        <p className="text-xs text-muted-foreground">ETA: {r.eta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" />{r.votes} votes</span>
                      <Badge variant="outline" className={typeColors[r.status]}>{r.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Conversion Funnel</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Visitors", value: 45000, pct: 100 },
                    { label: "Sign-ups", value: 5840, pct: 13 },
                    { label: "Trial Started", value: 2100, pct: 36 },
                    { label: "Paid Conversion", value: 714, pct: 34 },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">{f.label}</span><span className="font-medium text-foreground">{f.value.toLocaleString()} ({f.pct}%)</span></div>
                      <Progress value={f.pct} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Key Metrics</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">ARPU</span><span className="font-bold text-foreground">${metrics.arpu}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Trial â†’ Paid</span><span className="font-bold text-foreground">{metrics.trialConversion}%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">DAU / MAU</span><span className="font-bold text-foreground">42%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Session</span><span className="font-bold text-foreground">8.4 min</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Feature Adoption</span><span className="font-bold text-foreground">67%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Support Tickets/Day</span><span className="font-bold text-foreground">24</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Subscription Analytics Tab ============ */}
          <TabsContent value="subscriptions">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Net New Subs</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />12.4%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{subscriptionData[subscriptionData.length - 1].newSubs - subscriptionData[subscriptionData.length - 1].churned}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Upgrades</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />18.8%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{subscriptionData[subscriptionData.length - 1].upgrades}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Churned</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowDownRight className="h-3 w-3" />10%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{subscriptionData[subscriptionData.length - 1].churned}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">LTV</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />8.2%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">$2,184</p>
                </CardContent></Card>
              </div>

              {/* Monthly Trend */}
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Monthly Subscription Trend</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Month</TableHead><TableHead>New Subs</TableHead><TableHead>Churned</TableHead><TableHead>Net</TableHead><TableHead>Upgrades</TableHead><TableHead>Downgrades</TableHead><TableHead>MRR</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {subscriptionData.map(d => (
                        <TableRow key={d.month}>
                          <TableCell className="font-medium">{d.month}</TableCell>
                          <TableCell><span className="text-emerald-500 font-medium">+{d.newSubs}</span></TableCell>
                          <TableCell><span className="text-destructive font-medium">-{d.churned}</span></TableCell>
                          <TableCell><span className="font-bold text-foreground">{d.newSubs - d.churned}</span></TableCell>
                          <TableCell><span className="text-blue-500 font-medium">{d.upgrades}</span></TableCell>
                          <TableCell><span className="text-amber-500 font-medium">{d.downgrades}</span></TableCell>
                          <TableCell><span className="font-bold text-primary">${d.mrr.toLocaleString()}</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Cohort Retention */}
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" /> Cohort Retention</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow>
                        <TableHead>Cohort</TableHead><TableHead>M1</TableHead><TableHead>M2</TableHead><TableHead>M3</TableHead><TableHead>M4</TableHead><TableHead>M5</TableHead><TableHead>M6</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {cohortRetention.map(c => (
                          <TableRow key={c.cohort}>
                            <TableCell className="font-medium text-xs">{c.cohort}</TableCell>
                            {[c.m1, c.m2, c.m3, c.m4, c.m5, c.m6].map((v, i) => (
                              <TableCell key={i}>
                                {v !== undefined ? (
                                  <span className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium min-w-[40px] ${
                                    v >= 80 ? "bg-emerald-500/15 text-emerald-500" :
                                    v >= 60 ? "bg-blue-500/15 text-blue-500" :
                                    v >= 40 ? "bg-amber-500/15 text-amber-500" :
                                    "bg-destructive/15 text-destructive"
                                  }`}>{v}%</span>
                                ) : (
                                  <span className="text-muted-foreground text-xs">â€”</span>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Breakdown */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base">Revenue by Plan</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {plans.map(p => {
                      const totalRev = plans.reduce((s, pl) => s + pl.revenue, 0);
                      const pct = totalRev > 0 ? (p.revenue / totalRev) * 100 : 0;
                      return (
                        <div key={p.name} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{p.name}</span>
                            <span className="font-medium text-foreground">${p.revenue.toLocaleString()}/mo ({pct.toFixed(0)}%)</span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Churn Reasons (Last 30 Days)</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { reason: "Too expensive", pct: 32, count: 14 },
                      { reason: "Missing features", pct: 24, count: 11 },
                      { reason: "Switched to competitor", pct: 18, count: 8 },
                      { reason: "No longer needed", pct: 15, count: 7 },
                      { reason: "Poor support", pct: 11, count: 5 },
                    ].map(r => (
                      <div key={r.reason} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{r.reason}</span>
                          <span className="font-medium text-foreground">{r.count} ({r.pct}%)</span>
                        </div>
                        <Progress value={r.pct} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ============ Feature Flags Tab ============ */}
          <TabsContent value="featureflags">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Flag className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{featureFlags.length}</p><p className="text-xs text-muted-foreground">Total Flags</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><ToggleRight className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{featureFlags.filter(f => f.enabled).length}</p><p className="text-xs text-muted-foreground">Enabled</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Shield className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{featureFlags.filter(f => f.environment === "production").length}</p><p className="text-xs text-muted-foreground">In Production</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Eye className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{featureFlags.filter(f => f.rollout > 0 && f.rollout < 100).length}</p><p className="text-xs text-muted-foreground">Partial Rollout</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Flag className="h-5 w-5 text-primary" /> Feature Flags</CardTitle>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Flag</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {featureFlags.map(f => (
                      <div key={f.id} className="rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Switch
                              checked={f.enabled}
                              onCheckedChange={(checked) => {
                                setFeatureFlags(prev => prev.map(ff => ff.id === f.id ? { ...ff, enabled: checked, rollout: checked ? ff.rollout || 10 : 0 } : ff));
                              }}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-foreground">{f.label}</h4>
                                <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{f.name}</code>
                                <Badge variant="outline" className={envColors[f.environment]}>{f.environment}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                                <span>By {f.createdBy}</span>
                                <span>Updated {f.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24">
                                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                  <span>Rollout</span>
                                  <span className="font-medium">{f.rollout}%</span>
                                </div>
                                <Progress value={f.rollout} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ User Onboarding Tab ============ */}
          <TabsContent value="onboarding">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Started This Week</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />9.7%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{onboardingCohorts[0].started}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Completed</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />22.6%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{onboardingCohorts[0].completed}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Completion Rate</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />2.9%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{onboardingCohorts[0].rate}%</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Avg. Days to Complete</span>
                    <span className="text-xs flex items-center gap-0.5 text-emerald-500"><ArrowDownRight className="h-3 w-3" />14.3%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{onboardingCohorts[0].avgDays}d</p>
                </CardContent></Card>
              </div>

              {/* Onboarding Funnel */}
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Onboarding Funnel</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {onboardingSteps.map((step, i) => (
                      <div key={step.id} className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                          {step.id}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{step.name}</span>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-muted-foreground">Avg: {step.avgTime}</span>
                              {step.dropoff > 0 && (
                                <span className="text-destructive flex items-center gap-0.5">
                                  <ArrowDownRight className="h-3 w-3" />{step.dropoff}% drop
                                </span>
                              )}
                              <span className={`font-bold ${step.completionRate >= 70 ? "text-emerald-500" : step.completionRate >= 40 ? "text-amber-500" : "text-destructive"}`}>
                                {step.completionRate}%
                              </span>
                            </div>
                          </div>
                          <Progress value={step.completionRate} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Cohort Performance */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base">Weekly Cohort Performance</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow>
                        <TableHead>Period</TableHead><TableHead>Started</TableHead><TableHead>Completed</TableHead><TableHead>Rate</TableHead><TableHead>Avg Days</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {onboardingCohorts.map(c => (
                          <TableRow key={c.period}>
                            <TableCell className="font-medium">{c.period}</TableCell>
                            <TableCell>{c.started}</TableCell>
                            <TableCell className="font-medium text-emerald-500">{c.completed}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={c.rate >= 25 ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}>
                                {c.rate}%
                              </Badge>
                            </TableCell>
                            <TableCell>{c.avgDays}d</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Biggest Drop-off Points</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {onboardingSteps
                      .filter(s => s.dropoff > 15)
                      .sort((a, b) => b.dropoff - a.dropoff)
                      .map(s => (
                        <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Step {s.id}: {s.name}</p>
                            <p className="text-xs text-muted-foreground">Avg time: {s.avgTime} â€¢ {s.completionRate}% reach this step</p>
                          </div>
                          <span className="text-lg font-bold text-destructive">{s.dropoff}%</span>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SaaSProductPage;
