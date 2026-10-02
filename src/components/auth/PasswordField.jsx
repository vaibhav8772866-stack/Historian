import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import InputField from './InputField';

export default function PasswordField({
  id,
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  required = false,
  autoFocus = false,
  disabled = false,
  className = '',
  isFlashing = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputField
      id={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      icon={Lock}
      required={required}
      autoFocus={autoFocus}
      disabled={disabled}
      className={className}
      isFlashing={isFlashing}
      rightElement={
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#1F2937] hover:bg-slate-200/60 active:scale-95 transition-all duration-180 cursor-pointer flex items-center justify-center"
        >
          <span className="transition-transform duration-180 transform scale-100">
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-[#FF8000] animate-fade-in" />
            ) : (
              <Eye className="w-4 h-4 text-[#9CA3AF] hover:text-[#1F2937] animate-fade-in" />
            )}
          </span>
        </button>
      }
    />
  );
}
