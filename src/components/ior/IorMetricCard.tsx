import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IorMetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    positive?: boolean;
    icon: LucideIcon;
    gradient: string;
    className?: string;
}

export function IorMetricCard({ title, value, change, positive, icon: Icon, gradient, className }: IorMetricCardProps) {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-primary/20",
            className
        )}>
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-5 blur-2xl transition-all duration-500 group-hover:opacity-10`} />

            <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                        {value}
                    </h3>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            {change !== undefined && (
                <div className="mt-4 flex items-center gap-2 relative z-10">
                    <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${positive
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                            }`}
                    >
                        {positive ? "↑" : "↓"} {change}%
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">vs last month</span>
                </div>
            )}
        </div>
    );
}
