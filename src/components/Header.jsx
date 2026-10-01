import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, ChevronDown, LogOut, Bell, Heart, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import interactionService from '../services/interactionService';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'success', title: "Bron tasdiqlandi", desc: "Samarqand sayohatiga joyingiz kafolatlandi.", time: "2 soat oldin", read: false },
  { id: 2, type: 'reminder', title: "Safarga 24 soat qoldi!", desc: "Ertaga soat 08:00 da uchrashamiz. Kechikmang.", time: "1 kun oldin", read: false },
  { id: 3, type: 'message', title: "Yangi xabar", desc: "Gid Alisher Vohidov sizga javob yozdi.", time: "Kecha", read: true },
  { id: 4, type: 'price_drop', title: "Narx pasaydi", desc: "Sevimlilardagi 'Ichan Qal'a' turiga 15% chegirma.", time: "3 kun oldin", read: true },
];

export default function Header({ onLoginClick }) {
  const navigate = useNavigate();
  const { language, setLanguage, user, setUser, t } = useAppContext();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const langRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      try {
        const res = await interactionService.getNotifications();
        if (isMounted) {
          const list = res?.notifications || res?.data || (Array.isArray(res) ? res : []);
          setNotifications(list.length > 0 ? list : MOCK_NOTIFICATIONS);
        }
      } catch (err) {
        console.warn('Notifications fetch error fallback:', err);
      }
    }
    loadNotifications();
    return () => { isMounted = false; };
  }, [user]);

  const handleMarkAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await interactionService.markNotificationRead(id);
    } catch (err) {
      console.warn('Mark read API error:', err);
    }
  };

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const languages = ['UZ', 'RU', 'EN'];

  // Click Outside & Escape key listener for Popovers
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setNotifOpen(false);
        setLangOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const closeAllPopovers = () => {
    setLangOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        {/* Left Side: Logo only */}
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

        {/* Right Side: Main elements only (Language, Favorites, Notifications, Profile/Login) */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Language Selector */}
          <div className="relative hidden sm:block" ref={langRef}>
            <button
              onClick={() => { const state = langOpen; closeAllPopovers(); setLangOpen(!state); }}
              className="flex items-center gap-1 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span>{language}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
                <div className="py-1">
                  {languages.map((l) => (
                    <button 
                      key={l} 
                      onClick={() => { setLanguage(l); setLangOpen(false); }} 
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        l === language 
                          ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold' 
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => { const state = notifOpen; closeAllPopovers(); setNotifOpen(!state); }}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors relative p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Notifications"
              title="Bildirishnomalar"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-neutral-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-3 sm:w-96 origin-top-right rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden z-50 transition-all">
                <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900">
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
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 flex gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer ${
                            notif.read 
                              ? 'opacity-75 bg-white dark:bg-neutral-900' 
                              : 'bg-emerald-50/40 dark:bg-emerald-950/20'
                          }`}
                        >
                          <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-transparent' : 'bg-emerald-500 dark:bg-emerald-400'}`}></div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">{notif.title}</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-snug">{notif.desc}</p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Favorites (Heart) Icon */}
          <button 
            onClick={() => { closeAllPopovers(); navigate('/favorites'); }} 
            className="text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hidden sm:block"
            title="Sevimlilar"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
          </button>

          <div className="hidden h-5 w-px bg-neutral-200 dark:bg-neutral-700 sm:block"></div>

          {/* Profile / Login Button */}
          {user ? (
            <div className="relative flex items-center" ref={profileRef}>
              <button
                onClick={() => { const state = profileOpen; closeAllPopovers(); setProfileOpen(!state); }}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 p-1 pr-2 sm:pr-3 hover:shadow-md dark:hover:border-neutral-600 transition-all"
                aria-label="User menu"
              >
                <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} alt="User avatar" className="h-7 w-7 rounded-full object-cover" />
                <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-200 hidden md:block">{user.name || user.email || 'Foydalanuvchi'}</span>
                <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 dark:text-neutral-500" />
              </button>
              
              {profileOpen && (
                <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-2 sm:w-64 origin-top-right rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user.name || user.email || 'Foydalanuvchi'}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{user.phone || user.email || ''}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { closeAllPopovers(); navigate('/profile'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-bold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                      {t('nav.profile')}
                    </button>
                    <button onClick={() => { closeAllPopovers(); navigate('/my-trips'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      {t('nav.myTrips')}
                    </button>
                    <button onClick={() => { closeAllPopovers(); navigate('/custom-tour'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      {t('nav.customTour')}
                    </button>
                    <button onClick={() => { closeAllPopovers(); navigate('/support'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      {t('nav.support')}
                    </button>
                    <button onClick={() => { setUser(null); localStorage.removeItem('visitca_user'); setProfileOpen(false); navigate('/'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-800 mt-1">
                      <LogOut className="h-4 w-4" /> {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 rounded-lg sm:rounded-full bg-emerald-600 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{t('nav.login')}</span>
            </button>
          )}

        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
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

            <div className="p-2 space-y-1 mt-2">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/favorites'); }} className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                <Heart className="h-4 w-4 text-red-500" />
                <span>{t('nav.favorites')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

