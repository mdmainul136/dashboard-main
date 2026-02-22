"use client";

import React, { useState, useEffect } from "react";
import {
  Type,
  Image as ImageIcon,
  Palette,
  Layers,
  ChevronDown,
  Monitor,
  Smartphone,
  Info,
  BrainCircuit,
  Save,
  Rocket,
  History,
  Eye,
  EyeOff,
  Clock
} from "lucide-react";
import ThemeRenderer from "./ThemeRenderer";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { purposeStorefrontConfig } from "@/data/purposeThemes";

export interface StoreCustomizerProps {
  device: "desktop" | "mobile";
  sandboxConfig?: any;
}

const StoreCustomizer = ({ device, sandboxConfig }: StoreCustomizerProps) => {
  const { businessPurpose } = useMerchantRegion();
  const defaultConfig = businessPurpose ? purposeStorefrontConfig[businessPurpose].customizerDefaults : null;

  // --- State Management ---
  const [blueprint, setBlueprint] = useState<any>(null);
  const [liveBlueprint, setLiveBlueprint] = useState<any>(null);
  const [showComparedToLive, setShowComparedToLive] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [isPublishing, setIsPublishing] = useState(false);
  const [trainingNotes, setTrainingNotes] = useState("");
  const [isSavingBrain, setIsSavingBrain] = useState(false);

  // --- Initial Load & Sandbox Sync ---
  useEffect(() => {
    const initialBlueprint = {
      globalSettings: {
        primaryColor: defaultConfig?.primaryColor || "#3b82f6",
        accentColor: defaultConfig?.accentColor || "#1e293b",
        headingFont: defaultConfig?.headingFont || "Inter",
        bodyFont: "Roboto",
        brandName: defaultConfig?.brandName || "My Store"
      },
      layouts: {
        home: {
          sections: [
            { type: "hero", settings: { title: "New Collection", subtitle: "Shop the latest trends" } },
            { type: "featured-products", settings: { count: 3 } },
            { type: "newsletter", settings: { title: "Stay in touch" } }
          ]
        }
      }
    };
    setBlueprint(initialBlueprint);
    setLiveBlueprint(initialBlueprint);
  }, [businessPurpose, defaultConfig]);

  useEffect(() => {
    if (sandboxConfig && blueprint) {
      setBlueprint((prev: any) => ({
        ...prev,
        globalSettings: { ...prev.globalSettings, ...sandboxConfig }
      }));
      toast.info("Sandbox Active: Theme blueprint updated.");
    }
  }, [sandboxConfig]);

  if (!blueprint) return null;

  // --- Handlers ---
  const updateGlobalSetting = (key: string, value: any) => {
    setBlueprint((prev: any) => ({
      ...prev,
      globalSettings: { ...prev.globalSettings, [key]: value }
    }));
  };

  const handleSaveDraft = async () => {
    toast.promise(
      fetch('/api/themes/config/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: blueprint })
      }),
      {
        loading: 'Saving to Soho Cloud...',
        success: 'Draft saved successfully.',
        error: 'Failed to save draft.'
      }
    );
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const response = await fetch('/api/themes/config/publish', { method: 'POST' });
      if (response.ok) toast.success("Storefront is now live!");
    } catch (e) {
      toast.error("Publishing failed.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveBrain = async () => {
    setIsSavingBrain(true);
    try {
      const response = await fetch('/api/ai/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ training_notes: trainingNotes })
      });
      if (response.ok) toast.success("AI Brain trained!");
    } catch (error) {
      toast.error("Brain training failed.");
    } finally {
      setIsSavingBrain(false);
    }
  };

  return (
    <div className="flex h-full gap-6 p-4">
      {/* Controls Panel */}
      <div className="w-80 flex-shrink-0 overflow-y-auto pr-2 custom-scrollbar space-y-4">

        {/* Actions Bar */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gap-2" onClick={handleSaveDraft}>
            <Save className="h-3.5 w-3.5" /> Draft
          </Button>
          <Button size="sm" variant="outline" className="flex-1 gap-2 border-primary/30 text-primary" onClick={handlePublish} disabled={isPublishing}>
            <Rocket className="h-3.5 w-3.5" /> {isPublishing ? "Wait..." : "Publish"}
          </Button>
        </div>

        {/* Tools Toolbar */}
        <div className="flex items-center justify-between p-2 border rounded-lg bg-slate-50">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setHistoryOpen(!historyOpen)} title="Version History">
            <History className={`h-4 w-4 ${historyOpen ? 'text-primary' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setShowComparedToLive(!showComparedToLive)}
            title={showComparedToLive ? "Show Draft" : "Compare to Live"}
          >
            {showComparedToLive ? <EyeOff className="h-4 w-4 text-emerald-600" /> : <Eye className="h-4 w-4" />}
          </Button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex gap-1 bg-white border rounded p-0.5">
            {["en", "ar"].map((l) => (
              <Button
                key={l}
                size="sm"
                variant={language === l ? "secondary" : "ghost"}
                className="h-6 px-2 text-[9px] uppercase"
                onClick={() => setLanguage(l as any)}
              >
                {l}
              </Button>
            ))}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["brand", "fonts"]} className="space-y-4">
          <AccordionItem value="brand" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline font-semibold">Style & Brand</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Primary Theme Color</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-10 h-8 p-0 border-none cursor-pointer" value={blueprint.globalSettings.primaryColor} onChange={(e) => updateGlobalSetting("primaryColor", e.target.value)} />
                  <Input className="h-8 text-xs font-mono" value={blueprint.globalSettings.primaryColor} onChange={(e) => updateGlobalSetting("primaryColor", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Accent Color</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-10 h-8 p-0 border-none cursor-pointer" value={blueprint.globalSettings.accentColor} onChange={(e) => updateGlobalSetting("accentColor", e.target.value)} />
                  <Input className="h-8 text-xs font-mono" value={blueprint.globalSettings.accentColor} onChange={(e) => updateGlobalSetting("accentColor", e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fonts" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline font-semibold">Typography</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Heading Font</Label>
                <Select value={blueprint.globalSettings.headingFont} onValueChange={(v) => updateGlobalSetting("headingFont", v)}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter (Classic)</SelectItem>
                    <SelectItem value="Outfit">Outfit (Modern)</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Playfair Display">Playfair (Luxury)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brain" className="border-2 border-primary/20 rounded-lg px-4 bg-primary/5">
            <AccordionTrigger className="hover:no-underline font-semibold text-primary">Train AI Brain</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <Label className="text-[10px] uppercase text-slate-500 font-bold">Persistent Style Guide</Label>
              <textarea
                className="w-full text-xs border rounded p-2 h-20 bg-background outline-none focus:ring-1 focus:ring-primary"
                value={trainingNotes}
                onChange={(e) => setTrainingNotes(e.target.value)}
                placeholder="Talk to the AI engine..."
              />
              <Button size="sm" className="w-full h-8 gap-2" onClick={handleSaveBrain} disabled={isSavingBrain}>
                <BrainCircuit className="h-3 w-3" /> {isSavingBrain ? "Learning..." : "Save Learning"}
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-muted/20 border-2 rounded-2xl relative overflow-hidden flex flex-col p-4 group">
        {!showComparedToLive ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ThemeRenderer blueprint={blueprint} device={device} />
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-2 gap-4 h-full">
            <div className="flex flex-col">
              <Badge variant="outline" className="mb-2 bg-emerald-50 text-emerald-700 border-emerald-200 self-start">LIVE VERSION</Badge>
              <div className="flex-1 overflow-y-auto border border-dashed rounded-xl scale-[0.95] origin-top bg-white">
                <ThemeRenderer blueprint={liveBlueprint} device={device} />
              </div>
            </div>
            <div className="flex flex-col">
              <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20 self-start">DRAFT VERSION</Badge>
              <div className="flex-1 overflow-y-auto border border-dashed rounded-xl scale-[0.95] origin-top bg-white shadow-xl">
                <ThemeRenderer blueprint={blueprint} device={device} />
              </div>
            </div>
          </div>
        )}

        {historyOpen && (
          <div className="absolute inset-4 top-20 bg-white/95 backdrop-blur z-50 rounded-xl border p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-bold flex items-center gap-2"><Clock className="h-4 w-4" /> Version History</h3>
              <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(false)}>Close</Button>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {[
                { date: 'Today, 2:45 PM', version: 'V1.0.4', type: 'Draft', active: true },
                { date: 'Yesterday, 6:00 PM', version: 'V1.0.3', type: 'Published', active: false },
                { date: 'Feb 20, 10:15 AM', version: 'V1.0.2', type: 'Archive', active: false },
              ].map((v, i) => (
                <div key={i} className={`flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-all cursor-pointer group ${v.active ? 'border-primary bg-primary/5' : ''}`}>
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      {v.version}
                      {v.active && <Badge className="h-4 text-[8px] bg-primary">CURRENT</Badge>}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{v.date} ({v.type})</p>
                  </div>
                  {!v.active && <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-7 text-[10px]">Restore</Button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCustomizer;
