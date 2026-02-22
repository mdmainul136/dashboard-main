"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useProducts } from "@/hooks/useProducts";
import { getProductStatus } from "@/data/products";
import { useMemo } from "react";
import { Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

const turnoverData = [
  { name: "Electronics", rate: 4.2 }, { name: "Office", rate: 3.1 },
  { name: "Audio", rate: 2.8 }, { name: "Accessories", rate: 5.6 },
];

const InventoryReport = () => {
  const { formatShort } = useCurrency();
  const products = useProducts();

  const stats = useMemo(() => {
    const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
    const lowStock = products.filter(p => getProductStatus(p) === "Low Stock").length;
    const outOfStock = products.filter(p => getProductStatus(p) === "Out of Stock").length;
    return { totalValue, lowStock, outOfStock, totalItems: products.reduce((s, p) => s + p.stock, 0) };
  }, [products]);

  const categoryValue = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => map.set(p.category, (map.get(p.category) || 0) + p.price * p.stock));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  const deadStock = useMemo(() => products.filter(p => p.stock > p.reorderLevel * 5).sort((a, b) => b.stock - a.stock).slice(0, 5), [products]);
  const reorderNeeded = useMemo(() => products.filter(p => p.stock <= p.reorderLevel && p.stock > 0), [products]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Report</h1>
          <p className="text-muted-foreground">Stock analysis and reorder suggestions</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-primary/10 p-3"><Package className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Items</p><p className="text-2xl font-bold">{stats.totalItems}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-green-500/10 p-3"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Stock Value</p><p className="text-2xl font-bold">{formatShort(stats.totalValue)}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-amber-500/10 p-3"><AlertTriangle className="h-5 w-5 text-amber-600" /></div><div><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-2xl font-bold">{stats.lowStock}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-red-500/10 p-3"><AlertTriangle className="h-5 w-5 text-red-600" /></div><div><p className="text-sm text-muted-foreground">Out of Stock</p><p className="text-2xl font-bold">{stats.outOfStock}</p></div></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Stock Turnover Rate</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={turnoverData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Stock Value by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={categoryValue} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{categoryValue.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Reorder Suggestions</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Stock</TableHead><TableHead>Reorder Level</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>{reorderNeeded.map(p => <TableRow key={p.id}><TableCell className="font-medium">{p.name}</TableCell><TableCell>{p.stock}</TableCell><TableCell>{p.reorderLevel}</TableCell><TableCell><Badge variant="destructive">Reorder</Badge></TableCell></TableRow>)}</TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Potential Dead Stock</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Stock</TableHead><TableHead>Value</TableHead></TableRow></TableHeader>
                <TableBody>{deadStock.map(p => <TableRow key={p.id}><TableCell className="font-medium">{p.name}</TableCell><TableCell>{p.stock}</TableCell><TableCell>{formatShort(p.stock * p.price)}</TableCell></TableRow>)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InventoryReport;

