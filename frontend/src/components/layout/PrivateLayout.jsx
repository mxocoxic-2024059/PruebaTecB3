import { createElement, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckSquare2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Tags,
  X,
} from 'lucide-react';
import Brand from '../ui/Brand';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const futureItems = [
  { label: 'Tablero', icon: LayoutDashboard },
  { label: 'Calendario', icon: CalendarDays },
  { label: 'Etiquetas', icon: Tags },
  { label: 'Configuración avanzada', icon: Settings },
];

export default function PrivateLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true, state: { message: 'Sesión cerrada correctamente.' } });
  }

  return (
    <div className="app-shell">
      <button className={`sidebar-backdrop ${menuOpen ? 'is-visible' : ''}`} type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        <div className="sidebar__brand-row">
          <Brand />
          <button className="icon-button sidebar__close" type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><X size={22} /></button>
        </div>
        <nav className="sidebar__nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}><Home size={21} /><span>Inicio</span></NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}><CheckSquare2 size={21} /><span>Mis tareas</span></NavLink>
          <div className="nav-divider" />
          {futureItems.map(({ label, icon: Icon }) => (
            <div className="nav-item nav-item--disabled" key={label} aria-disabled="true">
              {createElement(Icon, { size: 21 })}<span>{label}</span><small>Próximamente</small>
            </div>
          ))}
        </nav>
        <div className="sidebar__profile">
          <div className="avatar" aria-hidden="true">{user?.nombre?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div className="sidebar__profile-copy"><strong>{user?.nombre}</strong><span>{user?.correo}</span></div>
        </div>
        <button className="nav-item nav-item--logout" type="button" onClick={handleLogout}><LogOut size={21} /><span>Cerrar sesión</span></button>
      </aside>

      <header className="topbar">
        <div className="topbar__mobile-brand">
          <button className="icon-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Menu size={23} /></button>
          <Brand />
        </div>
        <div className="topbar__actions">
          <ThemeToggle />
          <div className="topbar__user"><strong>{user?.nombre}</strong><span>{user?.correo}</span></div>
          <div className="avatar" aria-hidden="true">{user?.nombre?.charAt(0)?.toUpperCase() || 'U'}</div>
        </div>
      </header>

      <main className="main-content"><Outlet /></main>

      <nav className="bottom-nav" aria-label="Navegación móvil">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'is-active' : ''}><Home size={21} /><span>Inicio</span></NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'is-active' : ''}><CheckSquare2 size={21} /><span>Tareas</span></NavLink>
        <button type="button" disabled aria-label="Tablero, próximamente"><LayoutDashboard size={21} /><span>Tablero</span></button>
        <button type="button" onClick={() => setMenuOpen(true)}><Menu size={21} /><span>Más</span></button>
      </nav>
    </div>
  );
}
