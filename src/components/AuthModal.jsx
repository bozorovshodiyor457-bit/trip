import React, { useState, useEffect } from 'react';
import { X, Smartphone, Mail, ShieldCheck, User, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import authService from '../services/authService';

// Helper to parse JWT id_token from Google safely
function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("JWT parse error:", e);
    return null;
  }
}

// Helper to safely extract string error message from backend responses or Axios errors
function formatErrorMessage(err, fallback = "Noto'g'ri telefon raqami yoki email kiritildi") {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (typeof data.error === 'string') return data.error;
    if (data.error?.message && typeof data.error.message === 'string') return data.error.message;
    if (typeof data.message === 'string') return data.message;
  }
  if (typeof err.error === 'string') return err.error;
  if (err.error?.message && typeof err.error.message === 'string') return err.error.message;
  if (typeof err.message === 'string') return err.message;
  return fallback;
}

export default function AuthModal({ isOpen, onClose }) {
  const context = useAppContext() || {};
  const setUser = context.setUser || (() => {});
  const t = context.t || ((key, fallback) => fallback || key);

  // States
  const [activeTab, setActiveTab] = useState('local'); // 'local' (phone) or 'foreign' (email)
  const [authStep, setAuthStep] = useState('input'); // 'input' | 'otp' | 'register_name'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentIdentifier, setCurrentIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 60-second resend timer state
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Resend Timer Countdown
  useEffect(() => {
    let timerInterval = null;
    if (authStep === 'otp' && resendTimer > 0) {
      timerInterval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [authStep, resendTimer]);

  // OAuth Listener Effect
  useEffect(() => {
    function handleMessage(event) {
      if (event.data && event.data.type === 'OAUTH_AUTH_SUCCESS' && event.data.user) {
        setUser(event.data.user);
        localStorage.setItem('visitca_user', JSON.stringify(event.data.user));
        setIsGoogleLoading(false);
        setIsTelegramLoading(false);
        onClose();
      }
    }
    window.addEventListener('message', handleMessage);

    const hash = window.location.hash;
    const search = window.location.search;

    if (hash.includes('access_token') || hash.includes('id_token')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');

      if (idToken) {
        const parsed = parseJwt(idToken);
        if (parsed) {
          const googleUser = {
            name: parsed.name || parsed.given_name || parsed.email?.split('@')[0] || "Google Foydalanuvchisi",
            email: parsed.email,
            avatar: parsed.picture || "https://lh3.googleusercontent.com/a/default-user=s96-c",
            provider: "google",
            token: idToken
          };
          setUser(googleUser);
          localStorage.setItem('visitca_user', JSON.stringify(googleUser));
          window.history.replaceState(null, '', window.location.pathname);
          onClose();
        }
      } else if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.email) {
              const googleUser = {
                name: data.name || data.email.split('@')[0],
                email: data.email,
                avatar: data.picture || "https://lh3.googleusercontent.com/a/default-user=s96-c",
                provider: "google",
                token: accessToken
              };
              setUser(googleUser);
              localStorage.setItem('visitca_user', JSON.stringify(googleUser));
              window.history.replaceState(null, '', window.location.pathname);
              onClose();
            }
          })
          .catch(err => console.error("Google userinfo fetch error:", err));
      }
    }

    if (search.includes('hash=') && (search.includes('first_name=') || search.includes('id='))) {
      const params = new URLSearchParams(search);
      const tgUser = {
        name: `${params.get('first_name') || ''} ${params.get('last_name') || ''}`.trim() || params.get('username') || "Telegram Foydalanuvchisi",
        email: params.get('username') ? `@${params.get('username')}` : null,
        phone: params.get('phone') || '',
        avatar: params.get('photo_url') || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
        provider: "telegram",
        telegramId: params.get('id')
      };
      setUser(tgUser);
      localStorage.setItem('visitca_user', JSON.stringify(tgUser));
      window.history.replaceState(null, '', window.location.pathname);
      onClose();
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [setUser, onClose]);

  // EARLY RETURN ONLY AFTER ALL HOOKS ARE DECLARED
  if (!isOpen) return null;

  // Format Phone Input
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.slice(0, 9);
    
    let formatted = val;
    if (val.length > 2) formatted = val.slice(0, 2) + '-' + val.slice(2);
    if (val.length > 5) formatted = formatted.slice(0, 6) + '-' + formatted.slice(6);
    if (val.length > 7) formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
    
    setPhone(formatted);
    setErrorMsg('');
  };

  // Step 1: Send OTP handler
  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    let identifier = '';
    if (activeTab === 'local') {
      const rawDigits = phone.replace(/\D/g, '');
      if (rawDigits.length < 9) {
        setErrorMsg("Telefon raqamini to'liq kiriting");
        return;
      }
      const phoneDigits = rawDigits.length === 9 ? `998${rawDigits}` : rawDigits;
      identifier = phoneDigits.startsWith('+') ? phoneDigits : `+${phoneDigits}`;
    } else {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg("E-mail manzilini to'g'ri kiriting");
        return;
      }
      identifier = email.trim();
    }

    setIsLoading(true);
    try {
      const res = await authService.sendOtp(identifier);
      if (res && res.success === false) {
        setErrorMsg(formatErrorMessage(res, "Noto'g'ri telefon raqami yoki email kiritildi"));
        return;
      }
      
      setCurrentIdentifier(identifier);
      const msg = typeof res?.message === 'string' ? res.message : `${identifier} manziliga tasdiqlash kodi yuborildi.`;
      setSuccessMsg(msg);
      
      // SWITCH TO OTP STEP IMMEDIATELY ON 200 OK
      setAuthStep('otp');
      setCode('');
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error("OTP send error:", err);
      setErrorMsg(formatErrorMessage(err, "Noto'g'ri telefon raqami yoki email kiritildi"));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend || !currentIdentifier) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const res = await authService.sendOtp(currentIdentifier);
      const msg = typeof res?.message === 'string' ? res.message : `${currentIdentifier} manziliga yangi kod yuborildi.`;
      setSuccessMsg(msg);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, "Kodni qayta yuborishda xatolik yuz berdi"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP Handler
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!code.trim() || code.trim().length < 4) {
      setErrorMsg("Tasdiqlash kodini to'liq kiriting");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(currentIdentifier, code.trim());
      const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken || 'visitca-jwt-token';

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('visitca_token', token);
      }

      // Fetch Profile (/api/b2c/auth/me)
      let userData = null;
      try {
        const profileRes = await authService.getMe(token);
        userData = profileRes.user || profileRes.data || profileRes;
      } catch (profileErr) {
        console.warn("Profile endpoint fallback:", profileErr);
        userData = {
          name: fullName || (activeTab === 'local' ? `Fuqaro (${currentIdentifier})` : currentIdentifier.split('@')[0]),
          email: activeTab === 'foreign' ? currentIdentifier : null,
          phone: activeTab === 'local' ? currentIdentifier : '',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
          isVerified: true
        };
      }

      // If user profile has no name, ask for name
      if (!userData?.name || userData.name.includes('Fuqaro') || userData.name === currentIdentifier.split('@')[0]) {
        setUser(userData);
        localStorage.setItem('visitca_user', JSON.stringify(userData));
        setAuthStep('register_name');
        setIsLoading(false);
        return;
      }

      setUser(userData);
      localStorage.setItem('visitca_user', JSON.stringify(userData));
      setIsLoading(false);
      
      // Close modal and reset state
      onClose();
      setAuthStep('input');
      setCode('');
      setErrorMsg('');
    } catch (err) {
      console.error("OTP verify error:", err);
      setIsLoading(false);
      setErrorMsg(formatErrorMessage(err, "Noto'g'ri kod kiritildi yoki serverda xatolik yuz berdi"));
    }
  };

  // Step 3: Register Name Submit
  const handleSaveName = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Ism-familiyangizni kiriting");
      return;
    }
    const updatedUser = {
      name: fullName.trim(),
      email: activeTab === 'foreign' ? currentIdentifier : null,
      phone: activeTab === 'local' ? currentIdentifier : '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      isVerified: true
    };
    setUser(updatedUser);
    localStorage.setItem('visitca_user', JSON.stringify(updatedUser));
    onClose();
    setAuthStep('input');
    setFullName('');
    setErrorMsg('');
  };

  // Social Login Handlers
  const handleGoogleLogin = () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1047123987123-dummyclientid.apps.googleusercontent.com';
      const redirectUri = window.location.origin;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token%20id_token&scope=email%20profile%20openid&prompt=select_account`;

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        googleAuthUrl,
        'Google OAuth Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        window.location.href = googleAuthUrl;
        return;
      }

      const timer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(timer);
            setIsGoogleLoading(false);
          }
        } catch (e) {
          clearInterval(timer);
          setIsGoogleLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.error("Google auth error:", err);
      setIsGoogleLoading(false);
      setErrorMsg("Google orqali kirishda xatolik yuz berdi");
    }
  };

  const handleTelegramLogin = () => {
    try {
      setIsTelegramLoading(true);
      setErrorMsg('');
      const botId = import.meta.env.VITE_TELEGRAM_BOT_ID || '7123456789';
      const origin = encodeURIComponent(window.location.origin);
      const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${origin}&embed=0&request_access=write`;

      const width = 550;
      const height = 470;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        telegramAuthUrl,
        'Telegram OAuth Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        window.location.href = telegramAuthUrl;
        return;
      }

      const timer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(timer);
            setIsTelegramLoading(false);
          }
        } catch (e) {
          clearInterval(timer);
          setIsTelegramLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.error("Telegram auth error:", err);
      setIsTelegramLoading(false);
      setErrorMsg("Telegram orqali kirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/50 p-3.5 border border-red-200 dark:border-red-800">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 leading-snug">{errorMsg}</p>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3.5 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 leading-snug">{successMsg}</p>
          </div>
        )}

        {/* STEP 1: INITIAL INPUT VIEW (PHONE OR EMAIL) */}
        {authStep === 'input' && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              {activeTab === 'foreign' ? t('auth.loginTitle') : "Tizimga kirish"}
            </h2>

            {/* Local vs Foreign Tabs */}
            <div className="flex space-x-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('local'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${activeTab === 'local' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
              >
                {t('auth.local') || "Fuqaro (Telefon)"}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('foreign'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${activeTab === 'foreign' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
              >
                {t('auth.foreign') || "Xorijiy tourist (E-mail)"}
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendCode} className="space-y-4">
              {activeTab === 'local' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">{t('modals.phoneLabel') || "Telefon raqamingiz"}</label>
                  <div className="relative rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                    <span className="text-neutral-600 dark:text-neutral-400 font-semibold pr-2.5 border-r border-neutral-200 dark:border-neutral-700 mr-2.5">+998</span>
                    <input
                      type="tel"
                      className="block w-full border-0 p-0 text-neutral-900 dark:text-white bg-transparent placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-0 sm:text-base font-semibold outline-none"
                      placeholder="90-123-45-67"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                    <Smartphone className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">{t('auth.email') || "E-mail manzilingiz"}</label>
                  <div className="relative rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                    <input
                      type="email"
                      className="block w-full border-0 p-0 text-neutral-900 dark:text-white bg-transparent placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-0 sm:text-sm font-medium outline-none"
                      placeholder="tourist@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      required
                    />
                    <Mail className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 focus:outline-none transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (t('modals.sendCode') || "Kod yuborish")}
              </button>
            </form>

            {/* Social Logins */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider">
                <span className="bg-white dark:bg-neutral-900 px-4 text-neutral-400">{t('auth.or') || "yoki har biridan biri"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                disabled={isGoogleLoading || isTelegramLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="#4285F4"
                    />
                  </svg>
                )}
                <span className="text-sm font-bold">{isGoogleLoading ? 'Kutilmoqda...' : 'Google'}</span>
              </button>

              <button 
                type="button" 
                onClick={handleTelegramLogin} 
                disabled={isGoogleLoading || isTelegramLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {isTelegramLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2AABEE"/>
                    <path d="M5.44198 11.5173L16.2731 7.33758C16.7761 7.15286 17.218 7.45892 17.0601 8.01633L15.176 16.8904C15.0298 17.5458 14.6374 17.708 14.0924 17.4019L11.0967 15.1951L9.65152 16.5866C9.4916 16.7465 9.35824 16.8799 9.06456 16.8799L9.2798 13.8217L14.845 8.78857C15.0872 8.57288 14.7925 8.45266 14.4715 8.66835L7.58554 13.0033L4.62241 12.076C3.97811 11.8745 3.96541 11.4326 4.75713 11.1216L5.44198 11.5173Z" fill="white"/>
                  </svg>
                )}
                <span className="text-sm font-bold">{isTelegramLoading ? 'Kutilmoqda...' : 'Telegram'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION VIEW */}
        {authStep === 'otp' && (
          <div className="space-y-6">
            <div>
              <button
                type="button"
                onClick={() => { setAuthStep('input'); setErrorMsg(''); setSuccessMsg(''); }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-3 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Orqaga ({currentIdentifier})
              </button>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Tasdiqlash kodini kiriting
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                <span className="font-semibold text-neutral-900 dark:text-white">{currentIdentifier}</span> manziliga yuborilgan 6-xonali kodni kiriting
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <input
                  type="text"
                  autoFocus
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErrorMsg(''); }}
                  placeholder="000000"
                  className="block w-full rounded-2xl border-2 border-emerald-500/80 bg-neutral-50 dark:bg-neutral-800 p-3.5 text-center text-3xl font-extrabold tracking-[0.4em] font-mono text-neutral-900 dark:text-white shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length < 4}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 focus:outline-none transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Tasdiqlash va kirish'}
              </button>
            </form>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-col items-center gap-3 text-sm">
              {resendTimer > 0 ? (
                <p className="text-xs text-neutral-400 font-medium">
                  Kodni qayta yuborish: <span className="font-bold text-neutral-700 dark:text-neutral-300">{resendTimer} soniya</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Kodni qayta yuborish
                </button>
              )}

              <button
                type="button"
                onClick={() => { setAuthStep('input'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:underline"
              >
                Email yoki telefon raqamini o'zgartirish
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REGISTER NAME VIEW */}
        {authStep === 'register_name' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                F.I.Sh. kiriting
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Tizimda va vaucherda ko'rinishi uchun to'liq ism-familiyangizni kiriting
              </p>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">To'liq ismingiz</label>
                <div className="relative rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                  <input
                    type="text"
                    autoFocus
                    className="block w-full border-0 p-0 text-neutral-900 dark:text-white bg-transparent placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-0 sm:text-base font-semibold outline-none"
                    placeholder="Sardor Bozorov"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setErrorMsg(''); }}
                    required
                  />
                  <User className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 focus:outline-none transition-all"
              >
                Saqlash va davom etish
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
