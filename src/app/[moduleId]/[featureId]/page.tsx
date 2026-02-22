"use client";

import { useBusinessPurpose } from "@/context/BusinessPurposeContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { purposeConfigs } from "@/data/businessPurposeModules";
import { allModules } from "@/data/regionModules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, ArrowRight, Layout, Search, Settings, ShieldCheck,
    Share2, Download, Filter, Calendar, Rocket, BarChart3, PieChart,
    List, Columns, Grid3x3, PlusCircle, CheckCircle2, Clock, AlertCircle, Plus
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import { IORForeignOrdersView } from "@/components/ior/IORForeignOrders";
import { CustomsComplianceView } from "@/components/ior/CustomsCompliance";

// --- Mock Templates ---

const TableView = ({ title }: { title: string }) => (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-bold border-b border-border/60">
                    <tr>
                        <th className="px-6 py-4">Name/ID</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date Created</th>
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors group">
                            <td className="px-6 py-4 font-medium flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px]">#00{i}</div>
                                <span>{title} Item {i}</span>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                                    {i % 2 === 0 ? "Active" : "Pending"}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">Feb {10 + i}, 2026</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                    {i === 1 ? 'High' : 'Normal'}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm">Details</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing 5 of 124 records</span>
            <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0">1</Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">2</Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">3</Button>
            </div>
        </div>
    </div>
);

const ChartView = ({ title }: { title: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] flex items-end gap-2 pb-2">
                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1 }}
                            className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group"
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h}%</div>
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </CardContent>
        </Card>
        <Card className="border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6">
                <div className="relative h-40 w-40 flex items-center justify-center">
                    <PieChart className="h-24 w-24 text-muted-foreground opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl font-bold">84%</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Target</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

const KanbanView = ({ title }: { title: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: "To Do", count: 8, color: "bg-blue-500", icon: <Clock className="h-4 w-4" /> },
            { label: "In Progress", count: 3, color: "bg-amber-500", icon: <AlertCircle className="h-4 w-4" /> },
            { label: "Done", count: 12, color: "bg-emerald-500", icon: <CheckCircle2 className="h-4 w-4" /> }
        ].map((col) => (
            <div key={col.label} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${col.color}`} />
                        <span className="text-sm font-bold">{col.label}</span>
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{col.count}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><PlusCircle className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <Card key={i} className="border-border/60 hover:shadow-sm transition-shadow cursor-grab">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-xs font-bold">{title} Task #{i * 100}</h4>
                                    <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-muted-foreground">{col.icon}</div>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Detailed description of the {title.toLowerCase()} requirement goes here.</p>
                                <div className="flex items-center justify-between text-[10px]">
                                    <div className="flex -space-x-2">
                                        <div className="h-5 w-5 rounded-full border border-background bg-primary/20" />
                                        <div className="h-5 w-5 rounded-full border border-background bg-muted" />
                                    </div>
                                    <span className="text-muted-foreground">Due 2d</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const GridView = ({ title }: { title: string }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/60 group cursor-pointer hover:border-primary/40 transition-all overflow-hidden">
                <div className="h-32 bg-muted/30 flex items-center justify-center border-b border-border/60 group-hover:bg-primary/5 transition-colors">
                    <Layout className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary/20 transition-colors" />
                </div>
                <CardContent className="p-4">
                    <h4 className="text-sm font-bold mb-2 uppercase tracking-wide group-hover:text-primary transition-colors">{title} Item {i}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">Overview of the selected {title.toLowerCase()} asset, including status and key properties.</p>
                    <div className="mt-4 flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Verified</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

// --- Main Component ---

export default function FeaturePage() {
    const params = useParams();
    const router = useRouter();
    const { t, isRTL } = useLanguage();
    const { businessPurpose } = useBusinessPurpose();

    const moduleId = params.moduleId as string;
    const featureId = params.featureId as string;

    // Find the module definition
    const purposeKey = (businessPurpose || "ecommerce") as string;
    const moduleDef = allModules.find(m => m.id === moduleId) ||
        (purposeConfigs as Record<string, typeof purposeConfigs[keyof typeof purposeConfigs]>)[purposeKey]?.coreModules.find(m => m.id === moduleId);

    // Find the readable feature name
    const featureName = moduleDef?.features.find((f: string) =>
        f.toLowerCase().replace(/[^a-z0-9]/g, '-') === featureId
    ) || featureId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    if (!moduleDef) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <Search className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Feature Not Found</h1>
                    <p className="text-muted-foreground max-w-md">The feature you are looking for is not available in your current subscription.</p>
                    <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const renderContent = () => {
        // Vertical-specific overrides
        if (businessPurpose === "cross-border-ior") {
            if (moduleId === "ior-customs") return <CustomsComplianceView />;
            if (moduleId === "ior-foreign-sourcing" || moduleId === "ior-logistics") return <IORForeignOrdersView />;
        }

        const viewType = moduleDef.viewType || "generic";

        switch (viewType) {
            case "table": return <TableView title={featureName} />;
            case "chart": return <ChartView title={featureName} />;
            case "kanban": return <KanbanView title={featureName} />;
            case "grid": return <GridView title={featureName} />;
            default:
                return (
                    <Card className="border-border/60 overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Management Portal</CardTitle>
                        </CardHeader>
                        <CardContent className="p-12 flex items-center justify-center text-center">
                            <div className="max-w-sm space-y-4">
                                <div className="h-20 w-20 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/20 mx-auto">
                                    <Layout className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold">{featureName}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    The management interface for {featureName} is currently being synchronized with your business data.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 mb-1" />
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Connection Stable</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 mb-1" />
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Auth Synced</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1 text-[10px] sm:text-xs">
                            <button onClick={() => router.push("/")} className="hover:text-primary transition-colors uppercase font-bold tracking-wider">Dashboard</button>
                            <ArrowRight className="h-3 w-3" />
                            <button onClick={() => router.push(`/${moduleId}`)} className="hover:text-primary transition-colors uppercase font-bold tracking-wider">{moduleDef.name}</button>
                            <ArrowRight className="h-3 w-3" />
                            <span className="text-foreground font-bold uppercase tracking-wider">{featureName}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {featureName}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-9 font-bold">
                            <Share2 className="h-4 w-4" /> Share
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 h-9 font-bold">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                        <Button className="gap-2 h-9 bg-primary shadow-lg shadow-primary/20 font-bold">
                            <PlusCircle className="h-4 w-4" /> Create New
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/60">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" className="gap-2 h-9 font-bold px-4">
                            <Calendar className="h-4 w-4" /> Last 30 Days
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 h-9 font-bold px-4">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder={`Search ${featureName}...`}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/30 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${moduleId}-${featureId}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="xl:col-span-3 space-y-6">
                        <Card className="border-border/60 bg-gradient-to-br from-card to-muted/20">
                            <CardHeader>
                                <CardTitle className="text-base font-bold">Recommended</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h5 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Resources</h5>
                                    <ul className="space-y-2">
                                        <li className="text-xs font-semibold hover:text-primary cursor-pointer flex items-center justify-between">
                                            Setup Guide <ArrowRight className="h-3 w-3" />
                                        </li>
                                        <li className="text-xs font-semibold hover:text-primary cursor-pointer flex items-center justify-between">
                                            Pricing Tips <ArrowRight className="h-3 w-3" />
                                        </li>
                                    </ul>
                                </div>
                                <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-sm font-bold border-border/60 border hover:bg-white/50" onClick={() => router.push("/")}>
                                    <Layout className="h-4 w-4" /> All Modules
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 bg-primary/5 border-primary/20">
                            <CardContent className="p-6 space-y-4">
                                <Rocket className="h-8 w-8 text-primary opacity-50" />
                                <h4 className="text-base font-bold leading-tight">Professional Services</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Need help with custom {moduleDef.name} workflows?
                                </p>
                                <Button className="w-full bg-primary text-primary-foreground font-bold h-10 shadow-md">
                                    Book a Demo
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

