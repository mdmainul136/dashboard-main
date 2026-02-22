"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Plane, MapPin, Calendar, Users, Star, DollarSign, TrendingUp, Globe, Plus, ClipboardList, Shield, Clock, CheckCircle2, AlertTriangle, FileText, Search, X, Phone, Mail, Hotel, Compass, Utensils, Bus, Camera, Sunrise, Sunset, Mountain, Waves, TreePalm, Download, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

// â”€â”€â”€ Tour Packages Data â”€â”€â”€
interface TourPackage {
  id: string; name: string; destination: string; country: string; duration: string; days: number;
  price: number; travelers: number; maxCapacity: number; rating: number; reviews: number;
  status: "active" | "upcoming" | "sold-out" | "draft";
  category: "adventure" | "luxury" | "cultural" | "beach" | "mountain";
  highlights: string[]; included: string[]; departure: string; featured: boolean;
}

const tours: TourPackage[] = [
  { id: "T-01", name: "Dubai City Explorer", destination: "Dubai", country: "UAE", duration: "5 days", days: 5, price: 1200, travelers: 24, maxCapacity: 30, rating: 4.8, reviews: 156, status: "active", category: "luxury", highlights: ["Burj Khalifa", "Desert Safari", "Gold Souk", "Dubai Marina"], included: ["Hotel", "Breakfast", "Transfers", "Guide"], departure: "2026-03-01", featured: true },
  { id: "T-02", name: "Maldives Paradise", destination: "Maldives", country: "Maldives", duration: "7 days", days: 7, price: 3500, travelers: 12, maxCapacity: 16, rating: 4.9, reviews: 89, status: "active", category: "beach", highlights: ["Snorkeling", "Private Island", "Sunset Cruise", "Spa"], included: ["Resort", "All Meals", "Seaplane", "Snorkeling Gear"], departure: "2026-03-15", featured: true },
  { id: "T-03", name: "Istanbul Heritage Tour", destination: "Istanbul", country: "Turkey", duration: "4 days", days: 4, price: 890, travelers: 30, maxCapacity: 35, rating: 4.7, reviews: 210, status: "active", category: "cultural", highlights: ["Hagia Sophia", "Grand Bazaar", "Bosphorus Cruise", "Turkish Bath"], included: ["Hotel", "Breakfast", "Transfers", "Museum Pass"], departure: "2026-03-10", featured: false },
  { id: "T-04", name: "Bali Adventure", destination: "Bali", country: "Indonesia", duration: "6 days", days: 6, price: 1800, travelers: 18, maxCapacity: 25, rating: 4.6, reviews: 134, status: "upcoming", category: "adventure", highlights: ["Ubud Rice Terraces", "Mount Batur Sunrise", "Temple Tour", "White Water Rafting"], included: ["Villa", "Breakfast", "Activities", "Scooter Rental"], departure: "2026-04-01", featured: false },
  { id: "T-05", name: "Swiss Alps Retreat", destination: "Interlaken", country: "Switzerland", duration: "5 days", days: 5, price: 2800, travelers: 8, maxCapacity: 12, rating: 4.9, reviews: 67, status: "upcoming", category: "mountain", highlights: ["Jungfraujoch", "Paragliding", "Lake Thun Cruise", "Chocolate Factory"], included: ["Chalet", "Half Board", "Train Pass", "Guide"], departure: "2026-04-10", featured: true },
  { id: "T-06", name: "Morocco Discovery", destination: "Marrakech", country: "Morocco", duration: "8 days", days: 8, price: 1450, travelers: 0, maxCapacity: 20, rating: 0, reviews: 0, status: "draft", category: "cultural", highlights: ["Sahara Desert", "Medina Tour", "Atlas Mountains", "Cooking Class"], included: ["Riad", "Breakfast + Dinner", "Camel Trek", "4x4 Safari"], departure: "2026-05-01", featured: false },
];

// â”€â”€â”€ Booking Management Data â”€â”€â”€
interface BookingDetail {
  id: string; traveler: string; email: string; phone: string; tour: string; tourId: string;
  checkIn: string; checkOut: string; hotel: string; flight: string; roomType: string;
  guests: number; adults: number; children: number; total: number; paid: number;
  status: "confirmed" | "pending" | "cancelled"; specialRequests: string;
  paymentMethod: string; bookedOn: string;
}

const bookingDetails: BookingDetail[] = [
  { id: "BK-001", traveler: "Ali Hassan", email: "ali@email.com", phone: "+966 551234567", tour: "Dubai City Explorer", tourId: "T-01", checkIn: "2026-03-01", checkOut: "2026-03-05", hotel: "Jumeirah Beach Hotel", flight: "SV-204", roomType: "Deluxe Sea View", guests: 2, adults: 2, children: 0, total: 2400, paid: 2400, status: "confirmed", specialRequests: "Late check-in requested", paymentMethod: "Credit Card", bookedOn: "2026-02-10" },
  { id: "BK-002", traveler: "Sarah Mohammed", email: "sarah@email.com", phone: "+966 559876543", tour: "Maldives Paradise", tourId: "T-02", checkIn: "2026-03-15", checkOut: "2026-03-22", hotel: "Soneva Fushi Resort", flight: "SV-318", roomType: "Water Villa", guests: 2, adults: 2, children: 0, total: 7000, paid: 3500, status: "confirmed", specialRequests: "Anniversary celebration â€” cake & flowers", paymentMethod: "Bank Transfer", bookedOn: "2026-01-28" },
  { id: "BK-003", traveler: "Omar Khalid", email: "omar@email.com", phone: "+966 554443322", tour: "Istanbul Heritage", tourId: "T-03", checkIn: "2026-03-10", checkOut: "2026-03-14", hotel: "Four Seasons Sultanahmet", flight: "TK-101", roomType: "Premium Suite", guests: 4, adults: 2, children: 2, total: 3560, paid: 0, status: "pending", specialRequests: "Need baby cot", paymentMethod: "Pending", bookedOn: "2026-02-18" },
  { id: "BK-004", traveler: "Nora Al-Faisal", email: "nora@email.com", phone: "+966 561112233", tour: "Bali Adventure", tourId: "T-04", checkIn: "2026-04-01", checkOut: "2026-04-07", hotel: "Ubud Hanging Gardens", flight: "GA-855", roomType: "Forest Pool Villa", guests: 1, adults: 1, children: 0, total: 1800, paid: 1800, status: "confirmed", specialRequests: "Vegan meals preferred", paymentMethod: "Credit Card", bookedOn: "2026-02-05" },
  { id: "BK-005", traveler: "Yousef Bashar", email: "yousef@email.com", phone: "+966 567778899", tour: "Swiss Alps Retreat", tourId: "T-05", checkIn: "2026-04-10", checkOut: "2026-04-15", hotel: "The Chedi Andermatt", flight: "LX-632", roomType: "Alpine Suite", guests: 2, adults: 2, children: 0, total: 5600, paid: 0, status: "pending", specialRequests: "Early breakfast for paragliding", paymentMethod: "Pending", bookedOn: "2026-02-15" },
  { id: "BK-006", traveler: "Layla Ibrahim", email: "layla@email.com", phone: "+966 553334455", tour: "Dubai City Explorer", tourId: "T-01", checkIn: "2026-02-15", checkOut: "2026-02-20", hotel: "Atlantis The Palm", flight: "SV-210", roomType: "Ocean King", guests: 3, adults: 2, children: 1, total: 3600, paid: 3600, status: "confirmed", specialRequests: "Connecting rooms if possible", paymentMethod: "Apple Pay", bookedOn: "2026-01-20" },
];

// â”€â”€â”€ Itinerary Builder Data â”€â”€â”€
interface ItineraryItem {
  id: string; tour: string; day: number; title: string; description: string;
  location: string; time: string; endTime: string; type: "activity" | "transfer" | "meal" | "accommodation" | "free-time";
  cost: number; tips: string;
}

const itineraryItems: ItineraryItem[] = [
  { id: "IT-1", tour: "Dubai City Explorer", day: 1, title: "Arrival & City Tour", description: "Airport transfer, check-in at Jumeirah Beach Hotel, evening Dubai Marina walk & dinner cruise", location: "Dubai Marina", time: "14:00", endTime: "21:00", type: "activity", cost: 0, tips: "Wear comfortable walking shoes" },
  { id: "IT-2", tour: "Dubai City Explorer", day: 2, title: "Desert Safari Experience", description: "Morning camel ride, dune bashing in 4x4, sandboarding, BBQ dinner under the stars with live entertainment", location: "Dubai Desert Conservation Reserve", time: "09:00", endTime: "22:00", type: "activity", cost: 180, tips: "Bring sunscreen & sunglasses. Camera is a must!" },
  { id: "IT-3", tour: "Dubai City Explorer", day: 3, title: "Cultural Heritage Day", description: "Old Dubai walking tour, Gold & Spice Souk, Abra ride across Dubai Creek, Dubai Museum, Al Fahidi", location: "Deira & Al Fahidi", time: "10:00", endTime: "17:00", type: "activity", cost: 0, tips: "Bargaining is expected at the souks" },
  { id: "IT-4", tour: "Dubai City Explorer", day: 3, title: "Traditional Emirati Dinner", description: "Authentic Emirati cuisine at Sheikh Mohammed Centre with cultural talk", location: "Al Fahidi", time: "19:00", endTime: "21:30", type: "meal", cost: 65, tips: "Dress modestly for this cultural venue" },
  { id: "IT-5", tour: "Dubai City Explorer", day: 4, title: "Modern Dubai & Shopping", description: "Burj Khalifa At The Top, Dubai Mall, Aquarium, Dubai Fountain evening show", location: "Downtown Dubai", time: "10:00", endTime: "22:00", type: "activity", cost: 85, tips: "Book Burj Khalifa sunset slot for best views" },
  { id: "IT-6", tour: "Dubai City Explorer", day: 5, title: "Free Morning & Departure", description: "Free time for last-minute shopping or beach. Airport transfer at 12:00", location: "Hotel & Airport", time: "08:00", endTime: "14:00", type: "transfer", cost: 0, tips: "Pack souvenirs in checked luggage" },
  { id: "IT-7", tour: "Maldives Paradise", day: 1, title: "Island Welcome", description: "Male Airport â†’ Seaplane transfer to Soneva Fushi. Welcome cocktail, resort orientation, sunset dinner on the beach", location: "Soneva Fushi Resort", time: "12:00", endTime: "21:00", type: "accommodation", cost: 0, tips: "Only 20kg baggage allowed on seaplane" },
  { id: "IT-8", tour: "Maldives Paradise", day: 2, title: "Snorkeling & Marine Life", description: "Guided coral reef snorkeling, dolphin watching cruise, afternoon spa treatment", location: "Baa Atoll UNESCO Biosphere", time: "09:00", endTime: "17:00", type: "activity", cost: 120, tips: "Reef-safe sunscreen only. Underwater camera recommended" },
  { id: "IT-9", tour: "Maldives Paradise", day: 3, title: "Private Island Picnic", description: "Private sandbank picnic with chef-prepared lunch. Afternoon kayaking. Underwater dining experience at Ithaa", location: "Private Sandbank", time: "10:00", endTime: "22:00", type: "meal", cost: 350, tips: "The underwater restaurant seats only 14 â€” confirmed for your group" },
  { id: "IT-10", tour: "Maldives Paradise", day: 4, title: "Free Day â€” Island Exploration", description: "Relax at your villa, explore the island by bicycle, visit the organic garden, or try night snorkeling with manta rays", location: "Soneva Fushi", time: "All Day", endTime: "", type: "free-time", cost: 0, tips: "Night snorkeling with mantas is a once-in-a-lifetime experience" },
];

// â”€â”€â”€ Insurance Data â”€â”€â”€
interface InsurancePolicy {
  id: string; traveler: string; tour: string; plan: string; coverage: string;
  premium: number; startDate: string; endDate: string; status: "active" | "expired" | "pending";
}

const insurancePolicies: InsurancePolicy[] = [
  { id: "INS-001", traveler: "Ali Hassan", tour: "Dubai City Explorer", plan: "Premium", coverage: "Medical + Cancellation + Baggage", premium: 120, startDate: "2026-03-01", endDate: "2026-03-05", status: "active" },
  { id: "INS-002", traveler: "Sarah Mohammed", tour: "Maldives Paradise", plan: "Platinum", coverage: "All-inclusive + Adventure Sports", premium: 280, startDate: "2026-03-15", endDate: "2026-03-22", status: "active" },
  { id: "INS-003", traveler: "Omar Khalid", tour: "Istanbul Heritage", plan: "Basic", coverage: "Medical + Emergency Evacuation", premium: 65, startDate: "2026-03-10", endDate: "2026-03-14", status: "pending" },
  { id: "INS-004", traveler: "Nora Al-Faisal", tour: "Bali Adventure", plan: "Premium", coverage: "Medical + Cancellation + Baggage", premium: 150, startDate: "2026-04-01", endDate: "2026-04-07", status: "active" },
  { id: "INS-005", traveler: "Yousef Bashar", tour: "Swiss Alps Retreat", plan: "Platinum", coverage: "All-inclusive + Winter Sports", premium: 320, startDate: "2026-04-10", endDate: "2026-04-15", status: "pending" },
  { id: "INS-006", traveler: "Layla Ibrahim", tour: "Dubai City Explorer", plan: "Basic", coverage: "Medical + Emergency Evacuation", premium: 55, startDate: "2026-02-15", endDate: "2026-02-20", status: "expired" },
];

const destinations = [
  { name: "Dubai", country: "UAE", tours: 8, bookings: 145, flag: "ðŸ‡¦ðŸ‡ª", popular: true },
  { name: "Maldives", country: "Maldives", tours: 5, bookings: 89, flag: "ðŸ‡²ðŸ‡»", popular: true },
  { name: "Istanbul", country: "Turkey", tours: 6, bookings: 120, flag: "ðŸ‡¹ðŸ‡·" },
  { name: "Bali", country: "Indonesia", tours: 4, bookings: 76, flag: "ðŸ‡®ðŸ‡©" },
  { name: "Switzerland", country: "Switzerland", tours: 3, bookings: 42, flag: "ðŸ‡¨ðŸ‡­" },
  { name: "Paris", country: "France", tours: 7, bookings: 134, flag: "ðŸ‡«ðŸ‡·", popular: true },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  upcoming: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
  "sold-out": "bg-destructive/15 text-destructive border-destructive/30",
  draft: "bg-muted text-muted-foreground border-border",
  expired: "bg-destructive/15 text-destructive border-destructive/30",
};

const categoryIcons: Record<string, React.ReactNode> = {
  adventure: <Mountain className="h-4 w-4" />,
  luxury: <Star className="h-4 w-4" />,
  cultural: <Compass className="h-4 w-4" />,
  beach: <Waves className="h-4 w-4" />,
  mountain: <Mountain className="h-4 w-4" />,
};

const itineraryTypeIcons: Record<string, React.ReactNode> = {
  activity: <Camera className="h-4 w-4" />,
  transfer: <Bus className="h-4 w-4" />,
  meal: <Utensils className="h-4 w-4" />,
  accommodation: <Hotel className="h-4 w-4" />,
  "free-time": <Sunrise className="h-4 w-4" />,
};

const itineraryTypeColors: Record<string, string> = {
  activity: "bg-primary/15 text-primary border-primary/30",
  transfer: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  meal: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  accommodation: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  "free-time": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
};

const insuranceStatusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  expired: "bg-destructive/15 text-destructive border-destructive/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
};

const TravelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["tours", "bookings", "destinations", "management", "itinerary", "insurance"] as const;
  type TabVal = typeof validTabs[number];
  const tabFromUrl = searchParams.get("tab") as TabVal | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "tours";
  const handleTabChange = (value: string) => {
    if (value === "tours") { searchParams.delete("tab"); } else { searchParams.set("tab", value); }
    setSearchParams(searchParams, { replace: true });
  };

  // Tour Packages state
  const [tourSearch, setTourSearch] = useState("");
  const [tourCategory, setTourCategory] = useState<string>("all");
  const [tourStatus, setTourStatus] = useState<string>("all");
  const [tourSort, setTourSort] = useState<string>("featured");
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);

  const categories = useMemo(() => Array.from(new Set(tours.map(t => t.category))), []);

  const filteredTours = useMemo(() => {
    let result = tours.filter(t => {
      const q = tourSearch.toLowerCase();
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q) || t.country.toLowerCase().includes(q);
      const matchCat = tourCategory === "all" || t.category === tourCategory;
      const matchStatus = tourStatus === "all" || t.status === tourStatus;
      return matchSearch && matchCat && matchStatus;
    });
    if (tourSort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (tourSort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (tourSort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (tourSort === "duration") result.sort((a, b) => a.days - b.days);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [tourSearch, tourCategory, tourStatus, tourSort]);

  // Booking Management state
  const [bkSearch, setBkSearch] = useState("");
  const [bkStatus, setBkStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);

  const filteredBookings = useMemo(() => {
    return bookingDetails.filter(b => {
      const q = bkSearch.toLowerCase();
      const matchSearch = !q || b.traveler.toLowerCase().includes(q) || b.tour.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.hotel.toLowerCase().includes(q);
      const matchStatus = bkStatus === "all" || b.status === bkStatus;
      return matchSearch && matchStatus;
    });
  }, [bkSearch, bkStatus]);

  const totalCollected = bookingDetails.reduce((s, b) => s + b.paid, 0);
  const totalOutstanding = bookingDetails.reduce((s, b) => s + (b.total - b.paid), 0);

  // Itinerary Builder state
  const [itinTour, setItinTour] = useState<string>("Dubai City Explorer");
  const [itinTypeFilter, setItinTypeFilter] = useState<string>("all");

  const availableItinTours = useMemo(() => Array.from(new Set(itineraryItems.map(i => i.tour))), []);

  const filteredItinerary = useMemo(() => {
    return itineraryItems.filter(i => {
      const matchTour = i.tour === itinTour;
      const matchType = itinTypeFilter === "all" || i.type === itinTypeFilter;
      return matchTour && matchType;
    });
  }, [itinTour, itinTypeFilter]);

  const itinDays = useMemo(() => {
    const days = Array.from(new Set(filteredItinerary.map(i => i.day))).sort((a, b) => a - b);
    return days;
  }, [filteredItinerary]);

  const itinTotalCost = filteredItinerary.reduce((s, i) => s + i.cost, 0);

  const totalRevenue = bookingDetails.filter(b => b.status === "confirmed").reduce((s, b) => s + b.total, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Travel Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage tour packages, bookings, and destinations</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Plane className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{tours.length}</p><p className="text-xs text-muted-foreground">Tour Packages</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10"><Calendar className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{bookingDetails.length}</p><p className="text-xs text-muted-foreground">Bookings</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">${(totalRevenue / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Revenue</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Globe className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{destinations.length}</p><p className="text-xs text-muted-foreground">Destinations</p></div>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="tours" className="gap-1.5"><Plane className="h-4 w-4" /> Tours</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5"><Calendar className="h-4 w-4" /> Bookings</TabsTrigger>
            <TabsTrigger value="destinations" className="gap-1.5"><MapPin className="h-4 w-4" /> Destinations</TabsTrigger>
            <TabsTrigger value="management" className="gap-1.5"><ClipboardList className="h-4 w-4" /> Management</TabsTrigger>
            <TabsTrigger value="itinerary" className="gap-1.5"><FileText className="h-4 w-4" /> Itinerary</TabsTrigger>
            <TabsTrigger value="insurance" className="gap-1.5"><Shield className="h-4 w-4" /> Insurance</TabsTrigger>
          </TabsList>

          {/* ============ Tour Packages Tab ============ */}
          <TabsContent value="tours">
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search tours, destinations..." value={tourSearch} onChange={e => setTourSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={tourCategory} onValueChange={setTourCategory}>
                      <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={tourStatus} onValueChange={setTourStatus}>
                      <SelectTrigger className="h-10 w-[120px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="sold-out">Sold Out</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={tourSort} onValueChange={setTourSort}>
                      <SelectTrigger className="h-10 w-[140px] text-xs"><SelectValue placeholder="Sort" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured First</SelectItem>
                        <SelectItem value="price-asc">Price: Low â†’ High</SelectItem>
                        <SelectItem value="price-desc">Price: High â†’ Low</SelectItem>
                        <SelectItem value="rating">Top Rated</SelectItem>
                        <SelectItem value="duration">Shortest First</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Tour</Button>
                  </div>
                  {(tourSearch || tourCategory !== "all" || tourStatus !== "all") && (
                    <p className="text-xs text-muted-foreground mt-2">Showing {filteredTours.length} of {tours.length} packages</p>
                  )}
                </CardContent>
              </Card>

              {/* Tour Cards */}
              {filteredTours.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTours.map(t => (
                    <Card key={t.id} className={`hover:border-primary/40 transition-colors cursor-pointer ${t.featured ? "ring-1 ring-primary/20" : ""}`} onClick={() => setSelectedTour(t)}>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{t.name}</h3>
                              {t.featured && <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">Featured</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{t.destination}, {t.country}</p>
                          </div>
                          <Badge variant="outline" className={statusColors[t.status]}>{t.status}</Badge>
                        </div>

                        {/* Quick specs */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-bold text-foreground">{t.duration}</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-muted-foreground">Category</p>
                            <p className="font-bold text-foreground capitalize">{t.category}</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-muted-foreground">Capacity</p>
                            <p className="font-bold text-foreground">{t.travelers}/{t.maxCapacity}</p>
                          </div>
                        </div>

                        {/* Capacity bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground">{t.travelers} booked</span>
                            <span className="text-muted-foreground">{t.maxCapacity - t.travelers} spots left</span>
                          </div>
                          <Progress value={(t.travelers / t.maxCapacity) * 100} className="h-1.5" />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${t.price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/person</span></span>
                          {t.rating > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{t.rating} ({t.reviews})
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {t.highlights.slice(0, 3).map(h => (
                            <Badge key={h} variant="outline" className="text-[10px] bg-muted/50">{h}</Badge>
                          ))}
                          {t.highlights.length > 3 && <Badge variant="outline" className="text-[10px]">+{t.highlights.length - 3}</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card><CardContent className="p-8 text-center">
                  <Plane className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground">No tour packages found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                </CardContent></Card>
              )}
            </div>
          </TabsContent>

          {/* ============ Booking Management Tab ============ */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><ClipboardList className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{bookingDetails.length}</p><p className="text-xs text-muted-foreground">Total Bookings</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{bookingDetails.filter(b => b.status === "confirmed").length}</p><p className="text-xs text-muted-foreground">Confirmed</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(totalCollected / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Collected</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(totalOutstanding / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Outstanding</p></div>
                </CardContent></Card>
              </div>

              {/* Search & Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search by traveler, tour, hotel, booking ID..." value={bkSearch} onChange={e => setBkSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={bkStatus} onValueChange={setBkStatus}>
                      <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Booking</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Cards */}
              <div className="space-y-3">
                {filteredBookings.map(b => (
                  <Card key={b.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{b.traveler}</h4>
                              <Badge variant="outline" className={statusColors[b.status]}>{b.status}</Badge>
                              <span className="font-mono text-[10px] text-muted-foreground">{b.id}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {b.tour} â€¢ {b.hotel} â€¢ {b.checkIn} â†’ {b.checkOut}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground">{b.guests} guest{b.guests > 1 ? "s" : ""} â€¢ {b.flight}</p>
                            <p className="text-xs text-muted-foreground">{b.roomType}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">${b.total.toLocaleString()}</p>
                            {b.paid < b.total && (
                              <p className="text-[11px] text-amber-500">${(b.total - b.paid).toLocaleString()} due</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Payment progress */}
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-muted-foreground">Payment: ${b.paid.toLocaleString()} / ${b.total.toLocaleString()}</span>
                          <span className="font-medium text-foreground">{Math.round((b.paid / b.total) * 100)}%</span>
                        </div>
                        <Progress value={(b.paid / b.total) * 100} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredBookings.length === 0 && (
                  <Card><CardContent className="p-8 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-foreground">No bookings found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
                  </CardContent></Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ============ Destinations Tab ============ */}
          <TabsContent value="destinations">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map(d => (
                <Card key={d.name} className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{d.flag}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{d.name}</h3>
                        <p className="text-xs text-muted-foreground">{d.country}</p>
                      </div>
                      {d.popular && <Badge className="bg-primary/10 text-primary border-primary/30 ml-auto text-[10px]">Popular</Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">{d.tours}</p><p className="text-muted-foreground">Tours</p></div>
                      <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">{d.bookings}</p><p className="text-muted-foreground">Bookings</p></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ============ Management Tab (kept as-is) ============ */}
          <TabsContent value="management">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><ClipboardList className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{bookingDetails.length}</p><p className="text-xs text-muted-foreground">Total Bookings</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{bookingDetails.filter(b => b.status === "confirmed").length}</p><p className="text-xs text-muted-foreground">Confirmed</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(totalCollected / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Collected</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(totalOutstanding / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Outstanding</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Booking Details</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Booking form coming soon!")}><Plus className="h-4 w-4" /> New Booking</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>ID</TableHead><TableHead>Traveler</TableHead><TableHead>Tour</TableHead>
                      <TableHead>Hotel</TableHead><TableHead>Flight</TableHead><TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead><TableHead>Paid/Total</TableHead><TableHead>Status</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {bookingDetails.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-mono text-xs">{b.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{b.traveler}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{b.tour}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{b.hotel}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{b.flight}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{b.checkIn}</TableCell>
                          <TableCell className="text-muted-foreground">{b.checkOut}</TableCell>
                          <TableCell className="font-medium text-foreground">${b.paid.toLocaleString()} / ${b.total.toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColors[b.status]}>{b.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Itinerary Builder Tab ============ */}
          <TabsContent value="itinerary">
            <div className="space-y-4">
              {/* KPI + Filters */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{availableItinTours.length}</p><p className="text-xs text-muted-foreground">Tour Itineraries</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredItinerary.length}</p><p className="text-xs text-muted-foreground">Activities</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><MapPin className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{new Set(filteredItinerary.map(i => i.location)).size}</p><p className="text-xs text-muted-foreground">Locations</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><DollarSign className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${itinTotalCost}</p><p className="text-xs text-muted-foreground">Extra Costs</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Select value={itinTour} onValueChange={setItinTour}>
                      <SelectTrigger className="h-10 w-[220px] text-xs"><SelectValue placeholder="Select Tour" /></SelectTrigger>
                      <SelectContent>
                        {availableItinTours.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={itinTypeFilter} onValueChange={setItinTypeFilter}>
                      <SelectTrigger className="h-10 w-[140px] text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="activity">Activities</SelectItem>
                        <SelectItem value="transfer">Transfers</SelectItem>
                        <SelectItem value="meal">Meals</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="free-time">Free Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="ml-auto flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-4 w-4" /> Export PDF</Button>
                      <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Activity</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Day-by-day timeline */}
              {itinDays.map(day => (
                <Card key={day}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">D{day}</div>
                      Day {day}
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        {filteredItinerary.filter(i => i.day === day).length} activit{filteredItinerary.filter(i => i.day === day).length === 1 ? "y" : "ies"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative space-y-0">
                      {filteredItinerary.filter(i => i.day === day).map((item, idx, arr) => (
                        <div key={item.id} className="relative flex gap-4">
                          {/* Timeline connector */}
                          <div className="flex flex-col items-center">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${itineraryTypeColors[item.type]}`}>
                              {itineraryTypeIcons[item.type]}
                            </div>
                            {idx < arr.length - 1 && <div className="w-0.5 flex-1 bg-border my-1 min-h-[16px]" />}
                          </div>
                          {/* Content */}
                          <div className="flex-1 pb-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                                  <Badge variant="outline" className={`text-[10px] ${itineraryTypeColors[item.type]}`}>{item.type}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                              </div>
                              {item.cost > 0 && <Badge className="bg-primary/10 text-primary border-primary/30 text-xs shrink-0">+${item.cost}</Badge>}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}{item.endTime && ` â€” ${item.endTime}`}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                            </div>
                            {item.tips && (
                              <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2">
                                <p className="text-[11px] text-amber-600 flex items-start gap-1.5">
                                  <Star className="h-3 w-3 mt-0.5 shrink-0" /> Tip: {item.tips}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredItinerary.length === 0 && (
                <Card><CardContent className="p-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground">No itinerary items</p>
                  <p className="text-xs text-muted-foreground mt-1">Select a tour or adjust filters</p>
                </CardContent></Card>
              )}
            </div>
          </TabsContent>

          {/* ============ Insurance Tab ============ */}
          <TabsContent value="insurance">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{insurancePolicies.length}</p><p className="text-xs text-muted-foreground">Total Policies</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{insurancePolicies.filter(p => p.status === "active").length}</p><p className="text-xs text-muted-foreground">Active</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${insurancePolicies.reduce((s, p) => s + p.premium, 0)}</p><p className="text-xs text-muted-foreground">Total Premiums</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{insurancePolicies.filter(p => p.status === "pending").length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Insurance Policies</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Insurance form coming soon!")}><Plus className="h-4 w-4" /> Add Policy</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>ID</TableHead><TableHead>Traveler</TableHead><TableHead>Tour</TableHead>
                      <TableHead>Plan</TableHead><TableHead>Coverage</TableHead><TableHead>Premium</TableHead>
                      <TableHead>Period</TableHead><TableHead>Status</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {insurancePolicies.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs">{p.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{p.traveler}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.tour}</TableCell>
                          <TableCell><Badge variant="outline">{p.plan}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{p.coverage}</TableCell>
                          <TableCell className="font-medium text-foreground">${p.premium}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.startDate} â†’ {p.endDate}</TableCell>
                          <TableCell><Badge variant="outline" className={insuranceStatusColors[p.status]}>{p.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { name: "Basic", price: "$55", features: ["Medical coverage", "Emergency evacuation", "24/7 helpline"], policyCount: 2 },
                  { name: "Premium", price: "$150", features: ["Medical + Cancellation", "Baggage protection", "Trip delay coverage", "24/7 helpline"], policyCount: 3, popular: true },
                  { name: "Platinum", price: "$300", features: ["All-inclusive coverage", "Adventure sports", "Rental car coverage", "Concierge service", "Zero deductible"], policyCount: 2 },
                ].map((plan) => (
                  <Card key={plan.name} className={plan.popular ? "ring-2 ring-primary" : ""}>
                    <CardContent className="p-6 text-center space-y-4">
                      {plan.popular && <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>}
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                        <p className="text-3xl font-bold text-primary mt-1">{plan.price}<span className="text-sm text-muted-foreground">/trip</span></p>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {plan.features.map(f => <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-500" />{f}</li>)}
                      </ul>
                      <p className="text-xs text-muted-foreground">{plan.policyCount} active policies</p>
                      <Button variant={plan.popular ? "default" : "outline"} className="w-full">Select Plan</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ============ Tour Detail Dialog ============ */}
        <Dialog open={!!selectedTour} onOpenChange={(open) => { if (!open) setSelectedTour(null); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedTour && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-primary" /> {selectedTour.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                  {/* Hero info */}
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">
                    <p className="text-3xl font-bold text-primary">${selectedTour.price.toLocaleString()}<span className="text-sm text-muted-foreground font-normal">/person</span></p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTour.destination}, {selectedTour.country} â€¢ {selectedTour.duration}</p>
                    <div className="flex items-center justify-center gap-4 mt-3">
                      <Badge variant="outline" className={statusColors[selectedTour.status]}>{selectedTour.status}</Badge>
                      <Badge variant="outline" className="capitalize">{selectedTour.category}</Badge>
                      {selectedTour.rating > 0 && (
                        <span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 text-amber-500 fill-amber-500" />{selectedTour.rating} ({selectedTour.reviews} reviews)</span>
                      )}
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium text-foreground">{selectedTour.travelers} / {selectedTour.maxCapacity} booked</span>
                    </div>
                    <Progress value={(selectedTour.travelers / selectedTour.maxCapacity) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{selectedTour.maxCapacity - selectedTour.travelers} spots remaining â€¢ Departure: {selectedTour.departure}</p>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Highlights</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTour.highlights.map(h => (
                        <div key={h} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {h}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Included */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">What's Included</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTour.included.map(i => (
                        <Badge key={i} variant="outline" className="bg-emerald-500/5 text-foreground border-emerald-500/20">{i}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 gap-1.5" onClick={() => { toast.success(`Viewing bookings for ${selectedTour.name}`); setSelectedTour(null); }}>
                      <Eye className="h-4 w-4" /> View Bookings
                    </Button>
                    <Button variant="outline" className="flex-1 gap-1.5" onClick={() => { toast.success("Edit mode coming soon!"); }}>
                      <Edit className="h-4 w-4" /> Edit Package
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ============ Booking Detail Dialog ============ */}
        <Dialog open={!!selectedBooking} onOpenChange={(open) => { if (!open) setSelectedBooking(null); }}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedBooking && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> Booking {selectedBooking.id}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Traveler info */}
                  <div className="rounded-xl border border-border p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Traveler</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-[11px] text-muted-foreground">Name</p><p className="font-medium text-foreground">{selectedBooking.traveler}</p></div>
                      <div><p className="text-[11px] text-muted-foreground">Email</p><p className="font-medium text-foreground">{selectedBooking.email}</p></div>
                      <div><p className="text-[11px] text-muted-foreground">Phone</p><p className="font-medium text-foreground">{selectedBooking.phone}</p></div>
                      <div><p className="text-[11px] text-muted-foreground">Guests</p><p className="font-medium text-foreground">{selectedBooking.adults} adult{selectedBooking.adults > 1 ? "s" : ""}{selectedBooking.children > 0 ? `, ${selectedBooking.children} child` : ""}</p></div>
                    </div>
                  </div>

                  {/* Trip details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Tour", value: selectedBooking.tour },
                      { label: "Hotel", value: selectedBooking.hotel },
                      { label: "Room", value: selectedBooking.roomType },
                      { label: "Flight", value: selectedBooking.flight },
                      { label: "Check-in", value: selectedBooking.checkIn },
                      { label: "Check-out", value: selectedBooking.checkOut },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-[11px] text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payment */}
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-foreground">${selectedBooking.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Paid</span>
                      <span className="font-medium text-emerald-500">${selectedBooking.paid.toLocaleString()}</span>
                    </div>
                    {selectedBooking.paid < selectedBooking.total && (
                      <div className="flex justify-between text-sm border-t border-primary/20 pt-2">
                        <span className="text-muted-foreground">Balance Due</span>
                        <span className="font-bold text-amber-500">${(selectedBooking.total - selectedBooking.paid).toLocaleString()}</span>
                      </div>
                    )}
                    <Progress value={(selectedBooking.paid / selectedBooking.total) * 100} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">Payment: {selectedBooking.paymentMethod} â€¢ Booked: {selectedBooking.bookedOn}</p>
                  </div>

                  {/* Special requests */}
                  {selectedBooking.specialRequests && (
                    <div className="rounded-lg bg-muted/30 border border-border p-3">
                      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                        {selectedBooking.specialRequests}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {selectedBooking.status === "pending" && (
                      <Button className="flex-1 gap-1.5" onClick={() => { toast.success(`Booking ${selectedBooking.id} confirmed!`); setSelectedBooking(null); }}>
                        <CheckCircle2 className="h-4 w-4" /> Confirm
                      </Button>
                    )}
                    {selectedBooking.paid < selectedBooking.total && (
                      <Button variant="outline" className="flex-1 gap-1.5" onClick={() => toast.success("Payment reminder sent!")}>
                        <DollarSign className="h-4 w-4" /> Send Reminder
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedBooking(null)}>Close</Button>
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

export default TravelPage;
