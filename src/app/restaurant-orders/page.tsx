"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Clock, CheckCircle2, XCircle, ChefHat, Bike, Eye } from "lucide-react";
import { useState } from "react";

type OrderStatus = "new" | "preparing" | "ready" | "served" | "cancelled";

interface RestaurantOrder {
  id: string;
  table: string;
  type: "dine-in" | "takeaway" | "delivery";
  items: { name: string; qty: number; notes?: string }[];
  status: OrderStatus;
  time: string;
  total: number;
  waiter?: string;
}

const mockOrders: RestaurantOrder[] = [
  { id: "ORD-401", table: "T-05", type: "dine-in", items: [{ name: "Grilled Chicken", qty: 2 }, { name: "Caesar Salad", qty: 1, notes: "No croutons" }], status: "new", time: "2 min ago", total: 85, waiter: "Ahmed" },
  { id: "ORD-400", table: "T-12", type: "dine-in", items: [{ name: "Lamb Kabsa", qty: 3 }, { name: "Hummus", qty: 2 }], status: "preparing", time: "8 min ago", total: 145, waiter: "Sara" },
  { id: "ORD-399", table: "-", type: "takeaway", items: [{ name: "Shawarma Wrap", qty: 4 }], status: "ready", time: "15 min ago", total: 60 },
  { id: "ORD-398", table: "T-03", type: "dine-in", items: [{ name: "Mixed Grill", qty: 1 }, { name: "Arabic Coffee", qty: 2 }], status: "served", time: "25 min ago", total: 110, waiter: "Ahmed" },
  { id: "ORD-397", table: "-", type: "delivery", items: [{ name: "Burger Meal", qty: 2 }, { name: "Fries", qty: 2 }], status: "preparing", time: "12 min ago", total: 72 },
  { id: "ORD-396", table: "T-08", type: "dine-in", items: [{ name: "Fish & Chips", qty: 1 }], status: "cancelled", time: "30 min ago", total: 45, waiter: "Sara" },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: "New", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  preparing: { label: "Preparing", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: <ChefHat className="h-3.5 w-3.5" /> },
  ready: { label: "Ready", color: "bg-green-500/10 text-green-600 border-green-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  served: { label: "Served", color: "bg-muted text-muted-foreground border-border", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20", icon: <XCircle className="h-3.5 w-3.5" /> },
};

const typeIcons: Record<string, React.ReactNode> = {
  "dine-in": <ClipboardList className="h-4 w-4" />,
  takeaway: <ClipboardList className="h-4 w-4" />,
  delivery: <Bike className="h-4 w-4" />,
};

const RestaurantOrdersPage = () => {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? mockOrders : mockOrders.filter(o => o.status === tab);
  const counts = {
    all: mockOrders.length,
    new: mockOrders.filter(o => o.status === "new").length,
    preparing: mockOrders.filter(o => o.status === "preparing").length,
    ready: mockOrders.filter(o => o.status === "ready").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground">Track and manage all incoming orders</p>
          </div>
          <Select defaultValue="today">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "New Orders", value: counts.new, icon: <ClipboardList className="h-5 w-5 text-blue-500" /> },
            { label: "Preparing", value: counts.preparing, icon: <ChefHat className="h-5 w-5 text-amber-500" /> },
            { label: "Ready to Serve", value: counts.ready, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
            { label: "Avg. Wait Time", value: "12 min", icon: <Clock className="h-5 w-5 text-primary" /> },
          ].map((s) => (
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

        {/* Orders Table */}
        <Card>
          <CardHeader className="pb-3">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                <TabsTrigger value="new">New ({counts.new})</TabsTrigger>
                <TabsTrigger value="preparing">Preparing ({counts.preparing})</TabsTrigger>
                <TabsTrigger value="ready">Ready ({counts.ready})</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => {
                  const sc = statusConfig[order.status];
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 capitalize">
                          {typeIcons[order.type]} {order.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.table}</TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-sm">
                              {item.qty}Ã— {item.name}
                              {item.notes && <span className="text-xs text-muted-foreground ml-1">({item.notes})</span>}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 ${sc.color}`}>
                          {sc.icon} {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{order.time}</TableCell>
                      <TableCell className="text-right font-semibold">{order.total} SAR</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
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

export default RestaurantOrdersPage;

