"use client";

import { useIorOrders } from "@/hooks/ior/useIorOrders";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import iorApi from "@/lib/iorApi";

export function IorSupplyChainChart() {
    const { data: performance, isLoading } = useQuery({
        queryKey: ['ior-performance'],
        queryFn: async () => {
            const res = await iorApi.get('/api/ior/dashboard/performance');
            return res.data.data;
        }
    });

    if (isLoading) return <div className="h-[320px] w-100 animate-pulse rounded-2xl bg-white/5" />;

    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-white/90">Supply Chain Velocity</h3>
                    <p className="text-xs text-white/40 mt-1">Order throughput vs delivery success</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-[10px] text-white/50 font-medium">Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-white/50 font-medium">Delivered</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performance}>
                    <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            backdropFilter: "blur(8px)",
                            fontSize: "12px",
                            color: "#fff"
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fill="url(#colorOrders)"
                        dot={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="delivered"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#colorDelivered)"
                        dot={false}
                        strokeDasharray="5 5"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
