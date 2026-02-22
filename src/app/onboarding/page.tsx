"use client";

/**
 * ============================================================================
 * Onboarding Page â€” Dynamic Multi-Step Setup Wizard
 * ============================================================================
 *
 * PURPOSE:
 *   Guides new merchants through platform setup. The steps shown depend on
 *   which business vertical (purpose) the user selects in Step 1.
 *
 * FLOW:
 *   Step 1: BusinessPurposeSelector â†’ User picks one of 13 verticals
 *   Step 2: BusinessInfo â†’ Owner name, email, CR number, country
 *   Step 3: StoreSetup (ecommerce) OR SiteSetup (all other types)
 *   Step 4: PlanSelection â†’ Pricing plans adapted to purpose + region
 *   Step 5 (varies):
 *     - ecommerce â†’ PaymentConnect â†’ FirstProduct
 *     - real-estate â†’ FirstListing (add a property)
 *     - restaurant â†’ MenuSetup (add a menu item)
 *     - all others â†’ Done (no extra step)
 *
 * STATE PERSISTENCE:
 *   On completion, saves to localStorage:
 *     - "merchantCountry" â†’ Used by useMerchantRegion for region detection
 *     - "businessPurpose" â†’ Used everywhere for UI adaptation
 *
 * BACKEND INTEGRATION:
 *   On completion, POST /api/merchant/onboarding with all collected data.
 *   The backend should create the merchant record and return a session.
 *
 * ============================================================================
 */
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, Building2, Store, Crown, CreditCard, PackagePlus, PartyPopper, Globe, Package, Zap, Shield, Compass, Building, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BusinessPurposeSelector, { type BusinessPurpose } from "@/components/onboarding/BusinessPurposeSelector";
import BusinessInfo from "@/components/onboarding/BusinessInfo";
import StoreSetup from "@/components/onboarding/StoreSetup";
import SiteSetup from "@/components/onboarding/SiteSetup";
import PlanSelection from "@/components/onboarding/PlanSelection";
import PaymentConnect from "@/components/onboarding/PaymentConnect";
import FirstProduct from "@/components/onboarding/FirstProduct";
import FirstListing from "@/components/onboarding/FirstListing";
import MenuSetup from "@/components/onboarding/MenuSetup";
import SourcingSetup from "@/components/onboarding/SourcingSetup";
import StoreBranding from "@/components/onboarding/StoreBranding";
import { getRegionByCountry, allModules } from "@/data/regionModules";
import { setMerchantCountry, setBusinessPurpose, completeOnboarding } from "@/hooks/useMerchantRegion";
import { registerTenant, checkProvisioningStatus } from "@/lib/tenantApi";
import { Loader2, Terminal, Activity, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type StepDef = { id: string; label: string; icon: React.ElementType };

/**
 * Returns the onboarding steps array based on selected business purpose.
 * Each purpose gets a tailored wizard flow. This is the key branching logic.
 *
 * Backend note: The step definitions are UI-only. The backend only needs
 * the final collected data (merchant info, plan, purpose, etc.)
 */
const getSteps = (purpose: BusinessPurpose | null): StepDef[] => {
  const base: StepDef[] = [{ id: "purpose", label: "Purpose", icon: Compass }];

  switch (purpose) {
    case "ecommerce":
      return [...base,
      { id: "business", label: "Business Info", icon: Building2 },
      { id: "store", label: "Store Setup", icon: Store },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "plan", label: "Choose Plan", icon: Crown },
      { id: "payment", label: "Payments", icon: CreditCard },
      { id: "product", label: "First Product", icon: PackagePlus },
      ];
    case "business-website":
      return [...base,
      { id: "business", label: "Business Info", icon: Building2 },
      { id: "site", label: "Site Setup", icon: Globe },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "plan", label: "Choose Plan", icon: Crown },
      ];
    case "real-estate":
      return [...base,
      { id: "business", label: "Business Info", icon: Building2 },
      { id: "site", label: "Site Setup", icon: Globe },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "plan", label: "Choose Plan", icon: Crown },
      { id: "listing", label: "First Listing", icon: Building },
      ];
    case "restaurant":
      return [...base,
      { id: "business", label: "Business Info", icon: Building2 },
      { id: "site", label: "Site Setup", icon: Globe },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "plan", label: "Choose Plan", icon: Crown },
      { id: "menu", label: "Menu Item", icon: UtensilsCrossed },
      ];
    case "lms":
    case "healthcare":
    case "fitness":
    case "salon":
    case "freelancer":
    case "travel":
    case "automotive":
    case "event":
    case "saas":
    case "landlord":
    case "education":
      return [...base,
      { id: "business", label: "Business Info", icon: Building2 },
      { id: "site", label: "Site Setup", icon: Globe },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "plan", label: "Choose Plan", icon: Crown },
      ];
    case "cross-border-ior":
      return [...base,
      { id: "business", label: "Business Info", icon: Building2 },
      { id: "sourcing", label: "Sourcing Setup", icon: Globe },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "plan", label: "Choose Plan", icon: Crown },
      ];
    default:
      return base;
  }
};

const purposeLabels: Record<BusinessPurpose, { ready: string; noun: string }> = {
  "ecommerce": { ready: "Your Store is Ready! 🎉", noun: "store" },
  "business-website": { ready: "Your Website is Ready! 🎉", noun: "site" },
  "real-estate": { ready: "Your Property Site is Ready! 🎉", noun: "site" },
  "restaurant": { ready: "Your Restaurant Site is Ready! 🎉", noun: "site" },
  "lms": { ready: "Your Learning Platform is Ready! 🎉", noun: "platform" },
  "healthcare": { ready: "Your Healthcare Site is Ready! 🎉", noun: "site" },
  "fitness": { ready: "Your Fitness Site is Ready! 🎉", noun: "site" },
  "salon": { ready: "Your Salon Site is Ready! 🎉", noun: "site" },
  "freelancer": { ready: "Your Portfolio is Ready! 🎉", noun: "portfolio" },
  "travel": { ready: "Your Travel Site is Ready! 🎉", noun: "site" },
  "automotive": { ready: "Your Auto Site is Ready! 🎉", noun: "site" },
  "event": { ready: "Your Event Site is Ready! 🎉", noun: "site" },
  "saas": { ready: "Your SaaS Site is Ready! 🎉", noun: "platform" },
  "landlord": { ready: "Your Landlord Portal is Ready! 🎉", noun: "portal" },
  "education": { ready: "Your Education Center is Ready! 🎉", noun: "center" },
  "cross-border-ior": { ready: "Your IOR Platform is Ready! 🎉", noun: "platform" },
};

const Onboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [purpose, setPurpose] = useState<BusinessPurpose | null>(null);
  const [businessData, setBusinessData] = useState<Record<string, string>>({});
  const [storeData, setStoreData] = useState<Record<string, string>>({});
  const [brandingData, setBrandingData] = useState<Record<string, string>>({
    primaryColor: "#0d9488",
    fontFamily: "inter"
  });
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [paymentMethods, setPaymentMethods] = useState<Record<string, boolean>>({});
  const [productData, setProductData] = useState<Record<string, string>>({});
  const [sourcingData, setSourcingData] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningStatus, setProvisioningStatus] = useState("Initializing...");
  const [provisioningError, setProvisioningError] = useState<string | null>(null);
  const prevStepRef = useRef(0);

  const steps = useMemo(() => getSteps(purpose), [purpose]);
  const totalSteps = steps.length;
  const currentStepDef = steps[currentStep];

  const updateBusiness = (key: string, value: string) => setBusinessData((prev) => ({ ...prev, [key]: value }));
  const updateStore = (key: string, value: string) => setStoreData((prev) => ({ ...prev, [key]: value }));
  const togglePayment = (key: string) => setPaymentMethods((prev) => ({ ...prev, [key]: !prev[key] }));
  const updateProduct = (key: string, value: string) => setProductData((prev) => ({ ...prev, [key]: value }));

  const canProceed = () => {
    if (!currentStepDef) return false;
    switch (currentStepDef.id) {
      case "purpose": return !!purpose;
      case "business": return !!(businessData.ownerName && businessData.email && businessData.crNumber && businessData.country);
      case "store": return !!(storeData.storeName && storeData.subdomain);
      case "site": return !!(storeData.storeName && storeData.subdomain);
      case "branding": return !!(brandingData.primaryColor && brandingData.fontFamily);
      case "plan": return !!selectedPlan;
      case "payment": return Object.values(paymentMethods).some(Boolean);
      case "product": return !!(productData.productName && productData.productPrice);
      case "listing": return !!(productData.productName && productData.productPrice);
      case "menu": return !!(productData.productName && productData.productPrice);
      case "sourcing": return !!(sourcingData.markets?.length > 0 && sourcingData.categories?.length > 0);
      default: return false;
    }
  };

  const animateStep = (newStep: number) => {
    setSlideDirection(newStep > currentStep ? "forward" : "backward");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsAnimating(false);
    }, 150);
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      animateStep(currentStep + 1);
    } else {
      setIsProvisioning(true);
      setProvisioningStatus("Queueing setup...");

      try {
        const payload = {
          tenantId: storeData.subdomain,
          tenantName: storeData.storeName,
          companyName: businessData.companyName || storeData.storeName,
          purpose: purpose,
          plan: selectedPlan,
          branding: brandingData,
          businessType: businessData.businessType || "llc",
          adminName: businessData.ownerName,
          adminEmail: businessData.email,
          adminPassword: "Password123!",
          phone: businessData.phone || "+966 500 000 000",
          address: businessData.city || "Riyadh",
          city: businessData.city || "Riyadh",
          country: businessData.country,
        };

        const response = await registerTenant(payload);

        if (response.success) {
          // Start polling for status
          const tenantId = payload.tenantId;
          const pollInterval = setInterval(async () => {
            try {
              const statusData = await checkProvisioningStatus(tenantId);
              if (statusData.success) {
                const stepMap: Record<string, string> = {
                  'queued': 'Queueing task on Neural Engine...',
                  'creating_db': 'Provisioning isolated storage...',
                  'migrating': 'Initializing module schemas...',
                  'creating_admin': 'Securing administrative credentials...',
                  'activating_modules': 'Auto-activating starter modules...',
                  'completed': 'Success! Launching your workspace...'
                };

                setProvisioningStatus(stepMap[statusData.status] || "Processing...");

                if (statusData.is_ready) {
                  clearInterval(pollInterval);
                  if (businessData.country) setMerchantCountry(businessData.country);
                  if (purpose) setBusinessPurpose(purpose);
                  completeOnboarding();
                  setCompleted(true);
                  const label = purpose ? (purposeLabels[purpose]?.noun || "platform") : "platform";
                  toast.success(`${label.charAt(0).toUpperCase() + label.slice(1)} created successfully! 🎉`);
                }
              }
            } catch (err) {
              console.error("Poll error", err);
            }
          }, 3000);
        }
      } catch (error: any) {
        setIsProvisioning(false);
        setProvisioningError(error.response?.data?.message || "Failed to initiate onboarding.");
        toast.error("Registration failed", { description: error.response?.data?.message });
      }
    }
  };

  const handlePurposeSelect = (p: BusinessPurpose) => {
    setPurpose(p);
    setBusinessPurpose(p); // Persist immediately so sidebar adapts even if user skips
  };

  if (completed) {
    return <CompletionScreen
      purpose={purpose!}
      businessData={businessData}
      storeData={storeData}
      selectedPlan={selectedPlan}
      paymentMethods={paymentMethods}
      productData={productData}
      brandingData={brandingData}
    />;
  }

  if (isProvisioning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="max-w-md w-full relative z-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex relative">
              <Loader2 className="h-20 w-20 text-primary animate-spin" />
              <Activity className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Creating your Workspace</h2>
              <p className="text-sm text-muted-foreground">This usually takes about 30-45 seconds</p>
            </div>
          </div>

          <Card className="border-border/60 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl">
            <div className="bg-black/80 px-4 py-2 flex items-center gap-2 border-b border-white/5">
              <Terminal className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">Provisioning Console</span>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-emerald-500/80">{provisioningStatus}</span>
                  <span className="text-muted-foreground">Processing...</span>
                </div>
                {/* Fake Progress Bar based on status index */}
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out"
                    style={{
                      width: provisioningStatus.includes("Neural Engine") ? '10%' :
                        provisioningStatus.includes("storage") ? '30%' :
                          provisioningStatus.includes("schemas") ? '60%' :
                            provisioningStatus.includes("credentials") ? '80%' :
                              provisioningStatus.includes("modules") ? '95%' :
                                provisioningStatus.includes("Launch") ? '100%' : '5%'
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-2 font-mono text-[10px] text-muted-foreground/60 leading-tight">
                <p className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Allocation authorized</p>
                <p className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Identity verified</p>
                <p className="flex items-center gap-2 animate-pulse"><Loader2 className="h-3 w-3 animate-spin" /> Executing {provisioningStatus}</p>
              </div>
            </CardContent>
          </Card>

          {provisioningError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center animate-in fade-in duration-300">
              <p className="text-xs font-bold text-destructive mb-3">{provisioningError}</p>
              <Button variant="outline" size="sm" onClick={() => setIsProvisioning(false)} className="h-8 text-[10px] font-bold uppercase transition-all hover:bg-destructive hover:text-white">
                Back to Onboarding
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">
            {purpose ? (purposeLabels[purpose]?.ready || "Welcome").replace("is Ready! 🎉", "Setup") : "Create Your Project"}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>Skip for now</Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        {/* Percentage + Step Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 0}%
            </span>
            <span className="text-sm text-muted-foreground">complete</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {totalSteps}: <span className="text-primary">{currentStepDef?.label}</span>
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-8">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%` }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = currentStep === i;
            const isDone = currentStep > i;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${isDone
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 animate-scale-in"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${isActive ? "text-primary" : isDone ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-3 rounded overflow-hidden bg-border">
                    <div
                      className={`h-full rounded transition-all duration-500 ease-out ${isDone ? "bg-emerald-500 w-full" : "w-0"}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content with slide/fade transition */}
      <div className="max-w-5xl mx-auto px-6 pb-32 overflow-hidden">
        <div
          key={currentStep}
          className={`transition-all duration-300 ease-out ${isAnimating
            ? slideDirection === "forward"
              ? "opacity-0 translate-x-8"
              : "opacity-0 -translate-x-8"
            : "opacity-100 translate-x-0"
            }`}
        >
          {currentStepDef?.id === "purpose" && <BusinessPurposeSelector selected={purpose} onSelect={handlePurposeSelect} />}
          {currentStepDef?.id === "business" && <BusinessInfo data={businessData} onChange={updateBusiness} />}
          {currentStepDef?.id === "store" && <StoreSetup data={storeData} onChange={updateStore} />}
          {currentStepDef?.id === "site" && <SiteSetup data={storeData} onChange={updateStore} />}
          {currentStepDef?.id === "branding" && <StoreBranding data={brandingData} onChange={(k, v) => setBrandingData(prev => ({ ...prev, [k]: v }))} />}
          {currentStepDef?.id === "plan" && <PlanSelection selected={selectedPlan} onSelect={setSelectedPlan} country={businessData.country} businessPurpose={purpose} />}
          {currentStepDef?.id === "payment" && <PaymentConnect data={paymentMethods} onToggle={togglePayment} />}
          {currentStepDef?.id === "product" && <FirstProduct data={productData} onChange={updateProduct} />}
          {currentStepDef?.id === "listing" && <FirstListing data={productData} onChange={updateProduct} />}
          {currentStepDef?.id === "menu" && <MenuSetup data={productData} onChange={updateProduct} />}
          {currentStepDef?.id === "sourcing" && <SourcingSetup data={sourcingData} onChange={(k, v) => setSourcingData(prev => ({ ...prev, [k]: v }))} />}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 inset-x-0 border-t border-border/60 bg-card/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => animateStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:block">{totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 0}% complete</span>
          <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
            {currentStep === totalSteps - 1 ? (purpose === "ecommerce" ? "Create Store" : "Create Site") : "Continue"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Completion Screen (extracted) â”€â”€â”€ */
interface CompletionProps {
  purpose: BusinessPurpose;
  businessData: Record<string, string>;
  storeData: Record<string, string>;
  selectedPlan: string;
  paymentMethods: Record<string, boolean>;
  productData: Record<string, string>;
  brandingData: Record<string, string>;
}

const CompletionScreen = ({ purpose, businessData, storeData, selectedPlan, paymentMethods, productData, brandingData }: CompletionProps) => {
  const router = useRouter();
  const region = businessData.country ? getRegionByCountry(businessData.country) : null;
  const brandColor = brandingData?.primaryColor || "#0d9488";

  useEffect(() => {
    // Initial burst
    const burst = (opts: confetti.Options) =>
      confetti({ origin: { y: 0.6 }, zIndex: 9999, ...opts });

    burst({ particleCount: 80, spread: 70, startVelocity: 35, colors: [brandColor, "#14b8a6", "#ffffff"] });
    setTimeout(() => burst({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors: [brandColor] }), 250);
    setTimeout(() => burst({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors: [brandColor] }), 400);

    return () => { confetti.reset(); };
  }, [brandColor]);
  const coreModulesList = region ? allModules.filter(m => region.modules[m.id] === "core") : [];
  const activePayments = Object.entries(paymentMethods).filter(([, v]) => v).map(([k]) => k);
  const labels = purposeLabels[purpose] || { ready: "Welcome to Zosair!", noun: "business" };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in space-y-6">
        <div className="text-center">
          <div
            className="inline-flex h-20 w-20 items-center justify-center rounded-3xl mb-4"
            style={{ backgroundColor: `${brandColor}15` }}
          >
            <PartyPopper className="h-10 w-10" style={{ color: brandColor }} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">{labels.ready}</h1>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{storeData.storeName}</span> has been created at{" "}
            <span className="font-medium" style={{ color: brandColor }}>{storeData.subdomain}.platform.sa</span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Country & Region */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Globe className="h-4 w-4" style={{ color: brandColor }} /> Region & Country
              </div>
              ...
              <div className="flex flex-wrap gap-1.5">
                {region && (
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                    {region.flag} {region.name}
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px]">ðŸ“ {businessData.country}</Badge>
              </div>
              {region && <p className="text-[10px] text-muted-foreground italic">"{region.positioning}"</p>}
            </CardContent>
          </Card>

          {/* Plan */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Crown className="h-4 w-4" style={{ color: brandColor }} /> Selected Plan
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
                {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
              </Badge>
              <p className="text-[10px] text-muted-foreground">
                {region ? `Currency: ${region.currency.code} (${region.currency.symbol})` : ""}
              </p>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-4 w-4" style={{ color: brandColor }} /> Business
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="text-foreground font-medium">{businessData.ownerName}</span></p>
                <p>{businessData.email}</p>
                {businessData.crNumber && <p>Reg: {businessData.crNumber}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Payments (ecommerce only) */}
          {purpose === "ecommerce" && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CreditCard className="h-4 w-4" style={{ color: brandColor }} /> Payments
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activePayments.length > 0 ? activePayments.map(p => (
                    <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                  )) : (
                    <span className="text-[10px] text-muted-foreground">No payment methods selected</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Core Modules */}
        {coreModulesList.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Package className="h-4 w-4 text-primary" /> Your Modules ({coreModulesList.length} Core Included)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {coreModulesList.map(mod => (
                  <Badge key={mod.id} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                    <Check className="h-3 w-3 mr-0.5" /> {mod.icon} {mod.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compliance */}
        {region && region.compliance.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" /> Compliance & Regulations
              </div>
              <div className="flex flex-wrap gap-1.5">
                {region.compliance.map(c => (
                  <Badge key={c} className="bg-amber-500/10 text-amber-400 border-amber-500/25 text-[10px]">
                    <Check className="h-3 w-3 mr-0.5" /> {c}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* First Product / Listing / Menu */}
        {productData.productName && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <PackagePlus className="h-4 w-4 text-primary" />
                {purpose === "real-estate" ? "First Listing" : purpose === "restaurant" ? "First Menu Item" : "First Product"}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-medium">{productData.productName}</span>
                {productData.productPrice && <span> â€” {region?.currency.symbol || "SAR "}{productData.productPrice}</span>}
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTAs */}
        <div className="flex gap-3 justify-center pt-2">
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="gap-2"
            style={{ backgroundColor: brandColor }}
          >
            <Zap className="h-4 w-4" /> Go to Dashboard
          </Button>
          <Button onClick={() => router.push("/storefront")} variant="outline" size="lg">
            {purpose === "ecommerce" ? "Customize Store" : "Customize Site"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

