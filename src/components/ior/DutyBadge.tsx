"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DutyBadgeProps {
    rate: number;
    className?: string;
}

export function DutyBadge({ rate, className }: DutyBadgeProps) {
    const getColors = (val: number) => {
        if (val <= 10) return "bg-emerald-50 text-emerald-600 border-emerald-100";
        if (val <= 30) return "bg-amber-50 text-amber-600 border-amber-100";
        return "bg-red-50 text-red-600 border-red-100";
    };

    return (
        <Badge
            variant="outline"
            className={cn("font-bold text-[10px] border-none", getColors(rate), className)}
        >
            {rate}%
        </Badge>
    );
}
