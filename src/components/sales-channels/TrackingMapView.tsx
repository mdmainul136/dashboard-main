import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Truck, Package, CheckCircle2, AlertCircle, Clock, MapPin, X
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface MapShipment {
  id: string;
  orderId: string;
  channel: string;
  platform: "shopify" | "salla";
  customer: string;
  destination: string;
  carrier: string;
  trackingNumber: string;
  status: "shipped" | "in_transit" | "delivered" | "returned" | "pending";
  estimatedDelivery: string;
  shippedAt: string;
  lat: number;
  lng: number;
  originLat: number;
  originLng: number;
}

const statusColors: Record<string, { fill: string; stroke: string; label: string; icon: React.ReactNode }> = {
  delivered: { fill: "hsl(var(--success))", stroke: "hsl(var(--success))", label: "Delivered", icon: <CheckCircle2 className="h-3 w-3" /> },
  in_transit: { fill: "hsl(var(--warning))", stroke: "hsl(var(--warning))", label: "In Transit", icon: <Truck className="h-3 w-3" /> },
  shipped: { fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))", label: "Shipped", icon: <Package className="h-3 w-3" /> },
  pending: { fill: "hsl(var(--muted-foreground))", stroke: "hsl(var(--muted-foreground))", label: "Pending", icon: <Clock className="h-3 w-3" /> },
  returned: { fill: "hsl(var(--destructive))", stroke: "hsl(var(--destructive))", label: "Returned", icon: <AlertCircle className="h-3 w-3" /> },
};

const statusFilters = ["all", "in_transit", "shipped", "delivered", "pending", "returned"] as const;

// Convert geo coords to SVG positions within the map viewport
// Map bounds: lat 15-32, lng 34-58
const geoToSvg = (lat: number, lng: number) => {
  const x = ((lng - 34) / (58 - 34)) * 700 + 50;
  const y = ((32 - lat) / (32 - 15)) * 400 + 50;
  return { x, y };
};

// City labels for the map
const cities = [
  { name: "Riyadh", lat: 24.7, lng: 46.7 },
  { name: "Jeddah", lat: 21.5, lng: 39.2 },
  { name: "Dubai", lat: 25.2, lng: 55.3 },
  { name: "Dammam", lat: 26.4, lng: 50.1 },
  { name: "Kuwait City", lat: 29.4, lng: 47.9 },
  { name: "Muscat", lat: 23.6, lng: 58.5 },
  { name: "Doha", lat: 25.3, lng: 51.5 },
  { name: "Manama", lat: 26.2, lng: 50.6 },
];

interface TrackingMapViewProps {
  shipments: MapShipment[];
}

const TrackingMapView = ({ shipments }: TrackingMapViewProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? shipments : shipments.filter(s => s.status === filter);
  const selected = shipments.find(s => s.id === selectedId);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Live Tracking Map
            </CardTitle>
            <div className="flex flex-wrap gap-1">
              {statusFilters.map(f => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "outline"}
                  className="h-7 text-[10px] px-2 capitalize"
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-auto rounded-xl bg-muted/30 border border-border/40"
            style={{ minHeight: 300 }}
          >
            {/* Simplified Gulf Region Map */}
            <defs>
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sea background */}
            <rect x="0" y="0" width="800" height="500" fill="url(#seaGrad)" rx="12" />

            {/* Saudi Arabia - simplified polygon */}
            <path
              d="M 150 180 L 280 120 L 420 130 L 480 180 L 500 250 L 480 320 L 420 380 L 300 420 L 200 380 L 120 300 L 100 240 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* UAE */}
            <path
              d="M 520 220 L 580 200 L 640 210 L 660 240 L 640 270 L 580 280 L 520 260 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Kuwait */}
            <path
              d="M 400 100 L 440 90 L 460 110 L 450 140 L 410 140 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Oman partial */}
            <path
              d="M 580 280 L 660 270 L 700 320 L 680 400 L 600 420 L 520 380 L 500 320 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Qatar */}
            <path
              d="M 490 200 L 510 190 L 520 210 L 510 230 L 490 220 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Bahrain dot */}
            <circle cx="478" cy="195" r="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.6" />

            {/* Country labels */}
            <text x="300" y="280" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="600" opacity="0.4" textAnchor="middle">SAUDI ARABIA</text>
            <text x="600" y="250" fill="hsl(var(--muted-foreground))" fontSize="10" fontWeight="500" opacity="0.4" textAnchor="middle">UAE</text>
            <text x="430" y="115" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="500" opacity="0.4" textAnchor="middle">KUWAIT</text>
            <text x="620" y="370" fill="hsl(var(--muted-foreground))" fontSize="10" fontWeight="500" opacity="0.4" textAnchor="middle">OMAN</text>

            {/* City markers */}
            {cities.map(c => {
              const pos = geoToSvg(c.lat, c.lng);
              return (
                <g key={c.name}>
                  <circle cx={pos.x} cy={pos.y} r="2" fill="hsl(var(--muted-foreground))" opacity="0.3" />
                  <text x={pos.x} y={pos.y - 6} fill="hsl(var(--muted-foreground))" fontSize="8" textAnchor="middle" opacity="0.5">
                    {c.name}
                  </text>
                </g>
              );
            })}

            {/* Route lines (origin → destination) */}
            {filtered.map(s => {
              const origin = geoToSvg(s.originLat, s.originLng);
              const dest = geoToSvg(s.lat, s.lng);
              const color = statusColors[s.status];
              const isSelected = selectedId === s.id;
              // Curved path via quadratic bezier
              const midX = (origin.x + dest.x) / 2;
              const midY = (origin.y + dest.y) / 2 - 30;
              return (
                <g key={`route-${s.id}`}>
                  <path
                    d={`M ${origin.x} ${origin.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`}
                    fill="none"
                    stroke={color.fill}
                    strokeWidth={isSelected ? 2 : 1.2}
                    strokeDasharray="6 4"
                    opacity={isSelected ? 0.8 : 0.35}
                    className="transition-all duration-200"
                  />
                  {/* Origin dot */}
                  <circle cx={origin.x} cy={origin.y} r="3" fill={color.fill} opacity={isSelected ? 0.7 : 0.3} stroke="hsl(var(--background))" strokeWidth="1" />
                  {/* Animated dot on route for in_transit/shipped */}
                  {(s.status === "in_transit" || s.status === "shipped") && (
                    <circle r="3" fill={color.fill} opacity="0.9">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M ${origin.x} ${origin.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Shipment pins */}
            <TooltipProvider delayDuration={0}>
              {filtered.map(s => {
                const pos = geoToSvg(s.lat, s.lng);
                const color = statusColors[s.status];
                const isSelected = selectedId === s.id;
                const isAnimated = s.status === "in_transit";

                return (
                  <g key={s.id} style={{ cursor: "pointer" }} onClick={() => setSelectedId(s.id)}>
                    {/* Pulse ring for in_transit */}
                    {isAnimated && (
                      <circle cx={pos.x} cy={pos.y} r="14" fill={color.fill} opacity="0.2">
                        <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Selection ring */}
                    {isSelected && (
                      <circle cx={pos.x} cy={pos.y} r="14" fill="none" stroke={color.fill} strokeWidth="2" opacity="0.6">
                        <animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Pin marker */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 9 : 7}
                          fill={color.fill}
                          stroke="hsl(var(--background))"
                          strokeWidth="2.5"
                          filter="url(#glow)"
                          className="transition-all duration-200"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-semibold">{s.orderId}</p>
                        <p className="text-muted-foreground">{s.carrier} · {color.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </g>
                );
              })}
            </TooltipProvider>
          </svg>
        </CardContent>
      </Card>

      {/* Detail sidebar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selected ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{selected.orderId}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedId(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Badge className={`gap-1 text-[10px] ${
                selected.status === "delivered" ? "bg-success/10 text-success" :
                selected.status === "in_transit" ? "bg-warning/10 text-warning" :
                selected.status === "shipped" ? "bg-primary/10 text-primary" :
                selected.status === "returned" ? "bg-destructive/10 text-destructive" :
                "bg-muted text-muted-foreground"
              }`}>
                {statusColors[selected.status].icon} {statusColors[selected.status].label}
              </Badge>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="text-foreground">{selected.customer}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Destination</span><span className="text-foreground">{selected.destination}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Carrier</span><span className="text-foreground">{selected.carrier}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tracking</span><span className="text-foreground font-mono text-[10px]">{selected.trackingNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Channel</span><span className="text-foreground">{selected.channel}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ETA</span><span className="text-foreground">{selected.estimatedDelivery}</span></div>
                {selected.shippedAt && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipped</span><span className="text-foreground">{selected.shippedAt}</span></div>
                )}
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {shipments.map(s => {
                  const color = statusColors[s.status];
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className="w-full text-left rounded-lg border border-border/50 p-2.5 hover:bg-muted/40 transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{s.orderId}</span>
                        <Badge variant="outline" className="text-[9px] h-4 gap-0.5" style={{ color: color.fill, borderColor: color.fill }}>
                          {color.icon} {color.label}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{s.customer} · {s.destination}</p>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingMapView;
