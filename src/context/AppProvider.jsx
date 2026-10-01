import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'uz';
  }); 
  const currency = 'UZS';
  const setCurrency = () => {};
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('visitca_user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      if (parsed) {
        if (typeof parsed.avatar_url === 'string' && parsed.avatar_url.startsWith('blob:')) delete parsed.avatar_url;
        if (typeof parsed.avatar === 'string' && parsed.avatar.startsWith('blob:')) delete parsed.avatar;
        if (typeof parsed.avatarUrl === 'string' && parsed.avatarUrl.startsWith('blob:')) delete parsed.avatarUrl;
      }
      return parsed;
    } catch (e) {
      console.warn("Failed to parse visitca_user from localStorage", e);
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (user) {
      try {
        const cleanUser = { ...user };
        if (typeof cleanUser.avatar_url === 'string' && cleanUser.avatar_url.startsWith('blob:')) delete cleanUser.avatar_url;
        if (typeof cleanUser.avatar === 'string' && cleanUser.avatar.startsWith('blob:')) delete cleanUser.avatar;
        if (typeof cleanUser.avatarUrl === 'string' && cleanUser.avatarUrl.startsWith('blob:')) delete cleanUser.avatarUrl;
        localStorage.setItem('visitca_user', JSON.stringify(cleanUser));
      } catch (e) {
        console.warn("Failed to save visitca_user to localStorage", e);
      }
    } else {
      localStorage.removeItem('visitca_user');
    }
  }, [user]);

  useEffect(() => {
    const checkTimeAndApplyTheme = () => {
      // Get current UTC time, then convert to UTC+5 (Tashkent)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const tashkentTime = new Date(utc + (3600000 * 5));
      const hours = tashkentTime.getHours();
      
      // Light mode between 07:01 (approx 7) and 18:59 (approx < 19)
      const isDark = (hours < 7 || hours >= 19);

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    checkTimeAndApplyTheme();
    // Check every minute
    const interval = setInterval(checkTimeAndApplyTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  const t = (path, fallback) => {
    if (!path) return fallback || '';
    const lang = (language || 'uz').toLowerCase();
    const currentDict = translations[lang] || translations['uz'];
    const uzDict = translations['uz'];

    // 1. Try dot notation lookup in current language dict
    const keys = path.split('.');
    let result = currentDict;
    let found = true;
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        found = false;
        break;
      }
    }
    if (found && typeof result === 'string') return result;

    // 2. Try looking in home or nav sub-objects if flat key passed
    if (currentDict.home && currentDict.home[path] !== undefined) return currentDict.home[path];
    if (currentDict.nav && currentDict.nav[path] !== undefined) return currentDict.nav[path];

    // 3. Fallback to Uzbek language dict if current lang missed it
    let uzResult = uzDict;
    let uzFound = true;
    for (const key of keys) {
      if (uzResult && uzResult[key] !== undefined) {
        uzResult = uzResult[key];
      } else {
        uzFound = false;
        break;
      }
    }
    if (uzFound && typeof uzResult === 'string') return uzResult;
    if (uzDict.home && uzDict.home[path] !== undefined) return uzDict.home[path];
    if (uzDict.nav && uzDict.nav[path] !== undefined) return uzDict.nav[path];

    // 4. Return explicit fallback parameter if provided, otherwise path
    return fallback || path;
  };

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    user,
    setUser,
    t,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
