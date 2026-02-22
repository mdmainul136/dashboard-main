"use client";

import React, { useState } from "react";
import {
    Sparkles,
    Wand2,
    Loader2,
    Check,
    RefreshCw,
    MessageSquare,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AiThemeAssistantProps {
    onGenerate: (data: any) => void;
}

const AiThemeAssistant = ({ onGenerate }: AiThemeAssistantProps) => {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastSuggestion, setLastSuggestion] = useState<any>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error("Please enter a description for your business.");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('/api/ai/generate-storefront', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Generation failed");
            }

            const generatedData = await response.json();
            setLastSuggestion(generatedData);
            toast.success(generatedData.mode === 'platform' ? "Platform AI generated a theme. Credits deducted." : "Custom AI key used for generation.");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const applyAiSettings = () => {
        if (lastSuggestion) {
            onGenerate(lastSuggestion);
            setLastSuggestion(null);
            setPrompt("");
            toast.success("AI settings applied to your storefront!");
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <textarea
                    placeholder="Describe your brand... (e.g., A luxury watch store with a minimalist aesthetic)"
                    className="w-full min-h-[100px] pl-10 pt-2.5 text-sm border rounded-xl bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                    className="absolute bottom-3 right-3 gap-2 shadow-lg"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isGenerating ? "Thinking..." : "Generate with AI"}
                </Button>
            </div>

            {lastSuggestion && (
                <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-500">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="gap-1 bg-background">
                                <Wand2 className="h-3 w-3 text-primary" /> AI Suggestion
                            </Badge>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setLastSuggestion(null)}>Discard</Button>
                                <Button size="sm" onClick={applyAiSettings} className="gap-2">
                                    <Check className="h-4 w-4" /> Apply Changes
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Brand Name</p>
                                <p className="font-bold">{lastSuggestion.brandName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Primary Color</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: lastSuggestion.primaryColor }} />
                                    <p className="font-mono">{lastSuggestion.primaryColor}</p>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1 pt-2 border-t">
                                <p className="text-muted-foreground">Hero Headline</p>
                                <p className="font-medium italic">"{lastSuggestion.heroHeading}"</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col gap-2 p-2 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        AI Brain is active & localized.
                    </div>
                    {lastSuggestion?.brain_version && (
                        <Badge variant="secondary" className="text-[8px] h-4 py-0 px-1 font-mono opacity-50">
                            v{lastSuggestion.brain_version}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-amber-600 font-semibold bg-amber-50 rounded px-2 py-1">
                    <AlertCircle className="h-3 w-3" />
                    Low Balance: Using SaaS Managed Brain.
                </div>
            </div>
        </div>
    );
};

export default AiThemeAssistant;
