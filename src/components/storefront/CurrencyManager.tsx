"use client";

import React, { useState } from "react";
import {
    Coins,
    RefreshCw,
    Check,
    Settings2,
    DollarSign,
    Info
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CurrencyManager = () => {
    const [defaultCurrency, setDefaultCurrency] = useState("SAR");
    const [autoUpdate, setAutoUpdate] = useState(true);

    const currencies = [
        { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦" },
        { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
        { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
        { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", flag: "🇰🇼" },
        { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
        { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold">Multi-Currency & Regional</h3>
                <p className="text-sm text-muted-foreground">Configure supported currencies and price formatting.</p>
            </div>

            <div className="grid gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Default Business Currency</Label>
                        <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map(c => (
                                    <SelectItem key={c.code} value={c.code}>
                                        <div className="flex items-center gap-2">
                                            <span>{c.flag}</span>
                                            <span className="font-bold">{c.code}</span>
                                            <span className="text-muted-foreground text-xs">{c.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground px-1 flex items-center gap-1">
                            <Info className="h-3 w-3" /> All core accounting will use this currency.
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                        <div className="space-y-0.5">
                            <Label className="text-sm">Auto-update Exchange Rates</Label>
                            <p className="text-xs text-muted-foreground">Uses real-time feeds to keep global prices accurate.</p>
                        </div>
                        <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4" /> Enabled Currencies
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {currencies.map(c => (
                            <div
                                key={c.code}
                                className={`flex items-center justify-between p-3 border rounded-lg transition-all ${c.code === defaultCurrency ? "border-primary bg-primary/5 shadow-sm" : "bg-card"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{c.flag}</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-none">{c.code}</span>
                                        <span className="text-[10px] text-muted-foreground">{c.symbol} (Rate: {c.code === "SAR" ? "1.00" : "3.75"})</span>
                                    </div>
                                </div>
                                {c.code === defaultCurrency ? <Check className="h-4 w-4 text-primary" /> : <Switch defaultChecked={c.code === "USD" || c.code === "AED"} />}
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
                    <CardContent className="p-6 flex items-center justify-between z-10">
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary">Live Rates Engine</p>
                            <h5 className="text-lg font-bold">1 SAR = 0.27 USD</h5>
                            <p className="text-[10px] text-slate-400">Last updated: Just now (via Central Bank Feed)</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </CardContent>
                    <Coins className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 pointer-events-none" />
                </Card>
            </div>
        </div>
    );
};

export default CurrencyManager;
