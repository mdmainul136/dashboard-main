import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PackagePlus, Image, DollarSign, Layers, Tag, Upload } from "lucide-react";

interface FirstProductProps {
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const FirstProduct = ({ data, onChange }: FirstProductProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
        <PackagePlus className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Add Your First Product</h2>
      <p className="text-muted-foreground mt-1">Add a product to get your store ready for customers</p>
    </div>

    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Left: Product details */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Product Details
            </h3>
            <div className="space-y-1.5">
              <Label>Product Name (English)</Label>
              <Input
                value={data.productName || ""}
                onChange={(e) => onChange("productName", e.target.value)}
                placeholder="e.g. Premium Oud Perfume"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Product Name (Arabic)</Label>
              <Input
                value={data.productNameAr || ""}
                onChange={(e) => onChange("productNameAr", e.target.value)}
                placeholder="e.g. عطر عود فاخر"
                dir="rtl"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={data.productDescription || ""}
                onChange={(e) => onChange("productDescription", e.target.value)}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={data.productCategory || ""} onValueChange={(v) => onChange("productCategory", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="beauty">Health & Beauty</SelectItem>
                  <SelectItem value="food">Food & Grocery</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="perfume">Perfumes & Oud</SelectItem>
                  <SelectItem value="jewelry">Jewelry & Watches</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" /> Pricing & Inventory
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Price (SAR)</Label>
                <Input
                  type="number"
                  value={data.productPrice || ""}
                  onChange={(e) => onChange("productPrice", e.target.value)}
                  placeholder="199.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Compare Price</Label>
                <Input
                  type="number"
                  value={data.productComparePrice || ""}
                  onChange={(e) => onChange("productComparePrice", e.target.value)}
                  placeholder="299.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>SKU</Label>
                <Input
                  value={data.productSku || ""}
                  onChange={(e) => onChange("productSku", e.target.value)}
                  placeholder="PRD-001"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={data.productStock || ""}
                  onChange={(e) => onChange("productStock", e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Weight (KG)</Label>
              <Input
                type="number"
                value={data.productWeight || ""}
                onChange={(e) => onChange("productWeight", e.target.value)}
                placeholder="0.5"
              />
              <p className="text-[11px] text-muted-foreground">Used for shipping rate calculation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Images & Preview */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" /> Product Images
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload className="h-6 w-6" />
                <span className="text-xs font-medium">Main Image</span>
              </div>
              {[2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground/50 cursor-pointer hover:border-border hover:text-muted-foreground transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-[10px]">Image {i}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Recommended: 1000x1000px, JPG or PNG, max 5MB each</p>
          </CardContent>
        </Card>

        {/* Live preview card */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Product Preview
              </span>
            </div>
            <div className="p-4">
              <div className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center mb-3">
                <Image className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">
                {data.productName || "Product Name"}
              </h4>
              {data.productNameAr && (
                <p className="text-xs text-muted-foreground" dir="rtl">{data.productNameAr}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {data.productDescription || "Product description will appear here..."}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {data.productPrice && (
                  <span className="font-bold text-foreground">SAR {parseFloat(data.productPrice).toFixed(2)}</span>
                )}
                {data.productComparePrice && parseFloat(data.productComparePrice) > 0 && (
                  <span className="text-xs text-muted-foreground line-through">SAR {parseFloat(data.productComparePrice).toFixed(2)}</span>
                )}
                {data.productComparePrice && data.productPrice && parseFloat(data.productComparePrice) > parseFloat(data.productPrice) && (
                  <Badge className="text-[9px] bg-destructive/10 text-destructive border-destructive/20">
                    {Math.round((1 - parseFloat(data.productPrice) / parseFloat(data.productComparePrice)) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <div className="flex gap-1.5 mt-2">
                {data.productCategory && <Badge variant="secondary" className="text-[10px]">{data.productCategory}</Badge>}
                {data.productSku && <Badge variant="outline" className="text-[10px]">SKU: {data.productSku}</Badge>}
                {data.productStock && <Badge variant="outline" className="text-[10px]">{data.productStock} in stock</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default FirstProduct;
