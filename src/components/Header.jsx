import React, { useState } from 'react';
import { Globe, User as UserIcon, ChevronDown, LogOut, Bell, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'success', title: "Bron tasdiqlandi", desc: "Samarqand sayohatiga joyingiz kafolatlandi.", time: "2 soat oldin", read: false },
  { id: 2, type: 'reminder', title: "Safarga 24 soat qoldi!", desc: "Ertaga soat 08:00 da uchrashamiz. Kechikmang.", time: "1 kun oldin", read: false },
  { id: 3, type: 'message', title: "Yangi xabar", desc: "Gid Alisher Vohidov sizga javob yozdi.", time: "Kecha", read: true },
  { id: 4, type: 'price_drop', title: "Narx pasaydi", desc: "Sevimlilardagi 'Ichan Qal'a' turiga 15% chegirma.", time: "3 kun oldin", read: true },
];

export default function Header({ onLoginClick, onLogoClick, onNavClick }) {
  const { language, setLanguage, currency, setCurrency, user, setUser } = useAppContext();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { closeAllPopovers(); onLogoClick && onLogoClick(); }}>
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center">
            <embed src="/Visitca_Trip_logo_final.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit" type="application/pdf" className="h-full w-full pointer-events-none bg-transparent" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">Visitca Trip</span>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('seo'); }} className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 hidden md:block">
            SEO Sahifa
          </button>
          
          <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('partners'); }} className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 hidden md:block">
            Hamkorlarga
          </button>

          <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('favorites'); }} className="text-neutral-500 hover:text-red-500 transition-colors hidden sm:block">
            <Heart className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => { const state = notifOpen; closeAllPopovers(); setNotifOpen(!state); }}
              className="text-neutral-500 hover:text-neutral-900 transition-colors relative mt-1"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-3 sm:w-96 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                  <h3 className="text-sm font-bold text-neutral-900">Bildirishnomalar</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                      Barchasini o'qildi qilish
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-neutral-500">Hech qanday bildirishnoma yo'q</div>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 flex gap-3 hover:bg-neutral-50 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-blue-50/30'}`}>
                          <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 mb-0.5">{notif.title}</p>
                            <p className="text-xs text-neutral-600 leading-snug">{notif.desc}</p>
                            <p className="text-[10px] text-neutral-400 mt-2">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden h-5 w-px bg-neutral-200 sm:block"></div>

          {/* Language Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { const state = langOpen; closeAllPopovers(); setLangOpen(!state); }}
              className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-emerald-600 transition-colors"
            >
              <span>{language}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {languages.map((l) => (
                    <button key={l} onClick={() => { setLanguage(l); setLangOpen(false); }} className={`block w-full px-4 py-2 text-left text-sm ${l === language ? 'bg-emerald-50 text-emerald-600' : 'text-neutral-700 hover:bg-neutral-100'}`}>{l}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { const state = currOpen; closeAllPopovers(); setCurrOpen(!state); }}
              className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-emerald-600 transition-colors"
            >
              <span>{currency}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {currOpen && (
              <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {currencies.map((c) => (
                    <button key={c} onClick={() => { setCurrency(c); setCurrOpen(false); }} className={`block w-full px-4 py-2 text-left text-sm ${c === currency ? 'bg-emerald-50 text-emerald-600' : 'text-neutral-700 hover:bg-neutral-100'}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => { const state = profileOpen; closeAllPopovers(); setProfileOpen(!state); }}
                className="flex items-center gap-2 rounded-full border border-neutral-200 p-1 pr-3 hover:shadow-md transition-shadow"
              >
                <img src={user.avatar} alt="User avatar" className="h-7 w-7 rounded-full object-cover" />
                <span className="text-sm font-medium text-neutral-700 hidden lg:block">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>
              
              {profileOpen && (
                <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-2 sm:w-64 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">{user.phone || user.email}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('profile'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-bold text-neutral-900 hover:bg-neutral-50 border-b border-neutral-100 mb-1">
                      Mening profilim
                    </button>
                    <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('mytrips'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Mening safarlarim
                    </button>
                    <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('chat'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Xabarlar (Chat)
                    </button>
                    <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('custom'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Men uchun tur
                    </button>
                    <button onClick={() => { closeAllPopovers(); onNavClick && onNavClick('support'); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Qo'llab-quvvatlash
                    </button>
                    <button onClick={() => { setUser(null); setProfileOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-neutral-100 mt-1">
                      <LogOut className="h-4 w-4" /> Chiqish
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <UserIcon className="h-4 w-4" />
              Kirish
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
