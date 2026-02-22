"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Activity, Server, Shield, Zap, ArrowUpRight,
    BarChart3, Globe, ShieldCheck, Filter
} from "lucide-react";
import Link from "next/link";

const TrackingOverviewPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tracking Module</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage sGTM infrastructure, signals, and compliance at the edge</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" /> Filter Views
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Zap className="h-4 w-4" /> Live Diagnostics
                        </Button>
                    </div>
                </div>

                {/* Global Fleet Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Active Containers", value: "3", icon: <Server className="h-5 w-5" />, color: "text-blue-600", bg: "bg-blue-500/10", trend: "Stable" },
                        { label: "Global Throughput", value: "2.4k req/s", icon: <Activity className="h-5 w-5" />, color: "text-emerald-600", bg: "bg-emerald-500/10", trend: "+12%" },
                        { label: "Compliance Score", value: "99.8%", icon: <ShieldCheck className="h-5 w-5" />, color: "text-primary", bg: "bg-primary/10", trend: "Optimal" },
                        { label: "Signal Health", value: "94.2%", icon: <Zap className="h-5 w-5" />, color: "text-amber-600", bg: "bg-amber-500/10", trend: "Alert" },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{stat.trend}</Badge>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <Link href="/tracking/containers">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Server className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Container Management</CardTitle>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Provision and monitor Docker-based sGTM nodes. View CPU/RAM vitals, deployment logs, and container status.
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="secondary">3 Running</Badge>
                                    <Badge variant="secondary">Auto-scaling On</Badge>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <Link href="/tracking/signals">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-amber-500" />
                                        <CardTitle className="text-lg">Signal Diagnostics</CardTitle>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Live event stream debugger. Inspect CAPI, GA4, and TikTok payloads as they hit your edge containers in real-time.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-success capitalize">
                                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                    Live stream active
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <Link href="/tracking/compliance">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                        <CardTitle className="text-lg">Compliance & Privacy</CardTitle>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Configure GDPR/CCPA consent gateways and PII redaction rules. Mask sensitive data before it reaches third-party vendors.
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="secondary">GPC Enabled</Badge>
                                    <Badge variant="secondary">IP Masking Active</Badge>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <Link href="/tracking/attribution">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-violet-600" />
                                        <CardTitle className="text-lg">Attribution & Enrichment</CardTitle>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 transition-colors" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Manage cross-channel attribution models and event enrichment rules. Increase signal accuracy with first-party data.
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="secondary">DDA Model</Badge>
                                    <Badge variant="secondary">Geo-Enrichment</Badge>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TrackingOverviewPage;
