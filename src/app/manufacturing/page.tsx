"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hammer, Settings, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ManufacturingPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 text-2xl">
                                🏗️
                            </span>
                            Manufacturing & BOM
                        </h1>
                        <p className="text-muted-foreground">Production management and bill of materials</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" /> Config
                        </Button>
                        <Button className="gap-2 shadow-lg shadow-orange-500/25 bg-orange-500 hover:bg-orange-600">
                            <Hammer className="h-4 w-4" /> New Work Order
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        "Bill of Materials",
                        "Production Planning",
                        "Work Orders",
                        "Resource Management",
                        "Quality Control",
                        "Manufacturing ERP"
                    ].map((feature, idx) => (
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="group cursor-pointer border-border/60 hover:border-orange-500/40 hover:shadow-md transition-all duration-300">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-base font-bold group-hover:text-orange-500 transition-colors">
                                        {feature}
                                    </CardTitle>
                                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Manage your {feature.toLowerCase()} activities and real-time reports.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">Active</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Card className="border-border/60 bg-gradient-to-br from-card to-orange-500/5 border-2 border-orange-500/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold uppercase tracking-tight text-orange-600">Factory Floor Insights</CardTitle>
                        <Badge variant="outline" className="bg-orange-500/5 text-orange-500 border-orange-500/20">Operational</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {[
                                { label: "Production Yield", value: "98.2%", sub: "Above target", color: "text-emerald-500" },
                                { label: "Idle Capacity", value: "4h", sub: "Maintenance scheduled", color: "text-amber-500" },
                                { label: "Open Orders", value: "12", sub: "8 in progress", color: "text-orange-500" }
                            ].map((stat) => (
                                <div key={stat.label} className="p-4 rounded-xl bg-background/50 border border-border/40">
                                    <p className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stat.sub}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
