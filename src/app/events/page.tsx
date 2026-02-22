"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PartyPopper, Calendar, Users, MapPin, Ticket, DollarSign, Plus, Star, CheckCircle2, Clock, Heart, Image, Megaphone, Mail, TrendingUp, Send, Eye } from "lucide-react";
import { toast } from "sonner";

const events = [
  { id: "E-01", name: "Royal Wedding â€” Al-Faisal", type: "Wedding", date: "2026-03-15", venue: "Grand Ballroom", guests: 350, capacity: 400, budget: 85000, spent: 62000, status: "planning" },
  { id: "E-02", name: "TechSummit 2026", type: "Conference", date: "2026-04-20", venue: "Innovation Center", guests: 800, capacity: 1000, budget: 120000, spent: 45000, status: "planning" },
  { id: "E-03", name: "Spring Gala Night", type: "Gala", date: "2026-03-01", venue: "Skyline Terrace", guests: 200, capacity: 200, budget: 45000, spent: 43000, status: "confirmed" },
  { id: "E-04", name: "Birthday Celebration â€” Ahmed", type: "Birthday", date: "2026-02-25", venue: "Garden Villa", guests: 80, capacity: 100, budget: 12000, spent: 11500, status: "confirmed" },
  { id: "E-05", name: "Product Launch â€” NovaTech", type: "Corporate", date: "2026-05-10", venue: "Expo Hall A", guests: 500, capacity: 600, budget: 95000, spent: 20000, status: "planning" },
];

const venues = [
  { name: "Grand Ballroom", location: "Downtown", capacity: 500, priceRange: "$5,000â€“$15,000", rating: 4.9, events: 24, type: "Indoor" },
  { name: "Innovation Center", location: "Tech District", capacity: 1200, priceRange: "$8,000â€“$20,000", rating: 4.8, events: 18, type: "Indoor" },
  { name: "Skyline Terrace", location: "Hilltop", capacity: 250, priceRange: "$3,000â€“$8,000", rating: 4.7, events: 32, type: "Outdoor" },
  { name: "Garden Villa", location: "Suburbs", capacity: 150, priceRange: "$2,000â€“$5,000", rating: 4.6, events: 45, type: "Outdoor" },
  { name: "Expo Hall A", location: "Convention Center", capacity: 2000, priceRange: "$10,000â€“$30,000", rating: 4.8, events: 12, type: "Indoor" },
];

const vendors = [
  { name: "Elite Catering", category: "Catering", rating: 4.9, events: 120, priceRange: "$50â€“$150/person" },
  { name: "FlowerCraft", category: "Decoration", rating: 4.8, events: 85, priceRange: "$2,000â€“$10,000" },
  { name: "SoundWave DJ", category: "Entertainment", rating: 4.7, events: 200, priceRange: "$500â€“$3,000" },
  { name: "SnapStudio", category: "Photography", rating: 4.9, events: 150, priceRange: "$1,500â€“$5,000" },
  { name: "Sweet Moments", category: "Bakery", rating: 4.8, events: 90, priceRange: "$300â€“$2,000" },
  { name: "VIP Transport", category: "Transport", rating: 4.6, events: 60, priceRange: "$500â€“$3,000" },
];

const statusColors: Record<string, string> = {
  planning: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  completed: "bg-muted text-muted-foreground border-border",
};

interface RSVPEntry {
  id: string;
  event: string;
  guest: string;
  ticketType: string;
  status: "confirmed" | "pending" | "declined";
  seats: number;
  amount: string;
}

interface GalleryAlbum {
  id: string;
  event: string;
  photos: number;
  videos: number;
  date: string;
  photographer: string;
  status: "published" | "draft";
}

interface Campaign {
  id: string;
  name: string;
  event: string;
  channel: string;
  sent: number;
  opened: number;
  clicks: number;
  status: "active" | "scheduled" | "completed";
}

const mockRSVPs: RSVPEntry[] = [
  { id: "R1", event: "Royal Wedding â€” Al-Faisal", guest: "Prince Bandar Family", ticketType: "VIP", status: "confirmed", seats: 8, amount: "$2,400" },
  { id: "R2", event: "TechSummit 2026", guest: "NovaCorp Team", ticketType: "Corporate", status: "confirmed", seats: 15, amount: "$4,500" },
  { id: "R3", event: "Spring Gala Night", guest: "Layla Al-Rashid", ticketType: "Premium", status: "pending", seats: 2, amount: "$600" },
  { id: "R4", event: "TechSummit 2026", guest: "Ahmed Bakr", ticketType: "General", status: "confirmed", seats: 1, amount: "$150" },
  { id: "R5", event: "Birthday â€” Ahmed", guest: "Khalid Family", ticketType: "Free", status: "confirmed", seats: 5, amount: "Free" },
  { id: "R6", event: "Product Launch â€” NovaTech", guest: "Media Group", ticketType: "Press", status: "pending", seats: 4, amount: "Comp" },
  { id: "R7", event: "Spring Gala Night", guest: "Omar Siddiqui", ticketType: "Standard", status: "declined", seats: 2, amount: "$400" },
];

const mockGallery: GalleryAlbum[] = [
  { id: "G1", event: "Winter Gala 2025", photos: 245, videos: 8, date: "2025-12-20", photographer: "SnapStudio", status: "published" },
  { id: "G2", event: "Corporate Retreat", photos: 180, videos: 5, date: "2025-11-15", photographer: "SnapStudio", status: "published" },
  { id: "G3", event: "Charity Night", photos: 120, videos: 3, date: "2025-10-08", photographer: "LensArt", status: "published" },
  { id: "G4", event: "Spring Gala Night", photos: 0, videos: 0, date: "2026-03-01", photographer: "SnapStudio", status: "draft" },
];

const mockCampaigns: Campaign[] = [
  { id: "C1", name: "Early Bird Tickets", event: "TechSummit 2026", channel: "Email", sent: 5200, opened: 2340, clicks: 890, status: "completed" },
  { id: "C2", name: "VIP Invitation", event: "Royal Wedding", channel: "WhatsApp", sent: 400, opened: 380, clicks: 320, status: "active" },
  { id: "C3", name: "Gala Reminder", event: "Spring Gala Night", channel: "SMS", sent: 200, opened: 185, clicks: 140, status: "active" },
  { id: "C4", name: "Launch Teaser", event: "Product Launch", channel: "Social Media", sent: 0, opened: 0, clicks: 0, status: "scheduled" },
  { id: "C5", name: "Post-Event Survey", event: "Winter Gala 2025", channel: "Email", sent: 300, opened: 210, clicks: 95, status: "completed" },
];

const rsvpStatusColors: Record<string, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  declined: "bg-destructive/15 text-destructive border-destructive/30",
};

const campaignStatusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  scheduled: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  completed: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};

const EventPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["events", "venues", "vendors", "rsvp", "gallery", "marketing"] as const;
  type TabVal = typeof validTabs[number];
  const tabFromUrl = searchParams.get("tab") as TabVal | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "events";
  const handleTabChange = (value: string) => {
    if (value === "events") { searchParams.delete("tab"); } else { searchParams.set("tab", value); }
    setSearchParams(searchParams, { replace: true });
  };
  const totalEvents = events.length;
  const totalGuests = events.reduce((s, e) => s + e.guests, 0);
  const totalBudget = events.reduce((s, e) => s + e.budget, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Plan events, manage venues, and coordinate vendors</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10"><PartyPopper className="h-5 w-5 text-purple-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{totalEvents}</p><p className="text-xs text-muted-foreground">Active Events</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{totalGuests.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Guests</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">${(totalBudget / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Total Budget</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><MapPin className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{venues.length}</p><p className="text-xs text-muted-foreground">Venues</p></div>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="events" className="gap-1.5"><Calendar className="h-4 w-4" /> Events</TabsTrigger>
            <TabsTrigger value="venues" className="gap-1.5"><MapPin className="h-4 w-4" /> Venues</TabsTrigger>
            <TabsTrigger value="vendors" className="gap-1.5"><Users className="h-4 w-4" /> Vendors</TabsTrigger>
            <TabsTrigger value="rsvp" className="gap-1.5"><Ticket className="h-4 w-4" /> RSVP/Tickets</TabsTrigger>
            <TabsTrigger value="gallery" className="gap-1.5"><Image className="h-4 w-4" /> Gallery</TabsTrigger>
            <TabsTrigger value="marketing" className="gap-1.5"><Megaphone className="h-4 w-4" /> Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="space-y-4">
              {events.map(e => {
                const budgetPct = Math.round((e.spent / e.budget) * 100);
                const guestPct = Math.round((e.guests / e.capacity) * 100);
                return (
                  <Card key={e.id} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{e.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.venue}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{e.guests}/{e.capacity} guests</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{e.type}</Badge>
                          <Badge variant="outline" className={statusColors[e.status]}>{e.status}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Budget Used</span><span className="font-medium">${e.spent.toLocaleString()} / ${e.budget.toLocaleString()}</span></div>
                          <Progress value={budgetPct} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Guest Capacity</span><span className="font-medium">{guestPct}%</span></div>
                          <Progress value={guestPct} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="venues">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map(v => (
                <Card key={v.name} className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><MapPin className="h-6 w-6 text-primary" /></div>
                      <div>
                        <h3 className="font-semibold text-foreground">{v.name}</h3>
                        <p className="text-xs text-muted-foreground">{v.location} â€¢ {v.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">{v.capacity}</p><p className="text-muted-foreground">Capacity</p></div>
                      <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="font-bold text-foreground">{v.events}</p><p className="text-muted-foreground">Events</p></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{v.priceRange}</span>
                      <span className="flex items-center gap-1 text-amber-500"><Star className="h-3 w-3" />{v.rating}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vendors">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map(v => (
                <Card key={v.name} className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{v.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{v.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{v.rating}</span>
                      <span>{v.events} events</span>
                      <span>{v.priceRange}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Contact</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* RSVP / Ticketing Tab */}
          <TabsContent value="rsvp">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Ticket className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockRSVPs.length}</p><p className="text-xs text-muted-foreground">Total RSVPs</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockRSVPs.filter(r => r.status === "confirmed").length}</p><p className="text-xs text-muted-foreground">Confirmed</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockRSVPs.filter(r => r.status === "pending").length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Users className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockRSVPs.reduce((s, r) => s + r.seats, 0)}</p><p className="text-xs text-muted-foreground">Total Seats</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Guest List & Tickets</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("RSVP form coming soon!")}><Plus className="h-4 w-4" /> Add RSVP</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Ticket Type</TableHead>
                        <TableHead>Seats</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRSVPs.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium text-foreground">{r.guest}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{r.event}</TableCell>
                          <TableCell><Badge variant="outline">{r.ticketType}</Badge></TableCell>
                          <TableCell className="text-foreground">{r.seats}</TableCell>
                          <TableCell className="font-medium text-foreground">{r.amount}</TableCell>
                          <TableCell><Badge variant="outline" className={rsvpStatusColors[r.status]}>{r.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Image className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockGallery.reduce((s, g) => s + g.photos, 0)}</p><p className="text-xs text-muted-foreground">Total Photos</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Eye className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockGallery.filter(g => g.status === "published").length}</p><p className="text-xs text-muted-foreground">Published Albums</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockGallery.reduce((s, g) => s + g.videos, 0)}</p><p className="text-xs text-muted-foreground">Videos</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Heart className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockGallery.length}</p><p className="text-xs text-muted-foreground">Albums</p></div>
                </CardContent></Card>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {mockGallery.map((album) => (
                  <Card key={album.id} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{album.event}</h3>
                          <p className="text-xs text-muted-foreground">{album.date} â€¢ by {album.photographer}</p>
                        </div>
                        <Badge variant="outline" className={album.status === "published" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30"}>{album.status}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="aspect-square rounded-lg bg-muted/60 flex items-center justify-center">
                            <Image className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{album.photos} photos â€¢ {album.videos} videos</span>
                        <Button variant="outline" size="sm">{album.status === "draft" ? "Upload" : "View All"}</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Send className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockCampaigns.filter(c => c.status === "active").length}</p><p className="text-xs text-muted-foreground">Active Campaigns</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Mail className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{(mockCampaigns.reduce((s, c) => s + c.sent, 0) / 1000).toFixed(1)}K</p><p className="text-xs text-muted-foreground">Messages Sent</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Eye className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{Math.round(mockCampaigns.reduce((s, c) => s + c.opened, 0) / Math.max(mockCampaigns.reduce((s, c) => s + c.sent, 0), 1) * 100)}%</p><p className="text-xs text-muted-foreground">Open Rate</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><TrendingUp className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{Math.round(mockCampaigns.reduce((s, c) => s + c.clicks, 0) / Math.max(mockCampaigns.reduce((s, c) => s + c.opened, 0), 1) * 100)}%</p><p className="text-xs text-muted-foreground">Click Rate</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Marketing Campaigns</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Campaign builder coming soon!")}><Plus className="h-4 w-4" /> New Campaign</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Opened</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCampaigns.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{c.event}</TableCell>
                          <TableCell><Badge variant="outline">{c.channel}</Badge></TableCell>
                          <TableCell className="text-foreground">{c.sent.toLocaleString()}</TableCell>
                          <TableCell className="text-foreground">{c.opened.toLocaleString()}</TableCell>
                          <TableCell className="text-foreground">{c.clicks.toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline" className={campaignStatusColors[c.status]}>{c.status}</Badge></TableCell>
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
    </DashboardLayout>
  );
};

export default EventPage;
