"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Shield, Globe, ToggleLeft, Plus, Search, Copy, Trash2, Edit,
  Building2, Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, Server,
  Database, Users, Layers, ExternalLink, RefreshCw
} from "lucide-react";

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  customDomain: string | null;
  plan: "starter" | "business" | "pro" | "enterprise";
  status: "active" | "suspended" | "trial";
  dbSchema: string;
  storageQuota: string;
  usedStorage: string;
  usersCount: number;
  createdAt: string;
}

interface SubdomainConfig {
  id: string;
  tenantId: string;
  tenantName: string;
  subdomain: string;
  customDomain: string | null;
  sslStatus: "active" | "pending" | "expired";
  dnsStatus: "verified" | "pending" | "failed";
  primaryDomain: string;
  redirectWww: boolean;
}

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: "global" | "plan" | "tenant";
  targetPlans: string[];
  targetTenants: string[];
  rolloutPercentage: number;
  createdAt: string;
}

const initialTenants: Tenant[] = [
  { id: "t1", name: "Al-Futtaim Group", slug: "alfuttaim", subdomain: "alfuttaim", customDomain: "shop.alfuttaim.com", plan: "enterprise", status: "active", dbSchema: "tenant_alfuttaim", storageQuota: "100 GB", usedStorage: "42.3 GB", usersCount: 156, createdAt: "2024-11-01" },
  { id: "t2", name: "Jarir Bookstore", slug: "jarir", subdomain: "jarir", customDomain: "store.jarir.com", plan: "pro", status: "active", dbSchema: "tenant_jarir", storageQuota: "50 GB", usedStorage: "18.7 GB", usersCount: 89, createdAt: "2024-12-15" },
  { id: "t3", name: "Nahdi Medical", slug: "nahdi", subdomain: "nahdi", customDomain: null, plan: "business", status: "active", dbSchema: "tenant_nahdi", storageQuota: "25 GB", usedStorage: "8.1 GB", usersCount: 34, createdAt: "2025-01-10" },
  { id: "t4", name: "Tamimi Markets", slug: "tamimi", subdomain: "tamimi", customDomain: null, plan: "starter", status: "trial", dbSchema: "tenant_tamimi", storageQuota: "5 GB", usedStorage: "0.4 GB", usersCount: 5, createdAt: "2025-02-05" },
  { id: "t5", name: "Extra Electronics", slug: "extra", subdomain: "extra", customDomain: "mall.extra.com.sa", plan: "pro", status: "suspended", dbSchema: "tenant_extra", storageQuota: "50 GB", usedStorage: "31.2 GB", usersCount: 67, createdAt: "2024-10-20" },
];

const initialSubdomains: SubdomainConfig[] = [
  { id: "s1", tenantId: "t1", tenantName: "Al-Futtaim Group", subdomain: "alfuttaim.salla.sa", customDomain: "shop.alfuttaim.com", sslStatus: "active", dnsStatus: "verified", primaryDomain: "shop.alfuttaim.com", redirectWww: true },
  { id: "s2", tenantId: "t2", tenantName: "Jarir Bookstore", subdomain: "jarir.salla.sa", customDomain: "store.jarir.com", sslStatus: "active", dnsStatus: "verified", primaryDomain: "store.jarir.com", redirectWww: true },
  { id: "s3", tenantId: "t3", tenantName: "Nahdi Medical", subdomain: "nahdi.salla.sa", customDomain: null, sslStatus: "active", dnsStatus: "verified", primaryDomain: "nahdi.salla.sa", redirectWww: false },
  { id: "s4", tenantId: "t4", tenantName: "Tamimi Markets", subdomain: "tamimi.salla.sa", customDomain: null, sslStatus: "pending", dnsStatus: "pending", primaryDomain: "tamimi.salla.sa", redirectWww: false },
  { id: "s5", tenantId: "t5", tenantName: "Extra Electronics", subdomain: "extra.salla.sa", customDomain: "mall.extra.com.sa", sslStatus: "expired", dnsStatus: "failed", primaryDomain: "mall.extra.com.sa", redirectWww: true },
];

const initialFlags: FeatureFlag[] = [
  { id: "f1", key: "pos_offline_mode", name: "POS Offline Mode", description: "Enable offline POS transactions with sync", enabled: true, scope: "plan", targetPlans: ["pro", "enterprise"], targetTenants: [], rolloutPercentage: 100, createdAt: "2025-01-15" },
  { id: "f2", key: "ai_product_descriptions", name: "AI Product Descriptions", description: "Auto-generate product descriptions using AI", enabled: true, scope: "global", targetPlans: [], targetTenants: [], rolloutPercentage: 75, createdAt: "2025-02-01" },
  { id: "f3", key: "whatsapp_commerce", name: "WhatsApp Commerce", description: "Sell products via WhatsApp catalog", enabled: true, scope: "plan", targetPlans: ["business", "pro", "enterprise"], targetTenants: [], rolloutPercentage: 100, createdAt: "2024-12-20" },
  { id: "f4", key: "multi_warehouse", name: "Multi-Warehouse", description: "Manage inventory across multiple warehouses", enabled: false, scope: "plan", targetPlans: ["enterprise"], targetTenants: [], rolloutPercentage: 0, createdAt: "2025-02-10" },
  { id: "f5", key: "beta_analytics_v2", name: "Analytics V2 (Beta)", description: "New analytics dashboard with real-time metrics", enabled: true, scope: "tenant", targetPlans: [], targetTenants: ["t1", "t2"], rolloutPercentage: 100, createdAt: "2025-02-15" },
  { id: "f6", key: "zatca_phase2", name: "ZATCA Phase 2", description: "Full ZATCA e-invoicing compliance phase 2", enabled: true, scope: "global", targetPlans: [], targetTenants: [], rolloutPercentage: 100, createdAt: "2024-11-01" },
  { id: "f7", key: "custom_checkout", name: "Custom Checkout Builder", description: "Drag-and-drop checkout page builder", enabled: false, scope: "plan", targetPlans: ["pro", "enterprise"], targetTenants: [], rolloutPercentage: 0, createdAt: "2025-02-18" },
];

// â”€â”€â”€ Helper Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PlanBadge = ({ plan }: { plan: string }) => {
  const colors: Record<string, string> = {
    starter: "bg-muted text-muted-foreground",
    business: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    pro: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    enterprise: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };
  return <Badge className={`${colors[plan] || colors.starter} border-0 font-semibold capitalize`}>{plan}</Badge>;
};

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    active: "bg-emerald-500", verified: "bg-emerald-500",
    trial: "bg-blue-500", pending: "bg-amber-500",
    suspended: "bg-destructive", failed: "bg-destructive", expired: "bg-destructive",
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${colors[status] || "bg-muted"}`} />
      <span className="capitalize text-sm">{status}</span>
    </span>
  );
};

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MultiTenantPage = () => {
  const [tenants, setTenants] = useState(initialTenants);
  const [subdomains] = useState(initialSubdomains);
  const [flags, setFlags] = useState(initialFlags);
  const [searchTenant, setSearchTenant] = useState("");
  const [searchFlag, setSearchFlag] = useState("");
  const [addFlagOpen, setAddFlagOpen] = useState(false);
  const [addTenantOpen, setAddTenantOpen] = useState(false);

  // â”€â”€â”€ New flag form state
  const [newFlag, setNewFlag] = useState({ key: "", name: "", description: "", scope: "global" as FeatureFlag["scope"] });

  // â”€â”€â”€ New tenant form state
  const [newTenant, setNewTenant] = useState({
    name: "", slug: "", plan: "starter" as Tenant["plan"], storageQuota: "5 GB", customDomain: "",
  });

  const handleAddTenant = () => {
    if (!newTenant.name || !newTenant.slug) {
      toast.error("Name and slug are required");
      return;
    }
    if (tenants.some(t => t.slug === newTenant.slug)) {
      toast.error("Slug already exists");
      return;
    }
    const quotaMap: Record<string, string> = { starter: "5 GB", business: "25 GB", pro: "50 GB", enterprise: "100 GB" };
    setTenants(prev => [...prev, {
      id: `t${Date.now()}`,
      name: newTenant.name,
      slug: newTenant.slug,
      subdomain: newTenant.slug,
      customDomain: newTenant.customDomain || null,
      plan: newTenant.plan,
      status: "trial",
      dbSchema: `tenant_${newTenant.slug}`,
      storageQuota: quotaMap[newTenant.plan] || "5 GB",
      usedStorage: "0 GB",
      usersCount: 1,
      createdAt: new Date().toISOString().split("T")[0],
    }]);
    setNewTenant({ name: "", slug: "", plan: "starter", storageQuota: "5 GB", customDomain: "" });
    setAddTenantOpen(false);
    toast.success("Tenant created successfully");
  };

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchTenant.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTenant.toLowerCase())
  );

  const filteredFlags = flags.filter(f =>
    f.name.toLowerCase().includes(searchFlag.toLowerCase()) ||
    f.key.toLowerCase().includes(searchFlag.toLowerCase())
  );

  const toggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === "active" ? "suspended" : "active" } : t
    ));
    toast.success("Tenant status updated");
  };

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
    toast.success("Feature flag toggled");
  };

  const addFlag = () => {
    if (!newFlag.key || !newFlag.name) {
      toast.error("Key and Name are required");
      return;
    }
    setFlags(prev => [...prev, {
      id: `f${Date.now()}`,
      ...newFlag,
      enabled: false,
      targetPlans: [],
      targetTenants: [],
      rolloutPercentage: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }]);
    setNewFlag({ key: "", name: "", description: "", scope: "global" });
    setAddFlagOpen(false);
    toast.success("Feature flag created");
  };

  const deleteFlag = (id: string) => {
    setFlags(prev => prev.filter(f => f.id !== id));
    toast.success("Feature flag deleted");
  };

  // KPI Data
  const activeTenants = tenants.filter(t => t.status === "active").length;
  const totalUsers = tenants.reduce((s, t) => s + t.usersCount, 0);
  const verifiedDomains = subdomains.filter(s => s.dnsStatus === "verified").length;
  const enabledFlags = flags.filter(f => f.enabled).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Multi-Tenant SaaS Core</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage tenant isolation, subdomain routing, and feature flags</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          { label: "Active Tenants", value: activeTenants, total: tenants.length, icon: Building2, color: "text-emerald-500" },
          { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-500" },
          { label: "Verified Domains", value: verifiedDomains, total: subdomains.length, icon: Globe, color: "text-purple-500" },
          { label: "Enabled Flags", value: enabledFlags, total: flags.length, icon: ToggleLeft, color: "text-amber-500" },
        ].map(kpi => (
          <Card key={kpi.label} className="p-4 border-border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold text-card-foreground">
              {kpi.value}
              {kpi.total !== undefined && <span className="text-sm font-normal text-muted-foreground">/{kpi.total}</span>}
            </p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="tenants" className="gap-1.5"><Shield className="h-4 w-4" />Tenant Isolation</TabsTrigger>
          <TabsTrigger value="subdomains" className="gap-1.5"><Globe className="h-4 w-4" />Subdomain Routing</TabsTrigger>
          <TabsTrigger value="flags" className="gap-1.5"><ToggleLeft className="h-4 w-4" />Feature Flags</TabsTrigger>
        </TabsList>

        {/* â•â•â• TAB 1: TENANT ISOLATION â•â•â• */}
        <TabsContent value="tenants" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tenants..." className="pl-9" value={searchTenant} onChange={e => setSearchTenant(e.target.value)} />
            </div>
            <Dialog open={addTenantOpen} onOpenChange={setAddTenantOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Add Tenant</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Tenant</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Business Name</Label>
                    <Input className="mt-1.5" placeholder="e.g. Jarir Bookstore" value={newTenant.name} onChange={e => {
                      const name = e.target.value;
                      setNewTenant(p => ({ ...p, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));
                    }} />
                  </div>
                  <div>
                    <Label>Slug (subdomain)</Label>
                    <div className="flex items-center gap-0 mt-1.5">
                      <Input className="rounded-r-none font-mono" value={newTenant.slug} onChange={e => setNewTenant(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} />
                      <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 py-2 text-xs text-muted-foreground">.salla.sa</span>
                    </div>
                  </div>
                  <div>
                    <Label>Plan</Label>
                    <Select value={newTenant.plan} onValueChange={(v: Tenant["plan"]) => setNewTenant(p => ({ ...p, plan: v }))}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter â€” 5 GB</SelectItem>
                        <SelectItem value="business">Business â€” 25 GB</SelectItem>
                        <SelectItem value="pro">Pro â€” 50 GB</SelectItem>
                        <SelectItem value="enterprise">Enterprise â€” 100 GB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Custom Domain <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Input className="mt-1.5" placeholder="e.g. shop.example.com" value={newTenant.customDomain} onChange={e => setNewTenant(p => ({ ...p, customDomain: e.target.value }))} />
                  </div>
                  {newTenant.slug && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1 text-xs text-muted-foreground">
                      <p>Subdomain: <code className="text-card-foreground font-mono">{newTenant.slug}.salla.sa</code></p>
                      <p>DB Schema: <code className="text-card-foreground font-mono">tenant_{newTenant.slug}</code></p>
                      <p>Status: <span className="text-blue-500 font-medium">Trial</span></p>
                    </div>
                  )}
                  <Button className="w-full" onClick={handleAddTenant}>Create Tenant</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>DB Schema</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map(tenant => (
                    <TableRow key={tenant.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="font-medium text-card-foreground">{tenant.name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.slug}.salla.sa</p>
                        </div>
                      </TableCell>
                      <TableCell><PlanBadge plan={tenant.plan} /></TableCell>
                      <TableCell><StatusDot status={tenant.status} /></TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">{tenant.dbSchema}</code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">{tenant.usedStorage} / {tenant.storageQuota}</p>
                          <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${(parseFloat(tenant.usedStorage) / parseFloat(tenant.storageQuota)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-sm"><Users className="h-3.5 w-3.5 text-muted-foreground" />{tenant.usersCount}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Editing ${tenant.name}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleTenantStatus(tenant.id)}
                          >
                            {tenant.status === "active" ? <Lock className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Isolation Architecture Info */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Database, title: "Schema-per-Tenant", desc: "Each tenant gets a dedicated PostgreSQL schema for complete data isolation with zero cross-contamination." },
              { icon: Server, title: "Resource Quotas", desc: "Storage, API rate limits, and user seats are enforced per plan tier to ensure fair resource allocation." },
              { icon: Lock, title: "Row-Level Security", desc: "RLS policies ensure every query is automatically scoped to the authenticated tenant context." },
            ].map(item => (
              <Card key={item.title} className="p-4 border-border bg-card">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-card-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* â•â•â• TAB 2: SUBDOMAIN ROUTING â•â•â• */}
        <TabsContent value="subdomains" className="space-y-4">
          {/* Routing diagram */}
          <Card className="p-5 border-border bg-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2"><Layers className="h-4 w-4 text-primary" />Routing Architecture</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {["Incoming Request", "â†’", "DNS Resolver", "â†’", "Tenant Lookup", "â†’", "Schema Binding", "â†’", "Response"].map((step, i) =>
                step === "â†’" ? <span key={i} className="text-muted-foreground">â†’</span> : (
                  <span key={i} className="rounded-lg bg-primary/10 px-3 py-1.5 font-medium text-primary">{step}</span>
                )
              )}
            </div>
          </Card>

          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Tenant</TableHead>
                    <TableHead>Subdomain</TableHead>
                    <TableHead>Custom Domain</TableHead>
                    <TableHead>SSL</TableHead>
                    <TableHead>DNS</TableHead>
                    <TableHead>Primary</TableHead>
                    <TableHead>WWW Redirect</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subdomains.map(sd => (
                    <TableRow key={sd.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-card-foreground">{sd.tenantName}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">{sd.subdomain}</code>
                      </TableCell>
                      <TableCell>
                        {sd.customDomain ? (
                          <span className="inline-flex items-center gap-1 text-sm text-card-foreground">
                            {sd.customDomain}
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not configured</span>
                        )}
                      </TableCell>
                      <TableCell><StatusDot status={sd.sslStatus} /></TableCell>
                      <TableCell><StatusDot status={sd.dnsStatus} /></TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">{sd.primaryDomain}</code>
                      </TableCell>
                      <TableCell>
                        <Switch checked={sd.redirectWww} onCheckedChange={() => toast.info("WWW redirect toggled")} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(sd.primaryDomain); toast.success("Domain copied"); }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Refreshing DNS...")}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* DNS Info Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />DNS Records Required
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground font-mono">
                <p>A Record â†’ @ â†’ 185.158.133.1</p>
                <p>A Record â†’ www â†’ 185.158.133.1</p>
                <p>TXT Record â†’ _verify â†’ tenant_id=&lt;ID&gt;</p>
                <p>CNAME â†’ shop â†’ proxy.salla.sa</p>
              </div>
            </Card>
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />SSL Auto-Provisioning
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                SSL certificates are automatically provisioned via Let's Encrypt within 5 minutes of DNS verification. 
                Wildcard certificates cover all *.salla.sa subdomains. Custom domains require individual certificates.
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* â•â•â• TAB 3: FEATURE FLAGS â•â•â• */}
        <TabsContent value="flags" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search flags..." className="pl-9" value={searchFlag} onChange={e => setSearchFlag(e.target.value)} />
            </div>
            <Dialog open={addFlagOpen} onOpenChange={setAddFlagOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New Flag</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Feature Flag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Flag Key</Label>
                    <Input placeholder="e.g. dark_mode_v2" className="mt-1.5 font-mono" value={newFlag.key} onChange={e => setNewFlag(p => ({ ...p, key: e.target.value.replace(/\s/g, "_").toLowerCase() }))} />
                  </div>
                  <div>
                    <Label>Display Name</Label>
                    <Input placeholder="e.g. Dark Mode V2" className="mt-1.5" value={newFlag.name} onChange={e => setNewFlag(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input placeholder="Short description..." className="mt-1.5" value={newFlag.description} onChange={e => setNewFlag(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Scope</Label>
                    <Select value={newFlag.scope} onValueChange={(v: FeatureFlag["scope"]) => setNewFlag(p => ({ ...p, scope: v }))}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global (all tenants)</SelectItem>
                        <SelectItem value="plan">Plan-based</SelectItem>
                        <SelectItem value="tenant">Specific Tenants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={addFlag}>Create Flag</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Toggle</TableHead>
                    <TableHead>Flag</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Rollout</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFlags.map(flag => (
                    <TableRow key={flag.id} className="hover:bg-muted/30">
                      <TableCell>
                        <Switch checked={flag.enabled} onCheckedChange={() => toggleFlag(flag.id)} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-card-foreground">{flag.name}</p>
                          <code className="text-xs text-muted-foreground font-mono">{flag.key}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-xs">{flag.scope}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${flag.enabled ? "bg-emerald-500" : "bg-muted-foreground/30"}`} style={{ width: `${flag.rolloutPercentage}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{flag.rolloutPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {flag.scope === "global" && <span className="text-xs text-muted-foreground">All tenants</span>}
                          {flag.scope === "plan" && flag.targetPlans.map(p => <PlanBadge key={p} plan={p} />)}
                          {flag.scope === "tenant" && <span className="text-xs text-muted-foreground">{flag.targetTenants.length} tenant(s)</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{flag.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Editing flag: ${flag.key}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteFlag(flag.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Scope Explanation Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Globe, title: "Global Scope", desc: "Flag applies to all tenants across the platform. Use for platform-wide features and compliance requirements.", color: "text-emerald-500" },
              { icon: Layers, title: "Plan-based Scope", desc: "Flag is enabled only for tenants on specific plans. Perfect for gating premium features by subscription tier.", color: "text-purple-500" },
              { icon: Building2, title: "Tenant Scope", desc: "Flag targets specific tenants by ID. Ideal for beta testing, gradual rollouts, or tenant-specific customizations.", color: "text-amber-500" },
            ].map(item => (
              <Card key={item.title} className="p-4 border-border bg-card">
                <item.icon className={`h-8 w-8 ${item.color} mb-3`} />
                <h3 className="font-semibold text-card-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MultiTenantPage;

