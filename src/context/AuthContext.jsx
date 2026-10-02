import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getStoredUser, 
  loginUser, 
  registerUser, 
  loginWithSSO, 
  triggerGoogleOAuth,
  logoutUser, 
  sendPasswordReset 
} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const login = (email, password, rememberMe = true) => {
    const res = loginUser(email, password, rememberMe);
    if (res.success) {
      setUser(res.user);
      showToast("Welcome back to Historian.", "success");
    }
    return res;
  };

  const signup = (userData) => {
    const res = registerUser(userData);
    if (res.success) {
      setUser(res.user);
      showToast("Account created successfully.", "success");
    }
    return res;
  };

  const loginSSO = (provider = 'Google', options = { prompt: 'select_account' }) => {
    const ssoOptions = { prompt: 'select_account', ...options };
    if (provider === 'Google') {
      triggerGoogleOAuth(ssoOptions);
    }
    const res = loginWithSSO(provider, ssoOptions);
    if (res.success) {
      setUser(res.user);
      showToast(`Signed in with ${provider} SSO. Google account chooser verified.`, "success");
    }
    return res;
  };

  const resetPassword = (email) => {
    const res = sendPasswordReset(email);
    if (res.success) {
      showToast(res.message, "info");
    }
    return res;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    showToast("You have been securely signed out.", "info");
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        signup, 
        loginSSO, 
        triggerGoogleOAuth,
        resetPassword, 
        logout, 
        toast, 
        showToast 
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm">
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#1F2937] text-white rounded-2xl shadow-2xl border border-slate-700/80 text-xs font-semibold">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF8000] animate-ping" />
            <span className="flex-1">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white text-sm ml-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
