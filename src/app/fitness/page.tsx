"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dumbbell, Users, Calendar, CreditCard, Plus, Clock, TrendingUp, Star, Trophy, Activity,
  Timer, Target, LineChart, Apple, Wrench, CheckCircle2, AlertTriangle, Search, Mail, Phone,
  Award, UserCog, ChevronRight, Flame, Heart, Zap,
} from "lucide-react";

// â”€â”€â”€ Interfaces â”€â”€â”€
interface FitnessClass {
  id: string; name: string; trainer: string; day: string; time: string; duration: string;
  capacity: number; enrolled: number; category: string; room: string; level: string;
}
interface Member {
  id: string; name: string; plan: string; joinDate: string; expiryDate: string;
  status: "active" | "expired" | "frozen"; attendance: number;
}
interface ProgressEntry {
  id: string; member: string; metric: string; startValue: string; currentValue: string;
  goal: string; progress: number; trend: "up" | "down" | "stable"; lastUpdate: string;
  weeklyData: number[];
}
interface Trainer {
  id: string; name: string; specialties: string[]; rating: number; totalClients: number;
  activeClients: number; certifications: string[]; experience: string; schedule: string;
  status: "available" | "in-session" | "off-duty"; avatar: string; email: string;
  phone: string; monthlyRevenue: number; retentionRate: number;
}
interface NutritionPlan {
  id: string; name: string; type: string; calories: number; protein: string; carbs: string;
  fat: string; assignedTo: number; status: "active" | "draft";
}
interface Equipment {
  id: string; name: string; category: string; quantity: number;
  condition: "good" | "fair" | "needs-repair"; lastMaintenance: string; nextMaintenance: string;
}

// â”€â”€â”€ Mock Data â”€â”€â”€
const mockClasses: FitnessClass[] = [
  { id: "C1", name: "CrossFit Burn", trainer: "Coach Ahmed", day: "Mon/Wed/Fri", time: "06:00", duration: "60 min", capacity: 20, enrolled: 18, category: "CrossFit", room: "Room A", level: "Advanced" },
  { id: "C2", name: "Yoga Flow", trainer: "Coach Layla", day: "Tue/Thu", time: "07:00", duration: "75 min", capacity: 15, enrolled: 12, category: "Yoga", room: "Studio B", level: "All Levels" },
  { id: "C3", name: "HIIT Express", trainer: "Coach Omar", day: "Mon-Fri", time: "12:00", duration: "30 min", capacity: 25, enrolled: 22, category: "HIIT", room: "Room A", level: "Intermediate" },
  { id: "C4", name: "Boxing Basics", trainer: "Coach Khalid", day: "Tue/Thu/Sat", time: "18:00", duration: "60 min", capacity: 16, enrolled: 14, category: "Boxing", room: "Ring Zone", level: "Beginner" },
  { id: "C5", name: "Spin Cycle", trainer: "Coach Sara", day: "Mon/Wed/Fri", time: "17:00", duration: "45 min", capacity: 30, enrolled: 28, category: "Cycling", room: "Spin Hall", level: "All Levels" },
  { id: "C6", name: "Pilates Core", trainer: "Coach Layla", day: "Wed/Sat", time: "09:00", duration: "60 min", capacity: 12, enrolled: 10, category: "Pilates", room: "Studio B", level: "Intermediate" },
  { id: "C7", name: "Strength Foundations", trainer: "Coach Ahmed", day: "Tue/Thu", time: "08:00", duration: "60 min", capacity: 18, enrolled: 15, category: "Strength", room: "Room A", level: "Beginner" },
  { id: "C8", name: "Zumba Dance", trainer: "Coach Sara", day: "Mon/Wed", time: "19:00", duration: "50 min", capacity: 35, enrolled: 32, category: "Dance", room: "Main Hall", level: "All Levels" },
];

const mockMembers: Member[] = [
  { id: "M1", name: "Abdullah Saleh", plan: "Premium", joinDate: "2025-06-15", expiryDate: "2026-06-15", status: "active", attendance: 85 },
  { id: "M2", name: "Noura Al-Zahrani", plan: "Basic", joinDate: "2025-09-01", expiryDate: "2026-03-01", status: "active", attendance: 72 },
  { id: "M3", name: "Faisal Abdulrahman", plan: "Premium", joinDate: "2025-03-20", expiryDate: "2026-03-20", status: "active", attendance: 92 },
  { id: "M4", name: "Huda Mohammad", plan: "Student", joinDate: "2025-11-10", expiryDate: "2026-02-10", status: "expired", attendance: 45 },
  { id: "M5", name: "Tariq Bashar", plan: "Premium", joinDate: "2025-08-05", expiryDate: "2026-08-05", status: "frozen", attendance: 68 },
];

const mockProgress: ProgressEntry[] = [
  { id: "P1", member: "Abdullah Saleh", metric: "Weight Loss", startValue: "92 kg", currentValue: "85 kg", goal: "80 kg", progress: 58, trend: "down", lastUpdate: "2026-02-18", weeklyData: [92, 91, 90, 89, 87, 86, 85] },
  { id: "P2", member: "Noura Al-Zahrani", metric: "Body Fat %", startValue: "32%", currentValue: "26%", goal: "22%", progress: 60, trend: "down", lastUpdate: "2026-02-19", weeklyData: [32, 31, 30, 29, 28, 27, 26] },
  { id: "P3", member: "Faisal Abdulrahman", metric: "Bench Press", startValue: "60 kg", currentValue: "90 kg", goal: "100 kg", progress: 75, trend: "up", lastUpdate: "2026-02-20", weeklyData: [60, 65, 70, 75, 80, 85, 90] },
  { id: "P4", member: "Huda Mohammad", metric: "5K Run Time", startValue: "35 min", currentValue: "28 min", goal: "25 min", progress: 70, trend: "down", lastUpdate: "2026-02-17", weeklyData: [35, 34, 33, 31, 30, 29, 28] },
  { id: "P5", member: "Tariq Bashar", metric: "Muscle Mass", startValue: "65 kg", currentValue: "72 kg", goal: "78 kg", progress: 54, trend: "up", lastUpdate: "2026-02-16", weeklyData: [65, 66, 67, 68, 69, 71, 72] },
  { id: "P6", member: "Abdullah Saleh", metric: "Squat PR", startValue: "80 kg", currentValue: "110 kg", goal: "120 kg", progress: 75, trend: "up", lastUpdate: "2026-02-19", weeklyData: [80, 85, 90, 95, 100, 105, 110] },
  { id: "P7", member: "Faisal Abdulrahman", metric: "Body Fat %", startValue: "22%", currentValue: "16%", goal: "12%", progress: 60, trend: "down", lastUpdate: "2026-02-18", weeklyData: [22, 21, 20, 19, 18, 17, 16] },
];

const mockTrainers: Trainer[] = [
  { id: "T1", name: "Coach Ahmed", specialties: ["CrossFit", "HIIT", "Strength"], rating: 4.9, totalClients: 86, activeClients: 42, certifications: ["NASM-CPT", "CrossFit L2", "First Aid"], experience: "8 years", schedule: "Mon-Sat 6AM-2PM", status: "available", avatar: "ðŸ‹ï¸", email: "ahmed@gym.com", phone: "+966-50-111-2222", monthlyRevenue: 18500, retentionRate: 94 },
  { id: "T2", name: "Coach Layla", specialties: ["Yoga", "Pilates", "Meditation"], rating: 4.8, totalClients: 64, activeClients: 35, certifications: ["RYT-500", "Pilates Certified", "Nutrition Coach"], experience: "6 years", schedule: "Mon-Fri 7AM-3PM", status: "in-session", avatar: "ðŸ§˜", email: "layla@gym.com", phone: "+966-50-333-4444", monthlyRevenue: 14200, retentionRate: 91 },
  { id: "T3", name: "Coach Omar", specialties: ["HIIT", "Strength", "Functional"], rating: 4.7, totalClients: 52, activeClients: 28, certifications: ["ACE-CPT", "TRX Certified"], experience: "5 years", schedule: "Mon-Fri 10AM-6PM", status: "available", avatar: "ðŸ’ª", email: "omar@gym.com", phone: "+966-50-555-6666", monthlyRevenue: 12800, retentionRate: 87 },
  { id: "T4", name: "Coach Khalid", specialties: ["Boxing", "MMA", "Self-Defense"], rating: 4.9, totalClients: 45, activeClients: 22, certifications: ["Boxing Coach L3", "MMA Instructor", "Sports Nutrition"], experience: "10 years", schedule: "Tue-Sat 4PM-10PM", status: "off-duty", avatar: "ðŸ¥Š", email: "khalid@gym.com", phone: "+966-50-777-8888", monthlyRevenue: 11500, retentionRate: 92 },
  { id: "T5", name: "Coach Sara", specialties: ["Cycling", "Dance", "Cardio"], rating: 4.8, totalClients: 70, activeClients: 48, certifications: ["Spinning Certified", "Zumba Instructor", "CPR/AED"], experience: "4 years", schedule: "Mon-Fri 3PM-9PM", status: "in-session", avatar: "ðŸš´", email: "sara@gym.com", phone: "+966-50-999-0000", monthlyRevenue: 15300, retentionRate: 89 },
];

const mockNutritionPlans: NutritionPlan[] = [
  { id: "N1", name: "Lean Muscle Builder", type: "High Protein", calories: 2800, protein: "200g", carbs: "280g", fat: "80g", assignedTo: 18, status: "active" },
  { id: "N2", name: "Fat Loss Express", type: "Low Carb", calories: 1800, protein: "150g", carbs: "100g", fat: "90g", assignedTo: 24, status: "active" },
  { id: "N3", name: "Endurance Fuel", type: "High Carb", calories: 3200, protein: "140g", carbs: "420g", fat: "70g", assignedTo: 12, status: "active" },
  { id: "N4", name: "Balanced Wellness", type: "Balanced", calories: 2200, protein: "120g", carbs: "250g", fat: "75g", assignedTo: 30, status: "active" },
  { id: "N5", name: "Keto Power", type: "Ketogenic", calories: 2000, protein: "130g", carbs: "30g", fat: "150g", assignedTo: 0, status: "draft" },
];

const mockEquipment: Equipment[] = [
  { id: "E1", name: "Treadmill Pro X500", category: "Cardio", quantity: 8, condition: "good", lastMaintenance: "2026-01-15", nextMaintenance: "2026-04-15" },
  { id: "E2", name: "Adjustable Dumbbells", category: "Free Weights", quantity: 20, condition: "good", lastMaintenance: "2026-02-01", nextMaintenance: "2026-05-01" },
  { id: "E3", name: "Cable Crossover Machine", category: "Machines", quantity: 2, condition: "fair", lastMaintenance: "2025-12-10", nextMaintenance: "2026-03-10" },
  { id: "E4", name: "Spin Bike Elite", category: "Cardio", quantity: 15, condition: "good", lastMaintenance: "2026-01-20", nextMaintenance: "2026-04-20" },
  { id: "E5", name: "Leg Press Machine", category: "Machines", quantity: 3, condition: "needs-repair", lastMaintenance: "2025-11-05", nextMaintenance: "2026-02-05" },
  { id: "E6", name: "Olympic Barbells", category: "Free Weights", quantity: 10, condition: "good", lastMaintenance: "2026-01-30", nextMaintenance: "2026-04-30" },
  { id: "E7", name: "Rowing Machine", category: "Cardio", quantity: 4, condition: "fair", lastMaintenance: "2025-12-20", nextMaintenance: "2026-03-20" },
  { id: "E8", name: "Yoga Mats", category: "Accessories", quantity: 30, condition: "good", lastMaintenance: "2026-02-10", nextMaintenance: "2026-08-10" },
];

const conditionColors: Record<string, string> = {
  good: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  fair: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "needs-repair": "bg-destructive/15 text-destructive border-destructive/30",
};
const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  expired: "bg-destructive/15 text-destructive border-destructive/30",
  frozen: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  draft: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
  available: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "in-session": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "off-duty": "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};

const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const FitnessPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["schedule", "members", "trainers", "plans", "progress", "nutrition", "equipment"] as const;
  type TabVal = typeof validTabs[number];
  const tabFromUrl = searchParams.get("tab") as TabVal | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "schedule";
  const handleTabChange = (value: string) => {
    if (value === "schedule") { searchParams.delete("tab"); } else { searchParams.set("tab", value); }
    setSearchParams(searchParams, { replace: true });
  };

  const [addClassOpen, setAddClassOpen] = useState(false);
  const activeMembers = mockMembers.filter(m => m.status === "active").length;

  // Schedule filters
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [scheduleCategory, setScheduleCategory] = useState("all");
  const [scheduleDay, setScheduleDay] = useState("all");
  const [scheduleView, setScheduleView] = useState<"grid" | "timetable">("grid");

  const categories = [...new Set(mockClasses.map(c => c.category))];

  const filteredClasses = useMemo(() => {
    return mockClasses.filter(cls => {
      const matchSearch = !scheduleSearch || cls.name.toLowerCase().includes(scheduleSearch.toLowerCase()) || cls.trainer.toLowerCase().includes(scheduleSearch.toLowerCase());
      const matchCategory = scheduleCategory === "all" || cls.category === scheduleCategory;
      const matchDay = scheduleDay === "all" || cls.day.includes(scheduleDay);
      return matchSearch && matchCategory && matchDay;
    });
  }, [scheduleSearch, scheduleCategory, scheduleDay]);

  // Progress filters
  const [progressSearch, setProgressSearch] = useState("");
  const [progressMetric, setProgressMetric] = useState("all");
  const progressMetrics = [...new Set(mockProgress.map(p => p.metric))];

  const filteredProgress = useMemo(() => {
    return mockProgress.filter(p => {
      const matchSearch = !progressSearch || p.member.toLowerCase().includes(progressSearch.toLowerCase());
      const matchMetric = progressMetric === "all" || p.metric === progressMetric;
      return matchSearch && matchMetric;
    });
  }, [progressSearch, progressMetric]);

  // Trainer filters
  const [trainerSearch, setTrainerSearch] = useState("");
  const [trainerStatus, setTrainerStatus] = useState("all");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const filteredTrainers = useMemo(() => {
    return mockTrainers.filter(t => {
      const matchSearch = !trainerSearch || t.name.toLowerCase().includes(trainerSearch.toLowerCase()) || t.specialties.some(s => s.toLowerCase().includes(trainerSearch.toLowerCase()));
      const matchStatus = trainerStatus === "all" || t.status === trainerStatus;
      return matchSearch && matchStatus;
    });
  }, [trainerSearch, trainerStatus]);

  // Timetable helper
  const getClassForSlot = (day: string, time: string) => {
    return filteredClasses.find(cls => cls.time === time && cls.day.includes(day));
  };

  const totalTrainerRevenue = mockTrainers.reduce((s, t) => s + t.monthlyRevenue, 0);
  const avgRetention = Math.round(mockTrainers.reduce((s, t) => s + t.retentionRate, 0) / mockTrainers.length);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fitness Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage classes, memberships, and trainer schedules</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{activeMembers}</p><p className="text-xs text-muted-foreground">Active Members</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Calendar className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{mockClasses.length}</p><p className="text-xs text-muted-foreground">Weekly Classes</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><TrendingUp className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">87%</p><p className="text-xs text-muted-foreground">Avg Attendance</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Trophy className="h-5 w-5 text-violet-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{mockTrainers.length}</p><p className="text-xs text-muted-foreground">Trainers</p></div>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="schedule" className="gap-1.5"><Calendar className="h-4 w-4" /> Schedule</TabsTrigger>
            <TabsTrigger value="members" className="gap-1.5"><Users className="h-4 w-4" /> Members</TabsTrigger>
            <TabsTrigger value="trainers" className="gap-1.5"><Dumbbell className="h-4 w-4" /> Trainers</TabsTrigger>
            <TabsTrigger value="plans" className="gap-1.5"><CreditCard className="h-4 w-4" /> Plans</TabsTrigger>
            <TabsTrigger value="progress" className="gap-1.5"><LineChart className="h-4 w-4" /> Progress</TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-1.5"><Apple className="h-4 w-4" /> Nutrition</TabsTrigger>
            <TabsTrigger value="equipment" className="gap-1.5"><Wrench className="h-4 w-4" /> Equipment</TabsTrigger>
          </TabsList>

          {/* â•â•â• Enhanced Schedule Tab â•â•â• */}
          <TabsContent value="schedule">
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search class or trainer..." value={scheduleSearch} onChange={e => setScheduleSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={scheduleCategory} onValueChange={setScheduleCategory}>
                      <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={scheduleDay} onValueChange={setScheduleDay}>
                      <SelectTrigger className="w-[130px]"><SelectValue placeholder="Day" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Days</SelectItem>
                        {weekDays.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1 rounded-lg border border-border p-0.5">
                      <Button variant={scheduleView === "grid" ? "default" : "ghost"} size="sm" onClick={() => setScheduleView("grid")}>Grid</Button>
                      <Button variant={scheduleView === "timetable" ? "default" : "ghost"} size="sm" onClick={() => setScheduleView("timetable")}>Timetable</Button>
                    </div>
                    <Button size="sm" className="gap-1.5" onClick={() => setAddClassOpen(true)}><Plus className="h-4 w-4" /> Add Class</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Overview */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Slots</p>
                  <p className="text-2xl font-bold text-foreground">{filteredClasses.reduce((s, c) => s + c.capacity, 0)}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                  <p className="text-2xl font-bold text-primary">{filteredClasses.reduce((s, c) => s + c.enrolled, 0)}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Available Spots</p>
                  <p className="text-2xl font-bold text-emerald-500">{filteredClasses.reduce((s, c) => s + (c.capacity - c.enrolled), 0)}</p>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Avg Fill Rate</p>
                  <p className="text-2xl font-bold text-foreground">{filteredClasses.length ? Math.round(filteredClasses.reduce((s, c) => s + (c.enrolled / c.capacity) * 100, 0) / filteredClasses.length) : 0}%</p>
                </CardContent></Card>
              </div>

              {scheduleView === "grid" ? (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Classes ({filteredClasses.length})</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredClasses.map((cls) => {
                        const fillPct = Math.round((cls.enrolled / cls.capacity) * 100);
                        const isFull = fillPct >= 90;
                        return (
                          <div key={cls.id} className="rounded-xl border border-border p-4 space-y-3 hover:border-primary/40 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{cls.name}</h3>
                                <p className="text-xs text-muted-foreground">{cls.trainer}</p>
                              </div>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-[10px]">{cls.category}</Badge>
                                <Badge variant="outline" className="text-[10px]">{cls.level}</Badge>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {cls.day}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cls.time}</span>
                              <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {cls.duration}</span>
                              <span className="flex items-center gap-1">ðŸ“ {cls.room}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{cls.enrolled}/{cls.capacity} enrolled</span>
                                <span className={isFull ? "text-destructive font-medium" : "text-emerald-500 font-medium"}>{fillPct}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${isFull ? "bg-destructive" : "bg-emerald-500"}`} style={{ width: `${fillPct}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredClasses.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No classes match your filters</p>}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Weekly Timetable</CardTitle></CardHeader>
                  <CardContent className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="p-2 border border-border bg-muted/50 text-muted-foreground font-medium w-16">Time</th>
                          {weekDays.map(d => <th key={d} className="p-2 border border-border bg-muted/50 text-muted-foreground font-medium">{d}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map(time => (
                          <tr key={time}>
                            <td className="p-2 border border-border text-muted-foreground font-medium bg-muted/30">{time}</td>
                            {weekDays.map(day => {
                              const cls = getClassForSlot(day, time);
                              return (
                                <td key={day} className="p-1 border border-border">
                                  {cls ? (
                                    <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5 space-y-0.5">
                                      <p className="font-semibold text-foreground truncate">{cls.name}</p>
                                      <p className="text-muted-foreground">{cls.trainer}</p>
                                      <p className="text-muted-foreground">{cls.duration} â€¢ {cls.room}</p>
                                      <div className="flex items-center gap-1">
                                        <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                                          <div className="h-full rounded-full bg-primary" style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }} />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{cls.enrolled}/{cls.capacity}</span>
                                      </div>
                                    </div>
                                  ) : null}
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

          {/* Members Tab (unchanged) */}
          <TabsContent value="members">
            <Card>
              <CardHeader><CardTitle className="text-base">Members ({mockMembers.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{m.name.charAt(0)}</div>
                        <div>
                          <p className="font-medium text-foreground">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.plan} Plan â€¢ Since {m.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Attendance</p>
                          <p className="font-bold text-foreground">{m.attendance}%</p>
                        </div>
                        <Badge variant="outline" className={statusColors[m.status]}>{m.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* â•â•â• Enhanced Trainers Tab â•â•â• */}
          <TabsContent value="trainers">
            <div className="space-y-4">
              {/* Trainer KPIs */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><UserCog className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockTrainers.length}</p><p className="text-xs text-muted-foreground">Total Trainers</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Users className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockTrainers.reduce((s, t) => s + t.activeClients, 0)}</p><p className="text-xs text-muted-foreground">Active Clients</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><TrendingUp className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${(totalTrainerRevenue / 1000).toFixed(1)}k</p><p className="text-xs text-muted-foreground">Monthly Revenue</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Heart className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{avgRetention}%</p><p className="text-xs text-muted-foreground">Avg Retention</p></div>
                </CardContent></Card>
              </div>

              {/* Trainer Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search trainer or specialty..." value={trainerSearch} onChange={e => setTrainerSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={trainerStatus} onValueChange={setTrainerStatus}>
                      <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-session">In Session</SelectItem>
                        <SelectItem value="off-duty">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5" onClick={() => toast.success("Trainer form coming soon!")}><Plus className="h-4 w-4" /> Add Trainer</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trainer Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTrainers.map(trainer => (
                  <Card key={trainer.id} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setSelectedTrainer(trainer)}>
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">{trainer.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{trainer.name}</h3>
                            <Badge variant="outline" className={statusColors[trainer.status]}>{trainer.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{trainer.experience} experience</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-medium text-foreground">{trainer.rating}</span>
                            <span className="text-xs text-muted-foreground">â€¢ {trainer.totalClients} total clients</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {trainer.specialties.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-lg font-bold text-primary">{trainer.activeClients}</p>
                          <p className="text-[10px] text-muted-foreground">Active</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-lg font-bold text-foreground">{trainer.retentionRate}%</p>
                          <p className="text-[10px] text-muted-foreground">Retention</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-lg font-bold text-emerald-500">${(trainer.monthlyRevenue / 1000).toFixed(1)}k</p>
                          <p className="text-[10px] text-muted-foreground">Revenue</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {trainer.schedule}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredTrainers.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No trainers match your filters</p>}
              </div>

              {/* Trainer Performance Table */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Performance Comparison</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trainer</TableHead>
                        <TableHead>Specialties</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Active Clients</TableHead>
                        <TableHead>Retention</TableHead>
                        <TableHead>Monthly Revenue</TableHead>
                        <TableHead>Certifications</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTrainers.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{t.avatar}</span>
                              {t.name}
                            </div>
                          </TableCell>
                          <TableCell><div className="flex flex-wrap gap-1">{t.specialties.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}</div></TableCell>
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

          {/* Plans Tab (unchanged) */}
          <TabsContent value="plans">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: "Basic", price: "$29", features: ["Gym access", "Locker", "Free WiFi"], members: 42 },
                { name: "Premium", price: "$59", features: ["All classes", "Personal trainer", "Nutrition plan", "Sauna"], members: 78, popular: true },
                { name: "Student", price: "$19", features: ["Gym access", "2 classes/week", "Student ID required"], members: 35 },
              ].map((plan) => (
                <Card key={plan.name} className={plan.popular ? "ring-2 ring-primary" : ""}>
                  <CardContent className="p-6 text-center space-y-4">
                    {plan.popular && <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>}
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-3xl font-bold text-primary mt-1">{plan.price}<span className="text-sm text-muted-foreground">/mo</span></p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.features.map(f => <li key={f} className="flex items-center gap-2"><Target className="h-3 w-3 text-emerald-500" />{f}</li>)}
                    </ul>
                    <p className="text-xs text-muted-foreground">{plan.members} active members</p>
                    <Button variant={plan.popular ? "default" : "outline"} className="w-full">Edit Plan</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* â•â•â• Enhanced Progress Tab â•â•â• */}
          <TabsContent value="progress">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Target className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockProgress.length}</p><p className="text-xs text-muted-foreground">Active Goals</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><TrendingUp className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{Math.round(mockProgress.reduce((s, p) => s + p.progress, 0) / mockProgress.length)}%</p><p className="text-xs text-muted-foreground">Avg Progress</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Trophy className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockProgress.filter(p => p.progress >= 75).length}</p><p className="text-xs text-muted-foreground">Near Completion</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Activity className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">89%</p><p className="text-xs text-muted-foreground">Engagement Rate</p></div>
                </CardContent></Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search member..." value={progressSearch} onChange={e => setProgressSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={progressMetric} onValueChange={setProgressMetric}>
                      <SelectTrigger className="w-[160px]"><SelectValue placeholder="Metric" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Metrics</SelectItem>
                        {progressMetrics.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1.5" onClick={() => toast.success("New goal form coming soon!")}><Plus className="h-4 w-4" /> Add Goal</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProgress.map(p => (
                  <Card key={p.id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{p.member}</h3>
                          <p className="text-xs text-muted-foreground">{p.metric}</p>
                        </div>
                        <Badge variant="outline" className={p.progress >= 70 ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : "bg-primary/15 text-primary border-primary/30"}>
                          {p.progress}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-xs text-muted-foreground">Start</p>
                          <p className="text-sm font-bold text-foreground">{p.startValue}</p>
                        </div>
                        <div className="rounded-lg bg-primary/10 p-2">
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p className="text-sm font-bold text-primary">{p.currentValue}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-xs text-muted-foreground">Goal</p>
                          <p className="text-sm font-bold text-foreground">{p.goal}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={p.progress} className="h-2" />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Trend: {p.trend === "up" ? "ðŸ“ˆ" : p.trend === "down" ? "ðŸ“‰" : "âž¡ï¸"} {p.trend}</span>
                          <span>Updated: {p.lastUpdate}</span>
                        </div>
                      </div>
                      {/* Mini sparkline */}
                      <div className="flex items-end gap-0.5 h-8">
                        {p.weeklyData.map((val, i) => {
                          const max = Math.max(...p.weeklyData);
                          const min = Math.min(...p.weeklyData);
                          const range = max - min || 1;
                          const h = ((val - min) / range) * 100;
                          return <div key={i} className="flex-1 rounded-sm bg-primary/60" style={{ height: `${Math.max(h, 10)}%` }} />;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredProgress.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No goals match your filters</p>}
              </div>

              {/* Full Table */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">All Progress Records</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Metric</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Last Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProgress.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium text-foreground">{p.member}</TableCell>
                          <TableCell><Badge variant="outline">{p.metric}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{p.startValue}</TableCell>
                          <TableCell className="font-medium text-foreground">{p.currentValue}</TableCell>
                          <TableCell className="text-muted-foreground">{p.goal}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={p.progress} className="h-2 w-20" />
                              <span className="text-xs font-medium text-foreground">{p.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{p.trend === "up" ? "ðŸ“ˆ" : p.trend === "down" ? "ðŸ“‰" : "âž¡ï¸"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.lastUpdate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Nutrition Plans Tab (unchanged) */}
          <TabsContent value="nutrition">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Apple className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockNutritionPlans.filter(n => n.status === "active").length}</p><p className="text-xs text-muted-foreground">Active Plans</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockNutritionPlans.reduce((s, n) => s + n.assignedTo, 0)}</p><p className="text-xs text-muted-foreground">Members Enrolled</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">4.6</p><p className="text-xs text-muted-foreground">Avg Satisfaction</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><CheckCircle2 className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">78%</p><p className="text-xs text-muted-foreground">Compliance Rate</p></div>
                </CardContent></Card>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockNutritionPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div><h3 className="font-semibold text-foreground">{plan.name}</h3><p className="text-xs text-muted-foreground">{plan.type}</p></div>
                        <Badge variant="outline" className={statusColors[plan.status]}>{plan.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-lg font-bold text-foreground">{plan.calories}</p><p className="text-[10px] text-muted-foreground">Calories</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-lg font-bold text-primary">{plan.protein}</p><p className="text-[10px] text-muted-foreground">Protein</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-lg font-bold text-amber-500">{plan.carbs}</p><p className="text-[10px] text-muted-foreground">Carbs</p></div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-lg font-bold text-violet-500">{plan.fat}</p><p className="text-[10px] text-muted-foreground">Fat</p></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{plan.assignedTo} members assigned</p>
                        <Button variant="outline" size="sm">Edit Plan</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Equipment Management Tab (unchanged) */}
          <TabsContent value="equipment">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Wrench className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockEquipment.length}</p><p className="text-xs text-muted-foreground">Total Equipment</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockEquipment.filter(e => e.condition === "good").length}</p><p className="text-xs text-muted-foreground">Good Condition</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockEquipment.filter(e => e.condition === "needs-repair").length}</p><p className="text-xs text-muted-foreground">Needs Repair</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Dumbbell className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockEquipment.reduce((s, e) => s + e.quantity, 0)}</p><p className="text-xs text-muted-foreground">Total Units</p></div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Equipment Inventory</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success("Equipment form coming soon!")}><Plus className="h-4 w-4" /> Add Equipment</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Equipment</TableHead><TableHead>Category</TableHead><TableHead>Qty</TableHead>
                      <TableHead>Condition</TableHead><TableHead>Last Maintenance</TableHead><TableHead>Next Maintenance</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {mockEquipment.map((eq) => (
                        <TableRow key={eq.id}>
                          <TableCell className="font-medium text-foreground">{eq.name}</TableCell>
                          <TableCell><Badge variant="outline">{eq.category}</Badge></TableCell>
                          <TableCell className="text-foreground">{eq.quantity}</TableCell>
                          <TableCell><Badge variant="outline" className={conditionColors[eq.condition]}>{eq.condition}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{eq.lastMaintenance}</TableCell>
                          <TableCell className="text-muted-foreground">{eq.nextMaintenance}</TableCell>
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

      {/* Add Class Dialog */}
      <Dialog open={addClassOpen} onOpenChange={setAddClassOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Class</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Class Name</Label><Input placeholder="e.g. Morning Yoga" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Trainer</Label><Select><SelectTrigger><SelectValue placeholder="Select trainer" /></SelectTrigger>
                <SelectContent>{mockTrainers.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
              </Select></div>
              <div><Label>Category</Label><Select><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Time</Label><Input type="time" /></div>
              <div><Label>Duration</Label><Input placeholder="60 min" /></div>
              <div><Label>Capacity</Label><Input type="number" placeholder="20" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddClassOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddClassOpen(false); toast.success("Class added! ðŸ‹ï¸"); }}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trainer Detail Dialog */}
      <Dialog open={!!selectedTrainer} onOpenChange={() => setSelectedTrainer(null)}>
        <DialogContent className="max-w-lg">
          {selectedTrainer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedTrainer.avatar}</span>
                  <div>
                    <p>{selectedTrainer.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selectedTrainer.experience} experience</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {selectedTrainer.specialties.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-xl font-bold text-foreground flex items-center gap-1"><Star className="h-4 w-4 text-amber-500 fill-amber-500" />{selectedTrainer.rating}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Active Clients</p>
                    <p className="text-xl font-bold text-primary">{selectedTrainer.activeClients}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Retention Rate</p>
                    <p className="text-xl font-bold text-emerald-500">{selectedTrainer.retentionRate}%</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                    <p className="text-xl font-bold text-foreground">${selectedTrainer.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1">{selectedTrainer.certifications.map(c => <Badge key={c} variant="secondary" className="text-xs gap-1"><Award className="h-3 w-3" />{c}</Badge>)}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> {selectedTrainer.schedule}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {selectedTrainer.email}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {selectedTrainer.phone}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FitnessPage;

