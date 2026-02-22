"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Users, DollarSign, FolderOpen, FileText, Clock, TrendingUp, Plus, Star,
  CheckCircle2, AlertCircle, Receipt, Timer, UserCircle, Send, Eye, Play,
  Search, Phone, Mail, ChevronRight, Target, MapPin, MessageSquare, Award, Calendar,
} from "lucide-react";
import { toast } from "sonner";
import InvoiceDialog, { type InvoiceData } from "@/components/InvoiceDialog";

// â”€â”€â”€ Types â”€â”€â”€
interface ProjectTask { name: string; status: "done" | "in-progress" | "todo"; }
interface ProjectDetail {
  id: string; name: string; client: string; budget: number; spent: number; progress: number;
  status: "active" | "completed" | "proposal" | "on-hold"; deadline: string; startDate: string;
  description: string; tasks: ProjectTask[]; milestones: { name: string; date: string; done: boolean }[];
  tags: string[]; hourlyRate: number; hoursLogged: number;
}
interface ClientDetail {
  name: string; projects: number; totalRevenue: number; rating: number; since: string;
  email: string; phone: string; company: string; location: string; notes: string;
  activeProjects: string[]; paymentTerms: string; avgResponseTime: string;
  invoicesPaid: number; invoicesPending: number; totalOutstanding: number;
}
interface InvoiceDetail {
  id: string; client: string; project: string; items: string; amount: number;
  tax: number; total: number; issueDate: string; dueDate: string;
  status: "paid" | "pending" | "overdue" | "draft" | "sent";
}
interface TimeEntry {
  id: string; project: string; task: string; date: string; hours: number; rate: number; amount: number;
  status: "logged" | "billed" | "unbilled";
}
interface ClientPortalItem {
  id: string; client: string; activeProjects: number; totalInvoiced: number; outstanding: number;
  lastActivity: string; sharedFiles: number; messages: number; portalStatus: "active" | "invited" | "inactive";
}

// â”€â”€â”€ Data â”€â”€â”€
const projects: ProjectDetail[] = [
  { id: "P-01", name: "E-commerce Redesign", client: "TechCorp", budget: 12000, spent: 8400, progress: 70, status: "active", deadline: "2026-03-15", startDate: "2026-01-10", description: "Complete redesign of the e-commerce platform including new checkout flow, product pages, and admin dashboard.", tasks: [
    { name: "Homepage wireframe", status: "done" }, { name: "Product page design", status: "done" },
    { name: "Checkout flow", status: "in-progress" }, { name: "Backend integration", status: "in-progress" },
    { name: "QA & Testing", status: "todo" }, { name: "Deployment", status: "todo" },
  ], milestones: [
    { name: "Design Approval", date: "2026-01-25", done: true }, { name: "Frontend Complete", date: "2026-02-20", done: true },
    { name: "Backend Integration", date: "2026-03-01", done: false }, { name: "Launch", date: "2026-03-15", done: false },
  ], tags: ["React", "Node.js", "Figma"], hourlyRate: 75, hoursLogged: 112 },
  { id: "P-02", name: "Mobile App Development", client: "HealthPlus", budget: 25000, spent: 18750, progress: 75, status: "active", deadline: "2026-04-01", startDate: "2025-12-01", description: "Cross-platform mobile app for patient health tracking with appointment booking and telemedicine.", tasks: [
    { name: "UI/UX Design", status: "done" }, { name: "Patient dashboard", status: "done" },
    { name: "API integration", status: "in-progress" }, { name: "Push notifications", status: "in-progress" },
    { name: "App store submission", status: "todo" },
  ], milestones: [
    { name: "Design Sign-off", date: "2025-12-20", done: true }, { name: "Alpha Release", date: "2026-02-01", done: true },
    { name: "Beta Testing", date: "2026-03-01", done: false }, { name: "Launch", date: "2026-04-01", done: false },
  ], tags: ["React Native", "Firebase", "TypeScript"], hourlyRate: 85, hoursLogged: 220 },
  { id: "P-03", name: "Brand Identity Package", client: "FreshStart", budget: 5000, spent: 5000, progress: 100, status: "completed", deadline: "2026-02-10", startDate: "2026-01-15", description: "Complete brand identity including logo, color palette, typography, guidelines, and stationery.", tasks: [
    { name: "Logo concepts", status: "done" }, { name: "Color & typography", status: "done" },
    { name: "Brand guidelines", status: "done" }, { name: "Stationery design", status: "done" },
  ], milestones: [
    { name: "Concept Approval", date: "2026-01-22", done: true }, { name: "Final Delivery", date: "2026-02-10", done: true },
  ], tags: ["Illustrator", "Branding"], hourlyRate: 70, hoursLogged: 72 },
  { id: "P-04", name: "Social Media Campaign", client: "GreenLeaf", budget: 3500, spent: 1200, progress: 35, status: "active", deadline: "2026-03-01", startDate: "2026-02-01", description: "3-month social media strategy and content creation for Instagram, TikTok, and LinkedIn.", tasks: [
    { name: "Strategy document", status: "done" }, { name: "Content calendar", status: "in-progress" },
    { name: "Instagram assets", status: "in-progress" }, { name: "TikTok scripts", status: "todo" },
    { name: "LinkedIn posts", status: "todo" }, { name: "Analytics report", status: "todo" },
  ], milestones: [
    { name: "Strategy Approved", date: "2026-02-08", done: true }, { name: "Content Launch", date: "2026-02-20", done: false },
  ], tags: ["Social Media", "Canva"], hourlyRate: 60, hoursLogged: 20 },
  { id: "P-05", name: "Website Optimization", client: "SpeedNet", budget: 8000, spent: 0, progress: 0, status: "proposal", deadline: "2026-03-20", startDate: "â€”", description: "Performance audit, SEO optimization, and Core Web Vitals improvements.", tasks: [
    { name: "Performance audit", status: "todo" }, { name: "SEO analysis", status: "todo" },
    { name: "Image optimization", status: "todo" }, { name: "Code splitting", status: "todo" },
  ], milestones: [
    { name: "Audit Complete", date: "2026-03-01", done: false }, { name: "Implementation", date: "2026-03-15", done: false },
  ], tags: ["Performance", "SEO"], hourlyRate: 80, hoursLogged: 0 },
  { id: "P-06", name: "CRM Dashboard", client: "TechCorp", budget: 15000, spent: 4500, progress: 30, status: "active", deadline: "2026-05-01", startDate: "2026-02-10", description: "Custom CRM dashboard with sales pipeline, customer analytics, and automated reporting.", tasks: [
    { name: "Requirements", status: "done" }, { name: "Wireframes", status: "done" },
    { name: "Pipeline viz", status: "in-progress" }, { name: "Reporting", status: "todo" },
    { name: "Data integration", status: "todo" },
  ], milestones: [
    { name: "Wireframe Approval", date: "2026-02-20", done: true }, { name: "MVP", date: "2026-03-20", done: false },
  ], tags: ["React", "D3.js", "PostgreSQL"], hourlyRate: 85, hoursLogged: 53 },
];

const clientDetails: ClientDetail[] = [
  { name: "TechCorp", projects: 3, totalRevenue: 45000, rating: 5, since: "2024-06", email: "contact@techcorp.io", phone: "+1 (555) 100-2000", company: "TechCorp Inc.", location: "San Francisco, CA", notes: "Enterprise client. Prefers weekly standups. Decision maker: James Chen (CTO).", activeProjects: ["E-commerce Redesign", "CRM Dashboard"], paymentTerms: "Net 15", avgResponseTime: "2 hours", invoicesPaid: 8, invoicesPending: 2, totalOutstanding: 7400 },
  { name: "HealthPlus", projects: 2, totalRevenue: 38000, rating: 5, since: "2025-01", email: "projects@healthplus.med", phone: "+1 (555) 200-3000", company: "HealthPlus Medical", location: "Boston, MA", notes: "Healthcare startup. HIPAA compliance required. PM: Dr. Aisha Patel.", activeProjects: ["Mobile App Development"], paymentTerms: "Net 30", avgResponseTime: "4 hours", invoicesPaid: 5, invoicesPending: 0, totalOutstanding: 0 },
  { name: "FreshStart", projects: 1, totalRevenue: 5000, rating: 4, since: "2025-11", email: "hello@freshstart.co", phone: "+1 (555) 300-4000", company: "FreshStart Co.", location: "Austin, TX", notes: "Small startup. Budget-conscious. Happy with brand work. May return for website.", activeProjects: [], paymentTerms: "50% upfront", avgResponseTime: "1 day", invoicesPaid: 1, invoicesPending: 0, totalOutstanding: 0 },
  { name: "GreenLeaf", projects: 1, totalRevenue: 3500, rating: 5, since: "2026-01", email: "marketing@greenleaf.eco", phone: "+1 (555) 400-5000", company: "GreenLeaf Organics", location: "Portland, OR", notes: "Eco brand. Very collaborative. Interested in long-term content partnership.", activeProjects: ["Social Media Campaign"], paymentTerms: "Monthly", avgResponseTime: "6 hours", invoicesPaid: 0, invoicesPending: 1, totalOutstanding: 1200 },
  { name: "SpeedNet", projects: 0, totalRevenue: 0, rating: 0, since: "2026-02", email: "dev@speednet.io", phone: "+1 (555) 500-6000", company: "SpeedNet Solutions", location: "Seattle, WA", notes: "New lead. Proposal sent for website optimization. Decision expected by Feb 25.", activeProjects: [], paymentTerms: "TBD", avgResponseTime: "â€”", invoicesPaid: 0, invoicesPending: 0, totalOutstanding: 0 },
];

const invoiceDetails: InvoiceDetail[] = [
  { id: "INV-001", client: "TechCorp", project: "E-commerce Redesign", items: "UI Design (40hrs) + Frontend Dev (20hrs)", amount: 3600, tax: 400, total: 4000, issueDate: "2026-02-01", dueDate: "2026-02-15", status: "paid" },
  { id: "INV-002", client: "HealthPlus", project: "Mobile App Development", items: "Sprint 3 deliverables + API integration", amount: 5682, tax: 568, total: 6250, issueDate: "2026-02-10", dueDate: "2026-02-24", status: "paid" },
  { id: "INV-003", client: "TechCorp", project: "E-commerce Redesign", items: "Backend integration (30hrs) + Testing", amount: 4000, tax: 400, total: 4400, issueDate: "2026-02-15", dueDate: "2026-03-01", status: "sent" },
  { id: "INV-004", client: "GreenLeaf", project: "Social Media Campaign", items: "Content creation (15hrs) + Strategy", amount: 1090, tax: 110, total: 1200, issueDate: "2026-02-18", dueDate: "2026-03-04", status: "pending" },
  { id: "INV-005", client: "FreshStart", project: "Brand Identity Package", items: "Logo + Brand guide + Stationery", amount: 4545, tax: 455, total: 5000, issueDate: "2026-02-10", dueDate: "2026-02-24", status: "paid" },
  { id: "INV-006", client: "SpeedNet", project: "Website Optimization", items: "Performance audit + SEO report", amount: 1800, tax: 200, total: 2000, issueDate: "2026-02-20", dueDate: "2026-03-06", status: "draft" },
  { id: "INV-007", client: "TechCorp", project: "E-commerce Redesign", items: "Milestone 1 payment (overdue)", amount: 2700, tax: 300, total: 3000, issueDate: "2026-01-15", dueDate: "2026-01-30", status: "overdue" },
];

const timeEntries: TimeEntry[] = [
  { id: "TE-01", project: "E-commerce Redesign", task: "Homepage wireframe", date: "2026-02-20", hours: 4.5, rate: 75, amount: 337.5, status: "logged" },
  { id: "TE-02", project: "Mobile App Development", task: "API integration", date: "2026-02-20", hours: 6, rate: 85, amount: 510, status: "logged" },
  { id: "TE-03", project: "Social Media Campaign", task: "Content calendar", date: "2026-02-19", hours: 3, rate: 60, amount: 180, status: "unbilled" },
  { id: "TE-04", project: "E-commerce Redesign", task: "Product page design", date: "2026-02-19", hours: 5, rate: 75, amount: 375, status: "billed" },
  { id: "TE-05", project: "Mobile App Development", task: "UI testing", date: "2026-02-18", hours: 3.5, rate: 85, amount: 297.5, status: "billed" },
  { id: "TE-06", project: "E-commerce Redesign", task: "Checkout flow", date: "2026-02-18", hours: 7, rate: 75, amount: 525, status: "logged" },
  { id: "TE-07", project: "Social Media Campaign", task: "Instagram assets", date: "2026-02-17", hours: 4, rate: 60, amount: 240, status: "unbilled" },
  { id: "TE-08", project: "Mobile App Development", task: "Push notifications", date: "2026-02-17", hours: 5.5, rate: 85, amount: 467.5, status: "logged" },
];

const clientPortalData: ClientPortalItem[] = [
  { id: "CP-01", client: "TechCorp", activeProjects: 1, totalInvoiced: 11400, outstanding: 4400, lastActivity: "2026-02-20", sharedFiles: 24, messages: 48, portalStatus: "active" },
  { id: "CP-02", client: "HealthPlus", activeProjects: 1, totalInvoiced: 6250, outstanding: 0, lastActivity: "2026-02-19", sharedFiles: 18, messages: 32, portalStatus: "active" },
  { id: "CP-03", client: "FreshStart", activeProjects: 0, totalInvoiced: 5000, outstanding: 0, lastActivity: "2026-02-10", sharedFiles: 12, messages: 15, portalStatus: "active" },
  { id: "CP-04", client: "GreenLeaf", activeProjects: 1, totalInvoiced: 1200, outstanding: 1200, lastActivity: "2026-02-18", sharedFiles: 6, messages: 10, portalStatus: "active" },
  { id: "CP-05", client: "SpeedNet", activeProjects: 0, totalInvoiced: 0, outstanding: 0, lastActivity: "â€”", sharedFiles: 0, messages: 2, portalStatus: "invited" },
];

const statusColors: Record<string, string> = {
  active: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  proposal: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "on-hold": "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
  paid: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  overdue: "bg-destructive/15 text-destructive border-destructive/30",
  draft: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
  sent: "bg-blue-500/15 text-blue-500 border-blue-500/30",
};
const timeStatusColors: Record<string, string> = {
  logged: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  billed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  unbilled: "bg-amber-500/15 text-amber-500 border-amber-500/30",
};
const portalStatusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  invited: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  inactive: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};

const FreelancerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["projects", "clients", "invoices", "invoicing", "timetracking", "portal"] as const;
  type TabVal = typeof validTabs[number];
  const tabFromUrl = searchParams.get("tab") as TabVal | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "projects";
  const handleTabChange = (value: string) => {
    if (value === "projects") { searchParams.delete("tab"); } else { searchParams.set("tab", value); }
    setSearchParams(searchParams, { replace: true });
  };

  // Project Hub
  const [projSearch, setProjSearch] = useState("");
  const [projStatus, setProjStatus] = useState("all");
  const [projClient, setProjClient] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  const filteredProjects = useMemo(() => projects.filter(p => {
    const s = !projSearch || p.name.toLowerCase().includes(projSearch.toLowerCase()) || p.client.toLowerCase().includes(projSearch.toLowerCase());
    const st = projStatus === "all" || p.status === projStatus;
    const cl = projClient === "all" || p.client === projClient;
    return s && st && cl;
  }), [projSearch, projStatus, projClient]);

  // Client Management
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);

  const filteredClients = useMemo(() => clientDetails.filter(c =>
    !clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.company.toLowerCase().includes(clientSearch.toLowerCase())
  ), [clientSearch]);

  // Invoice Tracking
  const [invSearch, setInvSearch] = useState("");
  const [invStatus, setInvStatus] = useState("all");
  const [invoicePreview, setInvoicePreview] = useState<InvoiceData | null>(null);

  const filteredInvoiceDetails = useMemo(() => invoiceDetails.filter(inv => {
    const s = !invSearch || inv.id.toLowerCase().includes(invSearch.toLowerCase()) || inv.client.toLowerCase().includes(invSearch.toLowerCase()) || inv.project.toLowerCase().includes(invSearch.toLowerCase());
    const st = invStatus === "all" || inv.status === invStatus;
    return s && st;
  }), [invSearch, invStatus]);

  const uniqueClients = [...new Set(projects.map(p => p.client))];
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalHours = projects.reduce((s, p) => s + p.hoursLogged, 0);
  const paidTotal = invoiceDetails.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const pendingTotal = invoiceDetails.filter(i => ["pending", "sent"].includes(i.status)).reduce((s, i) => s + i.total, 0);

  const buildInvoicePreview = (inv: InvoiceDetail): InvoiceData => ({
    id: inv.id, date: inv.issueDate, type: "Sales Invoice",
    from: { name: "Freelancer Studio", address: "123 Creative Ave, San Francisco, CA", email: "hello@freelancer.studio", phone: "+1 (555) 000-1234" },
    to: { name: inv.client, address: clientDetails.find(c => c.name === inv.client)?.location || "", email: clientDetails.find(c => c.name === inv.client)?.email || "" },
    items: inv.items.split(" + ").map((item, i) => ({ name: item.trim(), quantity: 1, unitPrice: i === 0 ? inv.amount : 0 })),
    subtotal: inv.amount, tax: inv.tax, total: inv.total,
    paymentMethod: inv.status === "paid" ? "Bank Transfer" : undefined,
    notes: `Project: ${inv.project} | Due: ${inv.dueDate}`,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage projects, clients, and invoices</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><FolderOpen className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === "active").length}</p><p className="text-xs text-muted-foreground">Active Projects</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">${(paidTotal / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Revenue (Paid)</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">${(pendingTotal / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Pending</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Users className="h-5 w-5 text-violet-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{clientDetails.length}</p><p className="text-xs text-muted-foreground">Total Clients</p></div>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="projects" className="gap-1.5"><FolderOpen className="h-4 w-4" /> Projects</TabsTrigger>
            <TabsTrigger value="clients" className="gap-1.5"><Users className="h-4 w-4" /> Clients</TabsTrigger>
            <TabsTrigger value="invoices" className="gap-1.5"><FileText className="h-4 w-4" /> Invoices</TabsTrigger>
            <TabsTrigger value="invoicing" className="gap-1.5"><Receipt className="h-4 w-4" /> Invoicing</TabsTrigger>
            <TabsTrigger value="timetracking" className="gap-1.5"><Timer className="h-4 w-4" /> Time Tracking</TabsTrigger>
            <TabsTrigger value="portal" className="gap-1.5"><UserCircle className="h-4 w-4" /> Client Portal</TabsTrigger>
          </TabsList>

          {/* â•â•â• Project Hub â•â•â• */}
          <TabsContent value="projects">
            <div className="space-y-4">
              <Card><CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search project or client..." value={projSearch} onChange={e => setProjSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={projStatus} onValueChange={setProjStatus}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={projClient} onValueChange={setProjClient}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Client" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {uniqueClients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("New project form coming soon!")}><Plus className="h-4 w-4" /> New Project</Button>
                </div>
              </CardContent></Card>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Matching</p><p className="text-2xl font-bold text-foreground">{filteredProjects.length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Budget</p><p className="text-2xl font-bold text-primary">${(totalBudget / 1000).toFixed(0)}K</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Hours Logged</p><p className="text-2xl font-bold text-foreground">{totalHours}h</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg Progress</p><p className="text-2xl font-bold text-emerald-500">{Math.round(filteredProjects.reduce((s, p) => s + p.progress, 0) / (filteredProjects.length || 1))}%</p></CardContent></Card>
              </div>

              {filteredProjects.map(p => (
                <Card key={p.id} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setSelectedProject(p)}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{p.name}</h3>
                          {p.tags.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.client} â€¢ {p.startDate} â†’ {p.deadline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{p.progress}%</span></div>
                      <Progress value={p.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex gap-4">
                        <span>Budget: <strong className="text-foreground">${p.budget.toLocaleString()}</strong></span>
                        <span>Spent: <strong className={p.spent > p.budget * 0.9 ? "text-destructive" : "text-foreground"}>${p.spent.toLocaleString()}</strong></span>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.hoursLogged}h</span>
                        <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {p.tasks.filter(t => t.status === "done").length}/{p.tasks.length}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {p.tasks.map((t, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${t.status === "done" ? "bg-emerald-500" : t.status === "in-progress" ? "bg-primary" : "bg-muted"}`} title={`${t.name} (${t.status})`} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredProjects.length === 0 && <Card><CardContent className="p-8 text-center text-muted-foreground">No projects match your filters</CardContent></Card>}
            </div>
          </TabsContent>

          {/* â•â•â• Client Management â•â•â• */}
          <TabsContent value="clients">
            <div className="space-y-4">
              <Card><CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search client or company..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Add client form coming soon!")}><Plus className="h-4 w-4" /> Add Client</Button>
                </div>
              </CardContent></Card>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredClients.length}</p><p className="text-xs text-muted-foreground">Clients</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(filteredClients.reduce((s, c) => s + c.totalRevenue, 0) / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertCircle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(filteredClients.reduce((s, c) => s + c.totalOutstanding, 0) / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Outstanding</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Star className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{(filteredClients.filter(c => c.rating > 0).reduce((s, c) => s + c.rating, 0) / (filteredClients.filter(c => c.rating > 0).length || 1)).toFixed(1)}</p><p className="text-xs text-muted-foreground">Avg Rating</p></div>
                </CardContent></Card>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {filteredClients.map(c => (
                  <Card key={c.name} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setSelectedClient(c)}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">{c.name.charAt(0)}</div>
                          <div>
                            <h3 className="font-semibold text-foreground">{c.name}</h3>
                            <p className="text-xs text-muted-foreground">{c.company}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {c.location}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-lg font-bold text-foreground">{c.projects}</p><p className="text-[10px] text-muted-foreground">Projects</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-lg font-bold text-primary">${(c.totalRevenue / 1000).toFixed(0)}K</p><p className="text-[10px] text-muted-foreground">Revenue</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-lg font-bold text-foreground">{c.invoicesPaid}</p><p className="text-[10px] text-muted-foreground">Paid</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className={`text-lg font-bold ${c.totalOutstanding > 0 ? "text-amber-500" : "text-emerald-500"}`}>{c.totalOutstanding > 0 ? `$${(c.totalOutstanding / 1000).toFixed(1)}K` : "âœ“"}</p><p className="text-[10px] text-muted-foreground">Due</p></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Since {c.since} â€¢ {c.paymentTerms}</span>
                        {c.rating > 0 && <span className="text-amber-500">{"â­".repeat(c.rating)}</span>}
                      </div>
                      {c.activeProjects.length > 0 && <div className="flex flex-wrap gap-1">{c.activeProjects.map(p => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}</div>}
                    </CardContent>
                  </Card>
                ))}
                {filteredClients.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No clients match your search</p>}
              </div>
            </div>
          </TabsContent>

          {/* â•â•â• Invoice Tracking â•â•â• */}
          <TabsContent value="invoices">
            <div className="space-y-4">
              <Card><CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search invoice, client or project..." value={invSearch} onChange={e => setInvSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={invStatus} onValueChange={setInvStatus}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Invoice builder coming soon!")}><Plus className="h-4 w-4" /> Create Invoice</Button>
                </div>
              </CardContent></Card>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold text-foreground">{filteredInvoiceDetails.length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Collected</p><p className="text-2xl font-bold text-emerald-500">${(filteredInvoiceDetails.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0) / 1000).toFixed(1)}K</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Outstanding</p><p className="text-2xl font-bold text-amber-500">${(filteredInvoiceDetails.filter(i => ["pending", "sent"].includes(i.status)).reduce((s, i) => s + i.total, 0) / 1000).toFixed(1)}K</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-destructive">${(filteredInvoiceDetails.filter(i => i.status === "overdue").reduce((s, i) => s + i.total, 0) / 1000).toFixed(1)}K</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Draft</p><p className="text-2xl font-bold text-muted-foreground">{filteredInvoiceDetails.filter(i => i.status === "draft").length}</p></CardContent></Card>
              </div>

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Invoice List ({filteredInvoiceDetails.length})</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Invoice</TableHead><TableHead>Client</TableHead><TableHead>Project</TableHead>
                      <TableHead>Items</TableHead><TableHead>Subtotal</TableHead><TableHead>Tax</TableHead>
                      <TableHead>Total</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {filteredInvoiceDetails.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-xs font-medium text-foreground">{inv.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{inv.client}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{inv.project}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{inv.items}</TableCell>
                          <TableCell className="text-foreground">${inv.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">${inv.tax}</TableCell>
                          <TableCell className="font-bold text-foreground">${inv.total.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">{inv.dueDate}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColors[inv.status]}>{inv.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setInvoicePreview(buildInvoicePreview(inv))}><Eye className="h-4 w-4" /></Button>
                              {inv.status === "draft" && <Button variant="ghost" size="sm" onClick={() => toast.success(`${inv.id} sent to ${inv.client}!`)}><Send className="h-4 w-4 text-primary" /></Button>}
                              {inv.status === "overdue" && <Button variant="ghost" size="sm" onClick={() => toast.success("Payment reminder sent!")}><AlertCircle className="h-4 w-4 text-destructive" /></Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredInvoiceDetails.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No invoices match your filters</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Invoicing Tab (unchanged) */}
          <TabsContent value="invoicing">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Receipt className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{invoiceDetails.length}</p><p className="text-xs text-muted-foreground">Total Invoices</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(invoiceDetails.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0) / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Collected</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(invoiceDetails.filter(i => ["pending", "sent"].includes(i.status)).reduce((s, i) => s + i.total, 0) / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Outstanding</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><AlertCircle className="h-5 w-5 text-destructive" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{invoiceDetails.filter(i => i.status === "overdue").length}</p><p className="text-xs text-muted-foreground">Overdue</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Invoice Management</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Invoice builder coming soon!")}><Plus className="h-4 w-4" /> Create Invoice</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Invoice</TableHead><TableHead>Client</TableHead><TableHead>Project</TableHead><TableHead>Items</TableHead>
                      <TableHead>Subtotal</TableHead><TableHead>Tax</TableHead><TableHead>Total</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {invoiceDetails.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-xs font-medium text-foreground">{inv.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{inv.client}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{inv.project}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{inv.items}</TableCell>
                          <TableCell className="text-foreground">${inv.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">${inv.tax}</TableCell>
                          <TableCell className="font-bold text-foreground">${inv.total.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">{inv.dueDate}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColors[inv.status]}>{inv.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Time Tracking Tab (unchanged) */}
          <TabsContent value="timetracking">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Timer className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{timeEntries.reduce((s, t) => s + t.hours, 0).toFixed(1)}h</p><p className="text-xs text-muted-foreground">Total Hours</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${timeEntries.reduce((s, t) => s + t.amount, 0).toFixed(0)}</p><p className="text-xs text-muted-foreground">Total Earnings</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertCircle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{timeEntries.filter(t => t.status === "unbilled").length}</p><p className="text-xs text-muted-foreground">Unbilled Entries</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><TrendingUp className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${Math.round(timeEntries.reduce((s, t) => s + t.rate, 0) / timeEntries.length)}</p><p className="text-xs text-muted-foreground">Avg Rate/hr</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Time Entries</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Timer started! â±ï¸")}><Play className="h-4 w-4" /> Start Timer</Button>
                    <Button size="sm" className="gap-1.5" onClick={() => toast.success("Manual entry coming soon!")}><Plus className="h-4 w-4" /> Log Time</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Date</TableHead><TableHead>Project</TableHead><TableHead>Task</TableHead>
                      <TableHead>Hours</TableHead><TableHead>Rate</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {timeEntries.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="text-muted-foreground">{t.date}</TableCell>
                          <TableCell className="font-medium text-foreground">{t.project}</TableCell>
                          <TableCell className="text-muted-foreground">{t.task}</TableCell>
                          <TableCell className="font-medium text-foreground">{t.hours}h</TableCell>
                          <TableCell className="text-muted-foreground">${t.rate}/hr</TableCell>
                          <TableCell className="font-bold text-foreground">${t.amount.toFixed(0)}</TableCell>
                          <TableCell><Badge variant="outline" className={timeStatusColors[t.status]}>{t.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Client Portal Tab (unchanged) */}
          <TabsContent value="portal">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><UserCircle className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{clientPortalData.filter(c => c.portalStatus === "active").length}</p><p className="text-xs text-muted-foreground">Active Portals</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><FileText className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{clientPortalData.reduce((s, c) => s + c.sharedFiles, 0)}</p><p className="text-xs text-muted-foreground">Shared Files</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Send className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{clientPortalData.reduce((s, c) => s + c.messages, 0)}</p><p className="text-xs text-muted-foreground">Messages</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><DollarSign className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(clientPortalData.reduce((s, c) => s + c.outstanding, 0) / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Outstanding</p></div>
                </CardContent></Card>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clientPortalData.map((cp) => (
                  <Card key={cp.id} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">{cp.client.charAt(0)}</div>
                          <div>
                            <h3 className="font-semibold text-foreground">{cp.client}</h3>
                            <p className="text-xs text-muted-foreground">Last active: {cp.lastActivity}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={portalStatusColors[cp.portalStatus]}>{cp.portalStatus}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">{cp.activeProjects}</p><p className="text-muted-foreground">Projects</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">${cp.totalInvoiced.toLocaleString()}</p><p className="text-muted-foreground">Invoiced</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">{cp.sharedFiles}</p><p className="text-muted-foreground">Files</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">{cp.messages}</p><p className="text-muted-foreground">Messages</p></div>
                      </div>
                      {cp.outstanding > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-amber-500 font-medium">Outstanding: ${cp.outstanding.toLocaleString()}</span>
                          <Button variant="outline" size="sm" onClick={() => toast.success("Reminder sent!")}>Send Reminder</Button>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full gap-1.5"><Eye className="h-3 w-3" /> View Portal</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* â•â•â• Project Detail Dialog â•â•â• */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><FolderOpen className="h-6 w-6 text-primary" /></div>
                  <div>
                    <p>{selectedProject.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selectedProject.client} â€¢ {selectedProject.startDate} â†’ {selectedProject.deadline}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className={statusColors[selectedProject.status]}>{selectedProject.status}</Badge>
                  {selectedProject.tags.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                </div>
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Budget</p><p className="text-xl font-bold text-foreground">${selectedProject.budget.toLocaleString()}</p></div>
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Spent</p><p className={`text-xl font-bold ${selectedProject.spent > selectedProject.budget * 0.9 ? "text-destructive" : "text-foreground"}`}>${selectedProject.spent.toLocaleString()}</p></div>
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Hours</p><p className="text-xl font-bold text-primary">{selectedProject.hoursLogged}h</p></div>
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Rate</p><p className="text-xl font-bold text-foreground">${selectedProject.hourlyRate}/hr</p></div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{selectedProject.progress}%</span></div>
                  <Progress value={selectedProject.progress} className="h-3" />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Tasks ({selectedProject.tasks.filter(t => t.status === "done").length}/{selectedProject.tasks.length} done)</p>
                  <div className="space-y-1.5">
                    {selectedProject.tasks.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${t.status === "done" ? "bg-emerald-500" : t.status === "in-progress" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        <span className={`text-sm flex-1 ${t.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.name}</span>
                        <Badge variant="outline" className={`text-[10px] ${t.status === "done" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : t.status === "in-progress" ? "bg-primary/15 text-primary border-primary/30" : "bg-muted text-muted-foreground"}`}>{t.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Milestones</p>
                  <div className="space-y-1.5">
                    {selectedProject.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {m.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Calendar className="h-4 w-4 text-muted-foreground" />}
                        <span className={m.done ? "text-muted-foreground line-through" : "text-foreground"}>{m.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* â•â•â• Client Detail Dialog â•â•â• */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-lg">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">{selectedClient.name.charAt(0)}</div>
                  <div>
                    <p>{selectedClient.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selectedClient.company}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Revenue</p><p className="text-xl font-bold text-primary">${selectedClient.totalRevenue.toLocaleString()}</p></div>
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Outstanding</p><p className={`text-xl font-bold ${selectedClient.totalOutstanding > 0 ? "text-amber-500" : "text-emerald-500"}`}>${selectedClient.totalOutstanding.toLocaleString()}</p></div>
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Invoices Paid</p><p className="text-xl font-bold text-foreground">{selectedClient.invoicesPaid}</p></div>
                  <div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Avg Response</p><p className="text-xl font-bold text-foreground">{selectedClient.avgResponseTime}</p></div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {selectedClient.email}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {selectedClient.phone}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {selectedClient.location}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Since {selectedClient.since} â€¢ {selectedClient.paymentTerms}</div>
                </div>

                {selectedClient.activeProjects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1.5">Active Projects</p>
                    <div className="flex flex-wrap gap-1">{selectedClient.activeProjects.map(p => <Badge key={p} variant="outline">{p}</Badge>)}</div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-foreground mb-1.5">Notes</p>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{selectedClient.notes}</p>
                </div>

                {selectedClient.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <span className="text-amber-500">{"â­".repeat(selectedClient.rating)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Dialog */}
      <InvoiceDialog open={!!invoicePreview} onOpenChange={() => setInvoicePreview(null)} data={invoicePreview} />
    </DashboardLayout>
  );
};

export default FreelancerPage;

