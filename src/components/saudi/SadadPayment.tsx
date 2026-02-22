import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { Banknote, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";

const SadadPayment = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [billerId, setBillerId] = useState("SA-BIL-00456");
  const [autoReconcile, setAutoReconcile] = useState(true);
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  const stats = {
    totalReceived: 284500,
    pending: 12300,
    todayCount: 18,
    successRate: 97.8,
  };

  const transactions = [
    { id: "SAD-20260219-001", amount: 1250, customer: isAr ? "أحمد محمد" : "Ahmed Mohammed", status: "completed", time: "10:45 AM" },
    { id: "SAD-20260219-002", amount: 3400, customer: isAr ? "سارة عبدالله" : "Sara Abdullah", status: "completed", time: "09:30 AM" },
    { id: "SAD-20260219-003", amount: 890, customer: isAr ? "خالد العمري" : "Khalid Al-Omari", status: "pending", time: "09:15 AM" },
    { id: "SAD-20260219-004", amount: 5600, customer: isAr ? "نورة الحربي" : "Noura Al-Harbi", status: "completed", time: "08:50 AM" },
    { id: "SAD-20260219-005", amount: 2100, customer: isAr ? "فهد السالم" : "Fahd Al-Salem", status: "failed", time: "08:20 AM" },
  ];

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      completed: { en: "Completed", ar: "مكتمل" },
      pending: { en: "Pending", ar: "معلق" },
      failed: { en: "Failed", ar: "فشل" },
    };
    return labels[status]?.[lang] || status;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <ArrowDownRight className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalReceived.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">SAR</span></p>
                <p className="text-xs text-muted-foreground">{isAr ? "إجمالي المستلم" : "Total Received"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">SAR</span></p>
                <p className="text-xs text-muted-foreground">{isAr ? "معلق" : "Pending"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "معاملات اليوم" : "Today's Transactions"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
                <p className="text-xs text-muted-foreground">{isAr ? "نسبة النجاح" : "Success Rate"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Banknote className="h-5 w-5" />
              {isAr ? "إعدادات سداد" : "Sadad Settings"}
            </CardTitle>
            <CardDescription>
              {isAr ? "ربط نظام الدفع عبر سداد" : "Configure Sadad billing payment system"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{isAr ? "رقم المفوتر" : "Biller ID"}</Label>
              <Input value={billerId} onChange={(e) => setBillerId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{isAr ? "نوع الفاتورة الافتراضي" : "Default Invoice Type"}</Label>
              <Select defaultValue="one-time">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">{isAr ? "لمرة واحدة" : "One-time"}</SelectItem>
                  <SelectItem value="recurring">{isAr ? "متكررة" : "Recurring"}</SelectItem>
                  <SelectItem value="installment">{isAr ? "أقساط" : "Installment"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <p className="text-sm font-medium">{isAr ? "تسوية تلقائية" : "Auto Reconcile"}</p>
              </div>
              <Switch checked={autoReconcile} onCheckedChange={setAutoReconcile} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <p className="text-sm font-medium">{isAr ? "إشعار العميل" : "Notify Customer"}</p>
              </div>
              <Switch checked={notifyCustomer} onCheckedChange={setNotifyCustomer} />
            </div>
            <Button className="w-full">{isAr ? "حفظ الإعدادات" : "Save Settings"}</Button>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{isAr ? "آخر المعاملات" : "Recent Transactions"}</CardTitle>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                {isAr ? "فلترة" : "Filter"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 rounded-lg border border-border/30 p-3 transition-colors hover:bg-muted/30">
                  {statusIcon(tx.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.customer}</p>
                    <p className="text-xs text-muted-foreground">{tx.id}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-bold">{tx.amount.toLocaleString()} SAR</p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${
                    tx.status === "completed" ? "border-green-500 text-green-600" :
                    tx.status === "pending" ? "border-yellow-500 text-yellow-600" :
                    "border-red-500 text-red-600"
                  }`}>
                    {statusLabel(tx.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SadadPayment;
