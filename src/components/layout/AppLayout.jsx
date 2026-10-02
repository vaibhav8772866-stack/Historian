import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SearchModal from '../common/SearchModal';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F4BC] text-[#1F2937] flex flex-col antialiased">
      {/* Fixed Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Layout Container */}
      <div className="lg:pl-72 flex flex-col min-h-screen w-full transition-all duration-300">
        {/* Top Header */}
        <Topbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Search Command Palette */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
