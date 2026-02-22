export interface Expense {
  id: string;
  date: string;
  category: "rent" | "utilities" | "salaries" | "marketing" | "supplies" | "logistics" | "other";
  description: string;
  amount: number;
  paymentMethod: "cash" | "bank" | "mobile";
  status: "pending" | "approved" | "paid";
  branch: string;
}

let expenses: Expense[] = [
  { id: "EXP-001", date: "2025-02-01", category: "rent", description: "Gulshan Store Monthly Rent", amount: 120000, paymentMethod: "bank", status: "paid", branch: "BR-001" },
  { id: "EXP-002", date: "2025-02-01", category: "rent", description: "Dhanmondi Branch Rent", amount: 85000, paymentMethod: "bank", status: "paid", branch: "BR-002" },
  { id: "EXP-003", date: "2025-02-03", category: "utilities", description: "Electricity Bill - Main Store", amount: 18500, paymentMethod: "bank", status: "paid", branch: "BR-001" },
  { id: "EXP-004", date: "2025-02-05", category: "salaries", description: "February Staff Salaries", amount: 450000, paymentMethod: "bank", status: "approved", branch: "BR-001" },
  { id: "EXP-005", date: "2025-02-07", category: "marketing", description: "Facebook Ads Campaign", amount: 25000, paymentMethod: "mobile", status: "paid", branch: "BR-001" },
  { id: "EXP-006", date: "2025-02-08", category: "supplies", description: "Packaging Materials", amount: 12000, paymentMethod: "cash", status: "paid", branch: "BR-001" },
  { id: "EXP-007", date: "2025-02-10", category: "logistics", description: "Delivery Service - Pathao", amount: 35000, paymentMethod: "mobile", status: "pending", branch: "BR-002" },
  { id: "EXP-008", date: "2025-02-12", category: "utilities", description: "Internet Bill - All Branches", amount: 8500, paymentMethod: "bank", status: "paid", branch: "BR-001" },
  { id: "EXP-009", date: "2025-02-14", category: "marketing", description: "Valentine Campaign Print", amount: 15000, paymentMethod: "cash", status: "paid", branch: "BR-003" },
  { id: "EXP-010", date: "2025-02-15", category: "other", description: "Office Furniture Repair", amount: 7500, paymentMethod: "cash", status: "pending", branch: "BR-001" },
];

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((l) => l()); }

export function getExpenses() { return expenses; }
export function subscribeExpenses(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; }

export function addExpense(e: Omit<Expense, "id">) {
  const id = `EXP-${String(expenses.length + 1).padStart(3, "0")}`;
  expenses = [...expenses, { ...e, id }];
  emit();
}

export function updateExpense(id: string, data: Partial<Expense>) {
  expenses = expenses.map((e) => (e.id === id ? { ...e, ...data } : e));
  emit();
}

export const expenseCategories = [
  { value: "rent", label: "Rent", color: "hsl(var(--chart-1))" },
  { value: "utilities", label: "Utilities", color: "hsl(var(--chart-2))" },
  { value: "salaries", label: "Salaries", color: "hsl(var(--chart-3))" },
  { value: "marketing", label: "Marketing", color: "hsl(var(--chart-4))" },
  { value: "supplies", label: "Supplies", color: "hsl(var(--chart-5))" },
  { value: "logistics", label: "Logistics", color: "hsl(var(--primary))" },
  { value: "other", label: "Other", color: "hsl(var(--muted-foreground))" },
] as const;
