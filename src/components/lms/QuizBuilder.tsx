import { useState, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Trash2, GripVertical, CheckCircle2, XCircle, Edit,
  Play, RotateCcw, Clock, Award, Target, Zap, FileText,
  ChevronDown, ChevronUp, Copy, Eye, Save, Settings,
  ArrowRight, ArrowLeft, Trophy, Star, BarChart3, Loader2,
  CircleDot, ToggleLeft, Type, Move, History, TrendingUp,
  Calendar, Users, PieChart, Download
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addNotification } from "@/data/notifications";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RPieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

// ─── Types ───
type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "drag-drop";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type DragDropPair = {
  id: string;
  item: string;
  target: string;
};

type Question = {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  options?: Option[];
  correctAnswer?: string;
  trueFalseAnswer?: boolean;
  pairs?: DragDropPair[];
  explanation?: string;
  timeLimit?: number;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  course: string;
  timeLimit: number;
  passingScore: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  allowRetake: boolean;
  maxRetakes: number;
  questions: Question[];
  status: "draft" | "published";
};

type QuizAttempt = {
  answers: Record<string, string | boolean | Record<string, string>>;
  score: number;
  totalPoints: number;
  passed: boolean;
  timeSpent: number;
  questionResults: Record<string, boolean>;
};

type AttemptRecord = {
  id: string;
  quizId: string;
  quizTitle: string;
  date: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  questionResults: Record<string, boolean>;
};

// ─── Helper ───
const genId = () => Math.random().toString(36).slice(2, 9);

// ─── Mock Quizzes ───
const initialQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of core JavaScript concepts",
    course: "Web Development Bootcamp",
    timeLimit: 15,
    passingScore: 70,
    shuffleQuestions: true,
    showResults: true,
    allowRetake: true,
    maxRetakes: 3,
    status: "published",
    questions: [
      {
        id: "q1-1", type: "multiple-choice", question: "Which keyword declares a block-scoped variable in JavaScript?",
        points: 10, explanation: "'let' and 'const' are block-scoped, while 'var' is function-scoped.",
        options: [
          { id: "a", text: "var", isCorrect: false },
          { id: "b", text: "let", isCorrect: true },
          { id: "c", text: "function", isCorrect: false },
          { id: "d", text: "define", isCorrect: false },
        ],
      },
      {
        id: "q1-2", type: "true-false", question: "JavaScript is a statically typed language.",
        points: 5, trueFalseAnswer: false, explanation: "JavaScript is dynamically typed.",
      },
      {
        id: "q1-3", type: "fill-blank", question: "The method used to add an element to the end of an array is ___.",
        points: 10, correctAnswer: "push", explanation: "Array.push() adds elements to the end.",
      },
      {
        id: "q1-4", type: "drag-drop", question: "Match the data types with their examples:",
        points: 15,
        pairs: [
          { id: "p1", item: "42", target: "Number" },
          { id: "p2", item: '"hello"', target: "String" },
          { id: "p3", item: "true", target: "Boolean" },
          { id: "p4", item: "null", target: "Null" },
        ],
      },
    ],
  },
  {
    id: "q2",
    title: "UI/UX Design Principles",
    description: "Evaluate your understanding of design fundamentals",
    course: "UI/UX Design Masterclass",
    timeLimit: 10,
    passingScore: 60,
    shuffleQuestions: false,
    showResults: true,
    allowRetake: true,
    maxRetakes: 5,
    status: "published",
    questions: [
      {
        id: "q2-1", type: "multiple-choice", question: "What does UX stand for?",
        points: 5,
        options: [
          { id: "a", text: "User Example", isCorrect: false },
          { id: "b", text: "User Experience", isCorrect: true },
          { id: "c", text: "Universal Exchange", isCorrect: false },
          { id: "d", text: "Usability Expert", isCorrect: false },
        ],
      },
      {
        id: "q2-2", type: "true-false", question: "White space is considered wasted space in UI design.",
        points: 5, trueFalseAnswer: false,
      },
    ],
  },
  {
    id: "q3",
    title: "React Advanced Patterns",
    description: "Draft quiz for advanced React concepts",
    course: "Web Development Bootcamp",
    timeLimit: 20,
    passingScore: 75,
    shuffleQuestions: true,
    showResults: true,
    allowRetake: false,
    maxRetakes: 0,
    status: "draft",
    questions: [],
  },
];

// ─── Mock Attempt History ───
const initialAttemptHistory: AttemptRecord[] = [
  { id: "a1", quizId: "q1", quizTitle: "JavaScript Fundamentals", date: "2026-02-18 14:30", score: 35, totalPoints: 40, percentage: 88, passed: true, timeSpent: 420, questionResults: { "q1-1": true, "q1-2": true, "q1-3": true, "q1-4": false } },
  { id: "a2", quizId: "q1", quizTitle: "JavaScript Fundamentals", date: "2026-02-15 10:15", score: 25, totalPoints: 40, percentage: 63, passed: false, timeSpent: 540, questionResults: { "q1-1": true, "q1-2": false, "q1-3": true, "q1-4": false } },
  { id: "a3", quizId: "q2", quizTitle: "UI/UX Design Principles", date: "2026-02-17 09:00", score: 10, totalPoints: 10, percentage: 100, passed: true, timeSpent: 180, questionResults: { "q2-1": true, "q2-2": true } },
  { id: "a4", quizId: "q1", quizTitle: "JavaScript Fundamentals", date: "2026-02-10 16:45", score: 20, totalPoints: 40, percentage: 50, passed: false, timeSpent: 600, questionResults: { "q1-1": true, "q1-2": false, "q1-3": false, "q1-4": false } },
  { id: "a5", quizId: "q2", quizTitle: "UI/UX Design Principles", date: "2026-02-12 11:30", score: 5, totalPoints: 10, percentage: 50, passed: false, timeSpent: 300, questionResults: { "q2-1": true, "q2-2": false } },
  { id: "a6", quizId: "q1", quizTitle: "JavaScript Fundamentals", date: "2026-02-05 13:00", score: 30, totalPoints: 40, percentage: 75, passed: true, timeSpent: 480, questionResults: { "q1-1": true, "q1-2": true, "q1-3": true, "q1-4": false } },
];

// ─── Question Type Config ───
const questionTypeConfig: Record<QuestionType, { label: string; icon: typeof CircleDot; color: string }> = {
  "multiple-choice": { label: "Multiple Choice", icon: CircleDot, color: "text-primary bg-primary/10" },
  "true-false": { label: "True / False", icon: ToggleLeft, color: "text-emerald-500 bg-emerald-500/10" },
  "fill-blank": { label: "Fill in the Blank", icon: Type, color: "text-amber-500 bg-amber-500/10" },
  "drag-drop": { label: "Drag & Drop Match", icon: Move, color: "text-purple-500 bg-purple-500/10" },
};

const CHART_COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

// ─── Component ───
const QuizBuilder = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [view, setView] = useState<"list" | "builder" | "preview" | "results" | "history" | "analytics">("list");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Quiz attempt state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | boolean | Record<string, string>>>({});
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Attempt history
  const [attemptHistory, setAttemptHistory] = useState<AttemptRecord[]>(initialAttemptHistory);

  // Drag-and-drop reorder
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // ─── Quiz CRUD ───
  const createNewQuiz = () => {
    const newQuiz: Quiz = {
      id: genId(), title: "Untitled Quiz", description: "", course: "",
      timeLimit: 15, passingScore: 70, shuffleQuestions: false,
      showResults: true, allowRetake: true, maxRetakes: 3, questions: [], status: "draft",
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    setActiveQuiz(newQuiz);
    setView("builder");
    toast({ title: "Quiz created! ✏️", description: "Start adding questions to your quiz." });
  };

  const updateQuizField = (field: keyof Quiz, value: any) => {
    if (!activeQuiz) return;
    const updated = { ...activeQuiz, [field]: value };
    setActiveQuiz(updated);
    setQuizzes(prev => prev.map(q => q.id === updated.id ? updated : q));
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    toast({ title: "Quiz deleted", description: "Quiz has been removed." });
  };

  const duplicateQuiz = (quiz: Quiz) => {
    const dup = { ...quiz, id: genId(), title: `${quiz.title} (Copy)`, status: "draft" as const };
    setQuizzes(prev => [dup, ...prev]);
    toast({ title: "Quiz duplicated! 📋" });
  };

  // ─── Question CRUD ───
  const addQuestion = (type: QuestionType) => {
    if (!activeQuiz) return;
    const base: Question = { id: genId(), type, question: "", points: 10, explanation: "" };
    if (type === "multiple-choice") {
      base.options = [
        { id: genId(), text: "", isCorrect: true },
        { id: genId(), text: "", isCorrect: false },
        { id: genId(), text: "", isCorrect: false },
        { id: genId(), text: "", isCorrect: false },
      ];
    } else if (type === "true-false") {
      base.trueFalseAnswer = true;
    } else if (type === "fill-blank") {
      base.correctAnswer = "";
    } else if (type === "drag-drop") {
      base.pairs = [{ id: genId(), item: "", target: "" }, { id: genId(), item: "", target: "" }];
    }
    const updated = { ...activeQuiz, questions: [...activeQuiz.questions, base] };
    setActiveQuiz(updated);
    setQuizzes(prev => prev.map(q => q.id === updated.id ? updated : q));
    setEditingQuestion(base);
  };

  const updateQuestion = (updated: Question) => {
    if (!activeQuiz) return;
    const quiz = { ...activeQuiz, questions: activeQuiz.questions.map(q => q.id === updated.id ? updated : q) };
    setActiveQuiz(quiz);
    setQuizzes(prev => prev.map(q => q.id === quiz.id ? quiz : q));
    setEditingQuestion(updated);
  };

  const deleteQuestion = (qId: string) => {
    if (!activeQuiz) return;
    const quiz = { ...activeQuiz, questions: activeQuiz.questions.filter(q => q.id !== qId) };
    setActiveQuiz(quiz);
    setQuizzes(prev => prev.map(q => q.id === quiz.id ? quiz : q));
    if (editingQuestion?.id === qId) setEditingQuestion(null);
  };

  // ─── Drag-and-Drop Question Reorder ───
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || !activeQuiz) return;
    const qs = [...activeQuiz.questions];
    const [removed] = qs.splice(dragIndex, 1);
    qs.splice(index, 0, removed);
    const quiz = { ...activeQuiz, questions: qs };
    setActiveQuiz(quiz);
    setQuizzes(prev => prev.map(q => q.id === quiz.id ? quiz : q));
    setDragIndex(null);
    setDragOverIndex(null);
    toast({ title: "Question reordered ↕️" });
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ─── Auto-Grading ───
  const gradeQuiz = useCallback(() => {
    if (!activeQuiz) return;
    let score = 0;
    let totalPoints = 0;
    const questionResults: Record<string, boolean> = {};

    activeQuiz.questions.forEach(q => {
      totalPoints += q.points;
      const answer = answers[q.id];
      let correct = false;
      switch (q.type) {
        case "multiple-choice":
          correct = q.options?.find(o => o.isCorrect)?.id === answer;
          break;
        case "true-false":
          correct = q.trueFalseAnswer === answer;
          break;
        case "fill-blank":
          correct = typeof answer === "string" && answer.trim().toLowerCase() === (q.correctAnswer || "").trim().toLowerCase();
          break;
        case "drag-drop": {
          const userPairs = answer as Record<string, string> | undefined;
          if (userPairs && q.pairs) correct = q.pairs.every(p => userPairs[p.item] === p.target);
          break;
        }
      }
      if (correct) score += q.points;
      questionResults[q.id] = correct;
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const result: QuizAttempt = {
      answers, score, totalPoints,
      passed: percentage >= activeQuiz.passingScore,
      timeSpent: activeQuiz.timeLimit * 60 - timeRemaining,
      questionResults,
    };
    setAttemptResult(result);

    // Save to history
    const record: AttemptRecord = {
      id: genId(), quizId: activeQuiz.id, quizTitle: activeQuiz.title,
      date: new Date().toLocaleString(), score, totalPoints, percentage,
      passed: result.passed, timeSpent: result.timeSpent, questionResults,
    };
    setAttemptHistory(prev => [record, ...prev]);

    setView("results");
    toast({
      title: result.passed ? "Congratulations! 🎉" : "Quiz Complete",
      description: `You scored ${score}/${totalPoints} (${percentage}%)`,
    });
    addNotification(
      result.passed ? `Quiz Passed! 🎉 ${percentage}%` : `Quiz Complete: ${percentage}%`,
      `"${activeQuiz.title}" — ${score}/${totalPoints} points`, "lms-quiz"
    );
    if (result.passed) {
      addNotification("Badge Earned! 🏅", `"${activeQuiz.title}" quiz pass করে "Quiz Master" badge পেয়েছেন!`, "lms-badge");
    }
  }, [activeQuiz, answers, timeRemaining]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAttemptResult(null);
    setTimeRemaining(quiz.timeLimit * 60);
    setView("preview");
  };

  // ─── Analytics Data ───
  const getAnalyticsData = () => {
    const quizPerformance = quizzes.filter(q => q.questions.length > 0).map(quiz => {
      const attempts = attemptHistory.filter(a => a.quizId === quiz.id);
      const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0;
      const passRate = attempts.length > 0 ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100) : 0;
      return { name: quiz.title.length > 20 ? quiz.title.slice(0, 20) + "..." : quiz.title, avgScore, passRate, attempts: attempts.length };
    });

    const scoreOverTime = attemptHistory.slice().reverse().map((a, i) => ({
      attempt: `#${i + 1}`,
      score: a.percentage,
      quiz: a.quizTitle.length > 15 ? a.quizTitle.slice(0, 15) + "..." : a.quizTitle,
    }));

    const questionTypeBreakdown = Object.entries(questionTypeConfig).map(([type, config]) => {
      const allQuestions = quizzes.flatMap(q => q.questions).filter(q => q.type === type);
      const totalAttempted = attemptHistory.reduce((count, a) => {
        const quiz = quizzes.find(q => q.id === a.quizId);
        if (!quiz) return count;
        return count + quiz.questions.filter(q => q.type === type).length;
      }, 0);
      const totalCorrect = attemptHistory.reduce((count, a) => {
        const quiz = quizzes.find(q => q.id === a.quizId);
        if (!quiz) return count;
        return count + quiz.questions.filter(q => q.type === type && a.questionResults[q.id]).length;
      }, 0);
      return {
        name: config.label,
        total: allQuestions.length,
        accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
      };
    });

    const passFailDistribution = [
      { name: "Passed", value: attemptHistory.filter(a => a.passed).length },
      { name: "Failed", value: attemptHistory.filter(a => !a.passed).length },
    ];

    const avgTimePerQuiz = quizzes.filter(q => q.questions.length > 0).map(quiz => {
      const attempts = attemptHistory.filter(a => a.quizId === quiz.id);
      const avgTime = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.timeSpent, 0) / attempts.length / 60) : 0;
      return { name: quiz.title.length > 20 ? quiz.title.slice(0, 20) + "..." : quiz.title, avgMinutes: avgTime, limit: quiz.timeLimit };
    });

    return { quizPerformance, scoreOverTime, questionTypeBreakdown, passFailDistribution, avgTimePerQuiz };
  };

  // ─── PDF Export ───
  const exportAnalyticsPDF = (data: ReturnType<typeof getAnalyticsData>) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Quiz Analytics Report", pageWidth / 2, y, { align: "center" });
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, y, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y += 12;

    // Overview Stats
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Overview", 14, y);
    y += 8;

    const totalAttempts = attemptHistory.length;
    const passRate = totalAttempts > 0 ? Math.round((attemptHistory.filter(a => a.passed).length / totalAttempts) * 100) : 0;
    const avgScoreVal = totalAttempts > 0 ? Math.round(attemptHistory.reduce((s, a) => s + a.percentage, 0) / totalAttempts) : 0;
    const bestScoreVal = totalAttempts > 0 ? Math.max(...attemptHistory.map(a => a.percentage)) : 0;
    const avgTimeVal = totalAttempts > 0 ? Math.round(attemptHistory.reduce((s, a) => s + a.timeSpent, 0) / totalAttempts / 60) : 0;

    autoTable(doc, {
      startY: y,
      head: [["Metric", "Value"]],
      body: [
        ["Total Attempts", String(totalAttempts)],
        ["Pass Rate", `${passRate}%`],
        ["Average Score", `${avgScoreVal}%`],
        ["Best Score", `${bestScoreVal}%`],
        ["Average Time", `${avgTimeVal} min`],
      ],
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: "bold" } },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // Quiz Performance
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Quiz Performance", 14, y);
    y += 8;

    const quizRows = quizzes.filter(q => q.questions.length > 0).map(quiz => {
      const attempts = attemptHistory.filter(a => a.quizId === quiz.id);
      const qAvg = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0;
      const qBest = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
      const qPass = attempts.length > 0 ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100) : 0;
      const qTime = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.timeSpent, 0) / attempts.length / 60) : 0;
      return [quiz.title, String(attempts.length), `${qAvg}%`, `${qBest}%`, `${qPass}%`, `${qTime}m`];
    });

    autoTable(doc, {
      startY: y,
      head: [["Quiz", "Attempts", "Avg Score", "Best", "Pass Rate", "Avg Time"]],
      body: quizRows,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // Question Type Accuracy
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Accuracy by Question Type", 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [["Question Type", "Total Questions", "Accuracy"]],
      body: data.questionTypeBreakdown.map(q => [q.name, String(q.total), `${q.accuracy}%`]),
      theme: "striped",
      headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // Score Progression
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Score Progression", 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [["Attempt", "Quiz", "Score"]],
      body: data.scoreOverTime.map(s => [s.attempt, s.quiz, `${s.score}%`]),
      theme: "striped",
      headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // Attempt History
    if (y > 200) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recent Attempt History", 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [["Date", "Quiz", "Score", "Points", "Status", "Time"]],
      body: attemptHistory.slice(0, 20).map(a => [
        a.date, a.quizTitle, `${a.percentage}%`,
        `${a.score}/${a.totalPoints}`, a.passed ? "Passed" : "Failed",
        `${Math.floor(a.timeSpent / 60)}m ${a.timeSpent % 60}s`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Quiz Analytics Report — Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    }

    doc.save("quiz-analytics-report.pdf");
    toast({ title: "PDF Exported! 📄", description: "Quiz analytics report has been downloaded." });
  };

  // ═══════════════════════════════════
  // ═══ RENDER ════════════════════════
  // ═══════════════════════════════════

  // === Quiz List ===
  if (view === "list") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Quiz Manager</h3>
            <p className="text-sm text-muted-foreground">Create, manage, and grade quizzes for your courses</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setView("history")}>
              <History className="h-3.5 w-3.5" /> History
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setView("analytics")}>
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Button>
            <Button className="gap-1.5" onClick={createNewQuiz}>
              <Plus className="h-4 w-4" /> Create Quiz
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Quizzes", value: quizzes.length, icon: FileText, color: "text-primary bg-primary/10" },
            { label: "Published", value: quizzes.filter(q => q.status === "published").length, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Total Questions", value: quizzes.reduce((a, q) => a + q.questions.length, 0), icon: Target, color: "text-amber-500 bg-amber-500/10" },
            { label: "Avg Pass Rate", value: `${attemptHistory.length > 0 ? Math.round((attemptHistory.filter(a => a.passed).length / attemptHistory.length) * 100) : 0}%`, icon: Trophy, color: "text-purple-500 bg-purple-500/10" },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quiz Cards */}
        <div className="space-y-3">
          {quizzes.map(quiz => (
            <Card key={quiz.id} className="hover:border-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">📝</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{quiz.title}</h4>
                      <Badge variant={quiz.status === "published" ? "default" : "secondary"} className="text-[9px]">{quiz.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{quiz.course || "No course assigned"}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" />{quiz.questions.length} questions</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{quiz.timeLimit} min</span>
                      <span className="flex items-center gap-1"><Award className="h-3 w-3" />{quiz.passingScore}% to pass</span>
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{quiz.questions.reduce((a, q) => a + q.points, 0)} pts</span>
                      <span className="flex items-center gap-1"><History className="h-3 w-3" />{attemptHistory.filter(a => a.quizId === quiz.id).length} attempts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {quiz.questions.length > 0 && (
                      <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => startQuiz(quiz)}>
                        <Play className="h-3 w-3" /> Take Quiz
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => { setActiveQuiz(quiz); setView("builder"); setEditingQuestion(null); }}>
                      <Edit className="h-3 w-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => duplicateQuiz(quiz)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive gap-1 text-xs" onClick={() => deleteQuiz(quiz.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // === Attempt History ===
  if (view === "history") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4" /> Back to Quizzes
          </Button>
          <h3 className="text-lg font-bold text-foreground">Quiz Attempt History</h3>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setView("analytics")}>
            <BarChart3 className="h-3.5 w-3.5" /> Analytics
          </Button>
        </div>

        {/* History Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Attempts", value: attemptHistory.length, icon: History, color: "text-primary bg-primary/10" },
            { label: "Passed", value: attemptHistory.filter(a => a.passed).length, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Avg Score", value: `${attemptHistory.length > 0 ? Math.round(attemptHistory.reduce((s, a) => s + a.percentage, 0) / attemptHistory.length) : 0}%`, icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
            { label: "Best Score", value: `${attemptHistory.length > 0 ? Math.max(...attemptHistory.map(a => a.percentage)) : 0}%`, icon: Trophy, color: "text-purple-500 bg-purple-500/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attempt List */}
        <div className="space-y-2">
          {attemptHistory.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No attempts yet. Take a quiz to see your history!</CardContent></Card>
          ) : attemptHistory.map(attempt => (
            <Card key={attempt.id} className={`transition-all ${attempt.passed ? "hover:border-emerald-500/30" : "hover:border-destructive/30"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${attempt.passed ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                    {attempt.passed ? "✅" : "📚"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{attempt.quizTitle}</h4>
                      <Badge variant={attempt.passed ? "default" : "destructive"} className="text-[9px]">
                        {attempt.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{attempt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${attempt.passed ? "text-emerald-500" : "text-destructive"}`}>{attempt.percentage}%</p>
                    <p className="text-[11px] text-muted-foreground">{attempt.score}/{attempt.totalPoints} pts</p>
                  </div>
                  <div className="w-24">
                    <Progress value={attempt.percentage} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-muted-foreground">{Object.values(attempt.questionResults).filter(Boolean).length}/{Object.keys(attempt.questionResults).length} correct</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // === Analytics Dashboard ===
  if (view === "analytics") {
    const data = getAnalyticsData();
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4" /> Back to Quizzes
          </Button>
          <h3 className="text-lg font-bold text-foreground">Quiz Analytics Dashboard</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => exportAnalyticsPDF(data)}>
              <Download className="h-3.5 w-3.5" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setView("history")}>
              <History className="h-3.5 w-3.5" /> History
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Attempts", value: attemptHistory.length, icon: History, color: "text-primary bg-primary/10" },
            { label: "Pass Rate", value: `${attemptHistory.length > 0 ? Math.round((attemptHistory.filter(a => a.passed).length / attemptHistory.length) * 100) : 0}%`, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Avg Score", value: `${attemptHistory.length > 0 ? Math.round(attemptHistory.reduce((s, a) => s + a.percentage, 0) / attemptHistory.length) : 0}%`, icon: Target, color: "text-amber-500 bg-amber-500/10" },
            { label: "Best Score", value: `${attemptHistory.length > 0 ? Math.max(...attemptHistory.map(a => a.percentage)) : 0}%`, icon: Trophy, color: "text-purple-500 bg-purple-500/10" },
            { label: "Avg Time", value: `${attemptHistory.length > 0 ? Math.round(attemptHistory.reduce((s, a) => s + a.timeSpent, 0) / attemptHistory.length / 60) : 0}m`, icon: Clock, color: "text-cyan-500 bg-cyan-500/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-3 flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Score Over Time */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Score Progression</CardTitle>
              <CardDescription className="text-xs">Your scores across all quiz attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.scoreOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="attempt" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} name="Score %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quiz Performance Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-emerald-500" /> Quiz Performance</CardTitle>
              <CardDescription className="text-xs">Average score & pass rate per quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.quizPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Avg Score %" />
                  <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Pass Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Pass/Fail Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><PieChart className="h-4 w-4 text-amber-500" /> Pass/Fail Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RPieChart>
                  <Pie data={data.passFailDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {data.passFailDistribution.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </RPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Question Type Accuracy */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-purple-500" /> Accuracy by Question Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={data.questionTypeBreakdown}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <Radar name="Accuracy %" dataKey="accuracy" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Per Quiz */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-cyan-500" /> Avg Time vs Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.avgTimePerQuiz} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tick={{ fontSize: 10 }} unit="m" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="avgMinutes" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Avg Time (min)" />
                  <Bar dataKey="limit" fill="#e5e7eb" radius={[0, 4, 4, 0]} name="Time Limit (min)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Per-Quiz Breakdown Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> Per-Quiz Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Quiz</th>
                    <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Attempts</th>
                    <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Avg Score</th>
                    <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Best</th>
                    <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Pass Rate</th>
                    <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.filter(q => q.questions.length > 0).map(quiz => {
                    const attempts = attemptHistory.filter(a => a.quizId === quiz.id);
                    const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0;
                    const best = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
                    const passRate = attempts.length > 0 ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100) : 0;
                    const avgTime = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.timeSpent, 0) / attempts.length) : 0;
                    return (
                      <tr key={quiz.id} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="py-2.5 px-2 font-medium text-foreground">{quiz.title}</td>
                        <td className="py-2.5 px-2 text-center">{attempts.length}</td>
                        <td className="py-2.5 px-2 text-center">
                          <Badge variant={avgScore >= quiz.passingScore ? "default" : "secondary"} className="text-[9px]">{avgScore}%</Badge>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <Badge variant={best >= quiz.passingScore ? "default" : "secondary"} className="text-[9px]">{best}%</Badge>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <Badge variant={passRate >= 50 ? "default" : "destructive"} className="text-[9px]">{passRate}%</Badge>
                        </td>
                        <td className="py-2.5 px-2 text-center text-muted-foreground">{Math.floor(avgTime / 60)}m {avgTime % 60}s</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // === Quiz Builder ===
  if (view === "builder" && activeQuiz) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => { setView("list"); setEditingQuestion(null); }}>
            <ArrowLeft className="h-4 w-4" /> Back to Quizzes
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={activeQuiz.status === "published" ? "default" : "secondary"}>{activeQuiz.status}</Badge>
            <Button variant="outline" size="sm" onClick={() => updateQuizField("status", activeQuiz.status === "draft" ? "published" : "draft")}>
              {activeQuiz.status === "draft" ? "Publish" : "Unpublish"}
            </Button>
            {activeQuiz.questions.length > 0 && (
              <Button size="sm" className="gap-1" onClick={() => startQuiz(activeQuiz)}>
                <Play className="h-3.5 w-3.5" /> Preview Quiz
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left: Quiz Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" /> Quiz Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Title</Label>
                  <Input value={activeQuiz.title} onChange={e => updateQuizField("title", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Input value={activeQuiz.description} onChange={e => updateQuizField("description", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Course</Label>
                  <Select value={activeQuiz.course} onValueChange={v => updateQuizField("course", v)}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development Bootcamp">Web Development Bootcamp</SelectItem>
                      <SelectItem value="UI/UX Design Masterclass">UI/UX Design Masterclass</SelectItem>
                      <SelectItem value="Digital Marketing A-Z">Digital Marketing A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Time Limit (min)</Label>
                    <Input type="number" value={activeQuiz.timeLimit} onChange={e => updateQuizField("timeLimit", +e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Passing Score (%)</Label>
                    <Input type="number" value={activeQuiz.passingScore} onChange={e => updateQuizField("passingScore", +e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  {[
                    { label: "Shuffle Questions", field: "shuffleQuestions" as const, value: activeQuiz.shuffleQuestions },
                    { label: "Show Results", field: "showResults" as const, value: activeQuiz.showResults },
                    { label: "Allow Retakes", field: "allowRetake" as const, value: activeQuiz.allowRetake },
                  ].map(toggle => (
                    <div key={toggle.field} className="flex items-center justify-between">
                      <Label className="text-xs">{toggle.label}</Label>
                      <Switch checked={toggle.value} onCheckedChange={v => updateQuizField(toggle.field, v)} />
                    </div>
                  ))}
                  {activeQuiz.allowRetake && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Max Retakes</Label>
                      <Input type="number" value={activeQuiz.maxRetakes} onChange={e => updateQuizField("maxRetakes", +e.target.value)} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Question */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Add Question
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(Object.entries(questionTypeConfig) as [QuestionType, typeof questionTypeConfig["multiple-choice"]][]).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <Button key={type} variant="outline" className="w-full justify-start gap-2 text-xs h-9" onClick={() => addQuestion(type)}>
                      <div className={`flex h-6 w-6 items-center justify-center rounded ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {config.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Center: Questions List with Drag & Drop */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Questions ({activeQuiz.questions.length}) · {activeQuiz.questions.reduce((a, q) => a + q.points, 0)} total points
              </h4>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <GripVertical className="h-3 w-3" /> Drag to reorder
              </span>
            </div>
            {activeQuiz.questions.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No questions yet</p>
                  <p className="text-xs mt-1">Add questions from the panel on the left</p>
                </CardContent>
              </Card>
            )}
            {activeQuiz.questions.map((q, i) => {
              const config = questionTypeConfig[q.type];
              const Icon = config.icon;
              const isSelected = editingQuestion?.id === q.id;
              const isDragging = dragIndex === i;
              const isDragOver = dragOverIndex === i;
              return (
                <Card
                  key={q.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "border-primary ring-1 ring-primary/20" :
                    isDragOver ? "border-primary/50 bg-primary/5 ring-1 ring-primary/10" :
                    isDragging ? "opacity-40 scale-95" :
                    "hover:border-primary/30"
                  }`}
                  onClick={() => setEditingQuestion(q)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors" onMouseDown={e => e.stopPropagation()}>
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <Badge variant="outline" className="text-[9px] w-6 h-5 flex items-center justify-center p-0 shrink-0">{i + 1}</Badge>
                      <div className={`flex h-7 w-7 items-center justify-center rounded ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{q.question || "Untitled question"}</p>
                        <p className="text-[10px] text-muted-foreground">{config.label} · {q.points} pts</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={e => { e.stopPropagation(); deleteQuestion(q.id); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Right: Question Editor */}
          <div>
            {editingQuestion ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Edit Question</CardTitle>
                  <CardDescription>{questionTypeConfig[editingQuestion.type].label}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Question Text</Label>
                    <Input value={editingQuestion.question} onChange={e => updateQuestion({ ...editingQuestion, question: e.target.value })} placeholder="Enter your question..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Points</Label>
                      <Input type="number" value={editingQuestion.points} onChange={e => updateQuestion({ ...editingQuestion, points: +e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Time (sec, optional)</Label>
                      <Input type="number" value={editingQuestion.timeLimit || ""} onChange={e => updateQuestion({ ...editingQuestion, timeLimit: +e.target.value || undefined })} />
                    </div>
                  </div>

                  {/* Multiple Choice Options */}
                  {editingQuestion.type === "multiple-choice" && editingQuestion.options && (
                    <div className="space-y-2">
                      <Label className="text-xs">Options (click ✓ to mark correct)</Label>
                      {editingQuestion.options.map((opt, oi) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <Button variant={opt.isCorrect ? "default" : "outline"} size="icon" className="h-7 w-7 shrink-0" onClick={() => {
                            const opts = editingQuestion.options!.map(o => ({ ...o, isCorrect: o.id === opt.id }));
                            updateQuestion({ ...editingQuestion, options: opts });
                          }}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                          <Input value={opt.text} placeholder={`Option ${oi + 1}`} className="h-8 text-xs" onChange={e => {
                            const opts = editingQuestion.options!.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o);
                            updateQuestion({ ...editingQuestion, options: opts });
                          }} />
                          {editingQuestion.options!.length > 2 && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => {
                              const opts = editingQuestion.options!.filter(o => o.id !== opt.id);
                              updateQuestion({ ...editingQuestion, options: opts });
                            }}>
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {editingQuestion.options.length < 6 && (
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                          const opts = [...editingQuestion.options!, { id: genId(), text: "", isCorrect: false }];
                          updateQuestion({ ...editingQuestion, options: opts });
                        }}>
                          <Plus className="h-3 w-3" /> Add Option
                        </Button>
                      )}
                    </div>
                  )}

                  {/* True/False */}
                  {editingQuestion.type === "true-false" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Correct Answer</Label>
                      <div className="flex gap-2">
                        {[true, false].map(val => (
                          <Button key={String(val)} variant={editingQuestion.trueFalseAnswer === val ? "default" : "outline"} size="sm" className="flex-1" onClick={() => updateQuestion({ ...editingQuestion, trueFalseAnswer: val })}>
                            {val ? "True" : "False"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fill in the Blank */}
                  {editingQuestion.type === "fill-blank" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Correct Answer (case-insensitive)</Label>
                      <Input value={editingQuestion.correctAnswer || ""} onChange={e => updateQuestion({ ...editingQuestion, correctAnswer: e.target.value })} placeholder="Enter the correct answer..." />
                    </div>
                  )}

                  {/* Drag & Drop Pairs */}
                  {editingQuestion.type === "drag-drop" && editingQuestion.pairs && (
                    <div className="space-y-2">
                      <Label className="text-xs">Match Pairs (Item → Target)</Label>
                      {editingQuestion.pairs.map((pair) => (
                        <div key={pair.id} className="flex items-center gap-2">
                          <Input value={pair.item} placeholder="Item" className="h-8 text-xs flex-1" onChange={e => {
                            const pairs = editingQuestion.pairs!.map(p => p.id === pair.id ? { ...p, item: e.target.value } : p);
                            updateQuestion({ ...editingQuestion, pairs });
                          }} />
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <Input value={pair.target} placeholder="Target" className="h-8 text-xs flex-1" onChange={e => {
                            const pairs = editingQuestion.pairs!.map(p => p.id === pair.id ? { ...p, target: e.target.value } : p);
                            updateQuestion({ ...editingQuestion, pairs });
                          }} />
                          {editingQuestion.pairs!.length > 2 && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => {
                              const pairs = editingQuestion.pairs!.filter(p => p.id !== pair.id);
                              updateQuestion({ ...editingQuestion, pairs });
                            }}>
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {editingQuestion.pairs.length < 8 && (
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                          const pairs = [...editingQuestion.pairs!, { id: genId(), item: "", target: "" }];
                          updateQuestion({ ...editingQuestion, pairs });
                        }}>
                          <Plus className="h-3 w-3" /> Add Pair
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Explanation (shown after answering)</Label>
                    <Input value={editingQuestion.explanation || ""} onChange={e => updateQuestion({ ...editingQuestion, explanation: e.target.value })} placeholder="Why is this the correct answer?" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Edit className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a question to edit</p>
                  <p className="text-xs mt-1">Click any question from the list</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === Quiz Preview (Take Quiz) ===
  if (view === "preview" && activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIndex];
    if (!question) return null;
    const totalQuestions = activeQuiz.questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    const config = questionTypeConfig[question.type];
    const TypeIcon = config.icon;

    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4" /> Exit Quiz
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1 text-xs">
              <Clock className="h-3 w-3" /> {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
            </Badge>
            <Badge variant="outline" className="text-xs">{currentQuestionIndex + 1} / {totalQuestions}</Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded ${config.color}`}>
                <TypeIcon className="h-4 w-4" />
              </div>
              <Badge variant="secondary" className="text-[10px]">{config.label}</Badge>
              <Badge variant="outline" className="text-[10px] ml-auto">{question.points} pts</Badge>
            </div>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.type === "multiple-choice" && question.options && (
              <div className="space-y-2">
                {question.options.map(opt => (
                  <button key={opt.id} className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${answers[question.id] === opt.id ? "border-primary bg-primary/5 font-medium" : "border-border/60 hover:border-primary/30"}`} onClick={() => setAnswers(prev => ({ ...prev, [question.id]: opt.id }))}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${answers[question.id] === opt.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
                        {String.fromCharCode(65 + question.options!.indexOf(opt))}
                      </div>
                      {opt.text}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {question.type === "true-false" && (
              <div className="flex gap-3">
                {[true, false].map(val => (
                  <button key={String(val)} className={`flex-1 p-4 rounded-xl border-2 transition-all text-center font-semibold ${answers[question.id] === val ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/30"}`} onClick={() => setAnswers(prev => ({ ...prev, [question.id]: val }))}>
                    {val ? "✅ True" : "❌ False"}
                  </button>
                ))}
              </div>
            )}

            {question.type === "fill-blank" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type your answer below:</p>
                <Input value={(answers[question.id] as string) || ""} onChange={e => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))} placeholder="Your answer..." className="text-lg h-12" />
              </div>
            )}

            {question.type === "drag-drop" && question.pairs && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Match each item with its correct target:</p>
                {question.pairs.map(pair => {
                  const currentDrag = (answers[question.id] as Record<string, string>) || {};
                  const shuffledTargets = [...new Set(question.pairs!.map(p => p.target))];
                  return (
                    <div key={pair.id} className="flex items-center gap-3">
                      <div className="flex-1 p-3 rounded-xl border border-border/60 bg-muted/30 text-sm font-medium">{pair.item}</div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Select value={currentDrag[pair.item] || ""} onValueChange={v => { const updated = { ...currentDrag, [pair.item]: v }; setAnswers(prev => ({ ...prev, [question.id]: updated })); }}>
                        <SelectTrigger className="flex-1"><SelectValue placeholder="Select match..." /></SelectTrigger>
                        <SelectContent>{shuffledTargets.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="gap-1">Next <ArrowRight className="h-4 w-4" /></Button>
          ) : (
            <Button onClick={gradeQuiz} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Submit Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // === Results View ===
  if (view === "results" && activeQuiz && attemptResult) {
    const percentage = Math.round((attemptResult.score / attemptResult.totalPoints) * 100);
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setView("list")}>
          <ArrowLeft className="h-4 w-4" /> Back to Quizzes
        </Button>

        <Card className={`border-2 ${attemptResult.passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl">{attemptResult.passed ? "🎉" : "📚"}</div>
            <h2 className="text-2xl font-bold text-foreground">{attemptResult.passed ? "Congratulations! You Passed!" : "Keep Learning!"}</h2>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{percentage}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{attemptResult.score}/{attemptResult.totalPoints}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{activeQuiz.passingScore}%</p>
                <p className="text-xs text-muted-foreground">Required</p>
              </div>
            </div>
            <Progress value={percentage} className="h-3 max-w-sm mx-auto" />
          </CardContent>
        </Card>

        {activeQuiz.showResults && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Question Review</h3>
            {activeQuiz.questions.map((q, i) => {
              const correct = attemptResult.questionResults[q.id];
              const config = questionTypeConfig[q.type];
              return (
                <Card key={q.id} className={`${correct ? "border-emerald-500/20" : "border-destructive/20"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full shrink-0 ${correct ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
                        {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium text-foreground">Q{i + 1}: {q.question}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[9px]">{config.label}</Badge>
                          <Badge variant={correct ? "default" : "destructive"} className="text-[9px]">{correct ? `+${q.points} pts` : "0 pts"}</Badge>
                        </div>
                        {q.explanation && (
                          <p className="text-xs text-muted-foreground mt-1 p-2 rounded-lg bg-muted/50">💡 {q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          {activeQuiz.allowRetake && (
            <Button variant="outline" className="gap-1.5" onClick={() => startQuiz(activeQuiz)}>
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </Button>
          )}
          <Button variant="outline" className="gap-1.5" onClick={() => setView("history")}>
            <History className="h-4 w-4" /> View History
          </Button>
          <Button className="gap-1.5" onClick={() => setView("list")}>
            <ArrowRight className="h-4 w-4" /> Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizBuilder;
