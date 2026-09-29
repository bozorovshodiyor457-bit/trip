import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'uz';
  }); 
  const [currency, setCurrency] = useState('UZS'); // 'UZS', 'USD'
  const [user, setUser] = useState(null); // null if not logged in

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

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

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language?.toLowerCase()] || translations['uz'];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return path; // Fallback to key
      }
    }
    return result;
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
