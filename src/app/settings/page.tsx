"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useMerchantRegion, type BusinessPurpose } from "@/hooks/useMerchantRegion";
import { allModules } from "@/data/regionModules";
import { purposeConfigs, getPurposeModulesByCategory } from "@/data/businessPurposeModules";
import { Globe, ShieldCheck, Lock, CheckCircle2, ShoppingCart, XCircle, Zap, AlertTriangle, Compass, ShoppingBag, Building, UtensilsCrossed, ChevronDown, ChevronUp, GraduationCap, Trophy, Medal, Target, Flame, Heart, Dumbbell, Scissors, Briefcase, Plane, Car, PartyPopper, Rocket } from "lucide-react";
import { toast } from "sonner";
import { removeAddon, setBusinessPurpose } from "@/hooks/useMerchantRegion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Persist purpose module toggles
function loadPurposeModuleToggles(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem("purposeModuleToggles");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function savePurposeModuleToggles(toggles: Record<string, boolean>) {
  localStorage.setItem("purposeModuleToggles", JSON.stringify(toggles));
}

const Settings = () => {
  const { country, region, isAddonPurchased, purchaseAddon, businessPurpose } = useMerchantRegion();
  const [confirmAction, setConfirmAction] = useState<{ type: "activate" | "deactivate"; moduleId: string; moduleName: string; price?: number } | null>(null);
  const [moduleToggles, setModuleToggles] = useState<Record<string, boolean>>(loadPurposeModuleToggles);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const purposeOptions: { id: BusinessPurpose; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "ecommerce", label: "Online Store", icon: <ShoppingBag className="h-5 w-5" />, desc: "Sell products online" },
    { id: "business-website", label: "Business Website", icon: <Globe className="h-5 w-5" />, desc: "Portfolio / services" },
    { id: "real-estate", label: "Real Estate", icon: <Building className="h-5 w-5" />, desc: "Property listings" },
    { id: "restaurant", label: "Restaurant / Cafe", icon: <UtensilsCrossed className="h-5 w-5" />, desc: "Menu & reservations" },
    { id: "lms", label: "Learning Platform", icon: <GraduationCap className="h-5 w-5" />, desc: "Courses & students" },
    { id: "healthcare", label: "Healthcare / Clinic", icon: <Heart className="h-5 w-5" />, desc: "Appointments & patients" },
    { id: "fitness", label: "Gym / Fitness", icon: <Dumbbell className="h-5 w-5" />, desc: "Classes & memberships" },
    { id: "salon", label: "Salon / Spa", icon: <Scissors className="h-5 w-5" />, desc: "Booking & services" },
    { id: "freelancer", label: "Freelancer / Agency", icon: <Briefcase className="h-5 w-5" />, desc: "Portfolio & clients" },
    { id: "travel", label: "Travel / Tourism", icon: <Plane className="h-5 w-5" />, desc: "Tours & bookings" },
    { id: "automotive", label: "Automotive", icon: <Car className="h-5 w-5" />, desc: "Vehicles & services" },
    { id: "event", label: "Events / Wedding", icon: <PartyPopper className="h-5 w-5" />, desc: "Planning & venues" },
    { id: "saas", label: "SaaS / Digital Product", icon: <Rocket className="h-5 w-5" />, desc: "Landing & pricing" },
  ];

  const currentPurpose = businessPurpose || "ecommerce";
  const purposeConfig = purposeConfigs[currentPurpose];
  const purposeCategories = currentPurpose !== "ecommerce" ? getPurposeModulesByCategory(currentPurpose) : {};

  const isModuleEnabled = (moduleId: string) => moduleToggles[moduleId] !== false; // default enabled

  const toggleModule = (moduleId: string, moduleName: string) => {
    const newState = !isModuleEnabled(moduleId);
    const updated = { ...moduleToggles, [moduleId]: newState };
    setModuleToggles(updated);
    savePurposeModuleToggles(updated);
    toast[newState ? "success" : "info"](
      `${moduleName} ${newState ? "enabled" : "disabled"}`,
      { description: newState ? "Module is now active in your dashboard." : "Module hidden from your dashboard." }
    );
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const trueCoreModules = region ? allModules.filter(m => region.modules[m.id] === "core") : [];
  const purchasedModules = region ? allModules.filter(m => region.modules[m.id] === "addon" && isAddonPurchased(m.id)) : [];
  const coreModules = [...trueCoreModules, ...purchasedModules];
  const addonModules = region ? allModules.filter(m => region.modules[m.id] === "addon" && !isAddonPurchased(m.id)) : [];
  const naModules = region ? allModules.filter(m => region.modules[m.id] === "na") : [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Business Purpose Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-card-foreground flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" /> Business Type
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {purposeOptions.map((opt) => {
              const isActive = (businessPurpose || "ecommerce") === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setBusinessPurpose(opt.id);
                    toast.success(`Switched to ${opt.label}`, { description: "Dashboard and sidebar updated accordingly." });
                  }}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <span className={isActive ? "text-primary" : "text-muted-foreground"}>{opt.icon}</span>
                  <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>{opt.label}</span>
                  <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                  {isActive && (
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-[9px]">Active</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Purpose-Specific Modules Card (non-eCommerce only) */}
        {currentPurpose !== "ecommerce" && Object.keys(purposeCategories).length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-card-foreground flex items-center gap-2">
                <span className="text-xl">{purposeConfig.icon}</span> {purposeConfig.label} Modules
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {purposeConfig.coreModules.filter(m => isModuleEnabled(m.id)).length} / {purposeConfig.coreModules.length} enabled
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-5">{purposeConfig.tagline} â€” toggle modules on/off to customize your workspace</p>

            {Object.entries(purposeCategories).map(([category, modules]) => {
              const isExpanded = expandedCategories[category] !== false; // default expanded
              const enabledCount = modules.filter(m => isModuleEnabled(m.id)).length;
              return (
                <div key={category} className="mb-4 last:mb-0">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5 mb-2 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {category}
                      <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{enabledCount}/{modules.length}</Badge>
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>

                  {isExpanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 px-1">
                      {modules.map(mod => {
                        const enabled = isModuleEnabled(mod.id);
                        return (
                          <div
                            key={mod.id}
                            className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
                              enabled
                                ? "border-emerald-500/20 bg-emerald-500/5"
                                : "border-border bg-muted/30 opacity-60"
                            }`}
                          >
                            <span className="text-xl mt-0.5">{mod.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground">{mod.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {mod.features.slice(0, 3).map(f => (
                                  <Badge key={f} variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-border text-muted-foreground">{f}</Badge>
                                ))}
                                {mod.features.length > 3 && (
                                  <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-border text-muted-foreground">+{mod.features.length - 3}</Badge>
                                )}
                              </div>
                            </div>
                            <Switch
                              checked={enabled}
                              onCheckedChange={() => toggleModule(mod.id, mod.name)}
                              className="shrink-0 mt-0.5"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Region & Modules Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
          <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Region & Active Modules
          </h3>

          {/* Region Info */}
          {region ? (
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <span className="text-3xl">{region.flag}</span>
              <div>
                <p className="font-semibold text-foreground">{region.name}</p>
                <p className="text-xs text-muted-foreground">Country: <span className="font-medium text-foreground">{country}</span> Â· Currency: <span className="font-medium text-foreground">{region.currency.symbol} {region.currency.code}</span></p>
                <p className="text-xs text-muted-foreground italic mt-0.5">"{region.positioning}"</p>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                {region.compliance.map(c => (
                  <Badge key={c} variant="outline" className="text-[10px] border-primary/30 text-primary gap-1">
                    <ShieldCheck className="h-3 w-3" /> {c}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">No region selected. Go to <a href="/onboarding" className="text-primary underline">Onboarding</a> or use the header region switcher.</p>
            </div>
          )}

          {/* Core Modules */}
          {coreModules.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Core Modules <span className="text-xs text-muted-foreground font-normal">â€” Included in your plan</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {coreModules.map(m => {
                  const isPurchased = purchasedModules.some(p => p.id === m.id);
                  return (
                    <div key={m.id} className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
                      <span className="text-lg">{m.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.category}</p>
                      </div>
                      {isPurchased ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2 text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                          onClick={() => setConfirmAction({ type: "deactivate", moduleId: m.id, moduleName: m.name })}
                        >
                          <XCircle className="h-3 w-3" /> Remove
                        </Button>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px] shrink-0">Active</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-on Modules */}
          {addonModules.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <ShoppingCart className="h-4 w-4 text-primary" /> Add-on Modules <span className="text-xs text-muted-foreground font-normal">â€” Available to purchase</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {addonModules.map(m => {
                  const price = region?.addonPricing[m.id];
                  return (
                    <div key={m.id} className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 group hover:border-primary/40 transition-colors">
                      <span className="text-lg">{m.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {price && (
                          <span className="text-[10px] font-semibold text-primary">{region.currency.symbol}{price}/mo</span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] px-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setConfirmAction({ type: "activate", moduleId: m.id, moduleName: m.name, price: price as number | undefined })}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* N/A Modules */}
          {naModules.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> Not Available in Your Region <span className="text-xs font-normal">({naModules.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {naModules.map(m => (
                  <Badge key={m.id} variant="outline" className="text-[10px] text-muted-foreground/60 border-border/50 gap-1">
                    <span>{m.icon}</span> {m.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Business-Type Specific Settings */}
        {currentPurpose === "lms" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> LMS Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-amber-500" /> Gamification
                </h4>
                {[
                  { label: "XP Points System", desc: "Award XP for completing lessons, quizzes, and activities", defaultOn: true },
                  { label: "Leaderboard", desc: "Show public rankings of top-performing students", defaultOn: true },
                  { label: "Badges & Achievements", desc: "Award badges for reaching milestones", defaultOn: true },
                  { label: "Daily Streak Tracking", desc: "Track consecutive login days with streak rewards", defaultOn: true },
                  { label: "Level-up Notifications", desc: "Notify students when they level up", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-500" /> Course & Students
                </h4>
                {[
                  { label: "Auto-issue Certificates", desc: "Automatically generate certificates on course completion", defaultOn: true },
                  { label: "Drip Content", desc: "Release lessons on a schedule instead of all at once", defaultOn: false },
                  { label: "Discussion Forum", desc: "Allow students to discuss in course-specific forums", defaultOn: true },
                  { label: "Student Progress Emails", desc: "Send weekly progress reports to students", defaultOn: false },
                  { label: "Quiz Retake Limit", desc: "Limit quiz retakes to 3 attempts per quiz", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Quick Access</p>
                <p className="text-xs text-muted-foreground">Manage your LMS courses, students, and gamification from the LMS dashboard</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => window.location.href = "/lms"}>Go to LMS <GraduationCap className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        )}

        {currentPurpose === "healthcare" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Healthcare Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Appointments</h4>
                {[
                  { label: "Online Booking", desc: "Allow patients to book appointments online", defaultOn: true },
                  { label: "Auto Reminders", desc: "Send SMS/email reminders before appointments", defaultOn: true },
                  { label: "Recurring Visits", desc: "Schedule automatic recurring appointments", defaultOn: false },
                  { label: "Walk-in Queue", desc: "Enable walk-in patient queue management", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Patient Management</h4>
                {[
                  { label: "E-Prescriptions", desc: "Generate and send prescriptions digitally", defaultOn: true },
                  { label: "Lab Results Upload", desc: "Allow uploading and sharing lab results", defaultOn: true },
                  { label: "Insurance Verification", desc: "Verify insurance before appointments", defaultOn: false },
                  { label: "Telemedicine", desc: "Enable video consultations", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "restaurant" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" /> Restaurant Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Order & Kitchen</h4>
                {[
                  { label: "Kitchen Display (KDS)", desc: "Show orders on kitchen display screens", defaultOn: true },
                  { label: "Auto Accept Orders", desc: "Automatically accept online orders", defaultOn: false },
                  { label: "Order Notifications", desc: "Sound alerts for new orders", defaultOn: true },
                  { label: "Prep Time Estimates", desc: "Show estimated prep time to customers", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Table & Delivery</h4>
                {[
                  { label: "Table Reservations", desc: "Enable online table reservations", defaultOn: true },
                  { label: "QR Menu", desc: "Generate QR codes for digital menus", defaultOn: true },
                  { label: "Delivery Zones", desc: "Define delivery areas with custom fees", defaultOn: false },
                  { label: "Tip Management", desc: "Enable tipping on digital payments", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "real-estate" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> Real Estate Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Listings</h4>
                {[
                  { label: "Auto-publish to Portals", desc: "Sync listings to property portals automatically", defaultOn: true },
                  { label: "Virtual Tour Embed", desc: "Enable 360Â° virtual tours on listings", defaultOn: true },
                  { label: "Price History", desc: "Show price change history on listings", defaultOn: false },
                  { label: "Map Integration", desc: "Show interactive maps with nearby amenities", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Agent & Leads</h4>
                {[
                  { label: "Lead Auto-assignment", desc: "Assign leads to agents automatically", defaultOn: true },
                  { label: "Commission Tracking", desc: "Track agent commissions on closings", defaultOn: true },
                  { label: "E-Signatures", desc: "Enable digital contract signing", defaultOn: false },
                  { label: "Tenant Portal", desc: "Self-service portal for tenants", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "fitness" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" /> Fitness Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Classes & Members</h4>
                {[
                  { label: "Class Waitlist", desc: "Enable waitlist when classes are full", defaultOn: true },
                  { label: "Auto Membership Renewal", desc: "Automatically renew memberships", defaultOn: true },
                  { label: "Trial Period", desc: "Offer free trial memberships", defaultOn: false },
                  { label: "Family Plans", desc: "Allow family membership discounts", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Tracking & Nutrition</h4>
                {[
                  { label: "Progress Photos", desc: "Allow members to upload progress photos", defaultOn: true },
                  { label: "Workout Plans", desc: "Assign custom workout plans", defaultOn: true },
                  { label: "Nutrition Tracking", desc: "Enable calorie and macro tracking", defaultOn: false },
                  { label: "Achievement Badges", desc: "Award badges for fitness milestones", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "salon" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" /> Salon Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Bookings</h4>
                {[
                  { label: "Online Booking", desc: "Allow clients to book online 24/7", defaultOn: true },
                  { label: "Stylist Selection", desc: "Let clients choose their preferred stylist", defaultOn: true },
                  { label: "Cancellation Policy", desc: "Apply fees for late cancellations", defaultOn: false },
                  { label: "Package Deals", desc: "Offer service bundles at discounted rates", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Client Experience</h4>
                {[
                  { label: "Before/After Gallery", desc: "Show transformation photos", defaultOn: true },
                  { label: "Loyalty Points", desc: "Reward repeat visits with points", defaultOn: true },
                  { label: "Gift Cards", desc: "Sell and redeem gift cards", defaultOn: false },
                  { label: "Product Recommendations", desc: "Suggest retail products after service", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "freelancer" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Freelancer Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Portfolio & Services</h4>
                {[
                  { label: "Project Showcase", desc: "Display completed projects publicly", defaultOn: true },
                  { label: "Client Testimonials", desc: "Show client reviews and ratings", defaultOn: true },
                  { label: "Custom Quotes", desc: "Allow clients to request custom quotes", defaultOn: true },
                  { label: "Retainer Plans", desc: "Offer monthly retainer packages", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Invoicing & Clients</h4>
                {[
                  { label: "Auto Invoicing", desc: "Generate invoices on milestone completion", defaultOn: true },
                  { label: "Time Tracking", desc: "Track billable hours per project", defaultOn: false },
                  { label: "Payment Reminders", desc: "Auto-send payment reminders for overdue invoices", defaultOn: true },
                  { label: "Client Portal", desc: "Give clients access to project updates", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "travel" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" /> Travel Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Bookings & Tours</h4>
                {[
                  { label: "Instant Booking", desc: "Allow instant booking without approval", defaultOn: true },
                  { label: "Seasonal Pricing", desc: "Adjust prices based on season/demand", defaultOn: true },
                  { label: "Group Discounts", desc: "Offer discounts for group bookings", defaultOn: false },
                  { label: "Cancellation Policy", desc: "Apply refund rules for cancellations", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Destinations & Reviews</h4>
                {[
                  { label: "Traveler Reviews", desc: "Allow travelers to leave reviews", defaultOn: true },
                  { label: "Photo Uploads", desc: "Let travelers share trip photos", defaultOn: true },
                  { label: "Weather Info", desc: "Show weather info on destination pages", defaultOn: false },
                  { label: "Partner Hotels", desc: "Show partner hotel recommendations", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "automotive" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" /> Automotive Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Listings & Sales</h4>
                {[
                  { label: "360Â° Vehicle Photos", desc: "Enable 360Â° photo viewer for vehicles", defaultOn: true },
                  { label: "Comparison Tool", desc: "Let buyers compare vehicles side by side", defaultOn: true },
                  { label: "Test Drive Booking", desc: "Allow online test drive scheduling", defaultOn: true },
                  { label: "Trade-in Calculator", desc: "Show estimated trade-in values", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Service & Fleet</h4>
                {[
                  { label: "Service Reminders", desc: "Send automatic service due reminders", defaultOn: true },
                  { label: "Parts Compatibility", desc: "Check parts compatibility by VIN", defaultOn: false },
                  { label: "Fleet Tracking", desc: "GPS tracking for fleet vehicles", defaultOn: false },
                  { label: "Finance Calculator", desc: "EMI and loan calculators for buyers", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "event" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-primary" /> Event Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Events & RSVP</h4>
                {[
                  { label: "Online RSVP", desc: "Allow guests to RSVP online", defaultOn: true },
                  { label: "QR Check-in", desc: "Use QR codes for event check-in", defaultOn: true },
                  { label: "Seating Charts", desc: "Create and manage seating arrangements", defaultOn: false },
                  { label: "Countdown Timer", desc: "Show countdown on event pages", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Vendors & Marketing</h4>
                {[
                  { label: "Vendor Directory", desc: "List and manage event vendors", defaultOn: true },
                  { label: "Early Bird Pricing", desc: "Offer early bird ticket discounts", defaultOn: false },
                  { label: "Event Gallery", desc: "Share photo/video highlights", defaultOn: true },
                  { label: "Email Invitations", desc: "Send branded email invitations", defaultOn: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "saas" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" /> SaaS Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Product & Pricing</h4>
                {[
                  { label: "Feature Comparison", desc: "Show plan feature comparison table", defaultOn: true },
                  { label: "Free Trial", desc: "Offer free trial period for new users", defaultOn: true },
                  { label: "Annual Discount", desc: "Show annual vs monthly pricing toggle", defaultOn: true },
                  { label: "Usage-based Billing", desc: "Bill based on API calls or usage metrics", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Growth & Community</h4>
                {[
                  { label: "Public Roadmap", desc: "Show public roadmap with feature voting", defaultOn: true },
                  { label: "Changelog", desc: "Publish release notes and updates", defaultOn: true },
                  { label: "API Documentation", desc: "Auto-generate API docs for developers", defaultOn: false },
                  { label: "Community Forum", desc: "Enable community discussions", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPurpose === "business-website" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
            <h3 className="mb-5 text-base font-semibold text-card-foreground flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Website Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Content & Pages</h4>
                {[
                  { label: "Blog Engine", desc: "Enable blog with categories and tags", defaultOn: true },
                  { label: "Portfolio Section", desc: "Showcase projects and case studies", defaultOn: true },
                  { label: "Testimonials", desc: "Display client testimonials and reviews", defaultOn: true },
                  { label: "Multi-language", desc: "Support multiple language versions", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Lead Generation</h4>
                {[
                  { label: "Contact Forms", desc: "Custom contact forms with email alerts", defaultOn: true },
                  { label: "Live Chat Widget", desc: "Real-time chat with website visitors", defaultOn: false },
                  { label: "Newsletter Signup", desc: "Collect email subscribers", defaultOn: true },
                  { label: "Appointment Booking", desc: "Allow visitors to schedule meetings", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-card-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-base font-semibold text-card-foreground">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Musharof Chowdhury" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="musharof@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" className="mt-1.5" />
            </div>
            <Button className="mt-2">Save Changes</Button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-base font-semibold text-card-foreground">Notification Preferences</h3>
          <div className="space-y-5">
            {[
              { label: "Email Notifications", desc: "Receive email updates about your account activity" },
              { label: "Push Notifications", desc: "Get push notifications for important updates" },
              { label: "Marketing Emails", desc: "Receive emails about new features and promotions" },
              { label: "Security Alerts", desc: "Get notified about security-related events" },
              { label: "Weekly Reports", desc: "Receive weekly summary reports via email" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmAction?.type === "activate" ? (
                <><Zap className="h-5 w-5 text-primary" /> Activate Module</>
              ) : (
                <><AlertTriangle className="h-5 w-5 text-destructive" /> Deactivate Module</>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "activate" ? (
                <>Are you sure you want to activate <strong>{confirmAction.moduleName}</strong>?{confirmAction.price && <> This will add <strong>{region?.currency.symbol}{confirmAction.price}/mo</strong> to your subscription.</>}</>
              ) : (
                <>Are you sure you want to deactivate <strong>{confirmAction?.moduleName}</strong>? You will lose access to this module's features immediately.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirmAction?.type === "deactivate" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
              onClick={() => {
                if (!confirmAction) return;
                if (confirmAction.type === "activate") {
                  purchaseAddon(confirmAction.moduleId);
                  toast.success(`${confirmAction.moduleName} activated! ðŸŽ‰`, { description: `${region?.currency.symbol}${confirmAction.price}/mo added to your subscription.` });
                } else {
                  removeAddon(confirmAction.moduleId);
                  toast.info(`${confirmAction.moduleName} deactivated`, { description: "Module removed from your subscription." });
                }
                setConfirmAction(null);
              }}
            >
              {confirmAction?.type === "activate" ? "Yes, Activate" : "Yes, Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Settings;

