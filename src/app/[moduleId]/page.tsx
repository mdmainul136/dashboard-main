"use client";

import { useBusinessPurpose } from "@/context/BusinessPurposeContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { purposeConfigs } from "@/data/businessPurposeModules";
import { allModules } from "@/data/regionModules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Layout, Search, Settings, ShieldCheck, BarChart3 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

export default function ModulePage() {
    const params = useParams();
    const router = useRouter();
    const { t, isRTL } = useLanguage();
    const { businessPurpose } = useBusinessPurpose();

    const moduleId = params.moduleId as string;

    // Find the module definition
    const moduleDef = allModules.find(m => m.id === moduleId) ||
        purposeConfigs[businessPurpose || "ecommerce"]?.coreModules.find(m => m.id === moduleId);

    if (!moduleDef) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <Search className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Module Not Found</h1>
                    <p className="text-muted-foreground max-w-md">We couldn't find the module you're looking for. It may not be available for your current business purpose.</p>
                    <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <button onClick={() => router.push("/")} className="hover:text-primary transition-colors">Dashboard</button>
                            <ArrowRight className="h-3 w-3" />
                            <span className="text-foreground font-medium">{moduleDef.name}</span>
                        </div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary text-2xl">
                                {moduleDef.icon}
                            </span>
                            {moduleDef.name}
                        </h1>
                        <p className="text-muted-foreground">{moduleDef.category}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" /> Config
                        </Button>
                        <Button className="gap-2 shadow-lg shadow-primary/25">
                            <ShieldCheck className="h-4 w-4" /> Activate Module
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {moduleDef.features.map((feature, idx) => (
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card
                                className="group cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                                onClick={() => router.push(`/${moduleId}/${feature.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)}
                            >
                                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">
                                        {feature}
                                    </CardTitle>
                                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Manage your {feature.toLowerCase()} activities, settings and real-time reports.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">Ready</Badge>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">Synced</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Module Stats Placeholder */}
                <Card className="border-border/60 bg-gradient-to-br from-card to-muted/20 border-2 border-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold uppercase tracking-tight">Module Health & Analytics</CardTitle>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Real-time</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {[
                                { label: "Active Nodes", value: "24/24", sub: "All systems operational", color: "text-emerald-500" },
                                { label: "Sync Latency", value: "1.2s", sub: "Global region standard", color: "text-blue-500" },
                                { label: "Daily Volume", value: "4.8k", sub: "+12% vs last week", color: "text-primary" }
                            ].map((stat) => (
                                <div key={stat.label} className="p-4 rounded-xl bg-muted/30 border border-border/40">
                                    <p className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stat.sub}</p>
                                </div>
                            ))}
                        </div>
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-border/40 rounded-2xl bg-muted/10">
                            <div className="text-center space-y-3">
                                <BarChart3 className="h-10 w-10 mx-auto text-primary opacity-20" />
                                <p className="text-sm font-bold text-muted-foreground max-w-xs mx-auto">
                                    Advanced insights for {moduleDef.name} are being aggregated. Trends will appear here once data threshold is reached.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
