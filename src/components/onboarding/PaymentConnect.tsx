import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Check, AlertCircle } from "lucide-react";

interface PaymentConnectProps {
  data: Record<string, boolean>;
  onToggle: (key: string) => void;
}

const gateways = [
  {
    id: "mada",
    name: "Mada",
    nameAr: "مدى",
    description: "Saudi debit card network — mandatory for local stores",
    icon: "🏧",
    recommended: true,
    fee: "1.75%",
  },
  {
    id: "stcPay",
    name: "STC Pay",
    nameAr: "إس تي سي باي",
    description: "Mobile wallet — most popular in Saudi Arabia",
    icon: "📱",
    recommended: true,
    fee: "2.0%",
  },
  {
    id: "visa",
    name: "Visa / Mastercard",
    nameAr: "فيزا / ماستركارد",
    description: "International credit & debit cards",
    icon: "💳",
    recommended: false,
    fee: "2.5%",
  },
  {
    id: "tabby",
    name: "Tabby",
    nameAr: "تابي",
    description: "Buy now, pay later — split into 4 interest-free payments",
    icon: "🛍️",
    recommended: true,
    fee: "5.0%",
  },
  {
    id: "tamara",
    name: "Tamara",
    nameAr: "تمارا",
    description: "BNPL — split into 3 payments, popular in GCC",
    icon: "💰",
    recommended: false,
    fee: "4.5%",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    nameAr: "الدفع عند الاستلام",
    description: "Collect payment when the order is delivered",
    icon: "🚚",
    recommended: false,
    fee: "SAR 5/order",
  },
  {
    id: "bankTransfer",
    name: "Bank Transfer",
    nameAr: "تحويل بنكي",
    description: "Direct bank transfer (Al Rajhi, SNB, etc.)",
    icon: "🏦",
    recommended: false,
    fee: "Free",
  },
];

const PaymentConnect = ({ data, onToggle }: PaymentConnectProps) => {
  const enabledCount = Object.values(data).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Connect Payment Methods</h2>
        <p className="text-muted-foreground mt-1">Enable at least one payment method to start selling</p>
      </div>

      {enabledCount === 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-800 p-3 max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">Please enable at least one payment method to continue</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {gateways.map((gw) => (
          <Card
            key={gw.id}
            className={`transition-all duration-200 cursor-pointer ${
              data[gw.id] ? "border-primary/30 shadow-sm bg-primary/[0.02]" : ""
            }`}
            onClick={() => onToggle(gw.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{gw.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm">{gw.name}</h4>
                      {gw.recommended && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[9px]">Recommended</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{gw.nameAr}</p>
                  </div>
                </div>
                <Switch checked={!!data[gw.id]} onCheckedChange={() => onToggle(gw.id)} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{gw.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-muted-foreground">Fee: {gw.fee}</span>
                {data[gw.id] && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentConnect;
