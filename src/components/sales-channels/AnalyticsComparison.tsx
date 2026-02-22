import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isWithinInterval, parseISO, subMonths } from "date-fns";
import {
  BarChart3, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Package, Users, DollarSign, Star, CalendarIcon, Filter, Download, FileText
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/hooks/use-toast";

// Extended daily data for filtering
const generateDailyData = () => {
  const data: { date: string; shopify: number; salla: number; shopifyOrders: number; sallaOrders: number }[] = [];
  const base = new Date("2025-09-01");
  for (let i = 0; i < 365; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    if (d > new Date("2026-02-28")) break;
    const dayOfWeek = d.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;
    const monthIdx = (d.getMonth() + 12 - 8) % 12; // months from Sep
    const seasonMultiplier = monthIdx === 3 ? 1.4 : monthIdx === 4 ? 1.1 : 1; // Dec spike
    data.push({
      date: format(d, "yyyy-MM-dd"),
      shopify: Math.round((600 + Math.random() * 400) * weekendMultiplier * seasonMultiplier),
      salla: Math.round((400 + Math.random() * 300) * weekendMultiplier * seasonMultiplier),
      shopifyOrders: Math.round((8 + Math.random() * 6) * weekendMultiplier * seasonMultiplier),
      sallaOrders: Math.round((5 + Math.random() * 4) * weekendMultiplier * seasonMultiplier),
    });
  }
  return data;
};

const allDailyData = generateDailyData();

const categoryData = [
  { name: "Electronics", shopify: 45, salla: 38 },
  { name: "Office", shopify: 25, salla: 30 },
  { name: "Audio", shopify: 15, salla: 12 },
  { name: "Accessories", shopify: 15, salla: 20 },
];

type PresetRange = "7d" | "30d" | "90d" | "6m" | "custom";

const presets: { label: string; value: PresetRange }[] = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "6 Months", value: "6m" },
  { label: "Custom", value: "custom" },
];

interface MetricComparison {
  label: string;
  icon: React.ReactNode;
  shopifyKey: "shopify" | "shopifyOrders";
  sallaKey: "salla" | "sallaOrders";
  format: "currency" | "number";
}

const metricDefs: MetricComparison[] = [
  { label: "Revenue", icon: <DollarSign className="h-4 w-4" />, shopifyKey: "shopify", sallaKey: "salla", format: "currency" },
  { label: "Orders", icon: <ShoppingCart className="h-4 w-4" />, shopifyKey: "shopifyOrders", sallaKey: "sallaOrders", format: "number" },
];

const formatValue = (v: number, f: "currency" | "number") => {
  if (f === "currency") return `$${v.toLocaleString()}`;
  return v.toLocaleString();
};

const AnalyticsComparison = () => {
  const today = new Date("2026-02-19");
  const [activePreset, setActivePreset] = useState<PresetRange>("6m");
  const [startDate, setStartDate] = useState<Date>(subMonths(today, 6));
  const [endDate, setEndDate] = useState<Date>(today);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handlePreset = (preset: PresetRange) => {
    setActivePreset(preset);
    if (preset === "custom") return;
    const days = preset === "7d" ? 7 : preset === "30d" ? 30 : preset === "90d" ? 90 : 180;
    const s = new Date(today);
    s.setDate(s.getDate() - days);
    setStartDate(s);
    setEndDate(today);
  };

  const filteredData = useMemo(() => {
    return allDailyData.filter(d => {
      const date = parseISO(d.date);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  }, [startDate, endDate]);

  // Aggregate to monthly for charts
  const monthlyRevenue = useMemo(() => {
    const map = new Map<string, { month: string; shopify: number; salla: number }>();
    filteredData.forEach(d => {
      const key = d.date.slice(0, 7); // YYYY-MM
      const label = format(parseISO(d.date), "MMM yy");
      if (!map.has(key)) map.set(key, { month: label, shopify: 0, salla: 0 });
      const entry = map.get(key)!;
      entry.shopify += d.shopify;
      entry.salla += d.salla;
    });
    return Array.from(map.values());
  }, [filteredData]);

  const monthlyOrders = useMemo(() => {
    const map = new Map<string, { month: string; shopify: number; salla: number }>();
    filteredData.forEach(d => {
      const key = d.date.slice(0, 7);
      const label = format(parseISO(d.date), "MMM yy");
      if (!map.has(key)) map.set(key, { month: label, shopify: 0, salla: 0 });
      const entry = map.get(key)!;
      entry.shopify += d.shopifyOrders;
      entry.salla += d.sallaOrders;
    });
    return Array.from(map.values());
  }, [filteredData]);

  const totalShopifyRev = filteredData.reduce((s, d) => s + d.shopify, 0);
  const totalSallaRev = filteredData.reduce((s, d) => s + d.salla, 0);
  const totalShopifyOrders = filteredData.reduce((s, d) => s + d.shopifyOrders, 0);
  const totalSallaOrders = filteredData.reduce((s, d) => s + d.sallaOrders, 0);
  const total = totalShopifyRev + totalSallaRev;

  const dynamicMetrics = [
    { label: "Revenue", icon: <DollarSign className="h-4 w-4" />, shopify: totalShopifyRev, salla: totalSallaRev, format: "currency" as const },
    { label: "Orders", icon: <ShoppingCart className="h-4 w-4" />, shopify: totalShopifyOrders, salla: totalSallaOrders, format: "number" as const },
    { label: "Avg Order Value", icon: <TrendingUp className="h-4 w-4" />, shopify: totalShopifyOrders > 0 ? Math.round(totalShopifyRev / totalShopifyOrders) : 0, salla: totalSallaOrders > 0 ? Math.round(totalSallaRev / totalSallaOrders) : 0, format: "currency" as const },
    { label: "Daily Avg Revenue", icon: <BarChart3 className="h-4 w-4" />, shopify: filteredData.length > 0 ? Math.round(totalShopifyRev / filteredData.length) : 0, salla: filteredData.length > 0 ? Math.round(totalSallaRev / filteredData.length) : 0, format: "currency" as const },
  ];

  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    const dateRange = `${format(startDate, "MMM dd, yyyy")} – ${format(endDate, "MMM dd, yyyy")}`;
    
    // Title
    doc.setFontSize(18);
    doc.text("Sales Analytics Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Period: ${dateRange}  |  Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`, 14, 28);
    doc.text(`Data Points: ${filteredData.length} days`, 14, 34);

    // Summary metrics table
    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("Summary Metrics", 14, 46);
    
    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Shopify", "Salla", "Leader", "Difference"]],
      body: dynamicMetrics.map(m => {
        const winner = m.shopify > m.salla ? "Shopify" : "Salla";
        const diff = m.salla > 0 ? Math.abs(((m.shopify - m.salla) / m.salla) * 100).toFixed(1) + "%" : "N/A";
        return [m.label, formatValue(m.shopify, m.format), formatValue(m.salla, m.format), winner, diff];
      }),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });

    // Monthly revenue breakdown
    const afterSummary = (doc as any).lastAutoTable?.finalY || 90;
    doc.setFontSize(13);
    doc.text("Monthly Revenue Breakdown", 14, afterSummary + 12);
    
    autoTable(doc, {
      startY: afterSummary + 16,
      head: [["Month", "Shopify Revenue", "Salla Revenue", "Total", "Shopify %"]],
      body: monthlyRevenue.map(m => {
        const t = m.shopify + m.salla;
        return [m.month, `$${m.shopify.toLocaleString()}`, `$${m.salla.toLocaleString()}`, `$${t.toLocaleString()}`, t > 0 ? ((m.shopify / t) * 100).toFixed(1) + "%" : "0%"];
      }),
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 },
    });

    // Monthly orders breakdown
    const afterRevenue = (doc as any).lastAutoTable?.finalY || 150;
    doc.setFontSize(13);
    doc.text("Monthly Orders Breakdown", 14, afterRevenue + 12);
    
    autoTable(doc, {
      startY: afterRevenue + 16,
      head: [["Month", "Shopify Orders", "Salla Orders", "Total", "Shopify %"]],
      body: monthlyOrders.map(m => {
        const t = m.shopify + m.salla;
        return [m.month, m.shopify.toLocaleString(), m.salla.toLocaleString(), t.toLocaleString(), t > 0 ? ((m.shopify / t) * 100).toFixed(1) + "%" : "0%"];
      }),
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 9 },
    });

    // Revenue share summary
    const afterOrders = (doc as any).lastAutoTable?.finalY || 200;
    if (afterOrders + 40 > 280) doc.addPage();
    const shareY = afterOrders + 40 > 280 ? 20 : afterOrders + 12;
    doc.setFontSize(13);
    doc.text("Revenue Share", 14, shareY);
    doc.setFontSize(10);
    doc.text(`Shopify: $${totalShopifyRev.toLocaleString()} (${total > 0 ? ((totalShopifyRev / total) * 100).toFixed(1) : 0}%)`, 14, shareY + 8);
    doc.text(`Salla: $${totalSallaRev.toLocaleString()} (${total > 0 ? ((totalSallaRev / total) * 100).toFixed(1) : 0}%)`, 14, shareY + 14);
    doc.text(`Combined: $${total.toLocaleString()}`, 14, shareY + 20);

    // Category performance
    doc.setFontSize(13);
    doc.text("Category Performance", 14, shareY + 32);
    autoTable(doc, {
      startY: shareY + 36,
      head: [["Category", "Shopify %", "Salla %"]],
      body: categoryData.map(c => [c.name, `${c.shopify}%`, `${c.salla}%`]),
      theme: "grid",
      headStyles: { fillColor: [245, 158, 11] },
      styles: { fontSize: 9 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}  |  Sales Analytics Report  |  ${dateRange}`, 14, 290);
    }

    doc.save(`analytics-report-${format(startDate, "yyyyMMdd")}-${format(endDate, "yyyyMMdd")}.pdf`);
    toast({ title: "Report Downloaded!", description: `PDF report for ${dateRange} saved successfully` });
  }, [startDate, endDate, filteredData, dynamicMetrics, monthlyRevenue, monthlyOrders, totalShopifyRev, totalSallaRev, total]);

  return (
    <div className="space-y-5">
      {/* Date Range Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Date Range:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <Button key={p.value} size="sm" variant={activePreset === p.value ? "default" : "outline"}
                  onClick={() => handlePreset(p.value)} className="text-xs h-8">
                  {p.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {startDate ? format(startDate, "MMM dd, yyyy") : "Start"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={(d) => { if (d) { setStartDate(d); setActivePreset("custom"); } setStartOpen(false); }}
                    initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-muted-foreground">→</span>
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {endDate ? format(endDate, "MMM dd, yyyy") : "End"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={endDate} onSelect={(d) => { if (d) { setEndDate(d); setActivePreset("custom"); } setEndOpen(false); }}
                    initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Showing {filteredData.length} days of data · {format(startDate, "MMM dd, yyyy")} – {format(endDate, "MMM dd, yyyy")}
            </p>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={exportPDF}>
              <Download className="h-3.5 w-3.5" /> Export PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metric Comparison Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dynamicMetrics.map(m => {
          const winner = m.shopify > m.salla ? "shopify" : "salla";
          const diff = m.salla > 0 ? Math.abs(((m.shopify - m.salla) / m.salla) * 100).toFixed(1) : "0";
          return (
            <Card key={m.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-muted-foreground">{m.icon}</span>
                  <span className="text-sm font-medium text-foreground">{m.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-lg p-2.5 text-center ${winner === "shopify" ? "bg-emerald-500/10 ring-1 ring-emerald-500/20" : "bg-muted/50"}`}>
                    <p className="text-xs text-muted-foreground mb-1">Shopify</p>
                    <p className="text-lg font-bold text-foreground">{formatValue(m.shopify, m.format)}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 text-center ${winner === "salla" ? "bg-violet-500/10 ring-1 ring-violet-500/20" : "bg-muted/50"}`}>
                    <p className="text-xs text-muted-foreground mb-1">Salla</p>
                    <p className="text-lg font-bold text-foreground">{formatValue(m.salla, m.format)}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  {winner === "shopify" ? "Shopify" : "Salla"} leads by {diff}%
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Revenue Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Revenue Comparison
            </CardTitle>
            <CardDescription>Monthly revenue: Shopify vs Salla</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Bar dataKey="shopify" name="Shopify" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="salla" name="Salla" fill="hsl(263, 70%, 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Order Trends
            </CardTitle>
            <CardDescription>Monthly order count comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="shopify" name="Shopify" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="salla" name="Salla" stroke="hsl(263, 70%, 58%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Share */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Share</CardTitle>
            <CardDescription>Total revenue distribution for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={[{ name: "Shopify", value: totalShopifyRev }, { name: "Salla", value: totalSallaRev }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                    <Cell fill="hsl(160, 84%, 39%)" />
                    <Cell fill="hsl(263, 70%, 58%)" />
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-foreground">Shopify</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">${totalShopifyRev.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{total > 0 ? ((totalShopifyRev / total) * 100).toFixed(1) : 0}% share</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-3 w-3 rounded-full bg-violet-500" />
                    <span className="text-sm text-foreground">Salla</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">${totalSallaRev.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{total > 0 ? ((totalSallaRev / total) * 100).toFixed(1) : 0}% share</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Performance</CardTitle>
            <CardDescription>Sales % by category per channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={80} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="shopify" name="Shopify" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="salla" name="Salla" fill="hsl(263, 70%, 58%)" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsComparison;
