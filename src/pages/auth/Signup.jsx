import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Building, ArrowRight, AlertCircle, Check, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../services/auth';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/auth/InputField';
import PasswordField from '../../components/auth/PasswordField';
import PasswordStrength from '../../components/auth/PasswordStrength';
import AuthDivider from '../../components/auth/AuthDivider';
import SocialLogin from '../../components/auth/SocialLogin';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const isPasswordMatch = password && confirmPassword && password === confirmPassword;
  const isFormValid = 
    name.trim().length > 0 && 
    isValidEmail(email) && 
    password.length >= 8 && 
    isPasswordMatch && 
    agreeTerms;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = signup({ name, email, organization, password });
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.error || 'Failed to create account.');
      }
    }, 500);
  };

  return (
    <AuthLayout variant="signup">
      <AuthCard>
        {/* Header Branding */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8000] to-[#E67300] flex items-center justify-center text-white shadow-md shadow-orange-500/20 animate-logo-entrance">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
                <circle cx="12" cy="12" r="2" fill="white" />
              </svg>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-md animate-gateway-pulse">
              Enterprise Access
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight pt-2">
            Create your Historian account
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium">
            Start turning enterprise history into actionable intelligence.
          </p>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <InputField
            id="signup-name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arambh Srivastava"
            icon={User}
            required
            autoFocus
          />

          {/* Work Email */}
          <InputField
            id="signup-email"
            label="Work Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            icon={Mail}
            required
          />

          {/* Organization */}
          <InputField
            id="signup-org"
            label="Organization / Company"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Company name"
            icon={Building}
          />

          {/* Password */}
          <div>
            <PasswordField
              id="signup-password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
            {/* Live Strength Indicator */}
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <PasswordField
              id="signup-confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            {confirmPassword && (
              <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 animate-fade-in ${
                isPasswordMatch ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {isPasswordMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Passwords do not match</span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Custom Animated Checkbox for Terms */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200
                  ${agreeTerms 
                    ? 'bg-[#FF8000] border-[#FF8000] shadow-xs shadow-orange-500/30' 
                    : 'bg-slate-50 border-[#D6CE9A] group-hover:border-[#FF8000]'}
                `}>
                  {agreeTerms && (
                    <Check className="w-3 h-3 text-white stroke-[3] animate-fade-in" />
                  )}
                </div>
              </div>
              <span className="text-xs text-[#4B5563] leading-tight">
                I agree to the{' '}
                <a 
                  href="#terms" 
                  onClick={(e) => { e.preventDefault(); alert("Enterprise Terms of Service (Historian Standard)"); }} 
                  className="font-bold text-[#FF8000] animated-underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a 
                  href="#privacy" 
                  onClick={(e) => { e.preventDefault(); alert("Enterprise Privacy Policy (SOC2 / GDPR Compliant)"); }} 
                  className="font-bold text-[#FF8000] animated-underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="
              w-full py-3 px-4 bg-[#FF8000] hover:bg-[#E67300] hover:shadow-lg hover:shadow-orange-500/25 
              hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] 
              disabled:opacity-40 disabled:cursor-not-allowed 
              text-white text-xs sm:text-sm font-bold rounded-xl 
              flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mt-3 group
            "
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Social / SSO Divider */}
        <AuthDivider text="OR CONTINUE WITH" />

        {/* Social Buttons */}
        <SocialLogin />

        {/* Sign In Navigation Link with Animated Underline */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-[#6B7280]">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-bold text-[#FF8000] hover:text-[#E67300] animated-underline ml-1"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
