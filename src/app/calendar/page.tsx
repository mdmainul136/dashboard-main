"use client";

import { useState, useMemo, DragEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Trash2, Edit2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  color: "primary" | "success" | "warning" | "destructive";
}

const colorMap = {
  primary: "bg-primary/15 text-primary border-l-primary",
  success: "bg-success/15 text-success border-l-success",
  warning: "bg-warning/15 text-warning border-l-warning",
  destructive: "bg-destructive/15 text-destructive border-l-destructive",
};

const colorDotMap = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const initialEvents: CalendarEvent[] = [
  { id: "1", title: "Team Standup", date: "2026-02-19", startTime: "09:00", endTime: "09:30", description: "Daily standup meeting with the engineering team", location: "Meeting Room A", color: "primary" },
  { id: "2", title: "Product Review", date: "2026-02-20", startTime: "14:00", endTime: "15:30", description: "Quarterly product review and roadmap planning", location: "Conference Room", color: "success" },
  { id: "3", title: "Client Call", date: "2026-02-23", startTime: "11:00", endTime: "12:00", description: "Onboarding call with new enterprise client", location: "Zoom", color: "warning" },
  { id: "4", title: "Sprint Retro", date: "2026-02-25", startTime: "16:00", endTime: "17:00", description: "Sprint retrospective and planning", location: "Meeting Room B", color: "destructive" },
  { id: "5", title: "Design Workshop", date: "2026-02-19", startTime: "13:00", endTime: "15:00", description: "UI/UX design workshop for new features", location: "Design Lab", color: "success" },
];

const emptyEvent: Omit<CalendarEvent, "id"> = {
  title: "", date: "", startTime: "09:00", endTime: "10:00", description: "", location: "", color: "primary",
};

/** Parse YYYY-MM-DD without timezone shift */
const parseDateString = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<Omit<CalendarEvent, "id">>(emptyEvent);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    return days;
  }, [year, month]);

  const weekDays = useMemo(() => {
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const formatDateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const today = new Date();
  const todayKey = formatDateKey(today);
  const getEventsForDate = (dateKey: string) => events.filter((e) => e.date === dateKey);

  const navigate = (dir: number) => {
    const next = new Date(currentDate);
    if (view === "monthly") next.setMonth(next.getMonth() + dir);
    else next.setDate(next.getDate() + dir * 7);
    setCurrentDate(next);
  };

  const goToday = () => setCurrentDate(new Date());

  const openAddDialog = (date?: string) => {
    setEditingEvent(null);
    setFormData({ ...emptyEvent, date: date || formatDateKey(currentDate) });
    setDialogOpen(true);
  };

  const openEditDialog = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({ title: event.title, date: event.date, startTime: event.startTime, endTime: event.endTime, description: event.description, location: event.location, color: event.color });
    setDetailOpen(false);
    setDialogOpen(true);
  };

  const saveEvent = () => {
    if (!formData.title.trim()) return;
    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? { ...e, ...formData } : e)));
    } else {
      setEvents((prev) => [...prev, { ...formData, id: crypto.randomUUID() }]);
    }
    setDialogOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDetailOpen(false);
  };

  const openEventDetail = (event: CalendarEvent) => {
    setDetailEvent(event);
    setDetailOpen(true);
  };

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLButtonElement>, eventId: string) => {
    e.dataTransfer.setData("text/plain", eventId);
    e.dataTransfer.effectAllowed = "move";
    // Add a slight delay to allow the drag image to be set
    (e.target as HTMLElement).style.opacity = "0.5";
  };

  const handleDragEnd = (e: DragEvent<HTMLButtonElement>) => {
    (e.target as HTMLElement).style.opacity = "1";
    setDragOverDate(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, dateKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverDate !== dateKey) setDragOverDate(dateKey);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dateKey: string) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    if (eventId) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === eventId ? { ...ev, date: dateKey } : ev))
      );
    }
    setDragOverDate(null);
  };

  const hours = Array.from({ length: 14 }, (_, i) => i + 7);

  // Reusable event chip (draggable)
  const EventChip = ({ ev, compact = false }: { ev: CalendarEvent; compact?: boolean }) => (
    <button
      draggable
      onDragStart={(e) => handleDragStart(e, ev.id)}
      onDragEnd={handleDragEnd}
      onClick={(e) => { e.stopPropagation(); openEventDetail(ev); }}
      className={cn(
        "group w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium border-l-2 transition-all hover:opacity-80 cursor-grab active:cursor-grabbing",
        colorMap[ev.color]
      )}
    >
      <span className="flex items-center gap-1">
        <GripVertical className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
        <span className="truncate">
          {compact ? ev.title : (
            <>
              <span className="font-semibold">{ev.title}</span>
              <span className="opacity-75 ml-1">{ev.startTime}</span>
            </>
          )}
        </span>
      </span>
    </button>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => router.push(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
          <h2 className="ml-2 text-lg font-semibold text-foreground">
            {view === "monthly"
              ? `${MONTHS[month]} ${year}`
              : `${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setView("monthly")}
              className={cn("px-4 py-2 text-sm font-medium transition-colors", view === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >Monthly</button>
            <button
              onClick={() => setView("weekly")}
              className={cn("px-4 py-2 text-sm font-medium transition-colors", view === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >Weekly</button>
          </div>
          <Button onClick={() => openAddDialog()} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      {/* Drag hint */}
      <p className="mb-3 text-xs text-muted-foreground">ðŸ’¡ Tip: Drag events to move them to a different date</p>

      {/* Monthly View */}
      {view === "monthly" && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map((day) => (
              <div key={day} className="px-2 py-3 text-center text-sm font-semibold text-muted-foreground">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((dayObj, idx) => {
              const dateKey = formatDateKey(dayObj.date);
              const dayEvents = getEventsForDate(dateKey);
              const isToday = dateKey === todayKey;
              const isDragOver = dragOverDate === dateKey;
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[100px] border-b border-r border-border p-1.5 transition-all cursor-pointer hover:bg-accent/50",
                    !dayObj.isCurrentMonth && "bg-muted/30",
                    isDragOver && "bg-primary/10 ring-2 ring-inset ring-primary/40"
                  )}
                  onClick={() => openAddDialog(dateKey)}
                  onDragOver={(e) => handleDragOver(e, dateKey)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateKey)}
                >
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                      isToday && "bg-primary text-primary-foreground font-bold",
                      !isToday && dayObj.isCurrentMonth && "text-foreground",
                      !isToday && !dayObj.isCurrentMonth && "text-muted-foreground"
                    )}
                  >
                    {dayObj.date.getDate()}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <EventChip key={ev.id} ev={ev} compact />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="block text-xs text-muted-foreground pl-1">+{dayEvents.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {view === "weekly" && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
            <div className="border-r border-border" />
            {weekDays.map((d, i) => {
              const dk = formatDateKey(d);
              const isToday = dk === todayKey;
              return (
                <div key={i} className={cn("px-2 py-3 text-center border-r border-border last:border-r-0", isToday && "bg-primary/5")}>
                  <p className="text-xs text-muted-foreground">{DAYS[d.getDay()]}</p>
                  <p className={cn("text-lg font-bold", isToday ? "text-primary" : "text-foreground")}>{d.getDate()}</p>
                </div>
              );
            })}
          </div>
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border last:border-b-0">
                <div className="flex items-start justify-end pr-2 pt-1 text-xs text-muted-foreground border-r border-border">
                  {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                {weekDays.map((d, i) => {
                  const dk = formatDateKey(d);
                  const isDragOver = dragOverDate === dk;
                  const hourEvents = getEventsForDate(dk).filter((ev) => parseInt(ev.startTime.split(":")[0]) === hour);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "min-h-[60px] border-r border-border last:border-r-0 p-0.5 cursor-pointer hover:bg-accent/30",
                        isDragOver && "bg-primary/10"
                      )}
                      onClick={() => openAddDialog(dk)}
                      onDragOver={(e) => handleDragOver(e, dk)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, dk)}
                    >
                      {hourEvents.map((ev) => (
                        <EventChip key={ev.id} ev={ev} />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter event title" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Color</Label>
                <Select value={formData.color} onValueChange={(v: CalendarEvent["color"]) => setFormData({ ...formData, color: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary"><span className="flex items-center gap-2"><span className={cn("h-2.5 w-2.5 rounded-full", colorDotMap.primary)} /> Blue</span></SelectItem>
                    <SelectItem value="success"><span className="flex items-center gap-2"><span className={cn("h-2.5 w-2.5 rounded-full", colorDotMap.success)} /> Green</span></SelectItem>
                    <SelectItem value="warning"><span className="flex items-center gap-2"><span className={cn("h-2.5 w-2.5 rounded-full", colorDotMap.warning)} /> Orange</span></SelectItem>
                    <SelectItem value="destructive"><span className="flex items-center gap-2"><span className={cn("h-2.5 w-2.5 rounded-full", colorDotMap.destructive)} /> Red</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter location" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter description" className="mt-1.5" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEvent}>{editingEvent ? "Update" : "Add Event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[420px]">
          {detailEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", colorDotMap[detailEvent.color])} />
                  <DialogTitle>{detailEvent.title}</DialogTitle>
                </div>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {parseDateString(detailEvent.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    {" Â· "}
                    {detailEvent.startTime} - {detailEvent.endTime}
                  </span>
                </div>
                {detailEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{detailEvent.location}</span>
                  </div>
                )}
                {detailEvent.description && (
                  <p className="text-sm text-foreground leading-relaxed">{detailEvent.description}</p>
                )}
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(detailEvent)} className="gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteEvent(detailEvent.id)} className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CalendarPage;

