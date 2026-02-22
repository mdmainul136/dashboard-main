"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Globe, Package, Zap } from "lucide-react";

interface SourcingSetupProps {
    data: Record<string, any>;
    onChange: (key: string, value: any) => void;
}

export default function SourcingSetup({ data, onChange }: SourcingSetupProps) {
    const markets = [
        { id: "usa", name: "United States", code: "US", icon: "🇺🇸" },
        { id: "uk", name: "United Kingdom", code: "UK", icon: "🇬🇧" },
        { id: "china", name: "China", code: "CN", icon: "🇨🇳" },
        { id: "uae", name: "UAE / Dubai", code: "AE", icon: "🇦🇪" },
    ];

    const categories = [
        "Electronics", "Cosmetics", "Garments", "Machinery", "Home Decor", "Stationery"
    ];

    const selectedMarkets = data.markets || [];
    const selectedCategories = data.categories || [];

    const toggleMarket = (id: string) => {
        const next = selectedMarkets.includes(id)
            ? selectedMarkets.filter((m: string) => m !== id)
            : [...selectedMarkets, id];
        onChange("markets", next);
    };

    const toggleCategory = (cat: string) => {
        const next = selectedCategories.includes(cat)
            ? selectedCategories.filter((c: string) => c !== cat)
            : [...selectedCategories, cat];
        onChange("categories", next);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Sourcing Configuration</h2>
                <p className="text-muted-foreground mt-1">Tell us where you plan to source products from.</p>
            </div>

            <div className="space-y-4">
                <Label className="text-sm font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Primary Markets
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {markets.map((m) => {
                        const isSelected = selectedMarkets.includes(m.id);
                        return (
                            <Card
                                key={m.id}
                                className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-primary/30"}`}
                                onClick={() => toggleMarket(m.id)}
                            >
                                <CardContent className="p-4 text-center space-y-2">
                                    <span className="text-2xl">{m.icon}</span>
                                    <p className="text-xs font-bold">{m.name}</p>
                                    {isSelected && <Badge className="bg-primary h-4 w-4 p-0 flex items-center justify-center rounded-full absolute -top-2 -right-2"><Check className="h-3 w-3" /></Badge>}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <Label className="text-sm font-bold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> Core Sourcing Categories
                </Label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat);
                        return (
                            <Badge
                                key={cat}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer px-4 py-2 text-sm ${isSelected ? "bg-primary" : "hover:bg-primary/10 transition-colors"}`}
                                onClick={() => toggleCategory(cat)}
                            >
                                {cat}
                            </Badge>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
