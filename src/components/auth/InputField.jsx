import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  autoFocus = false,
  disabled = false,
  className = '',
  rightElement = null,
  isFlashing = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-1.5 transition-all duration-200 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-xs tracking-tight transition-colors duration-200 ${
            isFocused ? 'font-extrabold text-[#1F2937]' : 'font-bold text-[#374151]'
          }`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className={`
            absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center 
            transition-colors duration-200 
            ${isFocused ? 'text-[#FF8000]' : 'text-[#9CA3AF]'}
          `}>
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`
            w-full py-2.5 sm:py-3 bg-slate-50/70 border rounded-xl text-xs sm:text-sm text-[#1F2937] 
            placeholder:text-[#9CA3AF] font-medium transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${rightElement ? 'pr-11' : 'pr-3.5'}
            ${isFlashing ? 'animate-field-flash' : ''}
            ${error 
              ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
              : 'border-[#E8E4D0] hover:border-[#D6CE9A] focus:bg-white focus:border-[#FF8000] focus:ring-3 focus:ring-[#FF8000]/12'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Inline Error Message */}
      {error && (
        <p 
          id={`${inputId}-error`}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 animate-fade-in mt-1"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
