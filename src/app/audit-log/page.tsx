"use client";

import { useMemo, useSyncExternalStore, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollText, Search, Filter, Download } from "lucide-react";
import { getAuditEntries, subscribeAudit, type AuditEntry } from "@/data/auditLog";

const actionColors: Record<AuditEntry["action"], string> = {
  create: "default",
  update: "secondary",
  delete: "destructive",
  login: "outline",
  logout: "outline",
  export: "secondary",
  approve: "default",
  refund: "destructive",
};

const AuditLog = () => {
  const entries = useSyncExternalStore(subscribeAudit, getAuditEntries, getAuditEntries);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (moduleFilter !== "all" && e.module !== moduleFilter) return false;
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (search && !e.description.toLowerCase().includes(search.toLowerCase()) && !e.user.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [entries, search, moduleFilter, actionFilter]);

  const stats = useMemo(() => ({
    total: entries.length,
    today: entries.filter((e) => e.timestamp.startsWith("2025-02-19")).length,
    users: new Set(entries.map((e) => e.user)).size,
  }), [entries]);

  const exportCSV = () => {
    const header = "ID,Timestamp,User,Action,Module,Description,Details";
    const rows = filtered.map((e) => `${e.id},${e.timestamp},"${e.user}",${e.action},${e.module},"${e.description}","${e.details || ""}"`);
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
            <p className="text-muted-foreground">Complete activity history of all system actions</p>
          </div>
          <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-3"><ScrollText className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Entries</p><p className="text-2xl font-bold">{stats.total}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-emerald-500/10 p-3"><Filter className="h-5 w-5 text-emerald-500" /></div><div><p className="text-sm text-muted-foreground">Today's Actions</p><p className="text-2xl font-bold">{stats.today}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-violet-500/10 p-3"><ScrollText className="h-5 w-5 text-violet-500" /></div><div><p className="text-sm text-muted-foreground">Active Users</p><p className="text-2xl font-bold">{stats.users}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search by user or description..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Module" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {["orders", "inventory", "finance", "hr", "pos", "crm", "settings", "auth"].map((m) => (
                    <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {["create", "update", "delete", "login", "logout", "export", "approve", "refund"].map((a) => (
                    <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                      {new Date(e.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      <br />
                      <span className="text-[10px]">{new Date(e.timestamp).toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell className="font-medium">{e.user}</TableCell>
                    <TableCell><Badge variant={actionColors[e.action] as any} className="capitalize">{e.action}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{e.module}</Badge></TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{e.details || "â€”"}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No entries found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AuditLog;

