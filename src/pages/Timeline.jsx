import React, { useState } from 'react';
import { 
  Clock, 
  Filter, 
  Search, 
  ArrowDown, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  TrendingDown, 
  Layers, 
  ShieldAlert, 
  Calendar, 
  ChevronRight,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { EXTENDED_TIMELINE_EVENTS } from '../data/timelineData';
import Drawer from '../components/common/Drawer';
import ConfidenceBar from '../components/common/ConfidenceBar';

export default function Timeline() {
  const [events, setEvents] = useState(EXTENDED_TIMELINE_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedQuarter, setSelectedQuarter] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  // Filter logic
  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = selectedYear === 'All' || evt.date.includes(selectedYear);
    const matchesDept = selectedDept === 'All' || evt.department.includes(selectedDept);
    const matchesSeverity = selectedSeverity === 'All' || evt.severity === selectedSeverity;

    return matchesSearch && matchesYear && matchesDept && matchesSeverity;
  });

  const handleResetFilters = () => {
    setSelectedYear('All');
    setSelectedQuarter('All');
    setSelectedDept('All');
    setSelectedSeverity('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>Timeline Intelligence</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
              Causal Pathway Engine
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Forensic multi-year chronology and step-by-step causal chain investigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 rounded-xl text-xs font-bold text-[#4B5563] hover:text-[#1F2937] bg-white hover:bg-[#FFF0E0] border border-[#E8E4D0] flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="historian-card p-5 bg-white border-[#E8E4D0] space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search causal events, impact metrics, departments, or entities..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs sm:text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:bg-white focus:border-[#FF8000] outline-none transition-all font-medium"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
            >
              <option value="All">All Years</option>
              <option value="2018">2018</option>
              <option value="2019">2019 (Primary Incident)</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Procurement">Procurement & Sourcing</option>
              <option value="Warehouse">Warehouse & Operations</option>
              <option value="Logistics">Logistics & Freight</option>
              <option value="Finance">Finance & Executive</option>
              <option value="Customer Experience">Customer Experience</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#FFD1A4]">
        {filteredEvents.map((event, index) => {
          let badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
          let dotColor = "bg-[#FF8000]";

          if (event.severity === "Critical") {
            badgeColor = "bg-rose-100 text-rose-800 border-rose-200";
            dotColor = "bg-rose-600";
          } else if (event.severity === "Low") {
            badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
            dotColor = "bg-emerald-500";
          }

          return (
            <div key={event.id} className="relative group">
              {/* Timeline dot */}
              <div className={`absolute -left-6 sm:-left-10 top-5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${dotColor} group-hover:scale-125 transition-transform`} />

              {/* Event Card */}
              <div 
                onClick={() => setSelectedEvent(event)}
                className="historian-card p-6 bg-white border-[#E8E4D0] hover:border-[#FF8000] cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4]">
                      {event.date}
                    </span>
                    <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#FF8000] transition-colors">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${badgeColor}`}>
                      {event.badge || event.severity}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {event.confidence}% Confidence
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium">
                    {event.description}
                  </p>

                  <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-rose-800 font-semibold">
                      <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{event.impact}</span>
                    </div>
                    <span className="text-[#6B7280] font-medium">{event.department}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {event.relatedEntities.map((ent, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[#4B5563] text-[11px] font-medium">
                          #{ent}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-[#FF8000] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Forensic Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="historian-card p-12 text-center text-[#6B7280] bg-white border-[#E8E4D0]">
            <p className="text-sm font-semibold">No timeline events match the selected criteria.</p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF8000] text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Event Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || "Event Breakdown"}
        subtitle={`Chronological Record: ${selectedEvent?.exactDate || selectedEvent?.date}`}
        width="max-w-xl"
      >
        {selectedEvent && (
          <div className="space-y-6 text-sm text-[#4B5563]">
            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex justify-between">
              <div>
                <span className="text-xs font-bold text-[#9CA3AF] uppercase">Department</span>
                <div className="font-bold text-[#1F2937] text-sm">{selectedEvent.department}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase">Confidence</span>
                <div className="font-bold text-emerald-600 text-sm">{selectedEvent.confidence}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Executive Forensic Analysis
              </h4>
              <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed bg-white p-4 rounded-xl border border-[#E8E4D0] font-medium">
                {selectedEvent.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Measured Operational Impact
              </h4>
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-900">
                {selectedEvent.impact}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Documentary Evidence
              </h4>
              <div className="space-y-2">
                {selectedEvent.evidenceDocs.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#E8E4D0] bg-white flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1F2937]">{doc}</span>
                    <span className="text-emerald-600 font-bold">Verified</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
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
