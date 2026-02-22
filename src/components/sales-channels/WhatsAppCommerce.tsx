import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  MessageCircle, Phone, ShoppingBag, TrendingUp, Clock, Plus, Send, CheckCircle2, AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WhatsAppOrder {
  id: string;
  customer: string;
  phone: string;
  orderStatus: "new" | "confirmed" | "shipped" | "delivered";
  messageCount: number;
  lastMessage: string;
  total: number;
  date: string;
}

interface WATemplate {
  id: string;
  name: string;
  type: "order_confirm" | "shipping_update" | "payment_reminder" | "promo";
  message: string;
  enabled: boolean;
  sentCount: number;
}

const initialOrders: WhatsAppOrder[] = [
  { id: "wo1", customer: "Ahmed Ali", phone: "+966 50 123 4567", orderStatus: "confirmed", messageCount: 5, lastMessage: "Order confirmed! Shipping tomorrow.", total: 249.99, date: "2026-02-19" },
  { id: "wo2", customer: "Sara Khan", phone: "+966 55 987 6543", orderStatus: "new", messageCount: 2, lastMessage: "I want to order the blue bag", total: 0, date: "2026-02-19" },
  { id: "wo3", customer: "Omar Hassan", phone: "+966 54 111 2222", orderStatus: "shipped", messageCount: 8, lastMessage: "Your order is on its way!", total: 189.50, date: "2026-02-18" },
  { id: "wo4", customer: "Fatima Noor", phone: "+966 56 333 4444", orderStatus: "delivered", messageCount: 6, lastMessage: "Thank you for your purchase!", total: 320.00, date: "2026-02-17" },
  { id: "wo5", customer: "Khalid Raza", phone: "+966 59 555 6666", orderStatus: "new", messageCount: 1, lastMessage: "Is this product available?", total: 0, date: "2026-02-19" },
];

const initialTemplates: WATemplate[] = [
  { id: "wt1", name: "Order Confirmation", type: "order_confirm", message: "✅ Your order #{order_id} has been confirmed! Total: SAR {total}. We'll update you on shipping.", enabled: true, sentCount: 1245 },
  { id: "wt2", name: "Shipping Update", type: "shipping_update", message: "📦 Your order #{order_id} has been shipped! Track: {tracking_url}", enabled: true, sentCount: 890 },
  { id: "wt3", name: "Payment Reminder", type: "payment_reminder", message: "💳 Reminder: Your COD order #{order_id} of SAR {total} is ready for delivery. Please keep the amount ready.", enabled: true, sentCount: 234 },
  { id: "wt4", name: "Promotional", type: "promo", message: "🔥 Flash Sale! Get {discount}% off on {product}. Shop now: {link}", enabled: false, sentCount: 5600 },
];

const WhatsAppCommerce = () => {
  const [orders] = useState(initialOrders);
  const [templates, setTemplates] = useState(initialTemplates);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WhatsAppOrder | null>(null);

  const totalWAOrders = orders.filter(o => o.total > 0).length;
  const newChats = orders.filter(o => o.orderStatus === "new").length;
  const conversionRate = ((totalWAOrders / orders.length) * 100).toFixed(0);
  const avgResponseTime = "2.3 min";

  const statusBadge = (status: WhatsAppOrder["orderStatus"]) => {
    if (status === "new") return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><MessageCircle className="h-3 w-3" /> New Chat</Badge>;
    if (status === "confirmed") return <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Confirmed</Badge>;
    if (status === "shipped") return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="h-3 w-3" /> Shipped</Badge>;
    return <Badge className="bg-muted text-muted-foreground border-border gap-1"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>;
  };

  const toggleTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    toast({ title: "Updated", description: "Template status changed" });
  };

  const openChat = (order: WhatsAppOrder) => {
    setSelectedOrder(order);
    setChatOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">WhatsApp Orders</p><p className="text-2xl font-bold text-foreground">{totalWAOrders}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><ShoppingBag className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">New Chats</p><p className="text-2xl font-bold text-foreground">{newChats}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><MessageCircle className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Conversion Rate</p><p className="text-2xl font-bold text-foreground">{conversionRate}%</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Avg Response</p><p className="text-2xl font-bold text-foreground">{avgResponseTime}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><Clock className="h-5 w-5 text-warning" /></div>
          </div>
        </CardContent></Card>
      </div>

      {/* WhatsApp Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Messages</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{o.customer}</td>
                  <td className="p-4 text-muted-foreground font-mono text-xs">{o.phone}</td>
                  <td className="p-4">{statusBadge(o.orderStatus)}</td>
                  <td className="p-4 text-foreground">{o.messageCount}</td>
                  <td className="p-4 font-mono text-foreground">{o.total > 0 ? `SAR ${o.total}` : "—"}</td>
                  <td className="p-4 text-muted-foreground">{o.date}</td>
                  <td className="p-4">
                    <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs" onClick={() => openChat(o)}>
                      <MessageCircle className="h-3 w-3" /> Chat
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notification Templates */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Send className="h-4 w-4 text-primary" /> WhatsApp Templates</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map(t => (
            <Card key={t.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">{t.type.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{t.sentCount.toLocaleString()} sent</span>
                    <Button size="sm" variant={t.enabled ? "default" : "outline"} className="h-7 text-xs" onClick={() => toggleTemplate(t.id)}>
                      {t.enabled ? "Active" : "Disabled"}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/30 rounded p-2">{t.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Preview Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-success" /> {selectedOrder?.customer}</DialogTitle>
            <DialogDescription className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedOrder?.phone}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 py-2">
              <div className="rounded-lg bg-muted/30 p-4 space-y-3 max-h-[300px] overflow-y-auto">
                {/* Mock chat bubbles */}
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg rounded-tl-none p-2.5 max-w-[80%]">
                    <p className="text-xs text-foreground">{selectedOrder.lastMessage}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Customer · 2 min ago</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-lg rounded-tr-none p-2.5 max-w-[80%]">
                    <p className="text-xs text-foreground">Thank you! We'll process your request shortly.</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Store · Just now</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type a reply..." className="flex-1 text-sm" />
                <Button size="sm" className="gap-1"><Send className="h-3 w-3" /> Send</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsAppCommerce;
