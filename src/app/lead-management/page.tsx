"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Phone, Mail, Plus, Eye, Clock, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { useState } from "react";

type LeadStatus = "new" | "contacted" | "viewing-scheduled" | "negotiation" | "closed-won" | "closed-lost";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  interest: string;
  budget: string;
  status: LeadStatus;
  assignedTo: string;
  lastActivity: string;
}

const mockLeads: Lead[] = [
  { id: "L-201", name: "Abdullah Al-Rashid", email: "abdullah@email.com", phone: "+966 55 111 2222", source: "Website", interest: "3BR Villa - Al Narjis", budget: "2.5M SAR", status: "new", assignedTo: "Fahad", lastActivity: "5 min ago" },
  { id: "L-202", name: "Nadia Hussain", email: "nadia@email.com", phone: "+966 50 333 4444", source: "Bayut", interest: "2BR Apartment - Downtown", budget: "800K SAR", status: "contacted", assignedTo: "Sara", lastActivity: "1 hour ago" },
  { id: "L-203", name: "Khalid Mohammed", email: "khalid@email.com", phone: "+966 54 555 6666", source: "Referral", interest: "Office Space - King Fahad Rd", budget: "1.2M SAR", status: "viewing-scheduled", assignedTo: "Fahad", lastActivity: "Today, 10:30 AM" },
  { id: "L-204", name: "Fatima Al-Zahrani", email: "fatima@email.com", phone: "+966 55 777 8888", source: "WhatsApp", interest: "4BR Villa - Al Yasmin", budget: "3.8M SAR", status: "negotiation", assignedTo: "Omar", lastActivity: "Yesterday" },
  { id: "L-205", name: "Mohammed Salem", email: "msalem@email.com", phone: "+966 50 999 0000", source: "Walk-in", interest: "Studio - Al Olaya", budget: "450K SAR", status: "closed-won", assignedTo: "Sara", lastActivity: "2 days ago" },
  { id: "L-206", name: "Reem Ibrahim", email: "reem@email.com", phone: "+966 54 222 3333", source: "Instagram", interest: "Penthouse - Corniche", budget: "5M SAR", status: "closed-lost", assignedTo: "Omar", lastActivity: "3 days ago" },
];

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  contacted: { label: "Contacted", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  "viewing-scheduled": { label: "Viewing Scheduled", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  negotiation: { label: "Negotiation", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
  "closed-won": { label: "Closed Won", color: "bg-green-500/10 text-green-600 border-green-200" },
  "closed-lost": { label: "Closed Lost", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const LeadManagementPage = () => {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? mockLeads : mockLeads.filter(l => l.status === tab);

  const pipeline = [
    { status: "new", count: mockLeads.filter(l => l.status === "new").length },
    { status: "contacted", count: mockLeads.filter(l => l.status === "contacted").length },
    { status: "viewing-scheduled", count: mockLeads.filter(l => l.status === "viewing-scheduled").length },
    { status: "negotiation", count: mockLeads.filter(l => l.status === "negotiation").length },
    { status: "closed-won", count: mockLeads.filter(l => l.status === "closed-won").length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lead Management</h1>
            <p className="text-muted-foreground">Track inquiries and manage your sales pipeline</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Lead</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter name" /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input placeholder="+966" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" /></div>
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                      <SelectContent>
                        {["Website", "Bayut", "Referral", "WhatsApp", "Walk-in", "Instagram"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Property Interest</Label><Input placeholder="e.g. 3BR Villa - Al Narjis" /></div>
                <div className="space-y-2"><Label>Budget</Label><Input placeholder="e.g. 2.5M SAR" /></div>
                <Button className="w-full">Save Lead</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pipeline Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {pipeline.map(p => {
            const sc = statusConfig[p.status as LeadStatus];
            return (
              <Card key={p.status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab(p.status)}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{p.count}</p>
                  <Badge variant="outline" className={`mt-1 ${sc.color}`}>{sc.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: mockLeads.length, icon: <Users className="h-5 w-5 text-primary" /> },
            { label: "This Week", value: 3, icon: <TrendingUp className="h-5 w-5 text-green-500" /> },
            { label: "Conversion Rate", value: "16.7%", icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
            { label: "Avg. Response", value: "2.3 hrs", icon: <Clock className="h-5 w-5 text-amber-500" /> },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-muted p-2.5">{s.icon}</div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="pb-3">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">All ({mockLeads.length})</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="contacted">Contacted</TabsTrigger>
                <TabsTrigger value="viewing-scheduled">Viewing</TabsTrigger>
                <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.id} Â· {lead.lastActivity}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5 text-sm">
                        <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</div>
                        <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{lead.interest}</TableCell>
                    <TableCell className="font-semibold">{lead.budget}</TableCell>
                    <TableCell><Badge variant="outline">{lead.source}</Badge></TableCell>
                    <TableCell>{lead.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[lead.status].color}>
                        {statusConfig[lead.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeadManagementPage;

