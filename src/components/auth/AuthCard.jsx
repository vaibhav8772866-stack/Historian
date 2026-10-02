import React from 'react';

export default function AuthCard({ children, className = '' }) {
  return (
    <div className={`
      w-full bg-white border border-[#E8E4D0] rounded-[24px] 
      shadow-xl shadow-amber-950/5 p-6 sm:p-9 relative 
      transition-all duration-300 animate-fade-in delay-200
      ${className}
    `}>
      {children}
    </div>
  );
}
