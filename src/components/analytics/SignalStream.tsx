"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Activity,
    ChevronRight,
    Share2,
    CheckCircle2,
    AlertCircle,
    Database,
    Globe
} from "lucide-react";

interface Signal {
    id: string;
    type: "CAPI" | "GA4" | "TIKTOK" | "WEBHOOK";
    event: string;
    source: string;
    status: "success" | "pending" | "failed";
    timestamp: string;
    payload: any;
}

export function SignalStream() {
    const [signals, setSignals] = useState<Signal[]>([]);

    // Mock incoming signals effect
    useEffect(() => {
        const eventNames = ["Purchase", "AddToCart", "PageView", "Lead", "Search"];
        const types: Signal["type"][] = ["CAPI", "GA4", "TIKTOK", "WEBHOOK"];

        const interval = setInterval(() => {
            const newSignal: Signal = {
                id: Math.random().toString(36).substr(2, 9),
                type: types[Math.floor(Math.random() * types.length)],
                event: eventNames[Math.floor(Math.random() * eventNames.length)],
                source: "Server-Side Gateway",
                status: Math.random() > 0.1 ? "success" : "failed",
                timestamp: new Date().toLocaleTimeString(),
                payload: { value: (Math.random() * 100).toFixed(2), currency: "USD" }
            };

            setSignals(prev => [newSignal, ...prev].slice(0, 50));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="border-sidebar-border/50">
            <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-sidebar-primary" /> Signal Diagnostics
                        </CardTitle>
                        <CardDescription className="text-[10px]">
                            Live server-side event stream and attribution mapping
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="h-5 px-1.5 gap-1 text-[10px] font-bold">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Listening
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                    <div className="divide-y divide-sidebar-border/30">
                        {signals.length === 0 && (
                            <div className="p-10 text-center space-y-2 opacity-40">
                                <Share2 className="h-8 w-8 mx-auto" />
                                <p className="text-xs font-bold uppercase tracking-widest">Awaiting Signals...</p>
                            </div>
                        )}
                        {signals.map((signal) => (
                            <div key={signal.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${signal.status === "success" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                                        }`}>
                                        {signal.type === "CAPI" ? <Database className="h-4 w-4 text-blue-500" /> : <Globe className="h-4 w-4 text-sidebar-primary" />}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black tracking-tight">{signal.event}</span>
                                            <Badge variant="outline" className="h-4 px-1 text-[8px] font-black uppercase">
                                                {signal.type}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                            {signal.source} <ChevronRight className="h-3 w-3" /> {signal.timestamp}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {signal.status === "success" ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-sidebar-primary transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
