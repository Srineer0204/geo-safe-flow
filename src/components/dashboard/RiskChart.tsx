import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { riskTrendData } from "@/data/mockData";
import { TrendingUp } from "lucide-react";

const RiskChart = () => {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        Risk Trends (6 months)
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={riskTrendData}>
            <defs>
              <linearGradient id="gradME" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0,72%,55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0,72%,55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradEU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142,70%,45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142,70%,45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(45,93%,55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(45,93%,55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220,18%,10%)",
                border: "1px solid hsl(220,15%,18%)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="middleEast" stroke="hsl(0,72%,55%)" fill="url(#gradME)" strokeWidth={2} name="Middle East" />
            <Area type="monotone" dataKey="europe" stroke="hsl(142,70%,45%)" fill="url(#gradEU)" strokeWidth={2} name="Europe" />
            <Area type="monotone" dataKey="asia" stroke="hsl(45,93%,55%)" fill="url(#gradAS)" strokeWidth={2} name="Asia" />
            <Area type="monotone" dataKey="africa" stroke="hsl(0,60%,45%)" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Africa" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskChart;
