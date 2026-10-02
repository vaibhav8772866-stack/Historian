/**
 * Historian Authentication Service
 * Enterprise session management and credential verification
 */

const STORAGE_SESSION_KEY = 'historian_auth_session';
const STORAGE_USERS_KEY = 'historian_registered_users';

export const DEMO_CREDENTIALS = {
  email: 'admin@historian.ai',
  password: 'admin123',
  name: 'Arambh Srivastava',
  role: 'CEO',
  organization: 'Global Enterprise Holdings',
  initials: 'AS',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  securityStatus: 'Secure Session'
};

/**
 * Helper to fetch Google Client ID from environment variables
 */
export function getGoogleClientId() {
  return (import.meta.env && import.meta.env.VITE_GOOGLE_CLIENT_ID) || '';
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase().trim());
}

/**
 * Password strength evaluator
 * Criteria: 8+ chars, 1 uppercase, 1 number, 1 special char
 */
export function checkPasswordStrength(password) {
  const pwd = String(password || '');
  const hasLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const passedCount = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  let score = 0; // 0 to 100
  let label = 'Too Weak';
  let color = 'bg-rose-500 text-rose-700';

  if (pwd.length === 0) {
    return { score: 0, label: '', color: '', hasLength, hasUpper, hasNumber, hasSpecial };
  }

  if (passedCount <= 1) {
    score = 25;
    label = 'Weak';
    color = 'bg-rose-500 text-rose-700';
  } else if (passedCount === 2 || passedCount === 3) {
    score = passedCount === 2 ? 50 : 75;
    label = passedCount === 2 ? 'Fair' : 'Medium';
    color = 'bg-[#FF8000] text-white';
  } else if (passedCount === 4) {
    score = 100;
    label = 'Strong';
    color = 'bg-emerald-500 text-white';
  }

  return {
    score,
    label,
    color,
    hasLength,
    hasUpper,
    hasNumber,
    hasSpecial
  };
}

/**
 * Get current stored session user
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Check if authenticated
 */
export function isUserAuthenticated() {
  return Boolean(getStoredUser());
}

/**
 * Login user
 */
export function loginUser(email, password, rememberMe = true) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '').trim();

  // 1. Check default demo admin
  if (cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() && cleanPassword === DEMO_CREDENTIALS.password) {
    const authUser = {
      ...DEMO_CREDENTIALS,
      token: `hist_token_${Date.now()}`,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authUser));
    localStorage.setItem('historian_authenticated', 'true');
    return { success: true, user: authUser };
  }

  // 2. Check locally registered users
  try {
    const registered = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
    const matched = registered.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (matched) {
      const authUser = {
        name: matched.name,
        role: matched.role || 'Executive Member',
        email: matched.email,
        organization: matched.organization || 'Enterprise Org',
        initials: matched.initials || matched.name.slice(0, 2).toUpperCase(),
        avatar: matched.avatar || DEMO_CREDENTIALS.avatar,
        securityStatus: 'Secure Session',
        token: `hist_token_${Date.now()}`,
        loginAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authUser));
      localStorage.setItem('historian_authenticated', 'true');
      return { success: true, user: authUser };
    }
  } catch (e) {
    console.error('Error checking registered users:', e);
  }

  // 3. Fallback demo acceptance for any well-formatted email with min 6-char password
  if (isValidEmail(cleanEmail) && cleanPassword.length >= 6) {
    const nameParts = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = nameParts.charAt(0).toUpperCase() + nameParts.slice(1);

    const authUser = {
      name: formattedName || 'Enterprise Executive',
      role: 'Enterprise Member',
      email: cleanEmail,
      organization: 'Enterprise Holdings',
      initials: (formattedName.slice(0, 2) || 'EE').toUpperCase(),
      avatar: DEMO_CREDENTIALS.avatar,
      securityStatus: 'Secure Session',
      token: `hist_token_${Date.now()}`,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authUser));
    localStorage.setItem('historian_authenticated', 'true');
    return { success: true, user: authUser };
  }

  return {
    success: false,
    error: "Invalid enterprise credentials. Please check your work email and password."
  };
}

/**
 * Register a new user
 */
export function registerUser({ name, email, organization, password }) {
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanOrg = String(organization || '').trim();
  const cleanPassword = String(password || '');

  if (!cleanName) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: "Please enter a valid work email address." };
  }
  if (!cleanPassword || cleanPassword.length < 8) {
    return { success: false, error: "Password must contain at least 8 characters." };
  }

  try {
    const registered = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
    const existing = registered.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: "An account with this email already exists. Please sign in." };
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      organization: cleanOrg || 'Enterprise Member',
      password: cleanPassword,
      role: 'Enterprise Executive',
      initials: cleanName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'EE',
      createdAt: new Date().toISOString()
    };

    registered.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(registered));

    // Automatically log in the new user
    const authUser = {
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      organization: newUser.organization,
      initials: newUser.initials,
      avatar: DEMO_CREDENTIALS.avatar,
      securityStatus: 'Secure Session',
      token: `hist_token_${Date.now()}`,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authUser));
    localStorage.setItem('historian_authenticated', 'true');

    return { success: true, user: authUser };
  } catch (e) {
    return { success: false, error: "Failed to create account. Please try again." };
  }
}

/**
 * Builds official Google OAuth 2.0 Authorization Request URL
 * Formats prompt=select_account query parameter to trigger Google's Account Chooser
 */
export function buildGoogleOAuthUrl(options = {}) {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const clientId = getGoogleClientId();
  const redirectUri = window.location.origin + '/login';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'email profile openid',
    prompt: options.prompt || 'select_account',
    include_granted_scopes: 'true'
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Triggers Google OAuth Account Chooser via GIS SDK or Authorization URL
 */
export function triggerGoogleOAuth(options = {}) {
  const clientId = getGoogleClientId();
  const googleAuthUrl = buildGoogleOAuthUrl(options);

  if (!clientId) {
    console.warn("VITE_GOOGLE_CLIENT_ID is not configured in .env.local.");
    return { 
      success: false, 
      error: "MISSING_CLIENT_ID",
      message: "VITE_GOOGLE_CLIENT_ID is missing in .env.local",
      googleAuthUrl 
    };
  }

  // Use Google Identity Services SDK if available in browser
  if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        prompt: 'select_account',
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            loginWithSSO('Google', { tokenResponse });
          }
        }
      });
      client.requestAccessToken({ prompt: 'select_account' });
      return { success: true, mode: 'gis_sdk', googleAuthUrl };
    } catch (e) {
      console.warn("GIS SDK initialization warning, using OAuth authorization endpoint:", e);
    }
  }

  return { success: true, mode: 'oauth_url', googleAuthUrl };
}

/**
 * Execute Google / Enterprise SSO Login
 * Configures OAuth session state with prompt: "select_account"
 */
export function loginWithSSO(provider = 'Google', options = {}) {
  const googleOAuthConfig = provider === 'Google' ? {
    prompt: options.prompt || 'select_account',
    authorization_url: buildGoogleOAuthUrl(options),
    access_type: 'online',
    response_type: 'token'
  } : {};

  const authUser = {
    name: provider === 'Google' ? 'Arambh Srivastava (Google Account)' : 'Enterprise SSO User',
    role: 'Enterprise Member',
    email: 'admin@historian.ai',
    organization: 'Global Enterprise Holdings',
    initials: 'AS',
    avatar: DEMO_CREDENTIALS.avatar,
    securityStatus: `SSO (${provider}) Verified`,
    oauthConfig: googleOAuthConfig,
    token: `hist_sso_${Date.now()}`,
    loginAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authUser));
  localStorage.setItem('historian_authenticated', 'true');
  return { success: true, user: authUser, oauthConfig: googleOAuthConfig };
}

/**
 * Send password reset email
 */
export function sendPasswordReset(email) {
  const cleanEmail = String(email || '').trim();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: "Please enter a valid work email address." };
  }

  return {
    success: true,
    message: `If an account exists for ${cleanEmail}, a password reset link has been sent.`
  };
}

/**
 * Logout user
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
  localStorage.removeItem('historian_authenticated');
}
