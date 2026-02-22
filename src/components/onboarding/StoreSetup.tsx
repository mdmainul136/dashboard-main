import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Store, Globe, Palette, Tag, Check } from "lucide-react";

interface StoreSetupProps {
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const categories = [
  "Fashion & Apparel", "Electronics", "Grocery & Food", "Health & Beauty",
  "Home & Garden", "Toys & Kids", "Sports & Outdoors", "Automotive",
  "Books & Media", "Jewelry & Watches", "Handmade & Artisan", "Other",
];

const StoreSetup = ({ data, onChange }: StoreSetupProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
        <Store className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Store Setup</h2>
      <p className="text-muted-foreground mt-1">Configure your online store identity</p>
    </div>

    <div className="max-w-2xl mx-auto space-y-5">
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" /> Store Identity
          </h3>
          <div className="space-y-1.5">
            <Label>Store Name (English)</Label>
            <Input value={data.storeName || ""} onChange={(e) => onChange("storeName", e.target.value)} placeholder="My Awesome Store" />
          </div>
          <div className="space-y-1.5">
            <Label>Store Name (Arabic)</Label>
            <Input value={data.storeNameAr || ""} onChange={(e) => onChange("storeNameAr", e.target.value)} placeholder="متجري الرائع" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label>Store Description</Label>
            <Textarea
              value={data.storeDescription || ""}
              onChange={(e) => onChange("storeDescription", e.target.value)}
              placeholder="Brief description of what you sell..."
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
            <Label>Choose your free store URL</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-48">
                <Input
                  value={data.subdomain || ""}
                  onChange={(e) => onChange("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="my-store"
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
            <Palette className="h-4 w-4 text-primary" /> Category
          </h3>
          <div className="space-y-1.5">
            <Label>Store Category</Label>
            <Select value={data.category || ""} onValueChange={(v) => onChange("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select your primary category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Estimated Product Count</Label>
            <Select value={data.productCount || ""} onValueChange={(v) => onChange("productCount", v)}>
              <SelectTrigger><SelectValue placeholder="How many products?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1-50">1 - 50 products</SelectItem>
                <SelectItem value="51-500">51 - 500 products</SelectItem>
                <SelectItem value="501-5000">501 - 5,000 products</SelectItem>
                <SelectItem value="5000+">5,000+ products</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default StoreSetup;
