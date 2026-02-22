import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Store, Users, DollarSign, TrendingUp, Plus, Star, Package, Clock,
  ShieldCheck, AlertTriangle, FileText, CheckCircle2, MessageSquare
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Seller {
  id: string;
  name: string;
  store: string;
  products: number;
  revenue: number;
  commissionRate: number;
  rating: number;
  fulfillmentRate: number;
  status: "active" | "pending" | "suspended";
  pendingPayout: number;
  joinedDate: string;
  kycStatus: "verified" | "pending" | "rejected";
  crNumber: string;
  vatId: string;
}

interface Dispute {
  id: string;
  disputeId: string;
  seller: string;
  customer: string;
  reason: string;
  amount: number;
  status: "open" | "resolved" | "escalated";
  date: string;
}

const initialSellers: Seller[] = [
  { id: "s1", name: "Ahmed Electronics", store: "ahmed-tech.salla.sa", products: 45, revenue: 128500, commissionRate: 12, rating: 4.8, fulfillmentRate: 96, status: "active", pendingPayout: 3200, joinedDate: "2025-08-15", kycStatus: "verified", crNumber: "CR-1234567890", vatId: "VAT-300012345600003" },
  { id: "s2", name: "Sara Fashion", store: "sara-style.salla.sa", products: 120, revenue: 95200, commissionRate: 15, rating: 4.5, fulfillmentRate: 92, status: "active", pendingPayout: 5100, joinedDate: "2025-10-01", kycStatus: "verified", crNumber: "CR-9876543210", vatId: "VAT-300098765400003" },
  { id: "s3", name: "Khalid Home", store: "khalid-home.salla.sa", products: 32, revenue: 42800, commissionRate: 10, rating: 4.2, fulfillmentRate: 88, status: "active", pendingPayout: 1800, joinedDate: "2025-11-20", kycStatus: "verified", crNumber: "CR-5555666677", vatId: "VAT-300055556600003" },
  { id: "s4", name: "Noor Beauty", store: "noor-beauty.salla.sa", products: 78, revenue: 67300, commissionRate: 14, rating: 4.6, fulfillmentRate: 94, status: "pending", pendingPayout: 0, joinedDate: "2026-01-10", kycStatus: "pending", crNumber: "CR-1112223334", vatId: "" },
  { id: "s5", name: "Omar Sports", store: "omar-sports.salla.sa", products: 55, revenue: 31200, commissionRate: 11, rating: 3.9, fulfillmentRate: 82, status: "suspended", pendingPayout: 2400, joinedDate: "2025-09-05", kycStatus: "rejected", crNumber: "CR-9998887776", vatId: "VAT-300099988800003" },
];

const initialDisputes: Dispute[] = [
  { id: "d1", disputeId: "DSP-001", seller: "Ahmed Electronics", customer: "Rami Hassan", reason: "Product not as described", amount: 450, status: "open", date: "2026-02-18" },
  { id: "d2", disputeId: "DSP-002", seller: "Sara Fashion", customer: "Layla Ahmed", reason: "Late delivery", amount: 120, status: "resolved", date: "2026-02-15" },
  { id: "d3", disputeId: "DSP-003", seller: "Omar Sports", customer: "Ali Mahmoud", reason: "Defective item", amount: 890, status: "escalated", date: "2026-02-17" },
  { id: "d4", disputeId: "DSP-004", seller: "Khalid Home", customer: "Nadia Youssef", reason: "Wrong item received", amount: 230, status: "open", date: "2026-02-19" },
];

const Marketplace = () => {
  const [sellers, setSellers] = useState(initialSellers);
  const [disputes] = useState(initialDisputes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCommission, setNewCommission] = useState("12");

  const activeSellers = sellers.filter(s => s.status === "active").length;
  const totalRevenue = sellers.reduce((s, sel) => s + sel.revenue, 0);
  const avgCommission = (sellers.reduce((s, sel) => s + sel.commissionRate, 0) / sellers.length).toFixed(1);
  const pendingSettlements = sellers.reduce((s, sel) => s + sel.pendingPayout, 0);
  const openDisputes = disputes.filter(d => d.status === "open" || d.status === "escalated").length;

  const statusBadge = (status: Seller["status"]) => {
    if (status === "active") return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    if (status === "pending") return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>;
  };

  const kycBadge = (kyc: Seller["kycStatus"]) => {
    if (kyc === "verified") return <Badge className="bg-success/10 text-success border-success/20 text-[10px] gap-1"><ShieldCheck className="h-3 w-3" /> KYC Verified</Badge>;
    if (kyc === "pending") return <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px] gap-1"><Clock className="h-3 w-3" /> KYC Pending</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1"><AlertTriangle className="h-3 w-3" /> KYC Rejected</Badge>;
  };

  const disputeStatusBadge = (status: Dispute["status"]) => {
    if (status === "open") return <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px]">Open</Badge>;
    if (status === "resolved") return <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Resolved</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Escalated</Badge>;
  };

  const handleInvite = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast({ title: "Error", description: "Name and email required", variant: "destructive" });
      return;
    }
    const seller: Seller = {
      id: `s${Date.now()}`, name: newName.trim(), store: `${newName.toLowerCase().replace(/\s+/g, "-")}.salla.sa`,
      products: 0, revenue: 0, commissionRate: Number(newCommission) || 12, rating: 0, fulfillmentRate: 0,
      status: "pending", pendingPayout: 0, joinedDate: new Date().toISOString().split("T")[0],
      kycStatus: "pending", crNumber: "", vatId: "",
    };
    setSellers(prev => [...prev, seller]);
    setDialogOpen(false); setNewName(""); setNewEmail(""); setNewCommission("12");
    toast({ title: "Invitation Sent!", description: `${seller.name} has been invited` });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Sellers</p><p className="text-2xl font-bold text-foreground">{activeSellers}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold text-foreground">SAR {(totalRevenue / 1000).toFixed(0)}k</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Avg Commission</p><p className="text-2xl font-bold text-foreground">{avgCommission}%</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><DollarSign className="h-5 w-5 text-violet-500" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Pending Payouts</p><p className="text-2xl font-bold text-foreground">SAR {pendingSettlements.toLocaleString()}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><Clock className="h-5 w-5 text-warning" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Open Disputes</p><p className="text-2xl font-bold text-foreground">{openDisputes}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><MessageSquare className="h-5 w-5 text-destructive" /></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Invite Seller
        </Button>
      </div>

      {/* Seller Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sellers.map(s => (
          <Card key={s.id} className="border transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                  <Store className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.store}</p>
                </div>
                {statusBadge(s.status)}
              </div>

              {/* KYC Section */}
              <div className="rounded-lg bg-muted/30 p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Verification</span>
                  {kycBadge(s.kycStatus)}
                </div>
                {s.crNumber && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> CR: {s.crNumber}</p>
                )}
                {s.vatId && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> VAT: {s.vatId}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">{s.products}</p>
                  <p className="text-[10px] text-muted-foreground">Products</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">SAR {(s.revenue / 1000).toFixed(0)}k</p>
                  <p className="text-[10px] text-muted-foreground">Revenue</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-sm font-bold text-foreground">{s.commissionRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Commission</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" /> {s.rating > 0 ? s.rating : "N/A"}</span>
                <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {s.fulfillmentRate}% fulfillment</span>
              </div>

              {s.pendingPayout > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-warning/5 p-2 text-xs">
                  <span className="text-muted-foreground">Pending Payout</span>
                  <span className="font-medium text-warning">SAR {s.pendingPayout.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dispute Management */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-destructive" /> Dispute Management</h3>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Dispute ID</th>
                  <th className="p-4 font-medium">Seller</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Reason</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map(d => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{d.disputeId}</td>
                    <td className="p-4 text-foreground">{d.seller}</td>
                    <td className="p-4 text-foreground">{d.customer}</td>
                    <td className="p-4 text-muted-foreground">{d.reason}</td>
                    <td className="p-4 font-mono text-foreground">SAR {d.amount}</td>
                    <td className="p-4">{disputeStatusBadge(d.status)}</td>
                    <td className="p-4 text-muted-foreground">{d.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Invite Seller Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Invite Seller</DialogTitle>
            <DialogDescription>Send an invitation to join your marketplace</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Seller / Store Name</Label>
              <Input placeholder="e.g. Ahmed Electronics" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="seller@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input type="number" placeholder="12" value={newCommission} onChange={e => setNewCommission(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} className="gap-1.5"><Plus className="h-4 w-4" /> Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
