"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Car, Wrench, Calendar as CalendarIcon, DollarSign, Users, TrendingUp, Plus, Star, Fuel, Gauge, Package, Truck, Calculator, Search, Settings, AlertTriangle, CheckCircle2, ArrowRightLeft, Scale, BarChart3, X, Phone, Mail, MapPin, Cog, Palette, Shield, Zap, GitCompareArrows, Download, ClipboardList, History, UserCheck, FileText, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const vehicles = [
  { id: "V-001", make: "Toyota", model: "Camry 2026", type: "Sedan", price: 32000, mileage: "0 km", color: "White", status: "available", featured: true, engine: "2.5L 4-Cylinder", hp: 203, transmission: "8-Speed Automatic", drivetrain: "FWD", fuelType: "Gasoline", seats: 5, warranty: "3 Years / 100,000 km", safetyRating: 5, features: ["Lane Departure Warning", "Adaptive Cruise Control", "Apple CarPlay", "Blind Spot Monitor"] },
  { id: "V-002", make: "BMW", model: "X5 2025", type: "SUV", price: 68000, mileage: "12,000 km", color: "Black", status: "available", featured: true, engine: "3.0L Turbo I6", hp: 335, transmission: "8-Speed Automatic", drivetrain: "AWD", fuelType: "Gasoline", seats: 5, warranty: "4 Years / 80,000 km", safetyRating: 5, features: ["Panoramic Sunroof", "Harman Kardon Audio", "Head-Up Display", "Parking Assistant"] },
  { id: "V-003", make: "Mercedes", model: "C-Class 2026", type: "Sedan", price: 55000, mileage: "0 km", color: "Silver", status: "reserved", engine: "2.0L Turbo I4", hp: 255, transmission: "9-Speed Automatic", drivetrain: "RWD", fuelType: "Gasoline", seats: 5, warranty: "4 Years / 80,000 km", safetyRating: 5, features: ["MBUX Infotainment", "64-Color Ambient Lighting", "Wireless Charging", "360Â° Camera"] },
  { id: "V-004", make: "Tesla", model: "Model 3", type: "Electric", price: 42000, mileage: "5,000 km", color: "Red", status: "available", engine: "Dual Motor Electric", hp: 346, transmission: "Single-Speed", drivetrain: "AWD", fuelType: "Electric", seats: 5, warranty: "4 Years / 80,000 km", safetyRating: 5, features: ["Autopilot", "15\" Touchscreen", "Over-the-Air Updates", "Glass Roof"] },
  { id: "V-005", make: "Toyota", model: "Land Cruiser", type: "SUV", price: 85000, mileage: "0 km", color: "Gray", status: "sold", engine: "3.5L Twin-Turbo V6", hp: 409, transmission: "10-Speed Automatic", drivetrain: "4WD", fuelType: "Gasoline", seats: 7, warranty: "3 Years / 100,000 km", safetyRating: 5, features: ["Multi-Terrain Select", "Crawl Control", "JBL 14-Speaker Audio", "Heated/Ventilated Seats"] },
  { id: "V-006", make: "Honda", model: "Civic 2026", type: "Sedan", price: 28000, mileage: "0 km", color: "Blue", status: "available", engine: "1.5L Turbo I4", hp: 180, transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", seats: 5, warranty: "3 Years / 60,000 km", safetyRating: 5, features: ["Honda Sensing Suite", "Bose Audio", "Wireless CarPlay", "LED Headlights"] },
];

const serviceBookings = [
  { id: "SB-001", customer: "Khaled Ibrahim", vehicle: "Toyota Camry", service: "Oil Change", date: "2026-02-20", time: "10:00", cost: 120, status: "scheduled" },
  { id: "SB-002", customer: "Sara Mahmoud", vehicle: "BMW X3", service: "Brake Inspection", date: "2026-02-20", time: "11:30", cost: 200, status: "in-progress" },
  { id: "SB-003", customer: "Ahmed Ali", vehicle: "Honda Accord", service: "Full Service", date: "2026-02-20", time: "14:00", cost: 450, status: "scheduled" },
  { id: "SB-004", customer: "Nora Hassan", vehicle: "Mercedes GLE", service: "Tire Rotation", date: "2026-02-21", time: "09:00", cost: 80, status: "scheduled" },
];

const testDrives = [
  { id: "TD-001", customer: "Faisal Al-Otaibi", vehicle: "Tesla Model 3", date: "2026-02-20", time: "15:00", status: "confirmed" },
  { id: "TD-002", customer: "Layla Nasser", vehicle: "BMW X5 2025", date: "2026-02-21", time: "10:00", status: "confirmed" },
  { id: "TD-003", customer: "Omar Yousef", vehicle: "Toyota Land Cruiser", date: "2026-02-21", time: "14:00", status: "pending" },
];

const partsCatalog = [
  { id: "P-001", name: "Brake Pads (Front)", brand: "Bosch", compat: "Toyota Camry 2020-2026", price: 85, stock: 24, status: "in-stock" },
  { id: "P-002", name: "Oil Filter", brand: "Mann-Filter", compat: "BMW X5 2022-2025", price: 32, stock: 40, status: "in-stock" },
  { id: "P-003", name: "Air Filter", brand: "K&N", compat: "Universal Fit", price: 55, stock: 18, status: "in-stock" },
  { id: "P-004", name: "Spark Plugs (Set of 4)", brand: "NGK", compat: "Honda Civic 2023-2026", price: 48, stock: 3, status: "low-stock" },
  { id: "P-005", name: "Timing Belt Kit", brand: "Gates", compat: "Toyota Land Cruiser", price: 220, stock: 0, status: "out-of-stock" },
  { id: "P-006", name: "Battery 12V 70Ah", brand: "Varta", compat: "Universal", price: 180, stock: 12, status: "in-stock" },
  { id: "P-007", name: "Wiper Blades (Pair)", brand: "Bosch", compat: "Mercedes C-Class", price: 42, stock: 30, status: "in-stock" },
];

const fleetVehicles = [
  { id: "FL-001", vehicle: "Toyota Hilux 2025", plate: "ABC 1234", driver: "Saeed Al-Harbi", status: "active", mileage: "34,200 km", nextService: "2026-03-15", fuel: 72 },
  { id: "FL-002", vehicle: "Hyundai H1 Van", plate: "DEF 5678", driver: "Mohammed Youssef", status: "active", mileage: "58,100 km", nextService: "2026-02-28", fuel: 45 },
  { id: "FL-003", vehicle: "Isuzu D-Max", plate: "GHI 9012", driver: "Ali Nasser", status: "maintenance", mileage: "72,500 km", nextService: "2026-02-22", fuel: 15 },
  { id: "FL-004", vehicle: "Toyota Hiace", plate: "JKL 3456", driver: "Hassan Omar", status: "active", mileage: "41,800 km", nextService: "2026-04-01", fuel: 88 },
  { id: "FL-005", vehicle: "Ford Ranger", plate: "MNO 7890", driver: "Unassigned", status: "idle", mileage: "12,300 km", nextService: "2026-05-10", fuel: 95 },
];

const serviceHistory = [
  { id: "SH-001", customer: "Khaled Ibrahim", phone: "0551234567", vehicle: "Toyota Camry 2024", plate: "ABC 1111", service: "Full Service", technician: "Fahad Ali", date: "2026-02-18", cost: 450, parts: ["Oil Filter", "Air Filter", "Brake Pads"], notes: "All fluids topped up. Recommended tire replacement in 5,000 km.", status: "completed" },
  { id: "SH-002", customer: "Sara Mahmoud", phone: "0559876543", vehicle: "BMW X3 2023", plate: "DEF 2222", service: "Brake Replacement", technician: "Ahmed Hassan", date: "2026-02-15", cost: 680, parts: ["Brake Pads (Front)", "Brake Discs (Front)"], notes: "Front brakes replaced. Rear at 60% life.", status: "completed" },
  { id: "SH-003", customer: "Nora Hassan", phone: "0561112233", vehicle: "Mercedes GLE 2025", plate: "GHI 3333", service: "AC Repair", technician: "Fahad Ali", date: "2026-02-12", cost: 320, parts: ["AC Compressor Belt"], notes: "Compressor belt replaced. Refrigerant recharged.", status: "completed" },
  { id: "SH-004", customer: "Ahmed Ali", phone: "0554443322", vehicle: "Honda Accord 2024", plate: "JKL 4444", service: "Tire Rotation + Balance", technician: "Omar Saleh", date: "2026-02-10", cost: 120, parts: [], notes: "All 4 tires rotated and balanced. Alignment checked â€” OK.", status: "completed" },
  { id: "SH-005", customer: "Faisal Al-Otaibi", phone: "0567778899", vehicle: "Tesla Model 3 2025", plate: "MNO 5555", service: "Battery Diagnostic", technician: "Ahmed Hassan", date: "2026-02-08", cost: 200, parts: [], notes: "Battery health at 96%. No issues found. Software updated.", status: "completed" },
  { id: "SH-006", customer: "Layla Nasser", phone: "0553334455", vehicle: "Toyota Land Cruiser 2024", plate: "PQR 6666", service: "Suspension Overhaul", technician: "Omar Saleh", date: "2026-01-28", cost: 1450, parts: ["Front Shock Absorbers", "Rear Springs", "Bushings Kit"], notes: "Complete front/rear suspension rebuilt. Test driven 20 km.", status: "completed" },
  { id: "SH-007", customer: "Khaled Ibrahim", phone: "0551234567", vehicle: "Toyota Camry 2024", plate: "ABC 1111", service: "Oil Change", technician: "Fahad Ali", date: "2026-01-15", cost: 120, parts: ["Oil Filter", "5W-30 Engine Oil 5L"], notes: "Routine oil change. Next due at 75,000 km.", status: "completed" },
  { id: "SH-008", customer: "Sara Mahmoud", phone: "0559876543", vehicle: "BMW X3 2023", plate: "DEF 2222", service: "Engine Diagnostic", technician: "Ahmed Hassan", date: "2026-02-19", cost: 150, parts: [], notes: "Check engine light â€” O2 sensor intermittent. Monitoring.", status: "in-progress" },
];

const customerVehicles = [
  { id: "CV-001", owner: "Khaled Ibrahim", phone: "0551234567", email: "khaled@email.com", vehicles: [
    { plate: "ABC 1111", make: "Toyota", model: "Camry 2024", color: "White", vin: "JTDKN3DU5A0123456", mileage: "68,200 km", lastService: "2026-02-18", nextDue: "2026-05-18", totalSpent: 1140 },
  ]},
  { id: "CV-002", owner: "Sara Mahmoud", phone: "0559876543", email: "sara@email.com", vehicles: [
    { plate: "DEF 2222", make: "BMW", model: "X3 2023", color: "Black", vin: "WBXHU7C35M5A98765", mileage: "42,500 km", lastService: "2026-02-19", nextDue: "2026-04-15", totalSpent: 830 },
    { plate: "XYZ 9999", make: "Mercedes", model: "A200 2022", color: "Silver", vin: "W1K5J5EB4MA654321", mileage: "55,100 km", lastService: "2025-12-10", nextDue: "2026-03-10", totalSpent: 420 },
  ]},
  { id: "CV-003", owner: "Ahmed Ali", phone: "0554443322", email: "ahmed@email.com", vehicles: [
    { plate: "JKL 4444", make: "Honda", model: "Accord 2024", color: "Blue", vin: "1HGCV1F34PA012345", mileage: "31,800 km", lastService: "2026-02-10", nextDue: "2026-05-10", totalSpent: 120 },
  ]},
  { id: "CV-004", owner: "Nora Hassan", phone: "0561112233", email: "nora@email.com", vehicles: [
    { plate: "GHI 3333", make: "Mercedes", model: "GLE 2025", color: "Gray", vin: "4JGFB4FB1MA567890", mileage: "15,200 km", lastService: "2026-02-12", nextDue: "2026-06-12", totalSpent: 320 },
  ]},
  { id: "CV-005", owner: "Faisal Al-Otaibi", phone: "0567778899", email: "faisal@email.com", vehicles: [
    { plate: "MNO 5555", make: "Tesla", model: "Model 3 2025", color: "Red", vin: "5YJ3E1EA1NF123456", mileage: "22,400 km", lastService: "2026-02-08", nextDue: "2026-08-08", totalSpent: 200 },
  ]},
  { id: "CV-006", owner: "Layla Nasser", phone: "0553334455", email: "layla@email.com", vehicles: [
    { plate: "PQR 6666", make: "Toyota", model: "Land Cruiser 2024", color: "White", vin: "JTMW73FH5MD654321", mileage: "48,900 km", lastService: "2026-01-28", nextDue: "2026-04-28", totalSpent: 1450 },
    { plate: "STU 7777", make: "Lexus", model: "ES350 2023", color: "Pearl White", vin: "JTHBK1GG5D2098765", mileage: "38,600 km", lastService: "2025-11-20", nextDue: "2026-02-20", totalSpent: 560 },
  ]},
];

const statusColors: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  reserved: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  sold: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  "in-progress": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "in-stock": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "low-stock": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "out-of-stock": "bg-destructive/15 text-destructive border-destructive/30",
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  maintenance: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  idle: "bg-muted text-muted-foreground border-border",
};

const validTabs = ["inventory", "services", "testdrives", "finance", "parts", "fleet", "servicehistory", "customersvehicles"] as const;
type TabValue = typeof validTabs[number];

const AutomotivePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null);
  const [compareList, setCompareList] = useState<typeof vehicles>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const tabFromUrl = searchParams.get("tab") as TabValue | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "inventory";

  const handleTabChange = (value: string) => {
    if (value === "inventory") {
      searchParams.delete("tab");
    } else {
      searchParams.set("tab", value);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const availableCount = vehicles.filter(v => v.status === "available").length;
  const totalValue = vehicles.filter(v => v.status === "available").reduce((s, v) => s + v.price, 0);

  // Finance calculator state
  const [vehiclePrice, setVehiclePrice] = useState(50000);
  const [downPayment, setDownPayment] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.5);
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
    : loanAmount / loanTerm;
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  // Trade-in estimator state
  const [tradeInMake, setTradeInMake] = useState("Toyota");
  const [tradeInModel, setTradeInModel] = useState("Camry");
  const [tradeInYear, setTradeInYear] = useState(2022);
  const [tradeInMileage, setTradeInMileage] = useState(45000);
  const [tradeInCondition, setTradeInCondition] = useState("good");

  const conditionMultiplier: Record<string, number> = { excellent: 0.85, good: 0.72, fair: 0.58, poor: 0.40 };
  const baseTradeValues: Record<string, number> = { Toyota: 28000, BMW: 42000, Mercedes: 45000, Honda: 24000, Tesla: 38000, Hyundai: 20000 };
  const estimatedTradeIn = Math.round(
    (baseTradeValues[tradeInMake] || 25000) *
    (conditionMultiplier[tradeInCondition] || 0.6) *
    Math.max(0.5, 1 - (2026 - tradeInYear) * 0.08) *
    Math.max(0.6, 1 - tradeInMileage / 200000)
  );

  // Loan comparison data
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [customBankName, setCustomBankName] = useState("");
  const [customBankRate, setCustomBankRate] = useState("");
  const [maxRateFilter, setMaxRateFilter] = useState<number>(10);

  const allBanks = [
    { name: "Saudi National Bank", rate: 3.9, maxTerm: 72, minDown: 15, processing: 500, features: ["No early payment fee", "Free insurance yr 1"] },
    { name: "Al Rajhi Bank", rate: 4.2, maxTerm: 60, minDown: 20, processing: 0, features: ["Zero processing fee", "Flexible payments"] },
    { name: "Riyad Bank", rate: 4.5, maxTerm: 84, minDown: 10, processing: 750, features: ["Longest tenure", "Low down payment"] },
    { name: "SABB Auto Finance", rate: 3.75, maxTerm: 60, minDown: 25, processing: 250, features: ["Lowest rate", "Salary transfer req."] },
    ...(customBankName.trim() && customBankRate ? [{ name: customBankName.trim(), rate: Number(customBankRate), maxTerm: 60, minDown: 20, processing: 0, features: ["Custom rate entry"] }] : []),
  ];

  const loanProviders = allBanks
    .filter(p => p.rate <= maxRateFilter)
    .filter(p => selectedBanks.length === 0 || selectedBanks.includes(p.name))
    .map(p => {
      const mr = p.rate / 100 / 12;
      const term = Math.min(loanTerm, p.maxTerm);
      const mp = mr > 0 ? (loanAmount * mr * Math.pow(1 + mr, term)) / (Math.pow(1 + mr, term) - 1) : loanAmount / term;
      const tp = mp * term;
      return { ...p, monthlyPayment: mp, totalPayment: tp, totalInterest: tp - loanAmount, effectiveTerm: term };
    }).sort((a, b) => a.monthlyPayment - b.monthlyPayment);

  // Inventory filters
  const [invSearch, setInvSearch] = useState("");
  const [invType, setInvType] = useState<string>("all");
  const [invStatus, setInvStatus] = useState<string>("all");
  const [invSort, setInvSort] = useState<string>("featured");

  const vehicleTypes = useMemo(() => Array.from(new Set(vehicles.map(v => v.type))), []);

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter(v => {
      const q = invSearch.toLowerCase();
      const matchSearch = !q || `${v.make} ${v.model}`.toLowerCase().includes(q) || v.color.toLowerCase().includes(q) || v.id.toLowerCase().includes(q);
      const matchType = invType === "all" || v.type === invType;
      const matchStatus = invStatus === "all" || v.status === invStatus;
      return matchSearch && matchType && matchStatus;
    });
    if (invSort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (invSort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (invSort === "hp") result.sort((a, b) => b.hp - a.hp);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [invSearch, invType, invStatus, invSort]);

  // Service booking detail dialog
  const [selectedService, setSelectedService] = useState<typeof serviceBookings[0] | null>(null);
  const todayBookings = serviceBookings.filter(s => s.date === "2026-02-20");
  const todayRevenue = todayBookings.reduce((s, b) => s + b.cost, 0);

  // Parts search & filters
  const [partsSearch, setPartsSearch] = useState("");
  const [partsBrand, setPartsBrand] = useState<string>("all");
  const [partsStatus, setPartsStatus] = useState<string>("all");
  const [selectedPart, setSelectedPart] = useState<typeof partsCatalog[0] | null>(null);

  const partBrands = useMemo(() => Array.from(new Set(partsCatalog.map(p => p.brand))), []);

  const filteredParts = useMemo(() => {
    return partsCatalog.filter(p => {
      const q = partsSearch.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.compat.toLowerCase().includes(q);
      const matchBrand = partsBrand === "all" || p.brand === partsBrand;
      const matchStatus = partsStatus === "all" || p.status === partsStatus;
      return matchSearch && matchBrand && matchStatus;
    });
  }, [partsSearch, partsBrand, partsStatus]);

  const totalPartsValue = partsCatalog.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStockParts = partsCatalog.filter(p => p.status === "low-stock" || p.status === "out-of-stock").length;

  // Service history filters
  const [shSearch, setShSearch] = useState("");
  const [shStatus, setShStatus] = useState<string>("all");
  const [shTechnician, setShTechnician] = useState<string>("all");
  const [shDateFrom, setShDateFrom] = useState<Date | undefined>(undefined);
  const [shDateTo, setShDateTo] = useState<Date | undefined>(undefined);

  const technicians = useMemo(() => Array.from(new Set(serviceHistory.map(s => s.technician))), []);

  const filteredServiceHistory = useMemo(() => {
    return serviceHistory.filter(s => {
      const q = shSearch.toLowerCase();
      const matchSearch = !q || s.customer.toLowerCase().includes(q) || s.vehicle.toLowerCase().includes(q) || s.service.toLowerCase().includes(q) || s.plate.toLowerCase().includes(q) || s.phone.includes(q) || s.id.toLowerCase().includes(q);
      const matchStatus = shStatus === "all" || s.status === shStatus;
      const matchTech = shTechnician === "all" || s.technician === shTechnician;
      const sDate = new Date(s.date);
      const matchFrom = !shDateFrom || sDate >= shDateFrom;
      const matchTo = !shDateTo || sDate <= shDateTo;
      return matchSearch && matchStatus && matchTech && matchFrom && matchTo;
    });
  }, [shSearch, shStatus, shTechnician, shDateFrom, shDateTo]);

  const hasActiveFilters = shSearch || shStatus !== "all" || shTechnician !== "all" || shDateFrom || shDateTo;

  const clearAllFilters = () => {
    setShSearch("");
    setShStatus("all");
    setShTechnician("all");
    setShDateFrom(undefined);
    setShDateTo(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automotive Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage vehicle inventory, services, and test drives</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Car className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{availableCount}</p><p className="text-xs text-muted-foreground">Available Vehicles</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">${(totalValue / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Inventory Value</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Wrench className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{serviceBookings.length}</p><p className="text-xs text-muted-foreground">Service Bookings</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><CalendarIcon className="h-5 w-5 text-violet-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{testDrives.length}</p><p className="text-xs text-muted-foreground">Test Drives</p></div>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="inventory" className="gap-1.5"><Car className="h-4 w-4" /> Inventory</TabsTrigger>
            <TabsTrigger value="services" className="gap-1.5"><Wrench className="h-4 w-4" /> Services</TabsTrigger>
            <TabsTrigger value="testdrives" className="gap-1.5"><Gauge className="h-4 w-4" /> Test Drives</TabsTrigger>
            <TabsTrigger value="finance" className="gap-1.5"><Calculator className="h-4 w-4" /> Finance</TabsTrigger>
            <TabsTrigger value="parts" className="gap-1.5"><Package className="h-4 w-4" /> Parts</TabsTrigger>
            <TabsTrigger value="fleet" className="gap-1.5"><Truck className="h-4 w-4" /> Fleet</TabsTrigger>
            <TabsTrigger value="servicehistory" className="gap-1.5"><History className="h-4 w-4" /> Service History</TabsTrigger>
            <TabsTrigger value="customersvehicles" className="gap-1.5"><UserCheck className="h-4 w-4" /> Customer Vehicles</TabsTrigger>
          </TabsList>

          {/* ============ Inventory Tab ============ */}
          <TabsContent value="inventory">
            <div className="space-y-4">
              {/* Filters Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search vehicles..." value={invSearch} onChange={e => setInvSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={invType} onValueChange={setInvType}>
                      <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {vehicleTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={invStatus} onValueChange={setInvStatus}>
                      <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={invSort} onValueChange={setInvSort}>
                      <SelectTrigger className="h-10 w-[140px] text-xs"><SelectValue placeholder="Sort" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured First</SelectItem>
                        <SelectItem value="price-asc">Price: Low â†’ High</SelectItem>
                        <SelectItem value="price-desc">Price: High â†’ Low</SelectItem>
                        <SelectItem value="hp">Horsepower</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Vehicle</Button>
                  </div>
                  {(invSearch || invType !== "all" || invStatus !== "all") && (
                    <p className="text-xs text-muted-foreground mt-2">Showing {filteredVehicles.length} of {vehicles.length} vehicles</p>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle Grid */}
              {filteredVehicles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredVehicles.map(v => (
                    <Card key={v.id} className={`hover:border-primary/40 transition-colors ${v.featured ? "ring-1 ring-primary/20" : ""}`}>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted"><Car className="h-6 w-6 text-muted-foreground" /></div>
                            <div>
                              <h3 className="font-semibold text-foreground">{v.make} {v.model}</h3>
                              <p className="text-xs text-muted-foreground">{v.type} â€¢ {v.color} â€¢ {v.mileage}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={statusColors[v.status]}>{v.status}</Badge>
                        </div>
                        {/* Quick specs */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-muted-foreground">HP</p>
                            <p className="font-bold text-foreground">{v.hp}</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-muted-foreground">Fuel</p>
                            <p className="font-bold text-foreground">{v.fuelType === "Electric" ? "EV" : v.fuelType.slice(0, 3)}</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-muted-foreground">Drive</p>
                            <p className="font-bold text-foreground">{v.drivetrain}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${v.price.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            {v.featured && <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">Featured</Badge>}
                            <span className="text-[11px] text-muted-foreground">{"â˜…".repeat(v.safetyRating)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedVehicle(v)}>Details</Button>
                          {v.status === "available" && (
                            <>
                              <Button size="sm" className="flex-1">Reserve</Button>
                              <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                                if (compareList.find(c => c.id === v.id)) {
                                  setCompareList(compareList.filter(c => c.id !== v.id));
                                } else if (compareList.length < 4) {
                                  setCompareList([...compareList, v]);
                                } else {
                                  toast({ title: "Max 4 vehicles", description: "Remove one to add another.", variant: "destructive" });
                                }
                              }}>
                                <GitCompareArrows className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Car className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-foreground">No vehicles found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                  </CardContent>
                </Card>
              )}

              {/* Compare floating bar */}
              {compareList.length >= 2 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card border border-primary/30 shadow-lg rounded-xl px-5 py-3 flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">{compareList.length} vehicles selected</span>
                  <Button size="sm" onClick={() => setShowCompare(true)} className="gap-1.5"><GitCompareArrows className="h-4 w-4" /> Compare</Button>
                  <Button size="sm" variant="ghost" onClick={() => setCompareList([])}><X className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ============ Services Tab ============ */}
          <TabsContent value="services">
            <div className="space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><CalendarIcon className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{todayBookings.length}</p><p className="text-xs text-muted-foreground">Today's Bookings</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${todayRevenue}</p><p className="text-xs text-muted-foreground">Today's Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Wrench className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{serviceBookings.filter(s => s.status === "in-progress").length}</p><p className="text-xs text-muted-foreground">In Progress</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10"><TrendingUp className="h-5 w-5 text-blue-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${serviceBookings.reduce((s, b) => s + b.cost, 0)}</p><p className="text-xs text-muted-foreground">Total Pipeline</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Service Bookings</CardTitle>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Booking</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {serviceBookings.map(s => (
                      <div key={s.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setSelectedService(s)}>
                        <div className="flex items-center gap-4">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.status === "in-progress" ? "bg-amber-500/10" : "bg-primary/10"}`}>
                            <Wrench className={`h-5 w-5 ${s.status === "in-progress" ? "text-amber-500" : "text-primary"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{s.service}</h4>
                              <Badge variant="outline" className={statusColors[s.status]}>{s.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{s.customer} â€¢ {s.vehicle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground">{s.date}</p>
                            <p className="text-sm font-medium text-foreground">{s.time}</p>
                          </div>
                          <span className="text-lg font-bold text-primary">${s.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Test Drives Tab ============ */}
          <TabsContent value="testdrives">
            <Card>
              <CardHeader><CardTitle className="text-base">Test Drive Requests</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testDrives.map(td => (
                    <div key={td.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Gauge className="h-5 w-5 text-primary" /></div>
                        <div>
                          <p className="font-medium text-foreground">{td.customer}</p>
                          <p className="text-xs text-muted-foreground">{td.vehicle} â€¢ {td.date} at {td.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColors[td.status]}>{td.status}</Badge>
                        {td.status === "pending" && <Button size="sm">Confirm</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ Finance Calculator Tab ============ */}
          <TabsContent value="finance">
            <div className="space-y-6">
              {/* EMI Calculator */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> EMI Calculator</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Vehicle Price ($)</label>
                      <Input type="number" value={vehiclePrice} onChange={e => setVehiclePrice(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Down Payment ($)</label>
                      <Input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Loan Term (months)</label>
                        <Input type="number" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Interest Rate (%)</label>
                        <Input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base">Payment Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                      <p className="text-4xl font-bold text-primary">${monthlyPayment.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground mt-1">for {loanTerm} months</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vehicle Price</span>
                        <span className="font-medium text-foreground">${vehiclePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Down Payment</span>
                        <span className="font-medium text-foreground">âˆ’${downPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-border pt-2">
                        <span className="text-muted-foreground">Loan Amount</span>
                        <span className="font-semibold text-foreground">${loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-medium text-amber-500">${totalInterest.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-border pt-2">
                        <span className="text-muted-foreground">Total Payment</span>
                        <span className="font-bold text-foreground">${totalPayment.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {[36, 48, 60].map(term => {
                        const mr = interestRate / 100 / 12;
                        const mp = mr > 0
                          ? (loanAmount * mr * Math.pow(1 + mr, term)) / (Math.pow(1 + mr, term) - 1)
                          : loanAmount / term;
                        return (
                          <button key={term} onClick={() => setLoanTerm(term)}
                            className={`rounded-lg border p-3 text-center transition-colors ${loanTerm === term ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                            <p className="text-xs text-muted-foreground">{term} mo</p>
                            <p className="text-sm font-bold text-foreground">${mp.toFixed(0)}/mo</p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loan Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Loan Comparison</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Compare financing options from multiple providers for ${loanAmount.toLocaleString()} loan</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Filters */}
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Settings className="h-3.5 w-3.5 text-primary" /> Filters & Custom Rate</p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Bank Filter */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-muted-foreground">Filter Banks</label>
                        <div className="flex flex-wrap gap-1.5">
                          {["Saudi National Bank", "Al Rajhi Bank", "Riyad Bank", "SABB Auto Finance"].map(bank => {
                            const isSelected = selectedBanks.includes(bank);
                            const shortName = bank.split(" ").slice(0, 2).join(" ");
                            return (
                              <button key={bank} onClick={() => setSelectedBanks(prev => isSelected ? prev.filter(b => b !== bank) : [...prev, bank])}
                                className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${isSelected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                                {shortName}
                              </button>
                            );
                          })}
                          {selectedBanks.length > 0 && (
                            <button onClick={() => setSelectedBanks([])} className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Max Rate Filter */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-muted-foreground">Max APR Rate (%)</label>
                        <div className="flex items-center gap-2">
                          <Input type="number" step="0.5" min="1" max="20" value={maxRateFilter} onChange={e => setMaxRateFilter(Number(e.target.value))} className="h-8 text-xs" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">â‰¤ {maxRateFilter}%</span>
                        </div>
                      </div>
                      {/* Custom Bank Name */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-muted-foreground">Custom Bank Name</label>
                        <Input placeholder="e.g. My Bank" value={customBankName} onChange={e => setCustomBankName(e.target.value)} className="h-8 text-xs" maxLength={50} />
                      </div>
                      {/* Custom Rate */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-muted-foreground">Custom APR (%)</label>
                        <Input type="number" step="0.1" min="0.5" max="20" placeholder="e.g. 3.5" value={customBankRate} onChange={e => setCustomBankRate(e.target.value)} className="h-8 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Provider Cards */}
                  {loanProviders.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {loanProviders.map((p, i) => (
                        <div key={p.name} className={`relative rounded-xl border p-4 space-y-3 transition-colors ${i === 0 ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/40"}`}>
                          {i === 0 && (
                            <Badge className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px]">Best Rate</Badge>
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{p.rate}% APR â€¢ up to {p.maxTerm} mo</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-2xl font-bold text-foreground">${p.monthlyPayment.toFixed(0)}</p>
                            <p className="text-[10px] text-muted-foreground">/month for {p.effectiveTerm} mo</p>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Interest</span>
                              <span className="font-medium text-amber-500">${p.totalInterest.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Min. Down</span>
                              <span className="font-medium text-foreground">{p.minDown}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Processing Fee</span>
                              <span className="font-medium text-foreground">{p.processing === 0 ? "Free" : `$${p.processing}`}</span>
                            </div>
                          </div>
                          <div className="space-y-1 pt-1">
                            {p.features.map(f => (
                              <div key={f} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                          <Button size="sm" variant={i === 0 ? "default" : "outline"} className="w-full text-xs">
                            Apply Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <p className="text-sm text-muted-foreground">No banks match the current filters. Try adjusting the max rate or clearing bank selection.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trade-in Value Estimator */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><ArrowRightLeft className="h-5 w-5 text-primary" /> Trade-in Value Estimator</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Make</label>
                        <Select value={tradeInMake} onValueChange={setTradeInMake}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["Toyota", "BMW", "Mercedes", "Honda", "Tesla", "Hyundai"].map(m => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Model</label>
                        <Input value={tradeInModel} onChange={e => setTradeInModel(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Year</label>
                        <Select value={String(tradeInYear)} onValueChange={v => setTradeInYear(Number(v))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Mileage (km)</label>
                        <Input type="number" value={tradeInMileage} onChange={e => setTradeInMileage(Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Condition</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(["excellent", "good", "fair", "poor"] as const).map(c => (
                          <button key={c} onClick={() => setTradeInCondition(c)}
                            className={`rounded-lg border p-2.5 text-center text-xs font-medium capitalize transition-colors ${tradeInCondition === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base">Trade-in Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Trade-in Value</p>
                      <p className="text-4xl font-bold text-emerald-500">${estimatedTradeIn.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">{tradeInYear} {tradeInMake} {tradeInModel} â€¢ {tradeInCondition}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Condition Score</span>
                          <span className="font-medium text-foreground capitalize">{tradeInCondition} ({Math.round((conditionMultiplier[tradeInCondition] || 0) * 100)}%)</span>
                        </div>
                        <Progress value={(conditionMultiplier[tradeInCondition] || 0) * 100} className="h-2" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Age Depreciation</span>
                          <span className="font-medium text-foreground">{2026 - tradeInYear} years ({Math.round(Math.max(50, 100 - (2026 - tradeInYear) * 8))}%)</span>
                        </div>
                        <Progress value={Math.max(50, 100 - (2026 - tradeInYear) * 8)} className="h-2" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Mileage Factor</span>
                          <span className="font-medium text-foreground">{tradeInMileage.toLocaleString()} km ({Math.round(Math.max(60, 100 - tradeInMileage / 2000))}%)</span>
                        </div>
                        <Progress value={Math.max(60, 100 - tradeInMileage / 2000)} className="h-2" />
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
                      <p className="text-sm font-medium text-foreground">With Trade-in Applied</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">New Vehicle Price</span>
                        <span className="font-medium text-foreground">${vehiclePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Trade-in Credit</span>
                        <span className="font-medium text-emerald-500">âˆ’${estimatedTradeIn.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-border pt-2">
                        <span className="text-muted-foreground">Net Price</span>
                        <span className="font-bold text-foreground">${Math.max(0, vehiclePrice - estimatedTradeIn).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full gap-2"><ArrowRightLeft className="h-4 w-4" /> Get Official Appraisal</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ============ Parts Catalog Tab ============ */}
          <TabsContent value="parts">
            <div className="space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Package className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{partsCatalog.length}</p><p className="text-xs text-muted-foreground">Total SKUs</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${totalPartsValue.toLocaleString()}</p><p className="text-xs text-muted-foreground">Inventory Value</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{lowStockParts}</p><p className="text-xs text-muted-foreground">Low / Out of Stock</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10"><BarChart3 className="h-5 w-5 text-blue-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{partsCatalog.reduce((s, p) => s + p.stock, 0)}</p><p className="text-xs text-muted-foreground">Total Units</p></div>
                </CardContent></Card>
              </div>

              {/* Reorder Alerts */}
              {lowStockParts > 0 && (
                <Card className="border-amber-500/30 bg-amber-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground">Reorder Alerts</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {partsCatalog.filter(p => p.status !== "in-stock").map(p => (
                            <Badge key={p.id} variant="outline" className={`${statusColors[p.status]} cursor-pointer`} onClick={() => setSelectedPart(p)}>
                              {p.name} â€” {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={() => toast({ title: "Purchase Orders Created", description: `${lowStockParts} reorder request(s) sent to suppliers.` })}>
                        <Plus className="h-4 w-4" /> Auto Reorder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Parts Catalog</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search parts..." value={partsSearch} onChange={e => setPartsSearch(e.target.value)} className="pl-9 w-48" />
                    </div>
                    <Select value={partsBrand} onValueChange={setPartsBrand}>
                      <SelectTrigger className="h-10 w-[120px] text-xs"><SelectValue placeholder="Brand" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {partBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={partsStatus} onValueChange={setPartsStatus}>
                      <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Part</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredParts.length > 0 ? (
                    <div className="space-y-3">
                      {filteredParts.map(p => (
                        <div key={p.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setSelectedPart(p)}>
                          <div className="flex items-center gap-4">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.status === "out-of-stock" ? "bg-destructive/10" : p.status === "low-stock" ? "bg-amber-500/10" : "bg-primary/10"}`}>
                              <Package className={`h-5 w-5 ${p.status === "out-of-stock" ? "text-destructive" : p.status === "low-stock" ? "text-amber-500" : "text-primary"}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{p.name}</h4>
                                <Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{p.brand} â€¢ {p.compat}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs text-muted-foreground">Stock</p>
                              <p className={`text-sm font-bold ${p.stock === 0 ? "text-destructive" : p.stock <= 5 ? "text-amber-500" : "text-foreground"}`}>{p.stock} units</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Value</p>
                              <p className="text-sm font-bold text-primary">${(p.price * p.stock).toLocaleString()}</p>
                            </div>
                            <span className="text-lg font-bold text-foreground">${p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground">No parts found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Fleet Management Tab ============ */}
          <TabsContent value="fleet">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Truck className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{fleetVehicles.filter(f => f.status === "active").length}</p><p className="text-xs text-muted-foreground">Active Vehicles</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Wrench className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{fleetVehicles.filter(f => f.status === "maintenance").length}</p><p className="text-xs text-muted-foreground">In Maintenance</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><Car className="h-5 w-5 text-muted-foreground" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{fleetVehicles.filter(f => f.status === "idle").length}</p><p className="text-xs text-muted-foreground">Idle</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10"><Fuel className="h-5 w-5 text-blue-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{Math.round(fleetVehicles.reduce((s, f) => s + f.fuel, 0) / fleetVehicles.length)}%</p><p className="text-xs text-muted-foreground">Avg. Fuel Level</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Fleet Vehicles</CardTitle>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Vehicle</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fleetVehicles.map(f => (
                      <div key={f.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted"><Truck className="h-5 w-5 text-muted-foreground" /></div>
                          <div>
                            <p className="font-medium text-foreground">{f.vehicle}</p>
                            <p className="text-xs text-muted-foreground">{f.plate} â€¢ Driver: {f.driver}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{f.mileage}</span>
                            <div className="flex items-center gap-1">
                              <Fuel className="h-3.5 w-3.5" />
                              <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                                <div className={`h-full rounded-full ${f.fuel > 50 ? "bg-emerald-500" : f.fuel > 20 ? "bg-amber-500" : "bg-destructive"}`} style={{ width: `${f.fuel}%` }} />
                              </div>
                              <span>{f.fuel}%</span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Wrench className="h-3 w-3" /> {f.nextService}
                            </span>
                          </div>
                          <Badge variant="outline" className={statusColors[f.status]}>{f.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Service History Tab ============ */}
          <TabsContent value="servicehistory">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><ClipboardList className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredServiceHistory.length}</p><p className="text-xs text-muted-foreground">{hasActiveFilters ? "Filtered" : "Total"} Records</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredServiceHistory.filter(s => s.status === "completed").length}</p><p className="text-xs text-muted-foreground">Completed</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><DollarSign className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${filteredServiceHistory.reduce((s, r) => s + r.cost, 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Users className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{new Set(filteredServiceHistory.map(s => s.customer)).size}</p><p className="text-xs text-muted-foreground">Unique Customers</p></div>
                </CardContent></Card>
              </div>

              {/* Search & Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    {/* Row 1: Search + Add */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by customer, vehicle, service, plate, phone..."
                          value={shSearch}
                          onChange={e => setShSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button size="sm" className="gap-1.5 shrink-0"><Plus className="h-4 w-4" /> Add Record</Button>
                    </div>

                    {/* Row 2: Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Filter className="h-3.5 w-3.5" /> Filters:
                      </div>

                      {/* Status */}
                      <Select value={shStatus} onValueChange={setShStatus}>
                        <SelectTrigger className="h-8 w-[130px] text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Technician */}
                      <Select value={shTechnician} onValueChange={setShTechnician}>
                        <SelectTrigger className="h-8 w-[150px] text-xs">
                          <SelectValue placeholder="Technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Technicians</SelectItem>
                          {technicians.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Date From */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs font-normal", !shDateFrom && "text-muted-foreground")}>
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {shDateFrom ? format(shDateFrom, "MMM d, yyyy") : "From date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={shDateFrom} onSelect={setShDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
                        </PopoverContent>
                      </Popover>

                      {/* Date To */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs font-normal", !shDateTo && "text-muted-foreground")}>
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {shDateTo ? format(shDateTo, "MMM d, yyyy") : "To date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={shDateTo} onSelect={setShDateTo} initialFocus className={cn("p-3 pointer-events-auto")} />
                        </PopoverContent>
                      </Popover>

                      {/* Clear */}
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={clearAllFilters}>
                          <X className="h-3.5 w-3.5" /> Clear all
                        </Button>
                      )}
                    </div>

                    {/* Active filters summary */}
                    {hasActiveFilters && (
                      <p className="text-xs text-muted-foreground">
                        Showing {filteredServiceHistory.length} of {serviceHistory.length} records
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Records */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><History className="h-5 w-5 text-primary" /> Service Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredServiceHistory.length > 0 ? (
                    <div className="space-y-3">
                      {filteredServiceHistory.map(s => (
                        <div key={s.id} className="rounded-xl border border-border p-4 space-y-3 hover:border-primary/30 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                <Wrench className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{s.service}</h4>
                                  <Badge variant="outline" className={statusColors[s.status]}>{s.status}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{s.vehicle} â€¢ {s.plate} â€¢ {s.date}</p>
                              </div>
                            </div>
                            <span className="text-lg font-bold text-primary">${s.cost}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="space-y-0.5">
                              <span className="text-muted-foreground">Customer</span>
                              <p className="font-medium text-foreground">{s.customer}</p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-muted-foreground">Phone</span>
                              <p className="font-medium text-foreground">{s.phone}</p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-muted-foreground">Technician</span>
                              <p className="font-medium text-foreground">{s.technician}</p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-muted-foreground">Record ID</span>
                              <p className="font-mono text-foreground">{s.id}</p>
                            </div>
                          </div>
                          {s.parts.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-[11px] text-muted-foreground mr-1">Parts:</span>
                              {s.parts.map(p => (
                                <Badge key={p} variant="outline" className="text-[10px] bg-muted/50">{p}</Badge>
                              ))}
                            </div>
                          )}
                          {s.notes && (
                            <div className="rounded-lg bg-muted/30 border border-border px-3 py-2">
                              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                                {s.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground">No records found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
                      <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={clearAllFilters}>
                        <X className="h-3.5 w-3.5" /> Clear all filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Customer Vehicles Tab ============ */}
          <TabsContent value="customersvehicles">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{customerVehicles.length}</p><p className="text-xs text-muted-foreground">Registered Customers</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Car className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{customerVehicles.reduce((s, c) => s + c.vehicles.length, 0)}</p><p className="text-xs text-muted-foreground">Total Vehicles</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><DollarSign className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${customerVehicles.reduce((s, c) => s + c.vehicles.reduce((vs, v) => vs + v.totalSpent, 0), 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Lifetime Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{customerVehicles.reduce((s, c) => s + c.vehicles.filter(v => new Date(v.nextDue) <= new Date("2026-03-01")).length, 0)}</p><p className="text-xs text-muted-foreground">Service Due Soon</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" /> Customer Vehicle Registry</CardTitle>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Customer</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerVehicles.map(c => (
                      <div key={c.id} className="rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors">
                        {/* Customer Header */}
                        <div className="flex items-center justify-between bg-muted/30 px-5 py-3 border-b border-border">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                              {c.owner.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{c.owner}</h4>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{c.vehicles.length} vehicle{c.vehicles.length > 1 ? "s" : ""}</Badge>
                            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                              ${c.vehicles.reduce((s, v) => s + v.totalSpent, 0).toLocaleString()} spent
                            </Badge>
                          </div>
                        </div>

                        {/* Vehicles */}
                        <div className="divide-y divide-border">
                          {c.vehicles.map(v => {
                            const isDueSoon = new Date(v.nextDue) <= new Date("2026-03-01");
                            return (
                              <div key={v.plate} className="px-5 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-foreground text-sm">{v.make} {v.model}</p>
                                      <Badge variant="outline" className="text-[10px]">{v.plate}</Badge>
                                      <span className="text-[10px] text-muted-foreground">{v.color}</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">VIN: {v.vin} â€¢ {v.mileage}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                  <div className="text-right hidden sm:block">
                                    <p className="text-muted-foreground">Last Service</p>
                                    <p className="font-medium text-foreground">{v.lastService}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-muted-foreground">Next Due</p>
                                    <p className={`font-medium ${isDueSoon ? "text-destructive" : "text-foreground"}`}>
                                      {v.nextDue} {isDueSoon && <AlertTriangle className="h-3 w-3 inline ml-0.5" />}
                                    </p>
                                  </div>
                                  <div className="text-right hidden md:block">
                                    <p className="text-muted-foreground">Spent</p>
                                    <p className="font-bold text-primary">${v.totalSpent.toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Vehicle Detail Modal */}
        <Dialog open={!!selectedVehicle} onOpenChange={(open) => { if (!open) setSelectedVehicle(null); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            {selectedVehicle && (
              <>
                {/* Hero section */}
                <div className="relative bg-muted rounded-t-lg p-8 flex flex-col items-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-background shadow-md">
                    <Car className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mt-4">{selectedVehicle.make} {selectedVehicle.model}</h2>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.type} â€¢ {selectedVehicle.color} â€¢ {selectedVehicle.mileage}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-bold text-primary">${selectedVehicle.price.toLocaleString()}</span>
                    <Badge variant="outline" className={statusColors[selectedVehicle.status]}>{selectedVehicle.status}</Badge>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Specifications */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Cog className="h-4 w-4 text-primary" /> Specifications</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Engine", value: selectedVehicle.engine, icon: <Zap className="h-4 w-4" /> },
                        { label: "Horsepower", value: `${selectedVehicle.hp} HP`, icon: <Gauge className="h-4 w-4" /> },
                        { label: "Transmission", value: selectedVehicle.transmission, icon: <Cog className="h-4 w-4" /> },
                        { label: "Drivetrain", value: selectedVehicle.drivetrain, icon: <Car className="h-4 w-4" /> },
                        { label: "Fuel Type", value: selectedVehicle.fuelType, icon: <Fuel className="h-4 w-4" /> },
                        { label: "Seats", value: `${selectedVehicle.seats} Seats`, icon: <Users className="h-4 w-4" /> },
                        { label: "Warranty", value: selectedVehicle.warranty, icon: <Shield className="h-4 w-4" /> },
                        { label: "Safety", value: `${"â˜…".repeat(selectedVehicle.safetyRating)}`, icon: <Star className="h-4 w-4" /> },
                      ].map(spec => (
                        <div key={spec.label} className="rounded-xl border border-border p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">{spec.icon}<span className="text-[11px]">{spec.label}</span></div>
                          <p className="text-sm font-medium text-foreground">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Key Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVehicle.features.map(f => (
                        <Badge key={f} variant="outline" className="bg-primary/5 text-foreground border-primary/20 text-xs py-1 px-2.5">
                          <CheckCircle2 className="h-3 w-3 text-primary mr-1.5" />{f}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Contact / Inquiry Form */}
                  <div className="border-t border-border pt-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Inquire About This Vehicle</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                        <Input placeholder="John Doe" value={contactName} onChange={e => setContactName(e.target.value)} maxLength={100} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <Input type="email" placeholder="john@example.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} maxLength={255} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Phone</label>
                        <Input type="tel" placeholder="+966 5XX XXX XXXX" value={contactPhone} onChange={e => setContactPhone(e.target.value)} maxLength={20} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Preferred Contact</label>
                        <Select defaultValue="email">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5 mt-3">
                      <label className="text-xs font-medium text-muted-foreground">Message</label>
                      <Textarea placeholder={`I'm interested in the ${selectedVehicle.make} ${selectedVehicle.model}...`} value={contactMessage} onChange={e => setContactMessage(e.target.value)} maxLength={1000} rows={3} />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button className="flex-1 gap-2" onClick={() => {
                        if (!contactName.trim() || !contactEmail.trim()) {
                          toast({ title: "Please fill required fields", description: "Name and email are required.", variant: "destructive" });
                          return;
                        }
                        toast({ title: "Inquiry Sent!", description: `Your inquiry about the ${selectedVehicle.make} ${selectedVehicle.model} has been submitted.` });
                        setContactName(""); setContactEmail(""); setContactPhone(""); setContactMessage("");
                        setSelectedVehicle(null);
                      }}>
                        <Mail className="h-4 w-4" /> Send Inquiry
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={() => {
                        toast({ title: "Test Drive Requested", description: `We'll contact you to schedule a test drive for the ${selectedVehicle.make} ${selectedVehicle.model}.` });
                      }}>
                        <Gauge className="h-4 w-4" /> Book Test Drive
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        {/* ============ Vehicle Comparison Dialog ============ */}
        <Dialog open={showCompare} onOpenChange={setShowCompare}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between gap-4">
              <DialogTitle className="flex items-center gap-2"><GitCompareArrows className="h-5 w-5 text-primary" /> Vehicle Comparison</DialogTitle>
              {compareList.length >= 2 && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => {
                  const doc = new jsPDF({ orientation: "landscape" });
                  const pageW = doc.internal.pageSize.getWidth();
                  const pageH = doc.internal.pageSize.getHeight();

                  // === Dealer Logo Placeholder ===
                  doc.setFillColor(59, 130, 246);
                  doc.roundedRect(14, 10, 14, 14, 3, 3, "F");
                  doc.setTextColor(255, 255, 255);
                  doc.setFontSize(16);
                  doc.text("A", 18, 21);

                  // === Company Name & Dealership Info ===
                  doc.setTextColor(30, 41, 59);
                  doc.setFontSize(20);
                  doc.text("AutoHub Motors", 34, 18);
                  doc.setFontSize(9);
                  doc.setTextColor(100, 116, 139);
                  doc.text("King Fahd Road, Riyadh 12345, Saudi Arabia", 34, 24);
                  doc.text("Tel: +966 11 234 5678  |  info@autohubmotors.com  |  www.autohubmotors.com", 34, 29);

                  // === Divider & Title ===
                  doc.setDrawColor(59, 130, 246);
                  doc.setLineWidth(0.5);
                  doc.line(14, 34, pageW - 14, 34);
                  doc.setTextColor(30, 41, 59);
                  doc.setFontSize(14);
                  doc.text("Vehicle Comparison Report", 14, 42);
                  doc.setFontSize(9);
                  doc.setTextColor(100, 116, 139);
                  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}  |  ${compareList.length} vehicles compared`, pageW - 14, 42, { align: "right" });

                  const specRows = [
                    { label: "Price", fmt: (v: typeof vehicles[0]) => `$${v.price.toLocaleString()}` },
                    { label: "Type", fmt: (v: typeof vehicles[0]) => v.type },
                    { label: "Engine", fmt: (v: typeof vehicles[0]) => v.engine },
                    { label: "Horsepower", fmt: (v: typeof vehicles[0]) => `${v.hp} HP` },
                    { label: "Transmission", fmt: (v: typeof vehicles[0]) => v.transmission },
                    { label: "Drivetrain", fmt: (v: typeof vehicles[0]) => v.drivetrain },
                    { label: "Fuel Type", fmt: (v: typeof vehicles[0]) => v.fuelType },
                    { label: "Seats", fmt: (v: typeof vehicles[0]) => `${v.seats}` },
                    { label: "Color", fmt: (v: typeof vehicles[0]) => v.color },
                    { label: "Mileage", fmt: (v: typeof vehicles[0]) => v.mileage },
                    { label: "Warranty", fmt: (v: typeof vehicles[0]) => v.warranty },
                    { label: "Safety Rating", fmt: (v: typeof vehicles[0]) => `${"â˜…".repeat(v.safetyRating)}/5` },
                    { label: "Status", fmt: (v: typeof vehicles[0]) => v.status },
                    { label: "Features", fmt: (v: typeof vehicles[0]) => v.features.join(", ") },
                  ];

                  const head = ["Specification", ...compareList.map(v => `${v.make} ${v.model}`)];
                  const body = specRows.map(r => [r.label, ...compareList.map(v => r.fmt(v))]);

                  autoTable(doc, {
                    startY: 48,
                    head: [head],
                    body,
                    styles: { fontSize: 9, cellPadding: 4 },
                    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
                    alternateRowStyles: { fillColor: [245, 247, 250] },
                    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
                  });

                  // === Footer ===
                  doc.setFontSize(8);
                  doc.setTextColor(148, 163, 184);
                  doc.text("This comparison is for informational purposes only. Prices and specifications are subject to change.", 14, pageH - 10);
                  doc.text("\u00a9 2026 AutoHub Motors. All rights reserved.", pageW - 14, pageH - 10, { align: "right" });

                  doc.save("vehicle-comparison.pdf");
                  toast({ title: "PDF Downloaded", description: "Comparison report saved as vehicle-comparison.pdf" });
                }}>
                  <Download className="h-4 w-4" /> Export PDF
                </Button>
              )}
            </DialogHeader>
            {compareList.length >= 2 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px] font-semibold">Specification</TableHead>
                      {compareList.map(v => (
                        <TableHead key={v.id} className="min-w-[160px] text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Car className="h-5 w-5 text-primary" /></div>
                            <span className="font-semibold text-foreground">{v.make} {v.model}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Price", key: "price", format: (v: typeof vehicles[0]) => `$${v.price.toLocaleString()}` },
                      { label: "Type", key: "type", format: (v: typeof vehicles[0]) => v.type },
                      { label: "Engine", key: "engine", format: (v: typeof vehicles[0]) => v.engine },
                      { label: "Horsepower", key: "hp", format: (v: typeof vehicles[0]) => `${v.hp} HP` },
                      { label: "Transmission", key: "transmission", format: (v: typeof vehicles[0]) => v.transmission },
                      { label: "Drivetrain", key: "drivetrain", format: (v: typeof vehicles[0]) => v.drivetrain },
                      { label: "Fuel Type", key: "fuelType", format: (v: typeof vehicles[0]) => v.fuelType },
                      { label: "Seats", key: "seats", format: (v: typeof vehicles[0]) => `${v.seats}` },
                      { label: "Color", key: "color", format: (v: typeof vehicles[0]) => v.color },
                      { label: "Mileage", key: "mileage", format: (v: typeof vehicles[0]) => v.mileage },
                      { label: "Warranty", key: "warranty", format: (v: typeof vehicles[0]) => v.warranty },
                      { label: "Safety Rating", key: "safetyRating", format: (v: typeof vehicles[0]) => "â˜…".repeat(v.safetyRating) },
                      { label: "Status", key: "status", format: (v: typeof vehicles[0]) => v.status },
                    ].map(row => {
                      // Highlight best value for numeric comparisons
                      const values = compareList.map(v => row.format(v));
                      const numericKeys = ["hp", "seats", "safetyRating"];
                      const lowerBetterKeys = ["price"];
                      let bestIdx = -1;
                      if (numericKeys.includes(row.key)) {
                        const nums = compareList.map(v => (v as any)[row.key] as number);
                        bestIdx = nums.indexOf(Math.max(...nums));
                      } else if (lowerBetterKeys.includes(row.key)) {
                        const nums = compareList.map(v => (v as any)[row.key] as number);
                        bestIdx = nums.indexOf(Math.min(...nums));
                      }
                      return (
                        <TableRow key={row.key}>
                          <TableCell className="font-medium text-muted-foreground">{row.label}</TableCell>
                          {compareList.map((v, i) => (
                            <TableCell key={v.id} className={`text-center ${i === bestIdx ? "text-primary font-semibold" : "text-foreground"}`}>
                              {row.format(v)}
                              {i === bestIdx && <span className="ml-1 text-[10px]">âœ“</span>}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                    {/* Features row */}
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground align-top">Features</TableCell>
                      {compareList.map(v => (
                        <TableCell key={v.id} className="text-center">
                          <div className="flex flex-col gap-1">
                            {v.features.map(f => (
                              <Badge key={f} variant="outline" className="text-[10px] justify-center">{f}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ============ Service Detail Dialog ============ */}
        <Dialog open={!!selectedService} onOpenChange={(open) => { if (!open) setSelectedService(null); }}>
          <DialogContent className="max-w-md">
            {selectedService && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> {selectedService.service}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Booking ID", value: selectedService.id },
                      { label: "Customer", value: selectedService.customer },
                      { label: "Vehicle", value: selectedService.vehicle },
                      { label: "Status", value: selectedService.status },
                      { label: "Date", value: selectedService.date },
                      { label: "Time", value: selectedService.time },
                    ].map(item => (
                      <div key={item.label} className="space-y-0.5">
                        <p className="text-[11px] text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Estimated Cost</p>
                    <p className="text-3xl font-bold text-primary">${selectedService.cost}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedService.status === "scheduled" && (
                      <Button className="flex-1 gap-1.5" onClick={() => { toast({ title: "Service Started", description: `${selectedService.service} is now in progress.` }); setSelectedService(null); }}>
                        <Wrench className="h-4 w-4" /> Start Service
                      </Button>
                    )}
                    {selectedService.status === "in-progress" && (
                      <Button className="flex-1 gap-1.5" onClick={() => { toast({ title: "Service Completed", description: `${selectedService.service} has been completed.` }); setSelectedService(null); }}>
                        <CheckCircle2 className="h-4 w-4" /> Mark Complete
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1 gap-1.5" onClick={() => setSelectedService(null)}>Close</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ============ Part Detail Dialog ============ */}
        <Dialog open={!!selectedPart} onOpenChange={(open) => { if (!open) setSelectedPart(null); }}>
          <DialogContent className="max-w-md">
            {selectedPart && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> {selectedPart.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Part ID", value: selectedPart.id },
                      { label: "Brand", value: selectedPart.brand },
                      { label: "Compatibility", value: selectedPart.compat },
                      { label: "Status", value: selectedPart.status },
                    ].map(item => (
                      <div key={item.label} className="space-y-0.5">
                        <p className="text-[11px] text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
                      <p className="text-[11px] text-muted-foreground">Unit Price</p>
                      <p className="text-xl font-bold text-primary">${selectedPart.price}</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                      <p className="text-[11px] text-muted-foreground">In Stock</p>
                      <p className={`text-xl font-bold ${selectedPart.stock === 0 ? "text-destructive" : selectedPart.stock <= 5 ? "text-amber-500" : "text-foreground"}`}>{selectedPart.stock}</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                      <p className="text-[11px] text-muted-foreground">Total Value</p>
                      <p className="text-xl font-bold text-foreground">${(selectedPart.price * selectedPart.stock).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedPart.stock <= 5 && (
                    <div className={`rounded-lg p-3 flex items-center gap-2 text-sm ${selectedPart.stock === 0 ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"}`}>
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {selectedPart.stock === 0 ? "This part is out of stock. Reorder immediately." : `Low stock warning â€” only ${selectedPart.stock} units remaining.`}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-1.5" onClick={() => { toast({ title: "Reorder Placed", description: `Reorder for ${selectedPart.name} sent to supplier.` }); setSelectedPart(null); }}>
                      <Plus className="h-4 w-4" /> Reorder
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedPart(null)}>Close</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default AutomotivePage;

