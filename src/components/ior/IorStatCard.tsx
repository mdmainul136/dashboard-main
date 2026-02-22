"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IorStatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    className?: string;
    variant?: "default" | "premium" | "dark" | "ghost";
}

export function IorStatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
    variant = "default"
}: IorStatCardProps) {
    const variants = {
        default: "bg-card border-border shadow-[var(--shadow-card)] text-foreground",
        premium: "bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-none shadow-lg shadow-indigo-500/20",
        dark: "bg-foreground dark:bg-card text-white dark:text-foreground border-none shadow-xl",
        ghost: "bg-secondary/30 border-dashed border-border text-foreground shadow-none",
    };

    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-[var(--shadow-card-hover)] duration-500", variants[variant], className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <p className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.15em]",
                            variant === "default" || variant === "ghost" ? "text-muted-foreground" : "text-white/70"
                        )}>
                            {title}
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl transition-transform duration-500 group-hover:scale-110",
                        variant === "default" || variant === "ghost" ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                {(description || trend) && (
                    <div className="mt-4 flex items-center gap-2">
                        {trend && (
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
                                variant === "default" || variant === "ghost"
                                    ? (trend.isUp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")
                                    : "bg-white/20 text-white"
                            )}>
                                {trend.isUp ? "↑" : "↓"} {trend.value}
                            </span>
                        )}
                        {description && (
                            <p className={cn(
                                "text-[10px] font-medium opacity-80",
                                variant === "default" || variant === "ghost" ? "text-muted-foreground" : "text-white/60"
                            )}>
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
