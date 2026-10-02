import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Clock, 
  Share2, 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  FileSpreadsheet, 
  Bell, 
  Settings, 
  Activity, 
  ShieldCheck, 
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { USER_PROFILE, SYSTEM_STATUS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import ProfileMenu from '../common/ProfileMenu';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const currentUser = user || USER_PROFILE;
  const [profileOpen, setProfileOpen] = useState(false);
  const [statusExpanded, setStatusExpanded] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Ask Historian", path: "/ask", icon: Sparkles, badge: "AI" },
    { name: "Employee & Badge Search", path: "/employee-search", icon: UserCheck, badge: "OCR" },
    { name: "Timeline Intelligence", path: "/timeline", icon: Clock },
    { name: "Knowledge Graph", path: "/graph", icon: Share2 },
    { name: "Insights & Causes", path: "/insights", icon: Lightbulb },
    { name: "Forecast & Trends", path: "/forecasts", icon: TrendingUp },
    { name: "Sources & Evidence", path: "/evidence", icon: FileText },
    { name: "Reports", path: "/reports", icon: FileSpreadsheet },
    { name: "Alerts", path: "/alerts", icon: Bell, alertCount: 4 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-[#E8E4D0] flex flex-col justify-between
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Branding */}
        <div className="p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
                <circle cx="12" cy="12" r="2" fill="white" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold text-[#1F2937] tracking-tight">Historian</h1>
                <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#6B7280] tracking-tight leading-tight">
                Enterprise Memory. Intelligent Decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            Intelligence Hub
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/dashboard' && (location.pathname === '/' || location.pathname === ''));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={`
                  group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-[#FF8000] text-white shadow-md shadow-orange-500/25 font-semibold' 
                    : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#FFF0E0]'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#E67300]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#FFF0E0] text-[#E67300]'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.alertCount && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-[#E67300]' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.alertCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section: System Status & User Profile */}
        <div className="p-3.5 space-y-3 border-t border-slate-100 bg-[#FFFDF7] shrink-0">
          {/* System Status Accordion */}
          <div className="bg-white rounded-xl border border-[#E8E4D0] p-2.5 shadow-sm">
            <div 
              onClick={() => setStatusExpanded(!statusExpanded)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute inset-0 opacity-75" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">System Status</div>
                  <div className="text-xs font-bold text-[#1F2937]">{SYSTEM_STATUS.overallStatus}</div>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transform transition-transform ${statusExpanded ? 'rotate-180' : ''}`} />
            </div>

            {statusExpanded && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 animate-fade-in text-[11px]">
                {SYSTEM_STATUS.services.map((srv, idx) => (
                  <div key={idx} className="flex items-center justify-between py-0.5 text-[#4B5563]">
                    <span className="font-medium text-[#1F2937] truncate">{srv.name}</span>
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {srv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div className="relative">
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-[#FFF0E0]/60 border border-[#E8E4D0] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                  {currentUser.initials || "AS"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1F2937] truncate">{currentUser.name}</p>
                  <p className="text-[11px] font-medium text-[#6B7280] flex items-center gap-1">
                    <span>{currentUser.role}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">{currentUser.securityStatus || "Secure Session"}</span>
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
            </div>

            {/* Profile popup */}
            <div className="bottom-full mb-2 absolute right-0 left-0">
              <ProfileMenu isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
