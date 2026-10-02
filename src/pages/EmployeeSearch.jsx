import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UploadCloud, 
  Filter, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { EMPLOYEE_DIRECTORY, searchEmployeeDirectory } from '../data/employeeData';
import EmployeeBadgeSearchModal from '../components/employee/EmployeeBadgeSearchModal';
import EmployeeProfileCard from '../components/employee/EmployeeProfileCard';

export default function EmployeeSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);

  const departments = ['All', 'Executive Management', 'AI & Machine Learning', 'Data Engineering', 'Logistics & Freight', 'Strategic Sourcing', 'Corporate Finance'];

  // Filter employee directory
  let filteredEmployees = searchEmployeeDirectory(searchQuery);

  if (selectedDept !== 'All') {
    filteredEmployees = filteredEmployees.filter(emp => emp.department === selectedDept);
  }

  return (
    <div className="space-y-7 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>Employee Directory & Badge Search</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
              Enterprise OCR
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Search authorized employee records by name, ID, or by uploading an employee badge image.
          </p>
        </div>

        {/* Upload Badge Action Button */}
        <button
          onClick={() => setIsBadgeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-sm transition-all hover:scale-[1.02] cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Search Employee by Image</span>
        </button>
      </div>

      {/* Directory Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="historian-card p-4 bg-white border-[#E8E4D0] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#FFF0E0] text-[#FF8000]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">Active Directory</span>
            <div className="text-lg font-extrabold text-[#1F2937]">1,420 Employees</div>
          </div>
        </div>

        <div className="historian-card p-4 bg-white border-[#E8E4D0] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">Authorization Scope</span>
            <div className="text-lg font-extrabold text-emerald-600">Level 5 Executive Master</div>
          </div>
        </div>

        <div className="historian-card p-4 bg-white border-[#E8E4D0] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">Badge OCR Accuracy</span>
            <div className="text-lg font-extrabold text-purple-600">96.5% Precision</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="historian-card p-5 bg-white border-[#E8E4D0] space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Text Input Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Employee ID (e.g. EMP-1042), Name, or Email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] placeholder-[#9CA3AF] outline-none focus:bg-white focus:border-[#FF8000]"
            />
          </div>

          {/* Badge Image Search Launch Button */}
          <button
            onClick={() => setIsBadgeModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-[#FFD1A4] bg-[#FFF0E0] hover:bg-[#FFE3C7] text-[#E67300] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Badge Image</span>
          </button>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="font-bold text-[#9CA3AF] text-[11px] uppercase shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Dept:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                selectedDept === dept
                  ? 'bg-[#FF8000] text-white shadow-xs'
                  : 'bg-slate-100 text-[#4B5563] hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Employee Detailed Profile View */}
      {activeProfile ? (
        <EmployeeProfileCard employee={activeProfile} onReset={() => setActiveProfile(null)} />
      ) : (
        /* Employee Directory Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F2937]">
              Directory Results ({filteredEmployees.length})
            </h2>
            <span className="text-xs text-[#6B7280] font-medium">Click card to inspect full profile & Historian records</span>
          </div>

          {filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setActiveProfile(emp)}
                  className="historian-card p-5 bg-white border-[#E8E4D0] hover:border-[#FF8000] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-xl object-cover border border-[#E8E4D0]" />
                      <div>
                        <h3 className="font-extrabold text-[#1F2937] text-sm group-hover:text-[#FF8000] transition-colors">
                          {emp.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#6B7280]">{emp.designation}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4]">
                      {emp.employee_id}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#4B5563] pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9CA3AF]">Department:</span>
                      <span className="font-bold text-[#1F2937]">{emp.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9CA3AF]">Location:</span>
                      <span className="font-semibold">{emp.location.split('(')[0]}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#FF8000] font-bold group-hover:translate-x-1 transition-transform">
                    <span>View Profile & Records</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E4D0]">
              <p className="text-sm font-bold text-[#1F2937]">No matching employee found.</p>
              <p className="text-xs text-[#6B7280] mt-1">Try adjusting your query or upload an employee badge image.</p>
            </div>
          )}
        </div>
      )}

      {/* Badge Search Modal */}
      <EmployeeBadgeSearchModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </div>
  );
}
