"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCog, Plus, Phone, Mail, Star, TrendingUp, Home, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Agent {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  role: string;
  activeListings: number;
  closedDeals: number;
  totalRevenue: string;
  rating: number;
  status: "active" | "on-leave" | "inactive";
}

const mockAgents: Agent[] = [
  { id: "A-01", name: "Fahad Al-Otaibi", initials: "FA", email: "fahad@realty.com", phone: "+966 55 100 2000", role: "Senior Agent", activeListings: 12, closedDeals: 45, totalRevenue: "18.5M SAR", rating: 4.8, status: "active" },
  { id: "A-02", name: "Sara Al-Qahtani", initials: "SQ", email: "sara@realty.com", phone: "+966 50 300 4000", role: "Agent", activeListings: 8, closedDeals: 28, totalRevenue: "9.2M SAR", rating: 4.6, status: "active" },
  { id: "A-03", name: "Omar Hassan", initials: "OH", email: "omar@realty.com", phone: "+966 54 500 6000", role: "Senior Agent", activeListings: 15, closedDeals: 62, totalRevenue: "24.1M SAR", rating: 4.9, status: "active" },
  { id: "A-04", name: "Layla Ibrahim", initials: "LI", email: "layla@realty.com", phone: "+966 55 700 8000", role: "Junior Agent", activeListings: 5, closedDeals: 8, totalRevenue: "2.8M SAR", rating: 4.2, status: "active" },
  { id: "A-05", name: "Youssef Ahmed", initials: "YA", email: "youssef@realty.com", phone: "+966 50 900 1000", role: "Agent", activeListings: 0, closedDeals: 35, totalRevenue: "12.4M SAR", rating: 4.5, status: "on-leave" },
];

const statusBadge: Record<string, string> = {
  active: "bg-green-500/10 text-green-600 border-green-200",
  "on-leave": "bg-amber-500/10 text-amber-600 border-amber-200",
  inactive: "bg-muted text-muted-foreground border-border",
};

const AgentManagementPage = () => {
  const totalListings = mockAgents.reduce((a, ag) => a + ag.activeListings, 0);
  const totalDeals = mockAgents.reduce((a, ag) => a + ag.closedDeals, 0);
  const activeAgents = mockAgents.filter(a => a.status === "active").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agent Management</h1>
            <p className="text-muted-foreground">Monitor your team's performance and assignments</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Agent</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Agent</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Agent name" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="agent@company.com" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Phone</Label><Input placeholder="+966" /></div>
                  <div className="space-y-2"><Label>Role</Label><Input placeholder="Senior Agent" /></div>
                </div>
                <Button className="w-full">Add Agent</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Agents", value: activeAgents, icon: <Users className="h-5 w-5 text-primary" /> },
            { label: "Total Listings", value: totalListings, icon: <Home className="h-5 w-5 text-green-500" /> },
            { label: "Closed Deals", value: totalDeals, icon: <TrendingUp className="h-5 w-5 text-amber-500" /> },
            { label: "Avg. Rating", value: (mockAgents.reduce((a, ag) => a + ag.rating, 0) / mockAgents.length).toFixed(1), icon: <Star className="h-5 w-5 text-yellow-500" /> },
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

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAgents.map(agent => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{agent.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{agent.name}</h3>
                      <Badge variant="outline" className={statusBadge[agent.status]}>{agent.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {agent.email}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {agent.phone}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center border-t pt-3">
                  <div>
                    <p className="text-lg font-bold">{agent.activeListings}</p>
                    <p className="text-xs text-muted-foreground">Listings</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{agent.closedDeals}</p>
                    <p className="text-xs text-muted-foreground">Deals</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold flex items-center justify-center gap-0.5"><Star className="h-3.5 w-3.5 text-yellow-500" /> {agent.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">{agent.totalRevenue}</span>
                  </div>
                  <Progress value={Math.min((agent.closedDeals / 70) * 100, 100)} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentManagementPage;

