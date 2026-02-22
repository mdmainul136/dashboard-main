"use client";

import React, { useState, useEffect } from "react";
import {
    Building2,
    Check,
    ChevronDown,
    Globe,
    MapPin,
    Settings
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Branch {
    id: number;
    name: string;
    code: string;
    city: string;
}

const BranchSwitcher = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await api.get("/api/branches");
            if (response.data.success) {
                setBranches(response.data.data);
                // Default to first branch or global if needed
                setSelectedBranch(response.data.data[0] || null);
            }
        } catch (error) {
            console.error("Failed to fetch branches", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-9 w-[180px] bg-muted animate-pulse rounded-md" />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground">
                            <Building2 className="h-3 w-3" />
                        </div>
                        <span className="truncate text-xs font-semibold">
                            {selectedBranch ? selectedBranch.name : "Select Branch"}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px]" align="start">
                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest px-2 py-1.5 flex items-center justify-between">
                    Locations
                    <Globe className="h-3 w-3" />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => setSelectedBranch(null)}
                    className={cn("flex items-center gap-2 px-2 py-2 cursor-pointer", !selectedBranch && "bg-accent")}
                >
                    <div className="flex h-5 w-5 items-center justify-center rounded border border-border bg-background">
                        <Globe className="h-3 w-3" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">All Branches</span>
                        <span className="text-[10px] text-muted-foreground">Aggregated View</span>
                    </div>
                    {!selectedBranch && <Check className="ml-auto h-4 w-4 text-primary" />}
                </DropdownMenuItem>

                {branches.map((branch) => (
                    <DropdownMenuItem
                        key={branch.id}
                        onClick={() => setSelectedBranch(branch)}
                        className={cn("flex items-center gap-2 px-2 py-2 cursor-pointer", selectedBranch?.id === branch.id && "bg-accent")}
                    >
                        <div className="flex h-5 w-5 items-center justify-center rounded border border-border bg-background">
                            <MapPin className="h-3 w-3" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-[140px]">{branch.name}</span>
                            <span className="text-[10px] text-muted-foreground">{branch.city} â€¢ {branch.code}</span>
                        </div>
                        {selectedBranch?.id === branch.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-primary cursor-pointer hover:bg-primary/5">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs font-medium">Manage Branches</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default BranchSwitcher;
