"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Heart, Users, Calendar, FileText, Plus, Search, Phone,
  Mail, Clock, Activity, Stethoscope, Pill, Video, UserCheck,
  TrendingUp, AlertCircle, CheckCircle2, X, DollarSign, Receipt,
  Package, ShoppingCart, CreditCard, FileCheck, ClipboardList,
  Thermometer, Eye, Droplets, Weight, Ruler, CalendarDays, Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Progress } from "@/components/ui/progress";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
  status: "active" | "follow-up" | "discharged";
  doctor: string;
}

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
}

const mockPatients: Patient[] = [
  { id: "P-001", name: "Ahmed Al-Hassan", age: 45, gender: "Male", phone: "+966 55 123 4567", email: "ahmed@email.com", lastVisit: "2026-02-18", condition: "Hypertension", status: "active", doctor: "Dr. Sarah Khan" },
  { id: "P-002", name: "Fatima Al-Rashid", age: 32, gender: "Female", phone: "+966 54 234 5678", email: "fatima@email.com", lastVisit: "2026-02-15", condition: "Diabetes Type 2", status: "follow-up", doctor: "Dr. Omar Farouk" },
  { id: "P-003", name: "Mohammad Khalid", age: 28, gender: "Male", phone: "+966 56 345 6789", email: "mohammad@email.com", lastVisit: "2026-02-10", condition: "Allergies", status: "active", doctor: "Dr. Sarah Khan" },
  { id: "P-004", name: "Layla Nasser", age: 55, gender: "Female", phone: "+966 50 456 7890", email: "layla@email.com", lastVisit: "2026-01-28", condition: "Arthritis", status: "discharged", doctor: "Dr. Rania Mahmoud" },
  { id: "P-005", name: "Yousef Al-Turki", age: 38, gender: "Male", phone: "+966 59 567 8901", email: "yousef@email.com", lastVisit: "2026-02-19", condition: "Back Pain", status: "active", doctor: "Dr. Omar Farouk" },
];

const mockAppointments: Appointment[] = [
  { id: "A-001", patientName: "Ahmed Al-Hassan", doctor: "Dr. Sarah Khan", date: "2026-02-20", time: "09:00", type: "Follow-up", status: "scheduled" },
  { id: "A-002", patientName: "Fatima Al-Rashid", doctor: "Dr. Omar Farouk", date: "2026-02-20", time: "10:30", type: "Check-up", status: "scheduled" },
  { id: "A-003", patientName: "Mohammad Khalid", doctor: "Dr. Sarah Khan", date: "2026-02-20", time: "11:00", type: "Consultation", status: "completed" },
  { id: "A-004", patientName: "New Patient", doctor: "Dr. Rania Mahmoud", date: "2026-02-20", time: "14:00", type: "First Visit", status: "scheduled" },
  { id: "A-005", patientName: "Yousef Al-Turki", doctor: "Dr. Omar Farouk", date: "2026-02-21", time: "09:30", type: "Follow-up", status: "scheduled" },
];

const doctors = ["Dr. Sarah Khan", "Dr. Omar Farouk", "Dr. Rania Mahmoud", "Dr. Ali Nabil"];

interface Medication {
  id: string; name: string; category: string; stock: number; unit: string; price: number; expiry: string; supplier: string; status: "in-stock" | "low-stock" | "expired";
}

interface Invoice {
  id: string; patientName: string; doctor: string; date: string; items: { desc: string; amount: number }[]; total: number; status: "paid" | "pending" | "overdue"; paymentMethod?: string;
}

const mockMedications: Medication[] = [
  { id: "MED-001", name: "Amoxicillin 500mg", category: "Antibiotics", stock: 240, unit: "capsules", price: 0.85, expiry: "2027-06-15", supplier: "PharmaCorp", status: "in-stock" },
  { id: "MED-002", name: "Metformin 850mg", category: "Antidiabetics", stock: 180, unit: "tablets", price: 0.45, expiry: "2027-03-20", supplier: "MediSupply", status: "in-stock" },
  { id: "MED-003", name: "Lisinopril 10mg", category: "Antihypertensives", stock: 12, unit: "tablets", price: 0.65, expiry: "2026-12-01", supplier: "PharmaCorp", status: "low-stock" },
  { id: "MED-004", name: "Ibuprofen 400mg", category: "Pain Relief", stock: 350, unit: "tablets", price: 0.30, expiry: "2027-08-10", supplier: "GlobalMeds", status: "in-stock" },
  { id: "MED-005", name: "Cetirizine 10mg", category: "Antihistamines", stock: 0, unit: "tablets", price: 0.25, expiry: "2026-01-15", supplier: "MediSupply", status: "expired" },
  { id: "MED-006", name: "Omeprazole 20mg", category: "Gastrointestinal", stock: 95, unit: "capsules", price: 0.55, expiry: "2027-04-22", supplier: "GlobalMeds", status: "in-stock" },
  { id: "MED-007", name: "Paracetamol 500mg", category: "Pain Relief", stock: 8, unit: "tablets", price: 0.15, expiry: "2027-01-30", supplier: "PharmaCorp", status: "low-stock" },
];

const mockInvoices: Invoice[] = [
  { id: "INV-001", patientName: "Ahmed Al-Hassan", doctor: "Dr. Sarah Khan", date: "2026-02-20", items: [{ desc: "Consultation Fee", amount: 200 }, { desc: "ECG Test", amount: 150 }, { desc: "Medications", amount: 85 }], total: 435, status: "paid", paymentMethod: "Card" },
  { id: "INV-002", patientName: "Fatima Al-Rashid", doctor: "Dr. Omar Farouk", date: "2026-02-18", items: [{ desc: "Follow-up Visit", amount: 150 }, { desc: "Blood Test", amount: 120 }], total: 270, status: "paid", paymentMethod: "Cash" },
  { id: "INV-003", patientName: "Mohammad Khalid", doctor: "Dr. Sarah Khan", date: "2026-02-15", items: [{ desc: "Consultation Fee", amount: 200 }, { desc: "Allergy Test", amount: 250 }, { desc: "Medications", amount: 45 }], total: 495, status: "pending" },
  { id: "INV-004", patientName: "Layla Nasser", doctor: "Dr. Rania Mahmoud", date: "2026-01-28", items: [{ desc: "X-Ray", amount: 300 }, { desc: "Consultation Fee", amount: 200 }], total: 500, status: "overdue" },
  { id: "INV-005", patientName: "Yousef Al-Turki", doctor: "Dr. Omar Farouk", date: "2026-02-19", items: [{ desc: "Consultation Fee", amount: 200 }, { desc: "MRI Scan", amount: 800 }, { desc: "Medications", amount: 120 }], total: 1120, status: "pending" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "follow-up": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  discharged: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  "no-show": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "in-stock": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "low-stock": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  expired: "bg-destructive/15 text-destructive border-destructive/30",
  paid: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  overdue: "bg-destructive/15 text-destructive border-destructive/30",
  dispensed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "awaiting-pickup": "bg-blue-500/15 text-blue-500 border-blue-500/30",
  refilled: "bg-violet-500/15 text-violet-500 border-violet-500/30",
};

const patientRecords = [
  {
    id: "P-001", name: "Ahmed Al-Hassan", age: 45, gender: "Male", bloodType: "A+", allergies: ["Penicillin"], phone: "+966 55 123 4567",
    vitals: { bp: "140/90", heartRate: 78, temp: 36.8, weight: 82, height: 175, bmi: 26.8, spo2: 97 },
    conditions: ["Hypertension", "Mild Hyperlipidemia"],
    history: [
      { date: "2026-02-18", type: "Visit", doctor: "Dr. Sarah Khan", notes: "BP elevated. Adjusted Lisinopril dosage to 20mg.", diagnosis: "Hypertension - Stage 1" },
      { date: "2026-01-20", type: "Lab Test", doctor: "Dr. Sarah Khan", notes: "Lipid panel: Total cholesterol 220, LDL 145. Started Atorvastatin.", diagnosis: "Hyperlipidemia" },
      { date: "2025-12-10", type: "Visit", doctor: "Dr. Sarah Khan", notes: "Routine checkup. BP 135/85. Continue current medications.", diagnosis: "Hypertension - controlled" },
    ],
  },
  {
    id: "P-002", name: "Fatima Al-Rashid", age: 32, gender: "Female", bloodType: "O+", allergies: [], phone: "+966 54 234 5678",
    vitals: { bp: "120/75", heartRate: 72, temp: 36.6, weight: 65, height: 162, bmi: 24.8, spo2: 99 },
    conditions: ["Diabetes Type 2"],
    history: [
      { date: "2026-02-15", type: "Visit", doctor: "Dr. Omar Farouk", notes: "HbA1c at 7.2%. Increased Metformin to 1000mg. Diet counseling provided.", diagnosis: "T2DM - suboptimal control" },
      { date: "2026-01-05", type: "Lab Test", doctor: "Dr. Omar Farouk", notes: "Fasting glucose 145 mg/dL. Kidney function normal.", diagnosis: "T2DM" },
    ],
  },
  {
    id: "P-003", name: "Mohammad Khalid", age: 28, gender: "Male", bloodType: "B+", allergies: ["Aspirin", "Sulfa drugs"], phone: "+966 56 345 6789",
    vitals: { bp: "115/70", heartRate: 68, temp: 36.5, weight: 75, height: 180, bmi: 23.1, spo2: 98 },
    conditions: ["Seasonal Allergies", "Mild Asthma"],
    history: [
      { date: "2026-02-10", type: "Visit", doctor: "Dr. Sarah Khan", notes: "Seasonal allergies flare-up. Prescribed Cetirizine and nasal spray.", diagnosis: "Allergic Rhinitis" },
      { date: "2025-11-15", type: "Spirometry", doctor: "Dr. Sarah Khan", notes: "FEV1 at 85% predicted. Mild obstruction. Inhaler prescribed.", diagnosis: "Mild Asthma" },
    ],
  },
  {
    id: "P-005", name: "Yousef Al-Turki", age: 38, gender: "Male", bloodType: "AB+", allergies: [], phone: "+966 59 567 8901",
    vitals: { bp: "125/80", heartRate: 74, temp: 36.7, weight: 90, height: 178, bmi: 28.4, spo2: 98 },
    conditions: ["Chronic Back Pain", "Obesity"],
    history: [
      { date: "2026-02-19", type: "MRI", doctor: "Dr. Omar Farouk", notes: "L4-L5 disc bulge confirmed. Physical therapy recommended. No surgery needed.", diagnosis: "Lumbar Disc Herniation" },
      { date: "2026-01-25", type: "Visit", doctor: "Dr. Omar Farouk", notes: "Persistent lower back pain for 3 weeks. Ordered MRI. Prescribed muscle relaxant.", diagnosis: "Lower Back Pain" },
    ],
  },
];

const calendarDays = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  const dateStr = `2026-02-${String(day).padStart(2, "0")}`;
  const dayAppts = mockAppointments.filter(a => a.date === dateStr);
  return { day, date: dateStr, appointments: dayAppts };
});

const prescriptions = [
  { id: "RX-001", patient: "Ahmed Al-Hassan", doctor: "Dr. Sarah Khan", date: "2026-02-18", medications: [
    { name: "Lisinopril 20mg", dosage: "1 tablet daily", duration: "90 days", qty: 90 },
    { name: "Atorvastatin 20mg", dosage: "1 tablet at night", duration: "90 days", qty: 90 },
  ], status: "dispensed" as const, refills: 2, nextRefill: "2026-05-18" },
  { id: "RX-002", patient: "Fatima Al-Rashid", doctor: "Dr. Omar Farouk", date: "2026-02-15", medications: [
    { name: "Metformin 1000mg", dosage: "1 tablet twice daily", duration: "60 days", qty: 120 },
    { name: "Glimepiride 2mg", dosage: "1 tablet before breakfast", duration: "60 days", qty: 60 },
  ], status: "dispensed" as const, refills: 3, nextRefill: "2026-04-15" },
  { id: "RX-003", patient: "Mohammad Khalid", doctor: "Dr. Sarah Khan", date: "2026-02-10", medications: [
    { name: "Cetirizine 10mg", dosage: "1 tablet daily", duration: "30 days", qty: 30 },
    { name: "Fluticasone Nasal Spray", dosage: "2 sprays each nostril daily", duration: "30 days", qty: 1 },
    { name: "Salbutamol Inhaler", dosage: "2 puffs as needed", duration: "90 days", qty: 1 },
  ], status: "awaiting-pickup" as const, refills: 1, nextRefill: "2026-03-10" },
  { id: "RX-004", patient: "Yousef Al-Turki", doctor: "Dr. Omar Farouk", date: "2026-02-19", medications: [
    { name: "Cyclobenzaprine 10mg", dosage: "1 tablet 3x daily", duration: "14 days", qty: 42 },
    { name: "Naproxen 500mg", dosage: "1 tablet twice daily with food", duration: "14 days", qty: 28 },
  ], status: "dispensed" as const, refills: 0, nextRefill: "" },
  { id: "RX-005", patient: "Ahmed Al-Hassan", doctor: "Dr. Sarah Khan", date: "2026-01-20", medications: [
    { name: "Lisinopril 10mg", dosage: "1 tablet daily", duration: "30 days", qty: 30 },
  ], status: "refilled" as const, refills: 0, nextRefill: "" },
];

const HealthcarePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["patients", "appointments", "doctors", "pharmacy", "billing", "telemedicine", "records", "calendar", "prescriptions"] as const;
  type TabVal = typeof validTabs[number];
  const tabFromUrl = searchParams.get("tab") as TabVal | null;
  const currentTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "patients";
  const handleTabChange = (value: string) => {
    if (value === "patients") { searchParams.delete("tab"); } else { searchParams.set("tab", value); }
    setSearchParams(searchParams, { replace: true });
  };

  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [search, setSearch] = useState("");
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [addApptOpen, setAddApptOpen] = useState(false);

  // Patient Records tab filters
  const [recSearch, setRecSearch] = useState("");
  const [recCondition, setRecCondition] = useState("all");
  const [recDoctor, setRecDoctor] = useState("all");
  const [recSelectedVitals, setRecSelectedVitals] = useState<string | null>(null);

  const allConditions = [...new Set(patientRecords.flatMap(p => p.conditions))];
  const allRecDoctors = [...new Set(patientRecords.flatMap(p => p.history.map(h => h.doctor)))];

  const filteredRecords = useMemo(() => {
    return patientRecords.filter(pr => {
      const matchSearch = !recSearch ||
        pr.name.toLowerCase().includes(recSearch.toLowerCase()) ||
        pr.id.toLowerCase().includes(recSearch.toLowerCase()) ||
        pr.conditions.some(c => c.toLowerCase().includes(recSearch.toLowerCase()));
      const matchCondition = recCondition === "all" || pr.conditions.includes(recCondition);
      const matchDoctor = recDoctor === "all" || pr.history.some(h => h.doctor === recDoctor);
      return matchSearch && matchCondition && matchDoctor;
    });
  }, [recSearch, recCondition, recDoctor]);

  // Vitals history mock data for charts
  const vitalsHistory: Record<string, { date: string; bp_sys: number; bp_dia: number; hr: number; temp: number; weight: number; spo2: number }[]> = {
    "P-001": [
      { date: "Sep '25", bp_sys: 145, bp_dia: 95, hr: 82, temp: 36.9, weight: 85, spo2: 96 },
      { date: "Oct '25", bp_sys: 142, bp_dia: 92, hr: 80, temp: 36.8, weight: 84, spo2: 97 },
      { date: "Nov '25", bp_sys: 138, bp_dia: 90, hr: 79, temp: 36.7, weight: 83, spo2: 97 },
      { date: "Dec '25", bp_sys: 135, bp_dia: 85, hr: 78, temp: 36.8, weight: 83, spo2: 97 },
      { date: "Jan '26", bp_sys: 140, bp_dia: 88, hr: 80, temp: 36.8, weight: 82, spo2: 97 },
      { date: "Feb '26", bp_sys: 140, bp_dia: 90, hr: 78, temp: 36.8, weight: 82, spo2: 97 },
    ],
    "P-002": [
      { date: "Sep '25", bp_sys: 125, bp_dia: 80, hr: 76, temp: 36.5, weight: 68, spo2: 98 },
      { date: "Oct '25", bp_sys: 122, bp_dia: 78, hr: 74, temp: 36.6, weight: 67, spo2: 99 },
      { date: "Nov '25", bp_sys: 120, bp_dia: 76, hr: 73, temp: 36.6, weight: 66, spo2: 99 },
      { date: "Dec '25", bp_sys: 118, bp_dia: 75, hr: 72, temp: 36.5, weight: 66, spo2: 99 },
      { date: "Jan '26", bp_sys: 121, bp_dia: 76, hr: 73, temp: 36.6, weight: 65, spo2: 99 },
      { date: "Feb '26", bp_sys: 120, bp_dia: 75, hr: 72, temp: 36.6, weight: 65, spo2: 99 },
    ],
    "P-003": [
      { date: "Sep '25", bp_sys: 118, bp_dia: 72, hr: 70, temp: 36.5, weight: 76, spo2: 98 },
      { date: "Oct '25", bp_sys: 116, bp_dia: 71, hr: 69, temp: 36.4, weight: 76, spo2: 98 },
      { date: "Nov '25", bp_sys: 115, bp_dia: 70, hr: 68, temp: 36.5, weight: 75, spo2: 98 },
      { date: "Dec '25", bp_sys: 117, bp_dia: 72, hr: 69, temp: 36.5, weight: 75, spo2: 98 },
      { date: "Jan '26", bp_sys: 116, bp_dia: 71, hr: 68, temp: 36.5, weight: 75, spo2: 98 },
      { date: "Feb '26", bp_sys: 115, bp_dia: 70, hr: 68, temp: 36.5, weight: 75, spo2: 98 },
    ],
    "P-005": [
      { date: "Sep '25", bp_sys: 130, bp_dia: 85, hr: 78, temp: 36.7, weight: 93, spo2: 97 },
      { date: "Oct '25", bp_sys: 128, bp_dia: 83, hr: 76, temp: 36.7, weight: 92, spo2: 98 },
      { date: "Nov '25", bp_sys: 127, bp_dia: 82, hr: 75, temp: 36.7, weight: 91, spo2: 98 },
      { date: "Dec '25", bp_sys: 126, bp_dia: 81, hr: 75, temp: 36.7, weight: 91, spo2: 98 },
      { date: "Jan '26", bp_sys: 125, bp_dia: 80, hr: 74, temp: 36.7, weight: 90, spo2: 98 },
      { date: "Feb '26", bp_sys: 125, bp_dia: 80, hr: 74, temp: 36.7, weight: 90, spo2: 98 },
    ],
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  const todayAppts = appointments.filter(a => a.date === "2026-02-20");
  const scheduledCount = appointments.filter(a => a.status === "scheduled").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;

  const handleExportPatientPDF = (pr: typeof patientRecords[0]) => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();

    // Header bar
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pw, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Medical Report", 14, 18);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pw - 14, 18, { align: "right" });

    // Patient info
    doc.setTextColor(30, 30, 30);
    let y = 38;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(pr.name, 14, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`ID: ${pr.id}  |  ${pr.age}y, ${pr.gender}  |  Blood Type: ${pr.bloodType}  |  Phone: ${pr.phone}`, 14, y + 6);
    y += 16;

    // Allergies
    if (pr.allergies.length > 0) {
      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.text(`âš  Allergies: ${pr.allergies.join(", ")}`, 14, y);
      y += 8;
    }

    // Conditions
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.text(`Active Conditions: ${pr.conditions.join(", ")}`, 14, y);
    y += 10;

    // Current Vitals table
    doc.setFontSize(11);
    doc.text("Current Vitals", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y,
      head: [["BP", "Heart Rate", "Temp", "Weight", "Height", "BMI", "SpO2"]],
      body: [[pr.vitals.bp, `${pr.vitals.heartRate} bpm`, `${pr.vitals.temp} Â°C`, `${pr.vitals.weight} kg`, `${pr.vitals.height} cm`, String(pr.vitals.bmi), `${pr.vitals.spo2}%`]],
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
      theme: "grid",
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Vitals History table (if available)
    const vHistory = vitalsHistory[pr.id];
    if (vHistory && vHistory.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Vitals History (6 Months)", 14, y);
      y += 2;
      autoTable(doc, {
        startY: y,
        head: [["Period", "BP (mmHg)", "HR (bpm)", "Temp (Â°C)", "Weight (kg)", "SpO2 (%)"]],
        body: vHistory.map(d => [d.date, `${d.bp_sys}/${d.bp_dia}`, String(d.hr), String(d.temp), String(d.weight), `${d.spo2}%`]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [100, 116, 139], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Medical History table
    if (pr.history.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Medical History", 14, y);
      y += 2;
      autoTable(doc, {
        startY: y,
        head: [["Date", "Type", "Diagnosis", "Doctor", "Notes"]],
        body: pr.history.map(h => [h.date, h.type, h.diagnosis, h.doctor, h.notes]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: { 4: { cellWidth: 60 } },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text("This is a computer-generated medical report. Confidential â€” for authorized use only.", pw / 2, footerY, { align: "center" });

    doc.save(`Patient_Report_${pr.id}_${pr.name.replace(/\s+/g, "_")}.pdf`);
    toast.success(`${pr.name}-à¦à¦° à¦°à¦¿à¦ªà§‹à¦°à§à¦Ÿ PDF à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦¹à¦¯à¦¼à§‡à¦›à§‡`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Healthcare Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage patients, appointments, and medical records</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{patients.length}</p><p className="text-xs text-muted-foreground">Total Patients</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10"><Calendar className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{todayAppts.length}</p><p className="text-xs text-muted-foreground">Today's Appts</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{completedCount}</p><p className="text-xs text-muted-foreground">Completed</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{scheduledCount}</p><p className="text-xs text-muted-foreground">Upcoming</p></div>
          </CardContent></Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="patients" className="gap-1.5"><Users className="h-4 w-4" /> Patients</TabsTrigger>
            <TabsTrigger value="appointments" className="gap-1.5"><Calendar className="h-4 w-4" /> Appointments</TabsTrigger>
            <TabsTrigger value="records" className="gap-1.5"><ClipboardList className="h-4 w-4" /> Patient Records</TabsTrigger>
            <TabsTrigger value="calendar" className="gap-1.5"><CalendarDays className="h-4 w-4" /> Calendar</TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-1.5"><FileCheck className="h-4 w-4" /> Prescriptions</TabsTrigger>
            <TabsTrigger value="doctors" className="gap-1.5"><Stethoscope className="h-4 w-4" /> Doctors</TabsTrigger>
            <TabsTrigger value="pharmacy" className="gap-1.5"><Pill className="h-4 w-4" /> Pharmacy</TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5"><Receipt className="h-4 w-4" /> Billing</TabsTrigger>
            <TabsTrigger value="telemedicine" className="gap-1.5"><Video className="h-4 w-4" /> Telemedicine</TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Patient Records</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
                  </div>
                  <Button size="sm" className="gap-1.5" onClick={() => setAddPatientOpen(true)}><Plus className="h-4 w-4" /> Add Patient</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.id}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.age}</TableCell>
                        <TableCell>{p.condition}</TableCell>
                        <TableCell className="text-sm">{p.doctor}</TableCell>
                        <TableCell className="text-sm">{p.lastVisit}</TableCell>
                        <TableCell><Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Appointment Schedule</CardTitle>
                <Button size="sm" className="gap-1.5" onClick={() => setAddApptOpen(true)}><Plus className="h-4 w-4" /> New Appointment</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono text-xs">{a.id}</TableCell>
                        <TableCell className="font-medium">{a.patientName}</TableCell>
                        <TableCell>{a.doctor}</TableCell>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.time}</TableCell>
                        <TableCell><Badge variant="outline">{a.type}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className={statusColors[a.status]}>{a.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          {a.status === "scheduled" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setAppointments(prev => prev.map(ap => ap.id === a.id ? { ...ap, status: "completed" as const } : ap));
                                toast.success("Appointment marked as completed");
                              }}><CheckCircle2 className="h-4 w-4 text-emerald-500" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setAppointments(prev => prev.map(ap => ap.id === a.id ? { ...ap, status: "cancelled" as const } : ap));
                                toast.info("Appointment cancelled");
                              }}><X className="h-4 w-4 text-destructive" /></Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((doc, i) => (
                <Card key={doc}>
                  <CardContent className="p-5 text-center space-y-3">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{doc}</h3>
                      <p className="text-xs text-muted-foreground">{["Cardiologist", "General Physician", "Orthopedic", "Dermatologist"][i]}</p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{[12, 8, 15, 6][i]} patients today</Badge>
                    </div>
                    <div className="flex gap-1.5 justify-center text-xs text-muted-foreground">
                      <span>â­ {[4.9, 4.7, 4.8, 4.6][i]}</span>
                      <span>â€¢</span>
                      <span>{[120, 95, 140, 78][i]} reviews</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">View Schedule</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pharmacy Tab */}
          <TabsContent value="pharmacy">
            <div className="space-y-4">
              {/* Pharmacy Stats */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Package className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockMedications.length}</p><p className="text-xs text-muted-foreground">Total Items</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockMedications.filter(m => m.status === "in-stock").length}</p><p className="text-xs text-muted-foreground">In Stock</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertCircle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockMedications.filter(m => m.status === "low-stock").length}</p><p className="text-xs text-muted-foreground">Low Stock</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><X className="h-5 w-5 text-destructive" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockMedications.filter(m => m.status === "expired").length}</p><p className="text-xs text-muted-foreground">Expired</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Medication Inventory</CardTitle>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Medication</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Medication</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMedications.map(m => (
                        <TableRow key={m.id}>
                          <TableCell className="font-mono text-xs">{m.id}</TableCell>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-sm">{m.category}</TableCell>
                          <TableCell>{m.stock} {m.unit}</TableCell>
                          <TableCell className="font-medium">${m.price.toFixed(2)}</TableCell>
                          <TableCell className="text-sm">{m.expiry}</TableCell>
                          <TableCell className="text-sm">{m.supplier}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColors[m.status]}>{m.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-4">
              {/* Billing Stats */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Receipt className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{mockInvoices.length}</p><p className="text-xs text-muted-foreground">Total Invoices</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${mockInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Collected</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${mockInvoices.filter(i => i.status === "pending").reduce((s, i) => s + i.total, 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Pending</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><AlertCircle className="h-5 w-5 text-destructive" /></div>
                  <div><p className="text-2xl font-bold text-foreground">${mockInvoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.total, 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Overdue</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Patient Invoices</CardTitle>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Invoice</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInvoices.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                          <TableCell className="font-medium">{inv.patientName}</TableCell>
                          <TableCell className="text-sm">{inv.doctor}</TableCell>
                          <TableCell className="text-sm">{inv.date}</TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              {inv.items.map((item, i) => (
                                <div key={i} className="text-xs text-muted-foreground">{item.desc}: <span className="text-foreground font-medium">${item.amount}</span></div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-foreground">${inv.total.toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColors[inv.status]}>{inv.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button>
                            {inv.status !== "paid" && (
                              <Button variant="ghost" size="sm" onClick={() => toast.success(`Invoice ${inv.id} marked as paid`)}><CreditCard className="h-4 w-4 text-emerald-500" /></Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Telemedicine Tab */}
          <TabsContent value="telemedicine">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Active Sessions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { patient: "Ahmed Al-Hassan", doctor: "Dr. Sarah Khan", duration: "15 min", status: "Live" },
                    { patient: "Fatima Al-Rashid", doctor: "Dr. Omar Farouk", duration: "Waiting", status: "Queued" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div>
                        <p className="font-medium text-sm text-foreground">{s.patient}</p>
                        <p className="text-xs text-muted-foreground">{s.doctor} â€¢ {s.duration}</p>
                      </div>
                      <Badge variant="outline" className={s.status === "Live" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}>{s.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Session Stats</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Sessions Today</span><span className="font-bold text-foreground">24</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Duration</span><span className="font-bold text-foreground">18 min</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Patient Satisfaction</span><span className="font-bold text-foreground">4.8 â­</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">No-show Rate</span><span className="font-bold text-foreground">3.2%</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Patient Records Tab ============ */}
          <TabsContent value="records">
            <div className="space-y-4">
              {/* Search & Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search patient name, ID or condition..." value={recSearch} onChange={e => setRecSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={recCondition} onValueChange={setRecCondition}>
                      <SelectTrigger className="w-[170px]"><SelectValue placeholder="Condition" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        {allConditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={recDoctor} onValueChange={setRecDoctor}>
                      <SelectTrigger className="w-[170px]"><SelectValue placeholder="Doctor" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Doctors</SelectItem>
                        {allRecDoctors.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><ClipboardList className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredRecords.length}</p><p className="text-xs text-muted-foreground">Matching Records</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><Activity className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredRecords.reduce((s, p) => s + p.history.length, 0)}</p><p className="text-xs text-muted-foreground">Total Visits</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10"><AlertCircle className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredRecords.reduce((s, p) => s + p.allergies.length, 0)}</p><p className="text-xs text-muted-foreground">Allergy Alerts</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Heart className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{filteredRecords.reduce((s, p) => s + p.conditions.length, 0)}</p><p className="text-xs text-muted-foreground">Active Conditions</p></div>
                </CardContent></Card>
              </div>

              {/* Vitals History Chart (when a patient is selected) */}
              {recSelectedVitals && vitalsHistory[recSelectedVitals] && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Vitals History â€” {patientRecords.find(p => p.id === recSelectedVitals)?.name}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setRecSelectedVitals(null)}><X className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const data = vitalsHistory[recSelectedVitals];
                      const metrics = [
                        { key: "bp_sys" as const, label: "Systolic BP", unit: "mmHg", color: "bg-destructive", maxRef: 140 },
                        { key: "bp_dia" as const, label: "Diastolic BP", unit: "mmHg", color: "bg-amber-500", maxRef: 90 },
                        { key: "hr" as const, label: "Heart Rate", unit: "bpm", color: "bg-primary", maxRef: 100 },
                        { key: "weight" as const, label: "Weight", unit: "kg", color: "bg-violet-500", maxRef: null },
                        { key: "spo2" as const, label: "SpO2", unit: "%", color: "bg-emerald-500", maxRef: null },
                      ];
                      return (
                        <div className="space-y-4">
                          {/* Chart Grid */}
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {metrics.map(metric => {
                              const values = data.map(d => d[metric.key]);
                              const max = Math.max(...values);
                              const min = Math.min(...values);
                              const range = max - min || 1;
                              const latest = values[values.length - 1];
                              const prev = values[values.length - 2];
                              const change = latest - prev;
                              return (
                                <div key={metric.key} className="rounded-xl border border-border p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-bold text-foreground">{latest}</span>
                                      <span className="text-[10px] text-muted-foreground">{metric.unit}</span>
                                      {change !== 0 && (
                                        <span className={`text-[10px] font-medium ${change > 0 ? "text-destructive" : "text-emerald-500"}`}>
                                          {change > 0 ? "â†‘" : "â†“"}{Math.abs(change)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {/* Bar chart */}
                                  <div className="flex items-end gap-1 h-16">
                                    {data.map((d, i) => {
                                      const val = d[metric.key];
                                      const h = ((val - min + range * 0.1) / (range * 1.2)) * 100;
                                      const isAlert = metric.maxRef && val >= metric.maxRef;
                                      return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5" title={`${d.date}: ${val} ${metric.unit}`}>
                                          <div
                                            className={`w-full rounded-sm transition-all ${isAlert ? "bg-destructive/70" : metric.color + "/60"}`}
                                            style={{ height: `${Math.max(h, 8)}%` }}
                                          />
                                          <span className="text-[8px] text-muted-foreground leading-none">{d.date.split(" ")[0]}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {metric.maxRef && (
                                    <p className="text-[10px] text-muted-foreground">Normal: &lt;{metric.maxRef} {metric.unit}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {/* Data Table */}
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Period</TableHead>
                                <TableHead className="text-xs">BP (mmHg)</TableHead>
                                <TableHead className="text-xs">HR (bpm)</TableHead>
                                <TableHead className="text-xs">Temp (Â°C)</TableHead>
                                <TableHead className="text-xs">Weight (kg)</TableHead>
                                <TableHead className="text-xs">SpO2 (%)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.map((d, i) => (
                                <TableRow key={i}>
                                  <TableCell className="text-xs font-medium text-foreground">{d.date}</TableCell>
                                  <TableCell className={`text-xs ${d.bp_sys >= 140 ? "text-destructive font-medium" : "text-foreground"}`}>{d.bp_sys}/{d.bp_dia}</TableCell>
                                  <TableCell className="text-xs text-foreground">{d.hr}</TableCell>
                                  <TableCell className="text-xs text-foreground">{d.temp}</TableCell>
                                  <TableCell className="text-xs text-foreground">{d.weight}</TableCell>
                                  <TableCell className="text-xs text-foreground">{d.spo2}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {filteredRecords.length === 0 && (
                <Card><CardContent className="p-8 text-center text-muted-foreground">No patient records match your search criteria.</CardContent></Card>
              )}

              {filteredRecords.map(pr => (
                <Card key={pr.id} className="overflow-hidden">
                  {/* Patient Header */}
                  <div className="flex items-center justify-between bg-muted/30 px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {pr.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{pr.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{pr.age}y â€¢ {pr.gender}</span>
                          <span>Blood: <strong className="text-foreground">{pr.bloodType}</strong></span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {pr.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => handleExportPatientPDF(pr)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download PDF
                      </Button>
                      <Button
                        variant={recSelectedVitals === pr.id ? "default" : "outline"}
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => setRecSelectedVitals(recSelectedVitals === pr.id ? null : pr.id)}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        Vitals History
                      </Button>
                      <Badge variant="outline" className="font-mono text-xs">{pr.id}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    {/* Vitals Grid */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5 text-primary" /> Current Vitals</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                        {[
                          { label: "BP", value: pr.vitals.bp, unit: "mmHg", icon: <Heart className="h-3.5 w-3.5" />, alert: parseInt(pr.vitals.bp) > 130 },
                          { label: "Heart Rate", value: pr.vitals.heartRate, unit: "bpm", icon: <Activity className="h-3.5 w-3.5" /> },
                          { label: "Temp", value: pr.vitals.temp, unit: "Â°C", icon: <Thermometer className="h-3.5 w-3.5" /> },
                          { label: "Weight", value: pr.vitals.weight, unit: "kg", icon: <Weight className="h-3.5 w-3.5" /> },
                          { label: "Height", value: pr.vitals.height, unit: "cm", icon: <Ruler className="h-3.5 w-3.5" /> },
                          { label: "BMI", value: pr.vitals.bmi, unit: "", icon: <TrendingUp className="h-3.5 w-3.5" />, alert: pr.vitals.bmi > 25 },
                          { label: "SpO2", value: pr.vitals.spo2, unit: "%", icon: <Droplets className="h-3.5 w-3.5" /> },
                        ].map(v => (
                          <div key={v.label} className={`rounded-lg border p-2 text-center ${v.alert ? "border-amber-500/40 bg-amber-500/5" : "border-border"}`}>
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">{v.icon}<span className="text-[10px]">{v.label}</span></div>
                            <p className={`text-sm font-bold ${v.alert ? "text-amber-500" : "text-foreground"}`}>{v.value}</p>
                            {v.unit && <p className="text-[10px] text-muted-foreground">{v.unit}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conditions & Allergies */}
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <span className="text-[11px] text-muted-foreground mr-2">Conditions:</span>
                        {pr.conditions.map(c => <Badge key={c} variant="outline" className="text-[10px] mr-1 bg-primary/5 border-primary/20">{c}</Badge>)}
                      </div>
                      {pr.allergies.length > 0 && (
                        <div>
                          <span className="text-[11px] text-muted-foreground mr-2">âš ï¸ Allergies:</span>
                          {pr.allergies.map(a => <Badge key={a} variant="outline" className="text-[10px] mr-1 bg-destructive/10 text-destructive border-destructive/30">{a}</Badge>)}
                        </div>
                      )}
                    </div>

                    {/* Medical History Timeline */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> Medical History</h4>
                      <div className="space-y-2">
                        {pr.history.map((h, i) => (
                          <div key={i} className="flex gap-3 rounded-lg border border-border p-3 hover:border-primary/30 transition-colors">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                              {h.type === "Visit" ? <Stethoscope className="h-4 w-4 text-primary" /> :
                               h.type === "Lab Test" ? <FileText className="h-4 w-4 text-primary" /> :
                               <Eye className="h-4 w-4 text-primary" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground">{h.type}</span>
                                <Badge variant="outline" className="text-[10px]">{h.diagnosis}</Badge>
                                <span className="text-[11px] text-muted-foreground ml-auto">{h.date}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{h.notes}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">By {h.doctor}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ============ Appointment Calendar Tab ============ */}
          <TabsContent value="calendar">
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> February 2026</CardTitle>
                  <Button size="sm" className="gap-1.5" onClick={() => setAddApptOpen(true)}><Plus className="h-4 w-4" /> New Appointment</Button>
                </CardHeader>
                <CardContent>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                      <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1">{d}</div>
                    ))}
                  </div>
                  {/* Calendar Grid â€” Feb 2026 starts on Sunday */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map(cd => {
                      const isToday = cd.day === 20;
                      const hasAppts = cd.appointments.length > 0;
                      return (
                        <div
                          key={cd.day}
                          className={`min-h-[80px] rounded-lg border p-1.5 transition-colors ${
                            isToday ? "border-primary bg-primary/5 ring-1 ring-primary/20" :
                            hasAppts ? "border-border hover:border-primary/40" : "border-border/50"
                          }`}
                        >
                          <span className={`text-xs font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{cd.day}</span>
                          {cd.appointments.map(a => (
                            <div
                              key={a.id}
                              className={`mt-1 rounded px-1.5 py-0.5 text-[10px] leading-tight truncate ${
                                a.status === "completed" ? "bg-emerald-500/15 text-emerald-600" :
                                a.status === "cancelled" ? "bg-destructive/10 text-destructive line-through" :
                                "bg-blue-500/15 text-blue-600"
                              }`}
                              title={`${a.time} â€” ${a.patientName} (${a.doctor})`}
                            >
                              {a.time} {a.patientName.split(" ")[0]}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Today's Schedule â€” Feb 20</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todayAppts.length > 0 ? todayAppts.map(a => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-3 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{a.time} â€” {a.patientName}</p>
                            <p className="text-xs text-muted-foreground">{a.doctor} â€¢ {a.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={statusColors[a.status]}>{a.status}</Badge>
                          {a.status === "scheduled" && (
                            <Button variant="ghost" size="sm" onClick={() => {
                              setAppointments(prev => prev.map(ap => ap.id === a.id ? { ...ap, status: "completed" as const } : ap));
                              toast.success("Marked as completed");
                            }}><CheckCircle2 className="h-4 w-4 text-emerald-500" /></Button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">No appointments for today</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ Prescription Management Tab ============ */}
          <TabsContent value="prescriptions">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><FileCheck className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{prescriptions.length}</p><p className="text-xs text-muted-foreground">Total Prescriptions</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{prescriptions.filter(p => p.status === "dispensed").length}</p><p className="text-xs text-muted-foreground">Dispensed</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10"><Package className="h-5 w-5 text-blue-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{prescriptions.filter(p => p.status === "awaiting-pickup").length}</p><p className="text-xs text-muted-foreground">Awaiting Pickup</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Pill className="h-5 w-5 text-violet-500" /></div>
                  <div><p className="text-2xl font-bold text-foreground">{prescriptions.reduce((s, p) => s + p.medications.length, 0)}</p><p className="text-xs text-muted-foreground">Total Medications</p></div>
                </CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><FileCheck className="h-5 w-5 text-primary" /> Prescriptions</CardTitle>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Prescription</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prescriptions.map(rx => (
                      <div key={rx.id} className="rounded-xl border border-border p-4 space-y-3 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                              <FileCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-foreground">{rx.patient}</h4>
                                <Badge variant="outline" className={statusColors[rx.status]}>{rx.status}</Badge>
                                <Badge variant="outline" className="font-mono text-[10px]">{rx.id}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{rx.doctor} â€¢ {rx.date}</p>
                            </div>
                          </div>
                          <div className="text-right text-xs">
                            {rx.refills > 0 && (
                              <div className="text-muted-foreground">
                                <span className="font-medium text-foreground">{rx.refills}</span> refills left
                              </div>
                            )}
                            {rx.nextRefill && (
                              <p className="text-muted-foreground mt-0.5">Next: {rx.nextRefill}</p>
                            )}
                          </div>
                        </div>

                        {/* Medications Table */}
                        <div className="rounded-lg border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/30 text-xs text-muted-foreground">
                                <th className="text-left p-2 font-medium">Medication</th>
                                <th className="text-left p-2 font-medium">Dosage</th>
                                <th className="text-left p-2 font-medium">Duration</th>
                                <th className="text-right p-2 font-medium">Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rx.medications.map((m, i) => (
                                <tr key={i} className="border-t border-border">
                                  <td className="p-2 font-medium text-foreground flex items-center gap-1.5">
                                    <Pill className="h-3.5 w-3.5 text-primary shrink-0" /> {m.name}
                                  </td>
                                  <td className="p-2 text-xs text-muted-foreground">{m.dosage}</td>
                                  <td className="p-2 text-xs text-muted-foreground">{m.duration}</td>
                                  <td className="p-2 text-right font-medium text-foreground">{m.qty}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Patient</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Full Name</Label><Input placeholder="Patient name" /></div>
              <div><Label>Age</Label><Input type="number" placeholder="Age" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input placeholder="+966 5X XXX XXXX" /></div>
              <div><Label>Email</Label><Input placeholder="email@example.com" /></div>
            </div>
            <div><Label>Medical Condition</Label><Textarea placeholder="Describe condition..." /></div>
            <div><Label>Assigned Doctor</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>{doctors.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPatientOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddPatientOpen(false); toast.success("Patient added successfully! ðŸ¥"); }}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog open={addApptOpen} onOpenChange={setAddApptOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Appointment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Patient Name</Label><Input placeholder="Search or enter patient name" /></div>
            <div><Label>Doctor</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>{doctors.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" /></div>
              <div><Label>Time</Label><Input type="time" /></div>
            </div>
            <div><Label>Type</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="check-up">Check-up</SelectItem>
                  <SelectItem value="first-visit">First Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddApptOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddApptOpen(false); toast.success("Appointment scheduled! ðŸ“…"); }}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HealthcarePage;
