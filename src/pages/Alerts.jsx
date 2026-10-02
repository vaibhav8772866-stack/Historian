import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldAlert,
  Sparkles,
  Share2
} from 'lucide-react';
import { ALERTS_DATA } from '../data/mockData';
import Drawer from '../components/common/Drawer';

export default function Alerts() {
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  const handleAcknowledge = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: "Acknowledged" } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert({ ...selectedAlert, status: "Acknowledged" });
    }
  };

  const handleResolve = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: "Resolved" } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert({ ...selectedAlert, status: "Resolved" });
    }
  };

  const filteredAlerts = alerts.filter(a => activeFilter === 'All' || a.severity === activeFilter);

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>Enterprise Alerts</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/70 rounded-lg">
              Live Anomaly Guard
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Real-time proactive monitoring for supply shocks, logistics spikes, and margin vulnerability patterns.
          </p>
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E8E4D0] shadow-2xs self-start sm:self-auto">
          {['All', 'Critical', 'Warning', 'Informational'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeFilter === f ? 'bg-[#FF8000] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#1F2937]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          let Icon = Info;
          let borderClass = "border-blue-200 bg-blue-50/20";
          let badgeClass = "bg-blue-100 text-blue-800";
          let iconColor = "text-blue-600 bg-blue-50";

          if (alert.severity === "Critical") {
            Icon = AlertTriangle;
            borderClass = "border-rose-200 bg-rose-50/20";
            badgeClass = "bg-rose-100 text-rose-800";
            iconColor = "text-rose-600 bg-rose-50";
          } else if (alert.severity === "Warning") {
            Icon = AlertCircle;
            borderClass = "border-amber-200 bg-amber-50/20";
            badgeClass = "bg-amber-100 text-amber-800";
            iconColor = "text-amber-600 bg-amber-50";
          }

          return (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`historian-card p-6 bg-white hover:border-[#FF8000] cursor-pointer transition-all border ${borderClass} flex flex-col md:flex-row md:items-center justify-between gap-5 group`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-2xl ${iconColor} shrink-0 mt-0.5 border border-slate-100`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${badgeClass}`}>
                      {alert.severity}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#1F2937] group-hover:text-[#FF8000] transition-colors">
                      {alert.title}
                    </h3>
                    <span className="text-xs text-[#9CA3AF] font-medium ml-auto sm:ml-0">• {alert.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium">
                    {alert.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-semibold text-[#6B7280]">Entity: <strong className="text-[#1F2937]">{alert.entity}</strong></span>
                    <span className="text-[#D1D5DB]">|</span>
                    <span className="text-emerald-700 font-medium">Status: <strong className="font-bold">{alert.status}</strong></span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResolve(alert.id);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#4B5563] bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  {alert.status === 'Resolved' ? 'Resolved ✓' : 'Resolve'}
                </button>
                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Investigation Drawer */}
      <Drawer
        isOpen={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title || "Alert Investigation"}
        subtitle={`System Anomaly Record • ${selectedAlert?.severity} Level • ${selectedAlert?.timestamp}`}
        width="max-w-xl"
      >
        {selectedAlert && (
          <div className="space-y-6 text-sm text-[#4B5563]">
            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex justify-between">
              <div>
                <span className="text-xs font-bold text-[#9CA3AF] uppercase">Target Entity</span>
                <div className="font-bold text-[#1F2937] text-sm mt-0.5">{selectedAlert.entity}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase">Resolution Status</span>
                <div className="font-bold text-emerald-600 text-sm mt-0.5">{selectedAlert.status}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Forensic Anomaly Detail
              </h4>
              <p className="p-4 rounded-xl bg-white border border-[#E8E4D0] text-xs sm:text-sm text-[#1F2937] leading-relaxed font-medium">
                {selectedAlert.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Harvey Recommended Action
              </h4>
              <div className="p-4 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] text-xs font-semibold text-[#804000] leading-relaxed">
                {selectedAlert.recommendation}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedAlert(null);
                  navigate('/graph');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#FF8000] bg-[#FFF0E0] hover:bg-[#FFE5CC] flex items-center gap-1.5 cursor-pointer border border-[#FFD1A4]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>View in Knowledge Graph</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResolve(selectedAlert.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
