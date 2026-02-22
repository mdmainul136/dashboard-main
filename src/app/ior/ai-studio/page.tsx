"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Zap,
    Sparkles,
    Image as ImageIcon,
    TrendingUp,
    ChevronRight,
    Plus,
    RefreshCcw,
    Facebook,
    Instagram,
    MessageSquare,
    Languages,
    Eye,
    Upload,
    CheckCircle2,
    Copy,
    BrainCircuit,
    Cpu,
    Star,
    Search,
    Wand2,
    BarChart3,
    ArrowRight,
    FileJson,
    Trash2,
    Check,
    Globe,
    Package,
    Play,
    Pause,
    Terminal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIorAi } from "@/hooks/ior/useIorAi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function IorAiStudioPage() {
    const searchParams = useSearchParams();
    const {
        bestsellers,
        isProcessing,
        fetchBestsellers,
        generateSocialCaptions,
        analyzeImage,
        translateToBangla,
        optimizeSeo,
        enrichOrder
    } = useIorAi();

    const [activeTab, setActiveTab] = useState("intelligence");
    const [socialPlatform, setSocialPlatform] = useState("facebook");
    const [socialInput, setSocialInput] = useState({ title: "", description: "" });
    const [socialResult, setSocialResult] = useState<string | null>(null);
    const [translationInput, setTranslationInput] = useState("");
    const [translationResult, setTranslationResult] = useState<string | null>(null);
    const [visionResult, setVisionResult] = useState<any | null>(null);
    const [seoInput, setSeoInput] = useState({ title: "", keywords: "" });
    const [seoResult, setSeoResult] = useState<any | null>(null);
    const [injectedProduct, setInjectedProduct] = useState<{ title: string; price: string; marketplace: string; image: string } | null>(null);
    const [isAutomationActive, setIsAutomationActive] = useState(false);
    const [automationLogs, setAutomationLogs] = useState<{ time: string; msg: string; type: string }[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const bulkTranslateRef = useRef<HTMLInputElement>(null);

    // Auto-populate from Scraper deep-link
    useEffect(() => {
        const title = searchParams.get("title");
        const price = searchParams.get("price");
        const marketplace = searchParams.get("marketplace");
        const image = searchParams.get("image");

        if (title) {
            setInjectedProduct({ title: title || "", price: price || "", marketplace: marketplace || "", image: image || "" });
            setSocialInput(prev => ({ ...prev, title: title || "" }));
            setSeoInput(prev => ({ ...prev, title: title || "" }));
            setTranslationInput(title || "");
            toast.success("Product data received from Scraper", { description: title });
        }
    }, [searchParams]);

    useEffect(() => {
        fetchBestsellers();
    }, [fetchBestsellers]);

    // Simulated Automation Telemetry
    useEffect(() => {
        let interval: any;
        if (isAutomationActive) {
            const logsArray = [
                { msg: "Scanning upstream marketplace delta...", type: "system" },
                { msg: "Identified 12 products pending enrichment.", type: "success" },
                { msg: "Synthesizing SEO metadata for node #IOR-449...", type: "process" },
                { msg: "Neural translation [EN->BN] complete for 'Gaming Mouse'.", type: "success" },
                { msg: "Queueing social ad variants for A/B testing on FB-Ads API.", type: "process" },
                { msg: "Vision analysis: Image contrast optimized for localizer.", type: "system" },
                { msg: "Heartbeat: All neural nodes synchronized.", type: "heartbeat" },
                { msg: "Propagating pricing delta to Global Catalog.", type: "success" }
            ];

            interval = setInterval(() => {
                const randomLog = logsArray[Math.floor(Math.random() * logsArray.length)];
                setAutomationLogs(prev => [
                    { time: new Date().toLocaleTimeString(), ...randomLog },
                    ...prev.slice(0, 19)
                ]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isAutomationActive]);

    const handleSocialGenerate = async () => {
        if (!socialInput.title) return toast.error("Product title required");
        const caption = await generateSocialCaptions(socialInput, socialPlatform);
        if (caption) setSocialResult(caption);
    };

    const handleTranslation = async () => {
        if (!translationInput) return;
        const result = await translateToBangla(translationInput);
        if (result) setTranslationResult(result as string);
    };

    const handleVisionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await analyzeImage(file);
            if (result) setVisionResult(result);
        }
    };

    const handleSeoOptimize = async () => {
        if (!seoInput.title) return toast.error("Product title required");
        const result = await optimizeSeo(seoInput);
        if (result) setSeoResult(result);
    };

    const handleBulkTranslate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            toast.info(`Initializing bulk translation for ${file.name}...`);
            setTimeout(() => {
                toast.success("Bulk translation sequence complete (simulated)");
            }, 2000);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* ─── Header ─── */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20">
                                    <BrainCircuit className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-chart-4/10 text-chart-4 border-chart-4/20 text-[10px] font-bold tracking-widest uppercase">
                                    Neural Engine v4.2
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                AI Studio
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Neural command center for sourcing intelligence, localization, and ad orchestration.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                Core Pulse: Stable
                            </div>
                            <Badge variant="secondary" className="text-[10px] font-bold tracking-widest uppercase">
                                Enterprise Plan Active
                            </Badge>
                        </div>
                    </div>

                    {/* ─── Injected Product Banner ─── */}
                    {injectedProduct && (
                        <div className="flex items-center gap-4 rounded-xl border border-chart-4/20 bg-chart-4/5 p-4 animate-in slide-in-from-top-4 duration-500">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10 border border-chart-4/20 overflow-hidden flex-shrink-0">
                                {injectedProduct.image ? (
                                    <img src={injectedProduct.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="h-5 w-5 text-chart-4" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-chart-4/60 uppercase font-bold tracking-wider">Received from Scraper</p>
                                <p className="text-sm font-semibold text-foreground truncate">{injectedProduct.title}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {injectedProduct.marketplace && (
                                    <Badge variant="secondary" className="text-[10px]">
                                        <Globe className="mr-1 h-3 w-3" /> {injectedProduct.marketplace}
                                    </Badge>
                                )}
                                {injectedProduct.price && (
                                    <span className="text-sm font-bold text-chart-4">${injectedProduct.price}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ─── Tabs ─── */}
                    <Tabs defaultValue="intelligence" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="bg-secondary border border-border p-1.5 rounded-xl w-fit mb-6">
                            {[
                                { value: "intelligence", label: "Intelligence", icon: BarChart3 },
                                { value: "social", label: "Social Studio", icon: Facebook },
                                { value: "vision", label: "Vision Lens", icon: ImageIcon },
                                { value: "localiser", label: "Localiser", icon: Languages },
                                { value: "seo", label: "SEO Hub", icon: Search },
                                { value: "automation", label: "Automation", icon: Zap },
                            ].map(tab => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="rounded-lg px-5 py-2.5 gap-2 text-[10px] font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground uppercase transition-all"
                                >
                                    <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* ═══════ INTELLIGENCE TAB ═══════ */}
                        <TabsContent value="intelligence" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                            <div className="grid gap-6 md:grid-cols-12">
                                <div className="md:col-span-12 lg:col-span-8 rounded-2xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden shadow-[var(--shadow-card)]">
                                    <div className="flex items-center justify-between p-6 border-b border-border">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-success" />
                                                <h3 className="text-base font-semibold text-foreground">Marketplace Alphas</h3>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Trending items with highest conversion probability across 5 global networks.</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl text-[10px] font-bold uppercase tracking-wider h-9"
                                            onClick={fetchBestsellers}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> : "Refresh"}
                                        </Button>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            {isProcessing && bestsellers.length === 0 ? (
                                                Array(6).fill(0).map((_, i) => (
                                                    <div key={i} className="space-y-3">
                                                        <Skeleton className="h-48 w-full rounded-xl" />
                                                        <Skeleton className="h-4 w-3/4 rounded" />
                                                        <Skeleton className="h-4 w-1/4 rounded" />
                                                    </div>
                                                ))
                                            ) : (
                                                bestsellers.map((item: any) => (
                                                    <div key={item.id} className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all hover:shadow-[var(--shadow-card-hover)]">
                                                        <div className="aspect-square bg-secondary rounded-lg mb-4 p-4 flex items-center justify-center relative overflow-hidden">
                                                            <img
                                                                src={item.image_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${item.id}`}
                                                                className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500"
                                                                alt={item.title}
                                                            />
                                                            <Badge variant="secondary" className="absolute top-2 right-2 text-[8px] font-bold uppercase">
                                                                {item.marketplace}
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="text-[11px] font-semibold leading-tight line-clamp-2 text-muted-foreground">{item.title}</h4>
                                                            <div className="flex items-center justify-between pt-1">
                                                                <span className="text-base font-bold text-primary">${item.price_usd}</span>
                                                                <div className="flex items-center gap-1 bg-warning/10 px-2 py-0.5 rounded-full">
                                                                    <Star className="h-3 w-3 text-warning fill-warning" />
                                                                    <span className="text-[10px] font-bold text-warning">{item.rating || "4.9"}</span>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" className="w-full mt-2 h-9 text-[10px] font-bold text-muted-foreground border-dashed uppercase tracking-wider transition-all hover:text-primary hover:border-primary/30">
                                                                Source Analysis <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Neural Load Sidebar */}
                                <div className="md:col-span-12 lg:col-span-4 space-y-6">
                                    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-chart-4/10 blur-[80px] rounded-full translate-x-4 -translate-y-4" />
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-secondary rounded-xl border border-border">
                                                    <Cpu className="h-5 w-5 text-chart-4" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-foreground">Neural Load</h3>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Real-time status</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    { label: "Inference Power", value: "Ultra High", color: "bg-chart-4", width: "w-[88%]", textColor: "text-chart-4" },
                                                    { label: "Vision Bandwidth", value: "Unlimited", color: "bg-success", width: "w-[42%]", textColor: "text-success" },
                                                ].map(meter => (
                                                    <div key={meter.label} className="space-y-2">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                            <span>{meter.label}</span>
                                                            <span className={meter.textColor}>{meter.value}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                            <div className={`h-full ${meter.color} rounded-full ${meter.width}`} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-4 rounded-xl bg-secondary border border-border space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Enterprise Plan</h4>
                                                    <Badge className="bg-success/10 text-success border-success/20 text-[8px] font-bold uppercase">Active</Badge>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">Multilingual SEO & Social Content Automation enabled across all regional endpoints.</p>
                                                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-400 hover:to-indigo-500 font-semibold h-10 rounded-xl shadow-lg shadow-purple-500/20 text-xs">
                                                    Elevate Workspace
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Automation Protocol</h4>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                "Batch import suppliers from the Scraper Tools to feed AI Intelligence.",
                                                "Use Vision Lens for competitor image attribute extraction.",
                                            ].map((text, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <div className="h-6 w-6 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">{idx + 1}</div>
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">{text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ═══════ SOCIAL STUDIO TAB ═══════ */}
                        <TabsContent value="social" className="animate-in slide-in-from-right-4 duration-500 outline-none">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-8">
                                    <div className="space-y-2 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-primary/15 rounded-xl">
                                                <Facebook className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">Social Studio</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Convert Scrapings to Ad Revenue</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                                            Neural engine generates context-aware captions, hashtags, and CTA buttons tailored for high-CTR placements.
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Distribution Channel</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: "facebook", name: "Facebook", icon: Facebook },
                                                    { id: "instagram", name: "Instagram", icon: Instagram },
                                                    { id: "tiktok", name: "TikTok", icon: Zap }
                                                ].map((p) => (
                                                    <Button
                                                        key={p.id}
                                                        variant="outline"
                                                        className={cn(
                                                            "h-11 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-[10px] uppercase tracking-wider",
                                                            socialPlatform === p.id
                                                                ? "border-primary bg-primary/10 text-primary"
                                                                : "text-muted-foreground hover:bg-accent"
                                                        )}
                                                        onClick={() => setSocialPlatform(p.id)}
                                                    >
                                                        <p.icon className="h-3.5 w-3.5" /> {p.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Product Identity</label>
                                            <Input
                                                placeholder="Example: Nike Air Jordan 1 - Carbon Red"
                                                className="h-13 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                                                value={socialInput.title}
                                                onChange={(e) => setSocialInput({ ...socialInput, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Selling Proposition</label>
                                            <Textarea
                                                placeholder="Describe the 3 main selling points..."
                                                className="min-h-[140px] rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/20 focus-visible:border-primary/50"
                                                value={socialInput.description}
                                                onChange={(e) => setSocialInput({ ...socialInput, description: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSocialGenerate}
                                            disabled={isProcessing}
                                            className="w-full h-13 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 text-sm gap-2"
                                        >
                                            {isProcessing ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                                            Generate {socialPlatform} Ad
                                        </Button>
                                    </div>
                                </div>

                                {/* Social Result */}
                                <div className="flex flex-col">
                                    {socialResult ? (
                                        <div className="flex-1 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-8 relative overflow-hidden flex flex-col">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-x-20 -translate-y-20" />
                                            <div className="relative z-10 flex flex-col h-full space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <Badge className="bg-success/10 text-success border-success/20 text-[9px] font-bold uppercase tracking-wider">
                                                        Neural Output
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg"
                                                        onClick={() => { navigator.clipboard.writeText(socialResult || ""); toast.success("Copied!"); }}
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>

                                                <div className="flex-1 overflow-auto">
                                                    <div className="rounded-xl bg-secondary border border-border p-6 h-full">
                                                        <p className="text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap text-sm selection:bg-primary/30">
                                                            {socialResult}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-border flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Optimized for {socialPlatform}</span>
                                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs rounded-xl h-9 px-6">
                                                        Deploy to Social
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-16 text-center group hover:bg-accent/50 transition-all">
                                            <div className="w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <MessageSquare className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
                                            </div>
                                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Command Input Required</h3>
                                            <p className="text-xs text-muted-foreground/60 mt-3 max-w-[220px]">
                                                Provide product parameters to begin synthesis.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* ═══════ VISION LENS TAB ═══════ */}
                        <TabsContent value="vision" className="animate-in fade-in duration-500 outline-none">
                            <div className="grid gap-6 md:grid-cols-12">
                                <div className="md:col-span-12 lg:col-span-7 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-10">
                                    <div
                                        className="group relative rounded-2xl border-2 border-dashed border-border p-20 text-center hover:border-success/40 transition-all bg-background cursor-pointer overflow-hidden"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleVisionUpload}
                                            accept="image/*"
                                        />
                                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-success/10 border border-success/20 mb-8 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-success/10">
                                            <Upload className="h-10 w-10 text-success" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-foreground">Vision Scanning Hub</h3>
                                            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                                                Ingest product imagery for automatic attribute parsing. Works for retail photos, spec sheets, and labels.
                                            </p>
                                        </div>
                                        <Button className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 px-8 h-12 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 text-sm">
                                            Initiate Scan
                                        </Button>
                                    </div>
                                </div>

                                <div className="md:col-span-12 lg:col-span-5">
                                    {visionResult ? (
                                        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden h-full flex flex-col">
                                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 relative text-white">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                                        <Eye className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold">Vision Report</h3>
                                                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">Status: Processed</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 space-y-6 overflow-auto">
                                                <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Neural Extractions</h5>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {Object.entries(visionResult).map(([key, val]: [string, any], idx) => (
                                                        <div key={idx} className="bg-secondary border border-border p-4 rounded-xl hover:shadow-[var(--shadow-card-hover)] transition-all group">
                                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1 group-hover:text-success transition-colors">{key}</p>
                                                            <p className="text-xs font-semibold text-foreground/80 line-clamp-1">{String(val)}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-4 rounded-xl border border-success/20 bg-success/5 flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase text-success tracking-wider">Neural Match</p>
                                                        <p className="text-xs text-success/60 mt-0.5">98.4% Confidence</p>
                                                    </div>
                                                </div>

                                                <Button
                                                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl text-xs uppercase tracking-wider"
                                                    onClick={() => { toast.success("Product attributes committed to catalog."); setVisionResult(null); }}
                                                >
                                                    Commit to Catalog
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-16 text-center group hover:bg-accent/50 transition-all">
                                            <div className="w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-500">
                                                <Eye className="h-10 w-10 text-muted-foreground/30 group-hover:text-success/40 transition-colors" />
                                            </div>
                                            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Optic Payload Missing</h4>
                                            <p className="text-[10px] text-muted-foreground/60 mt-3 max-w-[180px]">
                                                The vision system is live and awaiting image buffer.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* ═══════ LOCALISER TAB ═══════ */}
                        <TabsContent value="localiser" className="animate-in fade-in duration-500 outline-none">
                            <div className="max-w-[1200px] mx-auto">
                                <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                    <div className="bg-secondary p-8 border-b border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-card rounded-xl border border-border shadow-sm">
                                                <Languages className="h-7 w-7 text-info" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground">Translation Engine</h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                    Enterprise-grade EN <ArrowRight className="h-3 w-3" /> BN semantic localization
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider">Source: World English</Badge>
                                                <Textarea
                                                    placeholder="Inject source text for neural translation..."
                                                    className="min-h-[260px] rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-info/20 focus-visible:border-info/50 text-sm"
                                                    value={translationInput}
                                                    onChange={(e) => setTranslationInput(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Badge className="bg-success/10 text-success border-success/20 text-[9px] font-bold uppercase tracking-wider">Target: Native Bangla</Badge>
                                                <div className={cn(
                                                    "min-h-[260px] rounded-xl p-6 text-lg flex items-center justify-center text-center transition-all duration-500",
                                                    translationResult
                                                        ? "bg-success/5 text-foreground border border-success/20"
                                                        : "bg-secondary text-muted-foreground/40 border-2 border-dashed border-border"
                                                )}>
                                                    {translationResult || "অপেক্ষমাণ টেক্সট ইনজেকশন..."}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                onClick={handleTranslation}
                                                disabled={isProcessing}
                                                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 text-sm"
                                            >
                                                {isProcessing ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                                                Neural Sync
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-14 px-6 rounded-xl font-semibold text-xs uppercase tracking-wider"
                                                onClick={() => bulkTranslateRef.current?.click()}
                                            >
                                                <input type="file" className="hidden" ref={bulkTranslateRef} accept=".csv,.json,.xlsx" onChange={handleBulkTranslate} />
                                                <Upload className="h-4 w-4 mr-2" /> Bulk Localise
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ═══════ SEO HUB TAB ═══════ */}
                        <TabsContent value="seo" className="animate-in fade-in duration-500 outline-none">
                            <div className="max-w-[1200px] mx-auto grid gap-6 md:grid-cols-2">
                                <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-8">
                                    <div className="space-y-2 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-info/15 rounded-xl">
                                                <Search className="h-5 w-5 text-info" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">SEO Command Center</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Rank Dominator V4.0</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                                            Optimization protocol for marketplace visibility. Generates meta-tags, structured data, and keyword-dense titles.
                                        </p>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Base Metadata</label>
                                            <Input
                                                placeholder="Enter product title or URL..."
                                                className="h-13 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:border-info/50 focus-visible:ring-info/20"
                                                value={seoInput.title}
                                                onChange={(e) => setSeoInput({ ...seoInput, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Seed Keywords</label>
                                            <Input
                                                placeholder="Example: cheap, fast, premium..."
                                                className="h-13 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:border-info/50 focus-visible:ring-info/20"
                                                value={seoInput.keywords}
                                                onChange={(e) => setSeoInput({ ...seoInput, keywords: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSeoOptimize}
                                            disabled={isProcessing}
                                            className="w-full h-13 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 text-sm gap-2"
                                        >
                                            {isProcessing ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                            Execute SEO Analysis
                                        </Button>
                                    </div>
                                </div>

                                {/* SEO Result */}
                                <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-8 relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-info/5 blur-[100px] rounded-full translate-x-20 -translate-y-20" />
                                    {seoResult ? (
                                        <div className="relative z-10 flex flex-col h-full space-y-6">
                                            <Badge className="w-fit bg-success/10 text-success border-success/20 text-[9px] font-bold uppercase tracking-wider">Success</Badge>
                                            <div className="space-y-5 flex-1 overflow-auto">
                                                <div className="space-y-2">
                                                    <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Neural Title</h5>
                                                    <div className="bg-secondary border border-border p-4 rounded-xl flex items-center justify-between gap-3">
                                                        <p className="text-sm font-semibold text-foreground/80 line-clamp-1">{seoResult.title}</p>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => { navigator.clipboard.writeText(seoResult.title); toast.success("Copied!"); }}
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Keywords</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(seoResult.keywords || []).map((kw: string, i: number) => (
                                                            <Badge key={i} variant="secondary" className="px-3 py-1 text-[10px] rounded-lg">#{kw}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Meta Description</h5>
                                                    <div className="bg-secondary border border-border p-5 rounded-xl">
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{seoResult.meta_description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl text-xs uppercase tracking-wider mt-auto">
                                                Export JSON-LD
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center mb-6">
                                                <Search className="h-10 w-10 text-muted-foreground/30" />
                                            </div>
                                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Waiting for Command</h4>
                                            <p className="text-[10px] text-muted-foreground/60 mt-3 max-w-[220px]">
                                                Connect base product metadata to trigger SEO generation.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* ═══════ AUTOMATION TAB ═══════ */}
                        <TabsContent value="automation" className="animate-in fade-in duration-500 outline-none">
                            <div className="grid gap-8 md:grid-cols-12">
                                <div className="md:col-span-12 lg:col-span-7 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
                                                    AI Scraper Sync
                                                    {isAutomationActive && <div className="h-2 w-2 rounded-full bg-success animate-pulse" />}
                                                </h3>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Autonomous Enrichment Protocol</p>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    setIsAutomationActive(!isAutomationActive);
                                                    if (!isAutomationActive) {
                                                        const newLog = { time: new Date().toLocaleTimeString(), msg: "Initiating Neural Sync Cycle...", type: "system" };
                                                        setAutomationLogs([newLog]);
                                                        toast.success("AI Automation Started");
                                                    } else {
                                                        toast.info("Automation Paused");
                                                    }
                                                }}
                                                className={cn(
                                                    "h-12 px-8 rounded-xl font-bold shadow-lg transition-all flex gap-3",
                                                    isAutomationActive
                                                        ? "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive text-white"
                                                        : "bg-primary text-white shadow-primary/20"
                                                )}
                                            >
                                                {isAutomationActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                {isAutomationActive ? "Stop Engine" : "Ignite Engine"}
                                            </Button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: "AI Translation BN", id: "auto_bn", active: true },
                                                    { label: "Social Ad Generation", id: "auto_social", active: true },
                                                    { label: "SEO Meta Optimization", id: "auto_seo", active: true },
                                                    { label: "Vision Attribution", id: "auto_vision", active: false },
                                                ].map(rule => (
                                                    <div key={rule.id} className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between group hover:border-primary/20 transition-all">
                                                        <span className="text-xs font-bold text-foreground/80">{rule.label}</span>
                                                        <div className={cn("h-4 w-4 rounded shadow-sm border border-border flex items-center justify-center", rule.active ? "bg-primary" : "bg-background")}>
                                                            {rule.active && <Check className="h-3 w-3 text-white" />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <BrainCircuit className="h-5 w-5 text-primary" />
                                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Workflow Logic</h4>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium capitalize">
                                                    Every product scraped in the <span className="text-primary font-bold">IOR Scraper</span> will be automatically passed through the active rules above. Results will be saved to the Global Catalog.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { label: "Nodes Connected", val: "542", trend: "+12", icon: Globe },
                                            { label: "AI Throughput", val: "1.2k/hr", trend: "High", icon: Cpu },
                                            { label: "Success Rate", val: "99.8%", trend: "Max", icon: CheckCircle2 },
                                        ].map((stat, i) => (
                                            <Card key={i} className="p-5 rounded-2xl border border-border bg-card text-center space-y-2">
                                                <div className="mx-auto h-8 w-8 rounded-lg bg-secondary flex items-center justify-center mb-1">
                                                    <stat.icon className="h-4 w-4 text-muted-foreground/60" />
                                                </div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                                <p className="text-xl font-bold text-foreground">{stat.val}</p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-12 lg:col-span-5 flex flex-col h-full min-h-[500px]">
                                    <div className="flex-1 rounded-2xl border border-border bg-foreground dark:bg-card overflow-hidden shadow-2xl flex flex-col">
                                        <div className="p-4 border-b border-white/5 bg-black/50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Terminal className="h-4 w-4 text-white/50" />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Neural Console</h4>
                                            </div>
                                            {isAutomationActive && <Badge className="bg-primary/20 text-primary border-primary/40 animate-pulse text-[8px] font-black uppercase tracking-[0.2em]">Live Stream</Badge>}
                                        </div>
                                        <div className="flex-1 p-6 bg-black font-mono text-[10px] leading-relaxed overflow-y-auto custom-scrollbar text-white">
                                            {automationLogs.length === 0 ? (
                                                <div className="h-full flex items-center justify-center text-white/10 select-none">
                                                    <p className="uppercase tracking-[0.3em] font-black">Awating Injection...</p>
                                                </div>
                                            ) : (
                                                automationLogs.map((log, i) => (
                                                    <div key={i} className="flex gap-4 mb-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                        <span className="text-white/20 whitespace-nowrap">[{log.time}]</span>
                                                        <span className={cn(
                                                            log.type === "system" ? "text-primary" :
                                                                log.type === "success" ? "text-success" :
                                                                    log.type === "process" ? "text-warning" :
                                                                        log.type === "heartbeat" ? "text-chart-4" :
                                                                            "text-white/60"
                                                        )}>
                                                            {log.msg}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                            {isAutomationActive && (
                                                <div className="flex gap-4 mb-2 animate-pulse mt-4">
                                                    <span className="text-white/20">[--:--:--]</span>
                                                    <span className="text-white/40 italic">Listening for IOR Scraper events...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
}
