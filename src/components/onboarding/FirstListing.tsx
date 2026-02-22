import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building, MapPin, Ruler } from "lucide-react";

interface FirstListingProps {
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const propertyTypes = ["Apartment", "Villa", "Townhouse", "Land", "Office", "Warehouse", "Shop", "Other"];

const FirstListing = ({ data, onChange }: FirstListingProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 mb-4">
        <Building className="h-8 w-8 text-amber-500" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Add Your First Listing</h2>
      <p className="text-muted-foreground mt-1">Add a property to get started — you can add more later</p>
    </div>

    <div className="max-w-2xl mx-auto space-y-5">
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" /> Property Details
          </h3>
          <div className="space-y-1.5">
            <Label>Property Title</Label>
            <Input value={data.productName || ""} onChange={(e) => onChange("productName", e.target.value)} placeholder="Modern 2BR Apartment in Riyadh" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Property Type</Label>
              <Select value={data.propertyType || ""} onValueChange={(v) => onChange("propertyType", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input value={data.productPrice || ""} onChange={(e) => onChange("productPrice", e.target.value)} placeholder="500,000" type="number" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Location & Size
          </h3>
          <div className="space-y-1.5">
            <Label>Location / City</Label>
            <Input value={data.location || ""} onChange={(e) => onChange("location", e.target.value)} placeholder="Riyadh, Al Olaya District" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Area (sqm)</Label>
              <Input value={data.area || ""} onChange={(e) => onChange("area", e.target.value)} placeholder="120" type="number" />
            </div>
            <div className="space-y-1.5">
              <Label>Bedrooms</Label>
              <Input value={data.bedrooms || ""} onChange={(e) => onChange("bedrooms", e.target.value)} placeholder="2" type="number" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={data.listingDescription || ""}
              onChange={(e) => onChange("listingDescription", e.target.value)}
              placeholder="Describe the property features..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default FirstListing;
