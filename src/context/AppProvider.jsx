import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('UZ'); // 'UZ', 'RU', 'EN'
  const [currency, setCurrency] = useState('UZS'); // 'UZS', 'USD'
  const [user, setUser] = useState(null); // null if not logged in
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto'); // 'light', 'dark', 'auto'

  useEffect(() => {
    const checkTimeAndApplyTheme = () => {
      // Get current UTC time, then convert to UTC+5 (Tashkent)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const tashkentTime = new Date(utc + (3600000 * 5));
      const hours = tashkentTime.getHours();
      
      let isDark = false;
      
      if (theme === 'auto') {
        // Light mode between 07:01 and 16:59
        if (hours >= 7 && hours < 17) {
          isDark = false;
        } else {
          isDark = true;
        }
      } else {
        isDark = theme === 'dark';
      }

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
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    user,
    setUser,
    theme,
    changeTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
