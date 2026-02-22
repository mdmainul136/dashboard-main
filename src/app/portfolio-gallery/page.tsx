"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Plus, Image, Eye, Pencil, Trash2, Star, ExternalLink,
  FolderOpen, Upload, Grid3X3, Quote, Heart, Share2,
  ArrowUpRight, TrendingUp, Award, Users, Layers,
} from "lucide-react";

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  client: string;
  date: string;
  featured: boolean;
  imageCount: number;
  status: "published" | "draft";
  description: string;
  gradient: string;
  views: number;
  likes: number;
}

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  project: string;
}

interface ClientLogo {
  id: string;
  name: string;
  initials: string;
}

const mockProjects: PortfolioProject[] = [
  { id: "1", title: "Brand Identity â€” Zenith Corp", category: "Branding", client: "Zenith Corp", date: "Jan 2025", featured: true, imageCount: 12, status: "published", description: "Complete brand overhaul including logo, typography, and brand guidelines", gradient: "from-primary/30 via-primary/10 to-transparent", views: 2340, likes: 89 },
  { id: "2", title: "E-Commerce Redesign", category: "Web Design", client: "ModaMart", date: "Dec 2024", featured: true, imageCount: 8, status: "published", description: "Full redesign improving conversion by 40%", gradient: "from-success/30 via-success/10 to-transparent", views: 1890, likes: 67 },
  { id: "3", title: "Mobile App UI â€” FitTrack", category: "UI/UX", client: "FitTrack", date: "Nov 2024", featured: false, imageCount: 15, status: "published", description: "Health tracking app with intuitive user experience", gradient: "from-warning/30 via-warning/10 to-transparent", views: 1250, likes: 45 },
  { id: "4", title: "Marketing Campaign â€” Summer 2024", category: "Marketing", client: "SunBeam", date: "Aug 2024", featured: false, imageCount: 6, status: "published", description: "Multi-channel summer campaign with social media integration", gradient: "from-destructive/30 via-destructive/10 to-transparent", views: 980, likes: 32 },
  { id: "5", title: "Dashboard Analytics Platform", category: "Web Design", client: "DataViz Inc", date: "Oct 2024", featured: false, imageCount: 10, status: "draft", description: "Enterprise analytics dashboard with real-time data", gradient: "from-primary/30 via-primary/10 to-transparent", views: 0, likes: 0 },
  { id: "6", title: "Restaurant Menu System", category: "UI/UX", client: "Gusto Cafe", date: "Sep 2024", featured: false, imageCount: 7, status: "published", description: "Digital menu with QR ordering system", gradient: "from-warning/30 via-warning/10 to-transparent", views: 760, likes: 28 },
];

const mockTestimonials: Testimonial[] = [
  { id: "1", name: "Sara Al-Rashid", company: "Zenith Corp", role: "CEO", text: "Outstanding work on our brand identity. The team delivered beyond our expectations with creative solutions that perfectly captured our vision.", rating: 5, avatar: "SA", project: "Brand Identity" },
  { id: "2", name: "Ahmed Khan", company: "ModaMart", role: "CTO", text: "The e-commerce redesign increased our conversion rate by 40%. Highly professional and detail-oriented team with excellent communication.", rating: 5, avatar: "AK", project: "E-Commerce Redesign" },
  { id: "3", name: "Lina Petrov", company: "FitTrack", role: "Product Manager", text: "Beautiful app design that our users love. Great communication throughout the project and delivered on time.", rating: 4, avatar: "LP", project: "Mobile App UI" },
  { id: "4", name: "Omar Al-Farsi", company: "SunBeam", role: "Marketing Director", text: "The campaign exceeded all our KPIs. Social engagement up 300% and leads generated were outstanding.", rating: 5, avatar: "OF", project: "Summer Campaign" },
];

const clientLogos: ClientLogo[] = [
  { id: "1", name: "Zenith Corp", initials: "ZC" },
  { id: "2", name: "ModaMart", initials: "MM" },
  { id: "3", name: "FitTrack", initials: "FT" },
  { id: "4", name: "SunBeam", initials: "SB" },
  { id: "5", name: "DataViz Inc", initials: "DV" },
  { id: "6", name: "Gusto Cafe", initials: "GC" },
  { id: "7", name: "AlphaX", initials: "AX" },
  { id: "8", name: "NovaTech", initials: "NT" },
];

const categories = ["All", "Branding", "Web Design", "UI/UX", "Marketing"];

const PortfolioGalleryPage = () => {
  const [filter, setFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filtered = filter === "All" ? mockProjects : mockProjects.filter(p => p.category === filter);
  const totalViews = mockProjects.reduce((s, p) => s + p.views, 0);
  const totalLikes = mockProjects.reduce((s, p) => s + p.likes, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Portfolio & Gallery</h1>
            <p className="text-muted-foreground text-sm mt-1">Showcase your projects, case studies, and client testimonials</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-1.5" /> Share Portfolio</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> New Project</Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add Portfolio Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input placeholder="e.g. Brand Identity â€” Acme Corp" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="branding">Branding</SelectItem>
                          <SelectItem value="web">Web Design</SelectItem>
                          <SelectItem value="uiux">UI/UX</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Client Name</Label>
                      <Input placeholder="Client" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Brief project description..." rows={3} />
                  </div>
                  <div className="border-2 border-dashed border-border hover:border-primary/40 transition-colors rounded-xl p-8 text-center cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Drop images here</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 10MB each</p>
                  </div>
                  <Button className="w-full" onClick={() => setDialogOpen(false)}>Add Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Projects", value: mockProjects.length, icon: <FolderOpen className="h-5 w-5" />, iconClass: "stat-icon" },
            { label: "Featured", value: mockProjects.filter(p => p.featured).length, icon: <Award className="h-5 w-5" />, iconClass: "stat-icon-warning" },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: <Eye className="h-5 w-5" />, iconClass: "stat-icon-info" },
            { label: "Total Likes", value: totalLikes, icon: <Heart className="h-5 w-5" />, iconClass: "stat-icon-success" },
            { label: "Clients", value: clientLogos.length, icon: <Users className="h-5 w-5" />, iconClass: "stat-icon" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={stat.iconClass}>{stat.icon}</div>
                <p className="text-xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Logos Strip */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Trusted By</p>
              <Button variant="ghost" size="sm" className="text-xs">Manage Logos</Button>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-1">
              {clientLogos.map(cl => (
                <div key={cl.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-colors shrink-0">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{cl.initials}</div>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{cl.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="projects">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials ({mockTestimonials.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Button key={cat} variant={filter === cat ? "default" : "outline"} size="sm" onClick={() => setFilter(cat)}>
                  {cat} {cat !== "All" && <span className="ml-1 opacity-60">({mockProjects.filter(p => cat === "All" || p.category === cat).length})</span>}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((project) => (
                <Card key={project.id} className="overflow-hidden group cursor-pointer" onClick={() => setSelectedProject(project)}>
                  <div className={`h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative`}>
                    {/* Abstract shapes mockup */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-4 left-6 h-16 w-16 rounded-2xl bg-card/20 rotate-12" />
                      <div className="absolute bottom-6 right-8 h-12 w-12 rounded-full bg-card/15" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-2xl bg-card/25 -rotate-6" />
                    </div>
                    <Layers className="h-8 w-8 text-foreground/20 relative z-10" />
                    {project.featured && (
                      <Badge className="absolute top-3 left-3 bg-warning text-warning-foreground shadow-lg"><Star className="h-3 w-3 mr-1 fill-current" /> Featured</Badge>
                    )}
                    {project.status === "draft" && (
                      <Badge variant="secondary" className="absolute top-3 right-3">Draft</Badge>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="shadow-lg"><Eye className="h-3.5 w-3.5 mr-1" /> View</Button>
                      <Button size="sm" variant="secondary" className="shadow-lg"><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                    </div>
                    {/* Bottom stats bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/30 to-transparent px-4 py-2 flex items-center gap-4 text-card text-xs">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {project.views}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {project.likes}</span>
                      <span className="flex items-center gap-1"><Image className="h-3 w-3" /> {project.imageCount}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{project.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{project.client} Â· {project.date}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px]">{project.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex text-warning">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {(mockTestimonials.reduce((a, t) => a + t.rating, 0) / mockTestimonials.length).toFixed(1)} average
                </span>
              </div>
              <Button variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Testimonial</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mockTestimonials.map((t) => (
                <Card key={t.id}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex text-warning">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current" : "text-muted"}`} />
                        ))}
                      </div>
                      <Badge variant="outline" className="text-[10px]">{t.project}</Badge>
                    </div>
                    <blockquote className="text-sm text-foreground leading-relaxed">"{t.text}"</blockquote>
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role} at {t.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Project Detail Dialog */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedProject.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className={`h-48 rounded-xl bg-gradient-to-br ${selectedProject.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0">
                      <div className="absolute top-6 left-8 h-20 w-20 rounded-2xl bg-card/20 rotate-12" />
                      <div className="absolute bottom-8 right-10 h-14 w-14 rounded-full bg-card/15" />
                    </div>
                    <Layers className="h-12 w-12 text-foreground/15 relative z-10" />
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline">{selectedProject.category}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedProject.client}</span>
                    <span className="text-sm text-muted-foreground">Â·</span>
                    <span className="text-sm text-muted-foreground">{selectedProject.date}</span>
                  </div>
                  <p className="text-sm text-foreground">{selectedProject.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Views", value: selectedProject.views.toLocaleString(), icon: <Eye className="h-4 w-4 text-primary" /> },
                      { label: "Likes", value: selectedProject.likes, icon: <Heart className="h-4 w-4 text-destructive" /> },
                      { label: "Images", value: selectedProject.imageCount, icon: <Image className="h-4 w-4 text-success" /> },
                    ].map(s => (
                      <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="flex justify-center mb-1">{s.icon}</div>
                        <p className="text-lg font-bold text-foreground">{s.value}</p>
                        <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1"><ExternalLink className="h-4 w-4 mr-2" /> View Live</Button>
                    <Button variant="outline" className="flex-1"><Pencil className="h-4 w-4 mr-2" /> Edit Project</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PortfolioGalleryPage;

