"use client";

import { CheckCircle2, Clock, Truck, ShieldCheck, HelpCircle } from "lucide-react";

interface Milestone {
    id: number;
    status: string;
    message_en: string;
    location?: string;
    created_at: string;
}

interface MilestoneTimelineProps {
    milestones: Milestone[];
}

const statusMap: Record<string, { icon: any; color: string }> = {
    pending: { icon: Clock, color: "text-amber-500" },
    sourcing: { icon: HelpCircle, color: "text-blue-500" },
    ordered: { icon: CheckCircle2, color: "text-indigo-500" },
    warehouse_received: { icon: ShieldCheck, color: "text-emerald-500" },
    dispatched: { icon: Truck, color: "text-sky-500" },
    customs_cleared: { icon: ShieldCheck, color: "text-purple-500" },
    delivered: { icon: CheckCircle2, color: "text-emerald-500" },
};

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
    if (!milestones || milestones.length === 0) {
        return (
            <div className="py-8 text-center text-xs text-white/30">
                No tracking history available yet.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {milestones.map((milestone, index) => {
                const config = statusMap[milestone.status] || { icon: HelpCircle, color: "text-white/40" };
                const Icon = config.icon;

                return (
                    <div key={milestone.id} className="relative flex gap-4">
                        {index !== milestones.length - 1 && (
                            <div className="absolute left-[11px] top-6 h-full w-[1px] bg-white/10" />
                        )}

                        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black border border-white/10 shadow-lg ${config.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                        </div>

                        <div className="flex flex-col gap-1 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-white/90">
                                    {milestone.message_en}
                                </span>
                                <span className="text-[10px] text-white/30">
                                    {new Date(milestone.created_at).toLocaleString()}
                                </span>
                            </div>
                            {milestone.location && (
                                <span className="text-[10px] font-medium text-primary/70 uppercase tracking-wider">
                                    {milestone.location}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
