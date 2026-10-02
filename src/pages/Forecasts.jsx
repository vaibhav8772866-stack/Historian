import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Sliders, 
  Layers, 
  IndianRupee, 
  Archive, 
  Activity 
} from 'lucide-react';
import { FORECAST_DATA } from '../data/mockData';

export default function Forecasts() {
  const [timeHorizon, setTimeHorizon] = useState('12m');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/95 backdrop-blur-md rounded-xl border border-[#E8E4D0] shadow-lg text-xs space-y-1">
          <p className="font-bold text-[#1F2937]">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-[#1F2937]">
                {entry.value !== null ? `₹${entry.value}M` : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>Forecast & Trends</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
              Predictive AI Simulation
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Reconstructed historical trajectories and forward financial projections.
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E8E4D0] shadow-2xs self-start sm:self-auto">
          {['6m', '12m', '24m'].map((h) => (
            <button
              key={h}
              onClick={() => setTimeHorizon(h)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                timeHorizon === h ? 'bg-[#FF8000] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#1F2937]'
              }`}
            >
              {h.toUpperCase()} View
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="historian-card p-4 bg-white border-[#E8E4D0]">
          <span className="text-xs font-bold text-[#9CA3AF] uppercase">Q4 Projected Revenue</span>
          <div className="text-2xl font-extrabold text-[#1F2937] mt-1">₹58.1M</div>
          <span className="text-xs font-semibold text-emerald-600">↑ 14% vs Q3 Baseline</span>
        </div>
        <div className="historian-card p-4 bg-white border-[#E8E4D0]">
          <span className="text-xs font-bold text-[#9CA3AF] uppercase">Projected Net Margin</span>
          <div className="text-2xl font-extrabold text-[#FF8000] mt-1">15.5%</div>
          <span className="text-xs font-semibold text-emerald-600">Post-restructuring rebound</span>
        </div>
        <div className="historian-card p-4 bg-white border-[#E8E4D0]">
          <span className="text-xs font-bold text-[#9CA3AF] uppercase">Forecast Confidence Interval</span>
          <div className="text-2xl font-extrabold text-[#1F2937] mt-1">94.8%</div>
          <span className="text-xs font-semibold text-[#E67300]">± 1.8% variance range</span>
        </div>
        <div className="historian-card p-4 bg-white border-[#E8E4D0]">
          <span className="text-xs font-bold text-[#9CA3AF] uppercase">Supply Shock Anomaly Risk</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">Low (3.4%)</div>
          <span className="text-xs font-semibold text-emerald-600">With dual-sourcing mandate</span>
        </div>
      </div>

      {/* Main Multi-Metric Forecast Chart */}
      <div className="historian-card p-6 bg-white border-[#E8E4D0] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#1F2937]">Enterprise Revenue & Profit Trajectory</h3>
            <p className="text-xs text-[#6B7280] font-medium">Historical baseline (Jan–Jun) vs Forecast simulation (Jul–Dec)</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF8000]" />
              <span className="text-[#1F2937]">Historical Actuals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FFA147] border border-dashed border-[#CC6600]" />
              <span className="text-[#1F2937]">Harvey Forecast</span>
            </div>
          </div>
        </div>

        {/* Recharts Line/Area Chart */}
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8000" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF8000" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA147" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFA147" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4D0" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} unit="M" />
              <Tooltip content={<CustomTooltip />} />
              
              <Area 
                type="monotone" 
                dataKey="historicalRevenue" 
                name="Historical Revenue"
                stroke="#FF8000" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorHist)" 
              />
              <Area 
                type="monotone" 
                dataKey="forecastRevenue" 
                name="Forecast Revenue"
                stroke="#E67300" 
                strokeWidth={3}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorFore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Anomaly Banner */}
        <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex items-start gap-3 text-xs text-[#4B5563]">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong className="text-[#1F2937]">Simulation Note:</strong> The forecast accounts for the 18% supplier price cap restructuring approved in Q2. If price caps are removed, Q3 profit forecast exhibits downside sensitivity of -₹1.4M.
          </p>
        </div>
      </div>

      {/* Secondary Charts: Inventory & Demand Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Days */}
        <div className="historian-card p-6 bg-white border-[#E8E4D0] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Inventory Buffer Days</h3>
              <p className="text-xs text-[#6B7280]">Warehouse A safety stock projection</p>
            </div>
            <span className="text-xs font-bold text-[#FF8000]">Target: 35 Days</span>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FORECAST_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4D0" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="inventoryDays" fill="#FF8000" radius={[4, 4, 0, 0]} name="Buffer Days" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand Index */}
        <div className="historian-card p-6 bg-white border-[#E8E4D0] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Market Demand Index</h3>
              <p className="text-xs text-[#6B7280]">Normalized enterprise order volume</p>
            </div>
            <span className="text-xs font-bold text-emerald-600">Peak: Nov/Dec</span>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4D0" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="demandIndex" stroke="#10B981" strokeWidth={2.5} name="Demand Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
