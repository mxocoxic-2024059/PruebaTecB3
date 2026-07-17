import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}>
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
