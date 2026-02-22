import { ArrowUp, ArrowDown } from "lucide-react";
import { getTargetByPurpose } from "@/hooks/useDashboardData";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";

const MonthlyTarget = () => {
  const { businessPurpose } = useMerchantRegion();
  const targetData = getTargetByPurpose(businessPurpose);
  const { percentage, todayEarned, target, revenue, today, label } = targetData;

  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-card-foreground">{label}</h3>
        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          +10%
        </span>
      </div>

      {/* Semi-circular gauge */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="200" height="110" viewBox="0 0 200 110">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
            <path d="M 15 95 A 75 75 0 0 1 185 95" fill="none" stroke="hsl(var(--border))" strokeWidth="14" strokeLinecap="round" />
            <path d="M 15 95 A 75 75 0 0 1 185 95" fill="none" stroke="url(#gaugeGradient)" strokeWidth="14" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="text-3xl font-bold text-card-foreground tabular-nums">{percentage}%</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        You achieved <span className="font-semibold text-primary">{todayEarned}</span> today
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Target", value: target, icon: <ArrowDown className="h-3 w-3 text-destructive" /> },
          { label: "Revenue", value: revenue, icon: <ArrowUp className="h-3 w-3 text-success" /> },
          { label: "Today", value: today, icon: <ArrowUp className="h-3 w-3 text-success" /> },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-muted/50 p-3 text-center transition-colors hover:bg-muted">
            <p className="text-[11px] font-medium text-muted-foreground">{item.label}</p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <p className="text-sm font-bold text-card-foreground">{item.value}</p>
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyTarget;
