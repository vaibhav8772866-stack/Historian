import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Download, 
  Share2, 
  Eye, 
  Calendar, 
  User, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Layers,
  FileText
} from 'lucide-react';
import { REPORTS_DATA } from '../data/mockData';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';

export default function Reports() {
  const [reports, setReports] = useState(REPORTS_DATA);
  const [selectedReport, setSelectedReport] = useState(null);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Financial Causal Audit');

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRep = {
      id: `rep-${Date.now()}`,
      title: newTitle.trim(),
      created: "Just now",
      createdBy: "Arambh Srivastava (via Harvey)",
      status: "Published",
      confidence: 95,
      pages: 18,
      summary: `Automated enterprise synthesis for ${newTitle.trim()} incorporating multi-year root-cause links, evidence citations, and forecast models.`
    };

    setReports([newRep, ...reports]);
    setNewTitle('');
    setGenerateModalOpen(false);
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>Executive Reports</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
              Causal Synthesis
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Board-ready root cause audit dossiers, variance memos, and strategic action mandates.
          </p>
        </div>

        <button
          onClick={() => setGenerateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-sm flex items-center gap-2 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="historian-card bg-white overflow-hidden border-[#E8E4D0] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFFDF7] border-b border-[#E8E4D0] text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                <th className="py-3.5 px-6">Report Title</th>
                <th className="py-3.5 px-6">Created Date</th>
                <th className="py-3.5 px-6">Author / Generator</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Confidence</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#4B5563]">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#FFFDF7] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#FFF0E0] text-[#FF8000] border border-[#FFD1A4] shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1F2937] text-sm hover:text-[#FF8000] cursor-pointer" onClick={() => setSelectedReport(rep)}>
                          {rep.title}
                        </div>
                        <div className="text-[11px] text-[#9CA3AF] font-medium">{rep.pages} Pages • Full Forensic Audit</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-[#6B7280]">{rep.created}</td>
                  <td className="py-4 px-6 font-medium text-[#6B7280]">{rep.createdBy}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      rep.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-600">{rep.confidence}%</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReport(rep)}
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#FF8000] hover:bg-[#FFF0E0] transition-colors cursor-pointer"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading PDF: ${rep.title}`)}
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#FF8000] hover:bg-[#FFF0E0] transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Executive share link created for: ${rep.title}`)}
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#FF8000] hover:bg-[#FFF0E0] transition-colors cursor-pointer"
                        title="Share Report"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="Generate Executive Intelligence Report"
        subtitle="Harvey will synthesize causal timeline events, graph metrics, and evidence into a formal dossier."
      >
        <form onSubmit={handleGenerateReport} className="space-y-4 text-xs text-[#4B5563]">
          <div>
            <label className="block text-xs font-bold text-[#1F2937] mb-1">
              Report Subject / Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Q3 2019 Supply Shock & Freight Variance Analysis"
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs text-[#1F2937] outline-none focus:border-[#FF8000] focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2937] mb-1">
              Report Domain & Template
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
            >
              <option value="Financial Causal Audit">Financial Causal Audit & Margin Decomposition</option>
              <option value="Supplier Vulnerability Assessment">Supplier Vulnerability & Sourcing Sensitivity</option>
              <option value="Logistics Cost Optimization">Logistics Emergency Surcharge Investigation</option>
              <option value="Enterprise Knowledge Graph Summary">Enterprise Knowledge Graph Topological Summary</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] text-xs text-[#804000]">
            <div className="font-bold">Harvey Synthesis Scope:</div>
            <p className="mt-1">
              Includes 18 connected data sources, multi-stage causal chain attribution, OCR citations, and forward-looking risk mitigation recommendations.
            </p>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setGenerateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-sm cursor-pointer"
            >
              Synthesize Report
            </button>
          </div>
        </form>
      </Modal>

      {/* View Report Drawer */}
      <Drawer
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title || "Report Dossier"}
        subtitle={`Executive Memory Record • ${selectedReport?.created}`}
        width="max-w-2xl"
      >
        {selectedReport && (
          <div className="space-y-6 text-sm text-[#4B5563]">
            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Author</span>
                <div className="font-bold text-[#1F2937] text-xs mt-0.5">{selectedReport.createdBy}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Attribution Confidence</span>
                <div className="font-bold text-emerald-600 text-xs mt-0.5">{selectedReport.confidence}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Executive Executive Summary
              </h4>
              <p className="p-4 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] text-xs font-medium text-[#804000] leading-relaxed">
                {selectedReport.summary}
              </p>
            </div>

            <div className="border border-[#E8E4D0] rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] font-bold uppercase">
                <span>Dossier Table of Contents</span>
                <span>{selectedReport.pages} Pages</span>
              </div>
              <ul className="space-y-2 text-xs text-[#4B5563] font-medium">
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>1. Executive Summary & Problem Formulation</span>
                  <span className="text-[#9CA3AF]">Page 1–3</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>2. Multi-Stage Causal Chain & Attribution Graph</span>
                  <span className="text-[#9CA3AF]">Page 4–8</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>3. Documentary Evidence & Contractual Audit Extracts</span>
                  <span className="text-[#9CA3AF]">Page 9–13</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>4. Harvey Strategic Risk Mitigation Mandate</span>
                  <span className="text-[#9CA3AF]">Page 14–{selectedReport.pages}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => alert(`Downloading full PDF report: ${selectedReport.title}`)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#4B5563] bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Dossier</span>
              </button>

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] cursor-pointer"
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
