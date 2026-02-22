import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UtensilsCrossed, Tag } from "lucide-react";

interface MenuSetupProps {
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const menuCategories = ["Appetizer", "Main Course", "Dessert", "Drink", "Side Dish", "Combo / Set", "Other"];

const MenuSetup = ({ data, onChange }: MenuSetupProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 mb-4">
        <UtensilsCrossed className="h-8 w-8 text-rose-500" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Add Your First Menu Item</h2>
      <p className="text-muted-foreground mt-1">Start building your digital menu — you can add more later</p>
    </div>

    <div className="max-w-2xl mx-auto space-y-5">
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" /> Item Details
          </h3>
          <div className="space-y-1.5">
            <Label>Item Name</Label>
            <Input value={data.productName || ""} onChange={(e) => onChange("productName", e.target.value)} placeholder="Chicken Shawarma" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={data.menuCategory || ""} onValueChange={(v) => onChange("menuCategory", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {menuCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input value={data.productPrice || ""} onChange={(e) => onChange("productPrice", e.target.value)} placeholder="25" type="number" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={data.menuDescription || ""}
              onChange={(e) => onChange("menuDescription", e.target.value)}
              placeholder="Describe the dish, ingredients, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-primary" /> Additional Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Preparation Time</Label>
              <Input value={data.prepTime || ""} onChange={(e) => onChange("prepTime", e.target.value)} placeholder="15 min" />
            </div>
            <div className="space-y-1.5">
              <Label>Calories (optional)</Label>
              <Input value={data.calories || ""} onChange={(e) => onChange("calories", e.target.value)} placeholder="350" type="number" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default MenuSetup;
