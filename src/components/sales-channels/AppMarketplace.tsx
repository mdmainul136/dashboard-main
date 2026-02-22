"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  LayoutGrid, Download, Trash2, Plus, Star, Code, CreditCard, Truck, Megaphone,
  BarChart3, Search, Globe, Sparkles, ShoppingBag, Building, UtensilsCrossed,
  GraduationCap, TrendingUp, CheckCircle2, Zap, Heart, Dumbbell, Scissors, Briefcase, Plane, Car, PartyPopper, Rocket,
  BookOpen, ArrowRight, Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMerchantRegion, type BusinessPurpose } from "@/hooks/useMerchantRegion";
import { allApps, type AppData } from "@/data/marketplaceApps";
import confetti from "canvas-confetti";

const purposeLabels: Record<BusinessPurpose, { label: string; icon: React.ElementType }> = {
  ecommerce: { label: "eCommerce", icon: ShoppingBag },
  "business-website": { label: "Business Website", icon: Globe },
  "real-estate": { label: "Real Estate", icon: Building },
  restaurant: { label: "Restaurant", icon: UtensilsCrossed },
  lms: { label: "Learning Platform", icon: GraduationCap },
  healthcare: { label: "Healthcare", icon: Heart },
  fitness: { label: "Fitness", icon: Dumbbell },
  salon: { label: "Salon / Spa", icon: Scissors },
  freelancer: { label: "Freelancer / Agency", icon: Briefcase },
  travel: { label: "Travel / Tourism", icon: Plane },
  automotive: { label: "Automotive", icon: Car },
  event: { label: "Events", icon: PartyPopper },
  saas: { label: "SaaS", icon: Rocket },
  landlord: { label: "Landlord", icon: Building },
  education: { label: "Education / Coaching", icon: GraduationCap },
  "cross-border-ior": { label: "Product Sourcing & IOR", icon: Globe },
};

const categoryIcons: Record<string, React.ReactNode> = {
  payment: <CreditCard className="h-3.5 w-3.5" />,
  shipping: <Truck className="h-3.5 w-3.5" />,
  marketing: <Megaphone className="h-3.5 w-3.5" />,
  analytics: <BarChart3 className="h-3.5 w-3.5" />,
  integration: <Zap className="h-3.5 w-3.5" />,
  communication: <Globe className="h-3.5 w-3.5" />,
  compliance: <CheckCircle2 className="h-3.5 w-3.5" />,
  delivery: <Truck className="h-3.5 w-3.5" />,
  "real-estate": <Building className="h-3.5 w-3.5" />,
  restaurant: <UtensilsCrossed className="h-3.5 w-3.5" />,
  lms: <GraduationCap className="h-3.5 w-3.5" />,
  custom: <Code className="h-3.5 w-3.5" />,
};

// Curated recommended app IDs per business type
const purposeRecommendations: Record<BusinessPurpose, { title: string; subtitle: string; appIds: string[] }> = {
  ecommerce: { title: "ðŸ›’ Essential eCommerce Stack", subtitle: "Top apps to boost your online store sales & operations", appIds: ["u1", "u2", "u4", "e1", "e3", "u5"] },
  "business-website": { title: "ðŸŒ Must-Have Website Tools", subtitle: "Grow traffic, capture leads & engage visitors", appIds: ["bw1", "bw2", "bw3", "bw4", "bw5", "u2"] },
  "real-estate": { title: "ðŸ  Real Estate Essentials", subtitle: "List properties, capture leads & close deals faster", appIds: ["re2", "re3", "re1", "m10", "re5", "bw2"] },
  restaurant: { title: "ðŸ½ï¸ Restaurant Growth Kit", subtitle: "Delivery, reservations & kitchen management tools", appIds: ["rs1", "rs2", "rs3", "rs4", "rs5", "m8"] },
  lms: { title: "ðŸŽ“ Learning Platform Essentials", subtitle: "Teach, assess & certify students effectively", appIds: ["l1", "l3", "l2", "l4", "l5", "l6"] },
  healthcare: { title: "ðŸ¥ Healthcare Toolkit", subtitle: "Patient scheduling, telehealth & clinical tools", appIds: ["hc1", "hc2", "hc3", "hc4", "hc5", "u4"] },
  fitness: { title: "ðŸ’ª Fitness & Gym Apps", subtitle: "Class scheduling, coaching & wearable sync", appIds: ["ft1", "ft2", "ft3", "ft4", "ft5", "u1"] },
  salon: { title: "ðŸ’‡ Salon & Spa Toolkit", subtitle: "Booking, client management & product tracking", appIds: ["sl1", "sl2", "sl3", "sl4", "sl5", "u1"] },
  freelancer: { title: "ðŸ’¼ Freelancer Power Tools", subtitle: "Invoicing, time tracking, proposals & contracts", appIds: ["fr1", "fr2", "fr3", "fr4", "fr6", "fr7"] },
  travel: { title: "âœˆï¸ Travel & Tourism Apps", subtitle: "OTA sync, tour bookings & guest reviews", appIds: ["tr1", "tr2", "tr3", "tr4", "tr5", "u2"] },
  automotive: { title: "ðŸš— Automotive Essentials", subtitle: "Listing syndication, vehicle history & dealer CRM", appIds: ["au1", "au2", "au3", "au4", "au5", "u2"] },
  event: { title: "ðŸŽ‰ Event Management Stack", subtitle: "Ticketing, virtual events & audience engagement", appIds: ["ev1", "ev2", "ev3", "ev4", "ev5", "u2"] },
  saas: { title: "ðŸš€ SaaS Builder's Toolkit", subtitle: "Analytics, billing, automation & developer tools", appIds: ["ss1", "ss2", "ss3", "ss4", "ss6", "ss9"] },
  landlord: { title: "🏠 Landlord Essentials", subtitle: "Property management, tenant tracking & rent collection", appIds: ["re2", "re3", "re1", "m10", "bw2", "u1"] },
  education: { title: "🏫 Education Center Stack", subtitle: "Class scheduling, student management & fee tracking tools", appIds: ["l1", "l2", "l3", "u1", "u2", "bw2"] },
  "cross-border-ior": { title: "🌏 IOR Operations Stack", subtitle: "Global sourcing, logistics tracking & compliance tools", appIds: ["u1", "u2", "u4", "bw2", "m8"] },
};

// Getting Started guides per business type
const gettingStartedGuides: Record<BusinessPurpose, { steps: { label: string; description: string; appId: string }[] }> = {
  ecommerce: {
    steps: [
      { label: "Accept Payments", description: "Set up Stripe to accept credit cards & digital wallets", appId: "u1" },
      { label: "Track Visitors", description: "Install Google Analytics to understand your traffic", appId: "u2" },
      { label: "Customer Support", description: "Add WhatsApp Business for instant customer communication", appId: "u4" },
    ]
  },
  "business-website": {
    steps: [
      { label: "Enable Booking", description: "Let visitors schedule appointments with Calendly", appId: "bw1" },
      { label: "Capture Leads", description: "Set up HubSpot CRM to manage contacts & deals", appId: "bw2" },
      { label: "Understand Users", description: "Add Hotjar heatmaps to see how visitors interact", appId: "bw5" },
    ]
  },
  "real-estate": {
    steps: [
      { label: "Virtual Tours", description: "Add Matterport 3D tours to wow potential buyers", appId: "re2" },
      { label: "Digital Contracts", description: "Enable DocuSign for paperless lease & sale agreements", appId: "re3" },
      { label: "Syndicate Listings", description: "Publish to Zillow automatically to reach more buyers", appId: "re1" },
    ]
  },
  restaurant: {
    steps: [
      { label: "POS System", description: "Set up Toast POS for table-side ordering & payments", appId: "rs1" },
      { label: "Online Delivery", description: "Connect Uber Eats to receive delivery orders", appId: "rs2" },
      { label: "Table Reservations", description: "Enable OpenTable for online table bookings", appId: "rs3" },
    ]
  },
  lms: {
    steps: [
      { label: "Live Classes", description: "Integrate Zoom for live teaching sessions & webinars", appId: "l1" },
      { label: "Video Hosting", description: "Host course videos securely on Vimeo Pro", appId: "l2" },
      { label: "Certificates", description: "Issue verified digital certificates with Accredible", appId: "l3" },
    ]
  },
  healthcare: {
    steps: [
      { label: "Patient Booking", description: "Set up Doctolib for online appointment scheduling", appId: "hc1" },
      { label: "Health Records", description: "Install DrChrono for electronic health records & charting", appId: "hc2" },
      { label: "Telehealth", description: "Enable Doxy.me for HIPAA-compliant video consultations", appId: "hc3" },
    ]
  },
  fitness: {
    steps: [
      { label: "Class Scheduling", description: "Set up Mindbody for class bookings & memberships", appId: "ft1" },
      { label: "Online Coaching", description: "Use Trainerize for workout plans & progress tracking", appId: "ft2" },
      { label: "Wearable Sync", description: "Connect Polar & Garmin to track client fitness data", appId: "ft5" },
    ]
  },
  salon: {
    steps: [
      { label: "Online Booking", description: "Set up Fresha for 24/7 appointment booking â€” it's free!", appId: "sl1" },
      { label: "Salon Management", description: "Use GlossGenius for client notes & financial reports", appId: "sl2" },
      { label: "Color Tracking", description: "Install SalonScale to track product usage & reduce waste", appId: "sl4" },
    ]
  },
  freelancer: {
    steps: [
      { label: "Send Invoices", description: "Create professional invoices & get paid with FreshBooks", appId: "fr1" },
      { label: "Track Time", description: "Log billable hours with Toggl Track for accurate billing", appId: "fr2" },
      { label: "Win Proposals", description: "Send stunning proposals with e-signatures via Proposify", appId: "fr3" },
    ]
  },
  travel: {
    steps: [
      { label: "OTA Sync", description: "Connect Booking.com to sync availability & rates", appId: "tr1" },
      { label: "List Experiences", description: "Publish tours on Viator to reach travelers worldwide", appId: "tr2" },
      { label: "Airbnb Sync", description: "Sync calendars with Airbnb to prevent double bookings", appId: "tr3" },
    ]
  },
  automotive: {
    steps: [
      { label: "List Vehicles", description: "Syndicate inventory to AutoTrader automatically", appId: "au1" },
      { label: "Vehicle History", description: "Attach CARFAX reports to build buyer confidence", appId: "au3" },
      { label: "Dealer CRM", description: "Set up DealerSocket for lead tracking & follow-ups", appId: "au4" },
    ]
  },
  event: {
    steps: [
      { label: "Sell Tickets", description: "Set up Eventbrite for ticket sales & check-in", appId: "ev1" },
      { label: "Virtual Events", description: "Use Hopin for hybrid events with networking rooms", appId: "ev2" },
      { label: "Engage Audience", description: "Add Slido for live Q&A, polls & quizzes", appId: "ev5" },
    ]
  },
  saas: {
    steps: [
      { label: "Subscription Billing", description: "Set up Stripe Billing for plans, trials & dunning", appId: "ss3" },
      { label: "Product Analytics", description: "Track usage & funnels with OpenClaw Analytics", appId: "ss2" },
      { label: "Automate Workflows", description: "Connect n8n for onboarding & support automation", appId: "ss1" },
    ]
  },
  landlord: {
    steps: [
      { label: "Tenant Screening", description: "Run background checks with RentPrep for reliable tenants", appId: "re3" },
      { label: "Rent Collection", description: "Automate rent payments with Stripe billing", appId: "u1" },
      { label: "Property Listings", description: "Syndicate vacancies to Zillow & Apartments.com", appId: "re1" },
    ]
  },
  education: {
    steps: [
      { label: "Live Classes", description: "Integrate Zoom for live teaching sessions & webinars", appId: "l1" },
      { label: "Accept Payments", description: "Set up Stripe to collect tuition fees online", appId: "u1" },
      { label: "Track Analytics", description: "Understand student engagement with Google Analytics", appId: "u2" },
    ]
  },
  "cross-border-ior": {
    steps: [
      { label: "Accept Payments", description: "Set up Stripe to manage global transactions", appId: "u1" },
      { label: "Track Shipments", description: "Install shipment tracking for global logistics", appId: "m8" },
      { label: "Customer Support", description: "Add WhatsApp Business for logistics coordination", appId: "u4" },
    ]
  },
};

const AppMarketplace = () => {
  const router = useRouter();
  const { businessPurpose, region } = useMerchantRegion();
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set(["u1", "u4"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("recommended");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [newAppWebhook, setNewAppWebhook] = useState("");
  const [celebrationShown, setCelebrationShown] = useState<string | null>(null);
  const prevCompletedRef = useRef(false);

  const currentPurpose = businessPurpose || "ecommerce";
  const currentRegionId = region?.id || "global";

  // Check if guide is complete and trigger celebration
  const guideSteps = gettingStartedGuides[currentPurpose]?.steps || [];
  const guideCompleted = guideSteps.length > 0 && guideSteps.every(s => installedIds.has(s.appId));

  useEffect(() => {
    if (guideCompleted && !prevCompletedRef.current && celebrationShown !== currentPurpose) {
      setCelebrationShown(currentPurpose);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.3 } }), 300);
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.7 } }), 500);
    }
    prevCompletedRef.current = guideCompleted;
  }, [guideCompleted, currentPurpose, celebrationShown]);

  const relevantApps = useMemo(() => {
    return allApps.filter(app => {
      const purposeMatch = app.purposes === "all" || app.purposes.includes(currentPurpose);
      const regionMatch = app.regions === "all" || app.regions.includes(currentRegionId);
      return purposeMatch && regionMatch;
    });
  }, [currentPurpose, currentRegionId]);

  const featuredApps = relevantApps.filter(a => a.featured);
  const newApps = relevantApps.filter(a => a.isNew);
  const installed = relevantApps.filter(a => installedIds.has(a.id));

  const categories = useMemo(() => {
    const cats = new Set(relevantApps.map(a => a.category));
    return ["all", ...Array.from(cats).sort()];
  }, [relevantApps]);

  const getFilteredApps = (apps: AppData[]) => {
    let result = apps;
    if (categoryFilter !== "all") result = result.filter(a => a.category === categoryFilter);
    if (searchQuery) result = result.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return result;
  };

  const toggleInstall = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInstalledIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    const app = allApps.find(a => a.id === id);
    toast({ title: installedIds.has(id) ? "Uninstalled" : "Installed!", description: `${app?.name} ${installedIds.has(id) ? "removed" : "added"} successfully` });
  };

  const handleRegister = () => {
    if (!newAppName.trim()) {
      toast({ title: "Error", description: "App name required", variant: "destructive" }); return;
    }
    toast({ title: "Registered!", description: `${newAppName} has been added as a custom app` });
    setDialogOpen(false); setNewAppName(""); setNewAppWebhook("");
  };

  const PurposeIcon = purposeLabels[currentPurpose]?.icon || ShoppingBag;

  const renderAppCard = (app: AppData) => {
    const isInstalled = installedIds.has(app.id);
    return (
      <Card
        key={app.id}
        className="group hover:shadow-lg transition-all cursor-pointer"
        onClick={() => router.push(`/app-marketplace/${app.id}`)}
      >
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl shrink-0">
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-foreground truncate">{app.name}</p>
                {app.isNew && <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] px-1.5">NEW</Badge>}
                {app.featured && <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground">{app.developer}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{app.description}</p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1 text-[10px] capitalize">
              {categoryIcons[app.category] || <Code className="h-3.5 w-3.5" />} {app.category}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {app.price === "free" ? "âœ… Free" : app.price}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {app.rating}
              </span>
              <span>Â·</span>
              <span>{app.installs}</span>
            </div>
            <Button
              size="sm"
              variant={isInstalled ? "outline" : "default"}
              className="gap-1 h-8 text-xs"
              onClick={(e) => toggleInstall(app.id, e)}
            >
              {isInstalled ? <><Trash2 className="h-3 w-3" /> Remove</> : <><Download className="h-3 w-3" /> Install</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      {/* Context Banner */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/10">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PurposeIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Showing apps for <span className="text-primary">{purposeLabels[currentPurpose]?.label || "Global"}</span>
                {region && <> in <span className="text-primary">{region.flag} {region.name}</span></>}
              </p>
              <p className="text-xs text-muted-foreground">{relevantApps.length} apps available Â· {installed.length} installed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1">
              <Globe className="h-3 w-3" /> {region?.name || "Global"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Installed Apps", value: installed.length, icon: Download, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Available Apps", value: relevantApps.length, icon: LayoutGrid, color: "bg-primary/10 text-primary" },
          { label: "Featured", value: featuredApps.length, icon: Sparkles, color: "bg-amber-500/10 text-amber-600" },
          { label: "New This Month", value: newApps.length, icon: TrendingUp, color: "bg-violet-500/10 text-violet-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search apps..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 8).map(cat => (
            <Button key={cat} size="sm" variant={categoryFilter === cat ? "default" : "outline"} onClick={() => setCategoryFilter(cat)} className="capitalize text-xs">
              {cat === "all" ? "All" : cat}
            </Button>
          ))}
        </div>
        <Button size="sm" className="gap-2 shrink-0" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Register App
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recommended"><Sparkles className="h-4 w-4 mr-1" />Recommended</TabsTrigger>
          <TabsTrigger value="all"><LayoutGrid className="h-4 w-4 mr-1" />All Apps</TabsTrigger>
          <TabsTrigger value="installed"><Download className="h-4 w-4 mr-1" />Installed ({installed.length})</TabsTrigger>
          {region && <TabsTrigger value="regional"><Globe className="h-4 w-4 mr-1" />{region.flag} Regional</TabsTrigger>}
        </TabsList>

        <TabsContent value="recommended">
          <div className="space-y-6">
            {/* Getting Started Guide */}
            {gettingStartedGuides[currentPurpose] && (() => {
              const guide = gettingStartedGuides[currentPurpose];
              const completedCount = guide.steps.filter(s => installedIds.has(s.appId)).length;
              const progress = Math.round((completedCount / guide.steps.length) * 100);
              const allDone = completedCount === guide.steps.length;

              if (allDone) {
                return (
                  <Card className="border-emerald-500/30 overflow-hidden animate-scale-in">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 animate-fade-in">
                            <PartyPopper className="h-8 w-8 text-emerald-500" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-foreground animate-fade-in">
                          ðŸŽ‰ All Set! You're Ready to Go!
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto animate-fade-in">
                          You've installed all essential apps for your <span className="font-semibold text-foreground">{purposeLabels[currentPurpose]?.label}</span> business. Explore more apps below to supercharge your workflow.
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in">
                          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> {completedCount}/{guide.steps.length} Apps Installed
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <Card className="border-primary/20 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Getting Started with {purposeLabels[currentPurpose]?.label || "Your Business"}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {completedCount}/{guide.steps.length} done
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Follow these steps to set up your essential apps</p>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="divide-y divide-border">
                      {guide.steps.map((step, idx) => {
                        const app = allApps.find(a => a.id === step.appId);
                        const isDone = installedIds.has(step.appId);
                        return (
                          <div
                            key={step.appId}
                            className={`flex items-center gap-4 p-4 transition-colors ${isDone ? "bg-muted/30" : "hover:bg-muted/20 cursor-pointer"}`}
                            onClick={() => !isDone && app && router.push(`/app-marketplace/${app.id}`)}
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 text-sm font-bold ${isDone ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                              {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {step.label}
                              </p>
                              <p className="text-xs text-muted-foreground">{step.description}</p>
                            </div>
                            {app && (
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-lg">{app.icon}</span>
                                {isDone ? (
                                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px]">Installed</Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="gap-1 h-7 text-xs"
                                    onClick={(e) => { e.stopPropagation(); toggleInstall(app.id, e); }}
                                  >
                                    <Download className="h-3 w-3" /> Install
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Curated Picks for Business Type */}
            {purposeRecommendations[currentPurpose] && (() => {
              const rec = purposeRecommendations[currentPurpose];
              const curatedApps = rec.appIds.map(id => allApps.find(a => a.id === id)).filter(Boolean) as AppData[];
              return curatedApps.length > 0 ? (
                <div>
                  <Card className="mb-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-foreground">{rec.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.subtitle}</p>
                    </CardContent>
                  </Card>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {curatedApps.map(renderAppCard)}
                  </div>
                </div>
              ) : null;
            })()}

            {featuredApps.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" /> More Featured Apps
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getFilteredApps(featuredApps.filter(a => !purposeRecommendations[currentPurpose]?.appIds.includes(a.id))).map(renderAppCard)}
                </div>
              </div>
            )}
            {newApps.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-primary" /> New & Trending
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getFilteredApps(newApps).map(renderAppCard)}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredApps(relevantApps).map(renderAppCard)}
          </div>
          {getFilteredApps(relevantApps).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No apps found matching your criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="installed">
          {installed.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredApps(installed).map(renderAppCard)}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Download className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No apps installed yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab("recommended")}>Browse Recommended</Button>
            </div>
          )}
        </TabsContent>

        {region && (
          <TabsContent value="regional">
            <div className="space-y-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{region.flag}</span>
                  <div>
                    <p className="text-sm font-semibold">Apps for {region.name} Region</p>
                    <p className="text-xs text-muted-foreground">Local payment methods, shipping partners & compliance tools</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredApps(relevantApps.filter(a => a.regions !== "all" && a.regions.includes(currentRegionId))).map(renderAppCard)}
              </div>
              {relevantApps.filter(a => a.regions !== "all" && a.regions.includes(currentRegionId)).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>No region-specific apps available.</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Register Custom App Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Code className="h-4 w-4 text-primary" /> Register Custom App</DialogTitle>
            <DialogDescription>Connect a custom API or third-party service</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>App Name</Label>
              <Input placeholder="e.g. My Custom Integration" value={newAppName} onChange={e => setNewAppName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>API Endpoint / Webhook URL</Label>
              <Input placeholder="https://api.example.com/webhook" value={newAppWebhook} onChange={e => setNewAppWebhook(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>API Key (Optional)</Label>
              <Input type="password" placeholder="sk_live_..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRegister} className="gap-1.5"><Plus className="h-4 w-4" /> Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppMarketplace;
