"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    Server,
    Zap,
    Play,
    RefreshCcw,
    ExternalLink,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import type { TrackingContainer } from "@/hooks/useServerTracking";

interface TrackingContainerCardProps {
    container: TrackingContainer;
    onDeploy: (id: string) => void;
}

export function TrackingContainerCard({ container, onDeploy }: TrackingContainerCardProps) {
    const isRunning = container.status === "running";
    const statusColor = isRunning ? "text-emerald-500" : "text-amber-500";

    return (
        <Card className="overflow-hidden border-sidebar-border/50 hover:border-sidebar-primary/30 transition-all group">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center border ${isRunning ? "border-emerald-100" : "border-amber-100"}`}>
                            <Server className={`h-5 w-5 ${statusColor}`} />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                {container.name}
                                <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" : ""}>
                                    {container.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription className="text-[10px] font-mono mt-0.5">
                                {container.container_id}
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Domain Endpoint</p>
                        <p className="text-xs font-bold truncate text-sidebar-primary">{container.domain}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Avg Latency</p>
                        <p className="text-xs font-bold">42ms</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Zap className="h-3 w-3 text-amber-500" /> Event Throughput
                        </span>
                        <span>82% capacity</span>
                    </div>
                    <Progress value={82} className="h-1.5" />
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <Button
                        size="sm"
                        variant={isRunning ? "outline" : "default"}
                        className="flex-1 h-8 text-[10px] font-bold gap-2"
                        onClick={() => onDeploy(container.id)}
                    >
                        {isRunning ? <RefreshCcw className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        {isRunning ? "Redeploy" : "Provision"}
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1 h-8 text-[10px] font-bold gap-2">
                        <Activity className="h-3 w-3" /> Logs
                    </Button>
                </div>

                <div className="pt-2 flex items-center gap-4 border-t border-muted pt-4">
                    <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-[10px] font-black">GDPR</span>
                    </div>
                    <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-[10px] font-black">CAPI</span>
                    </div>
                    <div className="ml-auto">
                        <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/30 hover:text-amber-500 cursor-pointer" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
