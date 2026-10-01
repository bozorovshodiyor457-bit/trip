import React, { useState } from 'react';
import { Globe, User as UserIcon, ChevronDown, LogOut, Bell, Heart, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'success', title: "Bron tasdiqlandi", desc: "Samarqand sayohatiga joyingiz kafolatlandi.", time: "2 soat oldin", read: false },
  { id: 2, type: 'reminder', title: "Safarga 24 soat qoldi!", desc: "Ertaga soat 08:00 da uchrashamiz. Kechikmang.", time: "1 kun oldin", read: false },
  { id: 3, type: 'message', title: "Yangi xabar", desc: "Gid Alisher Vohidov sizga javob yozdi.", time: "Kecha", read: true },
  { id: 4, type: 'price_drop', title: "Narx pasaydi", desc: "Sevimlilardagi 'Ichan Qal'a' turiga 15% chegirma.", time: "3 kun oldin", read: true },
];

export default function Header({ onLoginClick }) {
  const navigate = useNavigate();
  const { language, setLanguage, currency, setCurrency, user, setUser, t } = useAppContext();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const languages = ['UZ', 'RU', 'EN'];
  const currencies = ['UZS', 'USD'];

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const closeAllPopovers = () => {
    setLangOpen(false);
    setCurrOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-neutral-900 dark:text-white p-1 -ml-1">
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { closeAllPopovers(); navigate('/'); }}>
            <img src="/triplogo.jpg" alt="Visitca Trip Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-md" />
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Visitca Trip</span>
          </div>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          <button onClick={() => { closeAllPopovers(); navigate('/seo/samarqand'); }} className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hidden md:block transition-colors">
            {t('nav.seo')}
          </button>
          
          <button onClick={() => { closeAllPopovers(); navigate('/partners'); }} className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hidden md:block transition-colors">
            {t('nav.partners')}
          </button>
          
          <button onClick={() => { closeAllPopovers(); navigate('/status'); }} className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hidden lg:block transition-colors">
            {t('nav.b2b')}
          </button>

          <button onClick={() => { closeAllPopovers(); navigate('/favorites'); }} className="text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 transition-colors hidden sm:block">
            <Heart className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => { const state = notifOpen; closeAllPopovers(); setNotifOpen(!state); }}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors relative mt-1"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-neutral-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-3 sm:w-96 origin-top-right rounded-2xl bg-white dark:bg-neutral-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{t('nav.notifications')}</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                      {t('nav.markAllRead')}
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">{t('noNotif')}</div>
                  ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 flex gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-blue-50/30 dark:bg-blue-900/20'}`}>
                          <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-transparent' : 'bg-blue-500 dark:bg-blue-400'}`}></div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">{notif.title}</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">{notif.desc}</p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden h-5 w-px bg-neutral-200 dark:bg-neutral-700 sm:block"></div>

          {/* Language Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { const state = langOpen; closeAllPopovers(); setLangOpen(!state); }}
              className="flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <span>{language}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
                <div className="py-1">
                  {languages.map((l) => (
                    <button key={l} onClick={() => { setLanguage(l); setLangOpen(false); }} className={`block w-full px-4 py-2 text-left text-sm ${l === language ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>{l}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { const state = currOpen; closeAllPopovers(); setCurrOpen(!state); }}
              className="flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <span>{currency}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {currOpen && (
              <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
                <div className="py-1">
                  {currencies.map((c) => (
                    <button key={c} onClick={() => { setCurrency(c); setCurrOpen(false); }} className={`block w-full px-4 py-2 text-left text-sm ${c === currency ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => { const state = profileOpen; closeAllPopovers(); setProfileOpen(!state); }}
                className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 p-1 pr-3 hover:shadow-md dark:hover:border-neutral-600 transition-all"
              >
                <img src={user.avatar} alt="User avatar" className="h-7 w-7 rounded-full object-cover" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hidden lg:block">{user.name || user.email || 'Foydalanuvchi'}</span>
                <ChevronDown className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
              </button>
              
              {profileOpen && (
                <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-2 sm:w-64 origin-top-right rounded-xl bg-white dark:bg-neutral-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user.name || user.email || 'Foydalanuvchi'}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{user.phone || user.email || ''}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { closeAllPopovers(); navigate('/profile'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-bold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-700 mb-1">
                      {t('nav.profile')}
                    </button>
                    <button onClick={() => { closeAllPopovers(); navigate('/my-trips'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      {t('nav.myTrips')}
                    </button>
                    <button onClick={() => { closeAllPopovers(); navigate('/chat'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      {t('nav.chat')}
                    </button>
                    <button onClick={() => { closeAllPopovers(); navigate('/custom-tour'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      {t('nav.customTour')}
                    </button>
                    <button onClick={() => { closeAllPopovers(); navigate('/support'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      {t('nav.support')}
                    </button>
                    <button onClick={() => { setUser(null); localStorage.removeItem('visitca_user'); setProfileOpen(false); navigate('/'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-neutral-700 border-t border-neutral-100 dark:border-neutral-700 mt-1">
                      <LogOut className="h-4 w-4" /> {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <UserIcon className="h-4 w-4" />
              {t('nav.login')}
            </button>
          )}

        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex w-full max-w-xs flex-col bg-white dark:bg-neutral-900 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xl font-bold text-neutral-900 dark:text-white">Menyu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">{t('nav.language')}</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map(l => (
                    <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${l === language ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">{t('nav.currency')}</label>
                <div className="flex flex-wrap gap-2">
                  {currencies.map(c => (
                    <button key={c} onClick={() => setCurrency(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${c === currency ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2 space-y-1 mt-2">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/seo/samarqand'); }} className="block w-full text-left px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                {t('nav.seo')}
              </button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/partners'); }} className="block w-full text-left px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                {t('nav.partners')}
              </button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/status'); }} className="block w-full text-left px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                {t('nav.b2b')}
              </button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/favorites'); }} className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                {t('nav.favorites')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
