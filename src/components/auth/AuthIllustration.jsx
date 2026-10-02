import React, { useState } from 'react';
import { 
  Database, 
  GitCommit, 
  Search, 
  Target, 
  ArrowDown, 
  Share2, 
  Lightbulb, 
  ShieldCheck 
} from 'lucide-react';

export default function AuthIllustration({ variant = 'login' }) {
  const [activeStage, setActiveStage] = useState(null);

  const loginStages = [
    {
      id: 'stage-1',
      title: 'Historical Data',
      description: 'Collect and organize data from multiple sources.',
      category: 'Data Ingestion',
      icon: Database,
      delayClass: 'delay-200',
    },
    {
      id: 'stage-2',
      title: 'Connected Events',
      description: 'Link events across time, teams, and departments.',
      category: 'Causal Graph',
      delayClass: 'delay-300',
      icon: GitCommit,
    },
    {
      id: 'stage-3',
      title: 'Root Causes',
      description: 'Analyze patterns and uncover the real underlying causes.',
      category: 'Forensic AI',
      delayClass: 'delay-400',
      icon: Search,
    },
    {
      id: 'stage-4',
      title: 'Better Decisions',
      description: 'Transform insights into actions that drive real impact.',
      category: 'Executive Mandate',
      delayClass: 'delay-500',
      icon: Target,
    }
  ];

  const signupStages = [
    {
      id: 'stage-1',
      title: 'Data Ingestion',
      description: 'Ingest contracts, financial ledgers & communications.',
      category: 'Enterprise Memory',
      icon: Database,
      delayClass: 'delay-200',
    },
    {
      id: 'stage-2',
      title: 'Connected Events',
      description: 'Chronological timeline & cross-departmental links.',
      category: 'Timeline',
      icon: GitCommit,
      delayClass: 'delay-300',
    },
    {
      id: 'stage-3',
      title: 'Root Causes',
      description: 'Systemic pattern & vulnerability attribution.',
      category: 'Synthesis',
      icon: Search,
      delayClass: 'delay-400',
    },
    {
      id: 'stage-4',
      title: 'Better Decisions',
      description: 'Strategic action mandates & automated risk mitigation.',
      category: 'Decisioning',
      icon: Target,
      delayClass: 'delay-500',
    }
  ];

  const stages = variant === 'signup' ? signupStages : loginStages;

  // Handle cursor tracking for card radial highlight
  const handleMouseMove = (e, stageId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="relative py-1 select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-[#FF8000]/10 to-amber-300/15 rounded-full blur-2xl pointer-events-none" />

      {/* Connected Stream */}
      <div className="relative space-y-2.5">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === stages.length - 1;
          const isActive = activeStage === stage.id;

          return (
            <div 
              key={stage.id} 
              className={`relative animate-fade-in ${stage.delayClass}`}
            >
              {/* Intelligence Stage Card */}
              <div 
                onMouseEnter={() => setActiveStage(stage.id)}
                onMouseLeave={() => setActiveStage(null)}
                onMouseMove={(e) => handleMouseMove(e, stage.id)}
                className={`
                  card-cursor-light p-3.5 rounded-2xl bg-white/95 backdrop-blur-sm border shadow-xs 
                  transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer group flex items-center justify-between gap-3
                  ${isActive 
                    ? 'border-[#FF8000] shadow-lg shadow-orange-500/12 -translate-y-1 scale-[1.015]' 
                    : 'border-[#E8E4D0] hover:border-[#FFD1A4] hover:shadow-md hover:-translate-y-0.5'}
                `}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5
                    border transition-all duration-300
                    ${isActive 
                      ? 'bg-[#FF8000] text-white border-[#FF8000] scale-110 shadow-md shadow-orange-500/30' 
                      : 'bg-[#FFF0E0] group-hover:bg-[#FFE5CC] text-[#FF8000] border-[#FFD1A4] group-hover:scale-105'}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-extrabold tracking-tight transition-colors duration-200 ${
                        isActive ? 'text-[#FF8000]' : 'text-[#1F2937] group-hover:text-[#FF8000]'
                      }`}>
                        {stage.title}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4]">
                        {stage.category}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-[#6B7280] leading-snug mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Orange Circular Node */}
                <div className="relative shrink-0 flex items-center justify-center w-5 h-5 ml-1">
                  <div className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-300
                    ${isActive 
                      ? 'bg-[#FF8000] scale-125 shadow-md shadow-orange-500/80 ring-4 ring-[#FFF0E0]' 
                      : 'bg-[#FF8000] animate-status-dot shadow-xs shadow-orange-500/50'}
                  `} />
                </div>
              </div>

              {/* Connecting Pipeline with Traveling Light Pulse */}
              {!isLast && (
                <div className="flex justify-center my-0.5 relative">
                  <div className="w-6 h-5 flex flex-col items-center justify-center text-[#FF8000] relative">
                    <div className={`w-0.5 h-full transition-colors duration-300 ${isActive ? 'bg-[#FF8000]' : 'bg-[#FFD1A4]'}`}>
                      {/* Traveling Light Pulse */}
                      <div className="absolute w-full h-2.5 bg-[#FF8000] animate-pulse-travel rounded-full shadow-xs shadow-orange-500/80" />
                    </div>
                    <ArrowDown className={`w-3 h-3 transition-colors duration-300 mt-[-2px] ${isActive ? 'text-[#FF8000]' : 'text-[#FF8000]'}`} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
