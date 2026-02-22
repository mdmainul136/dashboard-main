"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye, Users, Clock, TrendingUp, ArrowUpRight, ArrowDownRight,
  Globe, Monitor, Smartphone, Tablet, MapPin,
  MousePointer, BarChart3, PieChart, ExternalLink, Search, Server,
  Activity, Shield, ListTodo, Plus, Zap
} from "lucide-react";
import { useServerTracking } from "@/hooks/useServerTracking";
import { TrackingContainerCard } from "@/components/analytics/TrackingContainerCard";
import { SignalStream } from "@/components/analytics/SignalStream";
import { ComplianceSettings } from "@/components/analytics/ComplianceSettings";

interface PageStat {
  page: string;
  views: number;
  unique: number;
  bounceRate: number;
  avgTime: string;
  trend: "up" | "down" | "flat";
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

interface DeviceStat {
  device: string;
  icon: React.ReactNode;
  percentage: number;
  sessions: number;
}

const pageStats: PageStat[] = [
  { page: "/", views: 4280, unique: 3100, bounceRate: 32, avgTime: "2:45", trend: "up" },
  { page: "/services", views: 1890, unique: 1420, bounceRate: 28, avgTime: "3:12", trend: "up" },
  { page: "/about", views: 1450, unique: 1100, bounceRate: 45, avgTime: "1:58", trend: "flat" },
  { page: "/contact", views: 980, unique: 820, bounceRate: 18, avgTime: "4:30", trend: "up" },
  { page: "/pricing", views: 760, unique: 620, bounceRate: 35, avgTime: "2:10", trend: "down" },
  { page: "/case-studies", views: 540, unique: 410, bounceRate: 22, avgTime: "5:15", trend: "up" },
  { page: "/faq", views: 420, unique: 350, bounceRate: 40, avgTime: "1:45", trend: "flat" },
];

const trafficSources: TrafficSource[] = [
  { source: "Organic Search", visitors: 4200, percentage: 42, color: "bg-primary" },
  { source: "Direct", visitors: 2500, percentage: 25, color: "bg-success" },
  { source: "Social Media", visitors: 1800, percentage: 18, color: "bg-warning" },
  { source: "Referral", visitors: 1000, percentage: 10, color: "bg-destructive" },
  { source: "Email", visitors: 500, percentage: 5, color: "bg-muted-foreground" },
];

const deviceStats: DeviceStat[] = [
  { device: "Desktop", icon: <Monitor className="h-5 w-5" />, percentage: 58, sessions: 5800 },
  { device: "Mobile", icon: <Smartphone className="h-5 w-5" />, percentage: 34, sessions: 3400 },
  { device: "Tablet", icon: <Tablet className="h-5 w-5" />, percentage: 8, sessions: 800 },
];

const topCountries = [
  { name: "Saudi Arabia", visitors: 4200, flag: "ðŸ‡¸ðŸ‡¦" },
  { name: "UAE", visitors: 2100, flag: "ðŸ‡¦ðŸ‡ª" },
  { name: "Egypt", visitors: 1400, flag: "ðŸ‡ªðŸ‡¬" },
  { name: "Kuwait", visitors: 890, flag: "ðŸ‡°ðŸ‡¼" },
  { name: "Bahrain", visitors: 410, flag: "ðŸ‡§ðŸ‡­" },
];

const WebsiteAnalyticsPage = () => {
  const { containers, fetchContainers, deployContainer } = useServerTracking();
  const totalVisitors = 10000;
  const totalPageViews = pageStats.reduce((s, p) => s + p.views, 0);
  const avgBounce = Math.round(pageStats.reduce((s, p) => s + p.bounceRate, 0) / pageStats.length);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Website Analytics</h1>
            <p className="text-muted-foreground text-sm mt-1">Track visitor behavior, page performance, and traffic sources</p>
          </div>
          <Select defaultValue="30d">
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Visitors", value: totalVisitors.toLocaleString(), icon: <Users className="h-5 w-5" />, iconClass: "stat-icon", change: "+24%", up: true },
            { label: "Page Views", value: totalPageViews.toLocaleString(), icon: <Eye className="h-5 w-5" />, iconClass: "stat-icon-info", change: "+18%", up: true },
            { label: "Avg. Bounce Rate", value: `${avgBounce}%`, icon: <MousePointer className="h-5 w-5" />, iconClass: "stat-icon-warning", change: "-5%", up: true },
            { label: "Avg. Session", value: "2:48", icon: <Clock className="h-5 w-5" />, iconClass: "stat-icon-success", change: "+12%", up: true },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={stat.iconClass}>{stat.icon}</div>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${stat.up ? "text-success" : "text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mt-3">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Traffic chart placeholder */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Traffic Overview</CardTitle>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> Visitors</span>
                <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-success" /> Page Views</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1 px-4">
              {Array.from({ length: 30 }).map((_, i) => {
                const h1 = 20 + Math.random() * 70;
                const h2 = h1 * (0.6 + Math.random() * 0.4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t-sm bg-primary/20 transition-all hover:bg-primary/40" style={{ height: `${h1}%` }} />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-4">
              <span>Feb 1</span>
              <span>Feb 8</span>
              <span>Feb 15</span>
              <span>Feb 22</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pages">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="server" className="gap-2">
              <Server className="h-3.5 w-3.5" /> Server Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-3">
            {pageStats.map(page => (
              <Card key={page.page} className="group">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{page.page}</p>
                      <p className="text-xs text-muted-foreground">{page.unique.toLocaleString()} unique visitors</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-foreground">{page.views.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">views</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className={`font-semibold ${page.bounceRate <= 30 ? "text-success" : page.bounceRate <= 40 ? "text-warning" : "text-destructive"}`}>
                        {page.bounceRate}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">bounce</p>
                    </div>
                    <div className="text-right hidden lg:block">
                      <p className="font-semibold text-foreground">{page.avgTime}</p>
                      <p className="text-[10px] text-muted-foreground">avg. time</p>
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-semibold ${page.trend === "up" ? "text-success" : page.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                      {page.trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : page.trend === "down" ? <ArrowDownRight className="h-3.5 w-3.5" /> : <span>â€”</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardContent className="p-6 space-y-5">
                {trafficSources.map(source => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{source.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{source.visitors.toLocaleString()} visitors</span>
                        <Badge variant="outline" className="text-[10px]">{source.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${source.color} transition-all`} style={{ width: `${source.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {deviceStats.map(device => (
                <Card key={device.device}>
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      {device.icon}
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{device.percentage}%</p>
                      <p className="text-sm font-medium text-foreground mt-1">{device.device}</p>
                      <p className="text-xs text-muted-foreground">{device.sessions.toLocaleString()} sessions</p>
                    </div>
                    <Progress value={device.percentage} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="geography">
            {/* ... Geography content remains same ... */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Countries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCountries.map((country, i) => (
                  <div key={country.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{country.name}</p>
                        <p className="text-xs text-muted-foreground">{country.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <Progress value={(country.visitors / topCountries[0].visitors) * 100} className="h-1.5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-10 text-right">
                        {Math.round((country.visitors / totalVisitors) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="server" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Server className="h-4 w-4 text-sidebar-primary" /> Active Containers
                  </h3>
                  <Button size="sm" className="h-8 text-[10px] font-bold gap-2">
                    <Plus className="h-3 w-3" /> Provision Container
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {containers.length > 0 ? (
                    containers.map(c => (
                      <TrackingContainerCard key={c.id} container={c} onDeploy={deployContainer} />
                    ))
                  ) : (
                    // Initial Mock Container
                    <TrackingContainerCard
                      container={{
                        id: "1",
                        container_id: "GTM-P8494FX",
                        name: "Main sGTM Instance",
                        domain: "tracking.antigravity.io",
                        status: "running",
                        created_at: new Date().toISOString()
                      }}
                      onDeploy={() => { }}
                    />
                  )}
                </div>

                <SignalStream />
              </div>

              <div className="space-y-6">
                <Card className="bg-sidebar-primary/5 border-sidebar-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-sidebar-primary" /> Edge Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Server-side tracking bypasses ad-blockers and increases attribution accuracy by up to 25%. Signals are routed through your own domain to maintain first-party context.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold">Attribution Recovery</span>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none">+22%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold">Cookie Lifespan</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none">365 Days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ComplianceSettings />

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black uppercase text-muted-foreground">Active Gateways</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: "Meta Conversion API", status: "Active", icon: "âš›ï¸" },
                      { name: "Google Analytics 4", status: "Active", icon: "ðŸ“ˆ" },
                      { name: "TikTok Events API", status: "Configuring", icon: "â™«" },
                    ].map(g => (
                      <div key={g.name} className="flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-sidebar-border transition-colors group">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{g.icon}</span>
                          <span className="text-[10px] font-bold">{g.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[8px] h-4 px-1">{g.status}</Badge>
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

export default WebsiteAnalyticsPage;

