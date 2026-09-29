import React, { useState } from 'react';
import { X, Smartphone, Mail, ShieldCheck, User } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';

export default function AuthModal({ isOpen, onClose }) {
  const { setUser, t } = useAppContext();
  const [activeTab, setActiveTab] = useState('local'); // 'local' or 'foreign'
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (phone.length < 5) return;

    try {
      // O'zbekiston kodi bilan to'liq raqamni shakllantirish
      const phoneNumber = `998${phone.replace(/\D/g, '')}`;
      
      // Textup.uz API ga so'rov yuborish
      const response = await fetch('https://api.textup.uz/sendsms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer SIZNING_API_KALITINGIZ' // TODO: Replace with real API key
        },
        body: JSON.stringify({
          phone: phoneNumber,
          text: 'Visitca Trip: Tizimga kirish uchun tasdiqlash kodingiz - 1234'
        })
      });
      
      // Real API ishlatilganda quyidagi xatolar nazorat qilinadi:
      /*
      if (!response.ok) {
        throw new Error("SMS xizmatida xatolik yuz berdi");
      }
      const data = await response.json();
      */
      
      // Muvaffaqiyatli jo'natilganda 2-qadamga o'tish
      setStep(2);
    } catch (error) {
      console.error("SMS yuborishda xatolik:", error);
      alert("SMS yuborishda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.");
    }
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.slice(0, 9);
    
    let formatted = val;
    if (val.length > 2) {
      formatted = val.slice(0, 2) + '-' + val.slice(2);
    }
    if (val.length > 5) {
      formatted = formatted.slice(0, 6) + '-' + formatted.slice(6);
    }
    if (val.length > 7) {
      formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
    }
    
    setPhone(formatted);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setStep(3); // Go to OneID step
  };

  const handleOneIDVerify = () => {
    // Mock OneID verification
    const userData = {
      name: 'O\'zbekiston Fuqarosi',
      phone: `+998 ${phone}`,
      email: null,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      isVerified: true
    };
    setUser(userData);
    localStorage.setItem('visitca_user', JSON.stringify(userData));
    onClose();
    setStep(1);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const resolvedName = isSignUp && fullName.trim() ? fullName.trim() : email.split('@')[0];
    const userData = {
      name: resolvedName,
      email: email,
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'
    };
    setUser(userData);
    localStorage.setItem('visitca_user', JSON.stringify(userData));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl overflow-hidden border border-transparent dark:border-neutral-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
          {activeTab === 'foreign' && isSignUp ? t('auth.signup') : t('auth.loginTitle')}
        </h2>

        <div className="flex space-x-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 mb-6">
          <button
            onClick={() => { setActiveTab('local'); setStep(1); setIsSignUp(false); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${activeTab === 'local' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
          >
            {t('auth.local')}
          </button>
          <button
            onClick={() => { setActiveTab('foreign'); setStep(1); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${activeTab === 'foreign' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
          >
            {t('auth.foreign')}
          </button>
        </div>

        {activeTab === 'local' ? (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('modals.phoneLabel')}</label>
                  <div className="relative rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                    <span className="text-neutral-500 dark:text-neutral-400 pr-2 border-r border-neutral-200 dark:border-neutral-700 mr-2">+998</span>
                    <input
                      type="tel"
                      className="block w-full border-0 p-0 text-neutral-900 dark:text-white bg-transparent placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-0 sm:text-sm outline-none"
                      placeholder="90-123-45-67"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                    <Smartphone className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                >
                  {t('modals.sendCode')}
                </button>
              </form>
            ) : step === 2 ? (
              <form onSubmit={handleVerify} className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">SMS kodni kiriting</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm outline-none text-center tracking-widest text-lg"
                    placeholder="0000"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                >
                  Tasdiqlash
                </button>
                <div className="mt-4 rounded-lg border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/20 p-4">
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
                    Eslatma: Birinchi brondan oldin sizdan OneID/MyGov orqali shaxsingizni tasdiqlash so'raladi.
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="mx-auto h-16 w-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Shaxsni tasdiqlash</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  O'zbekiston qonunchiligiga muvofiq, xavfsizlikni ta'minlash va elektron vaucher rasmiylashtirish uchun OneID (Yagona identifikatsiya tizimi) orqali shaxsingizni tasdiqlashingiz so'raladi.
                </p>
                
                <button
                  onClick={handleOneIDVerify}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition-colors mt-4"
                >
                  OneID orqali tasdiqlash
                </button>
                
                <button
                  onClick={() => {
                    const userData = { 
                      name: 'O\'zbekiston Fuqarosi', 
                      phone: `+998 ${phone}`, 
                      email: null,
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80', 
                      isVerified: false 
                    };
                    setUser(userData);
                    localStorage.setItem('visitca_user', JSON.stringify(userData));
                    onClose();
                    setStep(1);
                  }}
                  className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline mt-4 inline-block"
                >
                  Keyinroq tasdiqlash
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
             <form onSubmit={handleEmailLogin} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('auth.fullName') || "To'liq ism (F.I.Sh.)"}</label>
                    <div className="relative rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                      <input
                        type="text"
                        className="block w-full border-0 p-0 text-neutral-900 dark:text-white bg-transparent placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-0 sm:text-sm outline-none"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                      <User className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('auth.email')}</label>
                  <div className="relative rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                    <input
                      type="email"
                      className="block w-full border-0 p-0 text-neutral-900 dark:text-white bg-transparent placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-0 sm:text-sm outline-none"
                      placeholder="tourist@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                >
                  {isSignUp ? t('auth.signup') : t('auth.loginBtn')}
                </button>
             </form>

             <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white dark:bg-neutral-900 px-6 text-neutral-500 dark:text-neutral-400">{t('auth.or')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200 transition-colors">
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="#4285F4"
                    />
                  </svg>
                  <span className="text-sm">Google</span>
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2AABEE"/>
                    <path d="M5.44198 11.5173L16.2731 7.33758C16.7761 7.15286 17.218 7.45892 17.0601 8.01633L15.176 16.8904C15.0298 17.5458 14.6374 17.708 14.0924 17.4019L11.0967 15.1951L9.65152 16.5866C9.4916 16.7465 9.35824 16.8799 9.06456 16.8799L9.2798 13.8217L14.845 8.78857C15.0872 8.57288 14.7925 8.45266 14.4715 8.66835L7.58554 13.0033L4.62241 12.076C3.97811 11.8745 3.96541 11.4326 4.75713 11.1216L5.44198 11.5173Z" fill="white"/>
                  </svg>
                  <span className="text-sm">Telegram</span>
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                {isSignUp ? (
                  <>
                    {t('auth.haveAccount') || "Hisobingiz bormi?"}{' '}
                    <button type="button" onClick={() => setIsSignUp(false)} className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                      {t('auth.loginBtn')}
                    </button>
                  </>
                ) : (
                  <>
                    {t('auth.noAccount') || "Hisobingiz yo'qmi?"}{' '}
                    <button type="button" onClick={() => setIsSignUp(true)} className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                      {t('auth.signup')}
                    </button>
                  </>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
