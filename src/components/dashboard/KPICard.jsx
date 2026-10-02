import React from 'react';
import { 
  Target, 
  Zap, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';
import { KPI_METRICS } from '../../data/mockData';

const iconMap = {
  Target,
  Zap,
  ShieldCheck,
  Database,
  Sparkles
};

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {KPI_METRICS.map((kpi) => {
        const IconComponent = iconMap[kpi.icon] || Sparkles;

        // Custom subtle background / badge colors with orange brand accent
        const accentBg = "bg-[#FFF0E0] text-[#FF8000]";
        const trendBadge = "text-emerald-700 bg-emerald-50 border-emerald-100";

        return (
          <div 
            key={kpi.id} 
            className="historian-card p-5 flex flex-col justify-between group hover:translate-y-[-2px] transition-transform duration-200 bg-white border-[#E8E4D0]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280] line-clamp-1">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl ${accentBg} shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-xs font-medium text-[#6B7280] mt-0.5">
                  {kpi.description}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${trendBadge}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
