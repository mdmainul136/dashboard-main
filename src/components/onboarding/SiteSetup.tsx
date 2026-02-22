import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Tag, Palette, Check } from "lucide-react";

interface SiteSetupProps {
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const industries = [
  "Real Estate", "Consulting", "Healthcare", "Education", "Legal Services",
  "Architecture & Design", "Marketing Agency", "IT Services", "Accounting",
  "Photography", "Fitness & Wellness", "Non-Profit", "Construction", "Other",
];

const SiteSetup = ({ data, onChange }: SiteSetupProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
        <Globe className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Site Setup</h2>
      <p className="text-muted-foreground mt-1">Configure your website identity</p>
    </div>

    <div className="max-w-2xl mx-auto space-y-5">
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" /> Site Identity
          </h3>
          <div className="space-y-1.5">
            <Label>Site Name (English)</Label>
            <Input value={data.storeName || ""} onChange={(e) => onChange("storeName", e.target.value)} placeholder="My Business" />
          </div>
          <div className="space-y-1.5">
            <Label>Site Name (Arabic)</Label>
            <Input value={data.storeNameAr || ""} onChange={(e) => onChange("storeNameAr", e.target.value)} placeholder="عملي" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label>Site Description</Label>
            <Textarea
              value={data.storeDescription || ""}
              onChange={(e) => onChange("storeDescription", e.target.value)}
              placeholder="Brief description of your business or services..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Subdomain
          </h3>
          <div className="space-y-1.5">
            <Label>Choose your free website URL</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-48">
                <Input
                  value={data.subdomain || ""}
                  onChange={(e) => onChange("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="my-business"
                  className="pr-8"
                />
                {data.subdomain && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {data.subdomain.length < 3 ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    ) : (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">.platform.sa</span>
            </div>
            {data.subdomain && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {data.subdomain.length < 3 ? (
                  "Min 3 characters"
                ) : (
                  <>
                    <span className="inline-block h-1 w-1 rounded-full bg-emerald-500" />
                    Available: <span className="font-medium text-foreground italic">https://{data.subdomain}.platform.sa</span>
                  </>
                )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> Industry
          </h3>
          <div className="space-y-1.5">
            <Label>Business Industry</Label>
            <Select value={data.category || ""} onValueChange={(v) => onChange("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
              <SelectContent>
                {industries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default SiteSetup;
