import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Trophy, Star, Zap, Target, Award, Crown, Flame, Medal,
  TrendingUp, Search, ChevronUp, Gift, BookOpen, MessageSquare,
  CheckCircle2, Clock, Users, Shield, Gem, Rocket
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ─── Types ───
type BadgeItem = {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "learning" | "social" | "achievement" | "special";
  xpReward: number;
  earned: boolean;
  earnedDate?: string;
  requirement: string;
  rarity: "common" | "rare" | "epic" | "legendary";
};

type Achievement = {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  xpReward: number;
  completed: boolean;
  icon: string;
  category: string;
};

type LeaderboardEntry = {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  badges: number;
  streak: number;
  change: number; // rank change
};

// ─── Mock Data ───
const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Mohammed Khalid", avatar: "MK", xp: 12450, level: 25, badges: 18, streak: 32, change: 0 },
  { rank: 2, name: "Ahmed Al-Rashid", avatar: "AR", xp: 11200, level: 23, badges: 15, streak: 28, change: 1 },
  { rank: 3, name: "Layla Hassan", avatar: "LH", xp: 10800, level: 22, badges: 14, streak: 21, change: -1 },
  { rank: 4, name: "Sarah Johnson", avatar: "SJ", xp: 9500, level: 20, badges: 12, streak: 15, change: 2 },
  { rank: 5, name: "Fatima Noor", avatar: "FN", xp: 8200, level: 18, badges: 10, streak: 12, change: 0 },
  { rank: 6, name: "James Wilson", avatar: "JW", xp: 7100, level: 16, badges: 8, streak: 7, change: -2 },
  { rank: 7, name: "Nora Al-Saud", avatar: "NS", xp: 6500, level: 14, badges: 7, streak: 10, change: 1 },
  { rank: 8, name: "Omar Farooq", avatar: "OF", xp: 5800, level: 13, badges: 6, streak: 5, change: -1 },
  { rank: 9, name: "Aisha Rahman", avatar: "AR", xp: 5200, level: 12, badges: 5, streak: 8, change: 3 },
  { rank: 10, name: "David Chen", avatar: "DC", xp: 4900, level: 11, badges: 4, streak: 3, change: -1 },
];

const badgesList: BadgeItem[] = [
  { id: "b1", name: "First Steps", icon: "👣", description: "Complete your first lesson", category: "learning", xpReward: 50, earned: true, earnedDate: "2025-01-15", requirement: "Complete 1 lesson", rarity: "common" },
  { id: "b2", name: "Quick Learner", icon: "⚡", description: "Complete 10 lessons in a week", category: "learning", xpReward: 200, earned: true, earnedDate: "2025-01-22", requirement: "10 lessons/week", rarity: "rare" },
  { id: "b3", name: "Quiz Master", icon: "🧠", description: "Score 100% on 5 quizzes", category: "achievement", xpReward: 300, earned: true, earnedDate: "2025-02-01", requirement: "5 perfect quizzes", rarity: "epic" },
  { id: "b4", name: "Social Butterfly", icon: "🦋", description: "Post 20 forum replies", category: "social", xpReward: 150, earned: true, earnedDate: "2025-02-05", requirement: "20 forum replies", rarity: "rare" },
  { id: "b5", name: "Streak Champion", icon: "🔥", description: "Maintain a 30-day learning streak", category: "achievement", xpReward: 500, earned: false, requirement: "30-day streak", rarity: "legendary" },
  { id: "b6", name: "Course Conqueror", icon: "🏆", description: "Complete 5 courses", category: "learning", xpReward: 400, earned: false, requirement: "Complete 5 courses", rarity: "epic" },
  { id: "b7", name: "Helping Hand", icon: "🤝", description: "Get 10 Best Answer awards", category: "social", xpReward: 350, earned: false, requirement: "10 best answers", rarity: "epic" },
  { id: "b8", name: "Night Owl", icon: "🦉", description: "Study for 2+ hours after midnight", category: "special", xpReward: 100, earned: true, earnedDate: "2025-01-28", requirement: "Late night study", rarity: "common" },
  { id: "b9", name: "Perfectionist", icon: "💎", description: "Achieve 95%+ avg across all courses", category: "achievement", xpReward: 600, earned: false, requirement: "95%+ overall avg", rarity: "legendary" },
  { id: "b10", name: "Welcome!", icon: "👋", description: "Join the learning community", category: "special", xpReward: 25, earned: true, earnedDate: "2025-01-10", requirement: "Create account", rarity: "common" },
  { id: "b11", name: "Mentor", icon: "🎓", description: "Help 50 students in forums", category: "social", xpReward: 500, earned: false, requirement: "50 helpful replies", rarity: "legendary" },
  { id: "b12", name: "Speed Runner", icon: "🏃", description: "Complete a course in under 3 days", category: "learning", xpReward: 250, earned: false, requirement: "Course in 3 days", rarity: "rare" },
];

const achievements: Achievement[] = [
  { id: "a1", name: "Lesson Marathon", description: "Complete 100 lessons", progress: 72, total: 100, xpReward: 500, completed: false, icon: "📚", category: "Learning" },
  { id: "a2", name: "Quiz Streak", description: "Pass 20 quizzes in a row", progress: 14, total: 20, xpReward: 400, completed: false, icon: "✅", category: "Assessment" },
  { id: "a3", name: "Community Leader", description: "Receive 100 upvotes on forum posts", progress: 67, total: 100, xpReward: 350, completed: false, icon: "👑", category: "Social" },
  { id: "a4", name: "Certificate Collector", description: "Earn 5 certificates", progress: 3, total: 5, xpReward: 300, completed: false, icon: "🏅", category: "Achievement" },
  { id: "a5", name: "Daily Dedication", description: "Log in for 60 consecutive days", progress: 28, total: 60, xpReward: 600, completed: false, icon: "📅", category: "Consistency" },
  { id: "a6", name: "Video Scholar", description: "Watch 50 hours of video content", progress: 50, total: 50, xpReward: 400, completed: true, icon: "🎬", category: "Learning" },
  { id: "a7", name: "First Blood", description: "Complete your first course", progress: 1, total: 1, xpReward: 200, completed: true, icon: "🎯", category: "Achievement" },
  { id: "a8", name: "Polyglot Learner", description: "Enroll in 3 different categories", progress: 3, total: 3, xpReward: 250, completed: true, icon: "🌍", category: "Exploration" },
];

const rarityColors: Record<string, string> = {
  common: "bg-muted text-muted-foreground border-border",
  rare: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  epic: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  legendary: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
};

const categoryIcons: Record<string, React.ReactNode> = {
  learning: <BookOpen className="h-4 w-4" />,
  social: <MessageSquare className="h-4 w-4" />,
  achievement: <Trophy className="h-4 w-4" />,
  special: <Gem className="h-4 w-4" />,
};

// XP Level calculation
const getLevel = (xp: number) => Math.floor(xp / 500) + 1;
const getXPForNextLevel = (xp: number) => {
  const currentLevel = getLevel(xp);
  return currentLevel * 500;
};
const getXPProgress = (xp: number) => {
  const prevLevelXP = (getLevel(xp) - 1) * 500;
  const nextLevelXP = getLevel(xp) * 500;
  return ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
};

const GamificationDashboard = () => {
  const [subTab, setSubTab] = useState("overview");
  const [searchBadge, setSearchBadge] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<"all" | "earned" | "locked">("all");
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"weekly" | "monthly" | "alltime">("monthly");

  // Current user mock
  const currentUserXP = 11200;
  const currentUserLevel = getLevel(currentUserXP);
  const xpProgress = getXPProgress(currentUserXP);
  const earnedBadges = badgesList.filter(b => b.earned);
  const completedAchievements = achievements.filter(a => a.completed);
  const totalXPFromBadges = earnedBadges.reduce((s, b) => s + b.xpReward, 0);

  const filteredBadges = badgesList.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchBadge.toLowerCase()) || b.description.toLowerCase().includes(searchBadge.toLowerCase());
    const matchFilter = badgeFilter === "all" || (badgeFilter === "earned" ? b.earned : !b.earned);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      {/* XP Overview Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-amber-500/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Level Circle */}
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <div className="h-16 w-16 rounded-full bg-card flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground font-medium">LVL</span>
                  <span className="text-2xl font-bold text-foreground">{currentUserLevel}</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-500 text-amber-950 rounded-full h-6 w-6 flex items-center justify-center">
                <Flame className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* XP Info */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-foreground">Ahmed Al-Rashid</h3>
                <Badge className="bg-primary/15 text-primary border-primary/30 gap-1">
                  <Zap className="h-3 w-3" /> {currentUserXP.toLocaleString()} XP
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Flame className="h-3 w-3 text-orange-500" /> 28 day streak
                </Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level {currentUserLevel} → Level {currentUserLevel + 1}</span>
                  <span className="font-medium text-foreground">{currentUserXP.toLocaleString()} / {getXPForNextLevel(currentUserXP).toLocaleString()} XP</span>
                </div>
                <Progress value={xpProgress} className="h-3" />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground"><Trophy className="h-3.5 w-3.5 inline mr-1 text-amber-500" />{earnedBadges.length} badges</span>
                <span className="text-muted-foreground"><Target className="h-3.5 w-3.5 inline mr-1 text-emerald-500" />{completedAchievements.length} achievements</span>
                <span className="text-muted-foreground"><Star className="h-3.5 w-3.5 inline mr-1 text-primary" />{totalXPFromBadges} XP from badges</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Rank", value: "#2", icon: Crown, color: "text-amber-500 bg-amber-500/10" },
                { label: "This Week", value: "+480 XP", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub Tabs */}
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList>
          <TabsTrigger value="overview"><Zap className="h-4 w-4 mr-1.5" />Overview</TabsTrigger>
          <TabsTrigger value="leaderboard"><Crown className="h-4 w-4 mr-1.5" />Leaderboard</TabsTrigger>
          <TabsTrigger value="badges"><Medal className="h-4 w-4 mr-1.5" />Badges</TabsTrigger>
          <TabsTrigger value="achievements"><Target className="h-4 w-4 mr-1.5" />Achievements</TabsTrigger>
        </TabsList>

        {/* ─── Overview ─── */}
        <TabsContent value="overview">
          <div className="space-y-4">
            {/* XP Activity Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total XP Earned", value: currentUserXP.toLocaleString(), icon: Zap, color: "text-primary bg-primary/10", sub: "+480 this week" },
                { label: "Badges Earned", value: `${earnedBadges.length}/${badgesList.length}`, icon: Medal, color: "text-amber-500 bg-amber-500/10", sub: `${badgesList.length - earnedBadges.length} remaining` },
                { label: "Achievements", value: `${completedAchievements.length}/${achievements.length}`, icon: Target, color: "text-emerald-500 bg-emerald-500/10", sub: "3 in progress" },
                { label: "Global Rank", value: "#2", icon: Crown, color: "text-purple-500 bg-purple-500/10", sub: "Top 5%" },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} mb-2`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">{s.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent XP Activity + Top Leaderboard Preview */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Recent XP Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: "Completed lesson: React Hooks", xp: 50, time: "2 hours ago", icon: "📖" },
                    { action: "Quiz passed: JavaScript Basics", xp: 100, time: "5 hours ago", icon: "✅" },
                    { action: "Forum reply upvoted (x5)", xp: 25, time: "1 day ago", icon: "👍" },
                    { action: "Badge earned: Quick Learner", xp: 200, time: "2 days ago", icon: "⚡" },
                    { action: "Daily login streak: Day 28", xp: 15, time: "Today", icon: "🔥" },
                    { action: "Completed course: UI/UX Design", xp: 300, time: "3 days ago", icon: "🎉" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5">
                      <span className="text-lg">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.action}</p>
                        <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">+{activity.xp} XP</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Crown className="h-4 w-4 text-amber-500" /> Top 5 Leaderboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leaderboardData.slice(0, 5).map((entry) => (
                    <div key={entry.rank} className={`flex items-center gap-3 rounded-lg p-2.5 ${entry.rank <= 3 ? "border border-amber-500/20 bg-amber-500/5" : "border border-border/60"}`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                        entry.rank === 1 ? "bg-amber-500 text-amber-950" :
                        entry.rank === 2 ? "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200" :
                        entry.rank === 3 ? "bg-orange-400 text-orange-950" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {entry.rank}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {entry.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.name}</p>
                        <p className="text-[10px] text-muted-foreground">Level {entry.level} · {entry.badges} badges</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{entry.xp.toLocaleString()} XP</p>
                        <div className="flex items-center justify-end gap-0.5">
                          {entry.change > 0 && <ChevronUp className="h-3 w-3 text-emerald-500" />}
                          {entry.change < 0 && <ChevronUp className="h-3 w-3 text-destructive rotate-180" />}
                          {entry.change !== 0 && <span className={`text-[10px] ${entry.change > 0 ? "text-emerald-500" : "text-destructive"}`}>{Math.abs(entry.change)}</span>}
                          {entry.change === 0 && <span className="text-[10px] text-muted-foreground">—</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" size="sm" onClick={() => setSubTab("leaderboard")}>
                    View Full Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Near Completion Badges */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /> Almost There!</CardTitle>
                <CardDescription>Badges and achievements you're close to earning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {achievements.filter(a => !a.completed && a.progress / a.total > 0.5).map(a => (
                    <div key={a.id} className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{a.icon}</span>
                        <div>
                          <p className="text-sm font-semibold">{a.name}</p>
                          <p className="text-[10px] text-muted-foreground">{a.description}</p>
                        </div>
                      </div>
                      <Progress value={(a.progress / a.total) * 100} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{a.progress}/{a.total}</span>
                        <Badge variant="outline" className="text-[9px]">+{a.xpReward} XP</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Leaderboard ─── */}
        <TabsContent value="leaderboard">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {(["weekly", "monthly", "alltime"] as const).map(p => (
                  <Button key={p} variant={leaderboardPeriod === p ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setLeaderboardPeriod(p)}>
                    {p === "weekly" ? "This Week" : p === "monthly" ? "This Month" : "All Time"}
                  </Button>
                ))}
              </div>
              <Badge variant="outline" className="gap-1"><Users className="h-3 w-3" /> {leaderboardData.length} students</Badge>
            </div>

            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-4 py-4">
              {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((entry, idx) => {
                const podiumOrder = [2, 1, 3];
                const heights = ["h-24", "h-32", "h-20"];
                const colors = ["bg-gray-300 dark:bg-gray-600", "bg-amber-500", "bg-orange-400"];
                return (
                  <div key={entry.rank} className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border-2 border-primary/30">
                      {entry.avatar}
                    </div>
                    <p className="text-xs font-semibold text-center max-w-[80px] truncate">{entry.name}</p>
                    <p className="text-[10px] text-muted-foreground">{entry.xp.toLocaleString()} XP</p>
                    <div className={`${heights[idx]} w-20 ${colors[idx]} rounded-t-lg flex items-start justify-center pt-2`}>
                      <span className="text-lg font-bold text-white">#{podiumOrder[idx]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Level</TableHead>
                      <TableHead className="text-center">XP</TableHead>
                      <TableHead className="text-center">Badges</TableHead>
                      <TableHead className="text-center">Streak</TableHead>
                      <TableHead className="text-center">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map(entry => (
                      <TableRow key={entry.rank} className={entry.rank === 2 ? "bg-primary/5" : ""}>
                        <TableCell>
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            entry.rank === 1 ? "bg-amber-500 text-amber-950" :
                            entry.rank === 2 ? "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200" :
                            entry.rank === 3 ? "bg-orange-400 text-orange-950" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {entry.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{entry.avatar}</div>
                            <span className="font-medium text-sm">{entry.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="text-[10px]">Lv. {entry.level}</Badge></TableCell>
                        <TableCell className="text-center font-semibold text-primary">{entry.xp.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{entry.badges}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="gap-1 text-[10px]"><Flame className="h-3 w-3 text-orange-500" />{entry.streak}d</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.change > 0 && <span className="text-emerald-500 text-sm flex items-center justify-center gap-0.5"><ChevronUp className="h-3.5 w-3.5" />{entry.change}</span>}
                          {entry.change < 0 && <span className="text-destructive text-sm flex items-center justify-center gap-0.5"><ChevronUp className="h-3.5 w-3.5 rotate-180" />{Math.abs(entry.change)}</span>}
                          {entry.change === 0 && <span className="text-muted-foreground text-sm">—</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Badges ─── */}
        <TabsContent value="badges">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search badges..." className="pl-9" value={searchBadge} onChange={e => setSearchBadge(e.target.value)} />
              </div>
              <div className="flex gap-1">
                {(["all", "earned", "locked"] as const).map(f => (
                  <Button key={f} variant={badgeFilter === f ? "default" : "outline"} size="sm" className="text-xs capitalize" onClick={() => setBadgeFilter(f)}>
                    {f === "all" ? `All (${badgesList.length})` : f === "earned" ? `Earned (${earnedBadges.length})` : `Locked (${badgesList.length - earnedBadges.length})`}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBadges.map(badge => (
                <Card key={badge.id} className={`transition-all ${badge.earned ? "border-emerald-500/20" : "opacity-70 grayscale hover:grayscale-0 hover:opacity-100"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`text-3xl ${!badge.earned && "opacity-50"}`}>{badge.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">{badge.name}</p>
                          <Badge className={`text-[9px] px-1.5 ${rarityColors[badge.rarity]}`}>{badge.rarity}</Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{badge.description}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {categoryIcons[badge.category]}
                          <span className="text-[10px] text-muted-foreground capitalize">{badge.category}</span>
                          <Badge variant="outline" className="text-[9px] gap-0.5"><Zap className="h-2.5 w-2.5" />+{badge.xpReward} XP</Badge>
                        </div>
                        {badge.earned ? (
                          <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-medium">Earned {badge.earnedDate}</span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground mt-2 italic">🔒 {badge.requirement}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ─── Achievements ─── */}
        <TabsContent value="achievements">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{completedAchievements.length} of {achievements.length} completed</p>
              <Badge variant="outline" className="gap-1"><Star className="h-3 w-3 text-amber-500" /> {achievements.filter(a => a.completed).reduce((s, a) => s + a.xpReward, 0)} XP earned</Badge>
            </div>

            <div className="space-y-3">
              {achievements.sort((a, b) => (a.completed === b.completed ? (b.progress / b.total) - (a.progress / a.total) : a.completed ? 1 : -1)).map(achievement => (
                <Card key={achievement.id} className={achievement.completed ? "border-emerald-500/20 bg-emerald-500/5" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl ${achievement.completed ? "" : "opacity-60"}`}>{achievement.icon}</div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{achievement.name}</p>
                            <Badge variant="outline" className="text-[9px]">{achievement.category}</Badge>
                          </div>
                          <Badge variant="outline" className="gap-0.5 text-[9px]"><Zap className="h-2.5 w-2.5" />+{achievement.xpReward} XP</Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-3">
                          <Progress value={(achievement.progress / achievement.total) * 100} className="h-2 flex-1" />
                          <span className="text-xs font-medium text-muted-foreground">{achievement.progress}/{achievement.total}</span>
                          {achievement.completed && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
