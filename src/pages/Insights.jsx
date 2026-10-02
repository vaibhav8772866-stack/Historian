import React, { useState } from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Repeat, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { INSIGHTS_DATA } from '../data/mockData';
import ConfidenceBar from '../components/common/ConfidenceBar';
import Drawer from '../components/common/Drawer';

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeInsight, setActiveInsight] = useState(null);

  const categories = [
    "All",
    "Root Causes",
    "Emerging Patterns",
    "Recurring Problems",
    "Business Opportunities",
    "Risk Signals"
  ];

  const filteredInsights = INSIGHTS_DATA.filter((ins) => 
    selectedCategory === 'All' || ins.category === selectedCategory
  );

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
          <span>Insights & Causes</span>
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
            Pattern Engine
          </span>
        </h1>
        <p className="text-sm font-medium text-[#6B7280] mt-1">
          Algorithmic detection of systemic patterns, cost drivers, and organizational vulnerabilities.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FF8000] text-white shadow-sm'
                : 'bg-white text-[#4B5563] hover:bg-[#FFF0E0] hover:text-[#1F2937] border border-[#E8E4D0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInsights.map((ins) => {
          let badgeBg = "bg-rose-50 text-rose-700 border-rose-100";
          if (ins.category === "Business Opportunities") badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-100";
          if (ins.category === "Emerging Patterns") badgeBg = "bg-amber-50 text-amber-700 border-amber-100";
          if (ins.category === "Risk Signals") badgeBg = "bg-purple-50 text-purple-700 border-purple-100";

          return (
            <div
              key={ins.id}
              className="historian-card p-6 flex flex-col justify-between bg-white border-[#E8E4D0] hover:border-[#FF8000] group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${badgeBg}`}>
                    {ins.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {ins.confidence}% Confidence
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1F2937] mt-3 group-hover:text-[#FF8000] transition-colors">
                  {ins.title}
                </h3>
                <p className="text-xs text-[#4B5563] mt-2 leading-relaxed font-medium">
                  {ins.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>{ins.evidenceCount} Evidence Docs</span>
                  </span>
                  <span className="text-[#FF8000] font-bold">{ins.impact}</span>
                </div>

                <button
                  onClick={() => setActiveInsight(ins)}
                  className="w-full py-2 px-3 rounded-xl bg-[#FFF0E0] hover:bg-[#FF8000] border border-[#FFD1A4] hover:border-[#FF8000] text-xs font-bold text-[#E67300] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Full Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight Analysis Drawer */}
      <Drawer
        isOpen={Boolean(activeInsight)}
        onClose={() => setActiveInsight(null)}
        title={activeInsight?.title || "Insight Analysis"}
        subtitle={`Systemic Intelligence Record • ${activeInsight?.category}`}
      >
        {activeInsight && (
          <div className="space-y-5 text-sm text-[#4B5563]">
            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex justify-between">
              <div>
                <span className="text-xs font-bold text-[#9CA3AF] uppercase">Department</span>
                <div className="font-bold text-[#1F2937] text-sm mt-0.5">{activeInsight.department}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase">Confidence Score</span>
                <div className="font-bold text-emerald-600 text-sm mt-0.5">{activeInsight.confidence}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Executive Synthesis
              </h4>
              <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed bg-white p-4 rounded-xl border border-[#E8E4D0] font-medium">
                {activeInsight.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Impact Classification
              </h4>
              <div className="p-3.5 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] text-[#804000] font-bold text-xs">
                {activeInsight.impact} — {activeInsight.timeline}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Correlated Evidence Files ({activeInsight.evidenceCount})
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl border border-[#E8E4D0] bg-white flex items-center justify-between">
                  <span className="font-bold text-[#1F2937]">Historical Procurement Audit & Ledger</span>
                  <span className="text-emerald-600 font-bold">96% Match</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E8E4D0] bg-white flex items-center justify-between">
                  <span className="font-bold text-[#1F2937]">Quarterly Logistics SLA Dispatch Reports</span>
                  <span className="text-emerald-600 font-bold">92% Match</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setActiveInsight(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
