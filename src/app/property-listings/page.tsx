"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Home, Plus, Search, MapPin, Maximize2, BedDouble, Bath,
  DollarSign, Eye, Heart, TrendingUp, Building2, LandPlot, Filter,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  type: "apartment" | "villa" | "land" | "office" | "warehouse" | "shop";
  status: "available" | "sold" | "rented" | "under-offer";
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  city: string;
  description: string;
  views: number;
  inquiries: number;
  featured: boolean;
  createdAt: string;
}

const sampleProperties: Property[] = [
  { id: "P-001", title: "Modern 3BR Apartment in Riyadh", type: "apartment", status: "available", price: 850000, area: 180, bedrooms: 3, bathrooms: 2, location: "Al Olaya District", city: "Riyadh", description: "Luxurious apartment with panoramic city views", views: 234, inquiries: 12, featured: true, createdAt: "2026-02-15" },
  { id: "P-002", title: "Spacious Villa with Garden", type: "villa", status: "available", price: 2400000, area: 450, bedrooms: 5, bathrooms: 4, location: "Al Nakheel", city: "Riyadh", description: "Premium villa with private pool and landscaped garden", views: 567, inquiries: 28, featured: true, createdAt: "2026-02-10" },
  { id: "P-003", title: "Commercial Office Space", type: "office", status: "rented", price: 120000, area: 95, bedrooms: 0, bathrooms: 1, location: "King Fahd Road", city: "Jeddah", description: "Premium office in business district with parking", views: 145, inquiries: 8, featured: false, createdAt: "2026-02-08" },
  { id: "P-004", title: "Residential Land Plot", type: "land", status: "available", price: 1200000, area: 600, bedrooms: 0, bathrooms: 0, location: "Al Arid", city: "Riyadh", description: "Prime residential land with all utilities connected", views: 312, inquiries: 15, featured: false, createdAt: "2026-02-05" },
  { id: "P-005", title: "Luxury Penthouse Suite", type: "apartment", status: "under-offer", price: 3200000, area: 320, bedrooms: 4, bathrooms: 3, location: "Corniche", city: "Jeddah", description: "Top-floor penthouse with sea views and private elevator", views: 892, inquiries: 42, featured: true, createdAt: "2026-01-28" },
  { id: "P-006", title: "Retail Shop in Mall", type: "shop", status: "available", price: 95000, area: 45, bedrooms: 0, bathrooms: 1, location: "Panorama Mall", city: "Riyadh", description: "Ground floor shop with high foot traffic location", views: 178, inquiries: 9, featured: false, createdAt: "2026-02-01" },
];

const typeLabels: Record<string, string> = { apartment: "Apartment", villa: "Villa", land: "Land", office: "Office", warehouse: "Warehouse", shop: "Shop" };
const statusColors: Record<string, string> = { available: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", sold: "bg-red-500/15 text-red-600 border-red-500/30", rented: "bg-blue-500/15 text-blue-600 border-blue-500/30", "under-offer": "bg-amber-500/15 text-amber-600 border-amber-500/30" };
const typeIcons: Record<string, React.ReactNode> = { apartment: <Building2 className="h-4 w-4" />, villa: <Home className="h-4 w-4" />, land: <LandPlot className="h-4 w-4" />, office: <Building2 className="h-4 w-4" />, warehouse: <Building2 className="h-4 w-4" />, shop: <Building2 className="h-4 w-4" /> };

const PropertyListingsPage = () => {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ title: "", type: "apartment", price: "", area: "", bedrooms: "", bathrooms: "", location: "", city: "", description: "" });

  const filtered = properties.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === "available").length,
    totalViews: properties.reduce((s, p) => s + p.views, 0),
    totalInquiries: properties.reduce((s, p) => s + p.inquiries, 0),
  };

  const handleAdd = () => {
    if (!newProperty.title || !newProperty.price) { toast.error("Title and price are required"); return; }
    const prop: Property = {
      id: `P-${String(properties.length + 1).padStart(3, "0")}`,
      title: newProperty.title,
      type: newProperty.type as Property["type"],
      status: "available",
      price: Number(newProperty.price),
      area: Number(newProperty.area) || 0,
      bedrooms: Number(newProperty.bedrooms) || 0,
      bathrooms: Number(newProperty.bathrooms) || 0,
      location: newProperty.location,
      city: newProperty.city,
      description: newProperty.description,
      views: 0, inquiries: 0, featured: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProperties([prop, ...properties]);
    setNewProperty({ title: "", type: "apartment", price: "", area: "", bedrooms: "", bathrooms: "", location: "", city: "", description: "" });
    setDialogOpen(false);
    toast.success("Property listing added!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Property Listings</h1>
            <p className="text-sm text-muted-foreground">Manage your property portfolio</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Property</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add New Property</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Title</Label><Input value={newProperty.title} onChange={e => setNewProperty({ ...newProperty, title: e.target.value })} placeholder="e.g. Modern 3BR Apartment" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Type</Label>
                    <Select value={newProperty.type} onValueChange={v => setNewProperty({ ...newProperty, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Price (SAR)</Label><Input type="number" value={newProperty.price} onChange={e => setNewProperty({ ...newProperty, price: e.target.value })} placeholder="850000" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Area (sqm)</Label><Input type="number" value={newProperty.area} onChange={e => setNewProperty({ ...newProperty, area: e.target.value })} /></div>
                  <div><Label>Bedrooms</Label><Input type="number" value={newProperty.bedrooms} onChange={e => setNewProperty({ ...newProperty, bedrooms: e.target.value })} /></div>
                  <div><Label>Bathrooms</Label><Input type="number" value={newProperty.bathrooms} onChange={e => setNewProperty({ ...newProperty, bathrooms: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Location</Label><Input value={newProperty.location} onChange={e => setNewProperty({ ...newProperty, location: e.target.value })} placeholder="District / Area" /></div>
                  <div><Label>City</Label><Input value={newProperty.city} onChange={e => setNewProperty({ ...newProperty, city: e.target.value })} placeholder="Riyadh" /></div>
                </div>
                <div><Label>Description</Label><Textarea value={newProperty.description} onChange={e => setNewProperty({ ...newProperty, description: e.target.value })} rows={3} /></div>
                <Button className="w-full" onClick={handleAdd}>Add Listing</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Listings", value: stats.total, icon: <Home className="h-5 w-5" />, color: "text-primary" },
            { label: "Available", value: stats.available, icon: <Building2 className="h-5 w-5" />, color: "text-emerald-500" },
            { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: <Eye className="h-5 w-5" />, color: "text-blue-500" },
            { label: "Inquiries", value: stats.totalInquiries, icon: <TrendingUp className="h-5 w-5" />, color: "text-amber-500" },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-muted ${s.color}`}>{s.icon}</div>
                <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search listings..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="under-offer">Under Offer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(property => (
            <Card key={property.id} className="border-border overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Image placeholder */}
              <div className="relative h-44 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
                <div className="text-5xl opacity-30">{typeIcons[property.type] || <Home className="h-12 w-12" />}</div>
                {property.featured && (
                  <Badge className="absolute top-3 left-3 bg-amber-500/90 text-white border-0 text-[10px]">â­ Featured</Badge>
                )}
                <Badge className={`absolute top-3 right-3 text-[10px] ${statusColors[property.status]}`}>
                  {property.status.replace("-", " ").toUpperCase()}
                </Badge>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="flex items-center gap-1 rounded-md bg-background/80 backdrop-blur-sm px-2 py-1 text-[10px] font-medium text-foreground">
                    <Eye className="h-3 w-3" /> {property.views}
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-background/80 backdrop-blur-sm px-2 py-1 text-[10px] font-medium text-foreground">
                    <Heart className="h-3 w-3" /> {property.inquiries}
                  </span>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[9px] gap-1">{typeIcons[property.type]} {typeLabels[property.type]}</Badge>
                    <span className="text-[10px] text-muted-foreground">{property.id}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight">{property.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {property.location}, {property.city}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {property.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {property.bedrooms} BD</span>}
                  {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.bathrooms} BA</span>}
                  <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {property.area} sqm</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="flex items-center gap-1 text-lg font-bold text-primary">
                    <DollarSign className="h-4 w-4" /> {property.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{property.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Home className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">No properties found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyListingsPage;

