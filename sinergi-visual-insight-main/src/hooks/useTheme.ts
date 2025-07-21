import { useState, useEffect } from 'react';

export type ThemeType = 'dark-black' | 'dark-red' | 'dark-purple' | 'dark-red-purple' | 'dark-blue';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>('dark-black');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return { theme, changeTheme };
};