"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ChevronLeft, ChevronRight, Mail, Phone, Users, DollarSign, TrendingUp, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  dealValue: number;
  stage: "Lead" | "Prospect" | "Negotiation" | "Closed Won" | "Closed Lost";
  lastContact: string;
  avatar: string;
}

const contacts: Contact[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@techcorp.com", phone: "+1 555-0101", company: "TechCorp", dealValue: 25000, stage: "Negotiation", lastContact: "Feb 18, 2026", avatar: "SJ" },
  { id: "2", name: "Michael Chen", email: "mchen@innovate.io", phone: "+1 555-0102", company: "Innovate.io", dealValue: 45000, stage: "Prospect", lastContact: "Feb 17, 2026", avatar: "MC" },
  { id: "3", name: "Emily Davis", email: "emily@greenleaf.com", phone: "+1 555-0103", company: "GreenLeaf Inc", dealValue: 18000, stage: "Lead", lastContact: "Feb 16, 2026", avatar: "ED" },
  { id: "4", name: "James Wilson", email: "jwilson@apex.co", phone: "+1 555-0104", company: "Apex Solutions", dealValue: 67000, stage: "Closed Won", lastContact: "Feb 15, 2026", avatar: "JW" },
  { id: "5", name: "Lisa Wang", email: "lisa@dataflow.com", phone: "+1 555-0105", company: "DataFlow", dealValue: 32000, stage: "Negotiation", lastContact: "Feb 14, 2026", avatar: "LW" },
  { id: "6", name: "Robert Brown", email: "rbrown@stellar.com", phone: "+1 555-0106", company: "Stellar Systems", dealValue: 12000, stage: "Closed Lost", lastContact: "Feb 13, 2026", avatar: "RB" },
  { id: "7", name: "Anna Martinez", email: "anna@cloudpeak.io", phone: "+1 555-0107", company: "CloudPeak", dealValue: 55000, stage: "Prospect", lastContact: "Feb 12, 2026", avatar: "AM" },
  { id: "8", name: "David Lee", email: "dlee@nexgen.com", phone: "+1 555-0108", company: "NexGen Tech", dealValue: 28000, stage: "Lead", lastContact: "Feb 11, 2026", avatar: "DL" },
  { id: "9", name: "Karen White", email: "kwhite@bluewave.co", phone: "+1 555-0109", company: "BlueWave", dealValue: 41000, stage: "Closed Won", lastContact: "Feb 10, 2026", avatar: "KW" },
  { id: "10", name: "Tom Harris", email: "tharris@zenith.com", phone: "+1 555-0110", company: "Zenith Corp", dealValue: 9000, stage: "Lead", lastContact: "Feb 09, 2026", avatar: "TH" },
];

const stageStyles: Record<string, string> = {
  Lead: "bg-muted text-muted-foreground border-transparent",
  Prospect: "bg-primary/10 text-primary border-transparent",
  Negotiation: "bg-warning/10 text-warning border-transparent",
  "Closed Won": "bg-success/10 text-success border-transparent",
  "Closed Lost": "bg-destructive/10 text-destructive border-transparent",
};

const stages = ["All", "Lead", "Prospect", "Negotiation", "Closed Won", "Closed Lost"];
const PER_PAGE = 6;

const CRMPage = () => {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === "All" || c.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [search, stageFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = {
    totalContacts: contacts.length,
    totalDealValue: contacts.filter((c) => c.stage !== "Closed Lost").reduce((s, c) => s + c.dealValue, 0),
    wonDeals: contacts.filter((c) => c.stage === "Closed Won").length,
    conversionRate: Math.round((contacts.filter((c) => c.stage === "Closed Won").length / contacts.length) * 100),
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">eCommerce CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer relationships</p>
        </div>
        <Button className="gap-1.5 rounded-xl shadow-sm"><UserPlus className="h-4 w-4" /> Add Contact</Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Contacts", value: stats.totalContacts, icon: <Users className="h-5 w-5" />, gradient: "from-primary/15 to-primary/5", color: "text-primary" },
          { label: "Pipeline Value", value: `$${(stats.totalDealValue / 1000).toFixed(0)}K`, icon: <DollarSign className="h-5 w-5" />, gradient: "from-[hsl(160,84%,39%)]/15 to-[hsl(160,84%,39%)]/5", color: "text-success" },
          { label: "Won Deals", value: stats.wonDeals, icon: <TrendingUp className="h-5 w-5" />, gradient: "from-[hsl(38,92%,50%)]/15 to-[hsl(38,92%,50%)]/5", color: "text-warning" },
          { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: <TrendingUp className="h-5 w-5" />, gradient: "from-[hsl(280,68%,60%)]/15 to-[hsl(280,68%,60%)]/5", color: "text-[hsl(280,68%,60%)]" },
        ].map((stat, i) => (
          <div key={stat.label} className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>{stat.icon}</div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-card-foreground tabular-nums">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deal Pipeline Visual */}
      <div className="mb-6 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Deal Pipeline</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {stages.filter((s) => s !== "All").map((stage) => {
            const count = contacts.filter((c) => c.stage === stage).length;
            const value = contacts.filter((c) => c.stage === stage).reduce((s, c) => s + c.dealValue, 0);
            return (
              <div key={stage} className={cn("rounded-lg p-3 text-center", stageStyles[stage])}>
                <p className="text-xs font-medium">{stage}</p>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs opacity-75">${(value / 1000).toFixed(0)}K</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contacts..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        {stages.map((s) => (
          <button
            key={s}
            onClick={() => { setStageFilter(s); setPage(1); }}
            className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", stageFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent")}
          >{s}</button>
        ))}
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginated.map((contact) => (
          <div key={contact.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
              </div>
              <Badge className={cn("text-xs shrink-0", stageStyles[contact.stage])}>{contact.stage}</Badge>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> <span className="truncate">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" /> {contact.phone}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-xs text-muted-foreground">Deal Value</p>
                <p className="text-sm font-bold text-card-foreground">${contact.dealValue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Contact</p>
                <p className="text-xs text-card-foreground">{contact.lastContact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CRMPage;

