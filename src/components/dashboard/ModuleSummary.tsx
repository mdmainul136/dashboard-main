"use client";

import { useMemo } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getSuppliers, subscribe as subSup } from "@/data/suppliers";
import { getPurchaseOrders, subscribe as subPO } from "@/data/purchaseOrders";
import { getProducts, subscribe as subProd, getProductStatus } from "@/data/products";
import { getStaff, subscribe as subStaff } from "@/data/staff";
import { getLoyaltyCustomers, subscribeCustomers as subLoyalty, getCoupons, subscribeCoupons as subCoupons } from "@/data/loyalty";
import { getBranches, subscribeBranches as subBranch } from "@/data/branches";
import { getExpenses, subscribeExpenses as subExp } from "@/data/expenses";
import { getReviews, subscribeReviews as subRev } from "@/data/reviews";
import { useSyncExternalStore } from "react";
import { useMerchantRegion, type BusinessPurpose } from "@/hooks/useMerchantRegion";
import {
  Truck, ClipboardList, RotateCcw, ArrowRight, DollarSign, Users,
  Package, AlertTriangle, Globe, Percent, Crown,
  Plus, ShoppingCart, FileText, UserPlus, UserCog, Gift, Star, Ticket,
  Building2, Receipt, MessageSquare, Heart, CalendarCheck, GraduationCap,
  Dumbbell, Scissors, Briefcase, Plane, Car, PartyPopper, Rocket,
  BookOpen, Video, Wrench, MapPin, Image, Code, BarChart3, ShieldCheck,
} from "lucide-react";

function useSuppliers() { return useSyncExternalStore(subSup, getSuppliers, getSuppliers); }
function usePOs() { return useSyncExternalStore(subPO, getPurchaseOrders, getPurchaseOrders); }
function useProducts() { return useSyncExternalStore(subProd, getProducts, getProducts); }
function useStaffData() { return useSyncExternalStore(subStaff, getStaff, getStaff); }
function useLoyaltyData() { return useSyncExternalStore(subLoyalty, getLoyaltyCustomers, getLoyaltyCustomers); }
function useCouponsData() { return useSyncExternalStore(subCoupons, getCoupons, getCoupons); }
function useBranchData() { return useSyncExternalStore(subBranch, getBranches, getBranches); }
function useExpenseData() { return useSyncExternalStore(subExp, getExpenses, getExpenses); }
function useReviewData() { return useSyncExternalStore(subRev, getReviews, getReviews); }

interface WidgetProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const Widget = ({ title, value, subtitle, icon, color, link }: WidgetProps) => (
  <Link href={link}>
    <Card className="group transition-all duration-300 hover:shadow-md hover:border-border cursor-pointer h-full border-border/60 rounded-2xl">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${color}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground tracking-tight">{value}</p>
          <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
      </CardContent>
    </Card>
  </Link>
);

// â”€â”€â”€ Business-type specific widget configs â”€â”€â”€
interface WidgetSection {
  title: string;
  widgets: WidgetProps[];
  cols?: number;
}

const ModuleSummary = () => {
  const { orders } = useCart();
  const suppliers = useSuppliers();
  const pos = usePOs();
  const products = useProducts();
  const router = useRouter();
  const staffMembers = useStaffData();
  const loyaltyCustomers = useLoyaltyData();
  const couponsData = useCouponsData();
  const branchesData = useBranchData();
  const expensesData = useExpenseData();
  const reviewsData = useReviewData();
  const { businessPurpose, isModuleAvailable } = useMerchantRegion();

  const isEcommerce = !businessPurpose || businessPurpose === "ecommerce";

  // Computed values
  const salesRevenue = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  const activeSuppliers = useMemo(() => suppliers.filter(s => s.status === "Active").length, [suppliers]);
  const openPOs = useMemo(() => pos.filter(p => p.status === "Draft" || p.status === "Sent").length, [pos]);
  const poSpend = useMemo(() => pos.filter(p => p.status !== "Cancelled").reduce((s, p) => s + p.total, 0), [pos]);
  const totalItems = useMemo(() => products.reduce((s, p) => s + p.stock, 0), [products]);
  const stockValue = useMemo(() => products.reduce((s, p) => s + p.stock * p.price, 0), [products]);
  const lowStock = useMemo(() => products.filter(p => getProductStatus(p) === "Low Stock").length, [products]);
  const outOfStock = useMemo(() => products.filter(p => getProductStatus(p) === "Out of Stock").length, [products]);
  const activeStaff = useMemo(() => staffMembers.filter(s => s.status === "Active").length, [staffMembers]);
  const totalLoyaltyPoints = useMemo(() => loyaltyCustomers.reduce((s, c) => s + c.points, 0), [loyaltyCustomers]);
  const activeCoupons = useMemo(() => couponsData.filter(c => c.status === "Active").length, [couponsData]);
  const activeBranches = useMemo(() => branchesData.filter(b => b.status === "active").length, [branchesData]);
  const branchRevenue = useMemo(() => branchesData.filter(b => b.status === "active").reduce((s, b) => s + b.monthlyRevenue, 0), [branchesData]);
  const totalExpenses = useMemo(() => expensesData.reduce((s, e) => s + e.amount, 0), [expensesData]);
  const pendingExpenses = useMemo(() => expensesData.filter(e => e.status === "pending").length, [expensesData]);
  const publishedReviews = useMemo(() => reviewsData.filter(r => r.status === "published").length, [reviewsData]);
  const avgRating = useMemo(() => {
    const pub = reviewsData.filter(r => r.status === "published");
    return pub.length ? (pub.reduce((s, r) => s + r.rating, 0) / pub.length).toFixed(1) : "0";
  }, [reviewsData]);
  const pendingReviews = useMemo(() => reviewsData.filter(r => r.status === "pending").length, [reviewsData]);

  // â”€â”€â”€ Section configs per business type â”€â”€â”€
  const getSections = (): WidgetSection[] => {
    switch (businessPurpose) {
      case "healthcare":
        return [
          {
            title: "Patient Management", widgets: [
              { title: "Appointments Today", value: 18, subtitle: "3 walk-ins", icon: <CalendarCheck className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/appointment-booking" },
              { title: "Active Patients", value: 1240, subtitle: "56 new this month", icon: <Heart className="h-5 w-5" />, color: "bg-destructive/10 text-destructive", link: "/healthcare" },
              { title: "Doctor Profiles", value: 12, subtitle: "8 available today", icon: <UserCog className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/healthcare?tab=doctors" },
              { title: "Teleconsultations", value: 5, subtitle: "2 scheduled today", icon: <Video className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/healthcare?tab=telemedicine" },
            ]
          },
          {
            title: "Revenue & Billing", cols: 3, widgets: [
              { title: "Monthly Revenue", value: "à§³485,000", subtitle: "â†‘ 12% vs last month", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
              { title: "Pending Bills", value: 34, subtitle: "à§³125,400 outstanding", icon: <Receipt className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/healthcare?tab=billing" },
              { title: "Patient Reviews", value: `${avgRating}â˜…`, subtitle: `${publishedReviews} reviews`, icon: <Star className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/reviews" },
            ]
          },
        ];

      case "fitness":
        return [
          {
            title: "Gym Operations", widgets: [
              { title: "Active Members", value: 342, subtitle: "28 new this month", icon: <Dumbbell className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/fitness" },
              { title: "Classes Today", value: 8, subtitle: "3 trainer-led", icon: <CalendarCheck className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/fitness?tab=classes" },
              { title: "Trainers", value: 6, subtitle: "2 available now", icon: <UserCog className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/fitness?tab=trainers" },
              { title: "Monthly Revenue", value: "à§³185,000", subtitle: "Memberships + PT", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
            ]
          },
        ];

      case "salon":
        return [
          {
            title: "Salon Operations", widgets: [
              { title: "Today's Bookings", value: 14, subtitle: "2 walk-ins", icon: <Scissors className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/salon" },
              { title: "Active Clients", value: 580, subtitle: "45 new this month", icon: <Users className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/salon?tab=staff" },
              { title: "Staff Members", value: 8, subtitle: "6 available today", icon: <UserCog className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/salon?tab=staff" },
              { title: "Monthly Revenue", value: "à§³245,000", subtitle: "â†‘ 8% vs last month", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
            ]
          },
        ];

      case "freelancer":
        return [
          {
            title: "Projects & Clients", widgets: [
              { title: "Active Projects", value: 5, subtitle: "2 due this week", icon: <Briefcase className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/freelancer" },
              { title: "Total Clients", value: 28, subtitle: "4 new this month", icon: <Users className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/freelancer?tab=clients" },
              { title: "Pending Invoices", value: 3, subtitle: "à§³45,200 outstanding", icon: <FileText className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/freelancer?tab=invoicing" },
              { title: "This Month", value: "à§³125,000", subtitle: "â†‘ 15% vs last month", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
            ]
          },
        ];

      case "travel":
        return [
          {
            title: "Tours & Bookings", widgets: [
              { title: "Active Tours", value: 12, subtitle: "3 departing this week", icon: <Plane className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/travel" },
              { title: "Upcoming Bookings", value: 45, subtitle: "8 pending confirmation", icon: <CalendarCheck className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/travel?tab=bookings" },
              { title: "Tour Guides", value: 8, subtitle: "5 on tour now", icon: <MapPin className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/travel?tab=guides" },
              { title: "Monthly Revenue", value: "à§³850,000", subtitle: "â†‘ 22% vs last month", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
            ]
          },
        ];

      case "automotive":
        return [
          {
            title: "Dealership Overview", widgets: [
              { title: "Vehicle Listings", value: 48, subtitle: "12 new this month", icon: <Car className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/automotive" },
              { title: "Active Leads", value: 34, subtitle: "8 hot prospects", icon: <Users className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/lead-management" },
              { title: "Service Bookings", value: 15, subtitle: "5 today", icon: <Wrench className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/automotive?tab=service" },
              { title: "Monthly Sales", value: "à§³2.5M", subtitle: "6 vehicles sold", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
            ]
          },
        ];

      case "event":
        return [
          {
            title: "Event Operations", widgets: [
              { title: "Upcoming Events", value: 5, subtitle: "2 this week", icon: <PartyPopper className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/events" },
              { title: "Tickets Sold", value: 1240, subtitle: "320 this week", icon: <Ticket className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/events?tab=tickets" },
              { title: "Venue Bookings", value: 8, subtitle: "3 confirmed", icon: <Building2 className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/events?tab=venues" },
              { title: "Event Revenue", value: "à§³650,000", subtitle: "â†‘ 18% vs last month", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
            ]
          },
        ];

      case "saas":
        return [
          {
            title: "Product Metrics", widgets: [
              { title: "MRR", value: "$42,500", subtitle: "â†‘ 18.2% growth", icon: <Rocket className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/saas-product" },
              { title: "Active Users", value: "5,840", subtitle: "342 new this week", icon: <Users className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/saas-product" },
              { title: "Churn Rate", value: "2.1%", subtitle: "↓ 0.3% improvement", icon: <BarChart3 className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/tracking/analytics" },
              { title: "API Calls", value: "1.2M", subtitle: "Today's usage", icon: <Code className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/developer" },
            ]
          },
          ...(isModuleAvailable("tracking") ? [{
            title: "Server Tracking", widgets: [
              { title: "Flow Throughput", value: "840 req/s", subtitle: "Real-time traffic", icon: <Rocket className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/tracking/analytics" },
              { title: "Average Latency", value: "14ms", subtitle: "↑ 2ms vs avg", icon: <BarChart3 className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/tracking/analytics" },
              { title: "Signal Health", value: "99.9%", subtitle: "No drops detected", icon: <ShieldCheck className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/tracking/analytics" },
            ]
          }] : [])
        ];

      case "lms":
        return [
          {
            title: "Learning Platform", widgets: [
              { title: "Active Courses", value: 24, subtitle: "3 new this month", icon: <GraduationCap className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/lms" },
              { title: "Enrolled Students", value: 1850, subtitle: "142 this month", icon: <Users className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/lms?tab=students" },
              { title: "Course Revenue", value: "à§³320,000", subtitle: "â†‘ 25% vs last month", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/lms?tab=monetization" },
              { title: "Completion Rate", value: "68%", subtitle: "â†‘ 5% improvement", icon: <Star className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/lms?tab=students" },
            ]
          },
        ];

      case "real-estate":
        return [
          {
            title: "Property Management", widgets: [
              { title: "Active Listings", value: 34, subtitle: "8 new this month", icon: <Building2 className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/property-listings" },
              { title: "Active Leads", value: 56, subtitle: "12 hot prospects", icon: <Users className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/lead-management" },
              { title: "Virtual Tours", value: 18, subtitle: "245 views this week", icon: <Video className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/virtual-tours" },
              { title: "Pending Contracts", value: 5, subtitle: "à§³12.5M value", icon: <FileText className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/contracts" },
            ]
          },
        ];

      case "restaurant":
        return [
          {
            title: "Restaurant Operations", widgets: [
              { title: "Orders Today", value: 42, subtitle: "12 dine-in, 30 delivery", icon: <ClipboardList className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/restaurant-orders" },
              { title: "Today's Revenue", value: "à§³28,500", subtitle: "â†‘ 8% vs yesterday", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
              { title: "Reservations", value: 8, subtitle: "3 for tonight", icon: <CalendarCheck className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/table-reservations" },
              { title: "Menu Items", value: 65, subtitle: "4 out of stock", icon: <BookOpen className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/menu-management" },
            ]
          },
        ];

      case "cross-border-ior":
        return [
          {
            title: "Sourcing & Logistics", widgets: [
              { title: "Active Shipments", value: 12, subtitle: "3 arriving today", icon: <Truck className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/ior/shipments" },
              { title: "Customs Holds", value: 2, subtitle: "Action required", icon: <AlertTriangle className="h-5 w-5" />, color: "bg-destructive/10 text-destructive", link: "/ior/compliance" },
              { title: "Active Orders", value: 45, subtitle: "8 pending payment", icon: <ShoppingCart className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/ior/orders" },
              { title: "Warehouse Stock", value: 1240, subtitle: "Units in inventory", icon: <Package className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/ior/warehouse" },
            ]
          },
          {
            title: "Financials & Compliance", cols: 3, widgets: [
              { title: "Tax Collected (MTD)", value: "$12,450", subtitle: "Customs & Duties", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance" },
              { title: "Compliance Score", value: "98.5%", subtitle: "High standing", icon: <ShieldCheck className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/ior/compliance" },
              { title: "Pending Invoices", value: 5, subtitle: "$8,200 outstanding", icon: <FileText className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/finance" },
            ]
          },
        ];

      case "business-website":
        return [
          {
            title: "Website Performance", widgets: [
              { title: "Monthly Visitors", value: "4,520", subtitle: "â†‘ 12% vs last month", icon: <Globe className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/website-analytics" },
              { title: "Form Submissions", value: 34, subtitle: "8 this week", icon: <FileText className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/contact-forms" },
              { title: "Blog Posts", value: 12, subtitle: "2 published this month", icon: <BookOpen className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/pages-blog" },
              { title: "Appointments", value: 18, subtitle: "5 upcoming", icon: <CalendarCheck className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/appointment-booking" },
            ]
          },
        ];

      default: // ecommerce
        return [
          {
            title: "Sales & Commerce", widgets: [
              { title: "Total Revenue", value: `৳${salesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, subtitle: `${orders.length} orders`, icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/ecommerce/orders" },
              { title: "Customers", value: 248, subtitle: "32 new this month", icon: <Users className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/crm" },
              { title: "Top CLV", value: "৳12,450", subtitle: "আহমেদ হাসান", icon: <Crown className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/reports/customers" },
              { title: "Returns", value: "View", subtitle: "Returns & refunds", icon: <RotateCcw className="h-5 w-5" />, color: "bg-destructive/10 text-destructive", link: "/ecommerce/returns" },
            ]
          },
          {
            title: "Inventory & Stock", widgets: [
              { title: "Total Stock", value: totalItems.toLocaleString(), subtitle: `৳${stockValue.toLocaleString()} value`, icon: <Package className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/inventory" },
              { title: "Low Stock", value: lowStock, subtitle: `${outOfStock} out of stock`, icon: <AlertTriangle className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/reports/inventory" },
              { title: "Suppliers", value: activeSuppliers, subtitle: `${suppliers.length} total`, icon: <Truck className="h-5 w-5" />, color: "bg-blue-500/10 text-blue-600", link: "/inventory/suppliers" },
              { title: "Open POs", value: openPOs, subtitle: `৳${poSpend.toLocaleString()} spend`, icon: <ClipboardList className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/inventory/purchase-orders" },
            ]
          },
          {
            title: "Finance & Accounting", cols: 3, widgets: [
              { title: "Tax Collected (MTD)", value: "৳12,450", subtitle: "VAT/GST", icon: <Percent className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/finance/tax" },
              { title: "Profit Margin", value: "28.5%", subtitle: "This month", icon: <DollarSign className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/finance" },
              { title: "Multi-currency", value: "5 Active", subtitle: "BDT, USD, EUR, GBP, INR", icon: <Globe className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/finance/tax" },
            ]
          },
          {
            title: "HR & Staff", widgets: [
              { title: "Total Staff", value: staffMembers.length, subtitle: `${activeStaff} active`, icon: <UserCog className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/hrm" },
              { title: "On Leave", value: staffMembers.filter(s => s.status === "On Leave").length, subtitle: "Current leave requests", icon: <Users className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/hrm" },
              { title: "Avg Performance", value: `${staffMembers.length ? (staffMembers.reduce((s, m) => s + m.performance, 0) / staffMembers.length).toFixed(1) : "0"}/5`, subtitle: "Staff rating", icon: <Star className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/hrm" },
              { title: "Loyalty Members", value: loyaltyCustomers.length, subtitle: `${totalLoyaltyPoints.toLocaleString()} pts`, icon: <Gift className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/loyalty" },
            ]
          },
          {
            title: "Operations", widgets: [
              { title: "Branches", value: branchesData.length, subtitle: `${activeBranches} active`, icon: <Building2 className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/branches" },
              { title: "Branch Revenue", value: `৳${branchRevenue.toLocaleString()}`, subtitle: "Monthly combined", icon: <DollarSign className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/branches" },
              { title: "Total Expenses", value: `৳${totalExpenses.toLocaleString()}`, subtitle: `${pendingExpenses} pending approval`, icon: <Receipt className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-600", link: "/finance/expenses" },
              { title: "Product Reviews", value: publishedReviews, subtitle: `${avgRating}★ avg · ${pendingReviews} pending`, icon: <MessageSquare className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-600", link: "/reviews" },
            ]
          },
          ...(isModuleAvailable("tracking") ? [{
            title: "Server Tracking", widgets: [
              { title: "Flow Throughput", value: "1.2k req/s", subtitle: "Order tracking active", icon: <Rocket className="h-5 w-5" />, color: "bg-primary/10 text-primary", link: "/tracking/analytics" },
              { title: "Signal Accuracy", value: "98.2%", subtitle: "CAPI matched", icon: <ShieldCheck className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600", link: "/tracking/analytics" },
            ]
          }] : [])
        ];
    }
  };

  // Quick actions per business type
  const getQuickActions = () => {
    const actions: Record<string, { label: string; icon: React.ReactNode; to: string }[]> = {
      ecommerce: [
        { label: "New Sale (POS)", icon: <ShoppingCart className="h-4 w-4" />, to: "/pos" },
        { label: "New Purchase Order", icon: <FileText className="h-4 w-4" />, to: "/inventory/purchase-orders" },
        { label: "Add Product", icon: <Plus className="h-4 w-4" />, to: "/inventory/products" },
        { label: "Add Supplier", icon: <UserPlus className="h-4 w-4" />, to: "/inventory/suppliers" },
        { label: "Create Return", icon: <RotateCcw className="h-4 w-4" />, to: "/ecommerce/returns" },
        { label: "Sales Report", icon: <DollarSign className="h-4 w-4" />, to: "/reports/sales" },
      ],
      healthcare: [
        { label: "New Appointment", icon: <CalendarCheck className="h-4 w-4" />, to: "/appointment-booking" },
        { label: "Add Patient", icon: <UserPlus className="h-4 w-4" />, to: "/healthcare" },
        { label: "Add Doctor", icon: <Heart className="h-4 w-4" />, to: "/healthcare?tab=doctors" },
        { label: "View Schedule", icon: <CalendarCheck className="h-4 w-4" />, to: "/appointment-booking" },
      ],
      fitness: [
        { label: "New Class", icon: <Dumbbell className="h-4 w-4" />, to: "/fitness?tab=classes" },
        { label: "Add Member", icon: <UserPlus className="h-4 w-4" />, to: "/fitness?tab=members" },
        { label: "View Schedule", icon: <CalendarCheck className="h-4 w-4" />, to: "/fitness?tab=classes" },
        { label: "Performance Report", icon: <BarChart3 className="h-4 w-4" />, to: "/reports/sales" },
      ],
      salon: [
        { label: "New Booking", icon: <CalendarCheck className="h-4 w-4" />, to: "/appointment-booking" },
        { label: "Add Client", icon: <UserPlus className="h-4 w-4" />, to: "/salon" },
        { label: "Add Service", icon: <Scissors className="h-4 w-4" />, to: "/salon?tab=services" },
        { label: "View Revenue", icon: <DollarSign className="h-4 w-4" />, to: "/finance" },
      ],
      freelancer: [
        { label: "New Project", icon: <Briefcase className="h-4 w-4" />, to: "/freelancer" },
        { label: "Create Invoice", icon: <FileText className="h-4 w-4" />, to: "/freelancer?tab=invoicing" },
        { label: "New Proposal", icon: <FileText className="h-4 w-4" />, to: "/contracts" },
        { label: "Add to Portfolio", icon: <Image className="h-4 w-4" />, to: "/portfolio-gallery" },
      ],
      travel: [
        { label: "New Tour Package", icon: <Plane className="h-4 w-4" />, to: "/travel" },
        { label: "New Booking", icon: <CalendarCheck className="h-4 w-4" />, to: "/travel?tab=bookings" },
        { label: "Add Guide", icon: <UserPlus className="h-4 w-4" />, to: "/travel?tab=guides" },
        { label: "Revenue Report", icon: <DollarSign className="h-4 w-4" />, to: "/reports/sales" },
      ],
      automotive: [
        { label: "Add Vehicle", icon: <Car className="h-4 w-4" />, to: "/automotive" },
        { label: "New Lead", icon: <UserPlus className="h-4 w-4" />, to: "/lead-management" },
        { label: "Service Booking", icon: <Wrench className="h-4 w-4" />, to: "/automotive?tab=service" },
        { label: "Sales Report", icon: <DollarSign className="h-4 w-4" />, to: "/reports/sales" },
      ],
      event: [
        { label: "Create Event", icon: <PartyPopper className="h-4 w-4" />, to: "/events" },
        { label: "Manage Tickets", icon: <Ticket className="h-4 w-4" />, to: "/events?tab=tickets" },
        { label: "Add Venue", icon: <Building2 className="h-4 w-4" />, to: "/events?tab=venues" },
        { label: "Event Marketing", icon: <BarChart3 className="h-4 w-4" />, to: "/events?tab=marketing" },
      ],
      saas: [
        { label: "View Metrics", icon: <Rocket className="h-4 w-4" />, to: "/saas-product" },
        { label: "Edit Pricing", icon: <DollarSign className="h-4 w-4" />, to: "/ecommerce/subscription-plans" },
        { label: "View Roadmap", icon: <FileText className="h-4 w-4" />, to: "/roadmap" },
        { label: "API Dashboard", icon: <Code className="h-4 w-4" />, to: "/developer" },
      ],
      lms: [
        { label: "Create Course", icon: <GraduationCap className="h-4 w-4" />, to: "/lms" },
        { label: "Add Student", icon: <UserPlus className="h-4 w-4" />, to: "/lms?tab=students" },
        { label: "Schedule Class", icon: <Video className="h-4 w-4" />, to: "/lms?tab=live" },
        { label: "Revenue Report", icon: <DollarSign className="h-4 w-4" />, to: "/reports/sales" },
      ],
      "real-estate": [
        { label: "New Listing", icon: <Building2 className="h-4 w-4" />, to: "/property-listings" },
        { label: "Add Lead", icon: <UserPlus className="h-4 w-4" />, to: "/lead-management" },
        { label: "Create Contract", icon: <FileText className="h-4 w-4" />, to: "/contracts" },
        { label: "Schedule Tour", icon: <Video className="h-4 w-4" />, to: "/virtual-tours" },
      ],
      restaurant: [
        { label: "New Order", icon: <ClipboardList className="h-4 w-4" />, to: "/restaurant-orders" },
        { label: "Edit Menu", icon: <BookOpen className="h-4 w-4" />, to: "/menu-management" },
        { label: "View Reservations", icon: <CalendarCheck className="h-4 w-4" />, to: "/table-reservations" },
        { label: "Kitchen Display", icon: <Package className="h-4 w-4" />, to: "/kitchen-display" },
      ],
      "business-website": [
        { label: "Edit Pages", icon: <FileText className="h-4 w-4" />, to: "/page-builder" },
        { label: "New Blog Post", icon: <BookOpen className="h-4 w-4" />, to: "/pages-blog" },
        { label: "View Analytics", icon: <BarChart3 className="h-4 w-4" />, to: "/tracking/analytics" },
        { label: "SEO Check", icon: <Globe className="h-4 w-4" />, to: "/seo-manager" },
      ],
      "cross-border-ior": [
        { label: "New Shipment", icon: <Truck className="h-4 w-4" />, to: "/ior/shipments/new" },
        { label: "Scan SKU", icon: <Package className="h-4 w-4" />, to: "/ior/warehouse/scan" },
        { label: "Compliance Check", icon: <FileText className="h-4 w-4" />, to: "/ior/compliance" },
        { label: "Track Package", icon: <Globe className="h-4 w-4" />, to: "/ior/tracking" },
        { label: "New Order", icon: <Plus className="h-4 w-4" />, to: "/ior/orders/new" },
      ],
    };
    return actions[businessPurpose || "ecommerce"] || actions.ecommerce;
  };

  const sections = getSections();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{section.title}</h3>
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-${section.cols || 4}`}>
            {section.widgets.map((w) => (
              <Widget key={w.title} {...w} />
            ))}
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button key={action.label} variant="outline" className="gap-2" onClick={() => router.push(action.to)}>
              {action.icon} {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleSummary;