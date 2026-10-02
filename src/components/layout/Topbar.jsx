import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  Menu, 
  Sparkles,
  Command,
  BookOpen,
  Layers,
  Shield
} from 'lucide-react';
import { USER_PROFILE, ALERTS_DATA } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from '../common/NotificationPanel';
import ProfileMenu from '../common/ProfileMenu';
import Modal from '../common/Modal';

export default function Topbar({ onToggleSidebar, onOpenSearch }) {
  const { user } = useAuth();
  const currentUser = user || USER_PROFILE;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E4D0] px-4 sm:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Search box */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF0E0] lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Trigger */}
          <div 
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between bg-slate-50/90 hover:bg-white border border-[#E8E4D0] hover:border-[#FF8000] rounded-xl px-3.5 py-2 cursor-pointer transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 text-[#9CA3AF] group-hover:text-[#6B7280] truncate">
              <Search className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#FF8000] transition-colors shrink-0" />
              <span className="text-xs sm:text-sm truncate">
                Ask Historian anything about your enterprise history...
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-[#6B7280] bg-white border border-slate-200 rounded-md shadow-xs">
                Ctrl + K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="p-2 rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF0E0] relative transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <NotificationPanel 
              isOpen={notificationsOpen} 
              onClose={() => setNotificationsOpen(false)} 
            />
          </div>

          {/* Help Icon */}
          <button
            onClick={() => setHelpOpen(true)}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF0E0] transition-colors cursor-pointer"
            aria-label="Help & Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#FFF0E0]/80 transition-colors text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {currentUser.initials || "AS"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#1F2937] leading-tight">{currentUser.name}</p>
                <p className="text-[11px] font-medium text-[#6B7280] leading-tight">{currentUser.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:block" />
            </button>

            <ProfileMenu 
              isOpen={profileOpen} 
              onClose={() => setProfileOpen(false)} 
            />
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Historian Enterprise Help & Knowledge Guide"
        subtitle="Understanding causal memory, graph intelligence, and Harvey assistant"
      >
        <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#FF8000] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#804000] text-sm">Enterprise Memory Intelligence</h4>
              <p className="text-xs text-[#994D00] mt-0.5">
                Historian maps multi-decade enterprise operations into structured causal graphs, attributing root causes to financial, operational, and supply chain shifts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-200">
              <h5 className="font-bold text-[#1F2937] text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF8000]" />
                <span>Causal Chain Discovery</span>
              </h5>
              <p className="text-xs text-[#6B7280] mt-1">
                Every event links to its predecessor with verifiable evidence and attribution confidence scores.
              </p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200">
              <h5 className="font-bold text-[#1F2937] text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FF8000]" />
                <span>Evidence Verification</span>
              </h5>
              <p className="text-xs text-[#6B7280] mt-1">
                Direct citations to contracts, financial filings, email threads, and warehouse inventories.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-[#6B7280] flex items-center justify-between">
            <span>Keyboard shortcut for instant search:</span>
            <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-[#1F2937]">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </Modal>
    </header>
  );
}
