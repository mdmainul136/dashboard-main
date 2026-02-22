"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencies, taxConfigs, convertCurrency } from "@/data/currencies";
import { DollarSign, Globe, Percent } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

const TaxCurrency = () => {
  const { formatShort } = useCurrency();
  const [amount, setAmount] = useState(1000);
  const [fromCur, setFromCur] = useState("SAR");
  const [toCur, setToCur] = useState("USD");

  const converted = convertCurrency(amount, fromCur, toCur);
  const toCurrency = currencies.find(c => c.code === toCur);

  const taxCollected = 12450;
  const activeCurrencies = currencies.length;
  const vatRate = taxConfigs.find(t => t.type === "VAT" && t.active)?.rate ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Multi-currency & Tax</h1>
          <p className="text-muted-foreground">Currency conversion and tax configuration</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-green-500/10 p-3"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Tax Collected (MTD)</p><p className="text-2xl font-bold">{formatShort(taxCollected)}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-primary/10 p-3"><Globe className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Active Currencies</p><p className="text-2xl font-bold">{activeCurrencies}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6"><div className="rounded-lg bg-amber-500/10 p-3"><Percent className="h-5 w-5 text-amber-600" /></div><div><p className="text-sm text-muted-foreground">Standard VAT</p><p className="text-2xl font-bold">{vatRate}%</p></div></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Currency Converter */}
          <Card>
            <CardHeader><CardTitle>Currency Converter</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Amount</Label><Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} /></div>
                <div><Label>From</Label><Select value={fromCur} onValueChange={setFromCur}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div><Label>To</Label><Select value={toCur} onValueChange={setToCur}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Converted Amount</p>
                <p className="text-3xl font-bold text-foreground">{toCurrency?.symbol}{converted.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tax Config */}
          <Card>
            <CardHeader><CardTitle>Tax Configuration</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Tax Name</TableHead><TableHead>Category</TableHead><TableHead>Rate</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {taxConfigs.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell>{t.rate}%</TableCell>
                      <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                      <TableCell><Badge variant={t.active ? "default" : "secondary"}>{t.active ? "Active" : "Inactive"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaxCurrency;

