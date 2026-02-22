"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Plus, FileText, Eye, Pencil, Trash2, GripVertical, Globe,
  Layout, Type, ImageIcon, ListChecks, Clock, CheckCircle2, Copy,
  Smartphone, Monitor, Tablet, ExternalLink, Search, BarChart3,
  Star, Zap, Code, MapPin, MessageSquare, CreditCard, Users,
  ArrowUpRight, Layers, Palette, Settings2,
} from "lucide-react";

type PageStatus = "published" | "draft" | "scheduled";

interface SitePage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  template: string;
  lastModified: string;
  views: number;
  seoScore: number;
  conversionRate?: number;
}

const mockPages: SitePage[] = [
  { id: "1", title: "Home", slug: "/", status: "published", template: "Landing", lastModified: "2 hours ago", views: 1240, seoScore: 92, conversionRate: 4.2 },
  { id: "2", title: "About Us", slug: "/about", status: "published", template: "Content", lastModified: "1 day ago", views: 890, seoScore: 85 },
  { id: "3", title: "Services", slug: "/services", status: "published", template: "Grid", lastModified: "3 days ago", views: 650, seoScore: 78, conversionRate: 3.1 },
  { id: "4", title: "Contact", slug: "/contact", status: "published", template: "Form", lastModified: "1 week ago", views: 420, seoScore: 88, conversionRate: 12.5 },
  { id: "5", title: "Pricing", slug: "/pricing", status: "draft", template: "Pricing Table", lastModified: "5 hours ago", views: 0, seoScore: 45 },
  { id: "6", title: "Careers", slug: "/careers", status: "scheduled", template: "Content", lastModified: "2 days ago", views: 0, seoScore: 60 },
  { id: "7", title: "Case Studies", slug: "/case-studies", status: "published", template: "Grid", lastModified: "4 days ago", views: 310, seoScore: 72 },
  { id: "8", title: "FAQ", slug: "/faq", status: "published", template: "FAQ", lastModified: "2 weeks ago", views: 560, seoScore: 90 },
];

interface SectionBlock {
  icon: React.ReactNode;
  label: string;
  desc: string;
  category: string;
  gradient: string;
}

const sectionBlocks: SectionBlock[] = [
  { icon: <Layout className="h-5 w-5" />, label: "Hero Section", desc: "Full-width header with CTA", category: "Layout", gradient: "from-primary/20 to-primary/5" },
  { icon: <Type className="h-5 w-5" />, label: "Text Block", desc: "Rich text content area", category: "Content", gradient: "from-success/20 to-success/5" },
  { icon: <ImageIcon className="h-5 w-5" />, label: "Image Gallery", desc: "Grid or carousel images", category: "Media", gradient: "from-warning/20 to-warning/5" },
  { icon: <ListChecks className="h-5 w-5" />, label: "Features Grid", desc: "Icon + text feature cards", category: "Layout", gradient: "from-primary/20 to-primary/5" },
  { icon: <FileText className="h-5 w-5" />, label: "FAQ Accordion", desc: "Expandable Q&A section", category: "Content", gradient: "from-success/20 to-success/5" },
  { icon: <Globe className="h-5 w-5" />, label: "Embed / Map", desc: "Google Maps or iframe embed", category: "Media", gradient: "from-warning/20 to-warning/5" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Pricing Table", desc: "Plan comparison cards", category: "Layout", gradient: "from-primary/20 to-primary/5" },
  { icon: <Users className="h-5 w-5" />, label: "Team Section", desc: "Team member profiles", category: "Content", gradient: "from-success/20 to-success/5" },
  { icon: <Star className="h-5 w-5" />, label: "Testimonials", desc: "Client review carousel", category: "Content", gradient: "from-warning/20 to-warning/5" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Contact Form", desc: "Custom contact form", category: "Forms", gradient: "from-destructive/20 to-destructive/5" },
  { icon: <BarChart3 className="h-5 w-5" />, label: "Stats Counter", desc: "Animated number counters", category: "Layout", gradient: "from-primary/20 to-primary/5" },
  { icon: <Code className="h-5 w-5" />, label: "Custom HTML", desc: "Raw HTML/CSS embed", category: "Advanced", gradient: "from-muted-foreground/20 to-muted-foreground/5" },
];

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  preview: string;
  gradient: string;
  popular?: boolean;
}

const templates: TemplateItem[] = [
  { id: "landing", name: "Landing Page", category: "Marketing", preview: "Hero + Features + CTA", gradient: "from-primary via-primary/60 to-primary/20", popular: true },
  { id: "content", name: "Content Page", category: "General", preview: "Header + Rich Text + Sidebar", gradient: "from-success via-success/60 to-success/20" },
  { id: "grid", name: "Grid Layout", category: "Portfolio", preview: "Header + Grid Cards + Footer", gradient: "from-warning via-warning/60 to-warning/20", popular: true },
  { id: "form", name: "Form Page", category: "Lead Gen", preview: "Hero + Form + Trust Signals", gradient: "from-destructive via-destructive/60 to-destructive/20" },
  { id: "pricing", name: "Pricing Table", category: "Sales", preview: "Header + Plans + FAQ", gradient: "from-primary via-primary/40 to-success/20" },
  { id: "faq", name: "FAQ Page", category: "Support", preview: "Search + Categories + Accordion", gradient: "from-muted-foreground via-muted-foreground/40 to-muted/20" },
];

const statusConfig: Record<PageStatus, { label: string; color: string; dotColor: string }> = {
  published: { label: "Published", color: "bg-success/10 text-success border-success/20", dotColor: "bg-success" },
  draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border", dotColor: "bg-muted-foreground" },
  scheduled: { label: "Scheduled", color: "bg-warning/10 text-warning border-warning/20", dotColor: "bg-warning" },
};

const PageBuilderPage = () => {
  const [pages] = useState(mockPages);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [blockFilter, setBlockFilter] = useState("All");
  const [selectedPage, setSelectedPage] = useState<SitePage | null>(null);

  const totalViews = pages.reduce((s, p) => s + p.views, 0);
  const avgSeo = Math.round(pages.reduce((s, p) => s + p.seoScore, 0) / pages.length);
  const publishedCount = pages.filter(p => p.status === "published").length;
  const blockCategories = ["All", ...Array.from(new Set(sectionBlocks.map(b => b.category)))];
  const filteredBlocks = blockFilter === "All" ? sectionBlocks : sectionBlocks.filter(b => b.category === blockFilter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Page Builder</h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage your website pages with drag-and-drop blocks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1.5" /> Preview Site
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> New Page</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Page</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input placeholder="e.g. Our Team" />
                    </div>
                    <div className="space-y-2">
                      <Label>URL Slug</Label>
                      <div className="flex items-center gap-0">
                        <span className="h-11 px-3 flex items-center bg-muted rounded-l-lg border border-r-0 border-input text-sm text-muted-foreground">yoursite.com</span>
                        <Input placeholder="/our-team" className="rounded-l-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Choose Template</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {templates.map(t => (
                        <div key={t.id} className="group cursor-pointer rounded-xl border-2 border-border hover:border-primary/50 transition-all p-0.5">
                          <div className={`h-20 rounded-t-lg bg-gradient-to-br ${t.gradient} flex items-center justify-center relative overflow-hidden`}>
                            {/* Mini wireframe preview */}
                            <div className="w-3/4 space-y-1.5 opacity-60">
                              <div className="h-1.5 bg-card/80 rounded-full w-full" />
                              <div className="h-1 bg-card/60 rounded-full w-3/4" />
                              <div className="flex gap-1 mt-2">
                                <div className="h-3 bg-card/40 rounded w-1/3" />
                                <div className="h-3 bg-card/40 rounded w-1/3" />
                                <div className="h-3 bg-card/40 rounded w-1/3" />
                              </div>
                            </div>
                            {t.popular && (
                              <Badge className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0">Popular</Badge>
                            )}
                          </div>
                          <div className="p-2.5">
                            <p className="text-sm font-semibold text-foreground">{t.name}</p>
                            <p className="text-[11px] text-muted-foreground">{t.preview}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch id="seo-auto" defaultChecked />
                      <Label htmlFor="seo-auto" className="text-sm text-muted-foreground">Auto-generate SEO meta tags</Label>
                    </div>
                    <Button onClick={() => setDialogOpen(false)}>Create Page</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Pages", value: pages.length, icon: <FileText className="h-5 w-5" />, iconClass: "stat-icon", change: "+2 this month" },
            { label: "Published", value: publishedCount, icon: <CheckCircle2 className="h-5 w-5" />, iconClass: "stat-icon-success", change: `${pages.length - publishedCount} draft` },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: <Eye className="h-5 w-5" />, iconClass: "stat-icon-info", change: "+18% vs last month" },
            { label: "Avg. SEO Score", value: `${avgSeo}/100`, icon: <Search className="h-5 w-5" />, iconClass: "stat-icon-warning", change: avgSeo >= 80 ? "Good" : "Needs work" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={stat.iconClass}>{stat.icon}</div>
                  <Badge variant="outline" className="text-[10px] px-1.5 font-normal">{stat.change}</Badge>
                </div>
                <p className="text-2xl font-bold text-foreground mt-3">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pages">
          <TabsList>
            <TabsTrigger value="pages">All Pages</TabsTrigger>
            <TabsTrigger value="blocks">Section Blocks</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
          </TabsList>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-3">
            {pages.map((page) => (
              <Card key={page.id} className="group">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{page.title}</p>
                        <Badge variant="outline" className={statusConfig[page.status].color}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[page.status].dotColor} mr-1.5`} />
                          {statusConfig[page.status].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground hidden sm:inline">Â· {page.template}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{page.slug}</span>
                        <span>Modified {page.lastModified}</span>
                        {page.views > 0 && <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {page.views}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {/* SEO Score pill */}
                    <div className="hidden lg:flex items-center gap-2 mr-2">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">SEO</span>
                      <div className="w-16">
                        <Progress value={page.seoScore} className="h-1.5" />
                      </div>
                      <span className={`text-xs font-semibold ${page.seoScore >= 80 ? "text-success" : page.seoScore >= 60 ? "text-warning" : "text-destructive"}`}>
                        {page.seoScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Blocks Tab */}
          <TabsContent value="blocks" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {blockCategories.map(cat => (
                <Button key={cat} variant={blockFilter === cat ? "default" : "outline"} size="sm" onClick={() => setBlockFilter(cat)}>{cat}</Button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBlocks.map((block) => (
                <Card key={block.label} className="cursor-pointer group hover:border-primary/40 transition-all overflow-hidden">
                  <div className={`h-16 bg-gradient-to-br ${block.gradient} flex items-center justify-center`}>
                    <div className="p-2.5 rounded-xl bg-card/90 shadow-sm text-foreground group-hover:scale-110 transition-transform">
                      {block.icon}
                    </div>
                  </div>
                  <CardContent className="p-3.5">
                    <p className="font-semibold text-sm text-foreground">{block.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{block.desc}</p>
                    <Badge variant="outline" className="mt-2 text-[10px]">{block.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {templates.map(t => (
                <Card key={t.id} className="overflow-hidden group cursor-pointer hover:border-primary/40 transition-all">
                  <div className={`h-36 bg-gradient-to-br ${t.gradient} flex items-center justify-center relative`}>
                    {/* Wireframe mockup */}
                    <div className="w-4/5 bg-card/90 rounded-lg p-3 shadow-lg space-y-2">
                      <div className="h-2 bg-muted rounded-full w-2/3" />
                      <div className="h-1.5 bg-muted/60 rounded-full w-full" />
                      <div className="h-1.5 bg-muted/60 rounded-full w-4/5" />
                      <div className="flex gap-1.5 pt-1">
                        <div className="h-6 bg-muted/40 rounded flex-1" />
                        <div className="h-6 bg-muted/40 rounded flex-1" />
                        <div className="h-6 bg-muted/40 rounded flex-1" />
                      </div>
                    </div>
                    {t.popular && (
                      <Badge className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground shadow-lg"><Star className="h-3 w-3 mr-1" /> Popular</Badge>
                    )}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary" className="shadow-lg"><Zap className="h-3.5 w-3.5 mr-1" /> Use Template</Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.preview}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Website Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted rounded-lg p-0.5">
                      {[
                        { device: "desktop" as const, icon: <Monitor className="h-4 w-4" />, w: "100%" },
                        { device: "tablet" as const, icon: <Tablet className="h-4 w-4" />, w: "768px" },
                        { device: "mobile" as const, icon: <Smartphone className="h-4 w-4" />, w: "375px" },
                      ].map(d => (
                        <Button
                          key={d.device}
                          variant={previewDevice === d.device ? "secondary" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setPreviewDevice(d.device)}
                        >
                          {d.icon}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`mx-auto transition-all duration-300 ${previewDevice === "tablet" ? "max-w-[768px]" : previewDevice === "mobile" ? "max-w-[375px]" : "max-w-full"}`}>
                  <div className="border border-border rounded-xl overflow-hidden bg-card">
                    {/* Browser chrome */}
                    <div className="bg-muted px-4 py-2.5 flex items-center gap-3 border-b border-border">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                        <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                        <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                      </div>
                      <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-1.5">
                        <Globe className="h-3 w-3" /> yoursite.com
                      </div>
                    </div>
                    {/* Preview content mockup */}
                    <div className="p-0">
                      {/* Nav */}
                      <div className="px-6 py-3 flex items-center justify-between border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md bg-primary/20" />
                          <div className="h-2 w-16 bg-muted rounded-full" />
                        </div>
                        <div className="flex gap-4">
                          {["Home", "About", "Services", "Contact"].map(n => (
                            <div key={n} className="h-1.5 w-10 bg-muted-foreground/20 rounded-full" />
                          ))}
                        </div>
                      </div>
                      {/* Hero */}
                      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-12 text-center">
                        <div className="h-3 w-48 bg-foreground/15 rounded-full mx-auto mb-3" />
                        <div className="h-2 w-64 bg-muted-foreground/15 rounded-full mx-auto mb-2" />
                        <div className="h-2 w-52 bg-muted-foreground/10 rounded-full mx-auto mb-5" />
                        <div className="flex gap-2 justify-center">
                          <div className="h-7 w-24 bg-primary/30 rounded-lg" />
                          <div className="h-7 w-24 bg-muted rounded-lg" />
                        </div>
                      </div>
                      {/* Features grid */}
                      <div className="px-6 py-8">
                        <div className="h-2.5 w-32 bg-foreground/10 rounded-full mx-auto mb-6" />
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 rounded-lg border border-border/40 space-y-2">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 mx-auto" />
                              <div className="h-1.5 w-16 bg-muted rounded-full mx-auto" />
                              <div className="h-1 w-full bg-muted/60 rounded-full" />
                              <div className="h-1 w-3/4 bg-muted/40 rounded-full mx-auto" />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="bg-muted/50 px-6 py-4 border-t border-border/40">
                        <div className="flex justify-between items-center">
                          <div className="h-1.5 w-20 bg-muted-foreground/15 rounded-full" />
                          <div className="flex gap-2">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="h-4 w-4 rounded-full bg-muted-foreground/10" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PageBuilderPage;

