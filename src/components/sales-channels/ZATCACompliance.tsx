import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  FileText, CheckCircle2, AlertCircle, DollarSign, TrendingUp, QrCode, Clock, Eye
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  customer: string;
  amount: number;
  vat: number;
  total: number;
  status: "compliant" | "pending" | "rejected";
  qrGenerated: boolean;
}

const initialInvoices: EInvoice[] = [
  { id: "inv1", invoiceNo: "ZATCA-2026-001", date: "2026-02-19", customer: "Ahmed Ali Trading", amount: 5000, vat: 750, total: 5750, status: "compliant", qrGenerated: true },
  { id: "inv2", invoiceNo: "ZATCA-2026-002", date: "2026-02-18", customer: "Sara Fashion LLC", amount: 3200, vat: 480, total: 3680, status: "compliant", qrGenerated: true },
  { id: "inv3", invoiceNo: "ZATCA-2026-003", date: "2026-02-17", customer: "Khalid Home Decor", amount: 8900, vat: 1335, total: 10235, status: "pending", qrGenerated: false },
  { id: "inv4", invoiceNo: "ZATCA-2026-004", date: "2026-02-16", customer: "Noor Beauty Shop", amount: 1500, vat: 225, total: 1725, status: "compliant", qrGenerated: true },
  { id: "inv5", invoiceNo: "ZATCA-2026-005", date: "2026-02-15", customer: "Omar Sports Co.", amount: 4200, vat: 630, total: 4830, status: "rejected", qrGenerated: false },
  { id: "inv6", invoiceNo: "ZATCA-2026-006", date: "2026-02-14", customer: "Tech Solutions SAR", amount: 12000, vat: 1800, total: 13800, status: "compliant", qrGenerated: true },
];

interface TaxRule {
  id: string;
  region: string;
  vatRate: number;
  enabled: boolean;
}

const initialTaxRules: TaxRule[] = [
  { id: "t1", region: "Riyadh", vatRate: 15, enabled: true },
  { id: "t2", region: "Jeddah", vatRate: 15, enabled: true },
  { id: "t3", region: "Dammam", vatRate: 15, enabled: true },
  { id: "t4", region: "Makkah", vatRate: 15, enabled: false },
  { id: "t5", region: "Madinah", vatRate: 15, enabled: true },
];

const ZATCACompliance = () => {
  const [invoices] = useState(initialInvoices);
  const [taxRules, setTaxRules] = useState(initialTaxRules);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<EInvoice | null>(null);

  const compliantCount = invoices.filter(i => i.status === "compliant").length;
  const totalVAT = invoices.reduce((s, i) => s + i.vat, 0);
  const totalSales = invoices.reduce((s, i) => s + i.amount, 0);
  const complianceRate = ((compliantCount / invoices.length) * 100).toFixed(0);
  const pendingCount = invoices.filter(i => i.status === "pending").length;

  const statusBadge = (status: EInvoice["status"]) => {
    if (status === "compliant") return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Compliant</Badge>;
    if (status === "pending") return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><AlertCircle className="h-3 w-3" /> Rejected</Badge>;
  };

  const toggleTaxRule = (id: string) => {
    setTaxRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({ title: "Updated", description: "Tax rule status changed" });
  };

  const openPreview = (inv: EInvoice) => {
    setSelectedInvoice(inv);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Invoices</p><p className="text-2xl font-bold text-foreground">{invoices.length}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">VAT Collected</p><p className="text-2xl font-bold text-foreground">SAR {totalVAT.toLocaleString()}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><DollarSign className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Compliance Rate</p><p className="text-2xl font-bold text-foreground">{complianceRate}%</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><CheckCircle2 className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Pending Submissions</p><p className="text-2xl font-bold text-foreground">{pendingCount}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><Clock className="h-5 w-5 text-warning" /></div>
          </div>
        </CardContent></Card>
      </div>

      {/* VAT Report Summary */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-3">VAT Report Summary</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Sales (excl. VAT)</p>
              <p className="text-xl font-bold text-foreground mt-1">SAR {totalSales.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">VAT Collected (15%)</p>
              <p className="text-xl font-bold text-success mt-1">SAR {totalVAT.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">VAT Payable</p>
              <p className="text-xl font-bold text-warning mt-1">SAR {(totalVAT * 0.85).toFixed(0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E-Invoice Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Invoice #</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">VAT</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">QR</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{inv.invoiceNo}</td>
                  <td className="p-4 text-muted-foreground">{inv.date}</td>
                  <td className="p-4 text-foreground">{inv.customer}</td>
                  <td className="p-4 font-mono text-foreground">SAR {inv.amount.toLocaleString()}</td>
                  <td className="p-4 font-mono text-foreground">SAR {inv.vat}</td>
                  <td className="p-4">{statusBadge(inv.status)}</td>
                  <td className="p-4">
                    {inv.qrGenerated ? <QrCode className="h-4 w-4 text-success" /> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="p-4">
                    <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs" onClick={() => openPreview(inv)}>
                      <Eye className="h-3 w-3" /> Preview
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Region-based Tax Rules */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-3">Region-based Tax Rules</h3>
          <div className="space-y-3">
            {taxRules.map(r => (
              <div key={r.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div>
                  <p className="font-medium text-foreground text-sm">{r.region}</p>
                  <p className="text-xs text-muted-foreground">VAT Rate: {r.vatRate}%</p>
                </div>
                <Switch checked={r.enabled} onCheckedChange={() => toggleTaxRule(r.id)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Arabic Invoice Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Invoice Preview</DialogTitle>
            <DialogDescription>ZATCA-compliant Arabic invoice format</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 py-2" dir="rtl">
              <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/20">
                <div className="text-center border-b border-border pb-3">
                  <p className="text-lg font-bold text-foreground">فاتورة ضريبية</p>
                  <p className="text-xs text-muted-foreground">Tax Invoice</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">رقم الفاتورة:</span> <span className="font-medium text-foreground">{selectedInvoice.invoiceNo}</span></div>
                  <div><span className="text-muted-foreground">التاريخ:</span> <span className="font-medium text-foreground">{selectedInvoice.date}</span></div>
                  <div><span className="text-muted-foreground">العميل:</span> <span className="font-medium text-foreground">{selectedInvoice.customer}</span></div>
                  <div><span className="text-muted-foreground">الحالة:</span> {statusBadge(selectedInvoice.status)}</div>
                </div>
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">المبلغ قبل الضريبة</span><span className="font-mono text-foreground">SAR {selectedInvoice.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span><span className="font-mono text-foreground">SAR {selectedInvoice.vat}</span></div>
                  <div className="flex justify-between font-bold border-t border-border pt-2"><span className="text-foreground">الإجمالي</span><span className="font-mono text-foreground">SAR {selectedInvoice.total.toLocaleString()}</span></div>
                </div>
                {selectedInvoice.qrGenerated && (
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center gap-2 rounded bg-muted p-2">
                      <QrCode className="h-8 w-8 text-foreground" />
                      <span className="text-[10px] text-muted-foreground">ZATCA QR Code</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZATCACompliance;
