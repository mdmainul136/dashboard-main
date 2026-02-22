"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    MapPin,
    Users,
    TrendingUp,
    Package,
    Search,
    MoreVertical,
    ChevronRight,
    Activity,
    ArrowRightLeft,
    Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import api from "@/lib/api";

const BranchesPage = () => {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await api.get("/api/branches");
            if (response.data.success) {
                setBranches(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch branches");
        } finally {
            setLoading(false);
        }
    };

    const filteredBranches = branches.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Branch Management</h1>
                        <p className="text-muted-foreground">Monitor and manage your retail locations across the globe.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <ArrowRightLeft className="h-4 w-4" /> Stock Transfers
                        </Button>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Branch
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                            <Building2 className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{branches.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Live locations</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {branches.reduce((acc, b) => acc + (b.users_count || 0), 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Assigned users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Active Sales</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {branches.reduce((acc, b) => acc + (b.sales_count || 0), 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Total transactions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Global Status</CardTitle>
                            <Activity className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Operational</div>
                            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                All branches online
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search branches..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline">Filters</Button>
                </div>

                {/* Branch Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredBranches.map((branch) => (
                        <Card key={branch.id} className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                            <div className="h-1.5 w-full bg-primary" />
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CardTitle className="text-xl">{branch.name}</CardTitle>
                                        <Badge variant={branch.is_active ? "default" : "secondary"}>
                                            {branch.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {branch.city}, {branch.country}
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" className="group-hover:bg-primary/5">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50 mb-4">
                                    <div className="space-y-1 text-center">
                                        <Users className="h-4 w-4 mx-auto text-muted-foreground" />
                                        <p className="text-lg font-bold">{branch.users_count || 0}</p>
                                        <p className="text-[10px] uppercase text-muted-foreground">Staff</p>
                                    </div>
                                    <div className="space-y-1 text-center border-x border-border/50">
                                        <TrendingUp className="h-4 w-4 mx-auto text-muted-foreground" />
                                        <p className="text-lg font-bold">{branch.sales_count || 0}</p>
                                        <p className="text-[10px] uppercase text-muted-foreground">Sales</p>
                                    </div>
                                    <div className="space-y-1 text-center">
                                        <Package className="h-4 w-4 mx-auto text-muted-foreground" />
                                        <p className="text-lg font-bold">1.2k</p>
                                        <p className="text-[10px] uppercase text-muted-foreground">Stock</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Branch Code</span>
                                        <span className="font-mono text-sm">{branch.code}</span>
                                    </div>
                                    <Button variant="ghost" className="gap-1 text-primary group-hover:translate-x-1 transition-transform">
                                        View Details <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BranchesPage;
