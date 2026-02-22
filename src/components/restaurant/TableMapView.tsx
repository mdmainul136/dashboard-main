"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Calendar,
    Plus,
    LayoutGrid,
    Search,
    Map,
    Clock
} from "lucide-react";

const tables = [
    { id: "T-01", seats: 2, status: "occupied", customer: "John D.", time: "45m" },
    { id: "T-02", seats: 4, status: "available" },
    { id: "T-03", seats: 4, status: "reserved", customer: "Sarah L.", time: "19:30" },
    { id: "T-04", seats: 6, status: "occupied", customer: "The Smiths", time: "1h 10m" },
    { id: "T-05", seats: 2, status: "available" },
    { id: "T-06", seats: 2, status: "occupied", customer: "Mike R.", time: "12m" },
    { id: "T-07", seats: 4, status: "available" },
    { id: "T-08", seats: 8, status: "reserved", customer: "Company Event", time: "20:00" },
    { id: "T-09", seats: 2, status: "available" },
    { id: "T-10", seats: 4, status: "occupied", customer: "Chloe W.", time: "30m" },
    { id: "T-11", seats: 4, status: "available" },
    { id: "T-12", seats: 2, status: "available" },
];

export function TableMapView() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border/60">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Available (6)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Occupied (4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reserved (2)</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 h-9 text-[10px] uppercase font-bold tracking-widest">
                        <Calendar className="h-3.5 w-3.5" /> Bookings
                    </Button>
                    <Button size="sm" className="gap-2 h-9 text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-primary/20">
                        <Plus className="h-3.5 w-3.5" /> New Table
                    </Button>
                </div>
            </div>

            <Card className="border-border/60 bg-muted/10 p-4 sm:p-12 min-h-[500px] flex items-center justify-center relative overflow-hidden rounded-2xl">
                <div className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground/30 select-none">
                    <Map className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Main Dining Hall Floorplan</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-10 w-full max-w-6xl py-10">
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className={`aspect-square rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer relative group ${table.status === 'available' ? 'bg-background border-emerald-500/10 hover:border-emerald-500 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10' :
                                    table.status === 'occupied' ? 'bg-amber-500/5 border-amber-500/40 hover:border-amber-500 shadow-sm shadow-amber-500/5 hover:scale-105' :
                                        'bg-blue-500/5 border-blue-500/40 hover:border-blue-500 shadow-sm shadow-blue-500/5 hover:scale-105'
                                }`}
                        >
                            <span className="text-sm font-black italic text-foreground/80">{table.id}</span>
                            <div className="flex items-center gap-1.5 opacity-60">
                                <Users className="h-3 w-3" />
                                <span className="text-[10px] font-bold">{table.seats}</span>
                            </div>

                            {table.customer && (
                                <div className="absolute inset-0 bg-background/95 rounded-[1.4rem] flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20">
                                    <Badge variant="outline" className="text-[8px] font-black uppercase px-1.5 mb-1.5 border-primary/30 text-primary">
                                        {table.status}
                                    </Badge>
                                    <p className="text-[11px] font-black uppercase leading-none mb-1">{table.customer}</p>
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                                        <Clock className="h-2.5 w-2.5" />
                                        <span>{table.time}</span>
                                    </div>
                                    <Button size="sm" className="h-7 text-[8px] font-black uppercase px-2 mt-3 w-full bg-primary/10 text-primary hover:bg-primary hover:text-white border-0">Open Bill</Button>
                                </div>
                            )}

                            {/* Visual table legs decor */}
                            <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-inherit rounded-tl-lg opacity-20" />
                            <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-inherit rounded-tr-lg opacity-20" />
                            <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-inherit rounded-bl-lg opacity-20" />
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-inherit rounded-br-lg opacity-20" />
                        </div>
                    ))}
                </div>

                {/* Background Decor */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mb-32 pointer-events-none" />
            </Card>
        </div>
    );
}
