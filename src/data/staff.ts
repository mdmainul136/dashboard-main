export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Inactive";
  shift: "Morning" | "Afternoon" | "Night";
  joinDate: string;
  salary: number;
  performance: number; // 1-5
  avatar: string;
}

const initialStaff: StaffMember[] = [
  { id: "s1", name: "আহমেদ হাসান", role: "Store Manager", department: "Management", email: "ahmed@store.com", phone: "+880-1711-111111", status: "Active", shift: "Morning", joinDate: "2022-01-15", salary: 45000, performance: 5, avatar: "👨‍💼" },
  { id: "s2", name: "ফাতিমা আক্তার", role: "Cashier", department: "Sales", email: "fatima@store.com", phone: "+880-1722-222222", status: "Active", shift: "Morning", joinDate: "2023-03-20", salary: 22000, performance: 4, avatar: "👩‍💼" },
  { id: "s3", name: "রহিম উদ্দিন", role: "Warehouse Staff", department: "Inventory", email: "rahim@store.com", phone: "+880-1733-333333", status: "Active", shift: "Afternoon", joinDate: "2023-06-01", salary: 18000, performance: 3, avatar: "👷" },
  { id: "s4", name: "নাসরিন বেগম", role: "Accountant", department: "Finance", email: "nasrin@store.com", phone: "+880-1744-444444", status: "Active", shift: "Morning", joinDate: "2022-08-10", salary: 35000, performance: 4, avatar: "👩‍💻" },
  { id: "s5", name: "করিম মিয়া", role: "Delivery Driver", department: "Logistics", email: "karim@store.com", phone: "+880-1755-555555", status: "On Leave", shift: "Morning", joinDate: "2023-09-15", salary: 15000, performance: 3, avatar: "🚗" },
  { id: "s6", name: "সুমাইয়া খান", role: "Customer Support", department: "Sales", email: "sumaiya@store.com", phone: "+880-1766-666666", status: "Active", shift: "Afternoon", joinDate: "2024-01-05", salary: 20000, performance: 4, avatar: "👩‍🔧" },
  { id: "s7", name: "তানভীর ইসলাম", role: "IT Support", department: "IT", email: "tanvir@store.com", phone: "+880-1777-777777", status: "Active", shift: "Morning", joinDate: "2023-11-20", salary: 30000, performance: 5, avatar: "👨‍💻" },
  { id: "s8", name: "মারিয়া রহমান", role: "Cashier", department: "Sales", email: "maria@store.com", phone: "+880-1788-888888", status: "Inactive", shift: "Night", joinDate: "2024-02-14", salary: 22000, performance: 2, avatar: "👩" },
];

type Listener = () => void;
const listeners = new Set<Listener>();
let staff = [...initialStaff];

export function getStaff(): StaffMember[] { return staff; }

export function addStaffMember(member: StaffMember) {
  staff = [...staff, member];
  listeners.forEach(fn => fn());
}

export function updateStaffMember(id: string, updates: Partial<StaffMember>) {
  staff = staff.map(s => s.id === id ? { ...s, ...updates } : s);
  listeners.forEach(fn => fn());
}

export function deleteStaffMember(id: string) {
  staff = staff.filter(s => s.id !== id);
  listeners.forEach(fn => fn());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
