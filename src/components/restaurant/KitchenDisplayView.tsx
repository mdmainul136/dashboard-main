"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    CheckCircle2,
    ChefHat,
    Flame,
    Timer,
    AlertCircle,
    UtensilsCrossed
} from "lucide-react";

// Mock orders for KDS
const kdsOrders = [
    { id: "#TBL-12", type: "Dine-in", items: ["Norwegian Salmon", "Caesar Salad", "Glass of Red Wine"], time: "14m", status: "preparing", importance: "late" },
    { id: "#WEB-991", type: "Takeaway", items: ["Truffle Risotto", "Margherita Pizza"], time: "8m", status: "preparing", importance: "normal" },
    { id: "#TBL-05", type: "Dine-in", items: ["Wagyu Burger", "French Fries", "Coke"], time: "3m", status: "preparing", importance: "normal" },
    { id: "#WEB-992", type: "Delivery", items: ["Chocolate Cake x2"], time: "22m", status: "ready", importance: "normal" },
];

export function KitchenDisplayView() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <UtensilsCrossed className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Active Orders</p>
                            <p className="text-xl font-black">12</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5 border-amber-500/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <Timer className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Avg. Prep Time</p>
                            <p className="text-xl font-black">18m</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-rose-500/5 border-rose-500/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                            <Flame className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Overdue</p>
                            <p className="text-xl font-black">2</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Ready</p>
                            <p className="text-xl font-black">4</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kdsOrders.map((order) => (
                    <Card key={order.id} className={`border-border/60 overflow-hidden flex flex-col transition-all duration-300 ${order.importance === 'late' ? 'ring-1 ring-rose-500 shadow-lg shadow-rose-500/10 translate-y-[-4px]' : ''}`}>
                        <div className={`px-4 py-2 flex justify-between items-center ${order.status === 'ready' ? 'bg-emerald-500 text-white' :
                                order.importance === 'late' ? 'bg-rose-500 text-white' : 'bg-muted/50 border-b border-border/60'
                            }`}>
                            <span className="text-xs font-black italic">{order.id}</span>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase">{order.time}</span>
                            </div>
                        </div>
                        <CardContent className="p-4 flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-tighter ${order.importance === 'late' ? 'border-rose-200 text-rose-600 bg-rose-50' : ''
                                    }`}>
                                    {order.type}
                                </Badge>
                                {order.importance === 'late' && (
                                    <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                                )}
                            </div>
                            <ul className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <div className="h-4 w-4 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold mt-0.5 shrink-0">1</div>
                                        <span className="text-sm font-medium leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <div className="p-2 bg-muted/20 border-t border-border/60">
                            <Button className={`w-full font-bold uppercase text-[10px] tracking-widest h-9 ${order.status === 'ready' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary'
                                }`}>
                                {order.status === 'ready' ? 'Complete Order' : 'Mark as Ready'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
