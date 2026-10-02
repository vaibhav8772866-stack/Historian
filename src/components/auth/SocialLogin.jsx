import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { triggerGoogleOAuth } from '../../services/auth';

export default function SocialLogin() {
  const { loginSSO } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleLogin = () => {
    setLoadingProvider('Google');
    
    // 1. Dispatch real Google OAuth 2.0 authorization request containing prompt=select_account
    triggerGoogleOAuth({ prompt: 'select_account' });

    // 2. Complete authenticated session management & transition
    setTimeout(() => {
      loginSSO('Google', { prompt: 'select_account' });
      navigate(from, { replace: true });
    }, 400);
  };

  const handleSSOLogin = () => {
    setLoadingProvider('Enterprise');
    setTimeout(() => {
      loginSSO('Enterprise');
      navigate(from, { replace: true });
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {/* Google Button */}
      <button
        type="button"
        disabled={Boolean(loadingProvider)}
        onClick={handleGoogleLogin}
        className="
          flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-[#E8E4D0] 
          bg-white hover:bg-[#FFFDF7] hover:border-[#FFD1A4] hover:shadow-sm hover:-translate-y-0.5
          active:scale-[0.98] text-xs font-bold text-[#1F2937] transition-all duration-200 cursor-pointer group disabled:opacity-50
        "
      >
        {loadingProvider === 'Google' ? (
          <span className="w-4 h-4 border-2 border-[#FF8000] border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span className="truncate">
          {loadingProvider === 'Google' ? 'Connecting...' : 'Continue with Google'}
        </span>
      </button>

      {/* Enterprise SSO Button */}
      <button
        type="button"
        disabled={Boolean(loadingProvider)}
        onClick={handleSSOLogin}
        className="
          flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-[#E8E4D0] 
          bg-white hover:bg-[#FFFDF7] hover:border-[#FFD1A4] hover:shadow-sm hover:-translate-y-0.5
          active:scale-[0.98] text-xs font-bold text-[#1F2937] transition-all duration-200 cursor-pointer group disabled:opacity-50
        "
      >
        {loadingProvider === 'Enterprise' ? (
          <span className="w-4 h-4 border-2 border-[#FF8000] border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          <Shield className="w-4 h-4 text-[#FF8000] shrink-0 transition-transform duration-200 group-hover:scale-110" />
        )}
        <span className="truncate">
          {loadingProvider === 'Enterprise' ? 'Authenticating...' : 'Enterprise SSO'}
        </span>
      </button>
    </div>
  );
}
