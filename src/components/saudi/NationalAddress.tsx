import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { MapPin, Building2, Navigation, Package, CheckCircle2, Plus, Pencil, Trash2 } from "lucide-react";

interface Address {
  id: string;
  label: string;
  shortAddress: string;
  buildingNo: string;
  street: string;
  district: string;
  city: string;
  zipCode: string;
  additionalNo: string;
  isPrimary: boolean;
}

const NationalAddress = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [autoFill, setAutoFill] = useState(true);
  const [requireNational, setRequireNational] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [addresses] = useState<Address[]>([
    {
      id: "1",
      label: isAr ? "المقر الرئيسي" : "Main Office",
      shortAddress: "RRRD2929",
      buildingNo: "2929",
      street: isAr ? "شارع الملك فهد" : "King Fahd Road",
      district: isAr ? "العليا" : "Olaya",
      city: isAr ? "الرياض" : "Riyadh",
      zipCode: "12211",
      additionalNo: "7450",
      isPrimary: true,
    },
    {
      id: "2",
      label: isAr ? "المستودع" : "Warehouse",
      shortAddress: "JJDH8834",
      buildingNo: "8834",
      street: isAr ? "شارع فلسطين" : "Palestine Street",
      district: isAr ? "الحمراء" : "Al Hamra",
      city: isAr ? "جدة" : "Jeddah",
      zipCode: "21462",
      additionalNo: "3120",
      isPrimary: false,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {isAr ? "العنوان الوطني (عنواني)" : "National Address (Alamat Watani)"}
                </CardTitle>
                <CardDescription>
                  {isAr
                    ? "إدارة العناوين الوطنية المعتمدة من البريد السعودي (سبل)"
                    : "Manage Saudi Post (SPL) verified national addresses"}
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              {isAr ? "إضافة عنوان" : "Add Address"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{addresses.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? "العناوين المسجلة" : "Registered Addresses"}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
              <CheckCircle2 className="mx-auto h-7 w-7 text-green-500" />
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? "موثق من سبل" : "SPL Verified"}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
              <Package className="mx-auto h-7 w-7 text-primary" />
              <p className="mt-1 text-xs text-muted-foreground">{isAr ? "جاهز للشحن" : "Shipping Ready"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Address Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isAr ? "إضافة عنوان وطني جديد" : "Add New National Address"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{isAr ? "العنوان المختصر" : "Short Address"}</Label>
                <Input placeholder="RRRD1234" />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "رقم المبنى" : "Building Number"}</Label>
                <Input placeholder="1234" />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "اسم الشارع" : "Street Name"}</Label>
                <Input placeholder={isAr ? "شارع الملك عبدالعزيز" : "King Abdulaziz Road"} />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "الحي" : "District"}</Label>
                <Input placeholder={isAr ? "العليا" : "Olaya"} />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "المدينة" : "City"}</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder={isAr ? "اختر المدينة" : "Select City"} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="riyadh">{isAr ? "الرياض" : "Riyadh"}</SelectItem>
                    <SelectItem value="jeddah">{isAr ? "جدة" : "Jeddah"}</SelectItem>
                    <SelectItem value="dammam">{isAr ? "الدمام" : "Dammam"}</SelectItem>
                    <SelectItem value="makkah">{isAr ? "مكة المكرمة" : "Makkah"}</SelectItem>
                    <SelectItem value="madinah">{isAr ? "المدينة المنورة" : "Madinah"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "الرمز البريدي" : "Zip Code"}</Label>
                <Input placeholder="12345" />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "الرقم الإضافي" : "Additional Number"}</Label>
                <Input placeholder="7890" />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "تسمية العنوان" : "Address Label"}</Label>
                <Input placeholder={isAr ? "المقر الرئيسي" : "Main Office"} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button>{isAr ? "حفظ العنوان" : "Save Address"}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{isAr ? "إلغاء" : "Cancel"}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((addr) => (
          <Card key={addr.id} className={addr.isPrimary ? "border-primary/40" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{addr.label}</h3>
                  {addr.isPrimary && (
                    <Badge className="bg-primary text-[10px]">{isAr ? "رئيسي" : "Primary"}</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-primary font-semibold">{addr.shortAddress}</span>
                </div>
                <p className="text-muted-foreground">
                  {addr.buildingNo} {addr.street}, {addr.district}
                </p>
                <p className="text-muted-foreground">
                  {addr.city} — {addr.zipCode} / {addr.additionalNo}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="border-green-500 text-green-600 text-[10px]">
                  <CheckCircle2 className="me-1 h-3 w-3" />
                  {isAr ? "موثق" : "Verified"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isAr ? "إعدادات العنوان الوطني" : "National Address Settings"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div>
              <p className="text-sm font-medium">{isAr ? "ملء تلقائي عند الشحن" : "Auto-fill at Checkout"}</p>
              <p className="text-xs text-muted-foreground">
                {isAr ? "ملء عنوان الشحن تلقائياً من العنوان الوطني" : "Auto-fill shipping address from national address"}
              </p>
            </div>
            <Switch checked={autoFill} onCheckedChange={setAutoFill} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div>
              <p className="text-sm font-medium">{isAr ? "إلزام العنوان الوطني" : "Require National Address"}</p>
              <p className="text-xs text-muted-foreground">
                {isAr ? "إلزام العملاء بإدخال عنوان وطني عند الطلب" : "Require customers to provide national address at checkout"}
              </p>
            </div>
            <Switch checked={requireNational} onCheckedChange={setRequireNational} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NationalAddress;
