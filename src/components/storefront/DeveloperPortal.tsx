"use client";

import React, { useState } from "react";
import {
    Code2,
    Send,
    Play,
    CheckCircle2,
    AlertCircle,
    FileJson,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const DEFAULT_SCHEMA = {
    version: "1.0.0",
    globalSettings: {
        primaryColor: "#3b82f6",
        accentColor: "#1e293b",
        headingFont: "Inter",
        bodyFont: "Roboto"
    },
    layouts: {
        home: {
            sections: [
                { type: "hero", settings: { title: "New Collection", subtitle: "Shop the latest trends" } },
                { type: "featured-products", settings: { count: 4 } }
            ]
        }
    }
};

const CAPABILITIES = [
    { id: "mega_menu", label: "Mega Menu" },
    { id: "rtl_ready", label: "RTL Support" },
    { id: "video_hero", label: "Video Hero" },
    { id: "multilingual", label: "Multilingual" },
    { id: "quick_view", label: "Quick View" }
];

const DeveloperPortal = ({ onSandboxPreview }: { onSandboxPreview: (config: any) => void }) => {
    const [jsonInput, setJsonInput] = useState(JSON.stringify(DEFAULT_SCHEMA, null, 2));
    const [themeName, setThemeName] = useState("");
    const [vertical, setVertical] = useState("General Retail");
    const [version, setVersion] = useState("1.0.0");
    const [price, setPrice] = useState("0");
    const [selectedCaps, setSelectedCaps] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

    const validateJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const required = ['globalSettings', 'layouts'];
            for (const key of required) {
                if (!parsed[key]) throw new Error(`Missing required key: ${key}`);
            }
            if (!parsed.layouts.home) throw new Error("Missing 'home' layout.");
            setValidationError(null);
            return parsed;
        } catch (e: any) {
            setValidationError(e.message);
            return null;
        }
    };

    const handlePreview = () => {
        const config = validateJson();
        if (config) {
            onSandboxPreview({ ...config, device: previewDevice });
            toast.info(`Sandbox: Previewing on ${previewDevice}`);
        }
    };

    const handleSubmit = async () => {
        const config = validateJson();
        if (!config || !themeName) {
            toast.error("Please provide a theme name and valid JSON config.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/themes/developer/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: themeName,
                    vertical: vertical,
                    version: version,
                    price: parseFloat(price),
                    capabilities: selectedCaps,
                    component_blueprint: config,
                    config: config.globalSettings, // Legacy compat or base config
                    preview_url: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                })
            });

            if (response.ok) {
                toast.success("Theme submitted for admin review!");
            } else {
                const err = await response.json();
                toast.error(err.message || "Failed to submit theme.");
            }
        } catch (error) {
            toast.error("Error connecting to marketplace API.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Editor */}
            <div className="space-y-6">
                <Card className="border-2 border-dashed border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-primary" />
                                Theme Configuration Engine
                            </CardTitle>
                            <CardDescription>Format: JSON Standard v1.0</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Developer Sandbox</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Theme Name</Label>
                                <Input
                                    placeholder="Neon Cyber"
                                    value={themeName}
                                    onChange={(e) => setThemeName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vertical</Label>
                                <Input
                                    placeholder="Gaming"
                                    value={vertical}
                                    onChange={(e) => setVertical(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Version</Label>
                                <Input
                                    placeholder="1.0.0"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Price ($)</Label>
                                <Input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Capabilities</Label>
                            <div className="flex flex-wrap gap-2">
                                {CAPABILITIES.map(cap => (
                                    <Badge
                                        key={cap.id}
                                        variant={selectedCaps.includes(cap.id) ? "default" : "outline"}
                                        className="cursor-pointer transition-all"
                                        onClick={() => {
                                            setSelectedCaps(prev =>
                                                prev.includes(cap.id)
                                                    ? prev.filter(c => c !== cap.id)
                                                    : [...prev, cap.id]
                                            );
                                        }}
                                    >
                                        {cap.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                    <FileJson className="h-4 w-4" /> Config JSON
                                </Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-7 px-2 text-[10px] ${previewDevice === 'desktop' ? 'bg-primary/10 text-primary' : ''}`}
                                        onClick={() => setPreviewDevice('desktop')}
                                    >
                                        Desktop
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-7 px-2 text-[10px] ${previewDevice === 'mobile' ? 'bg-primary/10 text-primary' : ''}`}
                                        onClick={() => setPreviewDevice('mobile')}
                                    >
                                        Mobile
                                    </Button>
                                </div>
                            </div>
                            {validationError && (
                                <span className="text-[10px] text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {validationError}
                                </span>
                            )}
                        </div>
                        <textarea
                            className="w-full h-80 font-mono text-xs p-4 bg-slate-950 text-emerald-400 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 border-0"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            spellCheck={false}
                        />

                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1 gap-2" onClick={handlePreview}>
                                <Play className="h-4 w-4" /> Run Sandbox
                            </Button>
                            <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={isSubmitting}>
                                <Send className="h-4 w-4" /> {isSubmitting ? "Submitting..." : "Submit to Marketplace"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-slate-50 p-6 rounded-xl border space-y-3">
                    <h3 className="font-bold flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Submission Guidelines
                    </h3>
                    <ul className="text-xs space-y-2 text-slate-500 list-disc ml-4">
                        <li>Config must include <strong>primaryColor</strong> (Hex).</li>
                        <li>Fonts must be from the <strong>Next.js/Google Fonts</strong> supported list.</li>
                        <li>Images must be served over <strong>HTTPS</strong>.</li>
                        <li>Themes are subject to a 24-hour review period by our curators.</li>
                    </ul>
                </div>
            </div>

            {/* Stats/Status for Developer */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">My Submissions</CardTitle>
                        <CardDescription>Track the status of your marketplace items</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded bg-indigo-500 flex items-center justify-center text-white font-bold">RM</div>
                                    <div>
                                        <p className="text-sm font-semibold">Riyadh Modern (Core)</p>
                                        <p className="text-[10px] text-muted-foreground">Original Platform Theme</p>
                                    </div>
                                </div>
                                <Badge variant="secondary">LOCKED</Badge>
                            </div>

                            <div className="text-center py-10 border border-dashed rounded-lg bg-muted/20">
                                <Plus className="h-8 w-8 mx-auto text-muted-foreground opacity-20" />
                                <p className="text-xs text-muted-foreground mt-2">No third-party submissions yet.</p>
                                <p className="text-[10px] text-muted-foreground">Start by submitting your first theme on the left!</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeveloperPortal;
