import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Bell, Mail, MessageSquare, Eye, Send, CheckCircle2, Package, Truck, RotateCcw, ShoppingCart
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NotificationTemplate {
  id: string;
  name: string;
  type: "order_confirmed" | "shipped" | "delivered" | "refunded" | "abandoned_cart";
  icon: React.ReactNode;
  emailEnabled: boolean;
  smsEnabled: boolean;
  shopifyActive: boolean;
  sallaActive: boolean;
  stats: { sent: number; opened: number; clicked: number };
  preview: string;
}

const initialTemplates: NotificationTemplate[] = [
  { id: "nt1", name: "Order Confirmed", type: "order_confirmed", icon: <CheckCircle2 className="h-5 w-5" />,
    emailEnabled: true, smsEnabled: true, shopifyActive: true, sallaActive: true,
    stats: { sent: 1245, opened: 980, clicked: 456 },
    preview: "Hi {customer_name}, your order #{order_id} has been confirmed! Total: {total}. We'll notify you when it ships." },
  { id: "nt2", name: "Order Shipped", type: "shipped", icon: <Truck className="h-5 w-5" />,
    emailEnabled: true, smsEnabled: true, shopifyActive: true, sallaActive: true,
    stats: { sent: 1100, opened: 890, clicked: 670 },
    preview: "Great news {customer_name}! Your order #{order_id} has been shipped. Track: {tracking_url}" },
  { id: "nt3", name: "Order Delivered", type: "delivered", icon: <Package className="h-5 w-5" />,
    emailEnabled: true, smsEnabled: false, shopifyActive: true, sallaActive: true,
    stats: { sent: 950, opened: 720, clicked: 320 },
    preview: "Your order #{order_id} has been delivered! We hope you enjoy your purchase. Rate us: {review_url}" },
  { id: "nt4", name: "Refund Processed", type: "refunded", icon: <RotateCcw className="h-5 w-5" />,
    emailEnabled: true, smsEnabled: false, shopifyActive: true, sallaActive: false,
    stats: { sent: 89, opened: 78, clicked: 12 },
    preview: "Hi {customer_name}, your refund of {amount} for order #{order_id} has been processed. It may take 5-10 business days." },
  { id: "nt5", name: "Abandoned Cart", type: "abandoned_cart", icon: <ShoppingCart className="h-5 w-5" />,
    emailEnabled: true, smsEnabled: true, shopifyActive: true, sallaActive: true,
    stats: { sent: 456, opened: 234, clicked: 156 },
    preview: "Hey {customer_name}, you left items in your cart! Complete your order now and get {discount}% off: {cart_url}" },
];

const NotificationTemplates = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);

  const totalSent = templates.reduce((s, t) => s + t.stats.sent, 0);
  const totalOpened = templates.reduce((s, t) => s + t.stats.opened, 0);
  const totalClicked = templates.reduce((s, t) => s + t.stats.clicked, 0);
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const clickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : "0";

  const toggleField = (id: string, field: "emailEnabled" | "smsEnabled" | "shopifyActive" | "sallaActive") => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, [field]: !t[field] } : t));
    toast({ title: "Updated", description: "Notification setting changed" });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total Sent</p>
          <p className="text-2xl font-bold text-foreground">{totalSent.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Open Rate</p>
          <p className="text-2xl font-bold text-foreground">{openRate}%</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Click Rate</p>
          <p className="text-2xl font-bold text-foreground">{clickRate}%</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Active Templates</p>
          <p className="text-2xl font-bold text-foreground">{templates.filter(t => t.emailEnabled || t.smsEnabled).length}</p>
        </CardContent></Card>
      </div>

      {/* Template Cards */}
      <div className="space-y-4">
        {templates.map(t => (
          <Card key={t.id}>
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Info */}
                <div className="flex items-center gap-3 lg:w-48">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{t.icon}</div>
                  <p className="font-medium text-foreground">{t.name}</p>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 lg:flex-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Email</span>
                    <Switch checked={t.emailEnabled} onCheckedChange={() => toggleField(t.id, "emailEnabled")} />
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">SMS</span>
                    <Switch checked={t.smsEnabled} onCheckedChange={() => toggleField(t.id, "smsEnabled")} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px]">Shopify</Badge>
                    <Switch checked={t.shopifyActive} onCheckedChange={() => toggleField(t.id, "shopifyActive")} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-violet-500/10 text-violet-600 text-[10px]">Salla</Badge>
                    <Switch checked={t.sallaActive} onCheckedChange={() => toggleField(t.id, "sallaActive")} />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-center">
                  <div><p className="text-sm font-bold text-foreground">{t.stats.sent}</p><p className="text-[10px] text-muted-foreground">Sent</p></div>
                  <div><p className="text-sm font-bold text-foreground">{t.stats.opened}</p><p className="text-[10px] text-muted-foreground">Opened</p></div>
                  <div><p className="text-sm font-bold text-foreground">{t.stats.clicked}</p><p className="text-[10px] text-muted-foreground">Clicked</p></div>
                </div>

                {/* Preview */}
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setPreviewTemplate(t)}>
                  <Eye className="h-3 w-3" /> Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="sm:max-w-lg">
          {previewTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {previewTemplate.icon} {previewTemplate.name} Preview
                </DialogTitle>
                <DialogDescription>This is how the notification will appear to customers</DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Subject: {previewTemplate.name}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-sm text-foreground leading-relaxed">{previewTemplate.preview}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[10px]">
                  <Mail className="h-3 w-3 mr-1" /> {previewTemplate.emailEnabled ? "Email ON" : "Email OFF"}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <MessageSquare className="h-3 w-3 mr-1" /> {previewTemplate.smsEnabled ? "SMS ON" : "SMS OFF"}
                </Badge>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationTemplates;
