import React from 'react';

export default function ConfidenceBar({ value = 0, showLabel = true, size = "md", className = "" }) {
  const numValue = Math.min(100, Math.max(0, Number(value) || 0));
  
  // Color palette based on confidence
  let barColor = "bg-emerald-500";
  let textColor = "text-emerald-700";
  let bgColor = "bg-emerald-50";

  if (numValue < 75) {
    barColor = "bg-amber-500";
    textColor = "text-amber-700";
    bgColor = "bg-amber-50";
  } else if (numValue < 85) {
    barColor = "bg-[#FF8000]";
    textColor = "text-[#E67300]";
    bgColor = "bg-[#FFF0E0]";
  }

  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`flex-1 ${bgColor} rounded-full overflow-hidden ${heightClass} border border-slate-100`}>
        <div 
          className={`${barColor} ${heightClass} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${numValue}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-semibold ${textColor} shrink-0 tabular-nums`}>
          {numValue}%
        </span>
      )}
    </div>
  );
}
