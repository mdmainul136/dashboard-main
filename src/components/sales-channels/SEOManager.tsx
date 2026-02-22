import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Search, CheckCircle2, AlertTriangle, XCircle, Globe, Edit, FileText } from "lucide-react";

interface ProductSEO {
  id: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  urlHandle: string;
  score: number;
  platform: "shopify" | "salla";
  indexed: boolean;
}

const mockSEO: ProductSEO[] = [
  { id: "seo1", name: "Wireless Mouse", metaTitle: "Best Wireless Mouse 2026 - Ergonomic Design", metaDescription: "Shop our premium wireless mouse with 3-year battery life and ergonomic design. Free shipping.", urlHandle: "wireless-mouse", score: 92, platform: "shopify", indexed: true },
  { id: "seo2", name: "Mechanical Keyboard", metaTitle: "Mechanical Keyboard", metaDescription: "Buy keyboard", urlHandle: "mechanical-keyboard", score: 35, platform: "shopify", indexed: false },
  { id: "seo3", name: "USB-C Hub", metaTitle: "7-in-1 USB-C Hub - Multi-port Adapter", metaDescription: "Connect all your devices with our 7-in-1 USB-C hub. HDMI, USB 3.0, SD card reader included.", urlHandle: "usb-c-hub", score: 78, platform: "salla", indexed: true },
  { id: "seo4", name: "Webcam HD", metaTitle: "HD Webcam 1080p for Streaming", metaDescription: "Professional 1080p webcam perfect for streaming and video calls.", urlHandle: "webcam-hd", score: 68, platform: "salla", indexed: true },
  { id: "seo5", name: "Headphones", metaTitle: "", metaDescription: "", urlHandle: "headphones", score: 15, platform: "shopify", indexed: false },
  { id: "seo6", name: "Desk Lamp", metaTitle: "LED Desk Lamp with USB Charging", metaDescription: "Adjustable LED desk lamp with built-in USB charging port. 5 brightness levels.", urlHandle: "desk-lamp", score: 85, platform: "salla", indexed: true },
];

const SEOManager = () => {
  const [products, setProducts] = useState(mockSEO);
  const [editProduct, setEditProduct] = useState<ProductSEO | null>(null);
  const [editData, setEditData] = useState({ metaTitle: "", metaDescription: "", urlHandle: "" });

  const good = products.filter(p => p.score >= 70).length;
  const needsImprovement = products.filter(p => p.score >= 40 && p.score < 70).length;
  const poor = products.filter(p => p.score < 40).length;
  const avgScore = Math.round(products.reduce((s, p) => s + p.score, 0) / products.length);
  const indexedCount = products.filter(p => p.indexed).length;

  const openEdit = (p: ProductSEO) => {
    setEditProduct(p);
    setEditData({ metaTitle: p.metaTitle, metaDescription: p.metaDescription, urlHandle: p.urlHandle });
  };

  const saveEdit = () => {
    if (!editProduct) return;
    setProducts(prev => prev.map(p => {
      if (p.id !== editProduct.id) return p;
      const titleScore = editData.metaTitle.length > 20 ? 30 : editData.metaTitle.length > 0 ? 15 : 0;
      const descScore = editData.metaDescription.length > 50 ? 40 : editData.metaDescription.length > 0 ? 20 : 0;
      const handleScore = editData.urlHandle.length > 0 ? 20 : 0;
      const baseScore = 10;
      return { ...p, ...editData, score: Math.min(100, titleScore + descScore + handleScore + baseScore) };
    }));
    setEditProduct(null);
  };

  const scoreColor = (s: number) => {
    if (s >= 70) return "text-success";
    if (s >= 40) return "text-warning";
    return "text-destructive";
  };

  const scoreIcon = (s: number) => {
    if (s >= 70) return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (s >= 40) return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Average SEO Score</p><p className={`text-2xl font-bold ${scoreColor(avgScore)}`}>{avgScore}/100</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Search className="h-5 w-5 text-primary" /></div></div><Progress value={avgScore} className="mt-3 h-1.5" /></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Good (70+)</p><p className="text-2xl font-bold text-success">{good}</p></div><CheckCircle2 className="h-5 w-5 text-success" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Needs Improvement</p><p className="text-2xl font-bold text-warning">{needsImprovement}</p></div><AlertTriangle className="h-5 w-5 text-warning" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Poor (&lt;40)</p><p className="text-2xl font-bold text-destructive">{poor}</p></div><XCircle className="h-5 w-5 text-destructive" /></div></CardContent></Card>
      </div>

      {/* Indexing */}
      <Card>
        <CardHeader><CardTitle className="text-base">Indexing & Sitemap</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-3 text-center"><p className="text-2xl font-bold text-foreground">{indexedCount}/{products.length}</p><p className="text-xs text-muted-foreground">Indexed by Google</p></div>
            <div className="rounded-lg border border-border p-3 text-center"><Badge className="bg-success/10 text-success border-success/20">Active</Badge><p className="text-xs text-muted-foreground mt-1">Sitemap Status</p></div>
            <div className="rounded-lg border border-border p-3 text-center"><p className="text-sm font-medium text-foreground">Feb 18, 2026</p><p className="text-xs text-muted-foreground">Last Crawl</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Product SEO Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Meta Title</th><th className="p-4 font-medium">Meta Description</th><th className="p-4 font-medium">Score</th><th className="p-4 font-medium">Platform</th><th className="p-4 font-medium">Action</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-foreground max-w-[200px] truncate">{p.metaTitle || <span className="text-destructive italic">Missing</span>}</td>
                  <td className="p-4 text-muted-foreground max-w-[200px] truncate">{p.metaDescription || <span className="text-destructive italic">Missing</span>}</td>
                  <td className="p-4"><div className="flex items-center gap-2">{scoreIcon(p.score)}<span className={`font-mono font-bold ${scoreColor(p.score)}`}>{p.score}</span></div></td>
                  <td className="p-4"><Badge variant="outline" className={p.platform === "shopify" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-violet-500/10 text-violet-600 border-violet-500/30"}>{p.platform === "shopify" ? "Shopify" : "Salla"}</Badge></td>
                  <td className="p-4"><Button size="sm" variant="ghost" className="gap-1" onClick={() => openEdit(p)}><Edit className="h-3.5 w-3.5" /> Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SEO - {editProduct?.name}</DialogTitle>
            <DialogDescription>Update meta information for better search visibility</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Meta Title ({editData.metaTitle.length}/60)</Label><Input value={editData.metaTitle} onChange={e => setEditData(p => ({ ...p, metaTitle: e.target.value }))} placeholder="Product title for search engines" maxLength={60} /></div>
            <div><Label>Meta Description ({editData.metaDescription.length}/160)</Label><Textarea value={editData.metaDescription} onChange={e => setEditData(p => ({ ...p, metaDescription: e.target.value }))} placeholder="Product description for search results" maxLength={160} rows={3} /></div>
            <div><Label>URL Handle</Label><Input value={editData.urlHandle} onChange={e => setEditData(p => ({ ...p, urlHandle: e.target.value }))} placeholder="product-url-handle" /></div>
          </div>
          <DialogFooter><Button onClick={saveEdit}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SEOManager;
