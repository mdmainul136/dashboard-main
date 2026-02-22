"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useProducts } from "@/hooks/useProducts";
import { getProductStatus } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, XCircle, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  "In Stock": "bg-success/10 text-success border-transparent",
  "Low Stock": "bg-warning/10 text-warning border-transparent",
  "Out of Stock": "bg-destructive/10 text-destructive border-transparent",
};

const StockOverview = () => {
  const products = useProducts();

  const stats = {
    total: products.length,
    inStock: products.filter(p => getProductStatus(p) === "In Stock").length,
    lowStock: products.filter(p => getProductStatus(p) === "Low Stock").length,
    outOfStock: products.filter(p => getProductStatus(p) === "Out of Stock").length,
    totalValue: products.reduce((s, p) => s + p.price * p.stock, 0),
    totalUnits: products.reduce((s, p) => s + p.stock, 0),
  };

  const categoryData = Array.from(new Set(products.map(p => p.category))).map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    return {
      name: cat,
      count: catProducts.length,
      value: catProducts.reduce((s, p) => s + p.price * p.stock, 0),
      units: catProducts.reduce((s, p) => s + p.stock, 0),
    };
  }).sort((a, b) => b.value - a.value);

  const lowStockItems = products
    .filter(p => getProductStatus(p) === "Low Stock" || getProductStatus(p) === "Out of Stock")
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);

  const topValueItems = products
    .map(p => ({ ...p, totalValue: p.price * p.stock }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ðŸ“Š Stock Overview</h1>
        <p className="text-sm text-muted-foreground">Inventory health at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Package, label: "Total Products", value: stats.total, color: "text-primary", bg: "bg-primary/10" },
          { icon: TrendingUp, label: "Total Units", value: stats.totalUnits.toLocaleString(), color: "text-success", bg: "bg-success/10" },
          { icon: DollarSign, label: "Inventory Value", value: `$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "text-primary", bg: "bg-primary/10" },
          { icon: AlertTriangle, label: "Needs Attention", value: stats.lowStock + stats.outOfStock, color: "text-warning", bg: "bg-warning/10" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", s.bg, s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-card-foreground">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stock Health */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Stock Health</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "In Stock", count: stats.inStock, pct: (stats.inStock / stats.total) * 100, color: "bg-success" },
              { label: "Low Stock", count: stats.lowStock, pct: (stats.lowStock / stats.total) * 100, color: "bg-warning" },
              { label: "Out of Stock", count: stats.outOfStock, pct: (stats.outOfStock / stats.total) * 100, color: "bg-destructive" },
            ].map(s => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{s.count} ({s.pct.toFixed(0)}%)</span>
                </div>
                <Progress value={s.pct} className={cn("h-2 [&>div]:transition-all", `[&>div]:${s.color}`)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-card-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} products Â· {cat.units} units</p>
                </div>
                <p className="font-bold text-primary">${cat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /> Low Stock Alerts</CardTitle></CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">All products are well stocked! âœ…</p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.map(p => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <span className="text-2xl">{p.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sku} Â· Reorder at {p.reorderLevel}</p>
                    </div>
                    <Badge className={cn("text-xs font-medium", statusStyles[getProductStatus(p)])}>{p.stock} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Value Items */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Top Value Items</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topValueItems.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">#{i + 1}</span>
                  <span className="text-2xl">{p.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">${p.price.toFixed(2)} Ã— {p.stock} units</p>
                  </div>
                  <p className="font-bold text-primary">${p.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StockOverview;

