"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Video, Plus, Eye, Play, Upload, Image, MapPin, CheckCircle2 } from "lucide-react";

interface VirtualTour {
  id: string;
  property: string;
  location: string;
  type: "360-photo" | "video-tour" | "3d-walkthrough";
  status: "published" | "draft" | "processing";
  views: number;
  leads: number;
  createdAt: string;
  thumbnail: string;
}

const mockTours: VirtualTour[] = [
  { id: "VT-01", property: "3BR Villa - Al Narjis", location: "Riyadh", type: "3d-walkthrough", status: "published", views: 342, leads: 12, createdAt: "Jan 15, 2025", thumbnail: "ðŸ " },
  { id: "VT-02", property: "Penthouse - Corniche", location: "Jeddah", type: "video-tour", status: "published", views: 567, leads: 23, createdAt: "Jan 10, 2025", thumbnail: "ðŸ¢" },
  { id: "VT-03", property: "Office Space - King Fahad Rd", location: "Riyadh", type: "360-photo", status: "published", views: 189, leads: 8, createdAt: "Jan 8, 2025", thumbnail: "ðŸ¬" },
  { id: "VT-04", property: "2BR Apartment - Downtown", location: "Riyadh", type: "3d-walkthrough", status: "draft", views: 0, leads: 0, createdAt: "Jan 20, 2025", thumbnail: "ðŸ˜ï¸" },
  { id: "VT-05", property: "Luxury Villa - Al Hamra", location: "Riyadh", type: "video-tour", status: "processing", views: 0, leads: 0, createdAt: "Jan 22, 2025", thumbnail: "ðŸ¡" },
];

const typeLabels: Record<string, string> = {
  "360-photo": "360Â° Photos",
  "video-tour": "Video Tour",
  "3d-walkthrough": "3D Walkthrough",
};

const statusBadge: Record<string, string> = {
  published: "bg-green-500/10 text-green-600 border-green-200",
  draft: "bg-muted text-muted-foreground border-border",
  processing: "bg-amber-500/10 text-amber-600 border-amber-200",
};

const VirtualToursPage = () => {
  const totalViews = mockTours.reduce((a, t) => a + t.views, 0);
  const totalLeads = mockTours.reduce((a, t) => a + t.leads, 0);
  const published = mockTours.filter(t => t.status === "published").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Virtual Tours</h1>
            <p className="text-muted-foreground">Create immersive property experiences for buyers</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Create Tour</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Virtual Tour</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2"><Label>Property Name</Label><Input placeholder="e.g. 3BR Villa - Al Narjis" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Location</Label><Input placeholder="City" /></div>
                  <div className="space-y-2"><Label>Tour Type</Label><Input placeholder="3D Walkthrough" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the property..." />
                </div>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Upload media files</p>
                  <p className="text-xs text-muted-foreground">360Â° photos, videos, or 3D scans</p>
                </div>
                <Button className="w-full">Create Tour</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Tours", value: mockTours.length, icon: <Video className="h-5 w-5 text-primary" /> },
            { label: "Published", value: published, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: <Eye className="h-5 w-5 text-blue-500" /> },
            { label: "Leads Generated", value: totalLeads, icon: <MapPin className="h-5 w-5 text-amber-500" /> },
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

        {/* Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTours.map(tour => (
            <Card key={tour.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-36 bg-muted flex items-center justify-center text-5xl relative">
                {tour.thumbnail}
                <Badge variant="outline" className={`absolute top-3 right-3 ${statusBadge[tour.status]}`}>
                  {tour.status}
                </Badge>
                {tour.status === "published" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-white rounded-full p-3"><Play className="h-6 w-6 text-primary" /></div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{tour.property}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5" /> {tour.location}
                </div>
                <Badge variant="outline" className="mt-2">{typeLabels[tour.type]}</Badge>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center text-sm">
                  <div><p className="font-bold">{tour.views}</p><p className="text-xs text-muted-foreground">Views</p></div>
                  <div><p className="font-bold">{tour.leads}</p><p className="text-xs text-muted-foreground">Leads</p></div>
                  <div><p className="font-bold text-xs">{tour.createdAt.split(", ")[0]}</p><p className="text-xs text-muted-foreground">Created</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VirtualToursPage;

