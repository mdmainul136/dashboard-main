"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Truck, MapPin, Calculator, Package, Settings, BarChart3, Globe, Zap, CheckCircle2, AlertCircle, Loader2, Printer } from "lucide-react";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { getDeliveryData, type DeliveryCity } from "@/data/deliveryData";
import type { CourierProvider } from "@/data/saudiCities";

const AWBEngineDemo = ({ country, activeCouriers, currency, cities }: { country: string; activeCouriers: string[]; currency: string; cities: DeliveryCity[] }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previewLabel, setPreviewLabel] = useState(false);

  // Form State
  const [receiverName, setReceiverName] = useState("John Doe");
  const [selectedCity, setSelectedCity] = useState(cities[0]?.name || "");
  const [weight, setWeight] = useState("1.0");
  const [selectedCourier, setSelectedCourier] = useState(activeCouriers[0] || "");

  const labelRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isEnabled) {
      setIsActivating(true);
      setTimeout(() => {
        setIsActivating(false);
        setIsEnabled(true);
        setShowForm(true);
        // Default to first active courier and city if not set
        if (!selectedCourier) setSelectedCourier(activeCouriers[0] || "");
        if (!selectedCity) setSelectedCity(cities[0]?.name || "");
      }, 1500);
    } else {
      setIsEnabled(false);
      setShowForm(false);
      setPreviewLabel(false);
    }
  };

  const generateAWB = () => {
    setPreviewLabel(true);
  };

  const handlePrint = () => {
    if (!labelRef.current) return;

    const printContent = labelRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>AWB Label - ${receiverName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: auto; margin: 0mm; }
            body { padding: 40px; font-family: system-ui; display: flex; justify-content: center; background: #fff; }
            .print-container { width: 100%; max-width: 400px; border: 4px solid black; padding: 0; background: white; }
            .no-print { display: none; }
            /* Force exact label appearance */
            .label-box { padding: 24px; }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="print-container">
            <div class="label-box">
              ${printContent}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-700 border-primary/10 shadow-xl ${isEnabled ? 'bg-primary/5' : 'bg-gradient-to-br from-white to-muted-foreground/[0.02]'}`}>
      {/* Background Decorative Element */}
      <div className={`absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full blur-3xl transition-colors duration-1000 ${isEnabled ? 'bg-primary/10' : 'bg-muted/20'}`} />

      <CardContent className="p-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <div className="relative mx-auto h-20 w-20">
              <div className={`absolute inset-0 rounded-3xl blur-2xl transition-all duration-500 ${isEnabled ? 'bg-primary/40' : 'bg-primary/10'}`} />
              <div className={`relative h-20 w-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${isEnabled ? 'bg-primary shadow-2xl scale-110' : 'bg-white border-2 border-primary/20 shadow-lg'}`}>
                {isActivating ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : isEnabled ? (
                  <Zap className="h-8 w-8 text-white fill-white animate-pulse" />
                ) : (
                  <Package className="h-8 w-8 text-primary opacity-60" />
                )}
              </div>
              {isEnabled && (
                <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-green-500 border-4 border-white flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {isEnabled ? "AWB Engine Active" : "Next-Gen AWB Engine"}
              </h2>
              <p className="text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                {isEnabled
                  ? `Successfully integrated with ${activeCouriers.length} local partners. Ready to generate labels for ${country} standards.`
                  : `Automatically generate shipping labels and waybills formatted for ${country} standards.`}
              </p>
            </div>
          </div>

          {isEnabled ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Metrics & Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-primary/10 shadow-sm flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground">Ready to ship</p>
                      <p className="text-sm font-bold">128 Labels</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-primary/10 shadow-sm flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/5 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground">Regional API</p>
                      <p className="text-sm font-bold text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                <Card className="border-primary/10 shadow-lg bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 py-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" /> New AWB Creation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground opacity-70">Receiver Name</Label>
                        <Input
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                          placeholder="John Doe"
                          className="h-10 rounded-xl border-muted-foreground/20 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground opacity-70">Destination City</Label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger className="h-10 rounded-xl border-muted-foreground/20 text-xs font-bold">
                            <SelectValue placeholder="To City" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground opacity-70">Weight (KG)</Label>
                        <Input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="h-10 rounded-xl border-muted-foreground/20 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground opacity-70">Courier Partner</Label>
                        <Select value={selectedCourier} onValueChange={setSelectedCourier}>
                          <SelectTrigger className="h-10 rounded-xl border-muted-foreground/20 text-xs font-bold">
                            <SelectValue placeholder="Select Courier" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeCouriers.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={generateAWB} className="w-full h-11 rounded-xl font-black text-xs gap-2 shadow-lg shadow-primary/20">
                      <Zap className="h-4 w-4" /> Generate AWB Label
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Label Preview */}
              <div className="relative">
                {!previewLabel ? (
                  <div className="h-full min-h-[400px] border-2 border-dashed border-primary/20 rounded-3xl bg-primary/[0.02] flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-primary/10 flex items-center justify-center">
                      <Package className="h-8 w-8 text-primary/40" />
                    </div>
                    <p className="text-sm font-bold text-primary/40 leading-snug">Fill the form and click generate<br />to preview the {country} AWB label</p>
                  </div>
                ) : (
                  <div className="animate-in zoom-in-95 fade-in duration-500 h-full min-h-[400px] bg-white rounded-3xl border-2 border-primary/20 shadow-2xl p-6 relative overflow-hidden flex flex-col">
                    {/* Printable Area Target */}
                    <div ref={labelRef} className="flex-1 flex flex-col">
                      {/* Mock AWB Label Header */}
                      <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-black tracking-tighter">ANTIGRAVITY</h3>
                          <p className="text-[9px] font-black uppercase tracking-widest">{country} EXPRESS SHIPPING</p>
                        </div>
                        <div className="h-12 w-12 bg-black flex items-center justify-center rounded-lg text-white font-black text-xs">
                          AWB
                        </div>
                      </div>

                      {/* Barcode Mock */}
                      <div className="space-y-1 mb-6">
                        <div className="h-16 w-full bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px)]" />
                        <p className="text-[10px] font-black text-center tracking-[0.5em]">AG-84849-001PX</p>
                      </div>

                      {/* Address details */}
                      <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black text-[10px]">
                        <div className="p-3 bg-black text-white font-black uppercase">From: Antigravity Hub</div>
                        <div className="p-3 bg-black text-white font-black uppercase text-right">To: {receiverName}</div>
                      </div>
                      <div className="border-x-2 border-b-2 border-black p-4 space-y-4 flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[8px] font-black uppercase text-muted-foreground">Destination</p>
                            <p className="text-sm font-black">{selectedCity}, {country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black uppercase text-muted-foreground">Weight</p>
                            <p className="text-sm font-black text-primary">{weight} KG</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t-2 border-black border-dashed flex justify-between items-end">
                          <span className="text-4xl font-black">{selectedCourier.slice(0, 1) || "A"}</span>
                          <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest">CURRENCY: {currency}</p>
                            <p className="text-xs font-black">SHIP DATE: {new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 no-print">
                      <Button variant="outline" onClick={() => setPreviewLabel(false)} className="flex-1 rounded-xl h-10 border-black font-black text-[10px] gap-2">
                        <Package className="h-3 w-3" /> VOID
                      </Button>
                      <Button onClick={handlePrint} className="flex-1 rounded-xl h-10 bg-black hover:bg-black/90 text-white font-black text-[10px] gap-2">
                        <Printer className="h-3 w-3" /> PRINT LABEL
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {activeCouriers.map(name => (
                  <Badge key={name} variant="outline" className="rounded-lg border-primary/20 px-2 py-0.5 text-[10px] font-bold bg-white/50 backdrop-blur-sm">
                    {name} Connected
                  </Badge>
                ))}
                {activeCouriers.length === 0 && (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mx-auto">
                    <AlertCircle className="h-3.5 w-3.5" /> No partners active in Partners tab
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Button
                  size="lg"
                  onClick={handleToggle}
                  disabled={isActivating}
                  className="rounded-2xl px-12 h-14 font-black text-lg transition-all duration-500 shadow-2xl relative overflow-hidden group bg-primary hover:bg-primary/90 shadow-primary/20"
                >
                  {isActivating ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" /> Initializing...
                    </span>
                  ) : "Activate Smart Shipping"}

                  {!isActivating && (
                    <Zap className="ml-2 h-5 w-5 fill-white animate-pulse group-hover:scale-125 transition-transform" />
                  )}
                </Button>
                <p className="text-[10px] font-black uppercase text-muted-foreground/40 mt-6 tracking-[0.2em]">
                  Powered by Antigravity Logistics Framework
                </p>
              </div>
            </div>
          )}

          {isEnabled && (
            <div className="pt-4 flex justify-center">
              <Button variant="ghost" size="sm" onClick={handleToggle} className="text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 uppercase tracking-widest">
                <AlertCircle className="h-3 w-3" /> Deactivate Engine
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CourierCard = ({ courier, onToggle, currency }: { courier: CourierProvider; onToggle: (id: string) => void; currency: string }) => (
  <Card className={`transition-all duration-300 overflow-hidden group ${courier.active ? "border-primary/20 shadow-md hover:shadow-lg" : "opacity-60 grayscale"}`}>
    <CardContent className="p-0">
      <div className={`p-4 flex items-start justify-between ${courier.active ? 'bg-primary/5' : 'bg-muted'}`}>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white shadow-inner text-3xl">
            {courier.logo}
          </div>
          <div>
            <h3 className="font-bold text-foreground leading-tight">{courier.name}</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{courier.nameAr}</p>
          </div>
        </div>
        <Switch checked={courier.active} onCheckedChange={() => onToggle(courier.id)} className="data-[state=checked]:bg-primary" />
      </div>

      <div className="p-5 space-y-4">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 h-8">{courier.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Base Rate</span>
            <p className="text-sm font-black text-foreground">{currency} {courier.baseRate}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Est. Delivery</span>
            <p className="text-sm font-black text-foreground">{courier.estimatedDays}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {courier.features.slice(0, 3).map((f) => (
            <Badge key={f} variant="secondary" className="text-[9px] font-bold py-0">{f}</Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const RateCalculator = ({ cities, couriers, currency }: { cities: DeliveryCity[]; couriers: CourierProvider[]; currency: string }) => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [weight, setWeight] = useState("1");
  const [results, setResults] = useState<{ courier: string; rate: number; days: string; logo: string }[]>([]);

  const calculate = () => {
    const w = parseFloat(weight) || 1;
    const activeCouriers = couriers.filter((c) => c.active);
    const res = activeCouriers.map((c) => ({
      courier: c.name,
      logo: c.logo,
      rate: c.baseRate + (c.perKg * w),
      days: c.estimatedDays,
    }));
    res.sort((a, b) => a.rate - b.rate);
    setResults(res);
  };

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader className="border-b border-muted/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          Shipping Rate Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From City</Label>
            <Select value={fromCity} onValueChange={setFromCity}>
              <SelectTrigger className="rounded-xl border-muted-foreground/20"><SelectValue placeholder="Pickup location" /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.name} {c.nameLocal && `(${c.nameLocal})`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To City</Label>
            <Select value={toCity} onValueChange={setToCity}>
              <SelectTrigger className="rounded-xl border-muted-foreground/20"><SelectValue placeholder="Delivery location" /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.name} {c.nameLocal && `(${c.nameLocal})`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Weight (KG)</Label>
            <div className="relative">
              <Input type="number" min="0.1" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-xl border-muted-foreground/20 pl-4" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase">KG</span>
            </div>
          </div>
        </div>

        <Button onClick={calculate} disabled={!fromCity || !toCity} className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform">
          Compare Shipping Rates
        </Button>

        {results.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Best available quotes for {weight}kg
            </h4>
            <div className="grid gap-2">
              {results.map((r, i) => (
                <div key={r.courier} className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${i === 0 ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10" : "border-muted shadow-sm hover:border-primary/20"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.logo}</span>
                    <div>
                      <span className="font-bold text-foreground block">{r.courier}</span>
                      {i === 0 && <Badge className="text-[8px] font-black bg-primary/20 text-primary border-none h-4 px-1 mt-0.5">CHEEPEST</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-foreground block">{currency} {r.rate.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70 tracking-tighter">{r.days} Arrival</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DeliveryPage = () => {
  const { country, businessPurpose } = useMerchantRegion();
  const deliveryData = getDeliveryData(country);
  const [couriers, setCouriers] = useState(deliveryData.couriers);

  useEffect(() => {
    setCouriers(deliveryData.couriers);
  }, [country, deliveryData.couriers]);

  const toggleCourier = (id: string) => {
    setCouriers((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const activeCouriersCount = couriers.filter((c) => c.active).length;

  // Dynamic Labels
  const isRestaurant = businessPurpose === 'restaurant';
  const pageTitle = isRestaurant ? `${country} Delivery Hub` : `${country} Logistics`;
  const pageSubtitle = isRestaurant
    ? "Manage food delivery partners, area zones, and specialized courier fleets."
    : "Connect with nationwide couriers, calculate freight rates, and generate shipping labels.";

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-2xl opacity-50 transition duration-1000 group-hover:opacity-75" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 p-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-tighter ring-4 ring-primary/5">
                  {country} Market
                </div>
                {isRestaurant && (
                  <div className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-600 uppercase tracking-tighter ring-4 ring-orange-500/5">
                    Food Delivery Engine
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-black text-foreground tracking-tight drop-shadow-sm">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl font-medium leading-relaxed">
                {pageSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Connected Partners</span>
                <span className="text-xl font-black text-foreground">{activeCouriersCount}<span className="text-muted-foreground/30 font-medium">/{couriers.length}</span></span>
              </div>
              <div className="h-10 w-[1px] bg-muted/50 hidden md:block mx-2" />
              <Button size="icon" variant="outline" className="rounded-xl border-primary/10 bg-white/50 backdrop-blur-sm shadow-sm hover:bg-primary/5">
                <Settings className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="couriers" className="space-y-8">
          <div className="flex items-center justify-between border-b pb-1">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              <TabsTrigger value="couriers" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-sm font-bold uppercase tracking-wider gap-2">
                <Truck className="h-4 w-4" /> Partners
              </TabsTrigger>
              <TabsTrigger value="calculator" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-sm font-bold uppercase tracking-wider gap-2">
                <Calculator className="h-4 w-4" /> Rates
              </TabsTrigger>
              <TabsTrigger value="awb" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-sm font-bold uppercase tracking-wider gap-2">
                <Package className="h-4 w-4" /> AWB
              </TabsTrigger>
              <TabsTrigger value="tracking" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-sm font-bold uppercase tracking-wider gap-2">
                <MapPin className="h-4 w-4" /> Track
              </TabsTrigger>
            </TabsList>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-muted-foreground/40 italic flex items-center gap-1">
                <Globe className="h-3 w-3" /> All rates displayed in {deliveryData.currency}
              </p>
            </div>
          </div>

          <TabsContent value="couriers" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {couriers.map((c) => (
                <CourierCard key={c.id} courier={c} onToggle={toggleCourier} currency={deliveryData.currency} />
              ))}
              <Card className="border-dashed border-2 border-muted bg-muted/5 flex flex-col items-center justify-center p-8 text-center min-h-[220px] transition-colors hover:border-primary/20 group cursor-pointer hover:bg-primary/[0.02]">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 ring-8 ring-muted/30 transition-all group-hover:scale-110 group-hover:bg-primary/10 group-hover:ring-primary/5">
                  <Package className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="font-bold text-muted-foreground group-hover:text-primary transition-colors">Request New Integration</h3>
                <p className="text-xs text-muted-foreground/60 mt-1 max-w-[150px]">Don't see your courier? We can build it.</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RateCalculator cities={deliveryData.cities} couriers={couriers} currency={deliveryData.currency} />
          </TabsContent>

          <TabsContent value="awb" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AWBEngineDemo
              country={country}
              activeCouriers={couriers.filter(c => c.active).map(c => c.name)}
              currency={deliveryData.currency}
              cities={deliveryData.cities}
            />
          </TabsContent>

          <TabsContent value="tracking" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="overflow-hidden border-primary/10 bg-white">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-6 pt-8">
                <CardTitle className="text-center">
                  <span className="text-3xl block mb-2 font-black tracking-tight">{country} Multi-Track</span>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Universal Shipping Intelligence</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="max-w-xl mx-auto space-y-8">
                  <div className="flex gap-2 p-1.5 rounded-2xl border border-muted-foreground/20 bg-muted/5 shadow-inner group focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                    <Input
                      placeholder="Enter AWB / Tracking Number..."
                      className="flex-1 border-none bg-transparent h-12 text-md font-bold placeholder:text-muted-foreground/30 focus-visible:ring-0"
                    />
                    <Button className="h-12 px-8 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20 active:scale-95 transition-all">Track Order</Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
                    {deliveryData.couriers.slice(0, 4).map(c => (
                      <div key={c.id} className="flex flex-col items-center gap-1 group/logo pointer-events-none">
                        <span className="text-2xl">{c.logo}</span>
                        <span className="text-[10px] font-black uppercase text-center">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryPage;

