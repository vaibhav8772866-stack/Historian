import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowDown, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Layers, 
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { PRIMARY_CAUSAL_CHAIN } from '../../data/timelineData';
import Drawer from '../common/Drawer';
import ConfidenceBar from '../common/ConfidenceBar';

export default function CausalTimeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <div className="historian-card p-6 flex flex-col justify-between h-full bg-white border-[#E8E4D0] relative">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FFF0E0] text-[#FF8000] border border-[#FFD1A4]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Causal Chain Timeline</h3>
                <p className="text-xs text-[#6B7280] font-medium">Sequential root-cause attribution pathway</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#4B5563]">
              4 Chain Links
            </span>
          </div>

          {/* Interactive Timeline Chain */}
          <div className="mt-5 space-y-3 relative">
            {PRIMARY_CAUSAL_CHAIN.map((event, index) => {
              const isLast = index === PRIMARY_CAUSAL_CHAIN.length - 1;

              return (
                <div key={event.id} className="relative">
                  {/* Step Item Button */}
                  <div
                    onClick={() => setSelectedEvent(event)}
                    className="p-3.5 rounded-xl border border-[#E8E4D0] hover:border-[#FF8000] bg-white hover:bg-[#FFFDF7] cursor-pointer transition-all duration-200 group shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#E67300] bg-[#FFF0E0] px-2 py-0.5 rounded-md border border-[#FFD1A4]">
                            {event.date}
                          </span>
                          <span className="text-xs font-bold text-[#1F2937] group-hover:text-[#FF8000] transition-colors truncate">
                            {event.title}
                          </span>
                        </div>
                        <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed font-medium">
                          {event.summary}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-[#9CA3AF] group-hover:text-[#FF8000] text-xs font-medium">
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Down arrow link between steps */}
                  {!isLast && (
                    <div className="flex justify-center my-1">
                      <div className="w-5 h-5 rounded-full bg-[#FFF0E0] flex items-center justify-center text-[#FF8000]">
                        <ArrowDown className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={() => navigate('/timeline')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#FF8000] hover:text-white bg-[#FFF0E0] hover:bg-[#FF8000] transition-all flex items-center justify-center gap-2 group cursor-pointer border border-[#FFD1A4] hover:border-[#FF8000]"
          >
            <span>View Full Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Event Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || "Event Detail"}
        subtitle={`Chronological Record: ${selectedEvent?.exactDate || selectedEvent?.date}`}
      >
        {selectedEvent && (
          <div className="space-y-6 text-sm text-[#4B5563]">
            {/* Header Badge */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0]">
              <div>
                <span className="text-xs font-semibold text-[#9CA3AF]">Department</span>
                <div className="font-bold text-[#1F2937]">{selectedEvent.department}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#9CA3AF]">Attribution Confidence</span>
                <div className="font-bold text-emerald-600">{selectedEvent.confidence}%</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Executive Forensic Analysis
              </h4>
              <p className="text-sm text-[#1F2937] leading-relaxed bg-white p-4 rounded-xl border border-[#E8E4D0] shadow-2xs font-medium">
                {selectedEvent.description}
              </p>
            </div>

            {/* Impact Metric */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Measured Operational Impact
              </h4>
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5 text-rose-900 font-semibold text-xs">
                <TrendingDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{selectedEvent.impact}</span>
              </div>
            </div>

            {/* Related Entities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Connected Knowledge Entities
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.relatedEntities.map((entity, i) => (
                  <span 
                    key={i}
                    onClick={() => {
                      setSelectedEvent(null);
                      navigate('/graph');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-[#FFF0E0] hover:text-[#FF8000] text-[#4B5563] cursor-pointer transition-colors"
                  >
                    #{entity}
                  </span>
                ))}
              </div>
            </div>

            {/* Evidence Documents */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Verified Documentary Evidence
              </h4>
              <div className="space-y-2">
                {selectedEvent.evidenceDocs.map((doc, i) => (
                  <div 
                    key={i}
                    onClick={() => {
                      setSelectedEvent(null);
                      navigate('/evidence');
                    }}
                    className="p-3 rounded-xl border border-[#E8E4D0] hover:border-[#FF8000] bg-white hover:bg-[#FFFDF7] cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-[#FF8000] shrink-0" />
                      <span className="text-xs font-semibold text-[#1F2937] truncate">{doc}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  navigate('/timeline');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-xs cursor-pointer"
              >
                Open in Full Timeline
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
