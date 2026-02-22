"use client";

/**
 * ============================================================================
 * EducationPage â€” Education / Coaching Center Management Hub
 * ============================================================================
 *
 * Three main tabs:
 *   1. Class Schedule â€” timetable, batches, subjects
 *   2. Student Management â€” enrollment, profiles, guardian info
 *   3. Fee Collection â€” fee structures, payment tracking, overdue
 *
 * Backend endpoints (future):
 *   GET /api/education/classes    â€” class schedule
 *   GET /api/education/students   â€” student list
 *   GET /api/education/fees       â€” fee records
 * ============================================================================
 */
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  School, Users, DollarSign, Plus, Calendar, Clock,
  CheckCircle2, AlertCircle, Phone, Mail, BookOpen,
  TrendingUp, CreditCard, Send, BellRing,
} from "lucide-react";

/* â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const classes = [
  { id: 1, name: "Advanced Mathematics", subject: "Mathematics", teacher: "Dr. Ahmed Khalil", batch: "Batch A â€“ Grade 10", schedule: "Sun, Tue, Thu", time: "09:00 â€“ 10:30", students: 28, room: "Room 101", status: "active" },
  { id: 2, name: "Physics Fundamentals", subject: "Physics", teacher: "Ms. Sara Noor", batch: "Batch B â€“ Grade 11", schedule: "Mon, Wed", time: "11:00 â€“ 12:30", students: 22, room: "Room 203", status: "active" },
  { id: 3, name: "English Conversation", subject: "English", teacher: "Mr. James Carter", batch: "Batch C â€“ Adults", schedule: "Sat, Mon, Wed", time: "14:00 â€“ 15:00", students: 18, room: "Room 105", status: "active" },
  { id: 4, name: "Arabic Grammar", subject: "Arabic", teacher: "Mr. Omar Faisal", batch: "Batch D â€“ Grade 9", schedule: "Sun, Tue", time: "10:00 â€“ 11:00", students: 24, room: "Room 102", status: "active" },
  { id: 5, name: "Chemistry Lab", subject: "Chemistry", teacher: "Dr. Fatima Al-Rashed", batch: "Batch E â€“ Grade 12", schedule: "Thu", time: "13:00 â€“ 15:00", students: 16, room: "Lab 1", status: "paused" },
  { id: 6, name: "Art & Design", subject: "Arts", teacher: "Ms. Layla Mansour", batch: "Batch F â€“ All Ages", schedule: "Sat", time: "16:00 â€“ 18:00", students: 12, room: "Studio", status: "active" },
];

const students = [
  { id: 1, name: "Youssef Ali", batch: "Batch A â€“ Grade 10", guardian: "Mohammed Ali", phone: "+966 50 111 2233", email: "youssef@email.com", enrolled: "2025-09-01", feeStatus: "paid", attendance: 95 },
  { id: 2, name: "Nora Hassan", batch: "Batch B â€“ Grade 11", guardian: "Khalid Hassan", phone: "+966 55 444 5566", email: "nora.h@email.com", enrolled: "2025-09-01", feeStatus: "paid", attendance: 92 },
  { id: 3, name: "Rayan Saeed", batch: "Batch A â€“ Grade 10", guardian: "Saeed Al-Mutairi", phone: "+966 54 777 8899", email: "rayan@email.com", enrolled: "2025-09-15", feeStatus: "overdue", attendance: 78 },
  { id: 4, name: "Lina Tariq", batch: "Batch C â€“ Adults", guardian: "â€”", phone: "+966 56 222 3344", email: "lina.t@email.com", enrolled: "2026-01-10", feeStatus: "paid", attendance: 98 },
  { id: 5, name: "Adam Youssef", batch: "Batch D â€“ Grade 9", guardian: "Youssef Kamal", phone: "+966 50 999 0011", email: "adam.y@email.com", enrolled: "2025-09-01", feeStatus: "partial", attendance: 85 },
];

const feeRecords = [
  { id: 1, student: "Youssef Ali", batch: "Batch A", amount: 2500, paid: 2500, due: "2026-02-01", paidDate: "2026-01-28", status: "paid", method: "Bank Transfer" },
  { id: 2, student: "Nora Hassan", batch: "Batch B", amount: 3000, paid: 3000, due: "2026-02-01", paidDate: "2026-02-01", status: "paid", method: "Online" },
  { id: 3, student: "Rayan Saeed", batch: "Batch A", amount: 2500, paid: 0, due: "2026-02-01", paidDate: null, status: "overdue", method: "â€”" },
  { id: 4, student: "Lina Tariq", batch: "Batch C", amount: 1800, paid: 1800, due: "2026-02-01", paidDate: "2026-02-02", status: "paid", method: "Cash" },
  { id: 5, student: "Adam Youssef", batch: "Batch D", amount: 2200, paid: 1100, due: "2026-02-01", paidDate: "2026-01-30", status: "partial", method: "Online" },
];

/* â”€â”€ Status helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const feeStatusBadge = (s: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Paid", cls: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" },
    partial: { label: "Partial", cls: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]" },
    overdue: { label: "Overdue", cls: "bg-destructive text-destructive-foreground" },
  };
  const cfg = map[s] ?? map.overdue;
  return <Badge className={cfg.cls}>{cfg.label}</Badge>;
};

/* â”€â”€ Summary Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const SummaryCards = () => {
  const totalStudents = students.length;
  const activeClasses = classes.filter(c => c.status === "active").length;
  const totalFees = feeRecords.reduce((a, f) => a + f.amount, 0);
  const collectedFees = feeRecords.reduce((a, f) => a + f.paid, 0);

  const cards = [
    { title: "Total Students", value: totalStudents, icon: Users, change: "+12 this term" },
    { title: "Active Classes", value: activeClasses, icon: School, change: `${classes.length} total` },
    { title: "Fee Collected", value: `$${collectedFees.toLocaleString()}`, icon: DollarSign, change: `of $${totalFees.toLocaleString()}` },
    { title: "Avg. Attendance", value: `${Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length)}%`, icon: CheckCircle2, change: "This month" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(c => (
        <Card key={c.title}>
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{c.title}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.change}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <c.icon className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/* â”€â”€ Tab: Class Schedule â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const ClassScheduleTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Class Schedule</h2>
      <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Class</Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {classes.map(c => (
        <Card key={c.id} className="group hover:border-primary/40 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <CardDescription className="mt-1">{c.teacher}</CardDescription>
              </div>
              <Badge variant={c.status === "active" ? "default" : "secondary"}>
                {c.status === "active" ? "Active" : "Paused"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Batch</span>
              <Badge variant="secondary">{c.batch}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Days</span>
              <span className="font-medium">{c.schedule}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Time</span>
              <span className="font-medium">{c.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Room</span>
              <span className="font-medium">{c.room}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Students</span>
              <span className="font-semibold text-primary">{c.students}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

/* â”€â”€ Tab: Student Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const StudentManagementTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Students ({students.length})</h2>
      <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Enroll Student</Button>
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Guardian</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Fee Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(s => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell><Badge variant="secondary" className="text-xs">{s.batch}</Badge></TableCell>
              <TableCell className="text-muted-foreground text-sm">{s.guardian}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {s.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {s.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={s.attendance} className="h-1.5 w-16" />
                  <span className="text-sm font-medium">{s.attendance}%</span>
                </div>
              </TableCell>
              <TableCell>{feeStatusBadge(s.feeStatus)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

/* â”€â”€ Tab: Fee Collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const FeeCollectionTab = () => {
  const totalExpected = feeRecords.reduce((a, f) => a + f.amount, 0);
  const totalCollected = feeRecords.reduce((a, f) => a + f.paid, 0);
  const totalOverdue = feeRecords.filter(f => f.status === "overdue").reduce((a, f) => a + (f.amount - f.paid), 0);
  const collectionRate = Math.round((totalCollected / totalExpected) * 100);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Expected (Feb)</p>
              <p className="text-xl font-bold mt-1">${totalExpected.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-xl font-bold mt-1 text-[hsl(var(--success))]">${totalCollected.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-xl font-bold mt-1 text-destructive">${totalOverdue.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Collection Rate</p>
              <p className="text-xl font-bold mt-1">{collectionRate}%</p>
              <Progress value={collectionRate} className="h-1.5 mt-2 w-24" />
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {totalOverdue > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <BellRing className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Overdue Fee Alert</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {feeRecords.filter(f => f.status === "overdue").map(f => f.student).join(", ")} has outstanding fees of ${totalOverdue.toLocaleString()}.
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="destructive" className="gap-1">
                  <Send className="h-3.5 w-3.5" /> Send Reminder
                </Button>
                <Button size="sm" variant="outline">Record Payment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Fee Records</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Record Payment</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeRecords.map(f => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.student}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{f.batch}</Badge></TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {f.due}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{f.paidDate ?? <span className="text-destructive">Unpaid</span>}</TableCell>
                <TableCell>
                  {f.method !== "â€”" ? (
                    <span className="flex items-center gap-1 text-sm">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground" /> {f.method}
                    </span>
                  ) : <span className="text-muted-foreground">â€”</span>}
                </TableCell>
                <TableCell>{feeStatusBadge(f.status)}</TableCell>
                <TableCell className="text-right font-medium">${f.amount.toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold">
                  {f.paid > 0 ? <span className="text-[hsl(var(--success))]">${f.paid.toLocaleString()}</span> : <span className="text-muted-foreground">â€”</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const EducationPage = () => {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Education Center</h1>
          <p className="text-muted-foreground mt-1">Manage classes, students, and fee collection in one place.</p>
        </div>

        <SummaryCards />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="schedule" className="gap-1.5">
              <School className="h-4 w-4" /> Class Schedule
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-1.5">
              <Users className="h-4 w-4" /> Students
            </TabsTrigger>
            <TabsTrigger value="fees" className="gap-1.5">
              <DollarSign className="h-4 w-4" /> Fee Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule"><ClassScheduleTab /></TabsContent>
          <TabsContent value="students"><StudentManagementTab /></TabsContent>
          <TabsContent value="fees"><FeeCollectionTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EducationPage;

