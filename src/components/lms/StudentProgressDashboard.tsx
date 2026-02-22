import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, Award, Target, TrendingUp, Search, Download, UserPlus,
  Mail, Eye, Trophy, BookOpen, CheckCircle2, Clock, Star,
  BarChart3, FileText, ArrowLeft, ChevronRight, Flame, Shield,
  Zap, Calendar as CalendarIcon, HeartPulse,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
} from "recharts";
import { toast } from "@/hooks/use-toast";

// ─── Enhanced Student Data ───
type StudentCourseProgress = {
  courseId: number;
  courseName: string;
  thumbnail: string;
  enrolled: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizzes: QuizScore[];
  assignments: AssignmentScore[];
  timeSpent: string;
  lastAccessed: string;
  certificateEarned: boolean;
  certificateDate?: string;
  grade: string;
};

type QuizScore = {
  id: number;
  name: string;
  score: number;
  maxScore: number;
  attempts: number;
  date: string;
  passed: boolean;
};

type AssignmentScore = {
  id: number;
  name: string;
  score: number;
  maxScore: number;
  status: "submitted" | "graded" | "pending" | "late";
  date: string;
  feedback?: string;
};

type StreakData = {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  freezesUsed: number;
  freezesAvailable: number;
  lastActiveDate: string;
  streakHistory: { date: string; active: boolean; recovered?: boolean }[];
  milestones: { days: number; label: string; achieved: boolean; reward: string }[];
};

type EnhancedStudent = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  joined: string;
  status: "active" | "inactive";
  totalTimeSpent: string;
  streak: number;
  streakData: StreakData;
  courses: StudentCourseProgress[];
};

const generateStreakHistory = (currentStreak: number, longestStreak: number): StreakData["streakHistory"] => {
  const history: StreakData["streakHistory"] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    if (i < currentStreak) {
      history.push({ date: dateStr, active: true });
    } else if (i < currentStreak + 2) {
      history.push({ date: dateStr, active: false });
    } else if (i < currentStreak + 2 + Math.min(longestStreak, 30)) {
      const recovered = Math.random() > 0.85;
      history.push({ date: dateStr, active: true, recovered });
    } else {
      history.push({ date: dateStr, active: Math.random() > 0.35 });
    }
  }
  return history;
};

const createStreakData = (current: number, longest: number, totalDays: number, freezesUsed: number, freezesAvail: number): StreakData => ({
  currentStreak: current,
  longestStreak: longest,
  totalActiveDays: totalDays,
  freezesUsed,
  freezesAvailable: freezesAvail,
  lastActiveDate: new Date().toISOString().split("T")[0],
  streakHistory: generateStreakHistory(current, longest),
  milestones: [
    { days: 7, label: "Week Warrior", achieved: current >= 7 || longest >= 7, reward: "🥉 Bronze Badge" },
    { days: 14, label: "Fortnight Force", achieved: current >= 14 || longest >= 14, reward: "🥈 Silver Badge" },
    { days: 30, label: "Monthly Master", achieved: current >= 30 || longest >= 30, reward: "🥇 Gold Badge" },
    { days: 60, label: "Consistency King", achieved: longest >= 60, reward: "💎 Diamond Badge" },
    { days: 100, label: "Century Legend", achieved: longest >= 100, reward: "👑 Crown Badge" },
  ],
});

const enhancedStudents: EnhancedStudent[] = [
  {
    id: 1, name: "Ahmed Al-Rashid", email: "ahmed@mail.com", avatar: "🧑‍💻", joined: "Nov 15, 2024", status: "active", totalTimeSpent: "142h", streak: 14, streakData: createStreakData(14, 22, 68, 1, 2),
    courses: [
      {
        courseId: 1, courseName: "Web Development Bootcamp", thumbnail: "🖥️", enrolled: "Nov 20, 2024", progress: 92, lessonsCompleted: 39, totalLessons: 42,
        quizzes: [
          { id: 1, name: "HTML & CSS Basics", score: 95, maxScore: 100, attempts: 1, date: "Dec 1", passed: true },
          { id: 2, name: "JavaScript Fundamentals", score: 88, maxScore: 100, attempts: 2, date: "Dec 15", passed: true },
          { id: 3, name: "React Components", score: 92, maxScore: 100, attempts: 1, date: "Jan 8", passed: true },
          { id: 4, name: "State Management", score: 78, maxScore: 100, attempts: 3, date: "Jan 22", passed: true },
        ],
        assignments: [
          { id: 1, name: "Portfolio Website", score: 90, maxScore: 100, status: "graded", date: "Dec 10", feedback: "Excellent responsive design!" },
          { id: 2, name: "React Todo App", score: 85, maxScore: 100, status: "graded", date: "Jan 5" },
          { id: 3, name: "Full-Stack Project", score: 0, maxScore: 100, status: "pending", date: "Feb 20" },
        ],
        timeSpent: "68h", lastAccessed: "2 hours ago", certificateEarned: false, grade: "A-",
      },
      {
        courseId: 2, courseName: "UI/UX Design Masterclass", thumbnail: "🎨", enrolled: "Dec 1, 2024", progress: 75, lessonsCompleted: 21, totalLessons: 28,
        quizzes: [
          { id: 5, name: "Design Principles", score: 90, maxScore: 100, attempts: 1, date: "Dec 20", passed: true },
          { id: 6, name: "Figma Basics", score: 95, maxScore: 100, attempts: 1, date: "Jan 10", passed: true },
        ],
        assignments: [
          { id: 4, name: "Wireframe Project", score: 92, maxScore: 100, status: "graded", date: "Jan 15", feedback: "Great user flow!" },
        ],
        timeSpent: "38h", lastAccessed: "1 day ago", certificateEarned: false, grade: "A",
      },
      {
        courseId: 3, courseName: "Digital Marketing A-Z", thumbnail: "📢", enrolled: "Jan 5, 2025", progress: 100, lessonsCompleted: 35, totalLessons: 35,
        quizzes: [
          { id: 7, name: "SEO Fundamentals", score: 85, maxScore: 100, attempts: 2, date: "Jan 20", passed: true },
          { id: 8, name: "Social Media Strategy", score: 92, maxScore: 100, attempts: 1, date: "Feb 1", passed: true },
        ],
        assignments: [
          { id: 5, name: "Marketing Plan", score: 88, maxScore: 100, status: "graded", date: "Feb 5", feedback: "Well-researched strategy." },
        ],
        timeSpent: "36h", lastAccessed: "3 days ago", certificateEarned: true, certificateDate: "Feb 10, 2025", grade: "A-",
      },
    ],
  },
  {
    id: 2, name: "Sarah Johnson", email: "sarah@mail.com", avatar: "👩‍🎨", joined: "Dec 1, 2024", status: "active", totalTimeSpent: "98h", streak: 7, streakData: createStreakData(7, 15, 42, 2, 1),
    courses: [
      {
        courseId: 1, courseName: "Web Development Bootcamp", thumbnail: "🖥️", enrolled: "Dec 5, 2024", progress: 65, lessonsCompleted: 27, totalLessons: 42,
        quizzes: [
          { id: 9, name: "HTML & CSS Basics", score: 82, maxScore: 100, attempts: 2, date: "Dec 18", passed: true },
          { id: 10, name: "JavaScript Fundamentals", score: 75, maxScore: 100, attempts: 3, date: "Jan 5", passed: true },
        ],
        assignments: [
          { id: 6, name: "Portfolio Website", score: 88, maxScore: 100, status: "graded", date: "Jan 2" },
          { id: 7, name: "React Todo App", score: 0, maxScore: 100, status: "pending", date: "Feb 25" },
        ],
        timeSpent: "52h", lastAccessed: "5 hours ago", certificateEarned: false, grade: "B+",
      },
      {
        courseId: 2, courseName: "UI/UX Design Masterclass", thumbnail: "🎨", enrolled: "Dec 10, 2024", progress: 100, lessonsCompleted: 28, totalLessons: 28,
        quizzes: [
          { id: 11, name: "Design Principles", score: 96, maxScore: 100, attempts: 1, date: "Jan 5", passed: true },
          { id: 12, name: "Figma Basics", score: 98, maxScore: 100, attempts: 1, date: "Jan 20", passed: true },
          { id: 13, name: "Prototyping", score: 94, maxScore: 100, attempts: 1, date: "Feb 1", passed: true },
        ],
        assignments: [
          { id: 8, name: "Wireframe Project", score: 95, maxScore: 100, status: "graded", date: "Jan 25", feedback: "Outstanding work!" },
          { id: 9, name: "Design System", score: 91, maxScore: 100, status: "graded", date: "Feb 8" },
        ],
        timeSpent: "46h", lastAccessed: "1 day ago", certificateEarned: true, certificateDate: "Feb 12, 2025", grade: "A+",
      },
    ],
  },
  {
    id: 3, name: "Mohammed Khalid", email: "mo@mail.com", avatar: "🔧", joined: "Oct 20, 2024", status: "active", totalTimeSpent: "210h", streak: 21, streakData: createStreakData(21, 45, 105, 0, 3),
    courses: [
      {
        courseId: 1, courseName: "Web Development Bootcamp", thumbnail: "🖥️", enrolled: "Oct 25, 2024", progress: 100, lessonsCompleted: 42, totalLessons: 42,
        quizzes: [
          { id: 14, name: "HTML & CSS Basics", score: 100, maxScore: 100, attempts: 1, date: "Nov 10", passed: true },
          { id: 15, name: "JavaScript Fundamentals", score: 95, maxScore: 100, attempts: 1, date: "Nov 25", passed: true },
          { id: 16, name: "React Components", score: 98, maxScore: 100, attempts: 1, date: "Dec 10", passed: true },
          { id: 17, name: "State Management", score: 92, maxScore: 100, attempts: 1, date: "Dec 25", passed: true },
        ],
        assignments: [
          { id: 10, name: "Portfolio Website", score: 98, maxScore: 100, status: "graded", date: "Nov 20", feedback: "Perfect implementation!" },
          { id: 11, name: "React Todo App", score: 95, maxScore: 100, status: "graded", date: "Dec 15" },
          { id: 12, name: "Full-Stack Project", score: 92, maxScore: 100, status: "graded", date: "Jan 10", feedback: "Great architecture!" },
        ],
        timeSpent: "82h", lastAccessed: "3 hours ago", certificateEarned: true, certificateDate: "Jan 15, 2025", grade: "A+",
      },
      {
        courseId: 2, courseName: "UI/UX Design Masterclass", thumbnail: "🎨", enrolled: "Nov 5, 2024", progress: 100, lessonsCompleted: 28, totalLessons: 28,
        quizzes: [
          { id: 18, name: "Design Principles", score: 88, maxScore: 100, attempts: 1, date: "Nov 20", passed: true },
          { id: 19, name: "Figma Basics", score: 92, maxScore: 100, attempts: 1, date: "Dec 5", passed: true },
        ],
        assignments: [
          { id: 13, name: "Wireframe Project", score: 90, maxScore: 100, status: "graded", date: "Dec 10" },
        ],
        timeSpent: "44h", lastAccessed: "2 days ago", certificateEarned: true, certificateDate: "Jan 5, 2025", grade: "A",
      },
      {
        courseId: 3, courseName: "Digital Marketing A-Z", thumbnail: "📢", enrolled: "Dec 1, 2024", progress: 85, lessonsCompleted: 30, totalLessons: 35,
        quizzes: [
          { id: 20, name: "SEO Fundamentals", score: 90, maxScore: 100, attempts: 1, date: "Dec 20", passed: true },
        ],
        assignments: [
          { id: 14, name: "Marketing Plan", score: 86, maxScore: 100, status: "graded", date: "Jan 20" },
        ],
        timeSpent: "32h", lastAccessed: "1 day ago", certificateEarned: false, grade: "A-",
      },
      {
        courseId: 4, courseName: "Data Science with Python", thumbnail: "📊", enrolled: "Jan 10, 2025", progress: 30, lessonsCompleted: 5, totalLessons: 18,
        quizzes: [
          { id: 21, name: "Python Basics", score: 95, maxScore: 100, attempts: 1, date: "Jan 25", passed: true },
        ],
        assignments: [],
        timeSpent: "12h", lastAccessed: "4 hours ago", certificateEarned: false, grade: "A",
      },
    ],
  },
  {
    id: 4, name: "Fatima Noor", email: "fatima@mail.com", avatar: "🎨", joined: "Jan 5, 2025", status: "active", totalTimeSpent: "34h", streak: 3, streakData: createStreakData(3, 8, 18, 1, 2),
    courses: [
      {
        courseId: 2, courseName: "UI/UX Design Masterclass", thumbnail: "🎨", enrolled: "Jan 8, 2025", progress: 40, lessonsCompleted: 11, totalLessons: 28,
        quizzes: [
          { id: 22, name: "Design Principles", score: 72, maxScore: 100, attempts: 3, date: "Jan 25", passed: true },
        ],
        assignments: [
          { id: 15, name: "Wireframe Project", score: 0, maxScore: 100, status: "pending", date: "Feb 28" },
        ],
        timeSpent: "34h", lastAccessed: "6 hours ago", certificateEarned: false, grade: "C+",
      },
    ],
  },
  {
    id: 5, name: "James Wilson", email: "james@mail.com", avatar: "📊", joined: "Jan 10, 2025", status: "inactive", totalTimeSpent: "18h", streak: 0, streakData: createStreakData(0, 5, 10, 3, 0),
    courses: [
      {
        courseId: 1, courseName: "Web Development Bootcamp", thumbnail: "🖥️", enrolled: "Jan 12, 2025", progress: 15, lessonsCompleted: 6, totalLessons: 42,
        quizzes: [
          { id: 23, name: "HTML & CSS Basics", score: 45, maxScore: 100, attempts: 3, date: "Jan 28", passed: false },
        ],
        assignments: [
          { id: 16, name: "Portfolio Website", score: 0, maxScore: 100, status: "late", date: "Feb 10" },
        ],
        timeSpent: "10h", lastAccessed: "2 weeks ago", certificateEarned: false, grade: "F",
      },
      {
        courseId: 3, courseName: "Digital Marketing A-Z", thumbnail: "📢", enrolled: "Jan 15, 2025", progress: 20, lessonsCompleted: 7, totalLessons: 35,
        quizzes: [
          { id: 24, name: "SEO Fundamentals", score: 55, maxScore: 100, attempts: 2, date: "Feb 1", passed: false },
        ],
        assignments: [],
        timeSpent: "8h", lastAccessed: "1 week ago", certificateEarned: false, grade: "D",
      },
    ],
  },
  {
    id: 6, name: "Layla Hassan", email: "layla@mail.com", avatar: "🚀", joined: "Sep 15, 2024", status: "active", totalTimeSpent: "185h", streak: 18, streakData: createStreakData(18, 38, 92, 1, 2),
    courses: [
      {
        courseId: 1, courseName: "Web Development Bootcamp", thumbnail: "🖥️", enrolled: "Sep 20, 2024", progress: 100, lessonsCompleted: 42, totalLessons: 42,
        quizzes: [
          { id: 25, name: "HTML & CSS Basics", score: 92, maxScore: 100, attempts: 1, date: "Oct 5", passed: true },
          { id: 26, name: "JavaScript Fundamentals", score: 88, maxScore: 100, attempts: 1, date: "Oct 20", passed: true },
          { id: 27, name: "React Components", score: 95, maxScore: 100, attempts: 1, date: "Nov 5", passed: true },
          { id: 28, name: "State Management", score: 90, maxScore: 100, attempts: 2, date: "Nov 20", passed: true },
        ],
        assignments: [
          { id: 17, name: "Portfolio Website", score: 94, maxScore: 100, status: "graded", date: "Oct 15", feedback: "Clean code!" },
          { id: 18, name: "React Todo App", score: 90, maxScore: 100, status: "graded", date: "Nov 10" },
          { id: 19, name: "Full-Stack Project", score: 96, maxScore: 100, status: "graded", date: "Dec 5", feedback: "Outstanding project!" },
        ],
        timeSpent: "76h", lastAccessed: "5 hours ago", certificateEarned: true, certificateDate: "Dec 10, 2024", grade: "A",
      },
      {
        courseId: 2, courseName: "UI/UX Design Masterclass", thumbnail: "🎨", enrolled: "Nov 1, 2024", progress: 88, lessonsCompleted: 25, totalLessons: 28,
        quizzes: [
          { id: 29, name: "Design Principles", score: 94, maxScore: 100, attempts: 1, date: "Nov 15", passed: true },
          { id: 30, name: "Figma Basics", score: 90, maxScore: 100, attempts: 1, date: "Dec 1", passed: true },
        ],
        assignments: [
          { id: 20, name: "Wireframe Project", score: 88, maxScore: 100, status: "graded", date: "Dec 10" },
        ],
        timeSpent: "42h", lastAccessed: "12 hours ago", certificateEarned: false, grade: "A-",
      },
      {
        courseId: 3, courseName: "Digital Marketing A-Z", thumbnail: "📢", enrolled: "Dec 15, 2024", progress: 100, lessonsCompleted: 35, totalLessons: 35,
        quizzes: [
          { id: 31, name: "SEO Fundamentals", score: 88, maxScore: 100, attempts: 1, date: "Jan 5", passed: true },
          { id: 32, name: "Social Media Strategy", score: 85, maxScore: 100, attempts: 2, date: "Jan 20", passed: true },
        ],
        assignments: [
          { id: 21, name: "Marketing Plan", score: 92, maxScore: 100, status: "graded", date: "Feb 1", feedback: "Excellent analysis!" },
        ],
        timeSpent: "30h", lastAccessed: "2 days ago", certificateEarned: true, certificateDate: "Feb 5, 2025", grade: "A",
      },
    ],
  },
];

const gradeColors: Record<string, string> = {
  "A+": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "A": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "A-": "text-emerald-500 bg-emerald-50 border-emerald-200",
  "B+": "text-blue-600 bg-blue-50 border-blue-200",
  "B": "text-blue-500 bg-blue-50 border-blue-200",
  "C+": "text-amber-600 bg-amber-50 border-amber-200",
  "C": "text-amber-500 bg-amber-50 border-amber-200",
  "D": "text-orange-600 bg-orange-50 border-orange-200",
  "F": "text-destructive bg-destructive/5 border-destructive/20",
};

const StudentProgressDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<EnhancedStudent | null>(null);
  const [detailTab, setDetailTab] = useState("overview");

  const filteredStudents = enhancedStudents
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(s => statusFilter === "all" || s.status === statusFilter);

  const totalCerts = enhancedStudents.reduce((sum, s) => sum + s.courses.filter(c => c.certificateEarned).length, 0);
  const avgScore = Math.round(
    enhancedStudents.reduce((sum, s) => {
      const scores = s.courses.flatMap(c => c.quizzes.map(q => q.score));
      return sum + (scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
    }, 0) / enhancedStudents.length
  );
  const avgProgress = Math.round(
    enhancedStudents.reduce((sum, s) => sum + s.courses.reduce((a, c) => a + c.progress, 0) / s.courses.length, 0) / enhancedStudents.length
  );

  // Student detail view
  if (selectedStudent) {
    const allQuizzes = selectedStudent.courses.flatMap(c => c.quizzes);
    const allAssignments = selectedStudent.courses.flatMap(c => c.assignments);
    const avgQuizScore = allQuizzes.length ? Math.round(allQuizzes.reduce((s, q) => s + q.score, 0) / allQuizzes.length) : 0;
    const completedCourses = selectedStudent.courses.filter(c => c.progress === 100).length;
    const certs = selectedStudent.courses.filter(c => c.certificateEarned).length;

    const skillRadarData = selectedStudent.courses.map(c => ({
      subject: c.courseName.split(" ").slice(0, 2).join(" "),
      score: c.quizzes.length ? Math.round(c.quizzes.reduce((s, q) => s + q.score, 0) / c.quizzes.length) : 0,
      fullMark: 100,
    }));

    const quizTrendData = allQuizzes.map(q => ({
      name: q.name.length > 15 ? q.name.slice(0, 15) + "…" : q.name,
      score: q.score,
    }));

    return (
      <div className="space-y-4">
        {/* Back + Student Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
              {selectedStudent.avatar}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{selectedStudent.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedStudent.email} · Joined {selectedStudent.joined}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={selectedStudent.status === "active" ? "default" : "secondary"}>
              {selectedStudent.status}
            </Badge>
            <Badge variant="outline" className="gap-1">🔥 {selectedStudent.streak} day streak</Badge>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Enrolled Courses", value: selectedStudent.courses.length, icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
            { label: "Completed", value: completedCourses, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Avg Quiz Score", value: `${avgQuizScore}%`, icon: Target, color: "text-amber-500 bg-amber-500/10" },
            { label: "Certificates", value: certs, icon: Award, color: "text-rose-500 bg-rose-500/10" },
            { label: "Total Time", value: selectedStudent.totalTimeSpent, icon: Clock, color: "text-primary bg-primary/10" },
          ].map(kpi => (
            <Card key={kpi.label}>
              <CardContent className="p-3 flex items-center gap-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.color} shrink-0`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-base font-bold">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Tabs */}
        <Tabs value={detailTab} onValueChange={setDetailTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quizzes">Quiz Scores</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="streaks">🔥 Streaks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-4">
              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Quiz Score Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={quizTrendData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                          <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {skillRadarData.length >= 3 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-amber-500" /> Skill Radar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={skillRadarData}>
                            <PolarGrid className="stroke-muted" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                            <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-amber-500" /> Course Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 py-4">
                        {selectedStudent.courses.map(c => (
                          <div key={c.courseId} className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{c.thumbnail} {c.courseName}</span>
                              <span className="font-bold text-primary">{c.progress}%</span>
                            </div>
                            <Progress value={c.progress} className="h-2.5" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Course-wise Progress Cards */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Course-wise Progress</h3>
                {selectedStudent.courses.map(course => (
                  <Card key={course.courseId} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl shrink-0">{course.thumbnail}</div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm text-foreground">{course.courseName}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-[10px] ${gradeColors[course.grade] || ""}`}>
                                Grade: {course.grade}
                              </Badge>
                              {course.certificateEarned && (
                                <Badge className="text-[9px] gap-1 bg-emerald-500 hover:bg-emerald-600">
                                  <Award className="h-2.5 w-2.5" /> Certified
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>{course.lessonsCompleted}/{course.totalLessons} lessons</span>
                            <span>·</span>
                            <span>{course.quizzes.length} quizzes</span>
                            <span>·</span>
                            <span>{course.timeSpent} spent</span>
                            <span>·</span>
                            <span>Last: {course.lastAccessed}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={course.progress} className="h-2 flex-1" />
                            <span className="text-xs font-bold text-primary w-10 text-right">{course.progress}%</span>
                          </div>
                          {/* Mini quiz scores */}
                          {course.quizzes.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap pt-1">
                              {course.quizzes.map(q => (
                                <span key={q.id} className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                  q.score >= 80 ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                                  q.score >= 60 ? "border-amber-200 bg-amber-50 text-amber-700" :
                                  "border-destructive/20 bg-destructive/5 text-destructive"
                                }`}>
                                  {q.name.split(" ").slice(0, 2).join(" ")}: {q.score}%
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> All Quiz Scores
                </CardTitle>
                <CardDescription>{allQuizzes.length} quizzes across {selectedStudent.courses.length} courses</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Attempts</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStudent.courses.flatMap(c =>
                      c.quizzes.map(q => (
                        <TableRow key={q.id}>
                          <TableCell className="font-medium text-sm">{q.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{c.courseName}</TableCell>
                          <TableCell className="text-center">
                            <span className={`font-bold ${q.score >= 80 ? "text-emerald-600" : q.score >= 60 ? "text-amber-600" : "text-destructive"}`}>
                              {q.score}/{q.maxScore}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">{q.attempts}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={q.passed ? "default" : "destructive"} className="text-[9px]">
                              {q.passed ? "Passed" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{q.date}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" /> All Assignments
                </CardTitle>
                <CardDescription>{allAssignments.length} assignments across {selectedStudent.courses.length} courses</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStudent.courses.flatMap(c =>
                      c.assignments.map(a => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium text-sm">{a.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{c.courseName}</TableCell>
                          <TableCell className="text-center">
                            {a.status === "graded" ? (
                              <span className={`font-bold ${a.score >= 80 ? "text-emerald-600" : a.score >= 60 ? "text-amber-600" : "text-destructive"}`}>
                                {a.score}/{a.maxScore}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={a.status === "graded" ? "default" : a.status === "late" ? "destructive" : "secondary"}
                              className="text-[9px] capitalize"
                            >
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{a.date}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{a.feedback || "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <div className="space-y-3">
              {selectedStudent.courses.filter(c => c.certificateEarned).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No certificates earned yet</p>
                    <p className="text-xs mt-1">Complete a course to earn your first certificate!</p>
                  </CardContent>
                </Card>
              ) : (
                selectedStudent.courses.filter(c => c.certificateEarned).map(course => (
                  <Card key={course.courseId} className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-3xl shrink-0">
                          🎓
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground">Certificate of Completion</h4>
                          <p className="text-sm text-muted-foreground">{course.courseName}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>Grade: <strong className="text-foreground">{course.grade}</strong></span>
                            <span>·</span>
                            <span>Issued: {course.certificateDate}</span>
                            <span>·</span>
                            <span>ID: CERT-{course.courseId}-{selectedStudent.id}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => toast({ title: "Certificate downloaded", description: `${course.courseName} certificate saved.` })}>
                          <Download className="h-3.5 w-3.5" /> Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Streaks Tab */}
          <TabsContent value="streaks">
            <div className="space-y-4">
              {/* Streak Hero */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
                        <Flame className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                        <p className="text-4xl font-black text-foreground">{selectedStudent.streakData.currentStreak} <span className="text-lg font-medium text-muted-foreground">days</span></p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-foreground">{selectedStudent.streakData.longestStreak}</p>
                        <p className="text-[10px] text-muted-foreground">Longest Streak</p>
                      </div>
                      <div className="text-center">
                        <CalendarIcon className="h-5 w-5 text-primary mx-auto mb-1" />
                        <p className="text-xl font-bold text-foreground">{selectedStudent.streakData.totalActiveDays}</p>
                        <p className="text-[10px] text-muted-foreground">Total Active Days</p>
                      </div>
                      <div className="text-center">
                        <Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-foreground">{selectedStudent.streakData.freezesAvailable}</p>
                        <p className="text-[10px] text-muted-foreground">Streak Freezes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Streak Recovery + Freezes */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-blue-500" /> Streak Recovery</CardTitle>
                    <CardDescription>Use streak freezes to protect your streak on rest days</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 text-rose-500" />
                        <span className="text-sm font-medium">Freezes Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                            i < selectedStudent.streakData.freezesAvailable
                              ? "bg-blue-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {i < selectedStudent.streakData.freezesAvailable ? "❄️" : "·"}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Freezes Used</span>
                      </div>
                      <span className="text-sm font-bold">{selectedStudent.streakData.freezesUsed}</span>
                    </div>
                    {selectedStudent.streakData.currentStreak === 0 && (
                      <Button
                        className="w-full gap-2"
                        variant="outline"
                        onClick={() => toast({ title: "Streak Recovered! 🔥", description: "Your streak has been restored using a freeze." })}
                        disabled={selectedStudent.streakData.freezesAvailable === 0}
                      >
                        <HeartPulse className="h-4 w-4" />
                        {selectedStudent.streakData.freezesAvailable > 0 ? "Use Freeze to Recover Streak" : "No Freezes Available"}
                      </Button>
                    )}
                    {selectedStudent.streakData.currentStreak > 0 && selectedStudent.streakData.freezesAvailable > 0 && (
                      <Button
                        className="w-full gap-2"
                        variant="outline"
                        onClick={() => toast({ title: "Streak Freeze Activated! ❄️", description: "Tomorrow will be a protected rest day." })}
                      >
                        <Shield className="h-4 w-4" /> Activate Freeze for Tomorrow
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Milestones */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-500" /> Streak Milestones</CardTitle>
                    <CardDescription>Earn badges by maintaining your streak</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedStudent.streakData.milestones.map(m => (
                      <div key={m.days} className={`flex items-center justify-between p-2.5 rounded-lg border ${
                        m.achieved ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10" : "border-border bg-muted/30"
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{m.achieved ? m.reward.split(" ")[0] : "🔒"}</span>
                          <div>
                            <p className={`text-xs font-semibold ${m.achieved ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</p>
                            <p className="text-[10px] text-muted-foreground">{m.days} day streak · {m.reward}</p>
                          </div>
                        </div>
                        {m.achieved ? (
                          <Badge className="text-[9px] bg-amber-500 hover:bg-amber-600">Achieved</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[9px]">{m.days - selectedStudent.streakData.longestStreak > 0 ? `${m.days - selectedStudent.streakData.longestStreak} days to go` : "Almost!"}</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* 90-Day Activity Heatmap */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" /> 90-Day Activity Heatmap</CardTitle>
                  <CardDescription>Daily learning activity over the past 3 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {selectedStudent.streakData.streakHistory.map((day, i) => (
                      <div
                        key={i}
                        title={`${day.date}: ${day.active ? (day.recovered ? "Recovered" : "Active") : "Missed"}`}
                        className={`h-3.5 w-3.5 rounded-sm transition-colors ${
                          day.active
                            ? day.recovered
                              ? "bg-blue-400"
                              : "bg-emerald-500"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Active</div>
                    <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-blue-400" /> Recovered</div>
                    <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-muted" /> Missed</div>
                  </div>
                </CardContent>
              </Card>

              {/* Streak Stats Bar Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={(() => {
                        const weeks: { week: string; days: number }[] = [];
                        const hist = selectedStudent.streakData.streakHistory;
                        for (let w = 0; w < Math.ceil(hist.length / 7); w++) {
                          const slice = hist.slice(w * 7, (w + 1) * 7);
                          weeks.push({ week: `W${w + 1}`, days: slice.filter(d => d.active).length });
                        }
                        return weeks;
                      })()}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                        <YAxis domain={[0, 7]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                        <Bar dataKey="days" name="Active Days" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // ─── Student List View ───
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Students", value: enhancedStudents.filter(s => s.status === "active").length, icon: Users, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Certificates Issued", value: totalCerts, icon: Award, color: "text-amber-500 bg-amber-500/10" },
          { label: "Avg Quiz Score", value: `${avgScore}%`, icon: Target, color: "text-blue-500 bg-blue-500/10" },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-primary bg-primary/10" },
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

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
        <Button size="sm"><UserPlus className="h-3.5 w-3.5 mr-1" /> Invite</Button>
      </div>

      {/* Student Cards */}
      <div className="space-y-3">
        {filteredStudents.map(student => {
          const avgCourseProgress = Math.round(student.courses.reduce((s, c) => s + c.progress, 0) / student.courses.length);
          const totalQuizzes = student.courses.reduce((s, c) => s + c.quizzes.length, 0);
          const avgStudentScore = totalQuizzes > 0
            ? Math.round(student.courses.flatMap(c => c.quizzes).reduce((s, q) => s + q.score, 0) / totalQuizzes)
            : 0;
          const certs = student.courses.filter(c => c.certificateEarned).length;
          const completedCourses = student.courses.filter(c => c.progress === 100).length;

          return (
            <Card
              key={student.id}
              className="hover:shadow-md transition-all cursor-pointer group"
              onClick={() => { setSelectedStudent(student); setDetailTab("overview"); }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl shrink-0">
                    {student.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{student.name}</h3>
                      <Badge variant={student.status === "active" ? "default" : "secondary"} className="text-[9px]">{student.status}</Badge>
                      {student.streak > 0 && <Badge variant="outline" className="text-[9px] gap-0.5">🔥 {student.streak}d</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{student.email} · Joined {student.joined}</p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <Progress value={avgCourseProgress} className="h-2 flex-1 max-w-[200px]" />
                      <span className="text-xs font-bold text-primary">{avgCourseProgress}%</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-4 shrink-0 text-center">
                    <div>
                      <p className="text-sm font-bold">{student.courses.length}</p>
                      <p className="text-[10px] text-muted-foreground">Courses</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{completedCourses}</p>
                      <p className="text-[10px] text-muted-foreground">Completed</p>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${avgStudentScore >= 80 ? "text-emerald-600" : avgStudentScore >= 60 ? "text-amber-600" : "text-destructive"}`}>
                        {avgStudentScore}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">Avg Score</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold flex items-center gap-0.5 justify-center">
                        <Trophy className="h-3 w-3 text-amber-500" /> {certs}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Certs</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{student.totalTimeSpent}</p>
                      <p className="text-[10px] text-muted-foreground">Time</p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentProgressDashboard;
