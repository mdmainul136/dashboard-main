import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { ShoppingBag, Clock, CheckCircle2, Package, XCircle } from "lucide-react";

const LiveOrderFeed = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const orders = [
    { id: "#ORD-1042", customer: isAr ? "أحمد الغامدي" : "Ahmed Al-Ghamdi", total: 385, status: "new", time: isAr ? "منذ 2 دقيقة" : "2 min ago", items: 3 },
    { id: "#ORD-1041", customer: isAr ? "نورة العتيبي" : "Noura Al-Otaibi", total: 1250, status: "processing", time: isAr ? "منذ 15 دقيقة" : "15 min ago", items: 5 },
    { id: "#ORD-1040", customer: isAr ? "فهد الشمري" : "Fahd Al-Shammari", total: 720, status: "shipped", time: isAr ? "منذ 45 دقيقة" : "45 min ago", items: 2 },
    { id: "#ORD-1039", customer: isAr ? "سارة المالكي" : "Sara Al-Maliki", total: 95, status: "delivered", time: isAr ? "منذ ساعة" : "1 hour ago", items: 1 },
    { id: "#ORD-1038", customer: isAr ? "عبدالله القحطاني" : "Abdullah Al-Qahtani", total: 2100, status: "new", time: isAr ? "منذ ساعتين" : "2 hours ago", items: 7 },
    { id: "#ORD-1037", customer: isAr ? "ريم الدوسري" : "Reem Al-Dosari", total: 450, status: "cancelled", time: isAr ? "منذ 3 ساعات" : "3 hours ago", items: 2 },
  ];

  const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: { en: string; ar: string } }> = {
    new: { icon: <ShoppingBag className="h-3.5 w-3.5" />, color: "bg-blue-500/10 text-blue-600 border-blue-500/30", label: { en: "New", ar: "جديد" } },
    processing: { icon: <Clock className="h-3.5 w-3.5" />, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", label: { en: "Processing", ar: "قيد المعالجة" } },
    shipped: { icon: <Package className="h-3.5 w-3.5" />, color: "bg-purple-500/10 text-purple-600 border-purple-500/30", label: { en: "Shipped", ar: "تم الشحن" } },
    delivered: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "bg-green-500/10 text-green-600 border-green-500/30", label: { en: "Delivered", ar: "تم التسليم" } },
    cancelled: { icon: <XCircle className="h-3.5 w-3.5" />, color: "bg-red-500/10 text-red-600 border-red-500/30", label: { en: "Cancelled", ar: "ملغي" } },
  };

  const newOrdersCount = orders.filter((o) => o.status === "new").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{isAr ? "آخر الطلبات" : "Live Orders"}</CardTitle>
          </div>
          {newOrdersCount > 0 && (
            <Badge className="animate-pulse bg-blue-600 text-[10px]">
              {newOrdersCount} {isAr ? "جديد" : "new"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {orders.map((order) => {
            const cfg = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className={`flex items-center gap-3 rounded-lg border border-border/30 p-3 transition-colors hover:bg-muted/30 ${
                  order.status === "new" ? "border-blue-500/30 bg-blue-500/5" : ""
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{order.id}</span>
                    <Badge variant="outline" className={`text-[10px] ${cfg.color}`}>
                      {cfg.label[lang]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.customer} · {order.items} {isAr ? "منتج" : "items"}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold">{order.total.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">SAR</span></p>
                  <p className="text-[10px] text-muted-foreground">{order.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveOrderFeed;
