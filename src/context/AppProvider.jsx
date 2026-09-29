import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('UZ'); // 'UZ', 'RU', 'EN'
  const [currency, setCurrency] = useState('UZS'); // 'UZS', 'USD'
  const [user, setUser] = useState(null); // null if not logged in

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    user,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
