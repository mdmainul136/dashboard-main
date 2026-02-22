"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table2, Users, Clock, CalendarCheck, Plus, CheckCircle2 } from "lucide-react";
import { useState } from "react";

type TableStatus = "available" | "occupied" | "reserved" | "cleaning";

interface FloorTable {
  id: string;
  name: string;
  seats: number;
  status: TableStatus;
  currentOrder?: string;
  reservedBy?: string;
  reservedTime?: string;
}

interface Reservation {
  id: string;
  guest: string;
  phone: string;
  date: string;
  time: string;
  party: number;
  table: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes?: string;
}

const mockTables: FloorTable[] = [
  { id: "t1", name: "T-01", seats: 2, status: "available" },
  { id: "t2", name: "T-02", seats: 2, status: "occupied", currentOrder: "ORD-401" },
  { id: "t3", name: "T-03", seats: 4, status: "occupied", currentOrder: "ORD-398" },
  { id: "t4", name: "T-04", seats: 4, status: "reserved", reservedBy: "Khalid", reservedTime: "7:30 PM" },
  { id: "t5", name: "T-05", seats: 6, status: "occupied", currentOrder: "ORD-401" },
  { id: "t6", name: "T-06", seats: 6, status: "available" },
  { id: "t7", name: "T-07", seats: 8, status: "cleaning" },
  { id: "t8", name: "T-08", seats: 4, status: "available" },
  { id: "t9", name: "T-09", seats: 2, status: "reserved", reservedBy: "Nora", reservedTime: "8:00 PM" },
  { id: "t10", name: "T-10", seats: 10, status: "available" },
];

const mockReservations: Reservation[] = [
  { id: "R-101", guest: "Khalid Al-Saud", phone: "+966 55 123 4567", date: "Today", time: "7:30 PM", party: 4, table: "T-04", status: "confirmed" },
  { id: "R-102", guest: "Nora Ahmed", phone: "+966 50 987 6543", date: "Today", time: "8:00 PM", party: 2, table: "T-09", status: "confirmed" },
  { id: "R-103", guest: "Mohammed Ali", phone: "+966 54 111 2222", date: "Today", time: "9:00 PM", party: 6, table: "T-06", status: "pending" },
  { id: "R-104", guest: "Fatima Hassan", phone: "+966 55 333 4444", date: "Tomorrow", time: "7:00 PM", party: 8, table: "T-07", status: "confirmed" },
  { id: "R-105", guest: "Omar Ibrahim", phone: "+966 50 555 6666", date: "Tomorrow", time: "8:30 PM", party: 3, table: "-", status: "pending" },
];

const statusColors: Record<TableStatus, string> = {
  available: "bg-green-500",
  occupied: "bg-destructive",
  reserved: "bg-amber-500",
  cleaning: "bg-blue-400",
};

const statusLabels: Record<TableStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  cleaning: "Cleaning",
};

const resStatusBadge: Record<string, string> = {
  confirmed: "bg-green-500/10 text-green-600 border-green-200",
  pending: "bg-amber-500/10 text-amber-600 border-amber-200",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const TableReservationsPage = () => {
  const [tab, setTab] = useState("floor");
  const stats = {
    available: mockTables.filter(t => t.status === "available").length,
    occupied: mockTables.filter(t => t.status === "occupied").length,
    reserved: mockTables.filter(t => t.status === "reserved").length,
    totalSeats: mockTables.reduce((a, t) => a + t.seats, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Table & Reservations</h1>
            <p className="text-muted-foreground">Manage floor plan and guest reservations</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Reservation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Reservation</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Guest Name</Label><Input placeholder="Enter name" /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input placeholder="+966" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                  <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
                  <div className="space-y-2"><Label>Party Size</Label><Input type="number" min={1} defaultValue={2} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Table</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Auto-assign" /></SelectTrigger>
                    <SelectContent>{mockTables.map(t => <SelectItem key={t.id} value={t.name}>{t.name} ({t.seats} seats)</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Confirm Reservation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Available", value: stats.available, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
            { label: "Occupied", value: stats.occupied, icon: <Users className="h-5 w-5 text-destructive" /> },
            { label: "Reserved", value: stats.reserved, icon: <CalendarCheck className="h-5 w-5 text-amber-500" /> },
            { label: "Total Seats", value: stats.totalSeats, icon: <Table2 className="h-5 w-5 text-primary" /> },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-muted p-2.5">{s.icon}</div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="floor">Floor Map</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="floor" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Floor Plan</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {mockTables.map(table => (
                    <div key={table.id} className={`relative rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                      table.status === "available" ? "border-green-300 bg-green-50 dark:bg-green-950/20" :
                      table.status === "occupied" ? "border-destructive/40 bg-destructive/5" :
                      table.status === "reserved" ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20" :
                      "border-blue-300 bg-blue-50 dark:bg-blue-950/20"
                    }`}>
                      <div className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ${statusColors[table.status]}`} />
                      <Table2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-bold text-lg">{table.name}</p>
                      <p className="text-xs text-muted-foreground">{table.seats} seats</p>
                      <Badge variant="outline" className="mt-2 text-xs">{statusLabels[table.status]}</Badge>
                      {table.reservedBy && <p className="text-xs text-amber-600 mt-1">{table.reservedBy} @ {table.reservedTime}</p>}
                      {table.currentOrder && <p className="text-xs text-destructive mt-1">{table.currentOrder}</p>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-6 justify-center">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className={`h-3 w-3 rounded-full ${statusColors[key as TableStatus]}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Upcoming Reservations</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReservations.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.id}</TableCell>
                        <TableCell>{r.guest}</TableCell>
                        <TableCell className="text-muted-foreground">{r.phone}</TableCell>
                        <TableCell>{r.date}, {r.time}</TableCell>
                        <TableCell>{r.party} guests</TableCell>
                        <TableCell>{r.table}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={resStatusBadge[r.status] || ""}>
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TableReservationsPage;

