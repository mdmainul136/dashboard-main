export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "export" | "approve" | "refund";
  module: "orders" | "inventory" | "finance" | "hr" | "pos" | "crm" | "settings" | "auth";
  description: string;
  details?: string;
}

let entries: AuditEntry[] = [
  { id: "AL-001", timestamp: "2025-02-19T09:12:00", user: "Rafiq Ahmed", action: "login", module: "auth", description: "User logged in from Dhaka" },
  { id: "AL-002", timestamp: "2025-02-19T09:15:00", user: "Rafiq Ahmed", action: "create", module: "orders", description: "Created Order #ORD-1045", details: "3 items, total ৳4,500" },
  { id: "AL-003", timestamp: "2025-02-19T09:32:00", user: "Nasreen Akter", action: "update", module: "inventory", description: "Updated stock for 'Wireless Mouse'", details: "Quantity: 50 → 45" },
  { id: "AL-004", timestamp: "2025-02-19T10:05:00", user: "Admin", action: "approve", module: "finance", description: "Approved expense EXP-004", details: "February Staff Salaries - ৳450,000" },
  { id: "AL-005", timestamp: "2025-02-19T10:20:00", user: "Kamal Hossain", action: "create", module: "pos", description: "POS Sale #POS-892", details: "2 items, cash payment ৳1,200" },
  { id: "AL-006", timestamp: "2025-02-19T10:45:00", user: "Admin", action: "update", module: "hr", description: "Changed shift for Tahmina Begum", details: "Morning → Evening" },
  { id: "AL-007", timestamp: "2025-02-19T11:00:00", user: "Rafiq Ahmed", action: "export", module: "finance", description: "Exported Sales Report (Feb 2025)" },
  { id: "AL-008", timestamp: "2025-02-19T11:30:00", user: "Nasreen Akter", action: "refund", module: "orders", description: "Refunded Order #ORD-1038", details: "Reason: Defective product, ৳2,300" },
  { id: "AL-009", timestamp: "2025-02-19T12:00:00", user: "Admin", action: "create", module: "crm", description: "Added new customer 'Farhan Corp'" },
  { id: "AL-010", timestamp: "2025-02-19T12:15:00", user: "Admin", action: "update", module: "settings", description: "Updated VAT rate", details: "15% → 7.5%" },
  { id: "AL-011", timestamp: "2025-02-19T13:00:00", user: "Kamal Hossain", action: "delete", module: "inventory", description: "Removed expired product 'Screen Protector X'" },
  { id: "AL-012", timestamp: "2025-02-19T13:30:00", user: "Rafiq Ahmed", action: "logout", module: "auth", description: "User logged out" },
];

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((l) => l()); }

export function getAuditEntries() { return entries; }
export function subscribeAudit(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; }

export function addAuditEntry(e: Omit<AuditEntry, "id">) {
  const id = `AL-${String(entries.length + 1).padStart(3, "0")}`;
  entries = [{ ...e, id }, ...entries];
  emit();
}
