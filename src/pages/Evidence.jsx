import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Mail, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Calendar,
  Share2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { TOP_EVIDENCE_SOURCES } from '../data/mockData';
import Drawer from '../components/common/Drawer';
import ConfidenceBar from '../components/common/ConfidenceBar';

export default function Evidence() {
  const [sources, setSources] = useState(TOP_EVIDENCE_SOURCES);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'EML':
        return <Mail className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-[#FF8000]" />;
    }
  };

  const filteredSources = sources.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || doc.type === typeFilter;
    const matchesDept = deptFilter === 'All' || doc.category.toLowerCase().includes(deptFilter.toLowerCase());
    return matchesSearch && matchesType && matchesDept;
  });

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>Sources & Evidence</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
              Forensic Repository
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Searchable repository of contracts, spreadsheets, logs, and communications verifying enterprise causality.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('All');
              setDeptFilter('All');
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold text-[#4B5563] bg-white hover:bg-[#FFF0E0] hover:text-[#FF8000] border border-[#E8E4D0] flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="historian-card p-5 bg-white border-[#E8E4D0] space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by keyword, clause, vendor name, or transaction ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs sm:text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:bg-white focus:border-[#FF8000] outline-none transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
            >
              <option value="All">All File Types</option>
              <option value="PDF">PDF Documents</option>
              <option value="XLSX">XLSX Spreadsheets</option>
              <option value="EML">EML Email Threads</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Procurement">Procurement</option>
              <option value="Financial">Financial</option>
              <option value="Operations">Operations</option>
              <option value="Communications">Communications</option>
              <option value="Customer Experience">Customer Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSources.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="historian-card p-6 flex flex-col justify-between bg-white border-[#E8E4D0] hover:border-[#FF8000] cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {getFileIcon(doc.type)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                    {doc.type} • {doc.fileSize}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600">
                  {doc.confidence}% Match
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#1F2937] mt-3 group-hover:text-[#FF8000] transition-colors line-clamp-1">
                {doc.title}
              </h3>
              <p className="text-xs text-[#4B5563] mt-2 leading-relaxed line-clamp-3 font-medium">
                "{doc.snippet}"
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-semibold">{doc.category}</span>
                <span>{doc.date}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDoc(doc);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#FFF0E0] hover:bg-[#FF8000] border border-[#FFD1A4] hover:border-[#FF8000] text-xs font-bold text-[#E67300] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Document Preview</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Drawer */}
      <Drawer
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || "Evidence Document"}
        subtitle={`Enterprise Repository • ${selectedDoc?.type} Record • ${selectedDoc?.date}`}
        width="max-w-2xl"
      >
        {selectedDoc && (
          <div className="space-y-6 text-sm text-[#4B5563]">
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#9CA3AF]">File Type</span>
                <div className="font-bold text-[#1F2937] text-xs mt-0.5">{selectedDoc.type} • {selectedDoc.fileSize}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#9CA3AF]">Category</span>
                <div className="font-bold text-[#1F2937] text-xs mt-0.5">{selectedDoc.category}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#9CA3AF]">Confidence</span>
                <div className="font-bold text-emerald-600 text-xs mt-0.5">{selectedDoc.confidence}% Match</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Executive Abstract
              </h4>
              <p className="p-4 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] text-xs font-medium text-[#804000] leading-relaxed">
                "{selectedDoc.snippet}"
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Extracted Key Quotes & Evidentiary Clauses
              </h4>
              <div className="space-y-2">
                {selectedDoc.keyQuotes?.map((quote, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] text-xs text-[#1F2937] leading-relaxed">
                    {quote}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => alert(`Downloading verified copy of ${selectedDoc.title}`)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#4B5563] bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Archive</span>
              </button>

              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
