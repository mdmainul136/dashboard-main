"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { Download, Smartphone, Wifi, WifiOff, Monitor, CheckCircle2, Zap, Shield } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const onlineHandler = () => setIsOnline(true);
    const offlineHandler = () => setIsOnline(false);
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const features = [
    { icon: <Zap className="h-5 w-5" />, title: { en: "Lightning Fast", ar: "Ø³Ø±Ø¹Ø© ÙØ§Ø¦Ù‚Ø©" }, desc: { en: "Instant loading with offline caching", ar: "ØªØ­Ù…ÙŠÙ„ ÙÙˆØ±ÙŠ Ù…Ø¹ Ø§Ù„ØªØ®Ø²ÙŠÙ† Ø§Ù„Ù…Ø¤Ù‚Øª" } },
    { icon: <WifiOff className="h-5 w-5" />, title: { en: "Works Offline", ar: "ÙŠØ¹Ù…Ù„ Ø¨Ø¯ÙˆÙ† Ø¥Ù†ØªØ±Ù†Øª" }, desc: { en: "Access your dashboard anytime", ar: "Ø§Ù„ÙˆØµÙˆÙ„ Ù„Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… ÙÙŠ Ø£ÙŠ ÙˆÙ‚Øª" } },
    { icon: <Smartphone className="h-5 w-5" />, title: { en: "Native Experience", ar: "ØªØ¬Ø±Ø¨Ø© Ø£ØµÙ„ÙŠØ©" }, desc: { en: "Feels like a real app on your phone", ar: "ÙŠØ¨Ø¯Ùˆ ÙƒØªØ·Ø¨ÙŠÙ‚ Ø­Ù‚ÙŠÙ‚ÙŠ Ø¹Ù„Ù‰ Ù‡Ø§ØªÙÙƒ" } },
    { icon: <Shield className="h-5 w-5" />, title: { en: "Secure & Updated", ar: "Ø¢Ù…Ù† ÙˆÙ…Ø­Ø¯Ø«" }, desc: { en: "Always the latest version automatically", ar: "Ø¯Ø§Ø¦Ù…Ø§Ù‹ Ø£Ø­Ø¯Ø« Ø¥ØµØ¯Ø§Ø± ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹" } },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <Download className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isAr ? "ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ·Ø¨ÙŠÙ‚" : "Install App"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isAr
              ? "Ø«Ø¨Ù‘Øª TailAdmin Ø¹Ù„Ù‰ Ø¬Ù‡Ø§Ø²Ùƒ Ù„Ù„ÙˆØµÙˆÙ„ Ø§Ù„Ø³Ø±ÙŠØ¹ ÙˆØ§Ù„Ø¹Ù…Ù„ Ø¨Ø¯ÙˆÙ† Ø¥Ù†ØªØ±Ù†Øª"
              : "Install TailAdmin on your device for quick access and offline support"}
          </p>
        </div>

        {/* Status */}
        <div className="flex justify-center gap-3">
          <Badge variant="outline" className={`gap-1.5 ${isOnline ? "border-green-500 text-green-600" : "border-red-500 text-red-600"}`}>
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? (isAr ? "Ù…ØªØµÙ„" : "Online") : (isAr ? "ØºÙŠØ± Ù…ØªØµÙ„" : "Offline")}
          </Badge>
          <Badge variant="outline" className={`gap-1.5 ${isInstalled ? "border-green-500 text-green-600" : "border-muted-foreground text-muted-foreground"}`}>
            <Monitor className="h-3 w-3" />
            {isInstalled ? (isAr ? "Ù…Ø«Ø¨Ù‘Øª" : "Installed") : (isAr ? "ØºÙŠØ± Ù…Ø«Ø¨Ù‘Øª" : "Not Installed")}
          </Badge>
        </div>

        {/* Install Button */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            {isInstalled ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-lg font-semibold text-foreground">
                  {isAr ? "Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ù…Ø«Ø¨Ù‘Øª Ø¨Ø§Ù„ÙØ¹Ù„! âœ…" : "App is already installed! âœ…"}
                </p>
              </div>
            ) : deferredPrompt ? (
              <Button size="lg" onClick={handleInstall} className="gap-2 px-8 text-lg">
                <Download className="h-5 w-5" />
                {isAr ? "ØªØ«Ø¨ÙŠØª Ø§Ù„Ø¢Ù†" : "Install Now"}
              </Button>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  {isAr
                    ? "Ù„ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ØŒ Ø§ÙØªØ­ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…ØªØµÙØ­ ÙˆØ§Ø®ØªØ± 'Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø´Ø§Ø´Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©'"
                    : "To install, open your browser menu and select 'Add to Home Screen'"}
                </p>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <p>ðŸ“± <strong>iPhone:</strong> {isAr ? "Ù…Ø´Ø§Ø±ÙƒØ© â† Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø´Ø§Ø´Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" : "Share â†’ Add to Home Screen"}</p>
                  <p>ðŸ¤– <strong>Android:</strong> {isAr ? "Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© â† ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ·Ø¨ÙŠÙ‚" : "Menu â†’ Install App"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-3 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{f.title[lang]}</p>
                  <p className="text-sm text-muted-foreground">{f.desc[lang]}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstallPage;

