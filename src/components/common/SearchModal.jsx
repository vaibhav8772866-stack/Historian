import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Share2, 
  FileText, 
  ArrowRight, 
  X,
  Layers,
  HelpCircle
} from 'lucide-react';
import { SUGGESTED_QUERIES, TOP_EVIDENCE_SOURCES } from '../../data/mockData';
import { PRIMARY_CAUSAL_CHAIN } from '../../data/timelineData';
import { GRAPH_NODES } from '../../data/causalGraphData';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredQueries = SUGGESTED_QUERIES.filter(q => 
    q.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = PRIMARY_CAUSAL_CHAIN.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) || 
    e.summary.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = TOP_EVIDENCE_SOURCES.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.snippet.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEntities = GRAPH_NODES.filter(n =>
    n.label.toLowerCase().includes(query.toLowerCase()) ||
    n.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectQuery = (q) => {
    onClose();
    navigate(`/ask?q=${encodeURIComponent(q)}`);
  };

  const handleSelectNav = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-4 sm:p-6 sm:pt-20">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={onClose}
        />

        {/* Search Palette */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E8E4D0] transition-all animate-fade-in divide-y divide-slate-100">
          {/* Top Search Input */}
          <div className="relative flex items-center px-4 py-3.5 bg-white">
            <Search className="w-5 h-5 text-[#FF8000] mr-3 shrink-0" />
            <input
              type="text"
              className="w-full bg-transparent text-base text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none font-medium"
              placeholder="Search enterprise memory, causal events, documents, entities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 bg-slate-100 border border-slate-200 rounded font-mono ml-2">
              ESC
            </kbd>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-sm bg-white">
            {/* Quick Ask Suggestion if user is typing */}
            {query && (
              <div 
                onClick={() => handleSelectQuery(query)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] hover:bg-[#FFE5CC] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF8000] flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#804000]">Ask Harvey about "{query}"</div>
                    <div className="text-xs text-[#994D00]">Search 20 years of enterprise memory for root causes</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#FF8000] transform group-hover:translate-x-1 transition-transform" />
              </div>
            )}

            {/* Suggested Enterprise Queries */}
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Enterprise Memory Queries</span>
              </div>
              <div className="mt-1 space-y-0.5">
                {filteredQueries.slice(0, 4).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuery(item)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[#1F2937] hover:bg-[#FFF0E0] hover:text-[#FF8000] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Sparkles className="w-4 h-4 text-[#FF8000] shrink-0" />
                      <span className="truncate font-medium">{item}</span>
                    </div>
                    <span className="text-xs text-[#E67300] opacity-0 group-hover:opacity-100 flex items-center gap-1 font-semibold">
                      Query <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Causal Timeline Events */}
            {filteredEvents.length > 0 && (
              <div>
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Causal Timeline Events</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {filteredEvents.map(evt => (
                    <button
                      key={evt.id}
                      onClick={() => handleSelectNav('/timeline')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[#1F2937] hover:bg-[#FFF0E0] hover:text-[#FF8000] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded">
                          {evt.date}
                        </span>
                        <span className="font-medium text-[#1F2937] truncate">{evt.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 ml-2">94% Confidence</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Documents */}
            {filteredDocs.length > 0 && (
              <div>
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Evidence Documents</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {filteredDocs.slice(0, 3).map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectNav('/evidence')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[#1F2937] hover:bg-[#FFF0E0] hover:text-[#FF8000] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded">
                          {doc.type}
                        </span>
                        <span className="text-[#1F2937] truncate">{doc.title}</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">{doc.confidence}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge Graph Entities */}
            {filteredEntities.length > 0 && (
              <div>
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Knowledge Graph Entities</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {filteredEntities.slice(0, 3).map(entity => (
                    <button
                      key={entity.id}
                      onClick={() => handleSelectNav('/graph')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[#1F2937] hover:bg-[#FFF0E0] hover:text-[#FF8000] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entity.color }} />
                        <span className="font-medium text-[#1F2937] truncate">{entity.label}</span>
                        <span className="text-xs text-[#9CA3AF]">({entity.type})</span>
                      </div>
                      <span className="text-xs text-[#FF8000] font-semibold">Explore &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Navigation Pages */}
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Navigate To</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {[
                  { name: "Dashboard", path: "/dashboard" },
                  { name: "Timeline Intelligence", path: "/timeline" },
                  { name: "Knowledge Graph", path: "/graph" },
                  { name: "Insights & Causes", path: "/insights" },
                  { name: "Forecast & Trends", path: "/forecasts" },
                  { name: "Sources & Evidence", path: "/evidence" },
                  { name: "Reports", path: "/reports" },
                  { name: "Alerts", path: "/alerts" }
                ].map(nav => (
                  <button
                    key={nav.path}
                    onClick={() => handleSelectNav(nav.path)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#4B5563] hover:bg-[#FFF0E0] hover:text-[#1F2937] text-left cursor-pointer"
                  >
                    <span>{nav.name}</span>
                    <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5 bg-[#FFFDF7] flex items-center justify-between text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-3">
              <span>Use <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd> to navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Enter</kbd> to select</span>
            </div>
            <span>Historian Enterprise Memory</span>
          </div>
        </div>
      </div>
    </div>
  );
}
