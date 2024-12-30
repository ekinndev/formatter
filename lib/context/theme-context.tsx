'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TTheme, applyTheme, getSystemTheme } from '../utils/theme';

interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<IThemeContext>({
  theme: 'light',
  toggleTheme: () => null,
  mounted: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<TTheme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as TTheme;
      return savedTheme || getSystemTheme();
    }
    return 'light';
  });

  // Apply the theme class on mount and theme change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Handle initial client-side setup
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleToggleTheme, mounted }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
