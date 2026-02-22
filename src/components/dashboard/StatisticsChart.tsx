import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getStatisticsByPurpose, getStatsTabsByPurpose } from "@/hooks/useDashboardData";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";

const StatisticsChart = () => {
  const { businessPurpose } = useMerchantRegion();
  const tabs = getStatsTabsByPurpose(businessPurpose);
  const { data, labels } = getStatisticsByPurpose(businessPurpose);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">Statistics</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Analytics overview</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <span className="text-xs font-medium text-muted-foreground">{labels[0]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary/30" />
          <span className="text-xs font-medium text-muted-foreground">{labels[1]}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorReceivedV2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorDueV2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              padding: "8px 12px",
            }}
          />
          <Area type="monotone" dataKey="received" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#colorReceivedV2)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
          <Area type="monotone" dataKey="due" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="6 4" fill="url(#colorDueV2)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsChart;
