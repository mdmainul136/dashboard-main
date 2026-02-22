export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  manager: string;
  status: "active" | "inactive";
  totalStaff: number;
  monthlyRevenue: number;
  stockValue: number;
  createdAt: string;
}

let branches: Branch[] = [
  {
    id: "BR-001",
    name: "Main Store - Gulshan",
    address: "House 45, Road 11, Gulshan-2",
    city: "Dhaka",
    phone: "+880 1711-234567",
    manager: "Rafiq Ahmed",
    status: "active",
    totalStaff: 12,
    monthlyRevenue: 850000,
    stockValue: 2400000,
    createdAt: "2023-01-15",
  },
  {
    id: "BR-002",
    name: "Branch - Dhanmondi",
    address: "House 12, Road 27, Dhanmondi",
    city: "Dhaka",
    phone: "+880 1811-345678",
    manager: "Nasreen Akter",
    status: "active",
    totalStaff: 8,
    monthlyRevenue: 620000,
    stockValue: 1800000,
    createdAt: "2023-06-20",
  },
  {
    id: "BR-003",
    name: "Branch - Chattogram",
    address: "GEC Circle, Nasirabad",
    city: "Chattogram",
    phone: "+880 1911-456789",
    manager: "Kamal Hossain",
    status: "active",
    totalStaff: 6,
    monthlyRevenue: 430000,
    stockValue: 1200000,
    createdAt: "2024-02-10",
  },
  {
    id: "BR-004",
    name: "Branch - Sylhet",
    address: "Zindabazar, Sylhet Sadar",
    city: "Sylhet",
    phone: "+880 1611-567890",
    manager: "Tahmina Begum",
    status: "inactive",
    totalStaff: 4,
    monthlyRevenue: 0,
    stockValue: 650000,
    createdAt: "2024-08-05",
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((l) => l()); }

export function getBranches() { return branches; }
export function subscribeBranches(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; }

export function addBranch(b: Omit<Branch, "id">) {
  const id = `BR-${String(branches.length + 1).padStart(3, "0")}`;
  branches = [...branches, { ...b, id }];
  emit();
}

export function updateBranch(id: string, data: Partial<Branch>) {
  branches = branches.map((b) => (b.id === id ? { ...b, ...data } : b));
  emit();
}
