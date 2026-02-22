"use client";

import React, { useState } from "react";
import {
  Globe,
  ShieldCheck,
  ArrowRight,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const DomainManager = () => {
  const [subdomain, setSubdomain] = useState("my-cool-store");
  const [customDomain, setCustomDomain] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleLinkDomain = () => {
    if (!customDomain) return;
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      toast.success("Custom domain linked successfully! Propagating DNS...");
    }, 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">

      {/* Primary Subdomain */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold">Free Subdomain</h3>
          <p className="text-sm text-muted-foreground">Your store is always reachable via our secure cloud infrastructure.</p>
        </div>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary hover:bg-primary">Primary</Badge>
                <div className="font-mono text-sm flex items-center gap-1">
                  {subdomain}.zosair.com
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Connected & Secure</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => copyToClipboard(`${subdomain}.zosair.com`)}>
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <ExternalLink className="h-3.5 w-3.5" /> Visit
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Custom Domain */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Custom Domain</h3>
            <p className="text-sm text-muted-foreground">Professionalize your brand with your own .com or .sa domain.</p>
          </div>
          <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3 w-3" /> SSL Included</Badge>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="yoursite.com"
              className="pl-10"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </div>
          <Button onClick={handleLinkDomain} disabled={isLinking}>
            {isLinking ? "Verifying..." : "Connect Domain"}
          </Button>
        </div>

        {/* DNS Config Guide */}
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" /> DNS Configuration
            </CardTitle>
            <CardDescription>Point your domain records to our servers to complete the connection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-bold mb-1">Type</p>
                <code className="text-primary font-bold">A RECORD</code>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-bold mb-1">Host</p>
                <code>@</code>
              </div>
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold mb-1">Value</p>
                  <code>76.76.21.21</code>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard("76.76.21.21")}><Copy className="h-3 w-3" /></Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-amber-500/5 p-2 rounded border border-amber-500/20">
              <Info className="h-3 w-3 text-amber-500" />
              Note: DNS changes can take up to 24-48 hours to fully propagate globally.
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SSL Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold">Security & SSL</h3>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">Global SSL Encryption</p>
                <p className="text-xs text-muted-foreground font-medium">Auto-renewing Let's Encrypt certificates are active for all domains.</p>
              </div>
            </div>
            <Badge className="bg-emerald-500">Active</Badge>
          </CardContent>
        </Card>
      </section>

      {/* Help Section */}
      <Card className="bg-slate-900 text-white border-none shadow-2xl">
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-2">
            <h4 className="text-xl font-bold italic">Need help with domain setup?</h4>
            <p className="text-slate-400 text-sm">Our engineering team can help you configure your DNS records or migrate from another provider at no extra cost.</p>
          </div>
          <Button className="bg-white text-slate-900 hover:bg-slate-200 gap-2">
            Talk to an Expert <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Info = ({ className, ...props }: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default DomainManager;
