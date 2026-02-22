"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Download } from "lucide-react";

const dailyData = [
  { name: "Feb 13", revenue: 3200, orders: 12 }, { name: "Feb 14", revenue: 4100, orders: 18 },
  { name: "Feb 15", revenue: 2800, orders: 10 }, { name: "Feb 16", revenue: 5600, orders: 24 },
  { name: "Feb 17", revenue: 4900, orders: 20 }, { name: "Feb 18", revenue: 6200, orders: 28 },
  { name: "Feb 19", revenue: 5400, orders: 22 },
];

const categoryData = [
  { name: "Electronics", value: 45200, fill: "hsl(var(--primary))" },
  { name: "Office", value: 18900, fill: "hsl(var(--chart-2))" },
  { name: "Audio", value: 23400, fill: "hsl(var(--chart-3))" },
  { name: "Accessories", value: 12300, fill: "hsl(var(--chart-4))" },
];

const topProducts = [
  { name: "Headphones", sold: 156, revenue: 23399 },
  { name: "Mechanical Keyboard", sold: 98, revenue: 8819 },
  { name: "Wireless Mouse", sold: 234, revenue: 7017 },
  { name: "Webcam HD", sold: 67, revenue: 4019 },
  { name: "USB-C Hub", sold: 45, revenue: 2249 },
];

const SalesReport = () => {
  const handleExport = () => {
    const csv = "Product,Sold,Revenue\n" + topProducts.map(p => `${p.name},${p.sold},${p.revenue}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sales-report.csv"; a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Report</h1>
            <p className="text-muted-foreground">Revenue trends and product performance</p>
          </div>
          <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-green-500/10 p-3"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Revenue (MTD)</p><p className="text-2xl font-bold">à§³99,800</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-primary/10 p-3"><ShoppingCart className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Orders (MTD)</p><p className="text-2xl font-bold">134</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-green-500/10 p-3"><TrendingUp className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Profit</p><p className="text-2xl font-bold">à§³28,450</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-red-500/10 p-3"><TrendingDown className="h-5 w-5 text-red-600" /></div><div><p className="text-sm text-muted-foreground">Loss/Returns</p><p className="text-2xl font-bold">à§³2,340</p></div></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} /><Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} /></LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart><Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{categoryData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Top Selling Products</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Product</TableHead><TableHead>Units Sold</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader>
              <TableBody>{topProducts.map((p, i) => <TableRow key={p.name}><TableCell>{i + 1}</TableCell><TableCell className="font-medium">{p.name}</TableCell><TableCell>{p.sold}</TableCell><TableCell>à§³{p.revenue.toLocaleString()}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesReport;

