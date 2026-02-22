"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Package, AlertTriangle, Save, X, Trash2, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { getProductStatus, updateProduct, addProduct, deleteProduct, type Product, type ProductStatus } from "@/data/products";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  "In Stock": "bg-success/10 text-success border-transparent",
  "Low Stock": "bg-warning/10 text-warning border-transparent",
  "Out of Stock": "bg-destructive/10 text-destructive border-transparent",
};

const CATEGORIES = ["Electronics", "Office", "Audio", "Accessories"];
const EMOJI_OPTIONS = ["ðŸ“¦", "ðŸ–±ï¸", "âŒ¨ï¸", "ðŸ”Œ", "ðŸ“·", "ðŸ’¡", "ðŸ““", "ðŸ–Šï¸", "ðŸ–¥ï¸", "ðŸŽ§", "ðŸ”Š", "ðŸ“±", "ðŸ”‹", "ðŸ’¼", "âš¡", "ðŸ—„ï¸"];

type SortKey = "name" | "sku" | "stock" | "price" | "status";
type SortDir = "asc" | "desc";
const PER_PAGE = 8;

const InventoryPage = () => {
  const products = useProducts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  // Edit stock dialog
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editReorderLevel, setEditReorderLevel] = useState("");

  // Add product dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newStock, setNewStock] = useState("");
  const [newReorderLevel, setNewReorderLevel] = useState("10");
  const [newBarcode, setNewBarcode] = useState("");
  const [newImage, setNewImage] = useState("ðŸ“¦");

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);

  const resetAddForm = () => {
    setNewName(""); setNewSku(""); setNewPrice(""); setNewCategory("Electronics");
    setNewStock(""); setNewReorderLevel("10"); setNewBarcode(""); setNewImage("ðŸ“¦");
  };

  const handleAddProduct = () => {
    const name = newName.trim();
    const sku = newSku.trim();
    const price = parseFloat(newPrice);
    const stock = parseInt(newStock, 10);
    const reorderLevel = parseInt(newReorderLevel, 10);
    const barcode = newBarcode.trim();

    if (!name) { toast({ title: "Name required", variant: "destructive" }); return; }
    if (!sku) { toast({ title: "SKU required", variant: "destructive" }); return; }
    if (products.some(p => p.sku === sku)) { toast({ title: "SKU already exists", variant: "destructive" }); return; }
    if (isNaN(price) || price <= 0) { toast({ title: "Invalid price", variant: "destructive" }); return; }
    if (isNaN(stock) || stock < 0) { toast({ title: "Invalid stock", variant: "destructive" }); return; }
    if (isNaN(reorderLevel) || reorderLevel < 0) { toast({ title: "Invalid reorder level", variant: "destructive" }); return; }
    if (!barcode) { toast({ title: "Barcode required", variant: "destructive" }); return; }
    if (products.some(p => p.barcode === barcode)) { toast({ title: "Barcode already exists", variant: "destructive" }); return; }

    addProduct({
      id: `p${Date.now()}`,
      name, sku, price, category: newCategory, image: newImage,
      stock, reorderLevel, barcode,
    });
    setAddOpen(false);
    resetAddForm();
    toast({ title: "Product added!", description: `${newImage} ${name} has been added to inventory` });
  };

  const handleDeleteProduct = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    toast({ title: "Product deleted", description: `${deleteTarget.name} has been removed` });
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setEditStock(String(product.stock));
    setEditPrice(String(product.price));
    setEditReorderLevel(String(product.reorderLevel));
  };

  const handleSaveEdit = () => {
    if (!editProduct) return;
    const newStockVal = parseInt(editStock, 10);
    const newPriceVal = parseFloat(editPrice);
    const newReorderVal = parseInt(editReorderLevel, 10);
    if (isNaN(newStockVal) || newStockVal < 0) {
      toast({ title: "Invalid stock", description: "Stock must be a non-negative number", variant: "destructive" });
      return;
    }
    if (isNaN(newPriceVal) || newPriceVal <= 0) {
      toast({ title: "Invalid price", description: "Price must be greater than 0", variant: "destructive" });
      return;
    }
    if (isNaN(newReorderVal) || newReorderVal < 0) {
      toast({ title: "Invalid reorder level", description: "Reorder level must be non-negative", variant: "destructive" });
      return;
    }
    updateProduct(editProduct.id, { stock: newStockVal, price: newPriceVal, reorderLevel: newReorderVal });
    setEditProduct(null);
    toast({ title: "Product updated!", description: `${editProduct.name} has been updated` });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const productsWithStatus = useMemo(() =>
    products.map(p => ({ ...p, status: getProductStatus(p) })),
    [products]
  );

  const filtered = useMemo(() => {
    let data = productsWithStatus.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    data.sort((a, b) => {
      switch (sortKey) {
        case "name": return dir * a.name.localeCompare(b.name);
        case "sku": return dir * a.sku.localeCompare(b.sku);
        case "stock": return dir * (a.stock - b.stock);
        case "price": return dir * (a.price - b.price);
        case "status": return dir * a.status.localeCompare(b.status);
        default: return 0;
      }
    });
    return data;
  }, [productsWithStatus, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = {
    total: productsWithStatus.length,
    inStock: productsWithStatus.filter((i) => i.status === "In Stock").length,
    lowStock: productsWithStatus.filter((i) => i.status === "Low Stock").length,
    outOfStock: productsWithStatus.filter((i) => i.status === "Out of Stock").length,
    totalValue: productsWithStatus.reduce((s, i) => s + i.price * i.stock, 0),
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and manage your product stock</p>
        </div>
        <Button className="gap-1.5 rounded-xl shadow-sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Products", value: stats.total, icon: <Package className="h-5 w-5" />, gradient: "from-primary/15 to-primary/5", color: "text-primary" },
          { label: "In Stock", value: stats.inStock, icon: <Package className="h-5 w-5" />, gradient: "from-[hsl(160,84%,39%)]/15 to-[hsl(160,84%,39%)]/5", color: "text-success" },
          { label: "Low Stock", value: stats.lowStock, icon: <AlertTriangle className="h-5 w-5" />, gradient: "from-[hsl(38,92%,50%)]/15 to-[hsl(38,92%,50%)]/5", color: "text-warning" },
          { label: "Out of Stock", value: stats.outOfStock, icon: <Package className="h-5 w-5" />, gradient: "from-destructive/15 to-destructive/5", color: "text-destructive" },
        ].map((s, i) => (
          <div key={s.label} className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} ${s.color} transition-transform duration-300 group-hover:scale-110`}>{s.icon}</div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-card-foreground tabular-nums">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or SKU..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        {["All", "In Stock", "Low Stock", "Out of Stock"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent")}
          >{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {([["name", "Product Name"], ["sku", "SKU"], ["stock", "Stock"], ["price", "Price"], ["status", "Status"]] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} onClick={() => toggleSort(key)} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    <span className="inline-flex items-center gap-1.5">{label} <SortIcon col={key} /></span>
                  </th>
                ))}
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-accent/50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-card-foreground">
                    <div className="flex items-center gap-2">
                      <span>{item.image}</span>
                      <span>{item.name}</span>
                      {item.images && item.images.length > 0 && (
                        <button onClick={() => setGalleryProduct(item)} className="text-muted-foreground hover:text-primary" title="View images">
                          <Image className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground font-mono">{item.sku}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-card-foreground">
                    {item.stock}
                    {item.stock > 0 && item.stock <= item.reorderLevel && (
                      <AlertTriangle className="inline ml-1.5 h-3.5 w-3.5 text-warning" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-card-foreground">${item.price.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge className={cn("text-xs font-medium", statusStyles[item.status])}>{item.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                        title="Edit stock"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5">
          <p className="text-sm text-muted-foreground">
            {filtered.length > 0 ? `Showing ${(page - 1) * PER_PAGE + 1}-${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}` : "No products found"}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => { if (!open) { setAddOpen(false); resetAddForm(); } }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add New Product
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Icon picker */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Icon</Label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewImage(emoji)}
                    className={cn(
                      "h-9 w-9 rounded-lg text-lg flex items-center justify-center transition-colors border",
                      newImage === emoji ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                    )}
                  >{emoji}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-name" className="text-xs font-medium text-muted-foreground">Product Name *</Label>
                <Input id="new-name" placeholder="e.g. Wireless Mouse" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-sku" className="text-xs font-medium text-muted-foreground">SKU *</Label>
                <Input id="new-sku" placeholder="e.g. WM-001" value={newSku} onChange={(e) => setNewSku(e.target.value)} maxLength={20} className="font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-price" className="text-xs font-medium text-muted-foreground">Price ($) *</Label>
                <Input id="new-price" type="number" min="0.01" step="0.01" placeholder="29.99" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Category *</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-stock" className="text-xs font-medium text-muted-foreground">Stock *</Label>
                <Input id="new-stock" type="number" min="0" placeholder="50" value={newStock} onChange={(e) => setNewStock(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-reorder" className="text-xs font-medium text-muted-foreground">Reorder Level</Label>
                <Input id="new-reorder" type="number" min="0" placeholder="10" value={newReorderLevel} onChange={(e) => setNewReorderLevel(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-barcode" className="text-xs font-medium text-muted-foreground">Barcode *</Label>
                <Input id="new-barcode" placeholder="100016" value={newBarcode} onChange={(e) => setNewBarcode(e.target.value)} maxLength={20} className="font-mono" />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => { setAddOpen(false); resetAddForm(); }}>
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button className="flex-1 gap-2" onClick={handleAddProduct}>
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {deleteTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" /> Delete Product
                </DialogTitle>
                <DialogDescription className="pt-2">
                  Are you sure you want to delete this product? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <span className="text-2xl">{deleteTarget.image}</span>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{deleteTarget.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{deleteTarget.sku} Â· Stock: {deleteTarget.stock} Â· ${deleteTarget.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setDeleteTarget(null)}>
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1 gap-2" onClick={handleDeleteProduct}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Stock Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-[420px]">
          {editProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-primary" /> Edit Product
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3 bg-muted/30">
                  <span className="text-2xl">{editProduct.image}</span>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{editProduct.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{editProduct.sku}</p>
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="edit-stock" className="text-xs font-medium text-muted-foreground">Stock Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setEditStock(String(Math.max(0, (parseInt(editStock) || 0) - 1)))}>
                      <span className="text-lg font-bold">âˆ’</span>
                    </Button>
                    <Input id="edit-stock" type="number" min="0" value={editStock} onChange={(e) => setEditStock(e.target.value)} className="text-center text-lg font-bold" />
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setEditStock(String((parseInt(editStock) || 0) + 1))}>
                      <span className="text-lg font-bold">+</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: <span className="font-medium text-card-foreground">{editProduct.stock}</span> â†’ New: <span className={cn("font-medium", parseInt(editStock) !== editProduct.stock ? "text-primary" : "text-card-foreground")}>{editStock || 0}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[10, 25, 50, 100].map(val => (
                    <Button key={val} variant="outline" size="sm" className="text-xs" onClick={() => setEditStock(String((parseInt(editStock) || 0) + val))}>+{val}</Button>
                  ))}
                  <Button variant="outline" size="sm" className="text-xs text-destructive hover:text-destructive" onClick={() => setEditStock("0")}>Set to 0</Button>
                </div>

                {/* Price & Reorder Level */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-price" className="text-xs font-medium text-muted-foreground">Price ($)</Label>
                    <Input id="edit-price" type="number" min="0.01" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                      Was: <span className="font-medium text-card-foreground">${editProduct.price.toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-reorder" className="text-xs font-medium text-muted-foreground">Reorder Level</Label>
                    <Input id="edit-reorder" type="number" min="0" value={editReorderLevel} onChange={(e) => setEditReorderLevel(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                      Was: <span className="font-medium text-card-foreground">{editProduct.reorderLevel}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setEditProduct(null)}><X className="h-4 w-4" /> Cancel</Button>
                  <Button className="flex-1 gap-2" onClick={handleSaveEdit}><Save className="h-4 w-4" /> Save Changes</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={!!galleryProduct} onOpenChange={(open) => { if (!open) setGalleryProduct(null); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" /> {galleryProduct?.image} {galleryProduct?.name} â€” Images
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {galleryProduct?.images && galleryProduct.images.length > 0 ? (
              galleryProduct.images.map((url, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-border aspect-square">
                  <img src={url} alt={`${galleryProduct.name} ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-sm text-muted-foreground py-8">No images available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InventoryPage;

