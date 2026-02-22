"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, Building2, Store, Crown, CreditCard, PackagePlus, PartyPopper, Globe, Package, Zap, Shield, Compass, Building, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useBusinessPurpose } from "@/context/BusinessPurposeContext";
import BusinessPurposeSelector from "@/components/onboarding/business-purpose/BusinessPurposeSelector";
import BusinessInfo from "@/components/onboarding/BusinessInfo";
import StoreSetup from "@/components/onboarding/StoreSetup";
import SiteSetup from "@/components/onboarding/SiteSetup";
import PlanSelection from "@/components/onboarding/PlanSelection";
import PaymentConnect from "@/components/onboarding/PaymentConnect";
import FirstProduct from "@/components/onboarding/FirstProduct";
import FirstListing from "@/components/onboarding/FirstListing";
import MenuSetup from "@/components/onboarding/MenuSetup";
import { getRegionByCountry, allModules } from "@/data/regionModules";
import { type BusinessPurpose, type MerchantData } from "@/types/businessPurpose";
import { cn } from "@/lib/utils";

type StepDef = { id: string; label: string; icon: React.ElementType };

const getSteps = (purpose: BusinessPurpose | null): StepDef[] => {
    const base: StepDef[] = [{ id: "purpose", label: "Purpose", icon: Compass }];

    switch (purpose) {
        case "ecommerce":
            return [...base,
            { id: "business", label: "Business Info", icon: Building2 },
            { id: "store", label: "Store Setup", icon: Store },
            { id: "plan", label: "Choose Plan", icon: Crown },
            { id: "payment", label: "Payments", icon: CreditCard },
            { id: "product", label: "First Product", icon: PackagePlus },
            ];
        case "business-website":
            return [...base,
            { id: "business", label: "Business Info", icon: Building2 },
            { id: "site", label: "Site Setup", icon: Globe },
            { id: "plan", label: "Choose Plan", icon: Crown },
            ];
        case "real-estate":
            return [...base,
            { id: "business", label: "Business Info", icon: Building2 },
            { id: "site", label: "Site Setup", icon: Globe },
            { id: "plan", label: "Choose Plan", icon: Crown },
            { id: "listing", label: "First Listing", icon: Building },
            ];
        case "restaurant":
            return [...base,
            { id: "business", label: "Business Info", icon: Building2 },
            { id: "site", label: "Site Setup", icon: Globe },
            { id: "plan", label: "Choose Plan", icon: Crown },
            { id: "menu", label: "Menu Item", icon: UtensilsCrossed },
            ];
        case "cross-border-ior":
            return [...base,
            { id: "business", label: "Business Info", icon: Building2 },
            { id: "site", label: "Platform Setup", icon: Globe },
            { id: "plan", label: "Choose Plan", icon: Crown },
            ];
        default:
            if (purpose) {
                return [...base,
                { id: "business", label: "Business Info", icon: Building2 },
                { id: "site", label: "Site Setup", icon: Globe },
                { id: "plan", label: "Choose Plan", icon: Crown },
                ];
            }
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
    const {
        businessPurpose, setBusinessPurpose,
        setCountry, region,
        currentStep: contextStep, setCurrentStep: setContextStep,
        merchantData, setMerchantData,
        isLoading: contextLoading
    } = useBusinessPurpose();

    const [currentStep, setCurrentStep] = useState(0);
    const [businessData, setBusinessData] = useState<MerchantData>({});
    const [storeData, setStoreData] = useState<MerchantData>({});
    const [productData, setProductData] = useState<MerchantData>({});
    const [completed, setCompleted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward");

    // Sync context to local state on mount
    useEffect(() => {
        if (!contextLoading && contextStep !== undefined) {
            setCurrentStep(contextStep);
        }
    }, [contextLoading, contextStep]);

    // Initialize local data from merchantData
    useEffect(() => {
        if (merchantData) {
            setBusinessData((prev) => ({ ...prev, ...merchantData }));
            setStoreData((prev) => ({ ...prev, ...merchantData }));
        }
    }, [merchantData]);

    const steps = useMemo(() => getSteps(businessPurpose), [businessPurpose]);
    const totalSteps = steps.length;
    const currentStepDef = steps[currentStep];

    const handleNext = () => {
        // Save current step data to context
        const currentStepDef = steps[currentStep];
        if (currentStepDef.id === "business") {
            setMerchantData(businessData);
        } else if (currentStepDef.id === "store" || currentStepDef.id === "site") {
            setMerchantData(storeData);
        } else if (currentStepDef.id === "plan") {
            setMerchantData({ plan: businessData.plan });
        }

        if (currentStep < totalSteps - 1) {
            setSlideDirection("forward");
            setIsAnimating(true);
            setTimeout(() => {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                setContextStep(nextStep);
                setIsAnimating(false);
            }, 200);
        } else {
            // Final submission
            setMerchantData({ ...businessData, ...storeData });
            setCompleted(true);
            toast.success("Project setup complete! 🎉");
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setSlideDirection("backward");
            setIsAnimating(true);
            setTimeout(() => {
                const prevStep = currentStep - 1;
                setCurrentStep(prevStep);
                setContextStep(prevStep);
                setIsAnimating(false);
            }, 200);
        }
    };

    const handlePurposeSelect = (p: BusinessPurpose) => {
        setBusinessPurpose(p);
        handleNext();
    };

    const handleBusinessChange = (data: MerchantData) => {
        setBusinessData(data);
        if (data.country) setCountry(data.country);
    };

    const canProceed = () => {
        if (!currentStepDef) return false;
        switch (currentStepDef.id) {
            case "purpose": return !!businessPurpose;
            case "business": return !!(businessData.country && businessData.email);
            case "store":
            case "site": return !!(storeData.storeNameEn || storeData.siteNameEn);
            case "plan": return !!businessData.plan;
            default: return true;
        }
    };

    if (completed) {
        return <CompletionScreen purpose={businessPurpose!} businessData={businessData} storeData={storeData} productData={productData} />;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">Z</div>
                        <span className="font-bold text-foreground">Zosair Onboarding</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>Save & Exit</Button>
                </div>
            </header>

            {/* Progress */}
            <div className="max-w-4xl mx-auto w-full px-4 pt-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Step {currentStep + 1} of {totalSteps}
                    </span>
                    <span className="text-xs font-bold text-primary">
                        {Math.round((currentStep / (totalSteps - 1 || 1)) * 100)}% Complete
                    </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-8 flex gap-1">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-full flex-1 transition-all duration-500",
                                currentStep >= i ? "bg-primary" : "bg-muted"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full pb-32">
                <div className={cn(
                    "transition-all duration-300",
                    isAnimating
                        ? slideDirection === "forward" ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8"
                        : "opacity-100 translate-x-0"
                )}>
                    {currentStepDef?.id === "purpose" && <BusinessPurposeSelector selected={businessPurpose} onSelect={handlePurposeSelect} />}
                    {currentStepDef?.id === "business" && <BusinessInfo data={businessData} onChange={handleBusinessChange} />}
                    {currentStepDef?.id === "store" && <StoreSetup data={storeData} onChange={setStoreData} />}
                    {currentStepDef?.id === "site" && <SiteSetup data={storeData} onChange={setStoreData} />}
                    {currentStepDef?.id === "plan" && <PlanSelection data={businessData} onChange={setBusinessData} />}
                    {currentStepDef?.id === "payment" && <PaymentConnect data={businessData} onChange={setBusinessData} />}
                    {currentStepDef?.id === "product" && <FirstProduct data={productData} onChange={setProductData} />}
                    {currentStepDef?.id === "listing" && <FirstListing data={productData} onChange={setProductData} />}
                    {currentStepDef?.id === "menu" && <MenuSetup data={productData} onChange={setProductData} />}
                </div>
            </main>

            {/* Footer Nav */}
            <footer className="fixed bottom-0 inset-x-0 border-t border-border/60 bg-card/80 backdrop-blur-md z-50">
                <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="gap-2 font-bold">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!canProceed() || isAnimating} className="gap-2 px-8 font-bold shadow-lg shadow-primary/20">
                        {currentStep === totalSteps - 1 ? "Finish Setup" : "Continue"} <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </footer>
        </div>
    );
};

/* --- Completion Screen --- */
interface CompletionScreenProps {
    purpose: BusinessPurpose;
    businessData: MerchantData;
    storeData: MerchantData;
    productData: MerchantData;
}

const CompletionScreen = ({ purpose, businessData, storeData, productData }: CompletionScreenProps) => {
    const router = useRouter();
    const { region } = useBusinessPurpose();

    useEffect(() => {
        const burst = (opts: Record<string, unknown>) => confetti({ origin: { y: 0.6 }, zIndex: 9999, ...opts });
        burst({ particleCount: 100, spread: 70, startVelocity: 40 });
        return () => {
            confetti.reset();
        };
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-fade-in">
            <Card className="max-w-xl w-full border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-emerald-500" />
                <CardContent className="p-12 text-center space-y-6">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce">
                        <PartyPopper className="h-12 w-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {purposeLabels[purpose]?.ready || "Welcome to Zosair!"}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
                        Your {purposeLabels[purpose]?.noun || "business"} has been created successfully.
                        You can now start managing your customers and operations from the dashboard.
                    </p>
                    <div className="pt-8 flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => router.push("/")} className="flex-1 h-12 font-bold gap-2">
                            <Zap className="h-4 w-4" /> Go to Dashboard
                        </Button>
                        <Button variant="outline" onClick={() => window.open(`https://${storeData.subdomain || "my"}.zosair.com`, "_blank")} className="flex-1 h-12 font-bold gap-2">
                            <Globe className="h-4 w-4" /> View Site
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Onboarding;
