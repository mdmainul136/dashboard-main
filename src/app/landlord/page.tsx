"use client";

/**
 * ============================================================================
 * LandlordPage â€” Dedicated Landlord Management Hub
 * ============================================================================
 *
 * Four main tabs:
 *   1. Property Portfolio â€” overview of owned properties
 *   2. Tenant Management â€” tenant list, lease status, contact info
 *   3. Lease Tracking â€” active/expired leases, renewal alerts
 *   4. Rent Collection â€” payment tracking, history, overdue reminders
 *
 * Backend endpoints (future):
 *   GET /api/properties   â€” landlord's property list
 *   GET /api/tenants      â€” tenant profiles
 *   GET /api/leases       â€” lease agreements
 * ============================================================================
 */
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Home, Users, FileSignature, Plus, MapPin, Bed, Bath,
  DollarSign, Calendar, Phone, Mail, AlertCircle, CheckCircle2,
  Clock, ArrowUpRight, CreditCard, TrendingUp, BellRing,
  Receipt, CircleDollarSign, Send,
} from "lucide-react";

/* â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const properties = [
  { id: 1, name: "Sunset Apartments â€“ Unit A", type: "Apartment", location: "Riyadh, KSA", bedrooms: 2, bathrooms: 1, rent: 3200, status: "occupied", tenant: "Ahmed Al-Farsi", occupancy: 100 },
  { id: 2, name: "Palm Residence â€“ Villa 7", type: "Villa", location: "Jeddah, KSA", bedrooms: 4, bathrooms: 3, rent: 8500, status: "occupied", tenant: "Sara Khan", occupancy: 100 },
  { id: 3, name: "Downtown Office 301", type: "Commercial", location: "Riyadh, KSA", bedrooms: 0, bathrooms: 1, rent: 5000, status: "vacant", tenant: "â€”", occupancy: 0 },
  { id: 4, name: "Garden View â€“ Flat 12B", type: "Apartment", location: "Dammam, KSA", bedrooms: 3, bathrooms: 2, rent: 4100, status: "occupied", tenant: "Omar Youssef", occupancy: 100 },
  { id: 5, name: "Hilltop Duplex", type: "Duplex", location: "Riyadh, KSA", bedrooms: 3, bathrooms: 2, rent: 6200, status: "maintenance", tenant: "Fatima Al-Rashid", occupancy: 0 },
  { id: 6, name: "Marina Tower â€“ 15F", type: "Apartment", location: "Jeddah, KSA", bedrooms: 1, bathrooms: 1, rent: 2800, status: "vacant", tenant: "â€”", occupancy: 0 },
];

const tenants = [
  { id: 1, name: "Ahmed Al-Farsi", property: "Sunset Apartments â€“ Unit A", phone: "+966 50 123 4567", email: "ahmed@email.com", leaseEnd: "2026-08-15", rentStatus: "paid", balance: 0 },
  { id: 2, name: "Sara Khan", property: "Palm Residence â€“ Villa 7", phone: "+966 55 987 6543", email: "sara.k@email.com", leaseEnd: "2026-12-01", rentStatus: "paid", balance: 0 },
  { id: 3, name: "Omar Youssef", property: "Garden View â€“ Flat 12B", phone: "+966 54 222 3344", email: "omar.y@email.com", leaseEnd: "2026-05-30", rentStatus: "overdue", balance: 4100 },
  { id: 4, name: "Fatima Al-Rashid", property: "Hilltop Duplex", phone: "+966 56 111 8899", email: "fatima.r@email.com", leaseEnd: "2026-11-20", rentStatus: "paid", balance: 0 },
];

const leases = [
  { id: 1, tenant: "Ahmed Al-Farsi", property: "Sunset Apartments â€“ Unit A", start: "2025-08-15", end: "2026-08-15", monthly: 3200, status: "active", daysLeft: 175 },
  { id: 2, tenant: "Sara Khan", property: "Palm Residence â€“ Villa 7", start: "2025-12-01", end: "2026-12-01", monthly: 8500, status: "active", daysLeft: 283 },
  { id: 3, tenant: "Omar Youssef", property: "Garden View â€“ Flat 12B", start: "2025-05-30", end: "2026-05-30", monthly: 4100, status: "expiring", daysLeft: 98 },
  { id: 4, tenant: "Fatima Al-Rashid", property: "Hilltop Duplex", start: "2025-11-20", end: "2026-11-20", monthly: 6200, status: "active", daysLeft: 272 },
  { id: 5, tenant: "Khalid Nasser", property: "Marina Tower â€“ 15F", start: "2024-06-01", end: "2025-06-01", monthly: 2800, status: "expired", daysLeft: 0 },
];

/* â”€â”€ Status helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const propertyStatusBadge = (s: string) => {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    occupied: { label: "Occupied", variant: "default" },
    vacant: { label: "Vacant", variant: "outline" },
    maintenance: { label: "Maintenance", variant: "destructive" },
  };
  const cfg = map[s] ?? map.vacant;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

const rentStatusBadge = (s: string) => {
  if (s === "paid") return <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">Paid</Badge>;
  return <Badge variant="destructive">Overdue</Badge>;
};

const leaseStatusBadge = (s: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: "Active", cls: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" },
    expiring: { label: "Expiring Soon", cls: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]" },
    expired: { label: "Expired", cls: "bg-destructive text-destructive-foreground" },
  };
  const cfg = map[s] ?? map.active;
  return <Badge className={cfg.cls}>{cfg.label}</Badge>;
};

/* â”€â”€ Summary cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const SummaryCards = () => {
  const totalRent = properties.reduce((a, p) => a + (p.status === "occupied" ? p.rent : 0), 0);
  const occupiedCount = properties.filter((p) => p.status === "occupied").length;
  const vacantCount = properties.filter((p) => p.status === "vacant").length;
  const overdueCount = tenants.filter((t) => t.rentStatus === "overdue").length;

  const cards = [
    { title: "Total Properties", value: properties.length, icon: Home, change: "+2 this quarter" },
    { title: "Occupied", value: occupiedCount, icon: CheckCircle2, change: `${Math.round((occupiedCount / properties.length) * 100)}% occupancy` },
    { title: "Vacant", value: vacantCount, icon: AlertCircle, change: "Ready to list" },
    { title: "Monthly Revenue", value: `$${totalRent.toLocaleString()}`, icon: DollarSign, change: overdueCount ? `${overdueCount} overdue` : "All collected" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{c.title}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.change}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <c.icon className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/* â”€â”€ Tab: Property Portfolio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const PropertyPortfolioTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">All Properties</h2>
      <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Property</Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {properties.map((p) => (
        <Card key={p.id} className="group hover:border-primary/40 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> {p.location}
                </CardDescription>
              </div>
              {propertyStatusBadge(p.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{p.type}</Badge>
              {p.bedrooms > 0 && (
                <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {p.bedrooms}</span>
              )}
              <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {p.bathrooms}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tenant</span>
              <span className="font-medium">{p.tenant}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly Rent</span>
              <span className="font-semibold text-primary">${p.rent.toLocaleString()}</span>
            </div>
            <Progress value={p.occupancy} className="h-1.5" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

/* â”€â”€ Tab: Tenant Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const TenantManagementTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Tenants ({tenants.length})</h2>
      <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Tenant</Button>
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Lease Ends</TableHead>
            <TableHead>Rent Status</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">{t.property}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {t.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {t.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {t.leaseEnd}
                </span>
              </TableCell>
              <TableCell>{rentStatusBadge(t.rentStatus)}</TableCell>
              <TableCell className="text-right font-medium">
                {t.balance > 0 ? <span className="text-destructive">${t.balance.toLocaleString()}</span> : <span className="text-muted-foreground">â€”</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

/* â”€â”€ Tab: Lease Tracking â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const LeaseTrackingTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Lease Agreements</h2>
      <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Lease</Button>
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Monthly</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leases.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium">{l.tenant}</TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">{l.property}</TableCell>
              <TableCell className="text-sm">
                <span className="text-muted-foreground">{l.start}</span>
                <span className="mx-1">â†’</span>
                <span>{l.end}</span>
              </TableCell>
              <TableCell className="font-semibold">${l.monthly.toLocaleString()}</TableCell>
              <TableCell>{leaseStatusBadge(l.status)}</TableCell>
              <TableCell>
                {l.daysLeft > 0 ? (
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {l.daysLeft} days
                  </span>
                ) : (
                  <span className="text-xs text-destructive">Expired</span>
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>

    {/* Renewal alerts */}
    <Card className="border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5">
      <CardContent className="p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))] mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-sm">Lease Renewal Alert</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Omar Youssef's lease at Garden View â€“ Flat 12B expires in 98 days. Consider sending a renewal notice.
          </p>
          <Button variant="outline" size="sm" className="mt-2">Send Renewal Notice</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* â”€â”€ Mock Data: Rent Collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const rentPayments = [
  { id: 1, tenant: "Ahmed Al-Farsi", property: "Sunset Apartments â€“ Unit A", amount: 3200, dueDate: "2026-02-01", paidDate: "2026-01-30", method: "Bank Transfer", status: "paid", reference: "RNT-2026-0201" },
  { id: 2, tenant: "Sara Khan", property: "Palm Residence â€“ Villa 7", amount: 8500, dueDate: "2026-02-01", paidDate: "2026-02-01", method: "Online Payment", status: "paid", reference: "RNT-2026-0202" },
  { id: 3, tenant: "Omar Youssef", property: "Garden View â€“ Flat 12B", amount: 4100, dueDate: "2026-02-01", paidDate: null, method: "â€”", status: "overdue", reference: "RNT-2026-0203" },
  { id: 4, tenant: "Fatima Al-Rashid", property: "Hilltop Duplex", amount: 6200, dueDate: "2026-02-01", paidDate: "2026-02-02", method: "Check", status: "paid", reference: "RNT-2026-0204" },
  { id: 5, tenant: "Ahmed Al-Farsi", property: "Sunset Apartments â€“ Unit A", amount: 3200, dueDate: "2026-01-01", paidDate: "2025-12-29", method: "Bank Transfer", status: "paid", reference: "RNT-2026-0101" },
  { id: 6, tenant: "Sara Khan", property: "Palm Residence â€“ Villa 7", amount: 8500, dueDate: "2026-01-01", paidDate: "2026-01-01", method: "Online Payment", status: "paid", reference: "RNT-2026-0102" },
  { id: 7, tenant: "Omar Youssef", property: "Garden View â€“ Flat 12B", amount: 4100, dueDate: "2026-01-01", paidDate: "2026-01-05", method: "Cash", status: "late", reference: "RNT-2026-0103" },
  { id: 8, tenant: "Fatima Al-Rashid", property: "Hilltop Duplex", amount: 6200, dueDate: "2026-01-01", paidDate: "2026-01-01", method: "Check", status: "paid", reference: "RNT-2026-0104" },
];

const paymentStatusBadge = (s: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Paid", cls: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" },
    late: { label: "Late", cls: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]" },
    overdue: { label: "Overdue", cls: "bg-destructive text-destructive-foreground" },
    pending: { label: "Pending", cls: "bg-muted text-muted-foreground" },
  };
  const cfg = map[s] ?? map.pending;
  return <Badge className={cfg.cls}>{cfg.label}</Badge>;
};

/* â”€â”€ Tab: Rent Collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const RentCollectionTab = () => {
  const febPayments = rentPayments.filter((p) => p.dueDate.startsWith("2026-02"));
  const totalExpected = febPayments.reduce((a, p) => a + p.amount, 0);
  const totalCollected = febPayments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  const totalOverdue = febPayments.filter((p) => p.status === "overdue").reduce((a, p) => a + p.amount, 0);
  const collectionRate = Math.round((totalCollected / totalExpected) * 100);

  return (
    <div className="space-y-5">
      {/* Month summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Expected (Feb)</p>
              <p className="text-xl font-bold mt-1">${totalExpected.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CircleDollarSign className="h-4.5 w-4.5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-xl font-bold mt-1 text-[hsl(var(--success))]">${totalCollected.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <CheckCircle2 className="h-4.5 w-4.5 text-[hsl(var(--success))]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-xl font-bold mt-1 text-destructive">${totalOverdue.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-4.5 w-4.5 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Collection Rate</p>
              <p className="text-xl font-bold mt-1">{collectionRate}%</p>
              <Progress value={collectionRate} className="h-1.5 mt-2 w-24" />
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue reminder */}
      {totalOverdue > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <BellRing className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Overdue Rent Alert</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {febPayments.filter((p) => p.status === "overdue").map((p) => p.tenant).join(", ")} has outstanding rent of ${totalOverdue.toLocaleString()} for February 2026.
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="destructive" className="gap-1">
                  <Send className="h-3.5 w-3.5" /> Send Reminder
                </Button>
                <Button size="sm" variant="outline">Record Payment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment history table */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Payment History</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Record Payment</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentPayments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.reference}</TableCell>
                <TableCell className="font-medium">{p.tenant}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[160px] truncate">{p.property}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {p.dueDate}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{p.paidDate ?? <span className="text-destructive">Unpaid</span>}</TableCell>
                <TableCell>
                  {p.method !== "â€”" ? (
                    <span className="flex items-center gap-1 text-sm">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground" /> {p.method}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">â€”</span>
                  )}
                </TableCell>
                <TableCell>{paymentStatusBadge(p.status)}</TableCell>
                <TableCell className="text-right font-semibold">${p.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Monthly collection summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4.5 w-4.5 text-primary" /> Monthly Collection Summary
          </CardTitle>
          <CardDescription>Overview of rent collection by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { month: "February 2026", expected: 22000, collected: 17900, rate: 81 },
              { month: "January 2026", expected: 22000, collected: 22000, rate: 100 },
            ].map((m) => (
              <div key={m.month} className="p-3 rounded-xl border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.month}</span>
                  <Badge variant={m.rate === 100 ? "default" : "secondary"}>{m.rate}%</Badge>
                </div>
                <Progress value={m.rate} className="h-1.5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Collected: ${m.collected.toLocaleString()}</span>
                  <span>Expected: ${m.expected.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const LandlordPage = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Landlord Management</h1>
          <p className="text-muted-foreground mt-1">Manage your properties, tenants, and lease agreements in one place.</p>
        </div>

        <SummaryCards />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="portfolio" className="gap-1.5">
              <Home className="h-4 w-4" /> Property Portfolio
            </TabsTrigger>
            <TabsTrigger value="tenants" className="gap-1.5">
              <Users className="h-4 w-4" /> Tenant Management
            </TabsTrigger>
            <TabsTrigger value="leases" className="gap-1.5">
              <FileSignature className="h-4 w-4" /> Lease Tracking
            </TabsTrigger>
            <TabsTrigger value="rent" className="gap-1.5">
              <DollarSign className="h-4 w-4" /> Rent Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio"><PropertyPortfolioTab /></TabsContent>
          <TabsContent value="tenants"><TenantManagementTab /></TabsContent>
          <TabsContent value="leases"><LeaseTrackingTab /></TabsContent>
          <TabsContent value="rent"><RentCollectionTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LandlordPage;

