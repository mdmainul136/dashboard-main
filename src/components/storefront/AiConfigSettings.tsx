"use client";

import React, { useState, useEffect } from "react";
import {
    Key,
    Settings,
    Database,
    AlertCircle,
    Check,
    CreditCard,
    Cpu,
    ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AiConfigSettings = () => {
    const [activeMode, setActiveMode] = useState<"platform" | "custom">("platform");
    const [provider, setProvider] = useState("gemini");
    const [apiKey, setApiKey] = useState("");
    const [balance, setBalance] = useState(2.50); // Mocked low balance for demonstration

    const handleSave = () => {
        toast.success("AI Configuration saved successfully!");
    };

    const isLowBalance = balance < 5;

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Low Balance Warning */}
            {activeMode === "platform" && isLowBalance && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-amber-900">Low Credit Balance</p>
                        <p className="text-xs text-amber-700">Your AI credits are running low. Top up now to avoid interruption in your storefront generation services.</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100">
                        Add Credits
                    </Button>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">AI Core Configuration</h3>
                    <p className="text-sm text-muted-foreground">Choose how your AI features are powered and billed.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {/* Mode Selector */}
                <div className="flex gap-4">
                    <Card
                        className={`flex-1 cursor-pointer transition-all border-2 ${activeMode === "platform" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                        onClick={() => setActiveMode("platform")}
                    >
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Database className="h-5 w-5 text-primary" />
                                {activeMode === "platform" && <Check className="h-4 w-4 text-primary" />}
                            </div>
                            <div className="font-bold">SaaS Managed</div>
                            <p className="text-[10px] text-muted-foreground leading-tight">Use our optimized infrastructure. Billed per generation.</p>
                        </CardContent>
                    </Card>

                    <Card
                        className={`flex-1 cursor-pointer transition-all border-2 ${activeMode === "custom" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                        onClick={() => setActiveMode("custom")}
                    >
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Key className="h-5 w-5 text-indigo-500" />
                                {activeMode === "custom" && <Check className="h-4 w-4 text-primary" />}
                            </div>
                            <div className="font-bold">Custom API Key</div>
                            <p className="text-[10px] text-muted-foreground leading-tight">Bring your own key from Google, Anthropic or OpenAI.</p>
                        </CardContent>
                    </Card>
                </div>

                {activeMode === "platform" ? (
                    <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
                        <CardContent className="p-6 flex items-center justify-between z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-primary hover:bg-primary text-[10px]">Active</Badge>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Platform Credits</p>
                                </div>
                                <h4 className="text-2xl font-bold font-mono">{balance.toFixed(2)} CREDITS</h4>
                                <p className="text-[10px] text-slate-400">Cost: 0.50 Credits / Generation</p>
                            </div>
                            <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white gap-2">
                                <CreditCard className="h-4 w-4" /> Top up
                            </Button>
                        </CardContent>
                        <Cpu className="absolute -right-8 -bottom-8 h-32 w-32 opacity-10 pointer-events-none" />
                    </Card>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label>AI Provider</Label>
                            <Select value={provider} onValueChange={setProvider}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gemini">Google Gemini Flash (Recommended)</SelectItem>
                                    <SelectItem value="claude">Anthropic Claude 3.5 Sonnet</SelectItem>
                                    <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>API Key</Label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="Enter your private API key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="pr-10"
                                />
                                <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-2 mt-1 px-1">
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                                <p className="text-[10px] text-muted-foreground">Keys are stored with AES-256 encryption.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex justify-end gap-3 border-t">
                    <Button variant="ghost" size="sm">Reset Defaults</Button>
                    <Button size="sm" onClick={handleSave} className="gap-2">
                        <Settings className="h-4 w-4" /> Save Configuration
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AiConfigSettings;
