export const THEME_STORAGE_KEY = 'taskflow_theme';

export function getInitialTheme(storage, prefersDark = false) {
  const stored = storage?.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function persistTheme(theme, storage) {
  if (theme !== 'light' && theme !== 'dark') throw new Error('Tema no válido');
  storage?.setItem(THEME_STORAGE_KEY, theme);
}
