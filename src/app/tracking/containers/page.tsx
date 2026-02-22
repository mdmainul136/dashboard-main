"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Server, Plus, Cpu, HardDrive, Network,
    RotateCw, Play, Square, ExternalLink, Settings2
} from "lucide-react";
import { useServerTracking } from "@/hooks/useServerTracking";
import { TrackingContainerCard } from "@/components/analytics/TrackingContainerCard";

const ContainerManagementPage = () => {
    const { containers, fetchContainers, deployContainer } = useServerTracking();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Container Management</h1>
                        <p className="text-muted-foreground text-sm mt-1">Provision and monitor sGTM Docker nodes across your fleet</p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Provision New Node
                    </Button>
                </div>

                {/* Fleet Health Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Cpu className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-muted-foreground">Aggregated CPU</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress value={24} className="h-1.5 flex-1" />
                                    <span className="text-[10px] font-bold">24%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
                                <HardDrive className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-muted-foreground">Aggregated RAM</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress value={42} className="h-1.5 flex-1" />
                                    <span className="text-[10px] font-bold">42%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <Network className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-muted-foreground">Network Latency (Avg)</p>
                                <p className="text-lg font-bold mt-0.5">14ms</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                            <Server className="h-4 w-4" /> Active Nodes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {containers.length > 0 ? (
                                containers.map(c => (
                                    <TrackingContainerCard key={c.id} container={c} onDeploy={deployContainer} />
                                ))
                            ) : (
                                <TrackingContainerCard
                                    container={{
                                        id: "primary-node",
                                        container_id: "GTM-P8494FX",
                                        name: "Primary Production Node",
                                        domain: "tracking.zosair.com",
                                        status: "running",
                                        created_at: new Date().toISOString()
                                    }}
                                    onDeploy={() => { }}
                                />
                            )}
                            {/* Secondary Node Mock */}
                            <TrackingContainerCard
                                container={{
                                    id: "failover-node",
                                    container_id: "GTM-L7293QZ",
                                    name: "Failover Edge Node",
                                    domain: "edge.zosair.com",
                                    status: "running",
                                    created_at: new Date().toISOString()
                                }}
                                onDeploy={() => { }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Provisioning Logs</CardTitle>
                                <CardDescription className="text-[10px]">Recent infrastructure events</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { time: "10:24 AM", event: "Node GTM-L7293QZ auto-scaled", status: "info" },
                                    { time: "09:12 AM", event: "SSL Certificate renewed for edge.zosair.com", status: "success" },
                                    { time: "08:45 AM", event: "Container image updated to v2.4.1", status: "info" },
                                    { time: "Yesterday", event: "High CPU detected on Primary Node", status: "warning" },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-3 text-[10px] leading-relaxed border-b border-border/40 pb-2 last:border-0 last:pb-0">
                                        <span className="text-muted-foreground whitespace-nowrap">{log.time}</span>
                                        <span className="font-medium">{log.event}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Settings2 className="h-4 w-4 text-primary" /> Global Infrastructure
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-muted-foreground">Default Region</span>
                                    <span className="font-bold">ME-SOUTH-1</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-muted-foreground">Replication</span>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-muted-foreground">Auto-Provisioning</span>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none">Enabled</Badge>
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-2 text-[10px] h-8">
                                    Configure Global Routing
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ContainerManagementPage;
