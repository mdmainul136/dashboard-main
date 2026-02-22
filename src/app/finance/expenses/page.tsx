"use client";

import { useMemo, useSyncExternalStore, useState, useCallback } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingDown, CreditCard, Plus, Receipt, Target, Settings2, AlertTriangle, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { getExpenses, subscribeExpenses, addExpense, updateExpense, expenseCategories, type Expense } from "@/data/expenses";

const defaultBudgets: Record<string, number> = {
  rent: 250000, utilities: 30000, salaries: 500000, marketing: 50000, supplies: 20000, logistics: 40000, other: 15000,
};

const Expenses = () => {
  const expenses = useSyncExternalStore(subscribeExpenses, getExpenses, getExpenses);
  const { formatShort, currency } = useCurrency();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [budgets, setBudgets] = useState<Record<string, number>>(defaultBudgets);

  const stats = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const paid = expenses.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0);
    const pending = expenses.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);
    return { total, paid, pending, count: expenses.length };
  }, [expenses]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => { map.set(e.category, (map.get(e.category) || 0) + e.amount); });
    return expenseCategories.map((c) => ({ name: c.label, value: map.get(c.value) || 0, color: c.color })).filter((d) => d.value > 0);
  }, [expenses]);

  const totalBudget = useMemo(() => Object.values(budgets).reduce((s, v) => s + v, 0), [budgets]);
  const budgetUsedPct = useMemo(() => totalBudget > 0 ? Math.min((stats.total / totalBudget) * 100, 100) : 0, [stats.total, totalBudget]);

  const budgetComparisonData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => { map.set(e.category, (map.get(e.category) || 0) + e.amount); });
    return expenseCategories.map((c) => ({
      name: c.label,
      budget: budgets[c.value] || 0,
      actual: map.get(c.value) || 0,
    })).filter((d) => d.budget > 0 || d.actual > 0);
  }, [expenses, budgets]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return expenses;
    return expenses.filter((e) => e.status === statusFilter);
  }, [expenses, statusFilter]);

  const [form, setForm] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().slice(0, 10), category: "other", description: "", amount: 0, paymentMethod: "cash", status: "pending", branch: "BR-001",
  });

  const handleAdd = () => {
    addExpense(form);
    setForm({ date: new Date().toISOString().slice(0, 10), category: "other", description: "", amount: 0, paymentMethod: "cash", status: "pending", branch: "BR-001" });
    setDialogOpen(false);
  };

  const statusColor = (s: string) => s === "paid" ? "default" : s === "approved" ? "secondary" : "outline";

  const exportCSV = () => {
    const header = "ID,Date,Description,Category,Amount,Payment Method,Status,Branch";
    const rows = expenses.map((e) => `${e.id},${e.date},"${e.description}",${e.category},${e.amount},${e.paymentMethod},${e.status},${e.branch}`);
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Expense Tracker</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage business expenses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
            <Button variant="outline" onClick={() => setBudgetDialogOpen(true)}><Settings2 className="mr-2 h-4 w-4" />Set Budget</Button>
            <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-3"><DollarSign className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold">{formatShort(stats.total)}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-emerald-500/10 p-3"><CreditCard className="h-5 w-5 text-emerald-500" /></div><div><p className="text-sm text-muted-foreground">Paid</p><p className="text-2xl font-bold">{formatShort(stats.paid)}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-amber-500/10 p-3"><TrendingDown className="h-5 w-5 text-amber-500" /></div><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold">{formatShort(stats.pending)}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-violet-500/10 p-3"><Receipt className="h-5 w-5 text-violet-500" /></div><div><p className="text-sm text-muted-foreground">Total Entries</p><p className="text-2xl font-bold">{stats.count}</p></div></div></CardContent></Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-3 ${budgetUsedPct > 90 ? "bg-destructive/10" : budgetUsedPct > 70 ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
                  <Target className={`h-5 w-5 ${budgetUsedPct > 90 ? "text-destructive" : budgetUsedPct > 70 ? "text-amber-500" : "text-emerald-500"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                  <p className="text-2xl font-bold">{budgetUsedPct.toFixed(0)}%</p>
                  <Progress value={budgetUsedPct} className="mt-1 h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatShort(stats.total)} / {formatShort(totalBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget vs Actual Comparison */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" /> Budget vs Actual Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={budgetComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                 <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${currency.symbol}${(v / 1000).toFixed(0)}k`} />
                 <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => formatShort(v)} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="hsl(var(--muted-foreground))" opacity={0.35} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {budgetComparisonData.map((d) => {
                const pct = d.budget > 0 ? (d.actual / d.budget) * 100 : 0;
                const over = pct > 100;
                return (
                  <div key={d.name} className="rounded-lg border p-2.5 text-center">
                    <p className="text-xs text-muted-foreground">{d.name}</p>
                    <p className={`text-sm font-bold ${over ? "text-destructive" : "text-foreground"}`}>
                      {pct.toFixed(0)}%
                      {over && <AlertTriangle className="inline ml-1 h-3 w-3" />}
                    </p>
                    <Progress value={Math.min(pct, 100)} className="mt-1 h-1" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 rounded-2xl border-border/60 shadow-sm">
            <CardHeader><CardTitle>Expense by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader><CardTitle>Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                    {categoryData.map((d, i) => (<Cell key={i} fill={d.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {categoryData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />{d.name}</div>
                    <span className="text-muted-foreground">à§³{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Expenses</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground">{e.date}</TableCell>
                    <TableCell className="font-medium">{e.description}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{e.category}</Badge></TableCell>
                    <TableCell className="font-semibold">{formatShort(e.amount)}</TableCell>
                    <TableCell className="capitalize">{e.paymentMethod}</TableCell>
                    <TableCell><Badge variant={statusColor(e.status)}>{e.status}</Badge></TableCell>
                    <TableCell>
                      {e.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => updateExpense(e.id, { status: "approved" })}>Approve</Button>
                      )}
                      {e.status === "approved" && (
                        <Button size="sm" variant="outline" onClick={() => updateExpense(e.id, { status: "paid" })}>Mark Paid</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as any })}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Amount" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
              <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button onClick={handleAdd}>Add Expense</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Budget Settings Dialog */}
        <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Set Monthly Budget</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {expenseCategories.map((c) => (
                <div key={c.value} className="flex items-center gap-3">
                  <label className="w-24 text-sm font-medium text-foreground">{c.label}</label>
                  <Input
                    type="number"
                    value={budgets[c.value] || ""}
                    onChange={(e) => setBudgets({ ...budgets, [c.value]: Number(e.target.value) })}
                    className="flex-1"
                  />
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-semibold text-foreground">Total Budget</span>
                <span className="text-lg font-bold text-primary">{formatShort(Object.values(budgets).reduce((s, v) => s + v, 0))}</span>
              </div>
            </div>
            <DialogFooter><Button onClick={() => setBudgetDialogOpen(false)}>Save Budget</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;

