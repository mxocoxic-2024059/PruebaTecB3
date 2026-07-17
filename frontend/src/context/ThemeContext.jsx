import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getInitialTheme, persistTheme } from '../utils/theme';

const ThemeContext = createContext(null);

function initialTheme() {
  return getInitialTheme(
    localStorage,
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    persistTheme(theme, localStorage);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe utilizarse dentro de ThemeProvider');
  return context;
}
