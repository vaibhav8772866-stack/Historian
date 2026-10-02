import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Check, 
  Shield, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CREDENTIALS } from '../../services/auth';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/auth/InputField';
import PasswordField from '../../components/auth/PasswordField';
import AuthDivider from '../../components/auth/AuthDivider';
import SocialLogin from '../../components/auth/SocialLogin';

export default function Login() {
  const [email, setEmail] = useState('admin@historian.ai');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const { login, showToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your work email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || "We couldn't sign you in. Check your email and password and try again.");
      }
    }, 450);
  };

  const handleFillDemo = () => {
    setIsAutoFilling(true);
    setEmail('');
    setPassword('');

    setTimeout(() => {
      setEmail(DEMO_CREDENTIALS.email);
      setPassword(DEMO_CREDENTIALS.password);
      setError('');
      showToast("Demo credentials loaded.", "info");
      setTimeout(() => setIsAutoFilling(false), 850);
    }, 150);
  };

  return (
    <AuthLayout variant="login">
      <AuthCard>
        {/* Card Top Header with Logo (Left) and SECURE GATEWAY Badge (Right) */}
        <div className="space-y-1.5 mb-6">
          <div className="flex items-center justify-between">
            {/* Top-Left Inside Card: Historian Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white shadow-md shadow-orange-500/25 animate-logo-entrance">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
                <circle cx="12" cy="12" r="2" fill="white" />
              </svg>
            </div>
            
            {/* Top-Right Inside Card: Green SECURE GATEWAY Badge */}
            <span className="px-3 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs animate-gateway-pulse flex items-center gap-1.5 cursor-default hover:scale-105 transition-transform duration-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>SECURE GATEWAY</span>
            </span>
          </div>

          {/* Login Header */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight pt-3">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium">
            Sign in to continue to <strong className="text-[#FF8000] font-extrabold">Historian</strong>.
          </p>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="work-email"
            label="Work email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            icon={Mail}
            required
            autoFocus
            isFlashing={isAutoFilling}
          />

          <PasswordField
            id="login-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            isFlashing={isAutoFilling}
          />

          {/* Remember me / Forgot Password Row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200
                  ${rememberMe 
                    ? 'bg-[#FF8000] border-[#FF8000] shadow-xs shadow-orange-500/30' 
                    : 'bg-slate-50 border-[#D6CE9A] group-hover:border-[#FF8000]'}
                `}>
                  {rememberMe && (
                    <Check className="w-3 h-3 text-white stroke-[3] animate-fade-in" />
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-[#4B5563] group-hover:text-[#1F2937] transition-colors">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-bold text-[#FF8000] hover:text-[#E67300] animated-underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Primary Sign In Button (Sign In →) */}
          <button
            type="submit"
            disabled={isLoading}
            onMouseMove={handleMouseMove}
            className="
              card-cursor-light btn-shine-container w-full py-3.5 px-4 bg-[#FF8000] hover:bg-[#E67300] 
              hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 
              active:translate-y-0 active:scale-[0.97] 
              disabled:opacity-50 disabled:cursor-not-allowed 
              text-white text-xs sm:text-sm font-extrabold rounded-xl 
              flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mt-2 group
            "
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credential Card */}
        <div className="mt-4 p-3 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex items-center justify-between text-xs transition-colors hover:border-[#FFD1A4]">
          <div className="min-w-0 pr-2">
            <span className="font-extrabold text-[#1F2937]">Demo Account:</span>
            <div className="text-[11px] text-[#6B7280] font-mono truncate mt-0.5">
              admin@historian.ai / admin123
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-extrabold text-[#FF8000] hover:text-[#E67300] animated-underline shrink-0 ml-2 cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Social / SSO Divider */}
        <AuthDivider text="OR CONTINUE WITH" />

        {/* Google / Enterprise SSO Buttons */}
        <SocialLogin />

        {/* Sign Up Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-[#6B7280]">
          <span>Don't have an account? </span>
          <Link
            to="/signup"
            className="font-extrabold text-[#FF8000] hover:text-[#E67300] animated-underline ml-1"
          >
            Create an account
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-5 pt-3 border-t border-slate-100/60 flex items-center justify-around text-[10.5px] text-[#9CA3AF] font-medium">
          <span className="flex items-center gap-1 hover:text-[#4B5563] transition-colors">
            <Lock className="w-3 h-3 text-[#FF8000]" /> 256-bit Encryption
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 hover:text-[#4B5563] transition-colors">
            <ShieldCheck className="w-3 h-3 text-[#FF8000]" /> SOC 2 Compliant
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 hover:text-[#4B5563] transition-colors">
            <CheckCircle2 className="w-3 h-3 text-[#FF8000]" /> GDPR Ready
          </span>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
