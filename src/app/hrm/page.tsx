"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, UserCheck, UserX, Clock, Star, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaff, subscribe, addStaffMember, updateStaffMember, deleteStaffMember, type StaffMember } from "@/data/staff";
import { toast } from "@/hooks/use-toast";

function useStaff() { return useSyncExternalStore(subscribe, getStaff, getStaff); }

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success",
  "On Leave": "bg-warning/10 text-warning",
  Inactive: "bg-destructive/10 text-destructive",
};

const HRStaff = () => {
  const staff = useStaff();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<StaffMember | null>(null);

  // Add form
  const [form, setForm] = useState({ name: "", role: "", department: "", email: "", phone: "", shift: "Morning" as const, salary: "" });
  const resetForm = () => setForm({ name: "", role: "", department: "", email: "", phone: "", shift: "Morning", salary: "" });

  const stats = useMemo(() => ({
    total: staff.length,
    active: staff.filter(s => s.status === "Active").length,
    onLeave: staff.filter(s => s.status === "On Leave").length,
    avgPerformance: staff.length ? (staff.reduce((s, m) => s + m.performance, 0) / staff.length).toFixed(1) : "0",
  }), [staff]);

  const filtered = useMemo(() => {
    return staff.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [staff, search, statusFilter]);

  const handleAdd = () => {
    if (!form.name.trim() || !form.role.trim()) { toast({ title: "Name and role required", variant: "destructive" }); return; }
    addStaffMember({
      id: `s${Date.now()}`, name: form.name, role: form.role, department: form.department || "General",
      email: form.email, phone: form.phone, status: "Active", shift: form.shift,
      joinDate: new Date().toISOString().split("T")[0], salary: parseFloat(form.salary) || 0,
      performance: 3, avatar: "ðŸ‘¤",
    });
    setAddOpen(false); resetForm();
    toast({ title: "Staff member added!" });
  };

  const handleStatusChange = (id: string, status: StaffMember["status"]) => {
    updateStaffMember(id, { status });
    toast({ title: `Status updated to ${status}` });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">HR / Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage team members and performance</p>
        </div>
        <Button className="gap-1.5 rounded-xl shadow-sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Staff</Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Staff", value: stats.total, icon: <Users className="h-5 w-5" />, gradient: "from-primary/15 to-primary/5", color: "text-primary" },
          { label: "Active", value: stats.active, icon: <UserCheck className="h-5 w-5" />, gradient: "from-[hsl(160,84%,39%)]/15 to-[hsl(160,84%,39%)]/5", color: "text-success" },
          { label: "On Leave", value: stats.onLeave, icon: <Clock className="h-5 w-5" />, gradient: "from-[hsl(38,92%,50%)]/15 to-[hsl(38,92%,50%)]/5", color: "text-warning" },
          { label: "Avg Performance", value: `${stats.avgPerformance}/5`, icon: <Star className="h-5 w-5" />, gradient: "from-[hsl(280,68%,60%)]/15 to-[hsl(280,68%,60%)]/5", color: "text-[hsl(280,68%,60%)]" },
        ].map((s, i) => (
          <div key={s.label} className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} ${s.color} transition-transform duration-300 group-hover:scale-110`}>{s.icon}</div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-card-foreground tabular-nums">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        {["All", "Active", "On Leave", "Inactive"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent")}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Staff Member", "Role", "Department", "Shift", "Performance", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(member => (
                <tr key={member.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-5 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{member.avatar}</span>
                      <div>
                        <p className="font-medium text-card-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-card-foreground">{member.role}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{member.department}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{member.shift}</td>
                  <td className="px-5 py-4 text-sm">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < member.performance ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30")} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={cn("text-xs", statusStyles[member.status])}>{member.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Select value={member.status} onValueChange={(v) => handleStatusChange(member.id, v as StaffMember["status"])}>
                        <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <button onClick={() => { deleteStaffMember(member.id); toast({ title: "Staff removed" }); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={o => { if (!o) { setAddOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Role *</Label><Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Department</Label><Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Shift</Label>
                <Select value={form.shift} onValueChange={v => setForm(f => ({ ...f, shift: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Salary (à§³)</Label><Input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} /></div>
            </div>
            <Button className="w-full" onClick={handleAdd}>Add Member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HRStaff;

