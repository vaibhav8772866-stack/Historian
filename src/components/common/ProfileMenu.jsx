import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USER_PROFILE } from '../../data/mockData';

export default function ProfileMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  if (!isOpen) return null;

  const handleNavigate = (tab) => {
    onClose();
    navigate(`/settings?tab=${tab}`);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login', { replace: true });
  };

  const currentUser = user || USER_PROFILE;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-dropdown border border-[#E8E4D0] z-50 overflow-hidden animate-fade-in divide-y divide-slate-100">
      {/* User Header */}
      <div className="p-4 bg-[#FFFDF7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {currentUser.initials || "AS"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-[#1F2937] truncate">{currentUser.name}</div>
            <div className="text-xs text-[#6B7280] font-medium">{currentUser.role}</div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-semibold border border-emerald-100/80">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentUser.securityStatus || "Secure Session"}</span>
        </div>
      </div>

      {/* Menu Links */}
      <div className="p-1.5">
        <button
          onClick={() => handleNavigate('profile')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-[#FFF0E0] hover:text-[#1F2937] rounded-xl transition-colors text-left cursor-pointer"
        >
          <User className="w-4 h-4 text-[#9CA3AF]" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => handleNavigate('account')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-[#FFF0E0] hover:text-[#1F2937] rounded-xl transition-colors text-left cursor-pointer"
        >
          <SettingsIcon className="w-4 h-4 text-[#9CA3AF]" />
          <span>Account</span>
        </button>
        <button
          onClick={() => handleNavigate('security')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-[#FFF0E0] hover:text-[#1F2937] rounded-xl transition-colors text-left cursor-pointer"
        >
          <Shield className="w-4 h-4 text-[#9CA3AF]" />
          <span>Security</span>
        </button>
      </div>

      {/* Logout */}
      <div className="p-1.5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
