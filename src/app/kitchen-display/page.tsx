"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, CheckCircle2, AlertTriangle, ArrowRight, Bell } from "lucide-react";
import { useState } from "react";

type KDSStatus = "queued" | "cooking" | "ready";

interface KDSOrder {
  id: string;
  table: string;
  type: "dine-in" | "takeaway" | "delivery";
  items: { name: string; qty: number; notes?: string; done: boolean }[];
  status: KDSStatus;
  elapsedMin: number;
  priority: boolean;
}

const initialOrders: KDSOrder[] = [
  { id: "ORD-401", table: "T-05", type: "dine-in", items: [{ name: "Grilled Chicken", qty: 2, done: false }, { name: "Caesar Salad", qty: 1, notes: "No croutons", done: true }], status: "cooking", elapsedMin: 4, priority: false },
  { id: "ORD-400", table: "T-12", type: "dine-in", items: [{ name: "Lamb Kabsa", qty: 3, done: false }, { name: "Hummus", qty: 2, done: true }], status: "cooking", elapsedMin: 10, priority: true },
  { id: "ORD-397", table: "-", type: "delivery", items: [{ name: "Burger Meal", qty: 2, done: false }, { name: "Fries", qty: 2, done: false }], status: "queued", elapsedMin: 2, priority: false },
  { id: "ORD-405", table: "T-02", type: "dine-in", items: [{ name: "Pasta Alfredo", qty: 1, done: true }, { name: "Garlic Bread", qty: 1, done: true }], status: "ready", elapsedMin: 18, priority: false },
  { id: "ORD-406", table: "-", type: "takeaway", items: [{ name: "Shawarma Wrap", qty: 3, done: false }], status: "queued", elapsedMin: 1, priority: false },
  { id: "ORD-407", table: "T-08", type: "dine-in", items: [{ name: "Steak Medium", qty: 1, notes: "Medium rare", done: false }, { name: "Mushroom Soup", qty: 1, done: true }], status: "cooking", elapsedMin: 7, priority: false },
];

const statusConfig: Record<KDSStatus, { label: string; headerColor: string }> = {
  queued: { label: "ðŸ”µ Queued", headerColor: "bg-blue-500" },
  cooking: { label: "ðŸŸ  Cooking", headerColor: "bg-amber-500" },
  ready: { label: "ðŸŸ¢ Ready", headerColor: "bg-green-500" },
};

const KitchenDisplayPage = () => {
  const [orders, setOrders] = useState(initialOrders);

  const grouped: Record<KDSStatus, KDSOrder[]> = { queued: [], cooking: [], ready: [] };
  orders.forEach(o => grouped[o.status].push(o));

  const advanceOrder = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next: Record<KDSStatus, KDSStatus | null> = { queued: "cooking", cooking: "ready", ready: null };
      const nextStatus = next[o.status];
      if (!nextStatus) return o;
      return { ...o, status: nextStatus };
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-primary" /> Kitchen Display System
            </h1>
            <p className="text-muted-foreground">Real-time order tracking for the kitchen</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span>{orders.filter(o => o.status !== "ready").length} active orders</span>
          </div>
        </div>

        {/* KDS Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["queued", "cooking", "ready"] as KDSStatus[]).map(status => (
            <div key={status} className="space-y-3">
              <div className={`rounded-lg px-4 py-2 text-white font-semibold text-center ${statusConfig[status].headerColor}`}>
                {statusConfig[status].label} ({grouped[status].length})
              </div>
              <div className="space-y-3">
                {grouped[status].map(order => (
                  <Card key={order.id} className={`transition-all ${order.priority ? "ring-2 ring-amber-400 shadow-amber-100" : ""} ${order.elapsedMin > 15 && order.status !== "ready" ? "ring-2 ring-destructive/50" : ""}`}>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{order.id}</CardTitle>
                          {order.priority && <Badge className="bg-amber-500 text-white text-xs">RUSH</Badge>}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span className={order.elapsedMin > 15 && order.status !== "ready" ? "text-destructive font-semibold" : ""}>
                            {order.elapsedMin}m
                          </span>
                          {order.elapsedMin > 15 && order.status !== "ready" && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="capitalize text-xs">{order.type}</Badge>
                        {order.table !== "-" && <span>{order.table}</span>}
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <ul className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <li key={i} className={`flex items-center gap-2 text-sm ${item.done ? "line-through text-muted-foreground" : ""}`}>
                            {item.done ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />}
                            <span>{item.qty}Ã— {item.name}</span>
                            {item.notes && <span className="text-xs text-amber-600">({item.notes})</span>}
                          </li>
                        ))}
                      </ul>
                      {order.status !== "ready" ? (
                        <Button size="sm" className="w-full gap-1" onClick={() => advanceOrder(order.id)}>
                          {order.status === "queued" ? "Start Cooking" : "Mark Ready"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full text-green-600 border-green-200" disabled>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Served
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {grouped[status].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">No orders</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KitchenDisplayPage;

