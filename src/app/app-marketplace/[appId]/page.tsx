"use client";

import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, Star, Download, Trash2, ExternalLink, Mail, Calendar,
  Image, MessageSquare, BookOpen, History, Shield, HardDrive, Globe,
  CheckCircle2, ChevronRight, Sparkles, Code,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getAppById } from "@/data/marketplaceApps";

const AppDetailPage = () => {
  const { appId } = useParams<{ appId: string }>();
  const router = useRouter();
  const app = getAppById(appId || "");
  const [installed, setInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!app) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-4">ðŸ”</p>
          <h2 className="text-xl font-bold text-foreground mb-2">App Not Found</h2>
          <p className="text-muted-foreground mb-4">The app you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/app-marketplace")} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Marketplace</Button>
        </div>
      </DashboardLayout>
    );
  }

  const toggleInstall = () => {
    setInstalled(!installed);
    toast({ title: installed ? "Uninstalled" : "Installed!", description: `${app.name} ${installed ? "removed" : "added"} successfully` });
  };

  const avgRating = app.reviews && app.reviews.length > 0
    ? app.reviews.reduce((sum, r) => sum + r.rating, 0) / app.reviews.length
    : app.rating;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = app.reviews?.filter(r => r.rating === star).length || 0;
    const total = app.reviews?.length || 1;
    return { star, count, percent: (count / total) * 100 };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => router.push("/app-marketplace")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Button>

        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl shrink-0 shadow-sm">
            {app.icon}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{app.name}</h1>
              {app.featured && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1"><Sparkles className="h-3 w-3" /> Featured</Badge>}
              {app.isNew && <Badge className="bg-primary/10 text-primary border-primary/20">NEW</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">by <span className="font-medium text-foreground">{app.developer}</span></p>
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="h-4 w-4 fill-amber-400" /> {avgRating.toFixed(1)}
                <span className="text-muted-foreground font-normal">({app.reviews?.length || 0} reviews)</span>
              </span>
              <span className="text-muted-foreground flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {app.installs} installs</span>
              <Badge variant="outline" className="capitalize">{app.category}</Badge>
              <Badge variant={app.price === "free" ? "secondary" : "outline"}>{app.price === "free" ? "âœ… Free" : app.price}</Badge>
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0">
            <Button size="lg" variant={installed ? "outline" : "default"} className="gap-2" onClick={toggleInstall}>
              {installed ? <><Trash2 className="h-4 w-4" /> Remove</> : <><Download className="h-4 w-4" /> Install</>}
            </Button>
            {app.website && (
              <Button size="lg" variant="outline" className="gap-2" onClick={() => window.open(app.website, "_blank")}>
                <ExternalLink className="h-4 w-4" /> Website
              </Button>
            )}
          </div>
        </div>

        {/* App Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Version", value: app.version || "1.0.0", icon: Code },
            { label: "Size", value: app.size || "N/A", icon: HardDrive },
            { label: "Updated", value: app.lastUpdated || "N/A", icon: Calendar },
            { label: "Support", value: app.supportEmail ? "Email" : "Docs", icon: Mail },
          ].map(info => (
            <Card key={info.label}>
              <CardContent className="p-3 flex items-center gap-2">
                <info.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{info.label}</p>
                  <p className="text-xs font-medium text-foreground">{info.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Overview</TabsTrigger>
            <TabsTrigger value="screenshots" className="gap-1.5"><Image className="h-3.5 w-3.5" /> Screenshots</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Reviews ({app.reviews?.length || 0})</TabsTrigger>
            <TabsTrigger value="guide" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Install Guide</TabsTrigger>
            <TabsTrigger value="changelog" className="gap-1.5"><History className="h-3.5 w-3.5" /> Changelog</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-5 mt-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-base font-semibold text-foreground">About this app</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{app.longDescription || app.description}</p>
              </CardContent>
            </Card>

            {app.features && app.features.length > 0 && (
              <Card>
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-base font-semibold text-foreground">Features</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {app.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {app.requirements && app.requirements.length > 0 && (
              <Card>
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Requirements</h3>
                  <ul className="space-y-1.5">
                    {app.requirements.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" /> {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Screenshots */}
          <TabsContent value="screenshots" className="mt-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-base font-semibold text-foreground">Screenshots</h3>
                {app.screenshots && app.screenshots.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {app.screenshots.map((src, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border bg-muted/30 aspect-video flex items-center justify-center">
                        <div className="text-center space-y-2 p-6">
                          <div className="text-4xl">{app.icon}</div>
                          <p className="text-sm font-medium text-foreground">{app.name}</p>
                          <p className="text-xs text-muted-foreground">Screenshot {i + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Image className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No screenshots available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-4 space-y-4">
            {/* Rating Summary */}
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="text-center sm:text-left shrink-0">
                    <p className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 justify-center sm:justify-start my-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{app.reviews?.length || 0} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingDistribution.map(rd => (
                      <div key={rd.star} className="flex items-center gap-2">
                        <span className="text-xs w-6 text-right text-muted-foreground">{rd.star}â˜…</span>
                        <Progress value={rd.percent} className="h-2 flex-1" />
                        <span className="text-xs w-6 text-muted-foreground">{rd.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review List */}
            {app.reviews && app.reviews.length > 0 ? (
              app.reviews.map((review, i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{review.avatar}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{review.user}</p>
                          <p className="text-[10px] text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>No reviews yet. Be the first to review!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Install Guide */}
          <TabsContent value="guide" className="mt-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Installation Guide
                </h3>
                {app.installGuide && app.installGuide.length > 0 ? (
                  <div className="space-y-3">
                    {app.installGuide.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div className="pt-1">
                          <p className="text-sm text-foreground">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No installation guide available. Contact the developer for setup instructions.</p>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Ready to get started?</p>
                  <Button className="gap-2" onClick={toggleInstall} disabled={installed}>
                    <Download className="h-4 w-4" /> {installed ? "Already Installed" : "Install Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Changelog */}
          <TabsContent value="changelog" className="mt-4">
            <Card>
              <CardContent className="p-5 space-y-5">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Version History
                </h3>
                {app.changelog && app.changelog.length > 0 ? (
                  <div className="space-y-5">
                    {app.changelog.map((entry, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-primary/20">
                        <div className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-primary" />
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs font-mono">v{entry.version}</Badge>
                            <span className="text-xs text-muted-foreground">{entry.date}</span>
                            {i === 0 && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Latest</Badge>}
                          </div>
                          <ul className="space-y-1">
                            {entry.changes.map((change, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-1.5">
                                <span className="text-primary mt-1">â€¢</span> {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No changelog available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AppDetailPage;
