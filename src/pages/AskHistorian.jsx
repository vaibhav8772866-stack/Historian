import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Send, 
  Bot, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Copy
} from 'lucide-react';
import { queryHarveyAssistant } from '../services/harveyEngine';
import Drawer from '../components/common/Drawer';

export default function AskHistorian() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [copied, setCopied] = useState(false);

  const suggestedQuestions = [
    "Why did profit decline by 14% in Q3 2019?",
    "What happened after the supplier price increase?",
    "Which supplier caused the problem?",
    "What should we do?",
    "What evidence supports this?"
  ];

  // Initialize query from URL if provided
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      executeSearch(q);
    } else {
      executeSearch("Why did profit decline by 14% in Q3 2019 despite record sales?");
    }
  }, [searchParams]);

  const executeSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    setIsProcessing(true);
    setActiveQuery(searchQuery);

    setTimeout(() => {
      const response = queryHarveyAssistant(searchQuery);
      setResult(response);
      setIsProcessing(false);
    }, 450);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query });
    executeSearch(query);
  };

  const handleSuggestedClick = (suggested) => {
    setQuery(suggested);
    setSearchParams({ q: suggested });
    executeSearch(suggested);
  };

  const handleCopyAnswer = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
          <span>Ask Historian</span>
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
            Neural Memory Engine
          </span>
        </h1>
        <p className="text-sm font-medium text-[#6B7280] mt-1">
          Search your organization's memory using natural language.
        </p>
      </div>

      {/* Question Input Card */}
      <div className="historian-card p-6 bg-white border-[#E8E4D0] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#9CA3AF] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Historian anything about your enterprise history..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-50/80 border border-[#E8E4D0] rounded-2xl text-sm sm:text-base text-[#1F2937] placeholder:text-[#9CA3AF] focus:bg-white focus:border-[#FF8000] focus:ring-2 focus:ring-[#FFE0C2] outline-none transition-all font-medium"
            />
            <button
              type="submit"
              disabled={isProcessing || !query.trim()}
              className="absolute right-2 px-4 py-2 bg-[#FF8000] hover:bg-[#E67300] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Suggested Prompts */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Suggested Questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedClick(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#FFF0E0] border border-[#E8E4D0] hover:border-[#FFD1A4] text-xs font-semibold text-[#4B5563] hover:text-[#FF8000] transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Subtle Loading State */}
      {isProcessing && (
        <div className="historian-card p-8 bg-white border-[#E8E4D0] text-center flex flex-col items-center justify-center gap-3 animate-fade-in">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-[#4B5563] flex items-center gap-1.5">
            <span>Harvey is thinking</span>
            <span className="inline-flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8000] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8000] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8000] animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>
      )}

      {/* Harvey Response Presentation */}
      {!isProcessing && result && (
        <div className="space-y-5 animate-fade-in">
          {/* Main Answer Card */}
          <div className="historian-card p-6 sm:p-7 bg-white border-[#FFD1A4] shadow-sm relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] text-white flex items-center justify-center shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1F2937]">Harvey</h3>
                  <p className="text-[11px] text-[#9CA3AF]">Enterprise Memory Assistant</p>
                </div>
              </div>

              <button
                onClick={handleCopyAnswer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#1F2937] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy Answer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Simple Direct Answer Text */}
            <div className="bg-[#FFFDF7] p-4 rounded-xl border border-[#E8E4D0]">
              <p className="text-base text-[#1F2937] font-semibold leading-relaxed">
                {result.answer}
              </p>
            </div>

            {/* Key Summary Cards / Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Main Cause */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Main Cause
                </span>
                <div className="text-sm font-bold text-[#1F2937] mt-1">
                  {result.mainCause || result.rootCause || "Supplier Price Rise"}
                </div>
              </div>

              {/* Confidence */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Confidence
                </span>
                <div className="text-sm font-extrabold text-emerald-600 mt-1">
                  {result.confidence}%
                </div>
              </div>

              {/* Evidence */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Evidence
                </span>
                <div className="text-sm font-bold text-[#1F2937] mt-1">
                  {result.evidenceCount || 3} Sources
                </div>
              </div>
            </div>

            {/* Recommendation badge if present */}
            {result.recommendation && (
              <div className="p-3.5 rounded-xl bg-[#FFF0E0] border border-[#FFD1A4] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#804000] font-medium">
                  <span className="font-bold text-[#E67300]">Recommendation:</span>
                  <span>{result.recommendation}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
