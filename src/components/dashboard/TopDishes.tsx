"use client";

import { restaurantDishes } from "@/data/restaurantMock";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const TopDishes = () => {
    // Sort by popularity and take top 5
    const topDishes = [...restaurantDishes]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5);

    return (
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm animate-fade-in transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold">Top Performing Dishes</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Based on this week's sales</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary fill-primary/20" />
                </div>
            </div>

            <div className="space-y-5">
                {topDishes.map((dish, index) => (
                    <div key={dish.id} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center font-bold text-muted-foreground text-sm border border-border/40">
                            #{index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-semibold truncate uppercase tracking-tight">{dish.name}</h4>
                                <span className="text-sm font-bold text-primary">{dish.price}</span>
                            </div>

                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[11px] text-muted-foreground">{dish.category}</span>
                                <div className="h-1 w-1 rounded-full bg-border" />
                                <div className="flex items-center gap-1">
                                    {dish.growth >= 0 ? (
                                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-rose-500" />
                                    )}
                                    <span className={cn(
                                        "text-[10px] font-bold",
                                        dish.growth >= 0 ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {dish.growth >= 0 ? "+" : ""}{dish.growth}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/30 border border-border/40">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-[10px] font-medium">{dish.popularity}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopDishes;
