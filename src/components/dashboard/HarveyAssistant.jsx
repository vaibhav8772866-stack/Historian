import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight,
  FileText,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import { queryHarveyAssistant } from '../../services/harveyEngine';

export default function HarveyAssistant({ onOpenBadgeSearch }) {
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      sender: "user",
      text: "What happened after the supplier price increase?",
      timestamp: "Just now"
    },
    {
      id: "msg-2",
      sender: "harvey",
      text: "The supplier increased prices by 18%. This caused inventory problems and higher shipping costs, which reduced profit.",
      confidence: 94,
      evidenceCount: 3,
      mainCause: "Supplier Price Rise",
      timestamp: "Just now"
    }
  ]);

  const navigate = useNavigate();

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    // Check if user is asking to search employee by badge image
    const isBadgeQuery = userText.toLowerCase().includes("badge") || 
                         userText.toLowerCase().includes("employee image") || 
                         userText.toLowerCase().includes("find employee");

    const newMsgId = `usr-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      {
        id: newMsgId,
        sender: "user",
        text: userText,
        timestamp: "Just now"
      }
    ]);

    setIsTyping(true);

    // Simulate Harvey thinking latency
    setTimeout(() => {
      if (isBadgeQuery && onOpenBadgeSearch) {
        onOpenBadgeSearch();
        setMessages(prev => [
          ...prev,
          {
            id: `harvey-${Date.now()}`,
            sender: "harvey",
            text: "Launching Employee Badge OCR Scanner. Please select or drag & drop the employee badge image to extract ID and search the enterprise directory.",
            confidence: 98,
            evidenceCount: 1,
            mainCause: "Employee Badge OCR",
            timestamp: "Just now"
          }
        ]);
      } else {
        const response = queryHarveyAssistant(userText);
        setMessages(prev => [
          ...prev,
          {
            id: `harvey-${Date.now()}`,
            sender: "harvey",
            text: response.answer,
            confidence: response.confidence,
            evidenceCount: response.evidenceCount || 3,
            mainCause: response.mainCause || "Supplier Price Rise",
            timestamp: "Just now"
          }
        ]);
      }
      setIsTyping(false);
    }, 450);
  };

  const handleQuickPrompt = (promptText) => {
    if (promptText.includes("badge") && onOpenBadgeSearch) {
      onOpenBadgeSearch();
    } else {
      setInputQuery(promptText);
    }
  };

  return (
    <div className="historian-card p-6 sm:p-7 bg-white border-[#FFD1A4] relative overflow-hidden shadow-sm">
      {/* Top Background Warm Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">
              Harvey is your enterprise memory assistant.
            </h2>
            <p className="text-xs font-medium text-[#6B7280]">
              Ask anything. Discover why. Make better decisions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenBadgeSearch && (
            <button
              onClick={onOpenBadgeSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF8000] hover:bg-[#E67300] text-xs font-bold text-white transition-colors shadow-2xs cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Search Badge Image</span>
            </button>
          )}

          <button
            onClick={() => navigate('/ask')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF0E0] hover:bg-[#FFE5CC] border border-[#FFD1A4] text-xs font-bold text-[#FF8000] hover:text-[#E67300] transition-colors shadow-2xs cursor-pointer"
          >
            <span>Ask Historian</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Conversation Thread */}
      <div className="my-4 space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
        {messages.map((msg) => {
          const isHarvey = msg.sender === "harvey";

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 animate-fade-in ${isHarvey ? 'items-start' : 'items-start justify-end'}`}
            >
              {isHarvey && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8000] to-[#E67300] text-white flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                isHarvey 
                  ? 'bg-white border border-[#E8E4D0] shadow-2xs text-[#1F2937] space-y-2.5' 
                  : 'bg-[#FF8000] text-white font-medium ml-auto rounded-tr-xs shadow-xs'
              }`}>
                {isHarvey && (
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF8000]">
                    Harvey
                  </div>
                )}
                
                <p>{msg.text}</p>

                {/* Compact badges for Confidence & Evidence */}
                {isHarvey && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold">
                      <span>Confidence:</span>
                      <span>{msg.confidence}%</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[#4B5563] border border-slate-200 text-[11px] font-semibold">
                      <span>Evidence:</span>
                      <span>{msg.evidenceCount} sources</span>
                    </span>
                  </div>
                )}
              </div>

              {!isHarvey && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  AS
                </div>
              )}
            </div>
          );
        })}

        {/* Subtle Loading state */}
        {isTyping && (
          <div className="flex items-center gap-2.5 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8000] to-[#E67300] text-white flex items-center justify-center shadow-2xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white border border-[#E8E4D0] shadow-2xs text-xs font-medium text-[#4B5563] flex items-center gap-1.5">
              <span>Harvey is thinking</span>
              <span className="inline-flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#FF8000] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 rounded-full bg-[#FF8000] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-[#FF8000] animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Follow-up Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2.5 pt-1 text-xs no-scrollbar">
        <span className="text-[#9CA3AF] font-bold uppercase tracking-wider text-[10px] shrink-0">
          Suggested:
        </span>
        {[
          "Find employee from badge image",
          "What happened after the supplier price increase?",
          "Which supplier caused the problem?",
          "What should we do?"
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-[#FFF0E0] border border-[#E8E4D0] hover:border-[#FFD1A4] text-[#4B5563] hover:text-[#FF8000] font-medium transition-colors text-xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Prompt Input Form */}
      <form onSubmit={handleSendMessage} className="relative mt-1">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Harvey or type 'Find employee from badge image'..."
          className="w-full pl-4 pr-12 py-3 bg-white border border-[#E8E4D0] focus:border-[#FF8000] focus:ring-2 focus:ring-[#FFE0C2] rounded-2xl text-xs sm:text-sm text-[#1F2937] placeholder:text-[#9CA3AF] shadow-xs outline-none transition-all font-medium"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#FF8000] hover:bg-[#E67300] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer"
          aria-label="Send query"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
