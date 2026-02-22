"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart3, Hash, Globe, Users,
    Settings, Database, Zap, Sparkles,
    ArrowRight, Info
} from "lucide-react";

const AttributionEnrichmentPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Attribution & Enrichment</h1>
                        <p className="text-muted-foreground text-sm mt-1">Configure data appending and define conversion credit windows</p>
                    </div>
                    <Button className="gap-2">
                        <Sparkles className="h-4 w-4" /> Optimization Audit
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    <div>
                                        <CardTitle className="text-lg">Attribution Modeling</CardTitle>
                                        <CardDescription className="text-xs">Select how credit is distributed across marketing channels</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: "dda", label: "Data-Driven (AI)", description: "Dynamically assigns credit based on previous conversion paths.", active: true },
                                        { id: "last-click", label: "Last Interacting Client", description: "100% of credit goes to the final touchpoint.", active: false },
                                        { id: "linear", label: "Linear Distribution", description: "Equal credit shared across all touchpoints in the window.", active: false },
                                        { id: "time-decay", label: "Time Decay", description: "Touchpoints closer to conversion get more credit.", active: false },
                                    ].map((model) => (
                                        <div key={model.id} className={`p-4 rounded-xl border transition-all cursor-pointer ${model.active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/60 hover:border-border"}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold">{model.label}</span>
                                                {model.active && <Badge className="text-[8px] h-4">ACTIVE</Badge>}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{model.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conversion Windows</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Post-Click", value: "30 Days" },
                                            { label: "Post-View", value: "24 Hours" },
                                            { label: "Visit Duration", value: "30 Mins" },
                                            { label: "Loyalty Decay", value: "90 Days" },
                                        ].map(win => (
                                            <div key={win.label} className="p-3 rounded-lg bg-muted/40 text-center">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase">{win.label}</p>
                                                <p className="text-sm font-black mt-1">{win.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-violet-600" />
                                    <div>
                                        <CardTitle className="text-lg">Edge Enrichment Rules</CardTitle>
                                        <CardDescription className="text-xs">Append additional metadata to signals as they pass through the edge</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { id: "geo", label: "IP-to-Geo Mapping", description: "Appends city/country data derived from anonymized IP address.", active: true, icon: <Globe className="h-4 w-4" /> },
                                    { id: "ua", label: "User-Agent Parsing", description: "Enriches events with granular OS, browser version, and device type.", active: true, icon: <Settings className="h-4 w-4" /> },
                                    { id: "crm", label: "CRM ID Stitching", description: "Matches hashed identifiers with internal CRM data for logged-in users.", active: false, icon: <Users className="h-4 w-4" /> },
                                    { id: "currency", label: "Auto-Currency Conv.", description: "Standardizes conversion values into your base currency (e.g. SAR/BDT).", active: true, icon: <Hash className="h-4 w-4" /> },
                                ].map(rule => (
                                    <div key={rule.id} className="flex items-center justify-between p-4 rounded-xl border border-border/60 group hover:border-primary/40 transition-colors">
                                        <div className="flex items-start gap-3 pr-4">
                                            <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                                                {rule.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold">{rule.label}</p>
                                                <p className="text-[10px] text-muted-foreground leading-relaxed">{rule.description}</p>
                                            </div>
                                        </div>
                                        <Badge variant={rule.active ? "secondary" : "outline"} className={`text-[9px] ${rule.active ? "bg-emerald-100 text-emerald-700 border-none" : "text-muted-foreground"}`}>
                                            {rule.active ? "ENRICHING" : "DISABLED"}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-violet-600 text-white border-none shadow-xl">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-lg font-black tracking-tight">Signal Boost</CardTitle>
                                <CardDescription className="text-violet-100 text-[11px] leading-relaxed">
                                    Advanced enrichment is currently increasing your Meta CAPI accuracy by **18.4%**.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span>Attribution Confidence</span>
                                        <span>92%</span>
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white" style={{ width: "92%" }} />
                                    </div>
                                </div>
                                <Button className="w-full mt-6 bg-white text-violet-600 font-bold text-xs hover:bg-violet-50">
                                    Analyze Channel Overlap
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resource Center</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {[
                                    "Understanding Attribution Windows",
                                    "Setting up Cross-Domain Stitching",
                                    "Edge Computing Best Practices",
                                    "Signal Enrichment Security"
                                ].map(text => (
                                    <div key={text} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{text}</span>
                                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/40 border border-border/60 text-[10px] text-muted-foreground">
                            <Info className="h-4 w-4 text-primary shrink-0" />
                            <p>Attribution changes take up to 24 hours to propagate across processed signals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AttributionEnrichmentPage;
