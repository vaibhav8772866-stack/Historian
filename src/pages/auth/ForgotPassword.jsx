import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../services/auth';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/auth/InputField';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid work email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      resetPassword(email);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 450);
  };

  return (
    <AuthLayout variant="login">
      <AuthCard>
        {/* Header */}
        <div className="space-y-1.5 mb-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white shadow-md shadow-orange-500/20 animate-logo-entrance">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
                <circle cx="12" cy="12" r="2" fill="white" />
              </svg>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-md animate-gateway-pulse">
              Account Recovery
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight pt-2">
            Reset your password
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium">
            Enter your work email and we'll help you get back into Historian.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password Reset Email Dispatched</span>
              </div>
              <p className="leading-relaxed font-medium">
                If an account exists for <strong className="text-emerald-950 font-bold">{email}</strong>, a password reset link has been sent. Please check your inbox and spam folders.
              </p>
            </div>

            <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D0] text-xs text-[#6B7280]">
              <span className="font-bold text-[#1F2937]">Didn't receive it?</span> Check with your enterprise administrator or retry in a few moments.
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-[#1F2937] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Try another email
              </button>
              <Link
                to="/login"
                className="w-full py-2.5 px-4 bg-[#FF8000] hover:bg-[#E67300] hover:shadow-md hover:shadow-orange-500/25 active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
              >
                <span>Back to Sign In</span>
                <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="reset-email"
              label="Work email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon={Mail}
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-3 px-4 bg-[#FF8000] hover:bg-[#E67300] hover:shadow-lg hover:shadow-orange-500/25 
                hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] 
                disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl 
                flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mt-2 group
              "
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Link...</span>
                </span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back Link with Animated Underline */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B5563] hover:text-[#FF8000] animated-underline transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
