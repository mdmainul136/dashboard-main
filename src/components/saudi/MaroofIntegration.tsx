import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import { ShieldCheck, ExternalLink, CheckCircle2, AlertTriangle, RefreshCw, Star } from "lucide-react";

const MaroofIntegration = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [maroofId, setMaroofId] = useState("700123456");
  const [isConnected, setIsConnected] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [showBadge, setShowBadge] = useState(true);

  const stats = {
    rating: 4.8,
    reviews: 142,
    verified: true,
    lastSync: "2026-02-19 10:30",
    status: "active" as const,
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {isAr ? "منصة معروف" : "Maroof Platform"}
                </CardTitle>
                <CardDescription>
                  {isAr
                    ? "تحقق من متجرك عبر منصة معروف التابعة لوزارة التجارة"
                    : "Verify your store via Ministry of Commerce's Maroof platform"}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-600" : ""}>
              {isConnected
                ? isAr ? "متصل ✓" : "Connected ✓"
                : isAr ? "غير متصل" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                <Star className="h-5 w-5 fill-yellow-500" />
                {stats.rating}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? "التقييم" : "Rating"}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.reviews}</p>
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? "المراجعات" : "Reviews"}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
              <CheckCircle2 className="mx-auto h-7 w-7 text-green-500" />
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? "موثق" : "Verified"}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
              <p className="text-sm font-medium text-foreground">{stats.lastSync}</p>
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? "آخر مزامنة" : "Last Sync"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isAr ? "إعدادات الربط" : "Connection Settings"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{isAr ? "رقم معروف (Maroof ID)" : "Maroof ID"}</Label>
              <Input value={maroofId} onChange={(e) => setMaroofId(e.target.value)} placeholder="700XXXXXX" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <p className="text-sm font-medium">{isAr ? "مزامنة تلقائية" : "Auto Sync"}</p>
                <p className="text-xs text-muted-foreground">
                  {isAr ? "مزامنة بيانات المتجر مع معروف تلقائياً" : "Automatically sync store data with Maroof"}
                </p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <p className="text-sm font-medium">{isAr ? "عرض شارة معروف" : "Show Maroof Badge"}</p>
                <p className="text-xs text-muted-foreground">
                  {isAr ? "عرض شارة التحقق في واجهة المتجر" : "Display verification badge on storefront"}
                </p>
              </div>
              <Switch checked={showBadge} onCheckedChange={setShowBadge} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                {isAr ? "مزامنة الآن" : "Sync Now"}
              </Button>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                {isAr ? "فتح معروف" : "Open Maroof"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isAr ? "قائمة الامتثال" : "Compliance Checklist"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: isAr ? "السجل التجاري" : "Commercial Registration (CR)", done: true },
                { label: isAr ? "الرقم الضريبي (VAT)" : "VAT Number", done: true },
                { label: isAr ? "سياسة الإرجاع" : "Return Policy", done: true },
                { label: isAr ? "سياسة الخصوصية" : "Privacy Policy", done: true },
                { label: isAr ? "معلومات التواصل" : "Contact Information", done: true },
                { label: isAr ? "عنوان المتجر" : "Store Address", done: false },
                { label: isAr ? "شهادة SSL" : "SSL Certificate", done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/30 p-3">
                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
                  )}
                  <span className={`text-sm ${item.done ? "text-foreground" : "text-yellow-600 font-medium"}`}>
                    {item.label}
                  </span>
                  <Badge variant={item.done ? "default" : "outline"} className={`ms-auto text-[10px] ${item.done ? "bg-green-600" : "text-yellow-600 border-yellow-500"}`}>
                    {item.done ? (isAr ? "مكتمل" : "Done") : (isAr ? "مطلوب" : "Required")}
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

export default MaroofIntegration;
