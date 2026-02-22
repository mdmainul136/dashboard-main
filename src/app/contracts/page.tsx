"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSignature, Plus, Eye, Download, CheckCircle2, Clock, AlertTriangle, FileText } from "lucide-react";
import { useState } from "react";

type ContractStatus = "draft" | "sent" | "signed" | "expired" | "cancelled";

interface Contract {
  id: string;
  title: string;
  type: "sale" | "lease" | "management" | "commission";
  property: string;
  parties: string;
  value: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  lastUpdated: string;
}

const mockContracts: Contract[] = [
  { id: "C-301", title: "Sale Agreement - Villa Al Narjis", type: "sale", property: "3BR Villa - Al Narjis", parties: "Abdullah Al-Rashid & Realty Co.", value: "2,500,000 SAR", status: "signed", startDate: "Jan 15, 2025", endDate: "-", lastUpdated: "Jan 15, 2025" },
  { id: "C-302", title: "Lease Contract - Downtown Apt", type: "lease", property: "2BR Apartment - Downtown", parties: "Nadia Hussain & Property Owner", value: "85,000 SAR/yr", status: "sent", startDate: "Feb 1, 2025", endDate: "Jan 31, 2026", lastUpdated: "Jan 20, 2025" },
  { id: "C-303", title: "Property Management Agreement", type: "management", property: "Al Hamra Complex (8 units)", parties: "Investor Group & Realty Co.", value: "120,000 SAR/yr", status: "signed", startDate: "Jan 1, 2025", endDate: "Dec 31, 2025", lastUpdated: "Jan 1, 2025" },
  { id: "C-304", title: "Agent Commission Agreement", type: "commission", property: "Office Space - King Fahad Rd", parties: "Fahad Al-Otaibi & Realty Co.", value: "2.5%", status: "draft", startDate: "-", endDate: "-", lastUpdated: "Jan 22, 2025" },
  { id: "C-305", title: "Lease Renewal - Al Olaya Studio", type: "lease", property: "Studio - Al Olaya", parties: "Mohammed Salem & Owner", value: "45,000 SAR/yr", status: "expired", startDate: "Jan 1, 2024", endDate: "Dec 31, 2024", lastUpdated: "Dec 15, 2024" },
  { id: "C-306", title: "Sale Agreement - Corniche Penthouse", type: "sale", property: "Penthouse - Corniche", parties: "Pending Buyer & Developer", value: "5,200,000 SAR", status: "cancelled", startDate: "-", endDate: "-", lastUpdated: "Jan 18, 2025" },
];

const statusConfig: Record<ContractStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border", icon: <FileText className="h-3.5 w-3.5" /> },
  sent: { label: "Sent", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: <Clock className="h-3.5 w-3.5" /> },
  signed: { label: "Signed", color: "bg-green-500/10 text-green-600 border-green-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  expired: { label: "Expired", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

const typeLabels: Record<string, string> = {
  sale: "Sale",
  lease: "Lease",
  management: "Management",
  commission: "Commission",
};

const ContractsPage = () => {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? mockContracts : mockContracts.filter(c => c.status === tab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contracts & Documents</h1>
            <p className="text-muted-foreground">Manage property agreements and legal documents</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Contract</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Contract</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2"><Label>Contract Title</Label><Input placeholder="e.g. Sale Agreement - Villa" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Property</Label><Input placeholder="Property name" /></div>
                </div>
                <div className="space-y-2"><Label>Parties</Label><Input placeholder="Party A & Party B" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Value</Label><Input placeholder="e.g. 2,500,000 SAR" /></div>
                  <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
                </div>
                <Button className="w-full">Create Contract</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Contracts", value: mockContracts.length, icon: <FileSignature className="h-5 w-5 text-primary" /> },
            { label: "Active/Signed", value: mockContracts.filter(c => c.status === "signed").length, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
            { label: "Pending", value: mockContracts.filter(c => c.status === "sent" || c.status === "draft").length, icon: <Clock className="h-5 w-5 text-amber-500" /> },
            { label: "Expiring Soon", value: 1, icon: <AlertTriangle className="h-5 w-5 text-destructive" /> },
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
              <TabsList>
                <TabsTrigger value="all">All ({mockContracts.length})</TabsTrigger>
                <TabsTrigger value="signed">Signed</TabsTrigger>
                <TabsTrigger value="sent">Pending</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => {
                  const sc = statusConfig[c.status];
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.id} Â· {c.parties}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{typeLabels[c.type]}</Badge></TableCell>
                      <TableCell className="max-w-[150px] truncate">{c.property}</TableCell>
                      <TableCell className="font-semibold">{c.value}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.startDate !== "-" ? `${c.startDate} â€“ ${c.endDate}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 ${sc.color}`}>
                          {sc.icon} {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ContractsPage;

