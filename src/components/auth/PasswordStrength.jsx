import React from 'react';
import { Check, X } from 'lucide-react';
import { checkPasswordStrength } from '../../services/auth';

export default function PasswordStrength({ password = '' }) {
  if (!password) return null;

  const { score, label, color, hasLength, hasUpper, hasNumber, hasSpecial } = checkPasswordStrength(password);

  const getMeterColor = () => {
    if (score <= 25) return 'bg-rose-500';
    if (score <= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTextColor = () => {
    if (score <= 25) return 'text-rose-600';
    if (score <= 75) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="space-y-2 pt-1 animate-fade-in">
      {/* Strength Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex gap-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${getMeterColor()}`} style={{ width: `${score}%` }} />
        </div>
        <span className={`text-[11px] font-bold ${getTextColor()} shrink-0`}>
          {label}
        </span>
      </div>

      {/* Checklist Rules */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          {hasLength ? (
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />
          )}
          <span className={hasLength ? 'text-emerald-700 font-semibold' : ''}>8+ characters</span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasUpper ? (
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />
          )}
          <span className={hasUpper ? 'text-emerald-700 font-semibold' : ''}>One uppercase letter</span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasNumber ? (
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />
          )}
          <span className={hasNumber ? 'text-emerald-700 font-semibold' : ''}>One number</span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasSpecial ? (
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />
          )}
          <span className={hasSpecial ? 'text-emerald-700 font-semibold' : ''}>One special symbol</span>
        </div>
      </div>
    </div>
  );
}
