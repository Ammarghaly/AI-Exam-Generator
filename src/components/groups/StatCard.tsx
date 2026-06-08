import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { GroupStat } from "../../types/group.types";


interface Props {
  stat: GroupStat;
  icon: React.ReactNode;
  accentColor: string;
}

export default function StatCard({ stat, icon, accentColor }: Props) {
  const TrendIcon =
    stat.trend === "up"
      ? TrendingUp
      : stat.trend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    stat.trend === "up"
      ? "text-green-500"
      : stat.trend === "down"
      ? "text-orange-500"
      : "text-gray-400";

  return (
    <div
      className="bg-white rounded-2xl p-5 flex-1 min-w-[160px] shadow-sm border-t-4 transition-shadow hover:shadow-md"
      style={{ borderTopColor: accentColor }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          {stat.label}
        </span>
        <div
          className="p-1.5 rounded-lg"
          style={{ backgroundColor: accentColor + "15" }}
        >
          {icon}
        </div>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-2">
        {stat.value}
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
        <TrendIcon size={12} />
        {stat.sub}
      </div>
    </div>
  );
}