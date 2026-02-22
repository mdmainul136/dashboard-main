"use client";

import { useState, useCallback, useMemo } from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, Circle, Store, CreditCard, Package, Truck,
  ShieldCheck, MapPin, Palette, Megaphone, ArrowRight, Sparkles,
  FileText, Search, Globe, Building, UtensilsCrossed, Users,
  Heart, CalendarCheck, Video, Dumbbell, Scissors, Briefcase,
  Plane, Car, PartyPopper, Rocket, BookOpen, GraduationCap,
  DollarSign, Image, Code, Ticket, Wrench, UserCog, Home, FileSignature,
  School, ClipboardList,
} from "lucide-react";

const STORAGE_KEY = "merchant-checklist-state";

const getStoredState = (defaults: Record<string, boolean>): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch { return defaults; }
};

const ecommerceItems = [
  { id: "business", label: { en: "Business Information", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù†Ø´Ø§Ø· Ø§Ù„ØªØ¬Ø§Ø±ÙŠ" }, description: { en: "CR number, VAT, and owner details", ar: "Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„ØªØ¬Ø§Ø±ÙŠ ÙˆØ§Ù„Ø±Ù‚Ù… Ø§Ù„Ø¶Ø±ÙŠØ¨ÙŠ" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "store", label: { en: "Store Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ØªØ¬Ø±" }, description: { en: "Name, category, subdomain", ar: "Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„ØªØµÙ†ÙŠÙ ÙˆØ§Ù„Ù†Ø·Ø§Ù‚ Ø§Ù„ÙØ±Ø¹ÙŠ" }, icon: <Palette className="h-4 w-4" />, link: "/storefront" },
  { id: "payment", label: { en: "Payment Gateway", ar: "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¯ÙØ¹" }, description: { en: "Connect Mada, STC Pay, or Tabby", ar: "Ø±Ø¨Ø· Ù…Ø¯Ù‰ Ø£Ùˆ STC Pay Ø£Ùˆ ØªØ§Ø¨ÙŠ" }, icon: <CreditCard className="h-4 w-4" />, link: "/ecommerce/payment-channels" },
  { id: "product", label: { en: "First Product", ar: "Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ø£ÙˆÙ„" }, description: { en: "Add at least one product", ar: "Ø£Ø¶Ù Ù…Ù†ØªØ¬Ø§Ù‹ ÙˆØ§Ø­Ø¯Ø§Ù‹" }, icon: <Package className="h-4 w-4" />, link: "/inventory/products" },
  { id: "shipping", label: { en: "Shipping Settings", ar: "Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø´Ø­Ù†" }, description: { en: "Configure delivery zones and rates", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„ØªÙˆØµÙŠÙ„" }, icon: <Truck className="h-4 w-4" />, link: "/ecommerce/delivery" },
  { id: "maroof", label: { en: "Maroof Verification", ar: "ØªÙˆØ«ÙŠÙ‚ Ù…Ø¹Ø±ÙˆÙ" }, description: { en: "Verify your store on Maroof", ar: "ÙˆØ«Ù‘Ù‚ Ù…ØªØ¬Ø±Ùƒ Ø¹Ù„Ù‰ Ù…Ø¹Ø±ÙˆÙ" }, icon: <ShieldCheck className="h-4 w-4" />, link: "/saudi-services" },
  { id: "address", label: { en: "National Address", ar: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙˆØ·Ù†ÙŠ" }, description: { en: "Add your SPL national address", ar: "Ø£Ø¶Ù Ø¹Ù†ÙˆØ§Ù†Ùƒ Ø§Ù„ÙˆØ·Ù†ÙŠ" }, icon: <MapPin className="h-4 w-4" />, link: "/saudi-services" },
  { id: "marketing", label: { en: "First Campaign", ar: "Ø£ÙˆÙ„ Ø­Ù…Ù„Ø© ØªØ³ÙˆÙŠÙ‚ÙŠØ©" }, description: { en: "Launch a marketing campaign", ar: "Ø£Ø·Ù„Ù‚ Ø­Ù…Ù„Ø© ØªØ³ÙˆÙŠÙ‚ÙŠØ©" }, icon: <Megaphone className="h-4 w-4" />, link: "/marketing" },
  { id: "sgtm", label: { en: "Server Tracking Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„ØªØªØ¨Ø¹ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠ" }, description: { en: "Configure sGTM and first-party data", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ sGTM ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø£ÙˆÙ„Ù‰" }, icon: <Rocket className="h-4 w-4" />, link: "/tracking/analytics" },
  { id: "ior", label: { en: "IOR Compliance", ar: "Ø§Ù„Ø§Ù…ØªØ«Ø§Ù„ Ù„Ù„Ø§Ø³ØªÙŠØ±Ø§Ø¯" }, description: { en: "Verify HS codes and trade documents", ar: "Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø±Ù…ÙˆØ² HS ÙˆØ§Ù„ÙˆØ«Ø§Ø¦Ù‚" }, icon: <ShieldCheck className="h-4 w-4" />, link: "/ior/compliance" },
];

const websiteItems = [
  { id: "business", label: { en: "Business Information", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù†Ø´Ø§Ø·" }, description: { en: "Company details and contact info", ar: "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ©" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Name, subdomain, industry", ar: "Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„Ù†Ø·Ø§Ù‚ ÙˆØ§Ù„ØµÙ†Ø§Ø¹Ø©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "pages", label: { en: "Create Pages", ar: "Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„ØµÙØ­Ø§Øª" }, description: { en: "About, Services, Contact pages", ar: "ØµÙØ­Ø§Øª Ù…Ù† Ù†Ø­Ù† ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª" }, icon: <FileText className="h-4 w-4" />, link: "/pages-blog" },
  { id: "seo", label: { en: "SEO Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ SEO" }, description: { en: "Meta tags, sitemap, keywords", ar: "Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ÙˆØµÙÙŠØ© ÙˆØ§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…ÙØªØ§Ø­ÙŠØ©" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
  { id: "crm", label: { en: "CRM Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ CRM" }, description: { en: "Set up contact forms and leads", ar: "Ù†Ù…Ø§Ø°Ø¬ Ø§Ù„Ø§ØªØµØ§Ù„ ÙˆØ§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙŠÙ†" }, icon: <Users className="h-4 w-4" />, link: "/crm" },
  { id: "marketing", label: { en: "First Campaign", ar: "Ø£ÙˆÙ„ Ø­Ù…Ù„Ø©" }, description: { en: "Launch a marketing campaign", ar: "Ø£Ø·Ù„Ù‚ Ø­Ù…Ù„Ø© ØªØ³ÙˆÙŠÙ‚ÙŠØ©" }, icon: <Megaphone className="h-4 w-4" />, link: "/marketing" },
  { id: "sgtm", label: { en: "Server Tracking", ar: "Ø§Ù„ØªØªØ¨Ø¹ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠ" }, description: { en: "Set up GTM Server-Side container", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø­Ø§ÙˆÙŠØ© GTM Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠØ©" }, icon: <Rocket className="h-4 w-4" />, link: "/tracking/analytics" },
];

const realEstateItems = [
  { id: "business", label: { en: "Business Information", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù†Ø´Ø§Ø·" }, description: { en: "Agency details and license", ar: "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ÙˆÙƒØ§Ù„Ø© ÙˆØ§Ù„ØªØ±Ø®ÙŠØµ" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Name, subdomain, branding", ar: "Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„Ù†Ø·Ø§Ù‚ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "listing", label: { en: "First Listing", ar: "Ø£ÙˆÙ„ Ø¹Ù‚Ø§Ø±" }, description: { en: "Add your first property listing", ar: "Ø£Ø¶Ù Ø£ÙˆÙ„ Ø¹Ù‚Ø§Ø± Ù„Ù„Ø¨ÙŠØ¹" }, icon: <Building className="h-4 w-4" />, link: "/onboarding" },
  { id: "pages", label: { en: "About & Contact", ar: "Ù…Ù† Ù†Ø­Ù† ÙˆØ§Ù„Ø§ØªØµØ§Ù„" }, description: { en: "Create about and contact pages", ar: "ØµÙØ­Ø§Øª Ù…Ù† Ù†Ø­Ù† ÙˆØ§Ù„Ø§ØªØµØ§Ù„" }, icon: <FileText className="h-4 w-4" />, link: "/pages-blog" },
  { id: "seo", label: { en: "SEO for Listings", ar: "SEO Ù„Ù„Ø¹Ù‚Ø§Ø±Ø§Øª" }, description: { en: "Optimize property pages for search", ar: "ØªØ­Ø³ÙŠÙ† ØµÙØ­Ø§Øª Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª Ù„Ù„Ø¨Ø­Ø«" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
  { id: "crm", label: { en: "Lead Management", ar: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡" }, description: { en: "Track inquiries and follow-ups", ar: "ØªØªØ¨Ø¹ Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª ÙˆØ§Ù„Ù…ØªØ§Ø¨Ø¹Ø§Øª" }, icon: <Users className="h-4 w-4" />, link: "/crm" },
];

const restaurantItems = [
  { id: "business", label: { en: "Business Information", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ø·Ø¹Ù…" }, description: { en: "Restaurant details and license", ar: "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø·Ø¹Ù… ÙˆØ§Ù„ØªØ±Ø®ÙŠØµ" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Name, subdomain, branding", ar: "Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„Ù†Ø·Ø§Ù‚ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "menu", label: { en: "Menu Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©" }, description: { en: "Add menu items and categories", ar: "Ø£Ø¶Ù Ø£ØµÙ†Ø§Ù Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©" }, icon: <UtensilsCrossed className="h-4 w-4" />, link: "/onboarding" },
  { id: "pages", label: { en: "About & Location", ar: "Ù…Ù† Ù†Ø­Ù† ÙˆØ§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Hours, location, and story", ar: "Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„ ÙˆØ§Ù„Ù…ÙˆÙ‚Ø¹" }, icon: <FileText className="h-4 w-4" />, link: "/pages-blog" },
  { id: "seo", label: { en: "SEO & Google", ar: "SEO ÙˆØ¬ÙˆØ¬Ù„" }, description: { en: "Google My Business and local SEO", ar: "Ù†Ø´Ø§Ø·ÙŠ Ø§Ù„ØªØ¬Ø§Ø±ÙŠ Ø¹Ù„Ù‰ Ø¬ÙˆØ¬Ù„" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
  { id: "marketing", label: { en: "Social Media", ar: "ÙˆØ³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„" }, description: { en: "Connect social accounts", ar: "Ø±Ø¨Ø· Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„" }, icon: <Megaphone className="h-4 w-4" />, link: "/marketing" },
];

const lmsItems = [
  { id: "business", label: { en: "Platform Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ù†ØµØ©" }, description: { en: "Organization name and details", ar: "Ø§Ø³Ù… Ø§Ù„Ù…Ù†Ø¸Ù…Ø© ÙˆØ¨ÙŠØ§Ù†Ø§ØªÙ‡Ø§" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Subdomain and branding", ar: "Ø§Ù„Ù†Ø·Ø§Ù‚ Ø§Ù„ÙØ±Ø¹ÙŠ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "course", label: { en: "First Course", ar: "Ø£ÙˆÙ„ Ø¯ÙˆØ±Ø©" }, description: { en: "Create your first course", ar: "Ø£Ù†Ø´Ø¦ Ø£ÙˆÙ„ Ø¯ÙˆØ±Ø©" }, icon: <GraduationCap className="h-4 w-4" />, link: "/lms" },
  { id: "content", label: { en: "Upload Content", ar: "Ø±ÙØ¹ Ø§Ù„Ù…Ø­ØªÙˆÙ‰" }, description: { en: "Add videos and materials", ar: "Ø£Ø¶Ù ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª ÙˆÙ…ÙˆØ§Ø¯" }, icon: <Video className="h-4 w-4" />, link: "/lms?tab=courses" },
  { id: "pricing", label: { en: "Pricing Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„ØªØ³Ø¹ÙŠØ±" }, description: { en: "Set course pricing and bundles", ar: "Ø­Ø¯Ø¯ Ø£Ø³Ø¹Ø§Ø± Ø§Ù„Ø¯ÙˆØ±Ø§Øª" }, icon: <DollarSign className="h-4 w-4" />, link: "/lms?tab=monetization" },
  { id: "seo", label: { en: "SEO & Marketing", ar: "SEO ÙˆØ§Ù„ØªØ³ÙˆÙŠÙ‚" }, description: { en: "Optimize for search engines", ar: "ØªØ­Ø³ÙŠÙ† Ù„Ù…Ø­Ø±ÙƒØ§Øª Ø§Ù„Ø¨Ø­Ø«" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
];

const healthcareItems = [
  { id: "business", label: { en: "Clinic Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø¹ÙŠØ§Ø¯Ø©" }, description: { en: "Clinic name and license details", ar: "Ø§Ø³Ù… Ø§Ù„Ø¹ÙŠØ§Ø¯Ø© ÙˆØ§Ù„ØªØ±Ø®ÙŠØµ" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "doctors", label: { en: "Add Doctors", ar: "Ø¥Ø¶Ø§ÙØ© Ø£Ø·Ø¨Ø§Ø¡" }, description: { en: "Create doctor profiles", ar: "Ø£Ù†Ø´Ø¦ Ù…Ù„ÙØ§Øª Ø§Ù„Ø£Ø·Ø¨Ø§Ø¡" }, icon: <Heart className="h-4 w-4" />, link: "/healthcare" },
  { id: "booking", label: { en: "Appointment Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯" }, description: { en: "Configure booking system", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ù†Ø¸Ø§Ù… Ø§Ù„Ø­Ø¬Ø²" }, icon: <CalendarCheck className="h-4 w-4" />, link: "/appointment-booking" },
  { id: "records", label: { en: "Patient Records", ar: "Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ù…Ø±Ø¶Ù‰" }, description: { en: "Set up patient management", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø±Ø¶Ù‰" }, icon: <FileText className="h-4 w-4" />, link: "/healthcare?tab=patients" },
  { id: "seo", label: { en: "SEO & Listings", ar: "SEO ÙˆØ§Ù„Ù‚ÙˆØ§Ø¦Ù…" }, description: { en: "Google My Business & local SEO", ar: "Ù†Ø´Ø§Ø·ÙŠ Ø¹Ù„Ù‰ Ø¬ÙˆØ¬Ù„" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
];

const fitnessItems = [
  { id: "business", label: { en: "Gym Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØµØ§Ù„Ø©" }, description: { en: "Gym name and details", ar: "Ø§Ø³Ù… Ø§Ù„ØµØ§Ù„Ø© ÙˆØ¨ÙŠØ§Ù†Ø§ØªÙ‡Ø§" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "classes", label: { en: "Class Schedule", ar: "Ø¬Ø¯ÙˆÙ„ Ø§Ù„Ø­ØµØµ" }, description: { en: "Set up classes and schedules", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø­ØµØµ ÙˆØ§Ù„Ø¬Ø¯Ø§ÙˆÙ„" }, icon: <Dumbbell className="h-4 w-4" />, link: "/fitness" },
  { id: "membership", label: { en: "Membership Plans", ar: "Ø®Ø·Ø· Ø§Ù„Ø¹Ø¶ÙˆÙŠØ©" }, description: { en: "Create membership tiers", ar: "Ø£Ù†Ø´Ø¦ Ù…Ø³ØªÙˆÙŠØ§Øª Ø§Ù„Ø¹Ø¶ÙˆÙŠØ©" }, icon: <CreditCard className="h-4 w-4" />, link: "/fitness?tab=members" },
  { id: "trainers", label: { en: "Add Trainers", ar: "Ø¥Ø¶Ø§ÙØ© Ù…Ø¯Ø±Ø¨ÙŠÙ†" }, description: { en: "Create trainer profiles", ar: "Ø£Ù†Ø´Ø¦ Ù…Ù„ÙØ§Øª Ø§Ù„Ù…Ø¯Ø±Ø¨ÙŠÙ†" }, icon: <UserCog className="h-4 w-4" />, link: "/fitness?tab=trainers" },
  { id: "booking", label: { en: "Online Booking", ar: "Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ" }, description: { en: "Enable class bookings", ar: "ØªÙØ¹ÙŠÙ„ Ø­Ø¬Ø² Ø§Ù„Ø­ØµØµ" }, icon: <CalendarCheck className="h-4 w-4" />, link: "/appointment-booking" },
];

const salonItems = [
  { id: "business", label: { en: "Salon Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØµØ§Ù„ÙˆÙ†" }, description: { en: "Salon name and details", ar: "Ø§Ø³Ù… Ø§Ù„ØµØ§Ù„ÙˆÙ† ÙˆØ¨ÙŠØ§Ù†Ø§ØªÙ‡" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "services", label: { en: "Service Menu", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø®Ø¯Ù…Ø§Øª" }, description: { en: "Add services and pricing", ar: "Ø£Ø¶Ù Ø§Ù„Ø®Ø¯Ù…Ø§Øª ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø±" }, icon: <Scissors className="h-4 w-4" />, link: "/salon" },
  { id: "staff", label: { en: "Add Staff", ar: "Ø¥Ø¶Ø§ÙØ© Ù…ÙˆØ¸ÙÙŠÙ†" }, description: { en: "Create stylist profiles", ar: "Ø£Ù†Ø´Ø¦ Ù…Ù„ÙØ§Øª Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†" }, icon: <UserCog className="h-4 w-4" />, link: "/salon?tab=staff" },
  { id: "booking", label: { en: "Online Booking", ar: "Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ" }, description: { en: "Enable appointment booking", ar: "ØªÙØ¹ÙŠÙ„ Ø­Ø¬Ø² Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯" }, icon: <CalendarCheck className="h-4 w-4" />, link: "/appointment-booking" },
  { id: "gallery", label: { en: "Portfolio Gallery", ar: "Ù…Ø¹Ø±Ø¶ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„" }, description: { en: "Showcase your work", ar: "Ø§Ø¹Ø±Ø¶ Ø£Ø¹Ù…Ø§Ù„Ùƒ" }, icon: <Image className="h-4 w-4" />, link: "/portfolio-gallery" },
];

const freelancerItems = [
  { id: "business", label: { en: "Profile Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ù„Ù" }, description: { en: "Your name, skills, and bio", ar: "Ø§Ø³Ù…Ùƒ ÙˆÙ…Ù‡Ø§Ø±Ø§ØªÙƒ" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Portfolio Site", ar: "Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ù…Ø­ÙØ¸Ø©" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "portfolio", label: { en: "Add Projects", ar: "Ø¥Ø¶Ø§ÙØ© Ù…Ø´Ø§Ø±ÙŠØ¹" }, description: { en: "Showcase past work", ar: "Ø§Ø¹Ø±Ø¶ Ø£Ø¹Ù…Ø§Ù„Ùƒ Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©" }, icon: <Briefcase className="h-4 w-4" />, link: "/freelancer" },
  { id: "services", label: { en: "Service Offerings", ar: "Ø¹Ø±ÙˆØ¶ Ø§Ù„Ø®Ø¯Ù…Ø§Øª" }, description: { en: "Define your services & rates", ar: "Ø­Ø¯Ø¯ Ø®Ø¯Ù…Ø§ØªÙƒ ÙˆØ£Ø³Ø¹Ø§Ø±Ùƒ" }, icon: <DollarSign className="h-4 w-4" />, link: "/freelancer?tab=services" },
  { id: "contact", label: { en: "Contact Form", ar: "Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ø§ØªØµØ§Ù„" }, description: { en: "Let clients reach you", ar: "Ø§Ø³Ù…Ø­ Ù„Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø¨Ø§Ù„ØªÙˆØ§ØµÙ„" }, icon: <FileText className="h-4 w-4" />, link: "/contact-forms" },
  { id: "seo", label: { en: "SEO Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ SEO" }, description: { en: "Get found on search engines", ar: "Ø¸Ù‡Ø± ÙÙŠ Ù…Ø­Ø±ÙƒØ§Øª Ø§Ù„Ø¨Ø­Ø«" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
];

const travelItems = [
  { id: "business", label: { en: "Agency Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ÙˆÙƒØ§Ù„Ø©" }, description: { en: "Agency name and license", ar: "Ø§Ø³Ù… Ø§Ù„ÙˆÙƒØ§Ù„Ø© ÙˆØ§Ù„ØªØ±Ø®ÙŠØµ" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "tours", label: { en: "First Tour Package", ar: "Ø£ÙˆÙ„ Ø¨Ø§Ù‚Ø© Ø³ÙŠØ§Ø­ÙŠØ©" }, description: { en: "Create your first tour", ar: "Ø£Ù†Ø´Ø¦ Ø£ÙˆÙ„ Ø¨Ø§Ù‚Ø© Ø³ÙŠØ§Ø­ÙŠØ©" }, icon: <Plane className="h-4 w-4" />, link: "/travel" },
  { id: "booking", label: { en: "Booking System", ar: "Ù†Ø¸Ø§Ù… Ø§Ù„Ø­Ø¬Ø²" }, description: { en: "Configure booking flow", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ù†Ø¸Ø§Ù… Ø§Ù„Ø­Ø¬Ø²" }, icon: <CalendarCheck className="h-4 w-4" />, link: "/travel?tab=bookings" },
  { id: "guides", label: { en: "Add Guides", ar: "Ø¥Ø¶Ø§ÙØ© Ù…Ø±Ø´Ø¯ÙŠÙ†" }, description: { en: "Create tour guide profiles", ar: "Ø£Ù†Ø´Ø¦ Ù…Ù„ÙØ§Øª Ø§Ù„Ù…Ø±Ø´Ø¯ÙŠÙ†" }, icon: <UserCog className="h-4 w-4" />, link: "/travel?tab=guides" },
  { id: "seo", label: { en: "SEO & Marketing", ar: "SEO ÙˆØ§Ù„ØªØ³ÙˆÙŠÙ‚" }, description: { en: "Optimize for travel searches", ar: "ØªØ­Ø³ÙŠÙ† Ù„Ù…Ø­Ø±ÙƒØ§Øª Ø§Ù„Ø¨Ø­Ø«" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
];

const automotiveItems = [
  { id: "business", label: { en: "Dealership Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ø¹Ø±Ø¶" }, description: { en: "Dealer name and registration", ar: "Ø§Ø³Ù… Ø§Ù„Ù…Ø¹Ø±Ø¶ ÙˆØ§Ù„ØªØ³Ø¬ÙŠÙ„" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "vehicles", label: { en: "Add Vehicles", ar: "Ø¥Ø¶Ø§ÙØ© Ù…Ø±ÙƒØ¨Ø§Øª" }, description: { en: "List your first vehicles", ar: "Ø£Ø¶Ù Ø£ÙˆÙ„ Ù…Ø±ÙƒØ¨Ø§ØªÙƒ" }, icon: <Car className="h-4 w-4" />, link: "/automotive" },
  { id: "service", label: { en: "Service Booking", ar: "Ø­Ø¬Ø² Ø§Ù„Ø®Ø¯Ù…Ø©" }, description: { en: "Set up service appointments", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„ØµÙŠØ§Ù†Ø©" }, icon: <Wrench className="h-4 w-4" />, link: "/automotive?tab=service" },
  { id: "finance", label: { en: "Finance Calculator", ar: "Ø­Ø§Ø³Ø¨Ø© Ø§Ù„ØªÙ…ÙˆÙŠÙ„" }, description: { en: "Enable financing options", ar: "ØªÙØ¹ÙŠÙ„ Ø®ÙŠØ§Ø±Ø§Øª Ø§Ù„ØªÙ…ÙˆÙŠÙ„" }, icon: <DollarSign className="h-4 w-4" />, link: "/automotive?tab=finance" },
  { id: "seo", label: { en: "SEO & Listings", ar: "SEO ÙˆØ§Ù„Ù‚ÙˆØ§Ø¦Ù…" }, description: { en: "Optimize vehicle pages", ar: "ØªØ­Ø³ÙŠÙ† ØµÙØ­Ø§Øª Ø§Ù„Ù…Ø±ÙƒØ¨Ø§Øª" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
];

const eventItems = [
  { id: "business", label: { en: "Organizer Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ù†Ø¸Ù…" }, description: { en: "Company name and details", ar: "Ø§Ø³Ù… Ø§Ù„Ø´Ø±ÙƒØ© ÙˆØ¨ÙŠØ§Ù†Ø§ØªÙ‡Ø§" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "event", label: { en: "First Event", ar: "Ø£ÙˆÙ„ ÙØ¹Ø§Ù„ÙŠØ©" }, description: { en: "Create your first event", ar: "Ø£Ù†Ø´Ø¦ Ø£ÙˆÙ„ ÙØ¹Ø§Ù„ÙŠØ©" }, icon: <PartyPopper className="h-4 w-4" />, link: "/events" },
  { id: "tickets", label: { en: "Ticketing Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„ØªØ°Ø§ÙƒØ±" }, description: { en: "Configure tickets & RSVP", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„ØªØ°Ø§ÙƒØ± ÙˆØ§Ù„Ø­Ø¶ÙˆØ±" }, icon: <Ticket className="h-4 w-4" />, link: "/events?tab=tickets" },
  { id: "venue", label: { en: "Venue Showcase", ar: "Ø¹Ø±Ø¶ Ø§Ù„Ù…ÙƒØ§Ù†" }, description: { en: "Add venue photos and info", ar: "Ø£Ø¶Ù ØµÙˆØ± ÙˆÙ…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…ÙƒØ§Ù†" }, icon: <Building className="h-4 w-4" />, link: "/events?tab=venues" },
  { id: "marketing", label: { en: "Promote Event", ar: "Ø§Ù„ØªØ±ÙˆÙŠØ¬ Ù„Ù„ÙØ¹Ø§Ù„ÙŠØ©" }, description: { en: "Launch marketing campaign", ar: "Ø£Ø·Ù„Ù‚ Ø­Ù…Ù„Ø© ØªØ³ÙˆÙŠÙ‚ÙŠØ©" }, icon: <Megaphone className="h-4 w-4" />, link: "/marketing" },
];

const saasItems = [
  { id: "business", label: { en: "Company Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ©" }, description: { en: "Company name and details", ar: "Ø§Ø³Ù… Ø§Ù„Ø´Ø±ÙƒØ© ÙˆØ¨ÙŠØ§Ù†Ø§ØªÙ‡Ø§" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Landing Page", ar: "ØµÙØ­Ø© Ø§Ù„Ù‡Ø¨ÙˆØ·" }, description: { en: "Build your landing page", ar: "Ø£Ù†Ø´Ø¦ ØµÙØ­Ø© Ø§Ù„Ù‡Ø¨ÙˆØ·" }, icon: <Globe className="h-4 w-4" />, link: "/page-builder" },
  { id: "pricing", label: { en: "Pricing Plans", ar: "Ø®Ø·Ø· Ø§Ù„ØªØ³Ø¹ÙŠØ±" }, description: { en: "Set up subscription tiers", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ù…Ø³ØªÙˆÙŠØ§Øª Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ" }, icon: <DollarSign className="h-4 w-4" />, link: "/ecommerce/subscription-plans" },
  { id: "docs", label: { en: "Documentation", ar: "Ø§Ù„ØªÙˆØ«ÙŠÙ‚" }, description: { en: "Create product docs", ar: "Ø£Ù†Ø´Ø¦ ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ù…Ù†ØªØ¬" }, icon: <BookOpen className="h-4 w-4" />, link: "/pages-blog" },
  { id: "api", label: { en: "Developer Portal", ar: "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…Ø·ÙˆØ±ÙŠÙ†" }, description: { en: "Set up API docs & keys", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ ÙˆØ«Ø§Ø¦Ù‚ API" }, icon: <Code className="h-4 w-4" />, link: "/developer" },
  { id: "analytics", label: { en: "Product Analytics", ar: "ØªØ­Ù„ÙŠÙ„Ø§Øª Ø§Ù„Ù…Ù†ØªØ¬" }, description: { en: "Track usage & metrics", ar: "ØªØªØ¨Ø¹ Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… ÙˆØ§Ù„Ù…Ù‚Ø§ÙŠÙŠØ³" }, icon: <Rocket className="h-4 w-4" />, link: "/saas-product" },
  { id: "sgtm", label: { en: "Server-Side Tracking", ar: "Ø§Ù„ØªØªØ¨Ø¹ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠ" }, description: { en: "Implement first-party tracking", ar: "ØªÙ†Ù ÙŠØ° Ø§Ù„ØªØªØ¨Ø¹ Ø§Ù„Ø·Ø±Ù  Ø§Ù„Ø£ÙˆÙ„" }, icon: <Code className="h-4 w-4" />, link: "/tracking/analytics" },
];

const landlordItems = [
  { id: "business", label: { en: "Landlord Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ø§Ù„Ùƒ" }, description: { en: "Owner details and registration", ar: "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø§Ù„Ùƒ ÙˆØ§Ù„ØªØ³Ø¬ÙŠÙ„" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "properties", label: { en: "Add Properties", ar: "Ø¥Ø¶Ø§ÙØ© Ø¹Ù‚Ø§Ø±Ø§Øª" }, description: { en: "List your rental properties", ar: "Ø£Ø¶Ù Ø¹Ù‚Ø§Ø±Ø§ØªÙƒ Ù„Ù„Ø¥ÙŠØ¬Ø§Ø±" }, icon: <Home className="h-4 w-4" />, link: "/property-listings" },
  { id: "tenants", label: { en: "Add Tenants", ar: "Ø¥Ø¶Ø§ÙØ© Ù…Ø³ØªØ£Ø¬Ø±ÙŠÙ†" }, description: { en: "Register your current tenants", ar: "Ø³Ø¬Ù„ Ø§Ù„Ù…Ø³ØªØ£Ø¬Ø±ÙŠÙ† Ø§Ù„Ø­Ø§Ù„ÙŠÙŠÙ†" }, icon: <Users className="h-4 w-4" />, link: "/lead-management" },
  { id: "leases", label: { en: "Lease Agreements", ar: "Ø¹Ù‚ÙˆØ¯ Ø§Ù„Ø¥ÙŠØ¬Ø§Ø±" }, description: { en: "Create lease contracts", ar: "Ø£Ù†Ø´Ø¦ Ø¹Ù‚ÙˆØ¯ Ø§Ù„Ø¥ÙŠØ¬Ø§Ø±" }, icon: <FileSignature className="h-4 w-4" />, link: "/contracts" },
  { id: "rent", label: { en: "Rent Collection", ar: "ØªØ­ØµÙŠÙ„ Ø§Ù„Ø¥ÙŠØ¬Ø§Ø±" }, description: { en: "Set up rent payment tracking", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ ØªØªØ¨Ø¹ Ø¯ÙØ¹Ø§Øª Ø§Ù„Ø¥ÙŠØ¬Ø§Ø±" }, icon: <DollarSign className="h-4 w-4" />, link: "/finance" },
];

const educationItems = [
  { id: "business", label: { en: "Center Info", ar: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ø±ÙƒØ²" }, description: { en: "Center name and registration", ar: "Ø§Ø³Ù… Ø§Ù„Ù…Ø±ÙƒØ² ÙˆØ§Ù„ØªØ³Ø¬ÙŠÙ„" }, icon: <Store className="h-4 w-4" />, link: "/onboarding" },
  { id: "site", label: { en: "Site Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" }, description: { en: "Website and branding", ar: "Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" }, icon: <Globe className="h-4 w-4" />, link: "/storefront" },
  { id: "classes", label: { en: "Create Classes", ar: "Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø­ØµØµ" }, description: { en: "Set up class schedule and batches", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø¬Ø¯ÙˆÙ„ Ø§Ù„Ø­ØµØµ ÙˆØ§Ù„Ø¯ÙØ¹Ø§Øª" }, icon: <School className="h-4 w-4" />, link: "/education" },
  { id: "students", label: { en: "Add Students", ar: "Ø¥Ø¶Ø§ÙØ© Ø·Ù„Ø§Ø¨" }, description: { en: "Enroll your first students", ar: "Ø³Ø¬Ù„ Ø£ÙˆÙ„ Ø·Ù„Ø§Ø¨Ùƒ" }, icon: <GraduationCap className="h-4 w-4" />, link: "/education?tab=students" },
  { id: "fees", label: { en: "Fee Structure", ar: "Ù‡ÙŠÙƒÙ„ Ø§Ù„Ø±Ø³ÙˆÙ…" }, description: { en: "Set up fee plans and payment tracking", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø®Ø·Ø· Ø§Ù„Ø±Ø³ÙˆÙ… ÙˆØªØªØ¨Ø¹ Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª" }, icon: <DollarSign className="h-4 w-4" />, link: "/education?tab=fees" },
  { id: "seo", label: { en: "SEO & Marketing", ar: "SEO ÙˆØ§Ù„ØªØ³ÙˆÙŠÙ‚" }, description: { en: "Get found by students online", ar: "Ø¸Ù‡Ø± Ù„Ù„Ø·Ù„Ø§Ø¨ Ø¹Ù„Ù‰ Ø§Ù„Ø¥Ù†ØªØ±Ù†Øª" }, icon: <Search className="h-4 w-4" />, link: "/seo-manager" },
];

const iorItems = [
  { id: "business", label: { en: "Business Verification", ar: "ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ù†Ø´Ø§Ø·" }, description: { en: "Upload trade license and IOR docs", ar: "Ø±Ù Ø¹ Ø§Ù„Ø³Ø¬Ù„ ÙˆØ£ÙˆØ±Ø§Ù‚ Ø§Ù„Ø§Ø³ØªÙŠØ±Ø§Ø¯" }, icon: <ShieldCheck className="h-4 w-4" />, link: "/onboarding" },
  { id: "warehouse", label: { en: "Warehouse Setup", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø³ØªÙˆØ¯Ø¹" }, description: { en: "Register your first fulfillment center", ar: "ØªØ³Ø¬ÙŠÙ„ Ø£ÙˆÙ„ Ù…Ø³ØªÙˆØ¯Ø¹" }, icon: <Building className="h-4 w-4" />, link: "/ior/warehouse" },
  { id: "sourcing", label: { en: "Product Sourcing", ar: "ØªÙˆØ±ÙŠØ¯ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª" }, description: { en: "Connect with global suppliers", ar: "Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø§Ù„Ù…ÙˆØ±Ø¯ÙŠÙ†" }, icon: <Search className="h-4 w-4" />, link: "/ior/shipments" },
  { id: "logistics", label: { en: "Shipping Lines", ar: "Ø®Ø·ÙˆØ· Ø§Ù„Ø´Ø­Ù†" }, description: { en: "Set up courier and freight routes", ar: "Ø¥Ø¹Ø¯Ø§Ø¯ Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø´Ø­Ù†" }, icon: <Truck className="h-4 w-4" />, link: "/ior/tracking" },
  { id: "payment", label: { en: "Wallet & Payments", ar: "Ø§Ù„Ù…Ø­Ù Ø¸Ø© ÙˆØ§Ù„Ø¯Ù Ø¹" }, description: { en: "Fund your wallet for duty payments", ar: "Ø´Ø­Ù† Ø§Ù„Ù…Ø­Ù Ø¸Ø© Ù„Ù„Ø±Ø³ÙˆÙ…" }, icon: <CreditCard className="h-4 w-4" />, link: "/finance" },
  { id: "compliance", label: { en: "Compliance Check", ar: "Ù Ø­Øµ Ø§Ù„Ø§Ù…ØªØ«Ø§Ù„" }, description: { en: "Verify HS codes and restricted items", ar: "Ù Ø­Øµ Ø§Ù„ÙƒÙˆØ¯ Ø§Ù„Ø¬Ù…Ø±ÙƒÙŠ" }, icon: <CheckCircle2 className="h-4 w-4" />, link: "/ior/compliance" },
];

const getItemsByPurpose = (purpose: string | null) => {
  switch (purpose) {
    case "business-website": return websiteItems;
    case "real-estate": return realEstateItems;
    case "restaurant": return restaurantItems;
    case "lms": return lmsItems;
    case "healthcare": return healthcareItems;
    case "fitness": return fitnessItems;
    case "salon": return salonItems;
    case "freelancer": return freelancerItems;
    case "travel": return travelItems;
    case "automotive": return automotiveItems;
    case "event": return eventItems;
    case "saas": return saasItems;
    case "landlord": return landlordItems;
    case "education": return educationItems;
    case "cross-border-ior": return iorItems;
    default: return ecommerceItems;
  }
};

const getChecklistTitle = (purpose: string | null) => {
  const titles: Record<string, { en: string; ar: string }> = {
    "business-website": { en: "Website Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹" },
    "real-estate": { en: "Property Site Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª" },
    restaurant: { en: "Restaurant Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø·Ø¹Ù…" },
    lms: { en: "Learning Platform Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ù…Ù†ØµØ© Ø§Ù„ØªØ¹Ù„Ù…" },
    healthcare: { en: "Healthcare Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¹ÙŠØ§Ø¯Ø©" },
    fitness: { en: "Fitness Center Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ù…Ø±ÙƒØ² Ø§Ù„Ù„ÙŠØ§Ù‚Ø©" },
    salon: { en: "Salon Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„ØµØ§Ù„ÙˆÙ†" },
    freelancer: { en: "Portfolio Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø­ÙØ¸Ø©" },
    travel: { en: "Travel Agency Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ ÙˆÙƒØ§Ù„Ø© Ø§Ù„Ø³ÙØ±" },
    automotive: { en: "Dealership Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø¹Ø±Ø¶" },
    event: { en: "Event Organizer Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª" },
    saas: { en: "SaaS Product Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ù†ØªØ¬" },
    landlord: { en: "Landlord Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø§Ù„Ùƒ" },
    education: { en: "Education Center Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø±ÙƒØ² Ø§Ù„ØªØ¹Ù„ÙŠÙ…ÙŠ" },
    "cross-border-ior": { en: "IOR Platform Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ù…Ù†ØµØ© Ø§Ù„Ø§Ø³ØªÙŠØ±Ø§Ø¯" },
  };
  return titles[purpose || ""] || { en: "Store Setup Checklist", ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ØªØ¬Ø±" };
};

const MerchantChecklist = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { toast } = useToast();
  const { businessPurpose } = useMerchantRegion();

  const items = useMemo(() => getItemsByPurpose(businessPurpose), [businessPurpose]);
  const title = getChecklistTitle(businessPurpose);

  const defaultDone = useMemo(() => {
    const d: Record<string, boolean> = {};
    items.forEach((item, i) => { d[item.id] = i < 2; }); // first 2 done by default
    return d;
  }, [items]);

  const [doneState, setDoneState] = useState<Record<string, boolean>>(() => getStoredState(defaultDone));

  const toggleItem = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDoneState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      const newVal = next[id];
      toast({
        title: newVal ? (isAr ? "âœ… Ù…ÙƒØªÙ…Ù„!" : "âœ… Done!") : (isAr ? "â†©ï¸ ØªÙ… Ø§Ù„Ø¥Ù„ØºØ§Ø¡" : "â†©ï¸ Undone"),
        duration: 1500,
      });
      return next;
    });
  }, [isAr, toast]);

  const doneCount = items.filter((i) => doneState[i.id]).length;
  const progress = Math.round((doneCount / items.length) * 100);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">
              {isAr ? title.ar : title.en}
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {doneCount}/{items.length} {isAr ? "Ù…ÙƒØªÙ…Ù„" : "complete"}
          </Badge>
        </div>
        <div className="mt-2 space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress}% {isAr ? "Ù…ÙƒØªÙ…Ù„" : "complete"}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {items.map((item) => {
            const isDone = doneState[item.id];
            return (
              <div
                key={item.id}
                className={`group flex items-center gap-3 rounded-lg p-2.5 transition-colors cursor-pointer ${isDone ? "opacity-60 hover:opacity-80" : "hover:bg-muted/50"
                  }`}
              >
                <button
                  onClick={(e) => toggleItem(item.id, e)}
                  className="shrink-0 transition-transform hover:scale-110 active:scale-95"
                  aria-label={isDone ? "Mark as undone" : "Mark as done"}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <Link href={item.link} className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.label[lang]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.description[lang]}</p>
                </Link>
                {!isDone && (
                  <Link href={item.link}>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantChecklist;
