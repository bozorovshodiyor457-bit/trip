import React from 'react';
import { Home, Search, Heart, Briefcase, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAppContext();

  const navItems = [
    { path: '/', icon: <Home className="h-6 w-6" />, label: t('nav.home') || 'Bosh sahifa' },
    { path: '/search', icon: <Search className="h-6 w-6" />, label: t('nav.search') || 'Qidiruv' },
    { path: '/favorites', icon: <Heart className="h-6 w-6" />, label: t('nav.favorites') || 'Sevimlilar' },
    { path: '/my-trips', icon: <Briefcase className="h-6 w-6" />, label: t('nav.myTrips') || 'Safarlarim' },
    { path: '/profile', icon: <User className="h-6 w-6" />, label: t('nav.profile') || 'Profil' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-emerald-600 dark:text-emerald-500' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
