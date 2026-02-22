"use client";

import React, { useState } from "react";
import {
    Search,
    Globe,
    Share2,
    Target,
    Sparkles,
    AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const SeoManager = () => {
    const [seoType, setSeoType] = useState("global");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">SEO & Social Meta</h3>
                    <p className="text-sm text-muted-foreground">Manage how your store appears in search and on social media.</p>
                </div>
                <Badge variant="outline" className="gap-1 animate-pulse border-primary/30 text-primary">
                    <Sparkles className="h-3 w-3" /> AI SEO Agent Active
                </Badge>
            </div>

            <Tabs value={seoType} onValueChange={setSeoType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="global" className="gap-2">
                        <Globe className="h-4 w-4" /> Global Meta
                    </TabsTrigger>
                    <TabsTrigger value="local" className="gap-2">
                        <Target className="h-4 w-4" /> Local (Saudi) SEO
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Page Title Tag</Label>
                            <div className="relative">
                                <Input placeholder="Enter primary title" className="pr-10" />
                                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary cursor-pointer" />
                            </div>
                            <p className="text-[10px] text-muted-foreground px-1">Recommended: 50-60 characters.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Meta Description</Label>
                            <textarea
                                placeholder="Enter short description for search results"
                                className="w-full min-h-[80px] text-sm border rounded-md p-3 bg-transparent outline-none focus:ring-1 focus:ring-primary"
                            />
                            <p className="text-[10px] text-muted-foreground px-1">Recommended: 150-160 characters.</p>
                        </div>
                    </div>

                    <Card className="border-dashed bg-slate-50/50">
                        <CardContent className="p-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                <Search className="h-3.5 w-3.5" /> Search Result Preview
                            </h4>
                            <div className="space-y-1">
                                <p className="text-blue-600 text-lg hover:underline cursor-pointer font-medium truncate">
                                    {seoType === "local" ? "🇸🇦 أفضل المتاجر في السعودية" : "Global Premium Store - Official Website"}
                                </p>
                                <p className="text-emerald-700 text-xs">https://yourstore.zosair.com</p>
                                <p className="text-slate-600 text-sm line-clamp-2">
                                    {seoType === "local" ? "تسوق أفضل المنتجات في المملكة مع شحن سريع ودفع آمن. استلم طلبك خلال 24 ساعة." : "Discover high-quality products with international shipping and localized support for your region."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Share2 className="h-4 w-4" /> Social Sharing (OpenGraph)
                        </h4>
                        <div className="aspect-video w-full bg-slate-100 rounded-xl border border-dashed flex flex-col items-center justify-center text-muted-foreground space-y-2">
                            <AlertCircle className="h-8 w-8 opacity-20" />
                            <p className="text-xs">Upload a 1200x630px image for social previews.</p>
                            <Button variant="outline" size="sm">Upload Image</Button>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default SeoManager;
