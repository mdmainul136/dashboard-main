import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, UserPlus, Clock, Activity } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer" | "fulfillment";
  channels: { name: string; access: boolean }[];
  lastLogin: string;
  status: "active" | "inactive";
}

interface ActivityLog {
  id: string;
  staff: string;
  action: string;
  timestamp: string;
  channel: string;
}

const mockStaff: StaffMember[] = [
  { id: "st1", name: "Ahmed Hassan", email: "ahmed@store.com", role: "admin", channels: [{ name: "Shopify", access: true }, { name: "Salla", access: true }], lastLogin: "2 min ago", status: "active" },
  { id: "st2", name: "Sara Khan", email: "sara@store.com", role: "editor", channels: [{ name: "Shopify", access: true }, { name: "Salla", access: false }], lastLogin: "1 hr ago", status: "active" },
  { id: "st3", name: "Omar Raza", email: "omar@store.com", role: "fulfillment", channels: [{ name: "Shopify", access: true }, { name: "Salla", access: true }], lastLogin: "3 hrs ago", status: "active" },
  { id: "st4", name: "Fatima Ali", email: "fatima@store.com", role: "viewer", channels: [{ name: "Shopify", access: false }, { name: "Salla", access: true }], lastLogin: "2 days ago", status: "inactive" },
];

const mockActivity: ActivityLog[] = [
  { id: "a1", staff: "Ahmed Hassan", action: "Updated product pricing", timestamp: "5 min ago", channel: "Shopify" },
  { id: "a2", staff: "Sara Khan", action: "Published blog post", timestamp: "1 hr ago", channel: "Shopify" },
  { id: "a3", staff: "Omar Raza", action: "Fulfilled order #SH-1042", timestamp: "2 hrs ago", channel: "Shopify" },
  { id: "a4", staff: "Ahmed Hassan", action: "Added new discount code", timestamp: "3 hrs ago", channel: "Salla" },
  { id: "a5", staff: "Sara Khan", action: "Updated collection layout", timestamp: "5 hrs ago", channel: "Salla" },
];

const StaffAccess = () => {
  const [staff, setStaff] = useState(mockStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "viewer" as "admin" | "editor" | "viewer" | "fulfillment" });

  const activeCount = staff.filter(s => s.status === "active").length;

  const roleBadge = (r: string) => {
    const colors: Record<string, string> = {
      admin: "bg-destructive/10 text-destructive border-destructive/20",
      editor: "bg-primary/10 text-primary border-primary/20",
      viewer: "bg-muted text-muted-foreground border-border",
      fulfillment: "bg-success/10 text-success border-success/20",
    };
    return <Badge className={colors[r] || ""}>{r.charAt(0).toUpperCase() + r.slice(1)}</Badge>;
  };

  const toggleChannelAccess = (staffId: string, channelName: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== staffId) return s;
      return { ...s, channels: s.channels.map(c => c.name === channelName ? { ...c, access: !c.access } : c) };
    }));
  };

  const inviteStaff = () => {
    if (!newStaff.name || !newStaff.email) return;
    setStaff(prev => [...prev, {
      id: `st${Date.now()}`, name: newStaff.name, email: newStaff.email, role: newStaff.role,
      channels: [{ name: "Shopify", access: false }, { name: "Salla", access: false }],
      lastLogin: "Never", status: "active",
    }]);
    setNewStaff({ name: "", email: "", role: "viewer" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Staff</p><p className="text-2xl font-bold text-foreground">{staff.length}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active Now</p><p className="text-2xl font-bold text-success">{activeCount}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><Shield className="h-5 w-5 text-success" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Roles in Use</p><p className="text-2xl font-bold text-foreground">{new Set(staff.map(s => s.role)).size}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Activity className="h-5 w-5 text-violet-500" /></div></div></CardContent></Card>
      </div>

      {/* Staff List */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{staff.length} staff members</p>
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}><UserPlus className="h-4 w-4" /> Invite Staff</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Role</th><th className="p-4 font-medium">Shopify</th><th className="p-4 font-medium">Salla</th><th className="p-4 font-medium">Last Login</th><th className="p-4 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4"><p className="font-medium text-foreground">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></td>
                  <td className="p-4">{roleBadge(s.role)}</td>
                  <td className="p-4"><Switch checked={s.channels.find(c => c.name === "Shopify")?.access ?? false} onCheckedChange={() => toggleChannelAccess(s.id, "Shopify")} disabled={s.role === "admin"} /></td>
                  <td className="p-4"><Switch checked={s.channels.find(c => c.name === "Salla")?.access ?? false} onCheckedChange={() => toggleChannelAccess(s.id, "Salla")} disabled={s.role === "admin"} /></td>
                  <td className="p-4 text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.lastLogin}</span></td>
                  <td className="p-4">{s.status === "active" ? <Badge className="bg-success/10 text-success border-success/20">Active</Badge> : <Badge variant="outline">Inactive</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockActivity.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm text-foreground"><span className="font-medium">{a.staff}</span> — {a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.timestamp}</p>
                </div>
                <Badge variant="outline">{a.channel}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Staff Member</DialogTitle><DialogDescription>Add a new team member with channel access</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Full Name</Label><Input value={newStaff.name} onChange={e => setNewStaff(p => ({ ...p, name: e.target.value }))} placeholder="e.g. John Doe" /></div>
            <div><Label>Email</Label><Input type="email" value={newStaff.email} onChange={e => setNewStaff(p => ({ ...p, email: e.target.value }))} placeholder="john@store.com" /></div>
            <div><Label>Role</Label>
              <Select value={newStaff.role} onValueChange={(v: "admin" | "editor" | "viewer" | "fulfillment") => setNewStaff(p => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="fulfillment">Fulfillment Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={inviteStaff}>Send Invite</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffAccess;
