import React, { useState, useEffect, useRef } from 'react';
import '../styles/historian-loader.css';

const LOADING_MESSAGES = [
  "Initializing AI engine...",
  "Loading historical records...",
  "Analyzing historical patterns...",
  "Detecting anomalies...",
  "Predicting future performance...",
  "Generating recommendations...",
  "Preparing your intelligence dashboard...",
  "Intelligence ready."
];

export default function HistorianLoader({ onComplete, onSkip }) {
  // Timeline Visibility Flags (Matching exact specified timeline)
  const [showLogo, setShowLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showAIVisual, setShowAIVisual] = useState(false);
  const [showRings, setShowRings] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  // Progress & Message State
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageOpacity, setMessageOpacity] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

  const requestRef = useRef();
  const startTimeRef = useRef();

  // 1. Entrance Sequence Timeline
  useEffect(() => {
    // 0.2s: Logo fades/scales in
    const timer1 = setTimeout(() => setShowLogo(true), 200);
    // 0.5s: Historian title appears
    const timer2 = setTimeout(() => setShowTitle(true), 500);
    // 0.7s: Tagline appears
    const timer3 = setTimeout(() => setShowTagline(true), 700);
    // 1.0s: AI visualization appears
    const timer4 = setTimeout(() => setShowAIVisual(true), 1000);
    // 1.2s: AI rings begin rotating
    const timer5 = setTimeout(() => setShowRings(true), 1200);
    // 1.5s: Scan animation begins
    const timer6 = setTimeout(() => setShowScan(true), 1500);
    // 1.7s: First loading message appears
    const timer7 = setTimeout(() => setShowStatus(true), 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  }, []);

  // 2. Smooth Progress Interpolation & Message Rotation (1.7s -> 7.0s)
  useEffect(() => {
    if (!showStatus) return;

    const totalDuration = 5200; // 5.2 seconds of progress filling (reaches 100% around 6.9s total)

    const animateProgress = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(100, (elapsed / totalDuration) * 100);

      // Smooth non-robotic easing curve (easeOutCubic)
      const easedProgress = Math.round(
        rawProgress < 100 
          ? (1 - Math.pow(1 - rawProgress / 100, 3)) * 100 
          : 100
      );

      setProgress(easedProgress);

      // Update loading status message based on progress bracket
      const targetIndex = Math.min(
        LOADING_MESSAGES.length - 1,
        Math.floor((easedProgress / 100) * (LOADING_MESSAGES.length - 1))
      );

      setMessageIndex((prevIdx) => {
        if (prevIdx !== targetIndex) {
          // Trigger smooth fade cross-transition
          setMessageOpacity(0);
          setTimeout(() => {
            setMessageOpacity(1);
          }, 180);
          return targetIndex;
        }
        return prevIdx;
      });

      if (easedProgress < 100) {
        requestRef.current = requestAnimationFrame(animateProgress);
      } else {
        // Reached 100% - Show "Intelligence ready."
        setMessageIndex(LOADING_MESSAGES.length - 1);
        setMessageOpacity(1);

        // Allow 600ms for final visual appreciation before triggering smooth exit transition
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 550);
        }, 600);
      }
    };

    requestRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [showStatus, onComplete]);

  return (
    <div 
      className={`
        fixed inset-0 z-50 bg-[#F9F4BC] text-[#1F2937] flex flex-col justify-between items-center 
        px-4 py-8 select-none overflow-hidden transition-all duration-300
        ${isExiting ? 'historian-loader-exit' : ''}
      `}
    >
      {/* 1. Top Thin Animated Gradient Strip (Red -> Blue -> Yellow) */}
      <div className="historian-loader-top-strip" />

      {/* 2. Abstract Decorative Low-Opacity Curves */}
      <div className="historian-loader-bg-curve -top-24 -left-24 w-96 h-96 bg-[#FF8000]" />
      <div className="historian-loader-bg-curve -bottom-28 -right-28 w-[450px] h-[450px] bg-[#3B82F6]" />
      <div className="historian-loader-bg-curve top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F59E0B] opacity-5" />

      {/* Top-Right Quick Judge Skip Action */}
      <div className="w-full max-w-5xl flex justify-end z-20">
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8E4D0] hover:border-[#FF8000] text-xs font-bold text-[#6B7280] hover:text-[#FF8000] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Skip directly to Historian Dashboard"
          >
            <span>Skip Intro</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>

      {/* Main Centered Content Stack */}
      <div className="my-auto flex flex-col items-center text-center max-w-md w-full z-10 space-y-6">
        {/* 1. Temporary "BV" Logo Mark */}
        <div 
          className={`
            transition-all duration-700 ease-out transform
            ${showLogo ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-85 translate-y-2'}
          `}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-slate-900/15 tracking-wider border border-slate-700/60">
            BV
          </div>
        </div>

        {/* 2. Title & Tagline Stack */}
        <div className="space-y-1">
          <h1 
            className={`
              text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight transition-all duration-700 ease-out
              ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
            `}
          >
            Historian
          </h1>

          <p 
            className={`
              text-xs sm:text-sm font-semibold text-[#6B7280] tracking-tight max-w-xs mx-auto leading-relaxed transition-all duration-700 ease-out
              ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
            `}
          >
            Turning historical data into intelligent decisions
          </p>
        </div>

        {/* 3. Circular AI Core Visualization */}
        <div 
          className={`
            relative my-4 transition-all duration-700 ease-out transform
            ${showAIVisual ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
        >
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
            {/* Outer Solid / Soft Ring */}
            <div 
              className={`
                absolute inset-0 rounded-full border border-slate-300/80
                ${showRings ? 'animate-ring-spin-slow' : ''}
              `}
            />

            {/* Inner Dashed / Dotted Ring */}
            <div 
              className={`
                absolute inset-2 rounded-full border border-dashed border-[#3B82F6]/70
                ${showRings ? 'animate-ring-spin-reverse' : ''}
              `}
            />

            {/* Orbiting Node Markers */}
            <div className={`absolute inset-0 ${showRings ? 'animate-ring-spin-slow' : ''}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF8000] absolute top-1 left-1/2 -translate-x-1/2 shadow-xs shadow-orange-500" />
              <div className="w-2 h-2 rounded-full bg-[#3B82F6] absolute bottom-2 left-1/2 -translate-x-1/2 shadow-xs shadow-blue-500" />
            </div>

            {/* Central Circular AI Core */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white/95 border border-slate-200/90 shadow-lg animate-core-glow relative overflow-hidden flex flex-col items-center justify-center">
              {/* Central "AI" Text */}
              <span className="font-extrabold text-[#0F172A] text-sm sm:text-base tracking-widest relative z-10">
                AI
              </span>

              {/* Animated Scan Line */}
              {showScan && <div className="animate-scan-line" />}
            </div>
          </div>
        </div>

        {/* 4. Dynamic Loading Message */}
        <div className="h-7 flex items-center justify-center">
          {showStatus && (
            <p 
              className="text-xs font-bold text-[#1F2937] tracking-tight historian-message-transition"
              style={{
                opacity: messageOpacity,
                transform: `translateY(${messageOpacity === 1 ? '0px' : '4px'})`
              }}
            >
              {LOADING_MESSAGES[messageIndex]}
            </p>
          )}
        </div>

        {/* 5. Red-Blue-Yellow Gradient Progress Bar */}
        <div className="w-64 sm:w-72 space-y-2">
          <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden shadow-inner p-0.5">
            <div 
              className="historian-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage Counter */}
          <div className="text-center">
            <span className="text-xs font-extrabold text-[#1F2937] tracking-wider tabular-nums">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* 6. Footer (Bottom Center) */}
      <div className="z-10 text-center pb-2">
        <p className="text-[10px] sm:text-[11px] text-[#9CA3AF] font-bold tracking-[0.25em] uppercase">
          BRIGHT VISION • AI INNOVATION HACKATHON 2026
        </p>
      </div>
    </div>
  );
}
