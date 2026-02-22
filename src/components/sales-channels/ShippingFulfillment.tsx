import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck, Package, CheckCircle2, AlertCircle, Clock, MapPin, Box, Map, List
} from "lucide-react";
import TrackingMapView, { type MapShipment } from "./TrackingMapView";

const mockShipments: MapShipment[] = [
  { id: "sh1", orderId: "#SH-1042", channel: "My Shopify Store", platform: "shopify", customer: "Ahmed Ali", destination: "Riyadh, SA", carrier: "Aramex", trackingNumber: "ARX-98765432", status: "in_transit", estimatedDelivery: "2026-02-21", shippedAt: "2026-02-18", lat: 24.7, lng: 46.7, originLat: 21.5, originLng: 39.2 },
  { id: "sh2", orderId: "#SA-2085", channel: "Salla متجري", platform: "salla", customer: "Sara Khan", destination: "Jeddah, SA", carrier: "SMSA", trackingNumber: "SMS-12345678", status: "pending", estimatedDelivery: "2026-02-22", shippedAt: "", lat: 21.5, lng: 39.2, originLat: 24.7, originLng: 46.7 },
  { id: "sh3", orderId: "#SH-1041", channel: "My Shopify Store", platform: "shopify", customer: "Omar Hassan", destination: "Dubai, AE", carrier: "DHL", trackingNumber: "DHL-55667788", status: "delivered", estimatedDelivery: "2026-02-17", shippedAt: "2026-02-15", lat: 25.2, lng: 55.3, originLat: 24.7, originLng: 46.7 },
  { id: "sh4", orderId: "#SA-2084", channel: "Salla متجري", platform: "salla", customer: "Fatima Noor", destination: "Dammam, SA", carrier: "Aramex", trackingNumber: "ARX-11223344", status: "returned", estimatedDelivery: "2026-02-16", shippedAt: "2026-02-14", lat: 26.4, lng: 50.1, originLat: 21.5, originLng: 39.2 },
  { id: "sh5", orderId: "#SH-1040", channel: "My Shopify Store", platform: "shopify", customer: "Khalid Raza", destination: "Kuwait City, KW", carrier: "FedEx", trackingNumber: "FDX-99887766", status: "shipped", estimatedDelivery: "2026-02-23", shippedAt: "2026-02-19", lat: 29.4, lng: 47.9, originLat: 24.7, originLng: 46.7 },
  { id: "sh6", orderId: "#SA-2083", channel: "Salla متجري", platform: "salla", customer: "Nora Ahmed", destination: "Riyadh, SA", carrier: "SMSA", trackingNumber: "SMS-44556677", status: "in_transit", estimatedDelivery: "2026-02-20", shippedAt: "2026-02-17", lat: 24.9, lng: 46.5, originLat: 26.4, originLng: 50.1 },
];

interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  channels: string[];
  avgDays: number;
  flatRate: number;
  active: boolean;
}

const mockMethods: ShippingMethod[] = [
  { id: "m1", name: "Standard Shipping", carrier: "Aramex", channels: ["Shopify", "Salla"], avgDays: 3, flatRate: 15, active: true },
  { id: "m2", name: "Express Delivery", carrier: "DHL", channels: ["Shopify"], avgDays: 1, flatRate: 45, active: true },
  { id: "m3", name: "Local Delivery", carrier: "SMSA", channels: ["Salla"], avgDays: 2, flatRate: 10, active: true },
  { id: "m4", name: "International", carrier: "FedEx", channels: ["Shopify", "Salla"], avgDays: 5, flatRate: 60, active: false },
];

const platformColor = (p: "shopify" | "salla") => p === "shopify" ? "bg-emerald-500/10 text-emerald-600" : "bg-violet-500/10 text-violet-600";
const platformBorder = (p: "shopify" | "salla") => p === "shopify" ? "border-emerald-500/30" : "border-violet-500/30";

const shipStatusConfig: Record<string, { badge: string; icon: React.ReactNode; label: string }> = {
  pending: { badge: "bg-muted text-muted-foreground border-border", icon: <Clock className="h-3 w-3" />, label: "Pending" },
  shipped: { badge: "bg-primary/10 text-primary border-primary/20", icon: <Package className="h-3 w-3" />, label: "Shipped" },
  in_transit: { badge: "bg-warning/10 text-warning border-warning/20", icon: <Truck className="h-3 w-3" />, label: "In Transit" },
  delivered: { badge: "bg-success/10 text-success border-success/20", icon: <CheckCircle2 className="h-3 w-3" />, label: "Delivered" },
  returned: { badge: "bg-destructive/10 text-destructive border-destructive/20", icon: <AlertCircle className="h-3 w-3" />, label: "Returned" },
};

const ShippingFulfillment = () => {
  const [viewMode, setViewMode] = useState<"table" | "map">("table");

  const delivered = mockShipments.filter(s => s.status === "delivered").length;
  const inTransit = mockShipments.filter(s => s.status === "in_transit" || s.status === "shipped").length;
  const pending = mockShipments.filter(s => s.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{delivered}</p>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Truck className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{inTransit}</p>
              <p className="text-xs text-muted-foreground">In Transit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{mockShipments.length}</p>
              <p className="text-xs text-muted-foreground">Total Shipments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("table")}
          className="gap-1.5"
        >
          <List className="h-4 w-4" /> Table View
        </Button>
        <Button
          variant={viewMode === "map" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("map")}
          className="gap-1.5"
        >
          <Map className="h-4 w-4" /> Map View
        </Button>
      </div>

      {viewMode === "map" ? (
        <TrackingMapView shipments={mockShipments} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Shipment Tracking Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" /> Shipment Tracking
                </CardTitle>
                <CardDescription>Track all shipments across Shopify & Salla</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground text-xs">
                        <th className="p-3 font-medium">Order</th>
                        <th className="p-3 font-medium">Channel</th>
                        <th className="p-3 font-medium">Destination</th>
                        <th className="p-3 font-medium">Carrier</th>
                        <th className="p-3 font-medium">Status</th>
                        <th className="p-3 font-medium">ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockShipments.map(s => {
                        const cfg = shipStatusConfig[s.status];
                        return (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <p className="font-medium text-foreground">{s.orderId}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{s.trackingNumber}</p>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className={`${platformColor(s.platform)} border ${platformBorder(s.platform)} text-[10px]`}>
                                {s.channel}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <span className="flex items-center gap-1 text-foreground text-xs"><MapPin className="h-3 w-3 text-muted-foreground" /> {s.destination}</span>
                            </td>
                            <td className="p-3 text-foreground text-xs">{s.carrier}</td>
                            <td className="p-3">
                              <Badge className={`${cfg.badge} gap-1 text-[10px]`}>{cfg.icon} {cfg.label}</Badge>
                            </td>
                            <td className="p-3 text-xs text-muted-foreground">{s.estimatedDelivery}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" /> Shipping Methods
              </CardTitle>
              <CardDescription>Configured delivery options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockMethods.map(m => (
                <div key={m.id} className={`rounded-lg border p-3 space-y-2 transition-all ${m.active ? "border-border" : "border-border/30 opacity-60"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                    <Badge variant="outline" className={m.active ? "text-success border-success/30 text-[10px]" : "text-muted-foreground border-border text-[10px]"}>
                      {m.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{m.carrier}</span>
                    <span>·</span>
                    <span>~{m.avgDays} days</span>
                    <span>·</span>
                    <span>${m.flatRate}</span>
                  </div>
                  <div className="flex gap-1">
                    {m.channels.map(ch => (
                      <Badge key={ch} variant="outline" className="text-[10px]">{ch}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shipping Methods always visible in map mode too */}
      {viewMode === "map" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Box className="h-4 w-4 text-primary" /> Shipping Methods
            </CardTitle>
            <CardDescription>Configured delivery options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {mockMethods.map(m => (
                <div key={m.id} className={`rounded-lg border p-3 space-y-2 transition-all ${m.active ? "border-border" : "border-border/30 opacity-60"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                    <Badge variant="outline" className={m.active ? "text-success border-success/30 text-[10px]" : "text-muted-foreground border-border text-[10px]"}>
                      {m.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{m.carrier}</span><span>·</span><span>~{m.avgDays} days</span><span>·</span><span>${m.flatRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShippingFulfillment;
