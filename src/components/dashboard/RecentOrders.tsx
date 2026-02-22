import { useState, useMemo, useCallback } from "react";
import { Eye, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Package, MapPin, Clock, User, CreditCard, X, Filter, Search, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  amountNum: number;
  status: string;
  date: string;
  dateNum: number;
}

const initialOrders: Order[] = [
  { id: "#ORD-7291", customer: "Musharof Chy", product: "Apple Watch Ultra", amount: "$799.00", amountNum: 799, status: "Delivered", date: "Feb 18, 2026", dateNum: 20260218 },
  { id: "#ORD-7290", customer: "Naimur Rahman", product: "MacBook Pro 14\"", amount: "$1,999.00", amountNum: 1999, status: "Processing", date: "Feb 18, 2026", dateNum: 20260218 },
  { id: "#ORD-7289", customer: "Shafiq Hammad", product: "AirPods Pro", amount: "$249.00", amountNum: 249, status: "Shipped", date: "Feb 17, 2026", dateNum: 20260217 },
  { id: "#ORD-7288", customer: "Alex Doe", product: "iPhone 15 Pro", amount: "$1,199.00", amountNum: 1199, status: "Delivered", date: "Feb 17, 2026", dateNum: 20260217 },
  { id: "#ORD-7287", customer: "Emily Brown", product: "iPad Air", amount: "$599.00", amountNum: 599, status: "Cancelled", date: "Feb 16, 2026", dateNum: 20260216 },
  { id: "#ORD-7286", customer: "Sarah Smith", product: "Magic Keyboard", amount: "$299.00", amountNum: 299, status: "Delivered", date: "Feb 16, 2026", dateNum: 20260216 },
  { id: "#ORD-7285", customer: "David Wilson", product: "HomePod Mini", amount: "$99.00", amountNum: 99, status: "Delivered", date: "Feb 15, 2026", dateNum: 20260215 },
  { id: "#ORD-7284", customer: "Lisa Wang", product: "Apple Pencil 2", amount: "$129.00", amountNum: 129, status: "Shipped", date: "Feb 15, 2026", dateNum: 20260215 },
  { id: "#ORD-7283", customer: "Michael Lee", product: "Mac Mini M3", amount: "$699.00", amountNum: 699, status: "Processing", date: "Feb 14, 2026", dateNum: 20260214 },
  { id: "#ORD-7282", customer: "Jhon Abraham", product: "Studio Display", amount: "$1,599.00", amountNum: 1599, status: "Delivered", date: "Feb 14, 2026", dateNum: 20260214 },
  { id: "#ORD-7281", customer: "Emma Davis", product: "AirTag 4-Pack", amount: "$99.00", amountNum: 99, status: "Cancelled", date: "Feb 13, 2026", dateNum: 20260213 },
  { id: "#ORD-7280", customer: "Chris Johnson", product: "MagSafe Charger", amount: "$39.00", amountNum: 39, status: "Delivered", date: "Feb 13, 2026", dateNum: 20260213 },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-success/10 text-success border-transparent",
  Processing: "bg-warning/10 text-warning border-transparent",
  Shipped: "bg-primary/10 text-primary border-transparent",
  Cancelled: "bg-destructive/10 text-destructive border-transparent",
};

type SortKey = "id" | "customer" | "amount" | "status" | "date";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 5;

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusUpdate = useCallback((orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder((prev) => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
    toast({ title: "Status updated", description: `Order ${orderId} → ${newStatus}` });
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter !== "All") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
    }
    if (dateFrom) {
      const fromNum = parseInt(format(dateFrom, "yyyyMMdd"));
      result = result.filter((o) => o.dateNum >= fromNum);
    }
    if (dateTo) {
      const toNum = parseInt(format(dateTo, "yyyyMMdd"));
      result = result.filter((o) => o.dateNum <= toNum);
    }
    return result;
  }, [orders, statusFilter, searchQuery, dateFrom, dateTo]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "id": return dir * a.id.localeCompare(b.id);
        case "customer": return dir * a.customer.localeCompare(b.customer);
        case "amount": return dir * (a.amountNum - b.amountNum);
        case "status": return dir * a.status.localeCompare(b.status);
        case "date": return dir * (a.dateNum - b.dateNum);
        default: return 0;
      }
    });
    return arr;
  }, [sortKey, sortDir, filtered]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
  };

  const thClass = "px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none transition-colors hover:text-foreground";

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm animate-fade-in transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 px-6 py-5">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">Recent Orders</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Latest order activity</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search ID or customer..."
              className="h-8 w-[180px] rounded-md border border-border bg-background pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          {/* Date From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("h-8 w-[120px] justify-start text-xs font-normal", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                {dateFrom ? format(dateFrom, "MMM dd") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); setCurrentPage(1); }} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          {/* Date To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("h-8 w-[120px] justify-start text-xs font-normal", !dateTo && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                {dateTo ? format(dateTo, "MMM dd") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); setCurrentPage(1); }} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          {(dateFrom || dateTo) && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setDateFrom(undefined); setDateTo(undefined); setCurrentPage(1); }}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <Filter className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={thClass} onClick={() => toggleSort("id")}>
                <span className="inline-flex items-center gap-1.5">Order ID <SortIcon column="id" /></span>
              </th>
              <th className={thClass} onClick={() => toggleSort("customer")}>
                <span className="inline-flex items-center gap-1.5">Customer <SortIcon column="customer" /></span>
              </th>
              <th className={cn(thClass, "hidden md:table-cell")}>Product</th>
              <th className={thClass} onClick={() => toggleSort("amount")}>
                <span className="inline-flex items-center gap-1.5">Amount <SortIcon column="amount" /></span>
              </th>
              <th className={thClass} onClick={() => toggleSort("status")}>
                <span className="inline-flex items-center gap-1.5">Status <SortIcon column="status" /></span>
              </th>
              <th className={cn(thClass, "hidden lg:table-cell")} onClick={() => toggleSort("date")}>
                <span className="inline-flex items-center gap-1.5">Date <SortIcon column="date" /></span>
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-accent/50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{order.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-card-foreground">{order.customer}</td>
                <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-muted-foreground md:table-cell">{order.product}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-card-foreground">{order.amount}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge className={cn("text-xs font-medium", statusStyles[order.status])}>{order.status}</Badge>
                </td>
                <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-muted-foreground lg:table-cell">{order.date}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-6 py-3.5">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)} of {sorted.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-2">
                {/* Order ID & Status Update */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{selectedOrder.id}</span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) => handleStatusUpdate(selectedOrder.id, val)}
                  >
                    <SelectTrigger className={cn("w-[140px] h-8 text-xs font-medium", statusStyles[selectedOrder.status])}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border z-50">
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <User className="h-3.5 w-3.5" /> Customer
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">{selectedOrder.customer}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5" /> Order Date
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">{selectedOrder.date}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Package className="h-3.5 w-3.5" /> Product
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">{selectedOrder.product}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <CreditCard className="h-3.5 w-3.5" /> Amount
                    </div>
                    <p className="text-sm font-bold text-card-foreground">{selectedOrder.amount}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Order Timeline</p>
                  <div className="space-y-3">
                    {[
                      { label: "Order Placed", time: selectedOrder.date, done: true },
                      { label: "Payment Confirmed", time: selectedOrder.date, done: selectedOrder.status !== "Cancelled" },
                      { label: "Shipped", time: selectedOrder.status === "Shipped" || selectedOrder.status === "Delivered" ? selectedOrder.date : "—", done: selectedOrder.status === "Shipped" || selectedOrder.status === "Delivered" },
                      { label: "Delivered", time: selectedOrder.status === "Delivered" ? selectedOrder.date : "—", done: selectedOrder.status === "Delivered" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", step.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground")}>
                          {step.done ? "✓" : i + 1}
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-sm font-medium", step.done ? "text-card-foreground" : "text-muted-foreground")}>{step.label}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentOrders;
