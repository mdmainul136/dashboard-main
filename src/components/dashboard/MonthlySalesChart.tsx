import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";
import { getMonthlySalesByPurpose, getChartConfigByPurpose } from "@/hooks/useDashboardData";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";

const MonthlySalesChart = () => {
  const { businessPurpose } = useMerchantRegion();
  const data = getMonthlySalesByPurpose(businessPurpose);
  const config = getChartConfigByPurpose(businessPurpose);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">{config.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{config.subtitle}</p>
        </div>
        <button className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="25%">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "hsl(var(--accent))", radius: 8 }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "hsl(var(--card-foreground))", fontWeight: 600, fontSize: 13 }}
          />
          <Bar dataKey="sales" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
