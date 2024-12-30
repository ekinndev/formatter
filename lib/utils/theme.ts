export type TTheme = 'light' | 'dark';

export const getSystemTheme = (): TTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const toggleTheme = (currentTheme: TTheme): TTheme => {
  return currentTheme === 'light' ? 'dark' : 'light';
};

export const applyTheme = (theme: TTheme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);

  // Store the theme preference
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
};
