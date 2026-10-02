import React from 'react';

export default function AuthDivider({ text = "OR CONTINUE WITH" }) {
  return (
    <div className="relative my-4 select-none">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#E8E4D0]" />
      </div>
      <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF]">
        <span className="bg-white px-3">{text}</span>
      </div>
    </div>
  );
}
