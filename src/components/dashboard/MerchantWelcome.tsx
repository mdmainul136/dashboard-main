"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { useRouter } from 'next/navigation';
import { Rocket, ExternalLink, Globe, Building, UtensilsCrossed, Heart, Dumbbell, Scissors, Briefcase, Plane, Car, PartyPopper, GraduationCap, Home, School } from "lucide-react";

const purposeConfig: Record<string, { icon: any; title: { en: string; ar: string }; desc: { en: string; ar: string }; cta: { en: string; ar: string } }> = {
  ecommerce: {
    icon: Rocket,
    title: { en: "Welcome to your Store! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…ØªØ¬Ø±Ùƒ! ðŸŽ‰" },
    desc: { en: "Complete your store setup to start selling â€” customize your storefront & connect payments", ar: "Ø£ÙƒÙ…Ù„ Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ØªØ¬Ø±Ùƒ Ù„Ø¨Ø¯Ø¡ Ø§Ù„Ø¨ÙŠØ¹ â€” ÙŠÙ…ÙƒÙ†Ùƒ ØªØ®ØµÙŠØµ ÙˆØ§Ø¬Ù‡ØªÙƒ ÙˆØ±Ø¨Ø· Ø¨ÙˆØ§Ø¨Ø§Øª Ø§Ù„Ø¯ÙØ¹" },
    cta: { en: "Customize Store", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ØªØ¬Ø±" },
  },
  "business-website": {
    icon: Globe,
    title: { en: "Welcome to your Website! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…ÙˆÙ‚Ø¹Ùƒ! ðŸŽ‰" },
    desc: { en: "Set up your pages, blog, and SEO â€” make your business shine online", ar: "Ù‚Ù… Ø¨Ø¥Ø¹Ø¯Ø§Ø¯ ØµÙØ­Ø§ØªÙƒ ÙˆÙ…Ø¯ÙˆÙ†ØªÙƒ ÙˆØªØ­Ø³ÙŠÙ† Ù…Ø­Ø±ÙƒØ§Øª Ø§Ù„Ø¨Ø­Ø«" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  "real-estate": {
    icon: Building,
    title: { en: "Welcome to your Property Site! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª! ðŸŽ‰" },
    desc: { en: "Add listings, manage inquiries, and grow your real estate business", ar: "Ø£Ø¶Ù Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª ÙˆØ£Ø¯Ø± Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª ÙˆØ·ÙˆÙ‘Ø± Ø¹Ù…Ù„Ùƒ Ø§Ù„Ø¹Ù‚Ø§Ø±ÙŠ" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  restaurant: {
    icon: UtensilsCrossed,
    title: { en: "Welcome to your Restaurant Site! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…ÙˆÙ‚Ø¹ Ù…Ø·Ø¹Ù…Ùƒ! ðŸŽ‰" },
    desc: { en: "Build your digital menu, accept reservations, and reach more customers", ar: "Ø£Ù†Ø´Ø¦ Ù‚Ø§Ø¦Ù…Ø© Ø·Ø¹Ø§Ù…Ùƒ Ø§Ù„Ø±Ù‚Ù…ÙŠØ© ÙˆØ§Ù‚Ø¨Ù„ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª" },
    cta: { en: "Customize Menu", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©" },
  },
  lms: {
    icon: GraduationCap,
    title: { en: "Welcome to your Academy! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØªÙƒ! ðŸŽ‰" },
    desc: { en: "Create courses, manage students, and grow your learning platform", ar: "Ø£Ù†Ø´Ø¦ Ø§Ù„Ø¯ÙˆØ±Ø§Øª ÙˆØ£Ø¯Ø± Ø§Ù„Ø·Ù„Ø§Ø¨" },
    cta: { en: "Customize Platform", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…Ù†ØµØ©" },
  },
  healthcare: {
    icon: Heart,
    title: { en: "Welcome to your Clinic! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ø¹ÙŠØ§Ø¯ØªÙƒ! ðŸŽ‰" },
    desc: { en: "Set up appointments, doctor profiles, and patient management", ar: "Ù‚Ù… Ø¨Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯ ÙˆÙ…Ù„ÙØ§Øª Ø§Ù„Ø£Ø·Ø¨Ø§Ø¡" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  fitness: {
    icon: Dumbbell,
    title: { en: "Welcome to your Gym! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ø¬ÙŠÙ…Ùƒ! ðŸŽ‰" },
    desc: { en: "Set up classes, memberships, and trainer profiles", ar: "Ù‚Ù… Ø¨Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø­ØµØµ ÙˆØ§Ù„Ø§Ø´ØªØ±Ø§ÙƒØ§Øª" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  salon: {
    icon: Scissors,
    title: { en: "Welcome to your Salon! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ ØµØ§Ù„ÙˆÙ†Ùƒ! ðŸŽ‰" },
    desc: { en: "Set up services, booking system, and staff profiles", ar: "Ù‚Ù… Ø¨Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø®Ø¯Ù…Ø§Øª ÙˆÙ†Ø¸Ø§Ù… Ø§Ù„Ø­Ø¬Ø²" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  freelancer: {
    icon: Briefcase,
    title: { en: "Welcome to your Portfolio! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…Ø­ÙØ¸ØªÙƒ! ðŸŽ‰" },
    desc: { en: "Showcase your work, attract clients, and manage projects", ar: "Ø§Ø¹Ø±Ø¶ Ø£Ø¹Ù…Ø§Ù„Ùƒ ÙˆØ§Ø¬Ø°Ø¨ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡" },
    cta: { en: "Customize Portfolio", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…Ø­ÙØ¸Ø©" },
  },
  travel: {
    icon: Plane,
    title: { en: "Welcome to your Travel Site! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø³ÙØ±! ðŸŽ‰" },
    desc: { en: "Create tour packages, manage bookings, and showcase destinations", ar: "Ø£Ù†Ø´Ø¦ Ø¨Ø§Ù‚Ø§Øª Ø§Ù„Ø³ÙØ± ÙˆØ£Ø¯Ø± Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  automotive: {
    icon: Car,
    title: { en: "Welcome to your Auto Site! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø³ÙŠØ§Ø±Ø§Øª! ðŸŽ‰" },
    desc: { en: "List vehicles, manage service bookings, and attract buyers", ar: "Ø£Ø¶Ù Ø§Ù„Ø³ÙŠØ§Ø±Ø§Øª ÙˆØ£Ø¯Ø± Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  event: {
    icon: PartyPopper,
    title: { en: "Welcome to your Event Site! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…ÙˆÙ‚Ø¹ Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª! ðŸŽ‰" },
    desc: { en: "Plan events, manage RSVPs, and showcase your venues", ar: "Ø®Ø·Ø· Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª ÙˆØ£Ø¯Ø± Ø§Ù„Ø¯Ø¹ÙˆØ§Øª" },
    cta: { en: "Customize Site", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
  },
  saas: {
    icon: Rocket,
    title: { en: "Welcome to your SaaS! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù…Ù†ØµØªÙƒ! ðŸŽ‰" },
    desc: { en: "Build your landing page, set up pricing, and launch your product", ar: "Ø£Ù†Ø´Ø¦ ØµÙØ­Ø© Ø§Ù„Ù‡Ø¨ÙˆØ· ÙˆØ­Ø¯Ø¯ Ø§Ù„Ø£Ø³Ø¹Ø§Ø±" },
    cta: { en: "Customize Platform", ar: "ØªØ®ØµÙŠØµ Ø§Ù„Ù…Ù†ØµØ©" },
  },
  landlord: {
    icon: Home,
    title: { en: "Welcome to your Property Dashboard! ðŸŽ‰", ar: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ù„ÙˆØ­Ø© Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª! ðŸŽ‰" },
    desc: { en: "Manage tenants, collect rent, and track maintenance requests", ar: "Ø£Ø¯Ø± Ø§Ù„Ù…Ø³ØªØ£Ø¬Ø±ÙŠÙ† ÙˆØ§Ø¬Ù…Ø¹ Ø§Ù„Ø¥ÙŠØ¬Ø§Ø±Ø§Øª ÙˆØªØªØ¨Ø¹ Ø·Ù„Ø¨Ø§Øª Ø§Ù„ØµÙŠØ§Ù†Ø©" },
    cta: { en: "View Properties", ar: "Ø¹Ø±Ø¶ Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª" },
  },
  education: {
    icon: School,
    title: { en: "Welcome to your Education Center! 🎉", ar: "مرحباً بك في مركزك التعليمي! 🎉" },
    desc: { en: "Manage classes, track attendance, and collect fees seamlessly", ar: "أدر الحصص وتتبع الحضور واجمع الرسوم بسهولة" },
    cta: { en: "View Classes", ar: "عرض الحصص" },
  },
  "cross-border-ior": {
    icon: Globe,
    title: { en: "Welcome to your IOR Hub! 🎉", ar: "مرحباً بك في مركز الاستيراد! 🎉" },
    desc: { en: "Manage product sourcing, global logistics, and IOR compliance tasks", ar: "أدر توريد المنتجات، والخدمات اللوجستية العالمية، ومهام الامتثال" },
    cta: { en: "Customize Platform", ar: "تخصيص المنصة" },
  },
};

const MerchantWelcome = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const router = useRouter();
  const { businessPurpose } = useMerchantRegion();

  const config = purposeConfig[businessPurpose || "ecommerce"] || purposeConfig["ecommerce"];
  const Icon = config.icon || Rocket;

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isAr ? config.title.ar : config.title.en}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isAr ? config.desc.ar : config.desc.en}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/storefront")} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {isAr ? config.cta.ar : config.cta.en}
            </Button>
            <Button variant="outline" onClick={() => router.push("/onboarding")}>
              {isAr ? "Ù…Ø¹Ø§Ù„Ø¬ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯" : "Setup Wizard"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantWelcome;
