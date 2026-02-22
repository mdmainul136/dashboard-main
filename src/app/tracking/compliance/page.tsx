"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Shield, Lock, EyeOff, Globe,
    Settings2, AlertCircle, CheckCircle2, Save
} from "lucide-react";
import { ComplianceSettings } from "@/components/analytics/ComplianceSettings";

const CompliancePrivacyPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Compliance & Privacy</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage global privacy signals (GPC), consent banners, and PII redaction</p>
                    </div>
                    <Button className="gap-2">
                        <Save className="h-4 w-4" /> Save All Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ComplianceSettings />

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <EyeOff className="h-5 w-5 text-primary" />
                                    <div>
                                        <CardTitle className="text-lg">PII Redaction Engine</CardTitle>
                                        <CardDescription className="text-xs">Automatically mask sensitive data before it's sent to third-party endpoints</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: "email", label: "Email Addresses", description: "Masks strings matching email patterns", default: true },
                                        { id: "phone", label: "Phone Numbers", description: "Redacts numeric patterns matching phone formats", default: true },
                                        { id: "ip", label: "IP Address (Last Octet)", description: "Zeros out the last segment of user IPs", default: true },
                                        { id: "name", label: "Full Names", description: "Attempts to identify and mask user names", default: false },
                                        { id: "address", label: "Postal Addresses", description: "Redacts physical address components", default: false },
                                        { id: "agent", label: "User Agent Details", description: "Strips granular OS/Version info", default: false },
                                    ].map((rule) => (
                                        <div key={rule.id} className="flex items-start justify-between p-4 rounded-xl border border-border/60 bg-muted/30">
                                            <div className="space-y-1 pr-4">
                                                <Label htmlFor={rule.id} className="text-sm font-bold leading-none cursor-pointer">
                                                    {rule.label}
                                                </Label>
                                                <p className="text-[10px] text-muted-foreground leading-relaxed">{rule.description}</p>
                                            </div>
                                            <Switch id={rule.id} defaultChecked={rule.default} />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-[11px] text-primary">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    Redaction occurs at the sGTM Edge layer. Original data never leaves your infrastructure.
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <CardTitle className="text-lg">Consent Banner (Preview)</CardTitle>
                                        <CardDescription className="text-xs">Live appearance of the data collection banner</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-8 bg-muted/50 rounded-2xl border border-dashed border-border flex items-center justify-center min-h-[200px]">
                                    <div className="bg-background border border-border shadow-2xl rounded-2xl p-5 max-w-sm space-y-4 animate-in fade-in zoom-in duration-500">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <p className="font-bold text-sm">Privacy Options</p>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            We use first-party cookies to improve your experience. By clicking "Accept", you agree to our data processing policy.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="flex-1 text-[10px] h-8 font-bold">Accept All</Button>
                                            <Button size="sm" variant="outline" className="flex-1 text-[10px] h-8 font-bold">Customize</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-blue-600 text-white border-none shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Lock className="h-24 w-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-base font-black uppercase tracking-tight">Trust Standard</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                                <p className="text-xs text-blue-50/80 leading-relaxed font-medium">
                                    Your tracking infrastructure currently meets the **Gold Standard** for privacy according to GDPR Article 32.
                                </p>
                                <div className="bg-white/10 rounded-xl p-3 space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span>Edge Redaction</span>
                                        <CheckCircle2 className="h-3 w-3" />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span>No Third-party IDs</span>
                                        <CheckCircle2 className="h-3 w-3" />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span>GPC Compliance</span>
                                        <CheckCircle2 className="h-3 w-3" />
                                    </div>
                                </div>
                                <Button variant="secondary" className="w-full text-[11px] h-10 font-black text-blue-600 hover:bg-blue-50 transition-colors">
                                    Download Audit Report
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Settings Checklist</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { label: "Global Privacy Control (GPC)", status: true },
                                    { label: "Do Not Track (DNT) Support", status: true },
                                    { label: "Consent Mode V2 (Google)", status: true },
                                    { label: "TCF 2.2 Framework", status: false },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-[10px] font-medium group-hover:text-primary transition-colors">{item.label}</span>
                                        <Switch defaultChecked={item.status} className="scale-75" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CompliancePrivacyPage;
