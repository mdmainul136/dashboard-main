"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search, Globe, RefreshCw, ShoppingCart, DollarSign, Calculator,
    ChevronRight, Zap, Info, Database, FileUp, History, Sparkles,
    CheckCircle2, ListFilter, ArrowUpDown, BrainCircuit, ArrowRight,
    Package, TrendingUp, Shield, Layers, Activity, Clock, AlertTriangle,
    BarChart3, Settings2, ShieldAlert, Terminal, Network, Star, ExternalLink,
    Filter, Play, Trash2, Plus, MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PriceBreakdown } from "@/components/ior/PriceBreakdown";
import { useIorScraper, ScrapeResult } from "@/hooks/ior/useIorScraper";
import { useIorSourcing } from "@/hooks/ior/useIorSourcing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function IorScraperPage() {
    const router = useRouter();
    const [activeMainTab, setActiveMainTab] = useState("dashboard");
    const [url, setUrl] = useState("");
    const [bulkUrls, setBulkUrls] = useState("");
    const [bulkResults, setBulkResults] = useState<ScrapeResult[]>([]);
    const [discoverySearch, setDiscoverySearch] = useState("");
    const [discoveryItems, setDiscoveryItems] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        isScraping,
        result,
        setResult,
        scrapeProduct,
        bulkScrape,
        fetchCatalog,
        importBulkCatalog
    } = useIorScraper();

    const { stats, fetchSourcingStats } = useIorSourcing();

    useEffect(() => {
        fetchSourcingStats();
    }, [fetchSourcingStats]);

    const handleScrape = async () => {
        if (!url) {
            toast.error("Please enter a product URL");
            return;
        }
        await scrapeProduct(url);
    };

    const handleBulkScrape = async () => {
        const urls = bulkUrls.split("\n").map(u => u.trim()).filter(u => u !== "");
        if (urls.length === 0) {
            toast.error("Please enter at least one URL");
            return;
        }
        const results = await bulkScrape(urls);
        if (results) setBulkResults(results);
    };

    const handleDiscoverySearch = async () => {
        const items = await fetchCatalog(discoverySearch);
        if (items) setDiscoveryItems(items);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await importBulkCatalog(file);
        }
    };

    const handleSendToAiStudio = (product: ScrapeResult) => {
        const params = new URLSearchParams({
            title: product.title || "",
            price: String(product.price_usd || ""),
            marketplace: product.marketplace || "",
            image: product.image || "",
        });
        router.push(`/ior/ai-studio?${params.toString()}`);
        toast.success("Routing product to AI Studio...");
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* ─── Header ─── */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                                    <Globe className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold tracking-widest uppercase">
                                    Scraper Engine 4.0
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Sourcing & Extraction</h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Enterprise-grade web extraction for Amazon, Walmart, Alibaba and 50+ global marketplaces.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="rounded-xl h-10 text-xs font-semibold gap-2 border-border bg-card">
                                <Network className="h-4 w-4 text-success" /> Network: Active
                            </Button>
                            <Button className="bg-primary text-primary-foreground rounded-xl font-semibold h-10 px-6 text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setActiveMainTab("import")}>
                                <Plus className="h-4 w-4 mr-2" /> New Extraction
                            </Button>
                        </div>
                    </div>

                    <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
                        <TabsList className="bg-secondary/50 p-1 rounded-xl w-fit mb-8 border border-border overflow-x-auto h-auto flex-nowrap">
                            <TabsTrigger value="dashboard" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <BarChart3 className="h-3.5 w-3.5 mr-2" /> Dashboard
                            </TabsTrigger>
                            <TabsTrigger value="import" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <FileUp className="h-3.5 w-3.5 mr-2" /> Import & Crawl
                            </TabsTrigger>
                            <TabsTrigger value="intel" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <Activity className="h-3.5 w-3.5 mr-2" /> Comparative Intel
                            </TabsTrigger>
                            <TabsTrigger value="discovery" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <Sparkles className="h-3.5 w-3.5 mr-2" /> Discovery
                            </TabsTrigger>
                            <TabsTrigger value="logs" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <Terminal className="h-3.5 w-3.5 mr-2" /> Activity Logs
                            </TabsTrigger>
                            <TabsTrigger value="mapping" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <Settings2 className="h-3.5 w-3.5 mr-2" /> Mapping
                            </TabsTrigger>
                            <TabsTrigger value="network" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <Shield className="h-3.5 w-3.5 mr-2" /> Network
                            </TabsTrigger>
                            <TabsTrigger value="scheduler" className="rounded-lg px-6 py-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                <Clock className="h-3.5 w-3.5 mr-2" /> Scheduler
                            </TabsTrigger>
                        </TabsList>

                        {/* ─── Dashboard Tab ─── */}
                        <TabsContent value="dashboard" className="animate-in fade-in duration-500 space-y-8 mt-0">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Extractions", value: stats?.total_scrapes?.toLocaleString() || "42,891", icon: Layers, color: "text-blue-500", trend: "+12%" },
                                    { label: "Success Rate", value: (stats?.success_rate || "98.4") + "%", icon: CheckCircle2, color: "text-success", trend: "Elite" },
                                    { label: "Price Alerts", value: "152", icon: TrendingUp, color: "text-amber-500", trend: "Active" },
                                    { label: "Proxy Bandwidth", value: "1.2 TB", icon: Activity, color: "text-purple-500", trend: "Stable" },
                                ].map(s => (
                                    <Card key={s.label} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                                                <s.icon className={cn("h-4 w-4", s.color)} />
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                                <Badge className="bg-success/10 text-success border-none text-[9px] font-black uppercase">{s.trend}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-8 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                        <CardHeader className="border-b border-border bg-secondary/30">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-base font-bold">Marketplace Performance</CardTitle>
                                                    <CardDescription className="text-xs">Extraction health across global nodes.</CardDescription>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary">Full Report</Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-4">
                                            {[
                                                { name: "Amazon US", health: 100, latency: "420ms", count: "12k" },
                                                { name: "Walmart", health: 98, latency: "850ms", count: "8k" },
                                                { name: "AliExpress", health: 92, latency: "1.2s", count: "15k" },
                                                { name: "eBay Global", health: 100, latency: "380ms", count: "5k" },
                                                { name: "Target", health: 85, latency: "2.1s", count: "2k" },
                                            ].map(m => (
                                                <div key={m.name} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/30 transition-colors">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        <span className="text-sm font-semibold w-24">{m.name}</span>
                                                        <div className="flex-1 max-w-[200px]">
                                                            <Progress value={m.health} className="h-1 bg-secondary" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-muted-foreground">{m.health}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Latency</p>
                                                            <p className="text-xs font-bold">{m.latency}</p>
                                                        </div>
                                                        <div className="text-right w-12">
                                                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Scrapes</p>
                                                            <p className="text-xs font-bold">{m.count}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="lg:col-span-4 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-foreground dark:bg-card p-6 shadow-xl text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full translate-x-8 -translate-y-8" />
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Zap className="h-6 w-6 text-primary" />
                                                <h3 className="text-xl font-bold italic tracking-tight">Turbo Sync</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                                                    <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Global Pool Health</p>
                                                    <p className="text-2xl font-black text-white">99.98%</p>
                                                </div>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    Our global residential node network automatically handles rotating headers, cookies, and fingerprint management.
                                                </p>
                                                <Button className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
                                                    Node Distribution
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>

                                </div>
                            </div>

                            <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="p-8 border-b border-border bg-secondary/10">
                                    <h3 className="text-base font-bold">Data Propagation Sync</h3>
                                    <p className="text-xs text-muted-foreground">Monitoring data flow from scraper nodes to IOR internal modules.</p>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/30">
                                            <TableHead className="text-[10px] font-bold uppercase pl-8 py-5">Destination</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Sync Mode</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Payload Count</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-center">Health</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold uppercase pr-8">Last Push</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { dest: "AI Studio (Neural Sync)", mode: "Real-time", count: "1,204", health: "99.9%", last: "2m ago" },
                                            { dest: "Global Product Catalog", mode: "Batch (4h)", count: "15,891", health: "100%", last: "1h ago" },
                                            { dest: "Price Alert Engine", mode: "Polling (15m)", count: "482", health: "98.4%", last: "5m ago" },
                                        ].map((sync, i) => (
                                            <TableRow key={i} className="hover:bg-accent/50 transition-colors">
                                                <TableCell className="pl-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                        <span className="text-sm font-bold text-foreground">{sync.dest}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-semibold text-muted-foreground">{sync.mode}</TableCell>
                                                <TableCell className="text-center font-mono text-xs font-bold text-primary">{sync.count}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="bg-success/5 text-success border-success/20 text-[9px] font-black uppercase">{sync.health}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-8 text-xs font-medium text-muted-foreground">{sync.last}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </TabsContent>

                        {/* ─── Import & Crawl Tab ─── */}
                        <TabsContent value="import" className="animate-in fade-in duration-500 space-y-8 mt-0">
                            <div className="grid lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-8 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden shadow-[var(--shadow-card)]">
                                        <Tabs defaultValue="url" className="w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border bg-secondary/10">
                                                <div className="space-y-1">
                                                    <h3 className="text-base font-bold text-foreground">Crawl Interface</h3>
                                                    <p className="text-xs text-muted-foreground">Select your extraction method</p>
                                                </div>
                                                <TabsList className="bg-background border border-border p-1 rounded-xl h-auto">
                                                    <TabsTrigger value="url" className="rounded-lg py-1.5 px-4 text-[10px] font-bold tracking-widest uppercase">Direct URL</TabsTrigger>
                                                    <TabsTrigger value="bulk" className="rounded-lg py-1.5 px-4 text-[10px] font-bold tracking-widest uppercase">Bulk CSV</TabsTrigger>
                                                </TabsList>
                                            </div>

                                            <div className="p-6">
                                                <TabsContent value="url" className="space-y-6 mt-0">
                                                    <div className="flex gap-3">
                                                        <div className="relative flex-1">
                                                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                placeholder="Paste marketplace product URL..."
                                                                className="pl-12 h-14 rounded-xl bg-background border-border text-sm font-medium"
                                                                value={url}
                                                                onChange={(e) => setUrl(e.target.value)}
                                                                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                                                            />
                                                        </div>
                                                        <Button
                                                            className="h-14 px-8 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg"
                                                            onClick={handleScrape}
                                                            disabled={isScraping}
                                                        >
                                                            {isScraping ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                                                            Inspect
                                                        </Button>
                                                    </div>
                                                    <div className="pt-6 border-t border-border space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Batching</h4>
                                                            <Badge variant="outline" className="text-[9px] font-bold tracking-widest bg-secondary/50">Max 50 URLs</Badge>
                                                        </div>
                                                        <Textarea
                                                            placeholder="Paste multiple URLs (one per line)..."
                                                            className="min-h-[120px] rounded-xl bg-background border-border text-xs font-mono"
                                                            value={bulkUrls}
                                                            onChange={(e) => setBulkUrls(e.target.value)}
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            className="w-full h-11 rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5 font-bold text-xs uppercase tracking-widest"
                                                            onClick={handleBulkScrape}
                                                            disabled={isScraping}
                                                        >
                                                            Process Multi-Node Batch
                                                        </Button>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="bulk" className="space-y-6 mt-0">
                                                    <div
                                                        className="group relative rounded-2xl border-2 border-dashed border-border p-16 text-center hover:border-primary/40 transition-all bg-secondary/20 cursor-pointer"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.xlsx" />
                                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                                            <FileUp className="h-8 w-8 text-primary" />
                                                        </div>
                                                        <h3 className="text-lg font-bold">Upload Manifest</h3>
                                                        <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
                                                            Drop your CSV or XLSX product catalog. Our AI mapping engine will auto-detect headers.
                                                        </p>
                                                    </div>
                                                </TabsContent>

                                            </div>
                                        </Tabs>
                                    </Card>

                                    {bulkResults.length > 0 && (
                                        <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl animate-in slide-in-from-bottom-8 duration-500">
                                            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
                                                <div className="flex items-center gap-3">
                                                    <Package className="h-5 w-5 text-primary" />
                                                    <h3 className="text-base font-bold italic tracking-tight">Batch Results ({bulkResults.length})</h3>
                                                </div>
                                                <Button className="h-9 rounded-lg bg-primary text-xs font-bold shadow-lg">Import Batch</Button>
                                            </div>
                                            <div className="grid sm:grid-cols-2 p-6 gap-4">
                                                {bulkResults.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4 p-3 rounded-xl border border-border bg-background hover:border-primary/50 transition-all cursor-pointer group">
                                                        <div className="h-16 w-16 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center p-2">
                                                            <img src={item.image} className="max-h-full max-w-full object-contain" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-xs font-bold text-foreground truncate">{item.title}</span>
                                                            <div className="flex items-center justify-between mt-auto">
                                                                <span className="text-[10px] font-black text-primary">৳{item.total.toLocaleString()}</span>
                                                                <Badge className="bg-secondary text-[9px] font-bold py-0 h-4 border-none">{item.marketplace}</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    )}
                                </div>

                                <div className="lg:col-span-4 space-y-6">
                                    {result ? (
                                        <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
                                            <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
                                                <div className="aspect-square bg-secondary p-8 flex items-center justify-center relative">
                                                    <img src={result.image} className="max-h-full max-w-full object-contain drop-shadow-xl" />
                                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                                        <Badge className="bg-primary text-primary-foreground font-black text-[9px] tracking-[0.2em] uppercase px-3 py-1">
                                                            {result.marketplace}
                                                        </Badge>
                                                        <Badge className="bg-success text-success-foreground font-black text-[9px] tracking-[0.2em] uppercase px-3 py-1">
                                                            In Stock
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="p-6 space-y-6">
                                                    <div>
                                                        <h2 className="text-base font-bold leading-snug line-clamp-2">{result.title}</h2>
                                                        <div className="flex items-center gap-1.5 mt-2">
                                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                                                            <span className="text-[10px] font-bold text-muted-foreground ml-1">4.8 (2.4k reviews)</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="p-4 rounded-xl border border-border bg-secondary/30">
                                                            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Unit Price</p>
                                                            <p className="text-lg font-bold">${result.price_usd}</p>
                                                        </div>
                                                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                                            <p className="text-[9px] font-black uppercase text-primary mb-1">Landed BDT</p>
                                                            <p className="text-lg font-bold text-primary">৳{result.total.toLocaleString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Available Variants</h4>
                                                            <span className="text-[10px] font-bold text-primary">12 SKU Variants Found</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["Red", "Blue", "Black", "XL", "L", "M"].map(v => (
                                                                <Badge key={v} variant="outline" className="text-[10px] font-bold rounded-lg px-2 border-border cursor-pointer hover:bg-secondary">{v}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2 pt-2">
                                                        <Button className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 gap-2">
                                                            <ShoppingCart className="h-4 w-4" /> Create Order
                                                        </Button>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Button variant="outline" className="rounded-xl font-bold text-xs h-10 border-border" onClick={() => handleSendToAiStudio(result)}>
                                                                AI Studio
                                                            </Button>
                                                            <Button variant="outline" className="rounded-xl font-bold text-xs h-10 border-border" asChild>
                                                                <a href={result.source_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                                                                    Source <ExternalLink className="h-3.5 w-3.5" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>

                                            <PriceBreakdown data={{
                                                price_usd: result.price_usd,
                                                estimated_duty_bdt: result.duty,
                                                shipping_fee_bdt: result.shipping,
                                                total_landed_bdt: result.total
                                            }} />
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center h-[600px] flex flex-col items-center justify-center gap-6">
                                            <div className="h-20 w-20 rounded-3xl bg-secondary flex items-center justify-center shadow-inner">
                                                <Globe className="h-10 w-10 text-muted-foreground/40 animate-pulse" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-base font-bold text-muted-foreground uppercase tracking-widest">Awaiting Analysis</h3>
                                                <p className="text-[11px] text-muted-foreground/60 max-w-[200px] mx-auto leading-relaxed">
                                                    Enter a URL to see real-time landed pricing and product intelligence.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* ─── Comparative Intel Tab ─── */}
                        <TabsContent value="intel" className="animate-in fade-in duration-500 space-y-8 mt-0">
                            <div className="grid lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-12 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                        <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-base font-bold">Cross-Platform Price Intelligence</h3>
                                                <p className="text-xs text-muted-foreground">Live benchmarking across 5 global nodes.</p>
                                            </div>
                                            <Badge className="bg-success/10 text-success border-none text-[9px] font-black uppercase tracking-widest">Deep Sync: Live</Badge>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-secondary/30">
                                                    <TableHead className="text-[10px] font-bold uppercase pl-8 py-5">Product Identity</TableHead>
                                                    <TableHead className="text-[10px] font-bold uppercase">Amazon US</TableHead>
                                                    <TableHead className="text-[10px] font-bold uppercase">Walmart</TableHead>
                                                    <TableHead className="text-[10px] font-bold uppercase">Alibaba</TableHead>
                                                    <TableHead className="text-[10px] font-bold uppercase">eBay</TableHead>
                                                    <TableHead className="text-right text-[10px] font-bold uppercase pr-8">Arbitrage Alpha</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {[
                                                    { name: "Sony PS5 Console", amz: "$499", wal: "$494", ali: "$480", eby: "$510", alpha: "+৳4,200" },
                                                    { name: "MacBook Pro M3 14\"", amz: "$1,599", wal: "$1,599", ali: "$1,520", eby: "$1,620", alpha: "+৳12,500" },
                                                    { name: "DJI Mini 4 Pro", amz: "$759", wal: "$759", ali: "$695", eby: "$780", alpha: "+৳8,400" },
                                                    { name: "Bose QC Ultra", amz: "$429", wal: "$429", ali: "$390", eby: "$440", alpha: "+৳3,100" },
                                                ].map((p, i) => (
                                                    <TableRow key={i} className="hover:bg-accent/50 transition-colors">
                                                        <TableCell className="pl-8 py-5">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-foreground">{p.name}</span>
                                                                <span className="text-[9px] text-muted-foreground uppercase font-medium">Synced 4m ago</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-mono text-xs font-bold">{p.amz}</TableCell>
                                                        <TableCell className="font-mono text-xs font-bold">{p.wal}</TableCell>
                                                        <TableCell className="font-mono text-xs font-bold text-success">{p.ali}</TableCell>
                                                        <TableCell className="font-mono text-xs font-bold text-muted-foreground">{p.eby}</TableCell>
                                                        <TableCell className="text-right pr-8">
                                                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold">{p.alpha}</Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ─── Discovery Tab ─── */}
                        <TabsContent value="discovery" className="animate-in fade-in duration-500 space-y-8 mt-0">
                            <div className="space-y-6">
                                <Card className="p-8 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Search 1.2M+ historical sourcing nodes by keyword, SKU or ASIN..."
                                                className="h-14 rounded-xl bg-background border-border pl-12 text-sm font-medium"
                                                value={discoverySearch}
                                                onChange={(e) => setDiscoverySearch(e.target.value)}
                                            />
                                        </div>
                                        <Button className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" onClick={handleDiscoverySearch}>
                                            Discovery Analysis
                                        </Button>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { title: "Portable Monitor v2", price: "$124", margin: "42%", trend: "+12%", status: "High Demand" },
                                        { title: "USB-C Hub 11-in-1", price: "$45", margin: "65%", trend: "+24%", status: "Bestseller" },
                                        { title: "Mechanical Keyboard", price: "$89", margin: "52%", trend: "-5%", status: "Stable" },
                                        { title: "Noise Cancelling Buds", price: "$156", margin: "38%", trend: "+18%", status: "Trending" },
                                    ].map((item, i) => (
                                        <Card key={i} className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all group">
                                            <div className="aspect-[4/3] bg-secondary/50 flex items-center justify-center p-6 border-b border-border">
                                                <Package className="h-12 w-12 text-muted-foreground/20 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.title}</h4>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs font-bold text-primary">{item.price}</span>
                                                        <Badge className="bg-success/10 text-success border-none text-[9px] font-black uppercase">{item.margin} GPM</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.status}</span>
                                                    <span className={cn("text-xs font-bold", item.trend.startsWith('+') ? "text-success" : "text-destructive")}>{item.trend}</span>
                                                </div>
                                                <Button variant="outline" className="w-full h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Inspect Node</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* ─── Logs Tab ─── */}
                        <TabsContent value="logs" className="animate-in fade-in duration-500 space-y-6 mt-0">
                            <Card className="rounded-2xl border border-border bg-foreground dark:bg-card overflow-hidden shadow-2xl">
                                <div className="p-4 border-b border-white/10 bg-black/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Neural Node Telemetry</h3>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-bold">STREAMING LIVE</Badge>
                                </div>
                                <div className="p-6 bg-black font-mono text-[10px] leading-relaxed h-48 overflow-y-auto custom-scrollbar">
                                    {[
                                        { time: "12:06:42", msg: "Initializing Playwright stealth engine...", color: "text-white/40" },
                                        { time: "12:06:43", msg: "Rotating proxy pool [US-RESIDENTIAL-4229]...", color: "text-blue-400" },
                                        { time: "12:06:45", msg: "GET https://www.amazon.com/dp/B0CXF3W3Y7 - 200 OK", color: "text-success" },
                                        { time: "12:06:46", msg: "Extracting DOM attributes via AI selector [confidence: 99.4%]", color: "text-amber-400" },
                                        { time: "12:06:48", msg: "SSL Handshake verified. Header rotation complete.", color: "text-white/40" },
                                        { time: "12:06:50", msg: "Bypassing Akamai WAF [Signature: 0x82f2]", color: "text-purple-400 font-bold" },
                                        { time: "12:06:52", msg: "Syncing result to IOR Matrix...", color: "text-primary font-bold" },
                                    ].map((l, i) => (
                                        <div key={i} className="flex gap-4 mb-1">
                                            <span className="text-white/20">[{l.time}]</span>
                                            <span className={l.color}>{l.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                <CardHeader className="bg-secondary/30 border-b border-border flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-bold">Extraction History</CardTitle>
                                        <CardDescription className="text-xs">Audit log of all scrape requests and results.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">
                                            <Filter className="h-3.5 w-3.5 mr-2" /> Filter
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">
                                            Clear All
                                        </Button>
                                    </div>
                                </CardHeader>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/10">
                                            <TableHead className="text-[10px] font-black uppercase pl-6 py-4">Timestamp</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase">Source Node</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase">Agent Status</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase">Payload</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase text-right pr-6">Management</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { time: "2m ago", node: "US-EAST-1", status: "Success", type: "Single URL", payload: "Amazon - Echo Dot" },
                                            { time: "15m ago", node: "EU-WEST-2", status: "Banned", type: "Bulk Batch", payload: "Walmart - 42 items" },
                                            { time: "1h ago", node: "AS-SOUTH-1", status: "Success", type: "Discovery", payload: "AliExpress - Tools" },
                                            { time: "4h ago", node: "US-WEST-2", status: "Success", type: "Single URL", payload: "eBay - Vintage Lens" },
                                        ].map((log, i) => (
                                            <TableRow key={i} className="group hover:bg-secondary/20 transition-colors">
                                                <TableCell className="pl-6 py-4 font-mono text-[10px] text-muted-foreground">{log.time}</TableCell>
                                                <TableCell><Badge variant="outline" className="text-[9px] font-bold bg-secondary/10 px-2">{log.node}</Badge></TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest border-none px-2 py-0.5",
                                                        log.status === 'Success' ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                                                    )}>
                                                        {log.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-foreground">{log.payload}</span>
                                                        <span className="text-[9px] text-muted-foreground uppercase font-medium">{log.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </TabsContent>

                        {/* ─── Mapping Tab ─── */}
                        <TabsContent value="mapping" className="animate-in fade-in duration-500 space-y-6 mt-0">
                            <div className="grid lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-8 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                        <CardHeader className="bg-secondary/10 border-b border-border p-8">
                                            <CardTitle className="text-base font-bold">Source-to-Local Attribute Mapping</CardTitle>
                                            <CardDescription className="text-xs">Define how external marketplace attributes are mapped into your inventory schema.</CardDescription>
                                        </CardHeader>
                                        <div className="p-8 space-y-6">
                                            {[
                                                { field: "Product Title", source: "title | name | product_name", status: "Auto-mapped" },
                                                { field: "Price (USD)", source: "price | sale_price | current_price", status: "Auto-mapped" },
                                                { field: "Main Image", source: "image_url | primary_image | media[0]", status: "Auto-mapped" },
                                                { field: "Availability", source: "stock_status | availability | in_stock", status: "Manual Override" },
                                                { field: "Weight (lb)", source: "shipping_weight | item_weight", status: "Missing" },
                                            ].map(m => (
                                                <div key={m.field} className="flex items-center gap-6 p-4 rounded-xl border border-border bg-background">
                                                    <div className="w-1/3">
                                                        <p className="text-xs font-bold text-foreground">{m.field}</p>
                                                        <p className="text-[9px] text-muted-foreground uppercase font-black mt-0.5">Internal Field</p>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                                                    <div className="flex-1">
                                                        <Input defaultValue={m.source} className="h-9 text-xs font-mono bg-secondary/20 border-border" />
                                                    </div>
                                                    <div className="w-24 text-right">
                                                        <Badge className={cn(
                                                            "text-[9px] font-bold uppercase",
                                                            m.status === 'Auto-mapped' ? 'bg-primary/10 text-primary border-none' :
                                                                m.status === 'Missing' ? 'bg-destructive/10 text-destructive border-none' : 'bg-secondary text-muted-foreground border-none'
                                                        )}>{m.status}</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-6 bg-secondary/5 border-t border-border flex justify-end">
                                            <Button className="rounded-xl px-6 h-10 font-bold text-sm">Save Mapping Schema</Button>
                                        </div>
                                    </Card>
                                </div>
                                <div className="lg:col-span-4 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            <h4 className="text-sm font-bold">AI Mapping Suggester</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Our neural engine has analyzed the last 50,000 scrapes and suggests the following schema updates:
                                        </p>
                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold">UPC/EAN Detection</span>
                                                <Badge className="bg-success text-white text-[9px]">99% Confidence</Badge>
                                            </div>
                                            <Button variant="outline" className="w-full h-8 text-[10px] font-bold uppercase hover:bg-primary hover:text-white transition-all">Accept Suggestion</Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ─── Network & Anti-Bot Tab ─── */}
                        <TabsContent value="network" className="animate-in fade-in duration-500 space-y-8 mt-0">
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold">Anti-Bot Evasion</h3>
                                            <p className="text-xs text-muted-foreground">Configure global stealth and headless settings.</p>
                                        </div>
                                        <ShieldAlert className="h-8 w-8 text-primary opacity-20" />
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: "Headless Playwright", desc: "Use advanced browser rendering for JS sites", checked: true },
                                            { label: "Rotation Headers", desc: "Randomize User-Agents and TLS fingerprints", checked: true },
                                            { label: "Human Delay (AI)", desc: "Inject random typing and scrolling behavior", checked: true },
                                            { label: "Cookie Persistence", desc: "Maintain session state for checkout scraping", checked: false },
                                        ].map(s => (
                                            <div key={s.label} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/10">
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-foreground">{s.label}</p>
                                                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                                                </div>
                                                <Switch checked={s.checked} />
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold italic tracking-tight underline decoration-primary/30">Proxy Pool Status</h3>
                                            <Badge className="bg-success text-white">4,209 IPs LIVE</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-4 space-y-8">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                                <span>Residential Bandwidth Utilization</span>
                                                <span className="text-primary">12.4 / 50 GB</span>
                                            </div>
                                            <Progress value={25} className="h-2 bg-secondary" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border border-border bg-secondary/20 text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Ban Density</p>
                                                <p className="text-2xl font-black text-foreground">0.02%</p>
                                            </div>
                                            <div className="p-4 rounded-xl border border-border bg-secondary/20 text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Rotation Speed</p>
                                                <p className="text-2xl font-black text-primary">50ms</p>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-5 w-5 text-indigo-500" />
                                                <h5 className="text-sm font-bold text-indigo-700">Geo-Targeting Locked</h5>
                                            </div>
                                            <p className="text-[11px] text-indigo-600/70 leading-relaxed font-medium">
                                                Currently using US/EU nodes for 100% pricing accuracy. Auto-routing to nearest node enabled.
                                            </p>
                                            <Button variant="link" className="p-0 h-fit text-indigo-700 text-[10px] font-black uppercase tracking-widest">Switch to SG/AS Pool</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* ─── Scheduler Tab ─── */}
                        <TabsContent value="scheduler" className="animate-in fade-in duration-500 space-y-6 mt-0">
                            <div className="grid md:grid-cols-12 gap-8">
                                <Card className="md:col-span-8 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                                    <CardHeader className="p-8 border-b border-border bg-secondary/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base font-bold">Sync Schedule Matrix</CardTitle>
                                                <CardDescription className="text-xs">Manage automated price and availability tracking.</CardDescription>
                                            </div>
                                            <Button className="h-10 rounded-xl bg-primary shadow-lg gap-2 text-xs font-bold">
                                                <Plus className="h-4 w-4" /> New Cron Node
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary/5">
                                                <TableHead className="text-[10px] font-black uppercase pl-8 py-4">Task Purpose</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase">Frequency</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase">Next Execution</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase text-right pr-8">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                { task: "Amazon Price Tracking", freq: "Every 4 hrs", next: "10:42 AM", status: "Active" },
                                                { task: "Inventory Availability Scraper", freq: "Daily @ 12 PM", next: "12:00 PM", status: "Paused" },
                                                { task: "Global Shipping Rate Sync", freq: "Weekly", next: "Sunday", status: "Active" },
                                                { task: "HS-Code Market Volatility", freq: "Every 2 hrs", next: "11:00 AM", status: "Active" },
                                            ].map((job, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="pl-8 py-5 font-bold text-sm text-foreground">{job.task}</TableCell>
                                                    <TableCell className="text-xs font-semibold text-muted-foreground">{job.freq}</TableCell>
                                                    <TableCell className="text-xs font-bold text-primary">{job.next}</TableCell>
                                                    <TableCell className="pr-8 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <Badge className={cn("text-[10px] font-bold uppercase", job.status === 'Active' ? 'bg-success/10 text-success border-none' : 'bg-muted text-muted-foreground')}>{job.status}</Badge>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                                    <DropdownMenuItem className="gap-2 text-xs font-semibold"><Play className="h-3.5 w-3.5" /> Run Now</DropdownMenuItem>
                                                                    <DropdownMenuItem className="gap-2 text-xs font-semibold"><Settings2 className="h-3.5 w-3.5" /> Edit Cron</DropdownMenuItem>
                                                                    <DropdownMenuItem className="gap-2 text-xs font-semibold text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>

                                <div className="md:col-span-4 space-y-6">
                                    <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                                <Clock className="h-5 w-5 text-primary" />
                                            </div>
                                            <h4 className="text-sm font-bold">Global Sync Policy</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Base Frequency</label>
                                                <Select defaultValue="adaptive">
                                                    <SelectTrigger className="h-11 rounded-xl bg-secondary/30 border-border text-xs font-bold">
                                                        <SelectValue placeholder="Select frequency" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="adaptive" className="text-xs font-medium">Adaptive AI Learning</SelectItem>
                                                        <SelectItem value="realtime" className="text-xs font-medium">Real-time (High Cost)</SelectItem>
                                                        <SelectItem value="daily" className="text-xs font-medium">Daily Sync</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/10">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-foreground">OOS Auto-Disable</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-black">Turn off if OOS found</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <Button className="w-full h-11 bg-foreground dark:bg-card hover:bg-foreground/90 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg">Save Sync Rules</Button>
                                        </div>
                                    </Card>

                                    <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                                            <h5 className="text-sm font-bold text-amber-700">Cost Alert</h5>
                                        </div>
                                        <p className="text-[11px] text-amber-600/70 leading-relaxed font-medium">
                                            Real-time sync on <span className="font-bold underline">1k+ SKUs</span> may deplete your SaaS wallet in 4.2 days. Consider Adaptive frequency.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div >
            </div >
        </DashboardLayout >
    );
}
