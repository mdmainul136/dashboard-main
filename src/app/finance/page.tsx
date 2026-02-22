"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Wallet, CreditCard, PiggyBank, Receipt, BarChart3, FileText, Building } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";

const revenueExpenseData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 48000, expenses: 31000 },
  { month: "Mar", revenue: 55000, expenses: 33000 },
  { month: "Apr", revenue: 51000, expenses: 29000 },
  { month: "May", revenue: 60000, expenses: 35000 },
  { month: "Jun", revenue: 58000, expenses: 32000 },
  { month: "Jul", revenue: 65000, expenses: 38000 },
  { month: "Aug", revenue: 62000, expenses: 36000 },
  { month: "Sep", revenue: 70000, expenses: 40000 },
  { month: "Oct", revenue: 68000, expenses: 37000 },
  { month: "Nov", revenue: 75000, expenses: 42000 },
  { month: "Dec", revenue: 80000, expenses: 45000 },
];

const cashFlowData = [
  { month: "Jan", inflow: 45000, outflow: 32000 },
  { month: "Feb", inflow: 52000, outflow: 35000 },
  { month: "Mar", inflow: 48000, outflow: 38000 },
  { month: "Apr", inflow: 61000, outflow: 33000 },
  { month: "May", inflow: 55000, outflow: 40000 },
  { month: "Jun", inflow: 67000, outflow: 36000 },
];

const expenseBreakdown = [
  { name: "Cost of Goods Sold", value: 35, color: "hsl(var(--primary))" },
  { name: "Payroll & Benefits", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Marketing & Sales", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Operations & Admin", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Depreciation", value: 8, color: "hsl(var(--chart-5))" },
  { name: "Other Expenses", value: 5, color: "hsl(var(--muted-foreground))" },
];

// IFRS-compliant Balance Sheet
const balanceSheet = {
  assets: {
    current: [
      { account: "Cash & Cash Equivalents", amount: 185000 },
      { account: "Accounts Receivable", amount: 72000 },
      { account: "Inventory", amount: 145000 },
      { account: "Prepaid Expenses", amount: 12000 },
    ],
    nonCurrent: [
      { account: "Property, Plant & Equipment", amount: 320000 },
      { account: "Intangible Assets", amount: 45000 },
      { account: "Right-of-Use Assets (IFRS 16)", amount: 96000 },
    ],
  },
  liabilities: {
    current: [
      { account: "Accounts Payable", amount: 58000 },
      { account: "Accrued Liabilities", amount: 22000 },
      { account: "Short-term Debt", amount: 40000 },
      { account: "VAT/Tax Payable", amount: 18500 },
    ],
    nonCurrent: [
      { account: "Long-term Debt", amount: 150000 },
      { account: "Lease Liabilities (IFRS 16)", amount: 82000 },
      { account: "Deferred Tax Liability", amount: 15000 },
    ],
  },
  equity: [
    { account: "Share Capital", amount: 200000 },
    { account: "Retained Earnings", amount: 289500 },
  ],
};

// Profit & Loss Statement
const profitLossData = [
  { label: "Revenue (Net Sales)", amount: 734000, type: "revenue" },
  { label: "Cost of Goods Sold (COGS)", amount: -426000, type: "cogs" },
  { label: "Gross Profit", amount: 308000, type: "subtotal" },
  { label: "Selling, General & Admin (SG&A)", amount: -125000, type: "expense" },
  { label: "Marketing & Advertising", amount: -45000, type: "expense" },
  { label: "Depreciation & Amortization", amount: -28000, type: "expense" },
  { label: "Operating Income (EBIT)", amount: 110000, type: "subtotal" },
  { label: "Interest Expense", amount: -8500, type: "expense" },
  { label: "Other Income", amount: 3200, type: "revenue" },
  { label: "Earnings Before Tax (EBT)", amount: 104700, type: "subtotal" },
  { label: "Income Tax Expense (15%)", amount: -15705, type: "tax" },
  { label: "Net Income", amount: 88995, type: "net" },
];

// Accounts Receivable Aging
const arAging = [
  { period: "Current (0-30 days)", amount: 42000, count: 12 },
  { period: "31-60 days", amount: 18000, count: 5 },
  { period: "61-90 days", amount: 8000, count: 3 },
  { period: "Over 90 days", amount: 4000, count: 2 },
];

// Accounts Payable Aging
const apAging = [
  { period: "Current (0-30 days)", amount: 35000, count: 8 },
  { period: "31-60 days", amount: 15000, count: 4 },
  { period: "61-90 days", amount: 5500, count: 2 },
  { period: "Over 90 days", amount: 2500, count: 1 },
];

const transactions = [
  { id: "TXN-001", description: "Client Payment - TechCorp", type: "income", amount: 15000, date: "Feb 18, 2026", category: "Revenue" },
  { id: "TXN-002", description: "Office Rent - Q1", type: "expense", amount: 4500, date: "Feb 17, 2026", category: "Operations" },
  { id: "TXN-003", description: "Google Ads Campaign", type: "expense", amount: 2800, date: "Feb 16, 2026", category: "Marketing" },
  { id: "TXN-004", description: "Consulting Fee - Apex Solutions", type: "income", amount: 8500, date: "Feb 15, 2026", category: "Revenue" },
  { id: "TXN-005", description: "Employee Payroll", type: "expense", amount: 32000, date: "Feb 14, 2026", category: "Payroll" },
  { id: "TXN-006", description: "Software Subscription", type: "expense", amount: 1200, date: "Feb 13, 2026", category: "Operations" },
  { id: "TXN-007", description: "Product Sales - Batch #45", type: "income", amount: 22000, date: "Feb 12, 2026", category: "Revenue" },
  { id: "TXN-008", description: "AWS Cloud Services", type: "expense", amount: 3400, date: "Feb 11, 2026", category: "Technology" },
];

const financialRatios = [
  { name: "Current Ratio", value: "2.97", benchmark: "> 1.5", status: "good" },
  { name: "Quick Ratio", value: "1.84", benchmark: "> 1.0", status: "good" },
  { name: "Debt-to-Equity Ratio", value: "0.79", benchmark: "< 2.0", status: "good" },
  { name: "Gross Margin", value: "41.9%", benchmark: "> 30%", status: "good" },
  { name: "Net Profit Margin", value: "12.1%", benchmark: "> 10%", status: "good" },
  { name: "Return on Equity (ROE)", value: "18.2%", benchmark: "> 15%", status: "good" },
  { name: "Days Sales Outstanding", value: "35", benchmark: "< 45", status: "good" },
  { name: "Inventory Turnover", value: "4.2x", benchmark: "> 3x", status: "good" },
];

const FinancePage = () => {
  const [chartTab, setChartTab] = useState<"revenue" | "cashflow">("revenue");
  const { formatAmount, formatShort, currency } = useCurrency();

  const totalRevenue = revenueExpenseData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = revenueExpenseData.reduce((s, d) => s + d.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const totalCurrentAssets = balanceSheet.assets.current.reduce((s, a) => s + a.amount, 0);
  const totalNonCurrentAssets = balanceSheet.assets.nonCurrent.reduce((s, a) => s + a.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
  const totalCurrentLiabilities = balanceSheet.liabilities.current.reduce((s, a) => s + a.amount, 0);
  const totalNonCurrentLiabilities = balanceSheet.liabilities.nonCurrent.reduce((s, a) => s + a.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
  const totalEquity = balanceSheet.equity.reduce((s, a) => s + a.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Accounting & Finance</h1>
            <p className="text-sm text-muted-foreground mt-1">IFRS-compliant financial reporting â€¢ Currency: {currency.code}</p>
          </div>
          <Button variant="outline" className="gap-1.5"><FileText className="h-4 w-4" /> Export Report</Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Revenue", value: formatAmount(totalRevenue, { compact: true }), change: 12.5, positive: true, icon: <DollarSign className="h-5 w-5" />, gradient: "from-primary/15 to-primary/5", color: "text-primary" },
            { label: "Total Expenses", value: formatAmount(totalExpenses, { compact: true }), change: 8.2, positive: false, icon: <CreditCard className="h-5 w-5" />, gradient: "from-destructive/15 to-destructive/5", color: "text-destructive" },
            { label: "Net Profit (EBITDA)", value: formatAmount(netProfit, { compact: true }), change: 18.3, positive: true, icon: <PiggyBank className="h-5 w-5" />, gradient: "from-[hsl(160,84%,39%)]/15 to-[hsl(160,84%,39%)]/5", color: "text-success" },
            { label: "Profit Margin", value: `${profitMargin}%`, change: 3.1, positive: true, icon: <TrendingUp className="h-5 w-5" />, gradient: "from-[hsl(38,92%,50%)]/15 to-[hsl(38,92%,50%)]/5", color: "text-warning" },
          ].map((stat, i) => (
            <div key={stat.label} className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </div>
                <span className={cn("inline-flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-xs font-semibold", stat.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                  {stat.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.change}%
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-card-foreground tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs for Financial Statements */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="receivables">AR / AP</TabsTrigger>
            <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-card-foreground">Financial Overview</h3>
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button onClick={() => setChartTab("revenue")} className={cn("px-3 py-1.5 text-xs font-medium transition-colors", chartTab === "revenue" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>Revenue vs Expenses</button>
                    <button onClick={() => setChartTab("cashflow")} className={cn("px-3 py-1.5 text-xs font-medium transition-colors", chartTab === "cashflow" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>Cash Flow</button>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartTab === "revenue" ? (
                      <BarChart data={revenueExpenseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${currency.symbol}${v / 1000}K`} />
                        <Tooltip formatter={(value: number) => [formatShort(value), ""]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue" />
                        <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} opacity={0.7} name="Expenses" />
                      </BarChart>
                    ) : (
                      <AreaChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${currency.symbol}${v / 1000}K`} />
                        <Tooltip formatter={(value: number) => [formatShort(value), ""]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="inflow" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} name="Inflow" />
                        <Area type="monotone" dataKey="outflow" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} name="Outflow" />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Expense Breakdown (COGS + OpEx)</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, ""]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {expenseBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground text-xs">{item.name}</span>
                      </div>
                      <span className="font-medium text-card-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions (Journal Entries) */}
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-lg font-semibold text-card-foreground">General Ledger â€” Recent Entries</h3>
                <Button variant="outline" size="sm" className="gap-1.5"><Receipt className="h-3.5 w-3.5" /> Export</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Journal Entry</th>
                      <th className="hidden px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Account</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                      <th className="hidden px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="transition-colors hover:bg-accent/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-card-foreground">{txn.description}</p>
                            <p className="text-xs text-muted-foreground">{txn.id}</p>
                          </div>
                        </td>
                        <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-muted-foreground md:table-cell">{txn.category}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Badge className={cn("text-xs", txn.type === "income" ? "bg-success/10 text-success border-transparent" : "bg-destructive/10 text-destructive border-transparent")}>
                            {txn.type === "income" ? "Debit (Dr)" : "Credit (Cr)"}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={cn("text-sm font-semibold", txn.type === "income" ? "text-success" : "text-destructive")}>
                            {txn.type === "income" ? "+" : "-"}{formatShort(txn.amount)}
                          </span>
                        </td>
                        <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-muted-foreground lg:table-cell">{txn.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Profit & Loss Tab */}
          <TabsContent value="pnl" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Income Statement (Profit & Loss) â€” IFRS</CardTitle>
                <p className="text-xs text-muted-foreground">For the fiscal year ending December 31, 2026</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">Line Item</TableHead>
                      <TableHead className="text-right">Amount ({currency.code})</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitLossData.map((row, i) => (
                      <TableRow key={i} className={cn(
                        row.type === "subtotal" && "bg-muted/30 font-semibold",
                        row.type === "net" && "bg-primary/5 font-bold text-lg"
                      )}>
                        <TableCell className={cn(
                          row.type === "subtotal" && "font-semibold",
                          row.type === "net" && "font-bold",
                          (row.type === "expense" || row.type === "cogs" || row.type === "tax") && "pl-8"
                        )}>{row.label}</TableCell>
                        <TableCell className={cn(
                          "text-right tabular-nums",
                          row.amount < 0 ? "text-destructive" : "text-foreground",
                          row.type === "net" && "text-primary font-bold"
                        )}>
                          {row.amount < 0 ? `(${formatShort(Math.abs(row.amount))})` : formatShort(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Sheet Tab */}
          <TabsContent value="balance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> Statement of Financial Position (Balance Sheet) â€” IFRS</CardTitle>
                <p className="text-xs text-muted-foreground">As of February 19, 2026</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assets */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Assets</h4>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 pl-2">Current Assets</p>
                  <Table>
                    <TableBody>
                      {balanceSheet.assets.current.map((a) => (
                        <TableRow key={a.account}>
                          <TableCell className="pl-6">{a.account}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatShort(a.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/20 font-semibold">
                        <TableCell className="pl-4">Total Current Assets</TableCell>
                        <TableCell className="text-right tabular-nums">{formatShort(totalCurrentAssets)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 pl-2 mt-3">Non-Current Assets</p>
                  <Table>
                    <TableBody>
                      {balanceSheet.assets.nonCurrent.map((a) => (
                        <TableRow key={a.account}>
                          <TableCell className="pl-6">{a.account}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatShort(a.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/20 font-semibold">
                        <TableCell className="pl-4">Total Non-Current Assets</TableCell>
                        <TableCell className="text-right tabular-nums">{formatShort(totalNonCurrentAssets)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="mt-2 p-3 rounded-lg bg-primary/5 flex justify-between font-bold">
                    <span>Total Assets</span>
                    <span className="tabular-nums">{formatShort(totalAssets)}</span>
                  </div>
                </div>

                {/* Liabilities */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Liabilities</h4>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 pl-2">Current Liabilities</p>
                  <Table>
                    <TableBody>
                      {balanceSheet.liabilities.current.map((a) => (
                        <TableRow key={a.account}>
                          <TableCell className="pl-6">{a.account}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatShort(a.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/20 font-semibold">
                        <TableCell className="pl-4">Total Current Liabilities</TableCell>
                        <TableCell className="text-right tabular-nums">{formatShort(totalCurrentLiabilities)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 pl-2 mt-3">Non-Current Liabilities</p>
                  <Table>
                    <TableBody>
                      {balanceSheet.liabilities.nonCurrent.map((a) => (
                        <TableRow key={a.account}>
                          <TableCell className="pl-6">{a.account}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatShort(a.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/20 font-semibold">
                        <TableCell className="pl-4">Total Non-Current Liabilities</TableCell>
                        <TableCell className="text-right tabular-nums">{formatShort(totalNonCurrentLiabilities)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Equity */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Shareholders' Equity</h4>
                  <Table>
                    <TableBody>
                      {balanceSheet.equity.map((a) => (
                        <TableRow key={a.account}>
                          <TableCell className="pl-6">{a.account}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatShort(a.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/20 font-semibold">
                        <TableCell className="pl-4">Total Equity</TableCell>
                        <TableCell className="text-right tabular-nums">{formatShort(totalEquity)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="mt-2 p-3 rounded-lg bg-primary/5 flex justify-between font-bold">
                    <span>Total Liabilities + Equity</span>
                    <span className="tabular-nums">{formatShort(totalLiabilities + totalEquity)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AR / AP Tab */}
          <TabsContent value="receivables" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Accounts Receivable Aging</CardTitle>
                  <p className="text-xs text-muted-foreground">Outstanding customer invoices</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Invoices</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {arAging.map((row) => (
                        <TableRow key={row.period}>
                          <TableCell>{row.period}</TableCell>
                          <TableCell className="text-right">{row.count}</TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">{formatShort(row.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/30 font-bold">
                        <TableCell>Total AR</TableCell>
                        <TableCell className="text-right">{arAging.reduce((s, r) => s + r.count, 0)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatShort(arAging.reduce((s, r) => s + r.amount, 0))}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Accounts Payable Aging</CardTitle>
                  <p className="text-xs text-muted-foreground">Outstanding vendor bills</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Bills</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apAging.map((row) => (
                        <TableRow key={row.period}>
                          <TableCell>{row.period}</TableCell>
                          <TableCell className="text-right">{row.count}</TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">{formatShort(row.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/30 font-bold">
                        <TableCell>Total AP</TableCell>
                        <TableCell className="text-right">{apAging.reduce((s, r) => s + r.count, 0)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatShort(apAging.reduce((s, r) => s + r.amount, 0))}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Ratios Tab */}
          <TabsContent value="ratios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Key Financial Ratios (IFRS)</CardTitle>
                <p className="text-xs text-muted-foreground">Industry-standard performance metrics</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {financialRatios.map((ratio) => (
                    <div key={ratio.name} className="rounded-xl border border-border p-4 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">{ratio.name}</p>
                      <p className="text-2xl font-bold text-foreground">{ratio.value}</p>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">
                          Benchmark: {ratio.benchmark}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinancePage;

