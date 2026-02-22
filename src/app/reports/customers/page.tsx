"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, UserPlus, Crown, TrendingUp } from "lucide-react";

const clvData = [
  { name: "Jan", clv: 1200 }, { name: "Feb", clv: 1800 },
  { name: "Mar", clv: 1500 }, { name: "Apr", clv: 2200 },
  { name: "May", clv: 1900 }, { name: "Jun", clv: 2600 },
];

const customerTypeData = [
  { name: "New", value: 42, fill: "hsl(var(--primary))" },
  { name: "Returning", value: 58, fill: "hsl(var(--chart-2))" },
];

const topCustomers = [
  { name: "à¦†à¦¹à¦®à§‡à¦¦ à¦¹à¦¾à¦¸à¦¾à¦¨", orders: 24, spent: 12450, lastOrder: "2026-02-15" },
  { name: "à¦«à¦¾à¦¤à¦¿à¦®à¦¾ à¦–à¦¾à¦¨", orders: 18, spent: 9800, lastOrder: "2026-02-17" },
  { name: "à¦°à¦¾à¦¹à§à¦² à¦¸à§‡à¦¨", orders: 15, spent: 7600, lastOrder: "2026-02-19" },
  { name: "à¦¨à¦¾à¦¦à¦¿à¦¯à¦¼à¦¾ à¦†à¦•à§à¦¤à¦¾à¦°", orders: 12, spent: 6200, lastOrder: "2026-02-10" },
  { name: "à¦•à¦°à¦¿à¦® à¦‰à¦¦à§à¦¦à¦¿à¦¨", orders: 10, spent: 5100, lastOrder: "2026-02-08" },
];

const CustomerInsights = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Insights</h1>
          <p className="text-muted-foreground">Understand your customer base</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-primary/10 p-3"><Users className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Customers</p><p className="text-2xl font-bold">248</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-green-500/10 p-3"><UserPlus className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">New (MTD)</p><p className="text-2xl font-bold">32</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-amber-500/10 p-3"><Crown className="h-5 w-5 text-amber-600" /></div><div><p className="text-sm text-muted-foreground">Avg CLV</p><p className="text-2xl font-bold">à§³1,850</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-blue-500/10 p-3"><TrendingUp className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-muted-foreground">Retention Rate</p><p className="text-2xl font-bold">72%</p></div></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Customer Lifetime Value Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clvData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="clv" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>New vs Returning</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart><Pie data={customerTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{customerTypeData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Top Customers by Spend</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Customer</TableHead><TableHead>Orders</TableHead><TableHead>Total Spent</TableHead><TableHead>Last Order</TableHead></TableRow></TableHeader>
              <TableBody>{topCustomers.map((c, i) => <TableRow key={c.name}><TableCell>{i + 1}</TableCell><TableCell className="font-medium">{c.name}</TableCell><TableCell>{c.orders}</TableCell><TableCell>à§³{c.spent.toLocaleString()}</TableCell><TableCell>{c.lastOrder}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerInsights;

