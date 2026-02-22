import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  FolderOpen, Plus, CheckCircle2, Clock, AlertCircle, RefreshCw, Layers, Package
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Collection {
  id: string;
  name: string;
  productCount: number;
  channels: ("shopify" | "salla")[];
  syncStatus: "synced" | "pending" | "error";
  autoSync: boolean;
  lastSynced: string;
  products: string[];
}

const mockCollections: Collection[] = [
  { id: "col1", name: "Summer Sale", productCount: 24, channels: ["shopify", "salla"], syncStatus: "synced", autoSync: true, lastSynced: "5 min ago",
    products: ["Wireless Mouse", "Keyboard", "USB-C Hub", "Webcam HD"] },
  { id: "col2", name: "New Arrivals", productCount: 12, channels: ["shopify"], syncStatus: "synced", autoSync: true, lastSynced: "10 min ago",
    products: ["Headphones", "Desk Lamp", "Monitor Stand"] },
  { id: "col3", name: "Best Sellers", productCount: 18, channels: ["shopify", "salla"], syncStatus: "pending", autoSync: false, lastSynced: "1 hr ago",
    products: ["Gaming Chair", "Wireless Charger", "Phone Case"] },
  { id: "col4", name: "Electronics", productCount: 45, channels: ["salla"], syncStatus: "synced", autoSync: true, lastSynced: "3 min ago",
    products: ["Laptop", "Tablet", "Smart Watch"] },
  { id: "col5", name: "Clearance", productCount: 8, channels: ["shopify", "salla"], syncStatus: "error", autoSync: true, lastSynced: "2 hrs ago",
    products: ["Old Model Phone", "Last Gen Headphones"] },
];

const availableProducts = [
  "Wireless Mouse", "Mechanical Keyboard", "USB-C Hub", "Webcam HD", "Headphones",
  "Desk Lamp", "Monitor Stand", "Gaming Chair", "Wireless Charger", "Phone Case",
  "Laptop", "Tablet", "Smart Watch", "Speaker", "Power Bank"
];

const syncBadge = (s: "synced" | "pending" | "error") => {
  if (s === "synced") return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Synced</Badge>;
  if (s === "pending") return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
  return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><AlertCircle className="h-3 w-3" /> Error</Badge>;
};

const ProductCollections = () => {
  const [collections, setCollections] = useState(mockCollections);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const totalCollections = collections.length;
  const syncedCount = collections.filter(c => c.syncStatus === "synced").length;
  const totalProducts = collections.reduce((s, c) => s + c.productCount, 0);

  const toggleAutoSync = (id: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, autoSync: !c.autoSync } : c));
    toast({ title: "Updated", description: "Auto-sync setting changed" });
  };

  const toggleProduct = (product: string) => {
    setSelectedProducts(prev => prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]);
  };

  const handleCreate = () => {
    if (!newName.trim() || newName.trim().length < 2) {
      toast({ title: "Error", description: "Collection name required (min 2 chars)", variant: "destructive" }); return;
    }
    const col: Collection = {
      id: `col${Date.now()}`, name: newName.trim(), productCount: selectedProducts.length,
      channels: ["shopify", "salla"], syncStatus: "pending", autoSync: true, lastSynced: "Just now",
      products: selectedProducts,
    };
    setCollections(prev => [col, ...prev]);
    setDialogOpen(false); setNewName(""); setSelectedProducts([]);
    toast({ title: "Created!", description: `Collection "${col.name}" created with ${col.productCount} products` });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Collections</p><p className="text-2xl font-bold text-foreground">{totalCollections}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Layers className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Synced</p><p className="text-2xl font-bold text-success">{syncedCount}/{totalCollections}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><CheckCircle2 className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Products</p><p className="text-2xl font-bold text-foreground">{totalProducts}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Package className="h-5 w-5 text-violet-500" /></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Create Collection
        </Button>
      </div>

      {/* Collection Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map(col => (
          <Card key={col.id} className="border transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{col.name}</p>
                    <p className="text-xs text-muted-foreground">{col.productCount} products</p>
                  </div>
                </div>
                {syncBadge(col.syncStatus)}
              </div>

              <div className="flex flex-wrap gap-1">
                {col.channels.map(ch => (
                  <Badge key={ch} variant="outline" className={ch === "shopify" ? "bg-emerald-500/10 text-emerald-600 text-[10px]" : "bg-violet-500/10 text-violet-600 text-[10px]"}>
                    {ch === "shopify" ? "Shopify" : "Salla"}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {col.products.slice(0, 3).map(p => (
                  <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                ))}
                {col.products.length > 3 && <Badge variant="outline" className="text-[10px]">+{col.products.length - 3} more</Badge>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Auto-sync</span>
                  <Switch checked={col.autoSync} onCheckedChange={() => toggleAutoSync(col.id)} />
                </div>
                <span className="text-[10px] text-muted-foreground">Last: {col.lastSynced}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) { setNewName(""); setSelectedProducts([]); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FolderOpen className="h-4 w-4 text-primary" /> Create Collection</DialogTitle>
            <DialogDescription>Create a new product collection and assign products</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Collection Name</Label>
              <Input placeholder="e.g. Winter Sale" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Assign Products ({selectedProducts.length} selected)</Label>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border p-2 space-y-1">
                {availableProducts.map(p => (
                  <button key={p} type="button" onClick={() => toggleProduct(p)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedProducts.includes(p) ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
                    }`}>
                    {selectedProducts.includes(p) ? "✓ " : ""}{p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); setNewName(""); setSelectedProducts([]); }}>Cancel</Button>
            <Button onClick={handleCreate} className="gap-1.5"><Plus className="h-4 w-4" /> Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCollections;
