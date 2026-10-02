import React, { useState } from 'react';
import { 
  FileCheck2, 
  Share2, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import AuthIllustration from './AuthIllustration';

export default function AuthBrandPanel({ variant = 'login' }) {
  const isSignup = variant === 'signup';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const featureCards = [
    {
      id: 'feat-1',
      title: 'Evidence-backed insights',
      subtitle: 'Every answer connects to supporting sources.',
      icon: FileCheck2,
    },
    {
      id: 'feat-2',
      title: 'Connected enterprise memory',
      subtitle: 'Discover relationships across years of business history.',
      icon: Share2,
    },
    {
      id: 'feat-3',
      title: 'Intelligent decisions',
      subtitle: 'Understand what happened and why.',
      icon: Sparkles,
    },
    {
      id: 'feat-4',
      title: 'Enterprise-grade security',
      subtitle: 'Bank-level security with role-based access and audit logs.',
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="flex flex-col justify-between h-full space-y-5 lg:pr-3 select-none">
      {/* Top Branding & Headline Area */}
      <div className="space-y-3.5 animate-fade-in delay-100">
        {/* Brand Logo, Name & Pill Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0 animate-logo-entrance">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
              <circle cx="12" cy="12" r="2" fill="white" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">Historian</h1>
              <span className="px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-full">
                ENTERPRISE AI
              </span>
            </div>
            <p className="text-xs font-extrabold text-[#FF8000] tracking-tight">
              Enterprise Memory. Intelligent Decisions.
            </p>
          </div>
        </div>

        {/* Level 2 Main Headline with Orange Highlights */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] leading-snug tracking-tight">
          {isSignup ? (
            <>
              Your enterprise <span className="text-[#FF8000]">remembers</span> every decision, evidence, and outcome.
            </>
          ) : (
            <>
              Turn years of enterprise <span className="text-[#FF8000]">history</span> into clear answers, connected <span className="text-[#FF8000]">evidence</span>, and smarter <span className="text-[#FF8000]">decisions</span>.
            </>
          )}
        </h2>

        {/* Level 4 Supporting Copy */}
        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium max-w-lg">
          {isSignup
            ? "Historian connects historical events, evidence, and business context so your organization can learn from the past."
            : "Historian connects your data, events, and context to reveal what happened, why it happened, and what to do next."}
        </p>
      </div>

      {/* Level 4 Intelligence Flow Component */}
      <div className="py-0.5">
        <AuthIllustration variant={variant} />
      </div>

      {/* Level 5 Mini Feature Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-fade-in delay-600">
        {featureCards.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              onMouseMove={handleMouseMove}
              className="
                card-cursor-light p-3 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#E8E4D0] shadow-2xs 
                hover:border-[#FF8000] hover:bg-white hover:shadow-md hover:-translate-y-0.5 
                transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-default group flex items-start gap-2.5
              "
            >
              <div className="w-7 h-7 rounded-lg bg-[#FFF0E0] group-hover:bg-[#FFE5CC] text-[#FF8000] flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-250 group-hover:scale-110">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11.5px] font-extrabold text-[#1F2937] group-hover:text-[#FF8000] transition-colors leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[10.5px] text-[#6B7280] font-medium leading-tight mt-0.5 line-clamp-2">
                  {feat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Harvey Assistant Indicator (Bottom-Left) */}
      <div className="pt-2 border-t border-[#E8E4D0]/60 flex items-center gap-2 text-xs text-[#6B7280] font-medium animate-fade-in delay-600 group cursor-default">
        <div className="w-6 h-6 rounded-lg bg-[#FFF0E0] text-[#FF8000] flex items-center justify-center shrink-0 border border-[#FFD1A4] group-hover:scale-110 transition-transform duration-200">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <span className="group-hover:text-[#1F2937] transition-colors">
          Your enterprise memory assistant, <strong className="text-[#1F2937] font-extrabold group-hover:text-[#FF8000] transition-colors">Harvey</strong>, is waiting inside.
        </span>
      </div>
    </div>
  );
}
