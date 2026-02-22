"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus, Search, UtensilsCrossed, Coffee, IceCream, Wine,
  Salad, Beef, Eye, Pencil, Trash2, GripVertical, ChefHat,
  Flame, Leaf, AlertTriangle,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  popular: boolean;
  dietary: string[];
  prepTime: number; // minutes
  orders: number;
  image?: string;
}

const sampleMenu: MenuItem[] = [
  { id: "M-001", name: "Grilled Chicken Kabsa", nameAr: "ÙƒØ¨Ø³Ø© Ø¯Ø¬Ø§Ø¬ Ù…Ø´ÙˆÙŠ", category: "main", price: 45, description: "Traditional Saudi rice dish with tender grilled chicken and aromatic spices", available: true, popular: true, dietary: [], prepTime: 25, orders: 342 },
  { id: "M-002", name: "Lamb Mandi", nameAr: "Ù…Ù†Ø¯ÙŠ Ù„Ø­Ù…", category: "main", price: 65, description: "Slow-cooked lamb with basmati rice and Yemeni spice blend", available: true, popular: true, dietary: [], prepTime: 35, orders: 287 },
  { id: "M-003", name: "Hummus Plate", nameAr: "Ø­Ù…Øµ", category: "appetizer", price: 18, description: "Creamy chickpea dip with olive oil, paprika, and warm pita bread", available: true, popular: false, dietary: ["vegetarian", "vegan"], prepTime: 5, orders: 198 },
  { id: "M-004", name: "Fattoush Salad", nameAr: "ÙØªÙˆØ´", category: "appetizer", price: 22, description: "Fresh mixed greens with crispy pita chips and sumac dressing", available: true, popular: false, dietary: ["vegetarian"], prepTime: 8, orders: 156 },
  { id: "M-005", name: "Kunafa", nameAr: "ÙƒÙ†Ø§ÙØ©", category: "dessert", price: 28, description: "Crispy shredded phyllo with sweet cheese and sugar syrup", available: true, popular: true, dietary: ["vegetarian"], prepTime: 15, orders: 423 },
  { id: "M-006", name: "Arabic Coffee", nameAr: "Ù‚Ù‡ÙˆØ© Ø¹Ø±Ø¨ÙŠØ©", category: "drink", price: 12, description: "Traditional cardamom-spiced coffee served with dates", available: true, popular: true, dietary: ["vegan"], prepTime: 3, orders: 567 },
  { id: "M-007", name: "Shawarma Wrap", nameAr: "Ø´Ø§ÙˆØ±Ù…Ø§", category: "main", price: 25, description: "Marinated chicken or beef with garlic sauce in fresh bread", available: false, popular: false, dietary: [], prepTime: 12, orders: 389 },
  { id: "M-008", name: "Basbousa", nameAr: "Ø¨Ø³Ø¨ÙˆØ³Ø©", category: "dessert", price: 20, description: "Semolina cake soaked in sweet rose water syrup with almonds", available: true, popular: false, dietary: ["vegetarian"], prepTime: 10, orders: 134 },
  { id: "M-009", name: "Fresh Lemon Mint", nameAr: "Ù„ÙŠÙ…ÙˆÙ† Ø¨Ø§Ù„Ù†Ø¹Ù†Ø§Ø¹", category: "drink", price: 15, description: "Refreshing blend of fresh lemon juice and crushed mint", available: true, popular: false, dietary: ["vegan"], prepTime: 3, orders: 298 },
];

const categories = [
  { id: "all", label: "All Items", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { id: "appetizer", label: "Appetizers", icon: <Salad className="h-4 w-4" /> },
  { id: "main", label: "Main Course", icon: <Beef className="h-4 w-4" /> },
  { id: "dessert", label: "Desserts", icon: <IceCream className="h-4 w-4" /> },
  { id: "drink", label: "Drinks", icon: <Coffee className="h-4 w-4" /> },
];

const dietaryIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  vegetarian: { icon: <Leaf className="h-3 w-3" />, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  vegan: { icon: <Leaf className="h-3 w-3" />, color: "text-green-600 bg-green-500/10 border-green-500/20" },
  spicy: { icon: <Flame className="h-3 w-3" />, color: "text-red-500 bg-red-500/10 border-red-500/20" },
  "gluten-free": { icon: <AlertTriangle className="h-3 w-3" />, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
};

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenu);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", nameAr: "", category: "main", price: "", description: "", prepTime: "", dietary: [] as string[] });

  const filtered = menuItems.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.nameAr.includes(search)) return false;
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    return true;
  });

  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.available).length,
    popular: menuItems.filter(i => i.popular).length,
    totalOrders: menuItems.reduce((s, i) => s + i.orders, 0),
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(items => items.map(i => i.id === id ? { ...i, available: !i.available } : i));
    toast.success("Availability updated");
  };

  const deleteItem = (id: string) => {
    setMenuItems(items => items.filter(i => i.id !== id));
    toast.success("Menu item removed");
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) { toast.error("Name and price are required"); return; }
    const item: MenuItem = {
      id: `M-${String(menuItems.length + 1).padStart(3, "0")}`,
      name: newItem.name,
      nameAr: newItem.nameAr,
      category: newItem.category,
      price: Number(newItem.price),
      description: newItem.description,
      available: true,
      popular: false,
      dietary: newItem.dietary,
      prepTime: Number(newItem.prepTime) || 10,
      orders: 0,
    };
    setMenuItems([item, ...menuItems]);
    setNewItem({ name: "", nameAr: "", category: "main", price: "", description: "", prepTime: "", dietary: [] });
    setDialogOpen(false);
    toast.success("Menu item added!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-primary" /> Menu Management
            </h1>
            <p className="text-sm text-muted-foreground">Create and manage your restaurant menu</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Menu Item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add Menu Item</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Name (English)</Label><Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Chicken Kabsa" /></div>
                  <div><Label>Name (Arabic)</Label><Input dir="rtl" value={newItem.nameAr} onChange={e => setNewItem({ ...newItem, nameAr: e.target.value })} placeholder="ÙƒØ¨Ø³Ø© Ø¯Ø¬Ø§Ø¬" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Category</Label>
                    <Select value={newItem.category} onValueChange={v => setNewItem({ ...newItem, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizer">Appetizer</SelectItem>
                        <SelectItem value="main">Main Course</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="drink">Drink</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Price (SAR)</Label><Input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="45" /></div>
                  <div><Label>Prep Time (min)</Label><Input type="number" value={newItem.prepTime} onChange={e => setNewItem({ ...newItem, prepTime: e.target.value })} placeholder="15" /></div>
                </div>
                <div><Label>Description</Label><Textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} rows={2} /></div>
                <Button className="w-full" onClick={handleAdd}>Add to Menu</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Items", value: stats.total, icon: <UtensilsCrossed className="h-5 w-5" />, color: "text-primary" },
            { label: "Available", value: stats.available, icon: <Eye className="h-5 w-5" />, color: "text-emerald-500" },
            { label: "Popular", value: stats.popular, icon: <Flame className="h-5 w-5" />, color: "text-amber-500" },
            { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: <ChefHat className="h-5 w-5" />, color: "text-blue-500" },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-muted ${s.color}`}>{s.icon}</div>
                <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Tabs + Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
            <TabsList className="h-auto flex-wrap">
              {categories.map(c => (
                <TabsTrigger key={c.id} value={c.id} className="gap-1.5 text-xs">
                  {c.icon} {c.label}
                  {c.id !== "all" && (
                    <Badge variant="secondary" className="ml-1 text-[9px] h-4 px-1.5">
                      {menuItems.filter(i => i.category === c.id).length}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search menu..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {filtered.map(item => (
            <Card key={item.id} className={`border-border transition-all ${!item.available ? "opacity-60" : ""}`}>
              <CardContent className="flex items-center gap-4 p-4">
                {/* Drag handle */}
                <GripVertical className="h-5 w-5 text-muted-foreground/30 shrink-0 cursor-grab" />

                {/* Image placeholder */}
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center shrink-0">
                  {categories.find(c => c.id === item.category)?.icon || <UtensilsCrossed className="h-6 w-6 text-muted-foreground/40" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                    <span className="text-xs text-muted-foreground font-arabic" dir="rtl">{item.nameAr}</span>
                    {item.popular && <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[9px]">ðŸ”¥ Popular</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {item.dietary.map(d => (
                      <Badge key={d} variant="outline" className={`text-[9px] gap-0.5 ${dietaryIcons[d]?.color || ""}`}>
                        {dietaryIcons[d]?.icon} {d}
                      </Badge>
                    ))}
                    <span className="text-[10px] text-muted-foreground">â±ï¸ {item.prepTime} min</span>
                    <span className="text-[10px] text-muted-foreground">ðŸ“‹ {item.orders} orders</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-primary">SAR {item.price}</p>
                  <p className="text-[10px] text-muted-foreground">{item.id}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <UtensilsCrossed className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">No menu items found</p>
            <p className="text-sm">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MenuManagementPage;

