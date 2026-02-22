"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Zap, Play, Square, Download, Trash2,
    Search, Filter, Activity, BarChart3
} from "lucide-react";
import { SignalStream } from "@/components/analytics/SignalStream";

const SignalDiagnosticsPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Signal Diagnostics</h1>
                        <p className="text-muted-foreground text-sm mt-1">Live, high-throughput diagnostic stream for server-side events</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" /> Export Session
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-2">
                            <Trash2 className="h-4 w-4" /> Clear Log
                        </Button>
                    </div>
                </div>

                {/* Live Stream Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Events / Sec", value: "840", icon: <Activity className="h-4 w-4" />, color: "text-primary" },
                        { label: "Successful", value: "99.9%", icon: <Zap className="h-4 w-4" />, color: "text-emerald-600" },
                        { label: "Avg Latency", value: "14ms", icon: <Activity className="h-4 w-4" />, color: "text-blue-600" },
                        { label: "Drops (MTD)", value: "0", icon: <Zap className="h-4 w-4" />, color: "text-muted-foreground" },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                    <p className={`text-xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <Card className="min-h-[600px] flex flex-col">
                            <CardHeader className="border-b border-border/40 py-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                        LIVE FEED
                                    </div>
                                    <Badge variant="outline" className="text-[8px] h-4 px-1.5 uppercase tracking-tighter">WS Connected</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                        <input
                                            placeholder="Search events..."
                                            className="h-8 pl-8 pr-4 text-[11px] bg-muted/50 border-none rounded-md w-[200px] focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Square className="h-4 w-4" /></Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-hidden">
                                <SignalStream />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Source Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: "Web (First-Party)", value: "85%", color: "bg-primary" },
                                    { name: "Server Requests", value: "12%", color: "bg-blue-500" },
                                    { name: "Offline Exports", value: "3%", color: "bg-muted-foreground" },
                                ].map(s => (
                                    <div key={s.name} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px] font-bold">
                                            <span>{s.name}</span>
                                            <span>{s.value}</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${s.color}`} style={{ width: s.value }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Webhooks</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { name: "Meta CAPI Gateway", status: "Active" },
                                    { name: "TikTok Events API", status: "Active" },
                                    { name: "Google Measurement Protocol", status: "Active" },
                                    { name: "Snapchat Conversions", status: "Inactive" },
                                ].map(w => (
                                    <div key={w.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors">
                                        <span className="text-[10px] font-medium">{w.name}</span>
                                        <Badge variant="secondary" className={`text-[8px] h-4 px-1 ${w.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                                            {w.status}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-500/5 border-amber-500/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xs font-black flex items-center gap-2 text-amber-600">
                                    <Zap className="h-4 w-4" /> LOW ACCURACY DETECTED
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    34% of events are missing User Agent data. This may affect attribution in Safari-based browsers. Consider enabling Advanced Enrichment.
                                </p>
                                <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-[10px] border-amber-500/30 text-amber-700 hover:bg-amber-500/10">
                                    Enable Advanced Enrichment
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SignalDiagnosticsPage;
