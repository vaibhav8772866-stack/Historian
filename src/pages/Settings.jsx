import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Bell, 
  Sparkles, 
  Database, 
  Palette, 
  Lock, 
  CheckCircle2, 
  Save,
  Server,
  RefreshCw
} from 'lucide-react';
import { USER_PROFILE, SYSTEM_STATUS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const currentUser = user || USER_PROFILE;
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [saved, setSaved] = useState(false);

  // Form states
  const [harveyReasoning, setHarveyReasoning] = useState('Deep Causal');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [alertEmail, setAlertEmail] = useState(currentUser.email);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai-preferences', label: 'AI Preferences (Harvey)', icon: Sparkles },
    { id: 'data-sources', label: 'Data Sources', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'access-control', label: 'Access Control', icon: Lock },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>System Settings</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-white text-[#4B5563] border border-[#E8E4D0] rounded-lg">
              Enterprise Configuration
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Manage your credentials, Harvey assistant reasoning parameters, and connected data sources.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      {/* Settings Layout: Tabs on Left / Content on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Tabs */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          <div className="historian-card p-2 bg-white border-[#E8E4D0] space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive 
                      ? 'bg-[#FF8000] text-white shadow-xs' 
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#FFF0E0]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-8 lg:col-span-9">
          <form onSubmit={handleSave} className="historian-card p-6 sm:p-7 bg-white border-[#E8E4D0] space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#1F2937]">Executive Profile</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Primary credentials for Historian platform identity.</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-orange-500/20">
                    {currentUser.initials || "AS"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1F2937]">{currentUser.name}</h4>
                    <p className="text-xs text-[#6B7280] font-medium">{currentUser.role} • {currentUser.organization || "Global Enterprise Holdings"}</p>
                    <span className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {currentUser.securityStatus || "Secure Session"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div>
                    <label className="block font-bold text-[#1F2937] mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-[#1F2937] font-medium focus:bg-white focus:border-[#FF8000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1F2937] mb-1">Executive Title</label>
                    <input
                      type="text"
                      defaultValue={currentUser.role}
                      className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-[#1F2937] font-medium focus:bg-white focus:border-[#FF8000] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#1F2937] mb-1">Enterprise Email</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-[#1F2937] font-medium focus:bg-white focus:border-[#FF8000] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AI Preferences Tab */}
            {activeTab === 'ai-preferences' && (
              <div className="space-y-5 text-xs">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#1F2937]">Harvey Assistant Parameters</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Configure cognitive reasoning depth and evidence attribution thresholds for Harvey.</p>
                </div>

                <div>
                  <label className="block font-bold text-[#1F2937] mb-1">
                    Cognitive Reasoning Mode
                  </label>
                  <select
                    value={harveyReasoning}
                    onChange={(e) => setHarveyReasoning(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
                  >
                    <option value="Deep Causal">Deep Causal Chain Attribution (Recommended)</option>
                    <option value="Executive Summary">Executive Briefing (High-level)</option>
                    <option value="Forensic Strict">Strict Forensic Legal Evidence Only</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-[#1F2937]">Minimum Attribution Confidence Threshold</label>
                    <span className="font-bold text-[#FF8000]">{confidenceThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="99"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF8000]"
                  />
                  <span className="text-[11px] text-[#9CA3AF]">Insights with confidence below this threshold will be flagged as exploratory hypotheses.</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] text-[#804000] font-medium">
                  <strong>Active Identity:</strong> Harvey operates as your dedicated enterprise memory assistant, synthesizing across PostgreSQL, Neo4j, Vector DB, and Document Warehouses.
                </div>
              </div>
            )}

            {/* Data Sources Tab */}
            {activeTab === 'data-sources' && (
              <div className="space-y-5 text-xs">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#1F2937]">Connected Enterprise Data Sources</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Real-time sync status across enterprise pipelines.</p>
                </div>

                <div className="space-y-2.5">
                  {SYSTEM_STATUS.services.map((srv, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-[#E8E4D0] bg-[#FFFDF7] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white border border-[#E8E4D0] text-[#FF8000]">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[#1F2937] text-xs">{srv.name}</div>
                          <div className="text-[10px] text-[#9CA3AF]">Latency: {srv.latency} • Uptime: {srv.uptime}</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[11px]">
                        {srv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-5 text-xs">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#1F2937]">Security & Authentication</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Enterprise session protection and audit encryption.</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-950 text-sm">Active Session Encrypted</div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Session tokens are signed with hardware-backed key rotation. 2FA is enforced enterprise-wide.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-[#1F2937]">Session Inactivity Timeout</label>
                  <select className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl font-semibold text-[#1F2937] outline-none focus:border-[#FF8000]">
                    <option>15 Minutes (High Security)</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-5 text-xs">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#1F2937]">Alert Dispatch Settings</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Configure critical anomaly notifications.</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E8E4D0] cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#FF8000] accent-[#FF8000]" />
                    <div>
                      <span className="font-bold text-[#1F2937]">Critical Supply Shock Alerts</span>
                      <p className="text-[#9CA3AF] text-[11px]">Instant notification when tier-1 vendor risk is detected</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E8E4D0] cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#FF8000] accent-[#FF8000]" />
                    <div>
                      <span className="font-bold text-[#1F2937]">Logistics Cost Surge Warnings</span>
                      <p className="text-[#9CA3AF] text-[11px]">Alert when expedited shipping exceeds quarterly threshold</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-5 text-xs">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#1F2937]">Interface Appearance</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Warm Enterprise Palette (#F9F4BC Background + #FF8000 Primary Accent).</p>
                </div>

                <div className="p-4 rounded-xl border-2 border-[#FF8000] bg-[#FFF0E0]/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1F2937] text-sm">Warm Enterprise Theme</span>
                    <p className="text-xs text-[#6B7280] mt-0.5">#F9F4BC warm canvas with #FF8000 primary accents, white cards, and deep gray text</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#FF8000] text-white rounded-lg font-bold text-xs">Active</span>
                </div>
              </div>
            )}

            {/* Access Control Tab */}
            {activeTab === 'access-control' && (
              <div className="space-y-5 text-xs">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#1F2937]">Role-Based Access Control (RBAC)</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Enterprise permission tiers.</p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#1F2937]">Executive Tier (CEO / Board)</span>
                      <p className="text-[11px] text-[#9CA3AF]">Full causal graph access, financial forensic data, and mandate export</p>
                    </div>
                    <span className="font-bold text-emerald-600">Assigned</span>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
