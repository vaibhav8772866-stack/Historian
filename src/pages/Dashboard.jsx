import React, { useState } from 'react';
import HeroCards from '../components/dashboard/HeroCard';
import KPICards from '../components/dashboard/KPICard';
import CausalTimeline from '../components/dashboard/CausalTimeline';
import GraphPreview from '../components/dashboard/GraphPreview';
import TopEvidence from '../components/dashboard/TopEvidence';
import HarveyAssistant from '../components/dashboard/HarveyAssistant';
import EmployeeBadgeSearchModal from '../components/employee/EmployeeBadgeSearchModal';
import { Sparkles, History, Calendar, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  return (
    <div className="space-y-7 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2">
            <span>Welcome back, Arambh!</span>
            <span className="inline-block animate-bounce origin-bottom-right">👋</span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            20 years of enterprise memory. Infinite possibilities.
          </p>
        </div>

        {/* Quick Enterprise Status Indicator */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E4D0] shadow-2xs self-start sm:self-auto text-xs font-semibold text-[#4B5563]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Memory Stream Active</span>
          <span className="text-[#D1D5DB]">•</span>
          <span className="text-[#FF8000] font-bold">18 Sources Synced</span>
        </div>
      </div>

      {/* 3 Hero Cards */}
      <section aria-label="Primary Forensic Signals">
        <HeroCards />
      </section>

      {/* 5 KPI Metric Cards */}
      <section aria-label="Enterprise Memory KPIs">
        <KPICards />
      </section>

      {/* 3 Column Causal & Graph Grid */}
      <section aria-label="Causal Intelligence Grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1 h-full">
          <CausalTimeline />
        </div>
        <div className="lg:col-span-1 h-full">
          <GraphPreview />
        </div>
        <div className="lg:col-span-1 h-full">
          <TopEvidence />
        </div>
      </section>

      {/* Bottom Harvey Assistant Card */}
      <section aria-label="Harvey Assistant">
        <HarveyAssistant onOpenBadgeSearch={() => setIsBadgeModalOpen(true)} />
      </section>

      {/* Employee Badge Search Modal */}
      <EmployeeBadgeSearchModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </div>
  );
}
