"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus, CalendarCheck, Clock, CheckCircle2,
  XCircle, AlertCircle, Phone, Mail, Calendar,
  Video, MapPin, Repeat, ArrowRight, Timer, Users,
  Pencil, Trash2, ToggleLeft,
} from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

interface Appointment {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  status: BookingStatus;
  phone: string;
  email: string;
  type: "in-person" | "video" | "phone";
  notes?: string;
}

interface ServiceType {
  id: string;
  name: string;
  duration: string;
  price: string;
  active: boolean;
  color: string;
  bookings: number;
  description: string;
}

const mockAppointments: Appointment[] = [
  { id: "1", client: "Sara Ahmed", service: "Consultation", date: "Today", time: "10:00 AM", duration: "30 min", status: "confirmed", phone: "+966 50 123 4567", email: "sara@email.com", type: "video" },
  { id: "2", client: "Mohammed Ali", service: "Strategy Session", date: "Today", time: "2:00 PM", duration: "60 min", status: "pending", phone: "+966 55 987 6543", email: "m.ali@email.com", type: "in-person" },
  { id: "3", client: "Fatima Hassan", service: "Design Review", date: "Tomorrow", time: "11:00 AM", duration: "45 min", status: "confirmed", phone: "+966 54 111 2222", email: "fatima@email.com", type: "video", notes: "Second revision review" },
  { id: "4", client: "Omar Khalid", service: "Consultation", date: "Tomorrow", time: "3:30 PM", duration: "30 min", status: "pending", phone: "+966 50 333 4444", email: "omar@email.com", type: "phone" },
  { id: "5", client: "Noor Yusuf", service: "Project Kickoff", date: "Yesterday", time: "9:00 AM", duration: "90 min", status: "completed", phone: "+966 56 555 6666", email: "noor@email.com", type: "in-person" },
  { id: "6", client: "Khalid Mansour", service: "Follow-up", date: "2 days ago", time: "4:00 PM", duration: "15 min", status: "cancelled", phone: "+966 50 777 8888", email: "khalid@email.com", type: "phone" },
];

const mockServices: ServiceType[] = [
  { id: "1", name: "Free Consultation", duration: "30 min", price: "Free", active: true, color: "from-success/20 to-success/5", bookings: 24, description: "Initial meeting to understand requirements" },
  { id: "2", name: "Strategy Session", duration: "60 min", price: "SAR 200", active: true, color: "from-primary/20 to-primary/5", bookings: 18, description: "Deep-dive strategy and planning session" },
  { id: "3", name: "Design Review", duration: "45 min", price: "SAR 150", active: true, color: "from-warning/20 to-warning/5", bookings: 12, description: "Review designs and provide feedback" },
  { id: "4", name: "Project Kickoff", duration: "90 min", price: "SAR 350", active: true, color: "from-destructive/20 to-destructive/5", bookings: 8, description: "Comprehensive project initiation meeting" },
  { id: "5", name: "Follow-up Call", duration: "15 min", price: "Free", active: true, color: "from-success/20 to-success/5", bookings: 32, description: "Quick check-in on project progress" },
  { id: "6", name: "Workshop", duration: "120 min", price: "SAR 500", active: false, color: "from-muted-foreground/20 to-muted-foreground/5", bookings: 3, description: "Interactive group workshop session" },
];

const statusConfig: Record<BookingStatus, { label: string; icon: React.ReactNode; bgColor: string; textColor: string }> = {
  confirmed: { label: "Confirmed", icon: <CheckCircle2 className="h-3.5 w-3.5" />, bgColor: "bg-success/10", textColor: "text-success" },
  pending: { label: "Pending", icon: <AlertCircle className="h-3.5 w-3.5" />, bgColor: "bg-warning/10", textColor: "text-warning" },
  completed: { label: "Completed", icon: <CheckCircle2 className="h-3.5 w-3.5" />, bgColor: "bg-primary/10", textColor: "text-primary" },
  cancelled: { label: "Cancelled", icon: <XCircle className="h-3.5 w-3.5" />, bgColor: "bg-destructive/10", textColor: "text-destructive" },
};

const typeConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  "in-person": { icon: <MapPin className="h-3.5 w-3.5" />, label: "In-Person" },
  "video": { icon: <Video className="h-3.5 w-3.5" />, label: "Video Call" },
  "phone": { icon: <Phone className="h-3.5 w-3.5" />, label: "Phone Call" },
};

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarDays = Array.from({ length: 28 }, (_, i) => i + 1);
const bookedDays = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26];
const today = 20;

const AppointmentBookingPage = () => {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = statusFilter === "all"
    ? mockAppointments
    : mockAppointments.filter(a => a.status === statusFilter);

  const todayCount = mockAppointments.filter(a => a.date === "Today").length;
  const confirmedCount = mockAppointments.filter(a => a.status === "confirmed").length;
  const pendingCount = mockAppointments.filter(a => a.status === "pending").length;
  const totalBookings = mockServices.reduce((s, sv) => s + sv.bookings, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Appointment Booking</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage service bookings, time slots, and client appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Calendar className="h-4 w-4 mr-1.5" /> Sync Calendar</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> New Booking</Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Create Booking</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input placeholder="Full name" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+966 5X XXX XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input placeholder="email@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                        <SelectContent>
                          {mockServices.filter(s => s.active).map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name} ({s.duration})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Meeting Type</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">ðŸ¢ In-Person</SelectItem>
                          <SelectItem value="video">ðŸ“¹ Video Call</SelectItem>
                          <SelectItem value="phone">ðŸ“ž Phone Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Slot</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="reminder" defaultChecked />
                    <Label htmlFor="reminder" className="text-sm text-muted-foreground">Send email reminder 24h before</Label>
                  </div>
                  <Button className="w-full" onClick={() => setDialogOpen(false)}>Book Appointment</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Today", value: todayCount, icon: <Calendar className="h-5 w-5" />, iconClass: "stat-icon" },
            { label: "Confirmed", value: confirmedCount, icon: <CheckCircle2 className="h-5 w-5" />, iconClass: "stat-icon-success" },
            { label: "Pending", value: pendingCount, icon: <AlertCircle className="h-5 w-5" />, iconClass: "stat-icon-warning" },
            { label: "Total Bookings", value: totalBookings, icon: <Users className="h-5 w-5" />, iconClass: "stat-icon-info" },
            { label: "Services", value: mockServices.filter(s => s.active).length, icon: <Clock className="h-5 w-5" />, iconClass: "stat-icon" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={stat.iconClass}>{stat.icon}</div>
                <p className="text-xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="bookings">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="services">Services ({mockServices.length})</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* Bookings */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map(s => (
                <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>
                  {s === "all" ? "All" : statusConfig[s].label}
                  <span className="ml-1 opacity-60">
                    ({s === "all" ? mockAppointments.length : mockAppointments.filter(a => a.status === s).length})
                  </span>
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map((apt) => (
                <Card key={apt.id} className="group">
                  <CardContent className="flex items-center justify-between p-4 gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {apt.client.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{apt.client}</p>
                          <Badge variant="outline" className={`${statusConfig[apt.status].bgColor} ${statusConfig[apt.status].textColor} border-transparent text-[10px]`}>
                            {statusConfig[apt.status].icon}
                            <span className="ml-1">{statusConfig[apt.status].label}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span>{apt.service}</span>
                          <span>Â·</span>
                          <span className="flex items-center gap-1">{typeConfig[apt.type].icon} {typeConfig[apt.type].label}</span>
                          <span>Â·</span>
                          <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {apt.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground">{apt.date}</p>
                        <p className="text-xs text-muted-foreground">{apt.time}</p>
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calendar */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">February 2026</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">â† Prev</Button>
                    <Button variant="ghost" size="sm">Next â†’</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(day => {
                    const isBooked = bookedDays.includes(day);
                    const isToday = day === today;
                    return (
                      <div
                        key={day}
                        className={`
                          relative h-14 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all text-sm
                          ${isToday ? "bg-primary text-primary-foreground font-bold ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}
                          ${isBooked && !isToday ? "bg-primary/10 text-primary font-medium" : ""}
                          ${!isBooked && !isToday ? "hover:bg-muted text-foreground" : ""}
                        `}
                      >
                        {day}
                        {isBooked && (
                          <div className={`h-1 w-1 rounded-full mt-0.5 ${isToday ? "bg-primary-foreground" : "bg-primary"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-primary" /> Today</span>
                  <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-primary/30" /> Has bookings</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Service</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockServices.map((service) => (
                <Card key={service.id} className={`overflow-hidden ${!service.active ? "opacity-50" : ""}`}>
                  <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                      </div>
                      <Badge variant={service.active ? "default" : "secondary"} className="shrink-0">
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {service.duration}</span>
                      <span className="font-semibold text-foreground">{service.price}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">{service.bookings} bookings</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Availability */}
          <TabsContent value="availability">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { day: "Sunday", hours: "9:00 AM â€“ 5:00 PM", active: true },
                    { day: "Monday", hours: "9:00 AM â€“ 5:00 PM", active: true },
                    { day: "Tuesday", hours: "9:00 AM â€“ 5:00 PM", active: true },
                    { day: "Wednesday", hours: "9:00 AM â€“ 6:00 PM", active: true },
                    { day: "Thursday", hours: "9:00 AM â€“ 3:00 PM", active: true },
                    { day: "Friday", hours: "Closed", active: false },
                    { day: "Saturday", hours: "Closed", active: false },
                  ].map((d) => (
                    <div key={d.day} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Switch checked={d.active} />
                        <p className={`font-medium text-sm ${d.active ? "text-foreground" : "text-muted-foreground"}`}>{d.day}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.active ? (
                          <Badge variant="outline">{d.hours}</Badge>
                        ) : (
                          <Badge variant="secondary">Closed</Badge>
                        )}
                        {d.active && <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Booking Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Auto-confirm bookings", desc: "Automatically confirm new appointments", checked: false },
                    { label: "Buffer time between slots", desc: "Add 15 min gap between appointments", checked: true },
                    { label: "Email reminders", desc: "Send reminder 24h before appointment", checked: true },
                    { label: "SMS notifications", desc: "Send SMS to client on booking", checked: false },
                    { label: "Allow cancellations", desc: "Clients can cancel up to 4h before", checked: true },
                    { label: "Double booking protection", desc: "Prevent overlapping time slots", checked: true },
                  ].map(setting => (
                    <div key={setting.label} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-sm font-medium text-foreground">{setting.label}</p>
                        <p className="text-xs text-muted-foreground">{setting.desc}</p>
                      </div>
                      <Switch defaultChecked={setting.checked} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentBookingPage;

