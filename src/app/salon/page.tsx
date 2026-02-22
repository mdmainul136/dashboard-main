"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Scissors, Calendar, Users, Star, Plus, Clock, CreditCard, Gift, UserCheck, CheckCircle2, X,
  Sparkles, History, CalendarClock, TrendingUp, DollarSign, Search, Phone, Mail, Award,
  ChevronRight, Heart, Eye, MapPin,
} from "lucide-react";

// â”€â”€â”€ Interfaces â”€â”€â”€
interface Booking {
  id: string; client: string; service: string; stylist: string; date: string; time: string;
  duration: string; price: number; status: "confirmed" | "completed" | "cancelled" | "no-show";
}

interface StylistProfile {
  id: string; name: string; specialty: string; rating: number; totalClients: number;
  activeClients: number; todayBookings: number; monthlyRevenue: number; experience: string;
  certifications: string[]; status: "available" | "in-session" | "off-duty";
  avatar: string; phone: string; email: string; retentionRate: number;
  schedule: string; services: string[];
}

interface ServiceCatalogItem {
  name: string; price: number; duration: string; category: string; popularity: number;
  description: string; monthlyBookings: number; revenue: number; trending: boolean;
}

interface StaffSchedule {
  stylist: string; day: string; shift: string; bookings: number; capacity: number;
  status: "available" | "busy" | "off";
}

interface CustomerRecord {
  id: string; name: string; visits: number; totalSpent: number; lastVisit: string;
  favoriteService: string; loyaltyPoints: number; rating: number;
}

// â”€â”€â”€ Mock Data â”€â”€â”€
const mockBookings: Booking[] = [
  { id: "B-001", client: "Sara Ahmed", service: "Haircut & Blow Dry", stylist: "Nadia", date: "2026-02-20", time: "10:00", duration: "60 min", price: 150, status: "confirmed" },
  { id: "B-002", client: "Mona Khalid", service: "Full Color", stylist: "Reem", date: "2026-02-20", time: "11:00", duration: "120 min", price: 350, status: "confirmed" },
  { id: "B-003", client: "Hala Farouk", service: "Facial Treatment", stylist: "Lina", date: "2026-02-20", time: "13:00", duration: "90 min", price: 280, status: "completed" },
  { id: "B-004", client: "Dina Nasser", service: "Manicure & Pedicure", stylist: "Nadia", date: "2026-02-20", time: "14:30", duration: "75 min", price: 200, status: "confirmed" },
  { id: "B-005", client: "Rana Yousef", service: "Bridal Package", stylist: "Reem", date: "2026-02-21", time: "09:00", duration: "180 min", price: 1200, status: "confirmed" },
  { id: "B-006", client: "Layla Hassan", service: "Keratin Treatment", stylist: "Nadia", date: "2026-02-21", time: "11:00", duration: "180 min", price: 600, status: "confirmed" },
  { id: "B-007", client: "Fatima Ali", service: "Deep Tissue Massage", stylist: "Lina", date: "2026-02-22", time: "14:00", duration: "60 min", price: 320, status: "confirmed" },
  { id: "B-008", client: "Noor Salem", service: "Gel Nails", stylist: "Amal", date: "2026-02-20", time: "15:00", duration: "60 min", price: 180, status: "completed" },
  { id: "B-009", client: "Amira Fayed", service: "Highlights", stylist: "Reem", date: "2026-02-22", time: "10:00", duration: "150 min", price: 450, status: "confirmed" },
  { id: "B-010", client: "Sara Ahmed", service: "Eyebrow Threading", stylist: "Amal", date: "2026-02-20", time: "16:00", duration: "15 min", price: 50, status: "no-show" },
];

const services = [
  { name: "Haircut & Blow Dry", price: 150, duration: "60 min", category: "Hair" },
  { name: "Full Color", price: 350, duration: "120 min", category: "Hair" },
  { name: "Highlights", price: 450, duration: "150 min", category: "Hair" },
  { name: "Facial Treatment", price: 280, duration: "90 min", category: "Skin" },
  { name: "Manicure & Pedicure", price: 200, duration: "75 min", category: "Nails" },
  { name: "Bridal Package", price: 1200, duration: "180 min", category: "Special" },
  { name: "Deep Tissue Massage", price: 320, duration: "60 min", category: "Spa" },
  { name: "Keratin Treatment", price: 600, duration: "180 min", category: "Hair" },
];

const stylistNames = ["Nadia", "Reem", "Lina", "Amal"];

const stylistProfiles: StylistProfile[] = [
  { id: "ST1", name: "Nadia", specialty: "Hair Specialist", rating: 4.9, totalClients: 156, activeClients: 42, todayBookings: 5, monthlyRevenue: 12800, experience: "8 years", certifications: ["L'Oreal Certified", "Keratin Expert", "Bridal Styling"], status: "available", avatar: "ðŸ’‡â€â™€ï¸", phone: "+966-50-111-2222", email: "nadia@salon.com", retentionRate: 94, schedule: "Sun-Thu 9AM-5PM", services: ["Haircut", "Color", "Keratin", "Bridal"] },
  { id: "ST2", name: "Reem", specialty: "Color Expert", rating: 5.0, totalClients: 128, activeClients: 35, todayBookings: 3, monthlyRevenue: 14200, experience: "6 years", certifications: ["Wella Color Master", "Balayage Specialist", "Hair Extensions"], status: "in-session", avatar: "ðŸŽ¨", phone: "+966-50-333-4444", email: "reem@salon.com", retentionRate: 96, schedule: "Sun-Thu 10AM-6PM", services: ["Color", "Highlights", "Balayage", "Bridal"] },
  { id: "ST3", name: "Lina", specialty: "Skin & Spa", rating: 4.8, totalClients: 98, activeClients: 28, todayBookings: 2, monthlyRevenue: 9500, experience: "5 years", certifications: ["Dermalogica Certified", "Massage Therapy", "Chemical Peel Expert"], status: "available", avatar: "ðŸ§–â€â™€ï¸", phone: "+966-50-555-6666", email: "lina@salon.com", retentionRate: 91, schedule: "Sun-Fri 12PM-8PM", services: ["Facial", "Massage", "Chemical Peel", "Body Wrap"] },
  { id: "ST4", name: "Amal", specialty: "Bridal & Nails", rating: 4.9, totalClients: 112, activeClients: 38, todayBookings: 4, monthlyRevenue: 11200, experience: "7 years", certifications: ["Nail Art Certified", "Bridal Makeup Artist", "Threading Expert"], status: "off-duty", avatar: "ðŸ’…", phone: "+966-50-777-8888", email: "amal@salon.com", retentionRate: 92, schedule: "Sun-Wed 9AM-3PM", services: ["Manicure", "Gel Nails", "Bridal", "Threading"] },
];

const serviceCatalog: ServiceCatalogItem[] = [
  { name: "Haircut & Blow Dry", price: 150, duration: "60 min", category: "Hair", popularity: 95, description: "Professional cut with styling blow dry", monthlyBookings: 145, revenue: 21750, trending: false },
  { name: "Full Color", price: 350, duration: "120 min", category: "Hair", popularity: 82, description: "Complete hair coloring with premium products", monthlyBookings: 68, revenue: 23800, trending: true },
  { name: "Highlights", price: 450, duration: "150 min", category: "Hair", popularity: 78, description: "Balayage or foil highlights", monthlyBookings: 52, revenue: 23400, trending: true },
  { name: "Keratin Treatment", price: 600, duration: "180 min", category: "Hair", popularity: 70, description: "Smoothing keratin for frizz-free hair", monthlyBookings: 35, revenue: 21000, trending: false },
  { name: "Facial Treatment", price: 280, duration: "90 min", category: "Skin", popularity: 88, description: "Deep cleansing facial with mask", monthlyBookings: 82, revenue: 22960, trending: false },
  { name: "Chemical Peel", price: 320, duration: "60 min", category: "Skin", popularity: 62, description: "Exfoliating chemical peel treatment", monthlyBookings: 28, revenue: 8960, trending: false },
  { name: "Manicure & Pedicure", price: 200, duration: "75 min", category: "Nails", popularity: 90, description: "Full nail care with polish", monthlyBookings: 120, revenue: 24000, trending: false },
  { name: "Gel Nails", price: 180, duration: "60 min", category: "Nails", popularity: 85, description: "Long-lasting gel nail application", monthlyBookings: 95, revenue: 17100, trending: true },
  { name: "Bridal Package", price: 1200, duration: "180 min", category: "Special", popularity: 65, description: "Complete bridal hair, makeup & nails", monthlyBookings: 12, revenue: 14400, trending: false },
  { name: "Deep Tissue Massage", price: 320, duration: "60 min", category: "Spa", popularity: 76, description: "Therapeutic deep tissue massage", monthlyBookings: 48, revenue: 15360, trending: false },
  { name: "Hot Stone Massage", price: 380, duration: "75 min", category: "Spa", popularity: 72, description: "Relaxing hot stone therapy", monthlyBookings: 32, revenue: 12160, trending: false },
  { name: "Eyebrow Threading", price: 50, duration: "15 min", category: "Beauty", popularity: 92, description: "Precise eyebrow shaping", monthlyBookings: 210, revenue: 10500, trending: false },
];

const staffSchedules: StaffSchedule[] = [
  { stylist: "Nadia", day: "Mon", shift: "09:00â€“17:00", bookings: 5, capacity: 6, status: "available" },
  { stylist: "Nadia", day: "Tue", shift: "09:00â€“17:00", bookings: 6, capacity: 6, status: "busy" },
  { stylist: "Nadia", day: "Wed", shift: "â€”", bookings: 0, capacity: 0, status: "off" },
  { stylist: "Reem", day: "Mon", shift: "10:00â€“18:00", bookings: 3, capacity: 5, status: "available" },
  { stylist: "Reem", day: "Tue", shift: "10:00â€“18:00", bookings: 5, capacity: 5, status: "busy" },
  { stylist: "Reem", day: "Wed", shift: "10:00â€“18:00", bookings: 4, capacity: 5, status: "available" },
  { stylist: "Lina", day: "Mon", shift: "12:00â€“20:00", bookings: 2, capacity: 4, status: "available" },
  { stylist: "Lina", day: "Tue", shift: "12:00â€“20:00", bookings: 4, capacity: 4, status: "busy" },
  { stylist: "Lina", day: "Wed", shift: "12:00â€“20:00", bookings: 3, capacity: 4, status: "available" },
  { stylist: "Amal", day: "Mon", shift: "09:00â€“15:00", bookings: 3, capacity: 4, status: "available" },
  { stylist: "Amal", day: "Tue", shift: "â€”", bookings: 0, capacity: 0, status: "off" },
  { stylist: "Amal", day: "Wed", shift: "09:00â€“15:00", bookings: 2, capacity: 4, status: "available" },
];

const customerHistory: CustomerRecord[] = [
  { id: "CL-01", name: "Sara Ahmed", visits: 24, totalSpent: 4800, lastVisit: "2026-02-18", favoriteService: "Haircut & Blow Dry", loyaltyPoints: 2450, rating: 5.0 },
  { id: "CL-02", name: "Mona Khalid", visits: 18, totalSpent: 5200, lastVisit: "2026-02-15", favoriteService: "Full Color", loyaltyPoints: 1820, rating: 4.9 },
  { id: "CL-03", name: "Hala Farouk", visits: 15, totalSpent: 3600, lastVisit: "2026-02-20", favoriteService: "Facial Treatment", loyaltyPoints: 1560, rating: 4.8 },
  { id: "CL-04", name: "Dina Nasser", visits: 12, totalSpent: 2800, lastVisit: "2026-02-10", favoriteService: "Manicure & Pedicure", loyaltyPoints: 1230, rating: 4.7 },
  { id: "CL-05", name: "Rana Yousef", visits: 8, totalSpent: 3200, lastVisit: "2026-02-21", favoriteService: "Bridal Package", loyaltyPoints: 980, rating: 5.0 },
  { id: "CL-06", name: "Layla Hassan", visits: 22, totalSpent: 4100, lastVisit: "2026-02-12", favoriteService: "Keratin Treatment", loyaltyPoints: 2100, rating: 4.9 },
  { id: "CL-07", name: "Fatima Ali", visits: 6, totalSpent: 1400, lastVisit: "2026-01-28", favoriteService: "Deep Tissue Massage", loyaltyPoints: 560, rating: 4.6 },
];

const scheduleStatusColors: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  busy: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  off: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  "no-show": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "available": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "in-session": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "off-duty": "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const calendarDates = Array.from({ length: 7 }, (_, i) => {
  const d = 20 + i;
  return { day: d, date: `2026-02-${String(d).padStart(2, "0")}`, label: ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"][i] };
});

const SalonPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["bookings", "services", "staff", "loyalty", "catalog", "scheduling", "customers"] as const;
  type TabVal = typeof validTabs[number];
  const tabFromUrl = searchParams.get("tab") as TabVal | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "bookings";
  const handleTabChange = (value: string) => {
    if (value === "bookings") { searchParams.delete("tab"); } else { searchParams.set("tab", value); }
    setSearchParams(searchParams, { replace: true });
  };

  const [bookings, setBookings] = useState(mockBookings);
  const [addOpen, setAddOpen] = useState(false);

  // Booking filters
  const [bkSearch, setBkSearch] = useState("");
  const [bkStylist, setBkStylist] = useState("all");
  const [bkStatus, setBkStatus] = useState("all");
  const [bkView, setBkView] = useState<"list" | "calendar">("list");

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch = !bkSearch || b.client.toLowerCase().includes(bkSearch.toLowerCase()) || b.service.toLowerCase().includes(bkSearch.toLowerCase());
      const matchStylist = bkStylist === "all" || b.stylist === bkStylist;
      const matchStatus = bkStatus === "all" || b.status === bkStatus;
      return matchSearch && matchStylist && matchStatus;
    });
  }, [bookings, bkSearch, bkStylist, bkStatus]);

  // Staff filters
  const [staffSearch, setStaffSearch] = useState("");
  const [staffStatus, setStaffStatus] = useState("all");
  const [selectedStylist, setSelectedStylist] = useState<StylistProfile | null>(null);

  const filteredStylists = useMemo(() => {
    return stylistProfiles.filter(s => {
      const matchSearch = !staffSearch || s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.specialty.toLowerCase().includes(staffSearch.toLowerCase());
      const matchStatus = staffStatus === "all" || s.status === staffStatus;
      return matchSearch && matchStatus;
    });
  }, [staffSearch, staffStatus]);

  // Catalog filters
  const [catSearch, setCatSearch] = useState("");
  const [catCategory, setCatCategory] = useState("all");
  const [catSort, setCatSort] = useState("popularity");

  const catalogCategories = [...new Set(serviceCatalog.map(s => s.category))];

  const filteredCatalog = useMemo(() => {
    let result = serviceCatalog.filter(s => {
      const matchSearch = !catSearch || s.name.toLowerCase().includes(catSearch.toLowerCase()) || s.description.toLowerCase().includes(catSearch.toLowerCase());
      const matchCat = catCategory === "all" || s.category === catCategory;
      return matchSearch && matchCat;
    });
    if (catSort === "popularity") result.sort((a, b) => b.popularity - a.popularity);
    else if (catSort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (catSort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (catSort === "revenue") result.sort((a, b) => b.revenue - a.revenue);
    return result;
  }, [catSearch, catCategory, catSort]);

  const todayBookings = bookings.filter(b => b.date === "2026-02-20");
  const todayRevenue = todayBookings.filter(b => b.status === "completed").reduce((s, b) => s + b.price, 0);
  const totalStylistRevenue = stylistProfiles.reduce((s, t) => s + t.monthlyRevenue, 0);

  // Calendar helper
  const getBookingsForSlot = (date: string, time: string) => {
    return filteredBookings.filter(b => b.date === date && b.time === time);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Salon & Spa Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage bookings, services, and staff schedules</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10"><Calendar className="h-5 w-5 text-pink-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{todayBookings.length}</p><p className="text-xs text-muted-foreground">Today's Bookings</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CreditCard className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">${todayRevenue}</p><p className="text-xs text-muted-foreground">Today's Revenue</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">4.9</p><p className="text-xs text-muted-foreground">Avg Rating</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Users className="h-5 w-5 text-violet-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{stylistNames.length}</p><p className="text-xs text-muted-foreground">Stylists</p></div>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="bookings" className="gap-1.5"><Calendar className="h-4 w-4" /> Bookings</TabsTrigger>
            <TabsTrigger value="services" className="gap-1.5"><Scissors className="h-4 w-4" /> Services</TabsTrigger>
            <TabsTrigger value="staff" className="gap-1.5"><Users className="h-4 w-4" /> Staff</TabsTrigger>
            <TabsTrigger value="loyalty" className="gap-1.5"><Gift className="h-4 w-4" /> Loyalty</TabsTrigger>
            <TabsTrigger value="catalog" className="gap-1.5"><Sparkles className="h-4 w-4" /> Catalog</TabsTrigger>
            <TabsTrigger value="scheduling" className="gap-1.5"><CalendarClock className="h-4 w-4" /> Scheduling</TabsTrigger>
            <TabsTrigger value="customers" className="gap-1.5"><History className="h-4 w-4" /> Customers</TabsTrigger>
          </TabsList>

          {/* â•â•â• Enhanced Booking Calendar Tab â•â•â• */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search client or service..." value={bkSearch} onChange={e => setBkSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={bkStylist} onValueChange={setBkStylist}>
                      <SelectTrigger className="w-[130px]"><SelectValue placeholder="Stylist" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stylists</SelectItem>
                        {stylistNames.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={bkStatus} onValueChange={setBkStatus}>
                      <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No-show</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1 rounded-lg border border-border p-0.5">
                      <Button variant={bkView === "list" ? "default" : "ghost"} size="sm" onClick={() => setBkView("list")}>List</Button>
                      <Button variant={bkView === "calendar" ? "default" : "ghost"} size="sm" onClick={() => setBkView("calendar")}>Calendar</Button>
                    </div>
                    <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> New Booking</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Filtered Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{filteredBookings.length}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">${filteredBookings.reduce((s, b) => s + b.price, 0).toLocaleString()}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold text-emerald-500">{filteredBookings.filter(b => b.status === "confirmed").length}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">No-shows</p>
                  <p className="text-2xl font-bold text-amber-500">{filteredBookings.filter(b => b.status === "no-show").length}</p>
                </CardContent></Card>
              </div>

              {bkView === "list" ? (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Bookings ({filteredBookings.length})</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow>
                        <TableHead>ID</TableHead><TableHead>Client</TableHead><TableHead>Service</TableHead><TableHead>Stylist</TableHead>
                        <TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {filteredBookings.map(b => (
                          <TableRow key={b.id}>
                            <TableCell className="font-mono text-xs">{b.id}</TableCell>
                            <TableCell className="font-medium">{b.client}</TableCell>
                            <TableCell>{b.service}</TableCell>
                            <TableCell>{b.stylist}</TableCell>
                            <TableCell>{b.date}</TableCell>
                            <TableCell>{b.time} <span className="text-muted-foreground text-xs">({b.duration})</span></TableCell>
                            <TableCell className="font-medium">${b.price}</TableCell>
                            <TableCell><Badge variant="outline" className={statusColors[b.status]}>{b.status}</Badge></TableCell>
                            <TableCell className="text-right">
                              {b.status === "confirmed" && (
                                <>
                                  <Button variant="ghost" size="sm" onClick={() => { setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: "completed" as const } : x)); toast.success("Completed!"); }}><CheckCircle2 className="h-4 w-4 text-emerald-500" /></Button>
                                  <Button variant="ghost" size="sm" onClick={() => { setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: "cancelled" as const } : x)); toast.info("Cancelled"); }}><X className="h-4 w-4 text-destructive" /></Button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredBookings.length === 0 && (
                          <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No bookings match your filters</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Weekly Calendar View</CardTitle></CardHeader>
                  <CardContent className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="p-2 border border-border bg-muted/50 text-muted-foreground font-medium w-16">Time</th>
                          {calendarDates.map(d => (
                            <th key={d.day} className={`p-2 border border-border font-medium ${d.day === 20 ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"}`}>
                              {d.label} {d.day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map(time => (
                          <tr key={time}>
                            <td className="p-2 border border-border text-muted-foreground font-medium bg-muted/30">{time}</td>
                            {calendarDates.map(cd => {
                              const slotBookings = getBookingsForSlot(cd.date, time);
                              return (
                                <td key={cd.day} className="p-1 border border-border align-top">
                                  {slotBookings.map(b => (
                                    <div key={b.id} className={`rounded-lg p-1.5 mb-1 space-y-0.5 ${
                                      b.status === "completed" ? "bg-emerald-500/10 border border-emerald-500/20" :
                                      b.status === "cancelled" ? "bg-destructive/10 border border-destructive/20 line-through" :
                                      b.status === "no-show" ? "bg-amber-500/10 border border-amber-500/20" :
                                      "bg-primary/10 border border-primary/20"
                                    }`}>
                                      <p className="font-semibold text-foreground truncate">{b.client}</p>
                                      <p className="text-muted-foreground truncate">{b.service}</p>
                                      <p className="text-muted-foreground">{b.stylist} â€¢ {b.duration}</p>
                                    </div>
                                  ))}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Services Tab (unchanged) */}
          <TabsContent value="services">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(s => (
                <Card key={s.name} className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-4 space-y-2">
                    <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${s.price}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* â•â•â• Enhanced Staff / Stylist Management Tab â•â•â• */}
          <TabsContent value="staff">
            <div className="space-y-4">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10"><Users className="h-5 w-5 text-pink-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{stylistProfiles.length}</p><p className="text-xs text-muted-foreground">Total Stylists</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><UserCheck className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{stylistProfiles.reduce((s, t) => s + t.activeClients, 0)}</p><p className="text-xs text-muted-foreground">Active Clients</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><DollarSign className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(totalStylistRevenue / 1000).toFixed(1)}k</p><p className="text-xs text-muted-foreground">Monthly Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Heart className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{Math.round(stylistProfiles.reduce((s, t) => s + t.retentionRate, 0) / stylistProfiles.length)}%</p><p className="text-xs text-muted-foreground">Avg Retention</p></div>
                </CardContent></Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search stylist or specialty..." value={staffSearch} onChange={e => setStaffSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={staffStatus} onValueChange={setStaffStatus}>
                      <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-session">In Session</SelectItem>
                        <SelectItem value="off-duty">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5" onClick={() => toast.success("Staff form coming soon!")}><Plus className="h-4 w-4" /> Add Stylist</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stylist Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredStylists.map(stylist => (
                  <Card key={stylist.id} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setSelectedStylist(stylist)}>
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10 text-2xl">{stylist.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{stylist.name}</h3>
                            <Badge variant="outline" className={statusColors[stylist.status]}>{stylist.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{stylist.specialty} â€¢ {stylist.experience}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-medium text-foreground">{stylist.rating}</span>
                            <span className="text-xs text-muted-foreground">â€¢ {stylist.totalClients} total clients</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {stylist.services.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-lg font-bold text-primary">{stylist.activeClients}</p>
                          <p className="text-[10px] text-muted-foreground">Active</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-lg font-bold text-foreground">{stylist.todayBookings}</p>
                          <p className="text-[10px] text-muted-foreground">Today</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-lg font-bold text-foreground">{stylist.retentionRate}%</p>
                          <p className="text-[10px] text-muted-foreground">Retention</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-lg font-bold text-emerald-500">${(stylist.monthlyRevenue / 1000).toFixed(1)}k</p>
                          <p className="text-[10px] text-muted-foreground">Revenue</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {stylist.schedule}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredStylists.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No stylists match your filters</p>}
              </div>

              {/* Performance Table */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Performance Comparison</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Stylist</TableHead><TableHead>Specialty</TableHead><TableHead>Rating</TableHead>
                      <TableHead>Active Clients</TableHead><TableHead>Retention</TableHead><TableHead>Monthly Revenue</TableHead><TableHead>Certifications</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {stylistProfiles.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2"><span className="text-lg">{t.avatar}</span>{t.name}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{t.specialty}</TableCell>
                          <TableCell><div className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /><span className="font-medium">{t.rating}</span></div></TableCell>
                          <TableCell className="font-medium text-foreground">{t.activeClients}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={t.retentionRate} className="h-2 w-16" />
                              <span className="text-xs">{t.retentionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-emerald-500">${t.monthlyRevenue.toLocaleString()}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{t.certifications.length} certs</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Loyalty Tab (unchanged) */}
          <TabsContent value="loyalty">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Gift className="h-5 w-5 text-primary" /> Loyalty Program</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Members</span><span className="font-bold text-foreground">342</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Points Issued (Month)</span><span className="font-bold text-foreground">18,450</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Redemptions (Month)</span><span className="font-bold text-foreground">56</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Retention Rate</span><span className="font-bold text-foreground">89%</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> Top Clients</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {["Sara Ahmed â€” 2,450 pts", "Mona Khalid â€” 1,820 pts", "Hala Farouk â€” 1,560 pts", "Dina Nasser â€” 1,230 pts"].map((c, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm text-foreground">{c}</span>
                      <Badge variant="outline" className="text-[10px]">{["Gold", "Gold", "Silver", "Silver"][i]}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* â•â•â• Enhanced Service Catalog Tab â•â•â• */}
          <TabsContent value="catalog">
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search service..." value={catSearch} onChange={e => setCatSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={catCategory} onValueChange={setCatCategory}>
                      <SelectTrigger className="w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {catalogCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={catSort} onValueChange={setCatSort}>
                      <SelectTrigger className="w-[150px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Most Popular</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="revenue">Highest Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5" onClick={() => toast.success("Service form coming soon!")}><Plus className="h-4 w-4" /> Add Service</Button>
                  </div>
                </CardContent>
              </Card>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Sparkles className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredCatalog.length}</p><p className="text-xs text-muted-foreground">Services</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(filteredCatalog.reduce((s, c) => s + c.revenue, 0) / 1000).toFixed(0)}k</p><p className="text-xs text-muted-foreground">Monthly Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><TrendingUp className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredCatalog.reduce((s, c) => s + c.monthlyBookings, 0)}</p><p className="text-xs text-muted-foreground">Monthly Bookings</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Scissors className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredCatalog.filter(s => s.trending).length}</p><p className="text-xs text-muted-foreground">Trending</p></div>
                </CardContent></Card>
              </div>

              {/* Service Cards */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCatalog.map((s) => (
                  <Card key={s.name} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{s.name}</h3>
                            {s.trending && <Badge className="bg-pink-500/15 text-pink-500 border-pink-500/30 text-[10px]">ðŸ”¥ Trending</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${s.price}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-sm font-bold text-foreground">{s.monthlyBookings}</p>
                          <p className="text-[10px] text-muted-foreground">Bookings/mo</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-sm font-bold text-emerald-500">${(s.revenue / 1000).toFixed(1)}k</p>
                          <p className="text-[10px] text-muted-foreground">Revenue/mo</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Popularity</span>
                          <span className={`font-medium ${s.popularity >= 85 ? "text-emerald-500" : "text-foreground"}`}>{s.popularity}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${s.popularity >= 85 ? "bg-emerald-500" : "bg-primary"}`} style={{ width: `${s.popularity}%` }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredCatalog.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No services match your filters</p>}
              </div>

              {/* Revenue Table */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Service Performance</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Service</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead><TableHead>Monthly Bookings</TableHead><TableHead>Revenue</TableHead><TableHead>Popularity</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {filteredCatalog.map(s => (
                        <TableRow key={s.name}>
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              {s.name}
                              {s.trending && <span className="text-[10px]">ðŸ”¥</span>}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{s.category}</Badge></TableCell>
                          <TableCell className="font-medium text-primary">${s.price}</TableCell>
                          <TableCell className="text-muted-foreground">{s.duration}</TableCell>
                          <TableCell className="font-medium text-foreground">{s.monthlyBookings}</TableCell>
                          <TableCell className="font-medium text-emerald-500">${s.revenue.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={s.popularity} className="h-2 w-16" />
                              <span className="text-xs">{s.popularity}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staff Scheduling Tab (unchanged) */}
          <TabsContent value="scheduling">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><CalendarClock className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{staffSchedules.filter(s => s.status !== "off").length}</p><p className="text-xs text-muted-foreground">Active Shifts</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{staffSchedules.filter(s => s.status === "available").length}</p><p className="text-xs text-muted-foreground">Available Slots</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Users className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{stylistNames.length}</p><p className="text-xs text-muted-foreground">Staff Members</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><TrendingUp className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{Math.round(staffSchedules.filter(s => s.capacity > 0).reduce((s, x) => s + (x.bookings / x.capacity), 0) / staffSchedules.filter(s => s.capacity > 0).length * 100)}%</p><p className="text-xs text-muted-foreground">Utilization</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Staff Weekly Schedule</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Schedule editor coming soon!")}><Plus className="h-4 w-4" /> Add Shift</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Stylist</TableHead><TableHead>Day</TableHead><TableHead>Shift</TableHead>
                      <TableHead>Bookings</TableHead><TableHead>Capacity</TableHead><TableHead>Status</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {staffSchedules.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-foreground">{s.stylist}</TableCell>
                          <TableCell className="text-foreground">{s.day}</TableCell>
                          <TableCell className="text-muted-foreground">{s.shift}</TableCell>
                          <TableCell className="text-foreground">{s.bookings}</TableCell>
                          <TableCell className="text-muted-foreground">{s.capacity || "â€”"}</TableCell>
                          <TableCell><Badge variant="outline" className={scheduleStatusColors[s.status]}>{s.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer History Tab (unchanged) */}
          <TabsContent value="customers">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{customerHistory.length}</p><p className="text-xs text-muted-foreground">Total Clients</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(customerHistory.reduce((s, c) => s + c.totalSpent, 0) / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{(customerHistory.reduce((s, c) => s + c.rating, 0) / customerHistory.length).toFixed(1)}</p><p className="text-xs text-muted-foreground">Avg Rating</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><History className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{Math.round(customerHistory.reduce((s, c) => s + c.visits, 0) / customerHistory.length)}</p><p className="text-xs text-muted-foreground">Avg Visits</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-base">Client History</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Client</TableHead><TableHead>Visits</TableHead><TableHead>Total Spent</TableHead>
                      <TableHead>Last Visit</TableHead><TableHead>Favorite Service</TableHead><TableHead>Points</TableHead><TableHead>Rating</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {customerHistory.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                          <TableCell className="text-foreground">{c.visits}</TableCell>
                          <TableCell className="font-medium text-foreground">${c.totalSpent.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">{c.lastVisit}</TableCell>
                          <TableCell><Badge variant="outline">{c.favoriteService}</Badge></TableCell>
                          <TableCell className="text-primary font-medium">{c.loyaltyPoints.toLocaleString()}</TableCell>
                          <TableCell className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{c.rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Booking Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Booking</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Client Name</Label><Input placeholder="Client name" /></div>
            <div><Label>Service</Label><Select><SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent>{services.map(s => <SelectItem key={s.name} value={s.name}>{s.name} â€” ${s.price}</SelectItem>)}</SelectContent>
            </Select></div>
            <div><Label>Stylist</Label><Select><SelectTrigger><SelectValue placeholder="Select stylist" /></SelectTrigger>
              <SelectContent>{stylistNames.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" /></div>
              <div><Label>Time</Label><Input type="time" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Booking created! ðŸ’‡"); }}>Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stylist Detail Dialog */}
      <Dialog open={!!selectedStylist} onOpenChange={() => setSelectedStylist(null)}>
        <DialogContent className="max-w-lg">
          {selectedStylist && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedStylist.avatar}</span>
                  <div>
                    <p>{selectedStylist.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selectedStylist.specialty} â€¢ {selectedStylist.experience}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {selectedStylist.services.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-xl font-bold text-foreground flex items-center gap-1"><Star className="h-4 w-4 text-amber-500 fill-amber-500" />{selectedStylist.rating}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Active Clients</p>
                    <p className="text-xl font-bold text-primary">{selectedStylist.activeClients}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Retention Rate</p>
                    <p className="text-xl font-bold text-emerald-500">{selectedStylist.retentionRate}%</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                    <p className="text-xl font-bold text-foreground">${selectedStylist.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1">{selectedStylist.certifications.map(c => <Badge key={c} variant="secondary" className="text-xs gap-1"><Award className="h-3 w-3" />{c}</Badge>)}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> {selectedStylist.schedule}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {selectedStylist.email}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {selectedStylist.phone}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SalonPage;

