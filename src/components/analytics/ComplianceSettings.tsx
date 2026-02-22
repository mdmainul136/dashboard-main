"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, EyeOff, Globe, Info } from "lucide-react";

export function ComplianceSettings() {
    return (
        <Card className="border-sidebar-border/50">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-sidebar-primary" />
                    <div>
                        <CardTitle className="text-sm font-bold">Privacy & Compliance</CardTitle>
                        <CardDescription className="text-[10px]">
                            Configure how sGTM handles visitor data and consent signals
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                        <div className="space-y-0.5">
                            <Label className="text-xs font-bold flex items-center gap-2">
                                GPC (Global Privacy Control) <Badge variant="secondary" className="text-[8px] h-3.5 px-1 bg-blue-100 text-blue-600 border-none">BETA</Badge>
                            </Label>
                            <p className="text-[10px] text-muted-foreground">Automatically honor browser-level privacy signals</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-sidebar-primary" />
                    </div>

                    <div className="flex items-center justify-between group">
                        <div className="space-y-0.5">
                            <Label className="text-xs font-bold flex items-center gap-2">
                                PII Redaction
                            </Label>
                            <p className="text-[10px] text-muted-foreground">Strip email/phone from server-side payloads before egress</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-sidebar-primary" />
                    </div>

                    <div className="flex items-center justify-between group">
                        <div className="space-y-0.5">
                            <Label className="text-xs font-bold flex items-center gap-2">
                                Region-Locked Gateway
                            </Label>
                            <p className="text-[10px] text-muted-foreground">Force event processing within specific geographic regions</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-sidebar-primary" />
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-sidebar-border/30 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
                        <Lock className="h-3 w-3" /> Data Sovereignty
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        By enabling server-side tracking, you act as the Data Controller. Ensure your Privacy Policy reflects the use of first-party tracking under your own domain endpoint.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
