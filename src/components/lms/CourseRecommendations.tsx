import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles, BookOpen, Star, Clock, Users, TrendingUp, Target,
  Search, Filter, ChevronRight, Zap, Award, BarChart3, Heart,
  ThumbsUp, Eye, Play, GraduationCap, Lightbulb, Compass,
  Brain, RefreshCw, ArrowRight, Cpu, LineChart, Flame, Shield,
  Rocket, MessageCircle, Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addNotification } from "@/data/notifications";

// ─── Types ───
type RecommendedCourse = {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  matchScore: number; // 0-100
  matchReasons: string[];
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
};

type StudentProfile = {
  completedCourses: string[];
  interests: string[];
  strongSkills: string[];
  weakSkills: string[];
  preferredLevel: string;
  avgScore: number;
  learningGoal: string;
};

// ─── Mock Student Profile ───
const studentProfile: StudentProfile = {
  completedCourses: ["Web Development Bootcamp", "UI/UX Design Masterclass"],
  interests: ["Programming", "Data", "AI", "Design"],
  strongSkills: ["HTML/CSS", "JavaScript", "React", "Figma"],
  weakSkills: ["Python", "Data Analysis", "Machine Learning"],
  preferredLevel: "Intermediate",
  avgScore: 88,
  learningGoal: "Become a Full-Stack Developer",
};

// ─── Mock Recommendations ───
const recommendedCourses: RecommendedCourse[] = [
  {
    id: 101, title: "Node.js & Express Backend Mastery", category: "Programming",
    thumbnail: "🔧", instructor: "Dr. Ahmed Hassan", rating: 4.9, students: 2340,
    duration: "32h", price: 54.99, lessons: 48, level: "Intermediate", matchScore: 96,
    matchReasons: ["Complements your React skills", "Aligns with Full-Stack goal", "Next logical step"],
    tags: ["Node.js", "Express", "API", "Backend"], isTrending: true,
  },
  {
    id: 102, title: "Python for Data Science", category: "Data",
    thumbnail: "🐍", instructor: "Dr. Chen Wei", rating: 4.8, students: 1890,
    duration: "40h", price: 59.99, lessons: 52, level: "Beginner", matchScore: 92,
    matchReasons: ["Fills your Python skill gap", "Matches Data interest", "High career demand"],
    tags: ["Python", "Pandas", "NumPy", "Data"], isNew: true,
  },
  {
    id: 103, title: "Advanced React Patterns & Performance", category: "Programming",
    thumbnail: "⚛️", instructor: "Sarah Lee", rating: 4.9, students: 1560,
    duration: "24h", price: 49.99, lessons: 36, level: "Advanced", matchScore: 90,
    matchReasons: ["Builds on your React knowledge", "Advanced patterns for pros", "Portfolio booster"],
    tags: ["React", "Performance", "Patterns", "TypeScript"],
  },
  {
    id: 104, title: "Machine Learning Fundamentals", category: "AI",
    thumbnail: "🤖", instructor: "Prof. Maria Santos", rating: 4.7, students: 2100,
    duration: "36h", price: 64.99, lessons: 44, level: "Intermediate", matchScore: 85,
    matchReasons: ["Addresses ML skill gap", "AI is trending in your field", "Pairs with Python"],
    tags: ["ML", "AI", "TensorFlow", "Scikit-learn"], isTrending: true,
  },
  {
    id: 105, title: "TypeScript Deep Dive", category: "Programming",
    thumbnail: "📘", instructor: "Mark Davis", rating: 4.8, students: 1320,
    duration: "20h", price: 39.99, lessons: 30, level: "Intermediate", matchScore: 88,
    matchReasons: ["Enhances your JS skills", "Essential for modern React", "Industry standard"],
    tags: ["TypeScript", "JavaScript", "Types", "Generics"],
  },
  {
    id: 106, title: "Database Design & PostgreSQL", category: "Data",
    thumbnail: "🗃️", instructor: "Omar Farooq", rating: 4.6, students: 980,
    duration: "28h", price: 44.99, lessons: 38, level: "Intermediate", matchScore: 83,
    matchReasons: ["Critical for Full-Stack goal", "Pairs with Node.js backend", "Fills database gap"],
    tags: ["SQL", "PostgreSQL", "Database", "Schema"],
  },
  {
    id: 107, title: "DevOps & CI/CD Pipelines", category: "DevOps",
    thumbnail: "🚀", instructor: "James Wilson", rating: 4.7, students: 760,
    duration: "22h", price: 49.99, lessons: 28, level: "Intermediate", matchScore: 78,
    matchReasons: ["Completes Full-Stack toolkit", "Deploy your apps professionally", "High demand skill"],
    tags: ["Docker", "CI/CD", "AWS", "DevOps"], isNew: true,
  },
  {
    id: 108, title: "Motion Design with Framer Motion", category: "Design",
    thumbnail: "✨", instructor: "Layla Hassan", rating: 4.8, students: 540,
    duration: "16h", price: 34.99, lessons: 22, level: "Intermediate", matchScore: 75,
    matchReasons: ["Builds on UI/UX knowledge", "Enhance React apps with animation", "Creative edge"],
    tags: ["Animation", "Framer Motion", "React", "Design"],
  },
];

const learningPaths = [
  {
    id: "p1", name: "Full-Stack Developer", icon: "🏗️", courses: 5, duration: "~6 months",
    matchScore: 95, description: "Master frontend + backend + database + deployment",
    steps: ["Advanced React", "Node.js & Express", "PostgreSQL", "TypeScript", "DevOps"],
  },
  {
    id: "p2", name: "Data Science Track", icon: "📊", courses: 4, duration: "~4 months",
    matchScore: 82, description: "Python → Data Analysis → ML → Deep Learning",
    steps: ["Python for Data Science", "Data Analysis", "Machine Learning", "Deep Learning"],
  },
  {
    id: "p3", name: "Creative Developer", icon: "🎨", courses: 3, duration: "~3 months",
    matchScore: 70, description: "Combine design + code for stunning interactive experiences",
    steps: ["Motion Design", "Three.js 3D Web", "Creative Coding"],
  },
];

// ─── AI Recommendation Engine (Client-Side) ───
type AIInsight = {
  type: "strength" | "opportunity" | "warning" | "prediction";
  title: string;
  description: string;
  confidence: number;
  action?: string;
  actionCourseId?: number;
};

type WeeklyPlan = {
  day: string;
  activity: string;
  duration: string;
  courseId?: number;
  type: "study" | "practice" | "review" | "rest";
};

function computeSkillAffinity(profile: StudentProfile, course: RecommendedCourse): number {
  let score = 0;
  const skillOverlap = course.tags.filter(t =>
    profile.strongSkills.some(s => s.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(s.toLowerCase()))
  );
  const gapFill = course.tags.filter(t =>
    profile.weakSkills.some(s => s.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(s.toLowerCase()))
  );
  const interestMatch = profile.interests.filter(i =>
    course.category.toLowerCase().includes(i.toLowerCase()) || course.tags.some(t => t.toLowerCase().includes(i.toLowerCase()))
  );

  score += skillOverlap.length * 12; // building on strengths
  score += gapFill.length * 18; // filling gaps is more valuable
  score += interestMatch.length * 10;

  // Level appropriateness
  if (profile.avgScore >= 85 && course.level === "Advanced") score += 15;
  else if (profile.avgScore >= 70 && course.level === "Intermediate") score += 12;
  else if (profile.avgScore < 70 && course.level === "Beginner") score += 10;

  // Goal alignment
  if (profile.learningGoal.toLowerCase().includes("full-stack")) {
    if (["Node.js", "Express", "PostgreSQL", "API", "Backend", "Database"].some(k => course.tags.includes(k))) score += 20;
  }

  // Popularity & quality bonus
  score += (course.rating / 5) * 8;
  score += Math.min(course.students / 500, 5);

  return Math.min(Math.round(score), 100);
}

function generateAIInsights(profile: StudentProfile, courses: RecommendedCourse[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Strength analysis
  if (profile.strongSkills.length >= 3) {
    insights.push({
      type: "strength",
      title: "Strong Foundation Detected",
      description: `আপনার ${profile.strongSkills.slice(0, 3).join(", ")} skills excellent। এই foundation থেকে advanced courses-এ যাওয়ার সেরা সময়।`,
      confidence: 92,
    });
  }

  // Skill gap warning
  const criticalGaps = profile.weakSkills.filter(s =>
    profile.learningGoal.toLowerCase().includes("full-stack") &&
    ["python", "backend", "database", "node", "sql"].some(k => s.toLowerCase().includes(k))
  );
  if (criticalGaps.length > 0) {
    const gapCourse = courses.find(c => c.tags.some(t => criticalGaps.some(g => g.toLowerCase().includes(t.toLowerCase()))));
    insights.push({
      type: "warning",
      title: "Critical Skill Gap",
      description: `"${profile.learningGoal}" goal-এর জন্য ${criticalGaps[0]} দরকার — এখনই শুরু করুন!`,
      confidence: 88,
      action: gapCourse ? `Start ${gapCourse.title}` : undefined,
      actionCourseId: gapCourse?.id,
    });
  }

  // Learning velocity prediction
  insights.push({
    type: "prediction",
    title: "Learning Velocity Forecast",
    description: `আপনার ${profile.avgScore}% avg score এবং ${profile.completedCourses.length} completed courses-এর ভিত্তিতে, আপনি ${Math.ceil(6 - profile.completedCourses.length * 0.8)} মাসে Full-Stack ready হতে পারবেন।`,
    confidence: 75,
  });

  // Opportunity detection
  const trendingCourses = courses.filter(c => c.isTrending);
  if (trendingCourses.length > 0) {
    insights.push({
      type: "opportunity",
      title: "Trending Topic Match",
      description: `"${trendingCourses[0].title}" এখন trending এবং আপনার interests-এর সাথে match করে — industry demand বাড়ছে!`,
      confidence: 85,
      action: `Explore ${trendingCourses[0].title}`,
      actionCourseId: trendingCourses[0].id,
    });
  }

  // Collaborative filtering simulation
  insights.push({
    type: "opportunity",
    title: "Students Like You Also Learned",
    description: `Similar profile-এর 78% students ${courses[0]?.title || "Advanced React"} শেষ করার পর Node.js শিখেছে — এটা proven path।`,
    confidence: 82,
    action: "View Learning Path",
  });

  // Study pattern suggestion
  insights.push({
    type: "prediction",
    title: "Optimal Study Schedule",
    description: `আপনার performance data অনুযায়ী, সপ্তাহে 4 দিন × 45 মিনিট study সবচেয়ে effective হবে। Weekend-এ longer sessions করুন।`,
    confidence: 70,
  });

  return insights;
}

function generateWeeklyPlan(profile: StudentProfile, topCourse: RecommendedCourse | null): WeeklyPlan[] {
  const courseName = topCourse?.title || "Recommended Course";
  return [
    { day: "Saturday", activity: `${courseName} — Lessons 1-3`, duration: "60 min", courseId: topCourse?.id, type: "study" },
    { day: "Sunday", activity: "Practice exercises & coding challenges", duration: "45 min", type: "practice" },
    { day: "Monday", activity: `${courseName} — Lessons 4-5`, duration: "45 min", courseId: topCourse?.id, type: "study" },
    { day: "Tuesday", activity: "Review notes & flashcards", duration: "30 min", type: "review" },
    { day: "Wednesday", activity: `${courseName} — Lessons 6-7 + Quiz`, duration: "50 min", courseId: topCourse?.id, type: "study" },
    { day: "Thursday", activity: "Mini project / hands-on practice", duration: "60 min", type: "practice" },
    { day: "Friday", activity: "Rest & reflection", duration: "—", type: "rest" },
  ];
}

const CourseRecommendations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"match" | "rating" | "popular" | "newest">("match");
  const [savedCourses, setSavedCourses] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"recommendations" | "paths" | "skills" | "ai-insights">("recommendations");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // AI-enhanced scores
  const aiScoredCourses = useMemo(() =>
    recommendedCourses.map(c => ({
      ...c,
      aiScore: computeSkillAffinity(studentProfile, c),
    })).sort((a, b) => b.aiScore - a.aiScore),
    []
  );

  const aiInsights = useMemo(() =>
    generateAIInsights(studentProfile, recommendedCourses),
    []
  );

  const weeklyPlan = useMemo(() =>
    generateWeeklyPlan(studentProfile, aiScoredCourses[0] || null),
    [aiScoredCourses]
  );

  const runAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({ title: "AI Analysis Complete! 🧠", description: "Personalized insights generated based on your learning data." });
    }, 2500);
  }, []);

  const categories = [...new Set(recommendedCourses.map(c => c.category))];

  const filteredCourses = recommendedCourses
    .filter(c => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = categoryFilter === "all" || c.category === categoryFilter;
      const matchLevel = levelFilter === "all" || c.level === levelFilter;
      return matchSearch && matchCat && matchLevel;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popular") return b.students - a.students;
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });

  const toggleSave = (id: number) => {
    setSavedCourses(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    toast({
      title: savedCourses.includes(id) ? "Removed from wishlist" : "Added to wishlist! ❤️",
      description: savedCourses.includes(id) ? "Course removed from your saved list." : "We'll notify you about updates and discounts.",
    });
  };

  return (
    <div className="space-y-5">
      {/* Student Profile Summary */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Personalized For You</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your progress in <strong>{studentProfile.completedCourses.length} courses</strong>,
                your <strong>{studentProfile.avgScore}% average score</strong>,
                and your goal: <Badge variant="outline" className="ml-1">{studentProfile.learningGoal}</Badge>
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Your interests:</span>
                {studentProfile.interests.map(i => (
                  <Badge key={i} variant="secondary" className="text-[10px]">{i}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                <p className="text-xl font-bold text-primary">{recommendedCourses.length}</p>
                <p className="text-[10px] text-muted-foreground">Recommendations</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{learningPaths.length}</p>
                <p className="text-[10px] text-muted-foreground">Learning Paths</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Switcher */}
      <div className="flex items-center gap-2 flex-wrap">
        {([
          { id: "recommendations", label: "Recommended", icon: Sparkles },
          { id: "ai-insights", label: "AI Insights", icon: Brain },
          { id: "paths", label: "Learning Paths", icon: Compass },
          { id: "skills", label: "Skill Gap", icon: Target },
        ] as const).map(v => (
          <Button
            key={v.id}
            variant={viewMode === v.id ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setViewMode(v.id);
              if (v.id === "ai-insights" && !analysisComplete) runAnalysis();
            }}
          >
            <v.icon className="h-4 w-4" /> {v.label}
          </Button>
        ))}
      </div>

      {/* ─── Recommended Courses View ─── */}
      {viewMode === "recommendations" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses or skills..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCourses.map(course => (
              <Card key={course.id} className="group hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="text-4xl flex-shrink-0">{course.thumbnail}</div>
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-foreground">{course.title}</h4>
                            {course.isNew && <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px]">New</Badge>}
                            {course.isTrending && <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 text-[9px]">🔥 Trending</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{course.instructor} · {course.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => toggleSave(course.id)}
                        >
                          <Heart className={`h-4 w-4 ${savedCourses.includes(course.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                        </Button>
                      </div>

                      {/* Match Score */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-bold text-primary">{course.matchScore}% match</span>
                        </div>
                        <Progress value={course.matchScore} className="h-1.5 flex-1 max-w-[100px]" />
                      </div>

                      {/* Match Reasons */}
                      <div className="space-y-1">
                        {course.matchReasons.map((reason, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Lightbulb className="h-3 w-3 text-amber-500 shrink-0" />
                            {reason}
                          </div>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{course.rating}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lessons} lessons</span>
                        <Badge variant="outline" className="text-[9px] h-4">{course.level}</Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {course.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[9px] px-1.5">{tag}</Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-bold text-foreground">${course.price}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                            <Eye className="h-3 w-3" /> Preview
                          </Button>
                          <Button size="sm" className="text-xs h-7 gap-1" onClick={() => {
                            toast({ title: "Enrolled! 🎉", description: `You've enrolled in "${course.title}". Start learning now!` });
                            addNotification("Course Enrolled! 📚", `আপনি "${course.title}" কোর্সে enroll করেছেন`, "lms-course");
                          }}>
                            <Play className="h-3 w-3" /> Enroll
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── Learning Paths View ─── */}
      {viewMode === "paths" && (
        <div className="space-y-4">
          {learningPaths.map(path => (
            <Card key={path.id} className="hover:border-primary/30 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{path.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-foreground">{path.name}</h4>
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] gap-1">
                            <Sparkles className="h-3 w-3" />{path.matchScore}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{path.description}</p>
                      </div>
                    </div>

                    {/* Path Steps */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {path.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1">
                            <span className="text-xs font-medium">{step}</span>
                          </div>
                          {i < path.steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{path.courses} courses</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{path.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Progress value={path.matchScore} className="h-2 w-24" />
                    <Button size="sm" className="gap-1" onClick={() => {
                      toast({ title: "Path started! 🚀", description: `You've started the "${path.name}" learning path.` });
                    }}>
                      <Compass className="h-3.5 w-3.5" /> Start Path
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Skill Gap Analysis View ─── */}
      {viewMode === "skills" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Strong Skills */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-emerald-500" /> Your Strong Skills
                </CardTitle>
                <CardDescription>Skills you've demonstrated through course performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { skill: "HTML/CSS", level: 92, courses: 1 },
                  { skill: "JavaScript", level: 88, courses: 1 },
                  { skill: "React", level: 85, courses: 1 },
                  { skill: "Figma", level: 80, courses: 1 },
                  { skill: "Responsive Design", level: 78, courses: 2 },
                ].map(s => (
                  <div key={s.skill} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.skill}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{s.level}%</span>
                    </div>
                    <Progress value={s.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skill Gaps */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-500" /> Skill Gaps to Fill
                </CardTitle>
                <CardDescription>Skills needed for your goal: {studentProfile.learningGoal}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { skill: "Python", level: 15, recommended: "Python for Data Science", matchId: 102 },
                  { skill: "Backend (Node.js)", level: 10, recommended: "Node.js & Express Backend", matchId: 101 },
                  { skill: "Database/SQL", level: 20, recommended: "Database Design & PostgreSQL", matchId: 106 },
                  { skill: "TypeScript", level: 35, recommended: "TypeScript Deep Dive", matchId: 105 },
                  { skill: "DevOps/CI-CD", level: 5, recommended: "DevOps & CI/CD Pipelines", matchId: 107 },
                ].map(s => (
                  <div key={s.skill} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.skill}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{s.level}%</span>
                    </div>
                    <Progress value={s.level} className="h-2" />
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Lightbulb className="h-3 w-3 text-primary" />
                      Recommended: <span className="font-medium text-primary">{s.recommended}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Goal Progress */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" /> Goal Progress: {studentProfile.learningGoal}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall readiness</span>
                  <span className="text-sm font-bold text-primary">42%</span>
                </div>
                <Progress value={42} className="h-3" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {[
                    { label: "Frontend", value: 85, icon: "🖥️", status: "Strong" },
                    { label: "Backend", value: 10, icon: "⚙️", status: "Needs work" },
                    { label: "Database", value: 20, icon: "🗃️", status: "Needs work" },
                    { label: "DevOps", value: 5, icon: "🚀", status: "Not started" },
                  ].map(area => (
                    <div key={area.label} className="rounded-xl border border-border/60 p-3 text-center space-y-1.5">
                      <span className="text-xl">{area.icon}</span>
                      <p className="text-xs font-semibold">{area.label}</p>
                      <Progress value={area.value} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground">{area.value}% · {area.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── AI Insights View ─── */}
      {viewMode === "ai-insights" && (
        <div className="space-y-4">
          {/* Analysis Status */}
          {isAnalyzing && (
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <div className="text-center">
                  <h3 className="font-bold text-foreground">AI Analyzing Your Learning Data...</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Progress data, skill gaps, এবং course catalog analyze করা হচ্ছে
                  </p>
                </div>
                <div className="flex gap-2">
                  {["📊 Data Collection", "🧠 Pattern Analysis", "💡 Generating Insights"].map((step, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] animate-pulse">{step}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysisComplete && (
            <>
              {/* AI Header */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">AI-Powered Analysis</h3>
                        <p className="text-xs text-muted-foreground">
                          Weighted scoring algorithm · Collaborative filtering · Skill gap analysis
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={runAnalysis}>
                      <RefreshCw className="h-3.5 w-3.5" /> Re-analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {aiInsights.map((insight, i) => {
                  const iconMap = {
                    strength: { icon: Shield, color: "text-emerald-500 bg-emerald-500/10", border: "border-emerald-500/20" },
                    opportunity: { icon: Rocket, color: "text-blue-500 bg-blue-500/10", border: "border-blue-500/20" },
                    warning: { icon: Flame, color: "text-amber-500 bg-amber-500/10", border: "border-amber-500/20" },
                    prediction: { icon: LineChart, color: "text-purple-500 bg-purple-500/10", border: "border-purple-500/20" },
                  };
                  const config = iconMap[insight.type];
                  const Icon = config.icon;

                  return (
                    <Card key={i} className={`${config.border} transition-all hover:shadow-md`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground">{insight.title}</h4>
                              <Badge variant="outline" className="text-[9px] mt-0.5">
                                {insight.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[9px] capitalize">{insight.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                        {insight.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs w-full"
                            onClick={() => {
                              toast({ title: "Action taken! ✨", description: insight.action });
                            }}
                          >
                            <ArrowRight className="h-3 w-3" /> {insight.action}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* AI-Scored Course Rankings */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" /> AI-Ranked Course Priorities
                  </CardTitle>
                  <CardDescription>
                    Weighted scoring: skill affinity (30%) + gap fill (35%) + goal alignment (20%) + quality (15%)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiScoredCourses.slice(0, 5).map((course, i) => (
                    <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/30 transition-all">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        #{i + 1}
                      </div>
                      <span className="text-2xl">{course.thumbnail}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{course.title}</h4>
                        <p className="text-[11px] text-muted-foreground">{course.instructor} · {course.level}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{course.aiScore}%</p>
                          <p className="text-[9px] text-muted-foreground">AI Score</p>
                        </div>
                        <Progress value={course.aiScore} className="h-2 w-16" />
                      </div>
                      <Button size="sm" className="text-xs h-7 gap-1 shrink-0" onClick={() => {
                        toast({ title: "Enrolled! 🎉", description: `"${course.title}" — AI recommended priority #${i + 1}` });
                        addNotification("AI Course Started! 🤖", `AI priority #${i + 1}: "${course.title}" শুরু করেছেন`, "lms-course");
                      }}>
                        <Play className="h-3 w-3" /> Start
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly Study Plan */}
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> AI-Generated Weekly Plan
                  </CardTitle>
                  <CardDescription>আপনার learning pattern অনুযায়ী optimized study schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {weeklyPlan.map((plan, i) => {
                      const typeConfig = {
                        study: { color: "bg-primary/10 text-primary border-primary/20", icon: BookOpen },
                        practice: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: Zap },
                        review: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: RefreshCw },
                        rest: { color: "bg-muted text-muted-foreground border-border", icon: Star },
                      };
                      const cfg = typeConfig[plan.type];
                      const TypeIcon = cfg.icon;
                      return (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.color} transition-all`}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/80">
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{plan.day}</p>
                            <p className="text-[11px] opacity-80">{plan.activity}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{plan.duration}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseRecommendations;
