import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, User, Globe } from "lucide-react";
import { saudiCities } from "@/data/saudiCities";
import { getAllCountries, getRegionByCountry } from "@/data/regionModules";
import { setMerchantCountry } from "@/hooks/useMerchantRegion";

interface BusinessInfoProps {
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const countries = getAllCountries();

const BusinessInfo = ({ data, onChange }: BusinessInfoProps) => {
  const selectedRegion = data.country ? getRegionByCountry(data.country) : null;
  const isSaudi = selectedRegion?.id === "mena";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Business Information</h2>
        <p className="text-muted-foreground mt-1">Tell us about your business to get started</p>
      </div>

      {/* Country Selection - Top Priority */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Select Your Country
          </h3>
          <div className="space-y-1.5">
            <Label>Country *</Label>
            <Select value={data.country || ""} onValueChange={(v) => { onChange("country", v); setMerchantCountry(v); }}>
              <SelectTrigger><SelectValue placeholder="🌍 Select your country..." /></SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.flag} {c.name} ({c.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedRegion && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                {selectedRegion.flag} {selectedRegion.name}
              </Badge>
              <span className="text-[10px] text-muted-foreground italic">"{selectedRegion.positioning}"</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Owner Details
            </h3>
            <div className="space-y-1.5">
              <Label>Full Name (English) *</Label>
              <Input value={data.ownerName || ""} onChange={(e) => onChange("ownerName", e.target.value)} placeholder="Your full name" />
            </div>
            {isSaudi && (
              <div className="space-y-1.5">
                <Label>Full Name (Arabic)</Label>
                <Input value={data.ownerNameAr || ""} onChange={(e) => onChange("ownerNameAr", e.target.value)} placeholder="محمد آل سعود" dir="rtl" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={data.email || ""} onChange={(e) => onChange("email", e.target.value)} placeholder="owner@store.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={data.phone || ""} onChange={(e) => onChange("phone", e.target.value)} placeholder={isSaudi ? "+966 5XX XXX XXXX" : "+1 XXX XXX XXXX"} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Business Registration
            </h3>
            {isSaudi ? (
              <>
                <div className="space-y-1.5">
                  <Label>Commercial Registration (CR) Number *</Label>
                  <Input value={data.crNumber || ""} onChange={(e) => onChange("crNumber", e.target.value)} placeholder="1010XXXXXX" />
                  <p className="text-[11px] text-muted-foreground">10-digit number from Ministry of Commerce</p>
                </div>
                <div className="space-y-1.5">
                  <Label>VAT Registration Number</Label>
                  <Input value={data.vatNumber || ""} onChange={(e) => onChange("vatNumber", e.target.value)} placeholder="3XXXXXXXXXXXXXXX" />
                  <p className="text-[11px] text-muted-foreground">15-digit ZATCA VAT number starting with 3</p>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <Label>Business Registration / Tax ID *</Label>
                <Input value={data.crNumber || ""} onChange={(e) => onChange("crNumber", e.target.value)} placeholder="Your business registration number" />
                <p className="text-[11px] text-muted-foreground">Government-issued business registration number</p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Business Type</Label>
              <Select value={data.businessType || ""} onValueChange={(v) => onChange("businessType", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole_proprietorship">Individual / Sole Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                  <SelectItem value="corporation">Corporation / Joint Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isSaudi && (
              <div className="space-y-1.5">
                <Label>City</Label>
                <Select value={data.city || ""} onValueChange={(v) => onChange("city", v)}>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {saudiCities.map((c) => (
                      <SelectItem key={c.name} value={c.name}>{c.name} ({c.nameAr})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessInfo;
