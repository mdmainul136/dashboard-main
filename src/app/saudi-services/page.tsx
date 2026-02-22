"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { ShieldCheck, Banknote, MapPin } from "lucide-react";
import MaroofIntegration from "@/components/saudi/MaroofIntegration";
import SadadPayment from "@/components/saudi/SadadPayment";
import NationalAddress from "@/components/saudi/NationalAddress";

const SaudiServicesPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isAr ? "Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©" : "Saudi Services"}
          </h1>
          <p className="text-muted-foreground">
            {isAr
              ? "Ù…Ø¹Ø±ÙˆÙØŒ Ø³Ø¯Ø§Ø¯ØŒ ÙˆØ§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙˆØ·Ù†ÙŠ â€” Ø®Ø¯Ù…Ø§Øª Ù…ØªÙˆØ§ÙÙ‚Ø© Ù…Ø¹ Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©"
              : "Maroof, Sadad & National Address â€” Saudi-compliant integrations"}
          </p>
        </div>

        <Tabs defaultValue="maroof" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="maroof" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              {isAr ? "Ù…Ø¹Ø±ÙˆÙ" : "Maroof"}
            </TabsTrigger>
            <TabsTrigger value="sadad" className="gap-2">
              <Banknote className="h-4 w-4" />
              {isAr ? "Ø³Ø¯Ø§Ø¯" : "Sadad"}
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-2">
              <MapPin className="h-4 w-4" />
              {isAr ? "Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙˆØ·Ù†ÙŠ" : "National Address"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="maroof"><MaroofIntegration /></TabsContent>
          <TabsContent value="sadad"><SadadPayment /></TabsContent>
          <TabsContent value="address"><NationalAddress /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SaudiServicesPage;

