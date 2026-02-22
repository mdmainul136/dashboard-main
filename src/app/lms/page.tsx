"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CertificateBuilder from "@/components/lms/CertificateBuilder";
import StudentProgressDashboard from "@/components/lms/StudentProgressDashboard";
import GamificationDashboard from "@/components/lms/GamificationDashboard";
import QuizBuilder from "@/components/lms/QuizBuilder";
import CourseRecommendations from "@/components/lms/CourseRecommendations";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BookOpen, Video, Users, DollarSign, Plus, Search, Play, Clock, Sparkles,
  Award, BarChart3, Star, FileText, Monitor, Smartphone, GraduationCap,
  TrendingUp, Eye, CheckCircle2, Calendar, Layers, Settings, Globe,
  Mic, Download, Upload, Filter, MoreHorizontal, Edit, Trash2,
  UserPlus, Mail, Bell, Trophy, Target, Zap, MessageSquare, Gift,
  GripVertical, Lock, Unlock, CalendarClock, ThumbsUp, ThumbsDown,
  ShieldCheck, ChevronUp, ChevronDown,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// â”€â”€â”€ Mock Data â”€â”€â”€
const courses = [
  { id: 1, title: "Web Development Bootcamp", category: "Programming", lessons: 42, students: 1284, rating: 4.8, revenue: 45600, status: "published", progress: 100, thumbnail: "ðŸ–¥ï¸", price: 49.99, duration: "36h" },
  { id: 2, title: "UI/UX Design Masterclass", category: "Design", lessons: 28, students: 876, rating: 4.7, revenue: 31200, status: "published", progress: 100, thumbnail: "ðŸŽ¨", price: 39.99, duration: "24h" },
  { id: 3, title: "Digital Marketing A-Z", category: "Marketing", lessons: 35, students: 654, rating: 4.6, revenue: 22800, status: "published", progress: 100, thumbnail: "ðŸ“¢", price: 34.99, duration: "28h" },
  { id: 4, title: "Data Science with Python", category: "Data", lessons: 18, students: 0, rating: 0, revenue: 0, status: "draft", progress: 65, thumbnail: "ðŸ“Š", price: 59.99, duration: "40h" },
  { id: 5, title: "Mobile App Development", category: "Programming", lessons: 12, students: 0, rating: 0, revenue: 0, status: "draft", progress: 40, thumbnail: "ðŸ“±", price: 44.99, duration: "32h" },
];

const students = [
  { id: 1, name: "Ahmed Al-Rashid", email: "ahmed@mail.com", enrolled: 3, completed: 2, avgScore: 92, joined: "2024-11-15", status: "active", certificates: 2 },
  { id: 2, name: "Sarah Johnson", email: "sarah@mail.com", enrolled: 2, completed: 1, avgScore: 88, joined: "2024-12-01", status: "active", certificates: 1 },
  { id: 3, name: "Mohammed Khalid", email: "mo@mail.com", enrolled: 4, completed: 3, avgScore: 95, joined: "2024-10-20", status: "active", certificates: 3 },
  { id: 4, name: "Fatima Noor", email: "fatima@mail.com", enrolled: 1, completed: 0, avgScore: 76, joined: "2025-01-05", status: "active", certificates: 0 },
  { id: 5, name: "James Wilson", email: "james@mail.com", enrolled: 2, completed: 0, avgScore: 45, joined: "2025-01-10", status: "inactive", certificates: 0 },
  { id: 6, name: "Layla Hassan", email: "layla@mail.com", enrolled: 3, completed: 2, avgScore: 91, joined: "2024-09-15", status: "active", certificates: 2 },
];

const liveSessions = [
  { id: 1, title: "React Hooks Deep Dive", course: "Web Development Bootcamp", instructor: "Dr. Ahmed", date: "2025-02-22", time: "10:00 AM", duration: "90 min", attendees: 45, maxCapacity: 100, status: "upcoming", type: "webinar" },
  { id: 2, title: "Figma Prototyping Workshop", course: "UI/UX Design Masterclass", instructor: "Sarah Lee", date: "2025-02-23", time: "2:00 PM", duration: "120 min", attendees: 32, maxCapacity: 50, status: "upcoming", type: "workshop" },
  { id: 3, title: "SEO Strategy Session", course: "Digital Marketing A-Z", instructor: "Mark Davis", date: "2025-02-20", time: "11:00 AM", duration: "60 min", attendees: 67, maxCapacity: 80, status: "completed", type: "live-class" },
  { id: 4, title: "Python Pandas Masterclass", course: "Data Science with Python", instructor: "Dr. Chen", date: "2025-02-25", time: "3:00 PM", duration: "90 min", attendees: 0, maxCapacity: 60, status: "scheduled", type: "webinar" },
];

const subscriptionPlans = [
  { id: 1, name: "Free", price: 0, features: ["1 course access", "Community forum", "Basic quizzes"], students: 234, color: "bg-muted" },
  { id: 2, name: "Starter", price: 19.99, features: ["5 courses", "Certificate", "Email support", "Quizzes & Assignments"], students: 156, color: "bg-blue-500/10" },
  { id: 3, name: "Pro", price: 49.99, features: ["All courses", "Live sessions", "1-on-1 mentoring", "Priority support", "All certificates"], students: 89, color: "bg-primary/10" },
  { id: 4, name: "Enterprise", price: 199.99, features: ["Custom branding", "API access", "Bulk enrollment", "Analytics dashboard", "Dedicated manager"], students: 12, color: "bg-amber-500/10" },
];

// â”€â”€â”€ Analytics Data â”€â”€â”€
const revenueData = [
  { month: "Aug", revenue: 4200, enrollments: 45, completions: 18 },
  { month: "Sep", revenue: 5800, enrollments: 62, completions: 24 },
  { month: "Oct", revenue: 7200, enrollments: 78, completions: 35 },
  { month: "Nov", revenue: 9100, enrollments: 95, completions: 42 },
  { month: "Dec", revenue: 11500, enrollments: 112, completions: 58 },
  { month: "Jan", revenue: 14800, enrollments: 134, completions: 72 },
  { month: "Feb", revenue: 16200, enrollments: 148, completions: 86 },
];

const courseCompletionData = [
  { name: "Web Dev Bootcamp", completion: 78, enrolled: 1284, completed: 1002 },
  { name: "UI/UX Masterclass", completion: 65, enrolled: 876, completed: 569 },
  { name: "Digital Marketing", completion: 72, enrolled: 654, completed: 471 },
];

const engagementData = [
  { day: "Mon", videoWatched: 4.2, quizAttempts: 320, forumPosts: 45, avgSessionMin: 38 },
  { day: "Tue", videoWatched: 5.1, quizAttempts: 410, forumPosts: 52, avgSessionMin: 42 },
  { day: "Wed", videoWatched: 4.8, quizAttempts: 380, forumPosts: 38, avgSessionMin: 35 },
  { day: "Thu", videoWatched: 5.5, quizAttempts: 450, forumPosts: 60, avgSessionMin: 45 },
  { day: "Fri", videoWatched: 3.9, quizAttempts: 290, forumPosts: 32, avgSessionMin: 30 },
  { day: "Sat", videoWatched: 6.2, quizAttempts: 520, forumPosts: 72, avgSessionMin: 52 },
  { day: "Sun", videoWatched: 5.8, quizAttempts: 480, forumPosts: 65, avgSessionMin: 48 },
];

const studentSourceData = [
  { name: "Organic Search", value: 35, color: "hsl(var(--primary))" },
  { name: "Social Media", value: 28, color: "hsl(220, 70%, 55%)" },
  { name: "Referral", value: 20, color: "hsl(150, 60%, 45%)" },
  { name: "Direct", value: 12, color: "hsl(45, 90%, 55%)" },
  { name: "Paid Ads", value: 5, color: "hsl(0, 70%, 55%)" },
];

const topPerformingLessons = [
  { title: "React Hooks Deep Dive", course: "Web Dev Bootcamp", views: 2840, completion: 92, rating: 4.9 },
  { title: "Figma Auto Layout", course: "UI/UX Masterclass", views: 2100, completion: 88, rating: 4.8 },
  { title: "SEO Fundamentals", course: "Digital Marketing", views: 1860, completion: 85, rating: 4.7 },
  { title: "CSS Grid Mastery", course: "Web Dev Bootcamp", views: 1720, completion: 80, rating: 4.6 },
  { title: "Social Media Ads", course: "Digital Marketing", views: 1540, completion: 78, rating: 4.5 },
];

const LMSAnalytics = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2024, 7, 1),
    to: new Date(2025, 1, 28),
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF();

      const rangeText = dateRange.from && dateRange.to
        ? `${format(dateRange.from, "MMM d, yyyy")} â€” ${format(dateRange.to, "MMM d, yyyy")}`
        : "All Time";

      doc.setFontSize(18);
      doc.text("LMS Analytics Report", 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Date Range: ${rangeText}`, 14, 30);
      doc.text(`Generated: ${format(new Date(), "PPP p")}`, 14, 36);

      // KPIs
      doc.setFontSize(13);
      doc.setTextColor(0);
      doc.text("Key Metrics", 14, 48);
      autoTable(doc, {
        startY: 52,
        head: [["Metric", "Value", "Change"]],
        body: [
          ["Avg Completion Rate", "72%", "+5%"],
          ["Avg Session Time", "41 min", "+8 min"],
          ["Monthly Revenue", "$16.2K", "+18%"],
          ["Student Satisfaction", "4.7/5", "+0.3"],
        ],
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Revenue table
      const revY = (doc as any).lastAutoTable.finalY + 12;
      doc.text("Monthly Revenue & Enrollments", 14, revY);
      autoTable(doc, {
        startY: revY + 4,
        head: [["Month", "Revenue", "Enrollments", "Completions"]],
        body: revenueData.map(r => [r.month, `$${r.revenue.toLocaleString()}`, String(r.enrollments), String(r.completions)]),
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Course completion
      const compY = (doc as any).lastAutoTable.finalY + 12;
      doc.text("Course Completion Rates", 14, compY);
      autoTable(doc, {
        startY: compY + 4,
        head: [["Course", "Enrolled", "Completed", "Rate"]],
        body: courseCompletionData.map(c => [c.name, String(c.enrolled), String(c.completed), `${c.completion}%`]),
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Top lessons
      const lessY = (doc as any).lastAutoTable.finalY + 12;
      doc.text("Top Performing Lessons", 14, lessY);
      autoTable(doc, {
        startY: lessY + 4,
        head: [["#", "Lesson", "Course", "Views", "Completion", "Rating"]],
        body: topPerformingLessons.map((l, i) => [String(i + 1), l.title, l.course, String(l.views), `${l.completion}%`, String(l.rating)]),
        theme: "grid",
        headStyles: { fillColor: [245, 158, 11] },
      });

      doc.save(`LMS-Analytics-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      toast({ title: "PDF exported!", description: "Analytics report downloaded successfully." });
    } catch {
      toast({ title: "Export failed", description: "Could not generate PDF.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
  <div className="space-y-5">
    {/* Date Range & Export Controls */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal gap-2">
              <Calendar className="h-4 w-4" />
              {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Start date"}
              <span className="text-muted-foreground">â€”</span>
              {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarPicker
              mode="range"
              selected={dateRange}
              onSelect={(range: any) => setDateRange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <div className="flex gap-1">
          {[
            { label: "7D", from: new Date(Date.now() - 7 * 86400000) },
            { label: "30D", from: new Date(Date.now() - 30 * 86400000) },
            { label: "90D", from: new Date(Date.now() - 90 * 86400000) },
            { label: "1Y", from: new Date(Date.now() - 365 * 86400000) },
          ].map(preset => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-2.5"
              onClick={() => setDateRange({ from: preset.from, to: new Date() })}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <Button onClick={handleExportPDF} disabled={isExporting} className="gap-2">
        <Download className="h-4 w-4" />
        {isExporting ? "Exporting..." : "Export PDF"}
      </Button>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Avg Completion Rate", value: "72%", change: "+5%", icon: Target, color: "text-emerald-500 bg-emerald-500/10" },
        { label: "Avg Session Time", value: "41 min", change: "+8 min", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
        { label: "Monthly Revenue", value: "$16.2K", change: "+18%", icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
        { label: "Student Satisfaction", value: "4.7/5", change: "+0.3", icon: Star, color: "text-rose-500 bg-rose-500/10" },
      ].map(kpi => (
        <Card key={kpi.label}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 text-[10px]">{kpi.change}</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Revenue & Enrollment Trends */}
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue over last 7 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-blue-500" /> Enrollments vs Completions</CardTitle>
          <CardDescription>Monthly student progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="enrollments" name="Enrollments" fill="hsl(220, 70%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completions" name="Completions" fill="hsl(150, 60%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Course Completion Rates */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Course Completion Rates</CardTitle>
        <CardDescription>How many students finish each course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courseCompletionData.map(course => (
            <div key={course.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{course.name}</span>
                <span className="text-muted-foreground">{course.completed}/{course.enrolled} students Â· <span className="font-semibold text-foreground">{course.completion}%</span></span>
              </div>
              <Progress value={course.completion} className="h-3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Engagement & Student Source */}
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Weekly Engagement</CardTitle>
          <CardDescription>Student activity patterns by day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="avgSessionMin" name="Avg Session (min)" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forumPosts" name="Forum Posts" stroke="hsl(150, 60%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Student Sources</CardTitle>
          <CardDescription>Where your students come from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={studentSourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {studentSourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Top Performing Lessons */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-500" /> Top Performing Lessons</CardTitle>
        <CardDescription>Most viewed and highest rated lessons</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Completion</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformingLessons.map((lesson, i) => (
              <TableRow key={i}>
                <TableCell className="font-bold text-primary">{i + 1}</TableCell>
                <TableCell className="font-medium">{lesson.title}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{lesson.course}</TableCell>
                <TableCell className="text-right">{lesson.views.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={lesson.completion >= 85 ? "default" : "secondary"} className="text-[10px]">{lesson.completion}%</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="flex items-center justify-end gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {lesson.rating}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  );
};

// â”€â”€â”€ Discussion Forum Data & Component â”€â”€â”€
const threadCategories = [
  { id: "qa", label: "Q&A", icon: "â“", color: "border-blue-400 text-blue-600 bg-blue-50" },
  { id: "general", label: "General", icon: "ðŸ’¬", color: "border-muted-foreground/40 text-foreground bg-muted/50" },
  { id: "bug", label: "Bug Report", icon: "ðŸ›", color: "border-destructive/40 text-destructive bg-destructive/5" },
  { id: "resource", label: "Resource", icon: "ðŸ“š", color: "border-amber-400 text-amber-600 bg-amber-50" },
  { id: "showcase", label: "Showcase", icon: "ðŸš€", color: "border-emerald-400 text-emerald-600 bg-emerald-50" },
] as const;

type ThreadCategory = typeof threadCategories[number]["id"];

type ForumThread = {
  id: string;
  courseId: number;
  title: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  replies: number;
  upvotes: number;
  downvotes: number;
  views: number;
  tags: string[];
  category: ThreadCategory;
  pinned?: boolean;
  solved?: boolean;
  replyList?: ForumReply[];
  lastReply?: { author: string; date: string; preview: string };
};

type ForumReply = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  upvotes: number;
  downvotes: number;
  isBestAnswer: boolean;
  parentReplyId?: string | null;
  replyingTo?: string | null;
  children?: ForumReply[];
};

const renderMarkdown = (text: string) => {
  return text
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted rounded-lg p-3 my-2 text-xs font-mono overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-sm mt-2 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-base mt-2 mb-1">$1</h3>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm">$1</li>')
    .replace(/@(\w+)/g, '<span class="text-primary font-semibold cursor-pointer hover:underline">@$1</span>')
    .replace(/\n/g, '<br />');
};

// Helper: build nested reply tree
function buildReplyTree(replies: ForumReply[]): ForumReply[] {
  const map = new Map<string, ForumReply>();
  const roots: ForumReply[] = [];
  replies.forEach(r => map.set(r.id, { ...r, children: [] }));
  replies.forEach(r => {
    const node = map.get(r.id)!;
    if (r.parentReplyId && map.has(r.parentReplyId)) {
      map.get(r.parentReplyId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

const forumThreads: ForumThread[] = [
  { id: "t1", courseId: 1, category: "qa", title: "How to handle async/await errors in React useEffect?", author: "Ahmed Al-Rashid", avatar: "ðŸ§‘â€ðŸ’»", content: "I'm getting an **unhandled promise rejection** when using async functions inside `useEffect`.\n\n```\nuseEffect(() => {\n  const fetchData = async () => {\n    const res = await fetch('/api/data');\n  };\n  fetchData();\n}, []);\n```\n\nWhat's the best practice for error handling here?", date: "2 hours ago", replies: 8, upvotes: 15, downvotes: 2, views: 124, tags: ["React", "async"], pinned: true, solved: true, replyList: [
    { id: "r1", author: "Dr. Ahmed", avatar: "ðŸŽ“", content: "The best approach is to create an inner async function and wrap it in `try/catch`:\n\n```\nuseEffect(() => {\n  const load = async () => {\n    try {\n      const res = await fetch('/api');\n    } catch (err) {\n      console.error(err);\n    }\n  };\n  load();\n}, []);\n```", date: "1 hour ago", upvotes: 12, downvotes: 0, isBestAnswer: true, parentReplyId: null, replyingTo: null },
    { id: "r1a", author: "Sarah Johnson", avatar: "ðŸ‘©â€ðŸŽ¨", content: "@Dr.Ahmed à¦¦à¦¾à¦°à§à¦£ à¦‰à¦¤à§à¦¤à¦°! à¦¤à¦¬à§‡ à¦†à¦®à¦¿ `react-query` à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¿ â€” à¦¸à§‡à¦Ÿà¦¾ error handling automatically handle à¦•à¦°à§‡à¥¤", date: "45 min ago", upvotes: 7, downvotes: 0, isBestAnswer: false, parentReplyId: "r1", replyingTo: "Dr. Ahmed" },
    { id: "r1b", author: "Mohammed Khalid", avatar: "ðŸ”§", content: "@Sarah à¦­à¦¾à¦²à§‹ à¦ªà¦¯à¦¼à§‡à¦¨à§à¦Ÿ! `react-query` à¦¬à¦¾ `SWR` à¦¦à§à¦Ÿà§‹à¦‡ à¦…à¦¸à¦¾à¦§à¦¾à¦°à¦£ optionà¥¤", date: "30 min ago", upvotes: 3, downvotes: 0, isBestAnswer: false, parentReplyId: "r1a", replyingTo: "Sarah Johnson" },
    { id: "r2", author: "Sarah Johnson", avatar: "ðŸ‘©â€ðŸŽ¨", content: "You can also use a custom hook like `useAsync` for cleaner code. Here's my approach:\n\n```\nfunction useAsync(fn) {\n  const [state, setState] = useState({ loading: true });\n  useEffect(() => { fn().then(data => setState({ data })).catch(error => setState({ error })); }, []);\n  return state;\n}\n```", date: "50 min ago", upvotes: 5, downvotes: 1, isBestAnswer: false, parentReplyId: null, replyingTo: null },
    { id: "r2a", author: "Layla Hassan", avatar: "ðŸ’Ž", content: "à¦à¦‡ custom hook approach à¦Ÿà¦¾ à¦ªà¦›à¦¨à§à¦¦ à¦¹à¦¯à¦¼à§‡à¦›à§‡! `loading` state à¦“ add à¦•à¦°à¦²à§‡ à¦†à¦°à¦“ à¦­à¦¾à¦²à§‹ à¦¹à¦¬à§‡à¥¤", date: "25 min ago", upvotes: 2, downvotes: 0, isBestAnswer: false, parentReplyId: "r2", replyingTo: "Sarah Johnson" },
  ], lastReply: { author: "Mohammed Khalid", date: "30 min ago", preview: "@Sarah à¦­à¦¾à¦²à§‹ à¦ªà¦¯à¦¼à§‡à¦¨à§à¦Ÿ! react-query à¦¬à¦¾ SWR à¦¦à§à¦Ÿà§‹à¦‡..." } },
  { id: "t2", courseId: 1, category: "general", title: "Best VS Code extensions for web development in 2025?", author: "Sarah Johnson", avatar: "ðŸ‘©â€ðŸŽ¨", content: "Looking for recommendations on **VS Code extensions** that boost productivity for React + TypeScript development.\n\n- Linting\n- Formatting\n- Debugging\n- Git integration", date: "5 hours ago", replies: 12, upvotes: 23, downvotes: 1, views: 256, tags: ["Tools", "Setup"], solved: false, replyList: [
    { id: "r3", author: "Mohammed Khalid", avatar: "ðŸ”§", content: "I highly recommend:\n- **ESLint** â€” linting\n- **Prettier** â€” formatting\n- **Error Lens** â€” inline errors\n- **GitLens** â€” git blame & history\n- **Thunder Client** â€” API testing", date: "1 hour ago", upvotes: 8, downvotes: 0, isBestAnswer: false, parentReplyId: null, replyingTo: null },
    { id: "r3a", author: "Fatima Noor", avatar: "ðŸŽ¨", content: "@Mohammed **Tailwind CSS IntelliSense** à¦“ à¦¯à§‹à¦— à¦•à¦°à§‹! Tailwind-à¦ autocomplete à¦›à¦¾à¦¡à¦¼à¦¾ à¦•à¦¾à¦œ à¦•à¦°à¦¾ à¦•à¦ à¦¿à¦¨à¥¤", date: "40 min ago", upvotes: 5, downvotes: 0, isBestAnswer: false, parentReplyId: "r3", replyingTo: "Mohammed Khalid" },
    { id: "r3b", author: "Ahmed Al-Rashid", avatar: "ðŸ§‘â€ðŸ’»", content: "@Fatima à¦à¦•à¦¦à¦®! à¦†à¦° **Auto Rename Tag** à¦“ essential â€” HTML/JSX tags auto rename à¦•à¦°à§‡à¥¤", date: "20 min ago", upvotes: 3, downvotes: 0, isBestAnswer: false, parentReplyId: "r3a", replyingTo: "Fatima Noor" },
  ], lastReply: { author: "Ahmed Al-Rashid", date: "20 min ago", preview: "@Fatima à¦à¦•à¦¦à¦®! à¦†à¦° Auto Rename Tag à¦“ essential..." } },
  { id: "t3", courseId: 2, category: "general", title: "Figma vs Sketch â€” which one for 2025?", author: "Fatima Noor", avatar: "ðŸŽ¨", content: "Starting a new design project and wondering which tool to invest time learning. *Thoughts?*", date: "1 day ago", replies: 18, upvotes: 31, downvotes: 3, views: 412, tags: ["Design", "Tools"], pinned: true, solved: false, replyList: [
    { id: "r4", author: "Sarah Lee", avatar: "ðŸŽ¨", content: "Figma has become the industry standard with its collaborative features and web-based access. It's the clear winner for teams.", date: "3 hours ago", upvotes: 14, downvotes: 2, isBestAnswer: false, parentReplyId: null, replyingTo: null },
    { id: "r4a", author: "Layla Hassan", avatar: "ðŸ’Ž", content: "@Sarah à¦à¦•à¦®à¦¤! à¦¤à¦¬à§‡ **Penpot** à¦“ à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦°à§‹ â€” open-source alternative, Figma-à¦° à¦®à¦¤à§‹à¦‡ feature-richà¥¤", date: "2 hours ago", upvotes: 6, downvotes: 0, isBestAnswer: false, parentReplyId: "r4", replyingTo: "Sarah Lee" },
  ], lastReply: { author: "Layla Hassan", date: "2 hours ago", preview: "@Sarah à¦à¦•à¦®à¦¤! à¦¤à¦¬à§‡ Penpot à¦“ à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦°à§‹..." } },
  { id: "t4", courseId: 2, category: "qa", title: "How to create a proper design system in Figma?", author: "Layla Hassan", avatar: "ðŸ’Ž", content: "I want to build a **scalable design system** with components, variants, and tokens.\n\n### Steps I've tried:\n- Created base color tokens\n- Built typography scale\n- Still confused about *component variants*", date: "2 days ago", replies: 6, upvotes: 19, downvotes: 0, views: 187, tags: ["Design System", "Figma"], solved: true, replyList: [
    { id: "r5", author: "Fatima Noor", avatar: "ðŸŽ¨", content: "Start with base tokens (colors, typography, spacing), then build atoms â†’ molecules â†’ organisms. Use Figma's component properties for variants.", date: "1 day ago", upvotes: 10, downvotes: 0, isBestAnswer: true, parentReplyId: null, replyingTo: null },
  ], lastReply: { author: "Fatima Noor", date: "1 day ago", preview: "Start with base tokens (colors, typography)..." } },
  { id: "t5", courseId: 3, category: "resource", title: "Google Ads vs Facebook Ads â€” ROI comparison?", author: "James Wilson", avatar: "ðŸ“Š", content: "Has anyone done a proper **ROI comparison** between Google Ads and Facebook Ads for e-commerce?", date: "3 days ago", replies: 14, upvotes: 27, downvotes: 4, views: 389, tags: ["Ads", "ROI"], solved: false, replyList: [
    { id: "r6", author: "Mark Davis", avatar: "ðŸ“¢", content: "It really depends on your product type and target audience. Google Ads works better for high-intent searches, while Facebook excels at discovery.", date: "12 hours ago", upvotes: 6, downvotes: 1, isBestAnswer: false, parentReplyId: null, replyingTo: null },
  ], lastReply: { author: "Mark Davis", date: "12 hours ago", preview: "It really depends on your product type and target..." } },
  { id: "t6", courseId: 1, category: "bug", title: "TypeScript generics â€” confusing error with `extends`", author: "Mohammed Khalid", avatar: "ðŸ”§", content: "Getting this error with TypeScript generics:\n\n```\nType 'string' does not satisfy the constraint 'number'\n```\n\nCan someone explain TypeScript generics with **simple real-world examples**?", date: "4 days ago", replies: 9, upvotes: 42, downvotes: 2, views: 534, tags: ["TypeScript", "Basics"], solved: true, replyList: [
    { id: "r7", author: "Ahmed Al-Rashid", avatar: "ðŸ§‘â€ðŸ’»", content: "Think of generics as function parameters but for types. Example:\n\n```\nfunction identity<T>(arg: T): T { return arg; }\nidentity<string>('hello'); // OK\nidentity<number>(42); // OK\n```\n\nWhen you add `extends`, you're saying \"T must be at least this type\".", date: "2 days ago", upvotes: 18, downvotes: 0, isBestAnswer: true, parentReplyId: null, replyingTo: null },
    { id: "r7a", author: "Layla Hassan", avatar: "ðŸ’Ž", content: "@Ahmed à¦šà¦®à§Žà¦•à¦¾à¦° à¦¬à§à¦¯à¦¾à¦–à§à¦¯à¦¾! à¦†à¦®à¦¿ à¦†à¦°à§‡à¦•à¦Ÿà¦¾ à¦¯à§‹à¦— à¦•à¦°à¦¿ â€” `keyof` à¦“ generics-à¦ à¦–à§à¦¬ useful:\n\n```\nfunction getProperty<T, K extends keyof T>(obj: T, key: K) {\n  return obj[key];\n}\n```", date: "1 day ago", upvotes: 9, downvotes: 0, isBestAnswer: false, parentReplyId: "r7", replyingTo: "Ahmed Al-Rashid" },
  ], lastReply: { author: "Layla Hassan", date: "1 day ago", preview: "@Ahmed à¦šà¦®à§Žà¦•à¦¾à¦° à¦¬à§à¦¯à¦¾à¦–à§à¦¯à¦¾! à¦†à¦®à¦¿ à¦†à¦°à§‡à¦•à¦Ÿà¦¾ à¦¯à§‹à¦— à¦•à¦°à¦¿..." } },
  { id: "t7", courseId: 1, category: "showcase", title: "Built a full-stack app with what I learned! ðŸŽ‰", author: "Layla Hassan", avatar: "ðŸš€", content: "Just finished building a **task management app** using React, TypeScript, and Supabase!\n\n### Features:\n- Real-time sync\n- Auth with magic links\n- Dark mode\n\nThanks to this course for the amazing foundation!", date: "5 days ago", replies: 22, upvotes: 58, downvotes: 1, views: 890, tags: ["Project", "Showcase"], solved: false, replyList: [
    { id: "r8", author: "Dr. Ahmed", avatar: "ðŸŽ“", content: "This is incredible work! Love the clean UI and the real-time sync implementation. Consider adding offline support next!", date: "4 days ago", upvotes: 15, downvotes: 0, isBestAnswer: false, parentReplyId: null, replyingTo: null },
    { id: "r8a", author: "Mohammed Khalid", avatar: "ðŸ”§", content: "@Dr.Ahmed à¦à¦•à¦®à¦¤! @Layla à¦¤à§‹à¦®à¦¾à¦° project-à¦ PWA support à¦¯à§‹à¦— à¦•à¦°à¦²à§‡ offline à¦“ à¦•à¦¾à¦œ à¦•à¦°à¦¬à§‡à¥¤", date: "3 days ago", upvotes: 7, downvotes: 0, isBestAnswer: false, parentReplyId: "r8", replyingTo: "Dr. Ahmed" },
  ], lastReply: { author: "Mohammed Khalid", date: "3 days ago", preview: "@Dr.Ahmed à¦à¦•à¦®à¦¤! @Layla à¦¤à§‹à¦®à¦¾à¦° project-à¦ PWA..." } },
];

const LMSDiscussion = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [threadSearch, setThreadSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "unanswered">("recent");
  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCourse, setNewCourse] = useState("1");
  const [newCategory, setNewCategory] = useState<ThreadCategory>("qa");
  const [localThreads, setLocalThreads] = useState<ForumThread[]>(forumThreads);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyingToReply, setReplyingToReply] = useState<{ replyId: string; author: string } | null>(null);
  const [replySortBy, setReplySortBy] = useState<"newest" | "oldest" | "top">("top");
  const [votedThreads, setVotedThreads] = useState<Record<string, "up" | "down" | null>>({});
  const [votedReplies, setVotedReplies] = useState<Record<string, "up" | "down" | null>>({});

  const filteredThreads = localThreads
    .filter(t => selectedCourse === "all" || t.courseId === parseInt(selectedCourse))
    .filter(t => selectedCategory === "all" || t.category === selectedCategory)
    .filter(t => t.title.toLowerCase().includes(threadSearch.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(threadSearch.toLowerCase())))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === "popular") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      if (sortBy === "unanswered") return a.replies - b.replies;
      return 0;
    });

  const stats = {
    totalThreads: localThreads.length,
    totalReplies: localThreads.reduce((s, t) => s + t.replies, 0),
    solvedCount: localThreads.filter(t => t.solved).length,
    activeContributors: new Set(localThreads.map(t => t.author)).size,
  };

  const sortReplies = (replies: ForumReply[]): ForumReply[] => {
    const sorted = [...replies];
    if (replySortBy === "top") sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    if (replySortBy === "newest") sorted.sort(() => -1);
    if (replySortBy === "oldest") sorted.sort(() => 1);
    return sorted.map(r => ({ ...r, children: r.children ? sortReplies(r.children) : [] }));
  };

  const handlePostReply = (threadId: string) => {
    if (!replyText.trim()) return;
    const mentionPrefix = replyingToReply ? `@${replyingToReply.author.replace(/\s/g, '')} ` : "";
    const newReply: ForumReply = {
      id: `r${Date.now()}`, author: "You", avatar: "ðŸ‘¤",
      content: mentionPrefix + replyText.trim(),
      date: "Just now", upvotes: 0, downvotes: 0, isBestAnswer: false,
      parentReplyId: replyingToReply?.replyId || null,
      replyingTo: replyingToReply?.author || null,
    };
    setLocalThreads(prev => prev.map(t => t.id === threadId ? {
      ...t, replies: t.replies + 1,
      replyList: [...(t.replyList || []), newReply],
      lastReply: { author: "You", date: "Just now", preview: newReply.content }
    } : t));
    setReplyText("");
    setReplyingToReply(null);
    toast({ title: "Reply posted! ðŸ’¬" });
  };

  // Recursive reply renderer
  const renderReply = (reply: ForumReply, thread: ForumThread, depth: number = 0) => {
    const maxDepth = 3;
    const indent = Math.min(depth, maxDepth);
    return (
      <div key={reply.id} style={{ marginLeft: indent * 24 }}>
        <div className={`flex gap-3 rounded-lg p-3 border transition-all ${
          reply.isBestAnswer ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20" :
          depth > 0 ? "border-border/40 bg-muted/10" : "border-border/60 bg-muted/20"
        }`}>
          {/* Vote buttons */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <button
              className={`p-0.5 rounded transition-colors ${votedReplies[reply.id] === "up" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              onClick={() => {
                const current = votedReplies[reply.id];
                setVotedReplies(prev => ({ ...prev, [reply.id]: current === "up" ? null : "up" }));
                setLocalThreads(prev => prev.map(t => t.id === thread.id ? {
                  ...t, replyList: t.replyList?.map(r => r.id === reply.id ? {
                    ...r,
                    upvotes: current === "up" ? r.upvotes - 1 : r.upvotes + 1,
                    downvotes: current === "down" ? r.downvotes - 1 : r.downvotes,
                  } : r)
                } : t));
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <span className={`text-xs font-bold ${(reply.upvotes - reply.downvotes) > 0 ? "text-primary" : (reply.upvotes - reply.downvotes) < 0 ? "text-destructive" : "text-muted-foreground"}`}>
              {reply.upvotes - reply.downvotes}
            </span>
            <button
              className={`p-0.5 rounded transition-colors ${votedReplies[reply.id] === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
              onClick={() => {
                const current = votedReplies[reply.id];
                setVotedReplies(prev => ({ ...prev, [reply.id]: current === "down" ? null : "down" }));
                setLocalThreads(prev => prev.map(t => t.id === thread.id ? {
                  ...t, replyList: t.replyList?.map(r => r.id === reply.id ? {
                    ...r,
                    downvotes: current === "down" ? r.downvotes - 1 : r.downvotes + 1,
                    upvotes: current === "up" ? r.upvotes - 1 : r.upvotes,
                  } : r)
                } : t));
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Reply content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm">{reply.avatar}</span>
              <span className="text-xs font-semibold text-foreground">{reply.author}</span>
              {reply.replyingTo && (
                <span className="text-[10px] text-muted-foreground">
                  replied to <span className="text-primary font-medium">@{reply.replyingTo.replace(/\s/g, '')}</span>
                </span>
              )}
              <span className="text-[10px] text-muted-foreground">{reply.date}</span>
              {reply.isBestAnswer && (
                <Badge className="text-[9px] gap-1 bg-emerald-500 hover:bg-emerald-600">
                  <ShieldCheck className="h-2.5 w-2.5" /> Best Answer
                </Badge>
              )}
            </div>
            <div className="text-sm text-foreground/80 mt-1 prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(reply.content) }} />

            {/* Reply actions */}
            <div className="flex items-center gap-3 mt-2">
              <button
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setReplyingToReply({ replyId: reply.id, author: reply.author });
                  setReplyText("");
                }}
              >
                <MessageSquare className="h-3 w-3" /> Reply
              </button>
              {reply.children && reply.children.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {reply.children.length} {reply.children.length === 1 ? "reply" : "replies"}
                </span>
              )}
              {thread.author === "You" && !reply.isBestAnswer && (
                <button
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-emerald-600 transition-colors"
                  onClick={() => {
                    setLocalThreads(prev => prev.map(t => t.id === thread.id ? {
                      ...t, solved: true,
                      replyList: t.replyList?.map(r => ({ ...r, isBestAnswer: r.id === reply.id }))
                    } : t));
                    toast({ title: "Best answer marked! âœ…", description: `${reply.author}'s reply marked as best answer.` });
                  }}
                >
                  <ShieldCheck className="h-3 w-3" /> Mark Best
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Nested children */}
        {reply.children && reply.children.length > 0 && (
          <div className="mt-1.5 space-y-1.5">
            {reply.children.map(child => renderReply(child, thread, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Forum Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Threads", value: stats.totalThreads, icon: MessageSquare, color: "text-primary bg-primary/10" },
          { label: "Replies", value: stats.totalReplies, icon: MessageSquare, color: "text-blue-500 bg-blue-500/10" },
          { label: "Solved", value: stats.solvedCount, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Contributors", value: stats.activeContributors, icon: Users, color: "text-amber-500 bg-amber-500/10" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Filter Bar */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={selectedCategory === "all" ? "default" : "outline"} size="sm" className="text-xs h-8" onClick={() => setSelectedCategory("all")}>All Categories</Button>
        {threadCategories.map(cat => (
          <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "outline"} size="sm" className="text-xs h-8 gap-1" onClick={() => setSelectedCategory(cat.id)}>
            {cat.icon} {cat.label}
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search threads or tags..." className="pl-9" value={threadSearch} onChange={e => setThreadSearch(e.target.value)} />
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Courses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v: "recent" | "popular" | "unanswered") => setSortBy(v)}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="unanswered">Unanswered</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowNewThread(!showNewThread)}>
          <Plus className="h-4 w-4" /> New Thread
        </Button>
      </div>

      {/* New Thread Form */}
      {showNewThread && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Start a New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div><Label>Title</Label><Input className="mt-1.5" placeholder="What's your question?" value={newTitle} onChange={e => setNewTitle(e.target.value)} /></div>
              <div>
                <Label>Course</Label>
                <Select value={newCourse} onValueChange={setNewCourse}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {courses.filter(c => c.status === "published").map(c => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={(v: ThreadCategory) => setNewCategory(v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {threadCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>Description</Label>
                <span className="text-[10px] text-muted-foreground">Supports **bold**, *italic*, `code`, ```code blocks```, @mentions, - lists</span>
              </div>
              <textarea
                className="mt-0 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm min-h-[100px] font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                placeholder="Describe your question or topic in detail... (Markdown supported)"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
              />
              {newContent.trim() && (
                <div className="mt-2 rounded-lg border border-border/60 p-3 bg-muted/20">
                  <p className="text-[10px] text-muted-foreground mb-1 font-medium">Preview:</p>
                  <div className="text-sm text-foreground/80 prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(newContent) }} />
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewThread(false)}>Cancel</Button>
              <Button onClick={() => {
                if (!newTitle.trim() || !newContent.trim()) {
                  toast({ title: "Missing fields", description: "Please fill in title and description.", variant: "destructive" });
                  return;
                }
                const thread: ForumThread = {
                  id: `t${Date.now()}`, courseId: parseInt(newCourse), category: newCategory, title: newTitle.trim(), author: "You",
                  avatar: "ðŸ‘¤", content: newContent.trim(), date: "Just now", replies: 0, upvotes: 0, downvotes: 0,
                  views: 0, tags: ["New"], solved: false, replyList: [],
                };
                setLocalThreads(prev => [thread, ...prev]);
                setNewTitle(""); setNewContent(""); setShowNewThread(false);
                toast({ title: "Thread created âœï¸", description: "Your discussion thread has been posted." });
              }}>Post Thread</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thread List */}
      <div className="space-y-2">
        {filteredThreads.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No threads found. Start a new discussion!</CardContent></Card>
        ) : filteredThreads.map(thread => (
          <Card key={thread.id} className={`transition-all hover:shadow-md ${thread.pinned ? "border-primary/30 bg-primary/[0.02]" : ""}`}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="text-2xl shrink-0 mt-0.5">{thread.avatar}</div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start gap-2 flex-wrap">
                    {thread.pinned && <Badge variant="outline" className="text-[9px] border-primary/40 text-primary bg-primary/5">ðŸ“Œ Pinned</Badge>}
                    {thread.solved && <Badge variant="outline" className="text-[9px] border-emerald-400 text-emerald-600 bg-emerald-50">âœ… Solved</Badge>}
                    {(() => { const cat = threadCategories.find(c => c.id === thread.category); return cat ? <Badge variant="outline" className={`text-[9px] ${cat.color}`}>{cat.icon} {cat.label}</Badge> : null; })()}
                    <h3
                      className="font-semibold text-sm text-foreground hover:text-primary cursor-pointer transition-colors flex-1"
                      onClick={() => { setExpandedThread(expandedThread === thread.id ? null : thread.id); setReplyingToReply(null); }}
                    >
                      {thread.title}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{thread.author}</span> Â· {thread.date} Â· in{" "}
                    <span className="text-primary font-medium">{courses.find(c => c.id === thread.courseId)?.title}</span>
                  </p>

                  <div className="flex gap-1.5 flex-wrap">
                    {thread.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-normal">{tag}</Badge>
                    ))}
                  </div>

                  {expandedThread === thread.id && (
                    <div className="mt-3 space-y-3">
                      <div className="text-sm text-foreground/80 bg-muted/40 rounded-lg p-3 prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(thread.content) }} />

                      {/* Replies with threading */}
                      {thread.replyList && thread.replyList.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-muted-foreground">{thread.replyList.length} {thread.replyList.length === 1 ? "Reply" : "Replies"}</p>
                            <Select value={replySortBy} onValueChange={(v: "newest" | "oldest" | "top") => setReplySortBy(v)}>
                              <SelectTrigger className="w-[120px] h-7 text-[10px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Top Voted</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            {sortReplies(buildReplyTree(thread.replyList)).map(reply => renderReply(reply, thread, 0))}
                          </div>
                        </div>
                      )}

                      {/* Reply input */}
                      <div className="space-y-1.5">
                        {replyingToReply && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5">
                            <MessageSquare className="h-3 w-3" />
                            Replying to <span className="font-semibold text-primary">@{replyingToReply.author.replace(/\s/g, '')}</span>
                            <button className="ml-auto text-muted-foreground hover:text-foreground" onClick={() => setReplyingToReply(null)}>âœ•</button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            placeholder={replyingToReply ? `Reply to @${replyingToReply.author}...` : "Write a reply... (use @name to mention)"}
                            className="flex-1"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && replyText.trim()) handlePostReply(thread.id); }}
                          />
                          <Button size="sm" onClick={() => handlePostReply(thread.id)}>Reply</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        className={`p-0.5 rounded transition-colors ${votedThreads[thread.id] === "up" ? "text-primary" : "hover:text-primary"}`}
                        onClick={() => {
                          const current = votedThreads[thread.id];
                          setVotedThreads(prev => ({ ...prev, [thread.id]: current === "up" ? null : "up" }));
                          setLocalThreads(prev => prev.map(t => t.id === thread.id ? {
                            ...t,
                            upvotes: current === "up" ? t.upvotes - 1 : t.upvotes + 1,
                            downvotes: current === "down" ? t.downvotes - 1 : t.downvotes,
                          } : t));
                        }}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <span className={`font-bold min-w-[1.5rem] text-center ${(thread.upvotes - thread.downvotes) > 0 ? "text-primary" : (thread.upvotes - thread.downvotes) < 0 ? "text-destructive" : ""}`}>
                        {thread.upvotes - thread.downvotes}
                      </span>
                      <button
                        className={`p-0.5 rounded transition-colors ${votedThreads[thread.id] === "down" ? "text-destructive" : "hover:text-destructive"}`}
                        onClick={() => {
                          const current = votedThreads[thread.id];
                          setVotedThreads(prev => ({ ...prev, [thread.id]: current === "down" ? null : "down" }));
                          setLocalThreads(prev => prev.map(t => t.id === thread.id ? {
                            ...t,
                            downvotes: current === "down" ? t.downvotes - 1 : t.downvotes + 1,
                            upvotes: current === "up" ? t.upvotes - 1 : t.upvotes,
                          } : t));
                        }}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={() => { setExpandedThread(expandedThread === thread.id ? null : thread.id); setReplyingToReply(null); }}
                    >
                      <MessageSquare className="h-3 w-3" /> {thread.replies} replies
                    </button>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {thread.views}</span>
                    {thread.replyList?.some(r => r.isBestAnswer) && (
                      <span className="flex items-center gap-1 text-emerald-600"><ShieldCheck className="h-3 w-3" /> Answered</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

type LessonItem = {
  id: string;
  type: string;
  title: string;
  duration: string;
  icon: typeof Video;
  dripEnabled: boolean;
  dripDate: Date | undefined;
  dripMode: "immediate" | "date" | "after-prev";
};

const initialLessons: LessonItem[] = [
  { id: "l1", type: "video", title: "Introduction to the Course", duration: "12:30", icon: Video, dripEnabled: false, dripDate: undefined, dripMode: "immediate" },
  { id: "l2", type: "text", title: "Setting Up Your Environment", duration: "Read Â· 5 min", icon: FileText, dripEnabled: false, dripDate: undefined, dripMode: "immediate" },
  { id: "l3", type: "quiz", title: "Knowledge Check: Basics", duration: "10 questions", icon: CheckCircle2, dripEnabled: true, dripDate: new Date(2025, 2, 1), dripMode: "date" },
  { id: "l4", type: "video", title: "Building Your First Project", duration: "28:45", icon: Video, dripEnabled: true, dripDate: undefined, dripMode: "after-prev" },
  { id: "l5", type: "assignment", title: "Project Assignment #1", duration: "Due in 7 days", icon: Award, dripEnabled: true, dripDate: new Date(2025, 2, 15), dripMode: "date" },
];

const LMSPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["courses", "students", "live", "monetization", "analytics", "discussion", "certificates", "gamification", "recommendations", "quizzes"] as const;
  const tabFromUrl = searchParams.get("tab");
  const activeTab = tabFromUrl && (validTabs as readonly string[]).includes(tabFromUrl) ? tabFromUrl : "courses";
  const setActiveTab = (value: string) => {
    if (value === "courses") {
      searchParams.delete("tab");
    } else {
      searchParams.set("tab", value);
    }
    setSearchParams(searchParams, { replace: true });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<LessonItem[]>(initialLessons);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [editingDrip, setEditingDrip] = useState<string | null>(null);

  const totalStudents = students.length;
  const totalRevenue = courses.reduce((s, c) => s + c.revenue, 0);
  const publishedCourses = courses.filter(c => c.status === "published").length;
  const avgRating = (courses.filter(c => c.rating > 0).reduce((s, c) => s + c.rating, 0) / courses.filter(c => c.rating > 0).length).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              Learning Management System
            </h1>
            <p className="text-muted-foreground mt-1">Create courses, manage students, and grow your education business</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4" /> New Course</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div><Label>Course Title</Label><Input placeholder="e.g. Advanced JavaScript" className="mt-1.5" /></div>
                  <div><Label>Category</Label><Input placeholder="e.g. Programming" className="mt-1.5" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Price ($)</Label><Input type="number" placeholder="49.99" className="mt-1.5" /></div>
                    <div><Label>Duration</Label><Input placeholder="e.g. 24h" className="mt-1.5" /></div>
                  </div>
                  <div><Label>Description</Label><textarea className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm min-h-[80px]" placeholder="Course description..." /></div>
                  <Button className="w-full">Create Course</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline"><Upload className="h-4 w-4" /> Import</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, change: "+12%", color: "text-blue-500 bg-blue-500/10" },
            { label: "Published Courses", value: publishedCourses, icon: BookOpen, change: "+3", color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Total Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, change: "+18%", color: "text-amber-500 bg-amber-500/10" },
            { label: "Avg Rating", value: avgRating, icon: Star, change: "+0.2", color: "text-rose-500 bg-rose-500/10" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 text-[10px]">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="courses"><BookOpen className="h-4 w-4 mr-1.5" />Courses</TabsTrigger>
            <TabsTrigger value="students"><Users className="h-4 w-4 mr-1.5" />Students</TabsTrigger>
            <TabsTrigger value="live"><Video className="h-4 w-4 mr-1.5" />Live Classes</TabsTrigger>
            <TabsTrigger value="monetization"><DollarSign className="h-4 w-4 mr-1.5" />Monetization</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-1.5" />Analytics</TabsTrigger>
            <TabsTrigger value="discussion"><MessageSquare className="h-4 w-4 mr-1.5" />Discussion</TabsTrigger>
            <TabsTrigger value="certificates"><Award className="h-4 w-4 mr-1.5" />Certificates</TabsTrigger>
            <TabsTrigger value="gamification"><Trophy className="h-4 w-4 mr-1.5" />Gamification</TabsTrigger>
            <TabsTrigger value="recommendations"><Sparkles className="h-4 w-4 mr-1.5" />Recommendations</TabsTrigger>
            <TabsTrigger value="quizzes"><Target className="h-4 w-4 mr-1.5" />Quizzes</TabsTrigger>
          </TabsList>

          {/* â”€â”€â”€ Courses Tab â”€â”€â”€ */}
          <TabsContent value="courses">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Button variant="outline"><Filter className="h-4 w-4" /> Filter</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((course) => (
                  <Card key={course.id} className="group hover:shadow-lg transition-all">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-2xl">
                          {course.thumbnail}
                        </div>
                        <Badge variant={course.status === "published" ? "default" : "secondary"}>
                          {course.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{course.category} Â· {course.duration}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-sm font-bold">{course.lessons}</p>
                          <p className="text-[10px] text-muted-foreground">Lessons</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-sm font-bold">{course.students}</p>
                          <p className="text-[10px] text-muted-foreground">Students</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-sm font-bold flex items-center justify-center gap-0.5">
                            {course.rating > 0 ? <><Star className="h-3 w-3 text-amber-500 fill-amber-500" />{course.rating}</> : "â€”"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Rating</p>
                        </div>
                      </div>
                      {course.status === "draft" && (
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Course Completion</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-primary">${course.price}</span>
                        <div className="flex gap-1.5">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><BarChart3 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Lesson Builder with Drag & Drop + Drip Scheduling */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary" /> Lesson Builder</CardTitle>
                      <CardDescription>Drag lessons to reorder Â· Set drip schedules to control content access</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs gap-1"><CalendarClock className="h-3 w-3" /> Drip Scheduling</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {lessons.map((lesson, i) => (
                      <div
                        key={lesson.id}
                        draggable
                        onDragStart={() => setDragIdx(i)}
                        onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
                        onDragEnd={() => {
                          if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
                            const updated = [...lessons];
                            const [moved] = updated.splice(dragIdx, 1);
                            updated.splice(overIdx, 0, moved);
                            setLessons(updated);
                            toast({ title: "Lesson reordered", description: `"${moved.title}" moved to position ${overIdx + 1}` });
                          }
                          setDragIdx(null);
                          setOverIdx(null);
                        }}
                        className={`flex items-center gap-2 rounded-xl border p-3 transition-all cursor-grab active:cursor-grabbing select-none
                          ${dragIdx === i ? "opacity-50 scale-[0.98] border-primary shadow-md" : "border-border/60 hover:bg-muted/30"}
                          ${overIdx === i && dragIdx !== i ? "border-primary border-dashed bg-primary/5" : ""}`}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                        <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <lesson.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>

                        {/* Drip indicator */}
                        {lesson.dripEnabled && (
                          <Badge variant="outline" className="text-[10px] gap-1 shrink-0 border-amber-300 text-amber-600 bg-amber-50">
                            {lesson.dripMode === "date" && lesson.dripDate ? (
                              <><Lock className="h-2.5 w-2.5" />{format(lesson.dripDate, "MMM d")}</>
                            ) : lesson.dripMode === "after-prev" ? (
                              <><Lock className="h-2.5 w-2.5" />After prev</>
                            ) : (
                              <><Unlock className="h-2.5 w-2.5" />Open</>
                            )}
                          </Badge>
                        )}

                        <Badge variant="outline" className="text-[10px] capitalize shrink-0">{lesson.type}</Badge>

                        {/* Drip schedule button */}
                        <Popover open={editingDrip === lesson.id} onOpenChange={(o) => setEditingDrip(o ? lesson.id : null)}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                              <CalendarClock className="h-3.5 w-3.5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72" align="end">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">Drip Schedule</Label>
                                <Switch
                                  checked={lesson.dripEnabled}
                                  onCheckedChange={(checked) => {
                                    setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, dripEnabled: checked } : l));
                                  }}
                                />
                              </div>
                              {lesson.dripEnabled && (
                                <>
                                  <Select
                                    value={lesson.dripMode}
                                    onValueChange={(v: "immediate" | "date" | "after-prev") => {
                                      setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, dripMode: v } : l));
                                    }}
                                  >
                                    <SelectTrigger className="h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="immediate">Available immediately</SelectItem>
                                      <SelectItem value="date">Unlock on specific date</SelectItem>
                                      <SelectItem value="after-prev">After previous lesson completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {lesson.dripMode === "date" && (
                                    <CalendarPicker
                                      mode="single"
                                      selected={lesson.dripDate}
                                      onSelect={(date) => {
                                        setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, dripDate: date } : l));
                                      }}
                                      className="rounded-lg border"
                                    />
                                  )}
                                  {lesson.dripMode === "after-prev" && i === 0 && (
                                    <p className="text-xs text-amber-600">âš ï¸ First lesson can't depend on a previous one.</p>
                                  )}
                                </>
                              )}
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  setEditingDrip(null);
                                  toast({ title: "Drip schedule updated", description: `Schedule for "${lesson.title}" saved.` });
                                }}
                              >
                                Save Schedule
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>

                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><Trash2 className="h-3.5 w-3.5 text-destructive/70" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => {
                      const newLesson: LessonItem = {
                        id: `l${Date.now()}`,
                        type: "video",
                        title: `New Lesson ${lessons.length + 1}`,
                        duration: "0:00",
                        icon: Video,
                        dripEnabled: false,
                        dripDate: undefined,
                        dripMode: "immediate",
                      };
                      setLessons(prev => [...prev, newLesson]);
                      toast({ title: "Lesson added", description: "New lesson added to the curriculum." });
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Lesson
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* â”€â”€â”€ Students Tab â”€â”€â”€ */}
          <TabsContent value="students">
            <StudentProgressDashboard />
          </TabsContent>

          {/* â”€â”€â”€ Live Classes Tab â”€â”€â”€ */}
          <TabsContent value="live">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-2">
                  {["All", "Upcoming", "Completed", "Scheduled"].map((filter) => (
                    <Badge key={filter} variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1">
                      {filter}
                    </Badge>
                  ))}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4" /> Schedule Session</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Schedule Live Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div><Label>Session Title</Label><Input placeholder="e.g. React Hooks Deep Dive" className="mt-1.5" /></div>
                      <div><Label>Course</Label><Input placeholder="Select course..." className="mt-1.5" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Date</Label><Input type="date" className="mt-1.5" /></div>
                        <div><Label>Time</Label><Input type="time" className="mt-1.5" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Duration (min)</Label><Input type="number" placeholder="90" className="mt-1.5" /></div>
                        <div><Label>Max Capacity</Label><Input type="number" placeholder="100" className="mt-1.5" /></div>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                        <div>
                          <p className="text-sm font-medium">Record Session</p>
                          <p className="text-xs text-muted-foreground">Auto-record for students who miss it</p>
                        </div>
                        <Switch />
                      </div>
                      <Button className="w-full">Schedule Session</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {liveSessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            session.status === "upcoming" ? "bg-blue-500/10 text-blue-500" :
                            session.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                            "bg-amber-500/10 text-amber-500"
                          }`}>
                            {session.type === "webinar" ? <Monitor className="h-5 w-5" /> :
                             session.type === "workshop" ? <Mic className="h-5 w-5" /> :
                             <Video className="h-5 w-5" />}
                          </div>
                          <Badge variant="outline" className="text-[10px] capitalize">{session.type.replace("-", " ")}</Badge>
                        </div>
                        <Badge variant={
                          session.status === "upcoming" ? "default" :
                          session.status === "completed" ? "secondary" : "outline"
                        } className="text-[10px]">
                          {session.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{session.course}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <Calendar className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                          <p className="font-medium">{session.date}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <Clock className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                          <p className="font-medium">{session.time}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <Users className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                          <p className="font-medium">{session.attendees}/{session.maxCapacity}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Instructor: <span className="font-medium text-foreground">{session.instructor}</span></p>
                        {session.status === "upcoming" && (
                          <Button size="sm" className="gap-1"><Play className="h-3.5 w-3.5" /> Join</Button>
                        )}
                        {session.status === "completed" && (
                          <Button variant="outline" size="sm" className="gap-1"><Video className="h-3.5 w-3.5" /> Recording</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Integration Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><Settings className="h-5 w-5 text-muted-foreground" /> Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Zoom", desc: "Auto-create Zoom meetings", connected: true, icon: "ðŸ“¹" },
                    { name: "Google Meet", desc: "Generate Meet links", connected: false, icon: "ðŸŽ¥" },
                    { name: "Microsoft Teams", desc: "Schedule Teams meetings", connected: false, icon: "ðŸ’¼" },
                  ].map((integration, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{integration.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{integration.name}</p>
                          <p className="text-xs text-muted-foreground">{integration.desc}</p>
                        </div>
                      </div>
                      <Button variant={integration.connected ? "secondary" : "outline"} size="sm">
                        {integration.connected ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* â”€â”€â”€ Monetization Tab â”€â”€â”€ */}
          <TabsContent value="monetization">
            <div className="space-y-4">
              {/* Revenue Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Monthly Revenue", value: "$12,450", icon: DollarSign, change: "+24%", color: "text-emerald-500 bg-emerald-500/10" },
                  { label: "Active Subscriptions", value: "257", icon: Zap, change: "+18", color: "text-blue-500 bg-blue-500/10" },
                  { label: "Avg Course Price", value: "$45.80", icon: Target, change: "+$2.50", color: "text-amber-500 bg-amber-500/10" },
                  { label: "Refund Rate", value: "2.1%", icon: TrendingUp, change: "-0.3%", color: "text-rose-500 bg-rose-500/10" },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{stat.value}</p>
                        <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Subscription Plans */}
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Subscription Plans</CardTitle>
                  <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> New Plan</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {subscriptionPlans.map((plan) => (
                      <div key={plan.id} className={`rounded-xl border border-border/60 p-4 space-y-3 ${plan.color}`}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{plan.name}</h3>
                          <Badge variant="outline" className="text-[10px]">{plan.students} students</Badge>
                        </div>
                        <p className="text-2xl font-bold">${plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                        <ul className="space-y-1.5">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" size="sm" className="w-full">Edit Plan</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Coupons & Course Revenue */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Gift className="h-5 w-5 text-primary" /> Coupons & Discounts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { code: "WELCOME20", discount: "20% off", uses: 145, expires: "Mar 31", active: true },
                      { code: "BUNDLE50", discount: "50% off bundle", uses: 32, expires: "Feb 28", active: true },
                      { code: "FLASH30", discount: "30% off", uses: 89, expires: "Expired", active: false },
                    ].map((coupon, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono font-bold text-primary">{coupon.code}</code>
                            <Badge variant={coupon.active ? "default" : "secondary"} className="text-[9px]">
                              {coupon.active ? "Active" : "Expired"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{coupon.discount} Â· {coupon.uses} uses Â· {coupon.expires}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full"><Plus className="h-4 w-4" /> Create Coupon</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-5 w-5 text-primary" /> Revenue by Course</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {courses.filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue).map((course) => (
                      <div key={course.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate max-w-[200px]">{course.title}</span>
                          <span className="font-bold text-emerald-600">${(course.revenue / 1000).toFixed(1)}K</span>
                        </div>
                        <Progress value={(course.revenue / 50000) * 100} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          {/* â”€â”€â”€ Analytics Tab â”€â”€â”€ */}
          <TabsContent value="analytics">
            <LMSAnalytics />
          </TabsContent>

          {/* â”€â”€â”€ Discussion Forum Tab â”€â”€â”€ */}
          <TabsContent value="discussion">
            <LMSDiscussion />
          </TabsContent>

          {/* â”€â”€â”€ Certificates Tab â”€â”€â”€ */}
          <TabsContent value="certificates">
            <CertificateBuilder />
          </TabsContent>

          {/* â”€â”€â”€ Gamification Tab â”€â”€â”€ */}
          <TabsContent value="gamification">
            <GamificationDashboard />
          </TabsContent>

          {/* â”€â”€â”€ Recommendations Tab â”€â”€â”€ */}
          <TabsContent value="recommendations">
            <CourseRecommendations />
          </TabsContent>

          {/* â”€â”€â”€ Quizzes Tab â”€â”€â”€ */}
          <TabsContent value="quizzes">
            <QuizBuilder />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LMSPage;

