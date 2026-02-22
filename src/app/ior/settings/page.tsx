"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Settings, Globe, Truck, DollarSign, ShieldAlert, RefreshCcw,
    Plus, Trash2, Save, Info, Zap, Lock
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useIorSettings } from "@/hooks/ior/useIorSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function IorSettingsPage() {
    const {
        settings, exchangeData, isLoading,
        fetchSettings, updateSettings, fetchExchangeRate, refreshExchangeRate
    } = useIorSettings();

    const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchSettings();
        fetchExchangeRate();
    }, [fetchSettings, fetchExchangeRate]);

    useEffect(() => {
        if (settings) setLocalSettings(settings);
    }, [settings]);

    const handleInputChange = (key: string, value: string) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        await updateSettings(localSettings);
    };

    const handleRefreshFX = async () => {
        await refreshExchangeRate();
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-zinc-600 shadow-lg shadow-gray-500/20">
                                    <Settings className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-secondary text-muted-foreground border-border text-[10px] font-bold tracking-widest uppercase">
                                    Configuration
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">IOR Settings</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Configure global IOR operations, pricing, exchange rates, and logistics automation.
                            </p>
                        </div>
                        <Button
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold h-10 gap-2 shadow-lg shadow-emerald-500/20 text-sm"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            <Save className="h-4 w-4" /> {isLoading ? "Saving..." : "Save Configuration"}
                        </Button>
                    </div>

                    <div className="grid gap-6">
                        {/* Financial Settings */}
                        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                            <div className="p-6 border-b border-border bg-secondary/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success/10 rounded-xl">
                                        <DollarSign className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Financial Settings</h3>
                                        <p className="text-xs text-muted-foreground">Currency exchange rates and payment preferences.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Exchange Rate (USD → BDT)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={localSettings.default_exchange_rate || ""}
                                                onChange={(e) => handleInputChange('default_exchange_rate', e.target.value)}
                                                className="font-mono rounded-xl bg-background border-border"
                                            />
                                            <Button
                                                variant="outline"
                                                className="rounded-xl px-4"
                                                onClick={handleRefreshFX}
                                                disabled={isLoading}
                                            >
                                                <RefreshCcw className={cn("h-4 w-4", isLoading && 'animate-spin')} />
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Info className="h-3 w-3" />
                                            API Sync. Current: ৳{exchangeData?.rate || "..."}.
                                            Last updated: {exchangeData?.updated_at ? new Date(exchangeData.updated_at).toLocaleTimeString() : "Never"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Profit Margin (%)</Label>
                                        <Input
                                            value={localSettings.default_profit_margin || ""}
                                            onChange={(e) => handleInputChange('default_profit_margin', e.target.value)}
                                            className="rounded-xl bg-background border-border"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    {[
                                        { key: "exchange_buffer_percent", label: "Exchange Buffer (%)", desc: "Safety margin added to live exchange rate.", default: "2" },
                                        { key: "advance_payment_percent", label: "Advance Payment Percent (%)", desc: "Minimum advance required to process IOR orders.", default: "50" },
                                    ].map(field => (
                                        <div key={field.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-semibold text-foreground">{field.label}</Label>
                                                <p className="text-xs text-muted-foreground">{field.desc}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    className="w-20 h-9 rounded-xl bg-background border-border text-center font-mono"
                                                    value={localSettings[field.key] || field.default}
                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                />
                                                <span className="text-xs text-muted-foreground font-bold">%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Scraper & Sourcing */}
                        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                            <div className="p-6 border-b border-border bg-secondary/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-info/10 rounded-xl">
                                        <Globe className="h-5 w-5 text-info" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Scraper & Sourcing</h3>
                                        <p className="text-xs text-muted-foreground">Configure product scraper and proxy settings.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scraper Proxy Provider</Label>
                                        <Select defaultValue="residential">
                                            <SelectTrigger className="rounded-xl bg-background border-border">
                                                <SelectValue placeholder="Select provider" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="none">Direct (No Proxy)</SelectItem>
                                                <SelectItem value="residential">Residential Proxy (Shared)</SelectItem>
                                                <SelectItem value="private">Private Scraper API</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Marketplace Whitelist</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Amazon", "eBay", "Walmart"].map(m => (
                                                <Badge key={m} variant="secondary" className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold">
                                                    {m} <Trash2 className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" />
                                                </Badge>
                                            ))}
                                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1 rounded-lg"><Plus className="h-3 w-3" /> Add</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Automation */}
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 shadow-[var(--shadow-card)] overflow-hidden">
                            <div className="p-6 border-b border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">Logistics Automation</h3>
                                        <p className="text-xs text-muted-foreground">Smart automation for operational efficiency.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                {[
                                    { label: "Auto-assign Courier", desc: "Assign Pathao/Steadfast automatically when item enters warehouse.", checked: true },
                                    { label: "Client SMS Tracking Updates", desc: "Send SMS when order status changes to 'Shipped' or 'Customs'.", checked: true },
                                ].map(auto => (
                                    <div key={auto.label} className="flex items-center justify-between py-3">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-semibold text-foreground">{auto.label}</Label>
                                            <p className="text-xs text-muted-foreground">{auto.desc}</p>
                                        </div>
                                        <Switch defaultChecked={auto.checked} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
