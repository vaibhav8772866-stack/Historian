import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { ALERTS_DATA } from '../../data/mockData';

export default function NotificationPanel({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToAlerts = () => {
    onClose();
    navigate('/alerts');
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-dropdown border border-[#E8E4D0] z-50 overflow-hidden animate-fade-in divide-y divide-slate-100">
      {/* Header */}
      <div className="px-4 py-3.5 bg-[#FFFDF7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1F2937]" />
          <span className="font-bold text-sm text-[#1F2937]">Notifications & Alerts</span>
        </div>
        <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">
          {ALERTS_DATA.length} Active
        </span>
      </div>

      {/* Alert List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {ALERTS_DATA.map((alert) => {
          let Icon = Info;
          let iconBg = "bg-blue-50 text-blue-600";

          if (alert.severity === "Critical") {
            Icon = AlertTriangle;
            iconBg = "bg-rose-50 text-rose-600 border border-rose-100";
          } else if (alert.severity === "Warning") {
            Icon = AlertCircle;
            iconBg = "bg-amber-50 text-amber-600 border border-amber-100";
          }

          return (
            <div 
              key={alert.id}
              onClick={handleGoToAlerts}
              className="p-3.5 hover:bg-[#FFF0E0]/50 transition-colors cursor-pointer flex gap-3 items-start"
            >
              <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1F2937] truncate">{alert.title}</p>
                  <span className="text-[10px] text-[#9CA3AF]">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{alert.description}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-medium text-[#9CA3AF]">Entity: {alert.entity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#FFFDF7] text-center">
        <button
          onClick={handleGoToAlerts}
          className="w-full py-1.5 text-xs font-semibold text-[#FF8000] hover:text-[#E67300] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View All Enterprise Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
