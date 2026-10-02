import React, { useState } from 'react';
import { ShieldCheck, Sun, Moon } from 'lucide-react';
import AuthBrandPanel from './AuthBrandPanel';
import AuthBackgroundNetwork from './AuthBackgroundNetwork';

export default function AuthLayout({ 
  children, 
  variant = 'login', 
  showBrandPanel = true 
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen text-[#1F2937] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative overflow-x-hidden selection:bg-[#FFF0E0] selection:text-[#FF8000]">
      {/* 5-Layer Ultra Premium Animated Intelligence Background System */}
      <AuthBackgroundNetwork />

      {/* Top Header Controls: Theme Toggle & Security Status */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-20 pb-2">
        {/* Mobile Logo Branding Fallback */}
        <div className="sm:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </div>
          <span className="text-base font-extrabold text-[#1F2937]">Historian</span>
        </div>

        <div className="hidden sm:block" />

        {/* Top-Right Theme Control */}
        <button
          onClick={toggleTheme}
          className="
            flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm 
            border border-[#E8E4D0] hover:border-[#FF8000] hover:bg-white text-xs font-bold text-[#4B5563] 
            hover:text-[#FF8000] shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer group
          "
          title="Light Mode Active (Default)"
        >
          <Sun className="w-3.5 h-3.5 text-[#FF8000] transition-transform duration-300 group-hover:rotate-45" />
          <span>Light Mode</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8000]" />
        </button>
      </div>

      {/* Main Responsive Grid Container (48% Left / 52% Right Split Layout) */}
      <div className="w-full max-w-6xl mx-auto my-auto py-2 z-10">
        {showBrandPanel ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Visual Panel (48% Desktop) */}
            <div className="lg:col-span-6 hidden sm:block">
              <AuthBrandPanel variant={variant} />
            </div>

            {/* Right Login Card Panel (52% Desktop Anchor) */}
            <div className="lg:col-span-6 flex justify-center w-full">
              {children}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {children}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-xs font-semibold text-[#6B7280] z-20 pt-4 border-t border-[#E8E4D0]/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure Enterprise Access</span>
        </div>
        <div className="text-[11px] text-[#9CA3AF]">
          Historian AI Enterprise Memory Engine
        </div>
      </div>
    </div>
  );
}
