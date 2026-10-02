import React, { useState } from 'react';
import { 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingDown, 
  Layers,
  Clock
} from 'lucide-react';
import { HERO_CARDS_DATA } from '../../data/mockData';
import ConfidenceBar from '../common/ConfidenceBar';
import Modal from '../common/Modal';

export default function HeroCards() {
  const [modalOpen, setModalOpen] = useState(false);
  const { recentQuery, rootCause, aiRecommendation } = HERO_CARDS_DATA;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: RECENT QUERY */}
        <div className="historian-card p-6 flex flex-col justify-between relative overflow-hidden bg-white">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-[#4B5563]">
                <HelpCircle className="w-3.5 h-3.5 text-[#6B7280]" />
                {recentQuery.title}
              </span>
              <span className="text-[11px] font-medium text-[#9CA3AF] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recentQuery.timestamp}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#1F2937] leading-snug tracking-tight mt-2">
              “{recentQuery.question}”
            </h3>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-medium text-[#4B5563]">{recentQuery.category}</span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFF0E0] text-[#E67300] font-semibold border border-[#FFD1A4]">
              {recentQuery.department}
            </span>
          </div>
        </div>

        {/* Card 2: ROOT CAUSE */}
        <div className="historian-card p-6 flex flex-col justify-between relative overflow-hidden bg-white border-amber-200/70">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-100/70 text-amber-800 border border-amber-200/60">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {rootCause.title}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md">
                {rootCause.confidence}% Confidence
              </span>
            </div>

            <h3 className="text-base font-bold text-[#1F2937] leading-snug tracking-tight mt-2">
              {rootCause.mainText}
            </h3>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#6B7280]">Attribution Confidence</span>
              <span className="font-bold text-emerald-600">{rootCause.confidence}%</span>
            </div>
            <ConfidenceBar value={rootCause.confidence} showLabel={false} size="md" />
          </div>
        </div>

        {/* Card 3: AI RECOMMENDATION */}
        <div className="historian-card p-6 flex flex-col justify-between relative overflow-hidden bg-white border-[#FFD1A4] shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF8000]" />
                {aiRecommendation.title}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded border border-emerald-200/60">
                High Impact
              </span>
            </div>

            <p className="text-sm font-semibold text-[#1F2937] leading-relaxed mt-2">
              {aiRecommendation.summary}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8000] hover:text-[#E67300] transition-colors group cursor-pointer"
            >
              <span>{aiRecommendation.cta}</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Recommendation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="AI Recommendation: Supplier Contract Restructuring"
        subtitle="Harvey synthesized corrective strategy based on 2019 margin variance analysis"
      >
        <div className="space-y-5 text-[#4B5563] text-sm">
          <div className="p-4 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#FF8000] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#804000] text-sm">Strategic Executive Directive</div>
              <p className="text-xs text-[#994D00] mt-1 font-medium">
                {aiRecommendation.summary}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#1F2937] text-xs uppercase tracking-wider text-[#9CA3AF] mb-2">
              Recommended Execution Steps
            </h4>
            <div className="space-y-2.5">
              {aiRecommendation.details.actionPlan.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-5 h-5 rounded-full bg-[#FF8000] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-[#1F2937] leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-bold uppercase text-[#9CA3AF]">Projected Annual Savings</div>
              <div className="text-base font-extrabold text-emerald-600 mt-0.5">
                {aiRecommendation.details.projectedSavings}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-bold uppercase text-[#9CA3AF]">Risk Reduction</div>
              <div className="text-xs font-bold text-[#FF8000] mt-1">
                {aiRecommendation.details.riskMitigation}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-[#4B5563] hover:text-[#1F2937] hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert("Recommendation mandate exported to Procurement Executive Committee.");
                setModalOpen(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] rounded-xl shadow-sm cursor-pointer"
            >
              Export Action Mandate
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
