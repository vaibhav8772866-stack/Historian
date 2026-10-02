import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  FileSpreadsheet, 
  Mail, 
  ArrowRight, 
  ExternalLink, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { TOP_EVIDENCE_SOURCES } from '../../data/mockData';
import Drawer from '../common/Drawer';
import ConfidenceBar from '../common/ConfidenceBar';

export default function TopEvidence() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      case 'EML':
        return <Mail className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-[#FF8000]" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'PDF':
        return "bg-rose-50 text-rose-700 border-rose-100";
      case 'XLSX':
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case 'EML':
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <div className="historian-card p-6 flex flex-col justify-between h-full bg-white border-[#E8E4D0] relative">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FFF0E0] text-[#FF8000] border border-[#FFD1A4]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Top Evidence Sources</h3>
                <p className="text-xs text-[#6B7280] font-medium">Forensically verified enterprise citations</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#4B5563]">
              5 Sources
            </span>
          </div>

          {/* List of Evidence Items */}
          <div className="mt-4 space-y-2.5">
            {TOP_EVIDENCE_SOURCES.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-3 rounded-xl border border-[#E8E4D0] hover:border-[#FF8000] bg-white hover:bg-[#FFFDF7] cursor-pointer transition-all duration-200 group flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1F2937] group-hover:text-[#FF8000] transition-colors truncate">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getTypeBadge(doc.type)}`}>
                        {doc.type}
                      </span>
                      <span className="text-[11px] text-[#9CA3AF] font-medium">{doc.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-600 tabular-nums">
                    {doc.confidence}%
                  </span>
                  <div className="w-12 mt-1">
                    <ConfidenceBar value={doc.confidence} showLabel={false} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={() => navigate('/evidence')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#FF8000] hover:text-white bg-[#FFF0E0] hover:bg-[#FF8000] transition-all flex items-center justify-center gap-2 group cursor-pointer border border-[#FFD1A4] hover:border-[#FF8000]"
          >
            <span>View All Sources</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Document Viewer Drawer */}
      <Drawer
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || "Document Preview"}
        subtitle={`Enterprise Repository • ${selectedDoc?.type} Document • ${selectedDoc?.date}`}
        width="max-w-2xl"
      >
        {selectedDoc && (
          <div className="space-y-6 text-sm text-[#4B5563]">
            {/* Metadata Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#9CA3AF]">File Type & Size</span>
                <div className="font-bold text-[#1F2937] text-xs mt-0.5">{selectedDoc.type} • {selectedDoc.fileSize}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#9CA3AF]">Category</span>
                <div className="font-bold text-[#1F2937] text-xs mt-0.5">{selectedDoc.category}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#9CA3AF]">Attribution Match</span>
                <div className="font-bold text-emerald-600 text-xs mt-0.5">{selectedDoc.confidence}% Match</div>
              </div>
            </div>

            {/* Document Extract Snippet */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Forensic Content Abstract
              </h4>
              <div className="p-4 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] text-xs font-medium text-[#804000] leading-relaxed">
                "{selectedDoc.snippet}"
              </div>
            </div>

            {/* Key Extracted Quotes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Key Extracted Clauses & Quotes
              </h4>
              <div className="space-y-2.5">
                {selectedDoc.keyQuotes.map((quote, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] text-xs text-[#1F2937] leading-relaxed flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8000] shrink-0 mt-1.5" />
                    <span>{quote}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => alert(`Downloading archive copy: ${selectedDoc.title}`)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#4B5563] hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedDoc(null);
                    navigate('/evidence');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-xs cursor-pointer"
                >
                  Open Evidence Hub
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
