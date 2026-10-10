import { NavLink, useLocation } from 'react-router-dom';
import { Award, BookOpenCheck, Compass, Home, Languages, Menu, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const navigation: { label: string; to: string; icon: LucideIcon; end?: boolean }[] = [
  { label: 'Inicio', to: '/dashboard', icon: Home },
  { label: 'Misiones', to: '/missions', icon: Compass },
  { label: 'Lenguajes', to: '/languages', icon: Languages },
  { label: 'Insignias', to: '/achievements', icon: Award },
  { label: 'Clasificación', to: '/leaderboard', icon: Trophy },
];

export function Sidebar({
  avatar,
  name,
}: {
  avatar?: string | undefined;
  name?: string | undefined;
}) {
  const location = useLocation();
  const isMobileNavOpen = useUIStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  return (
    <>
      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Abrir menú"
        onClick={() => setMobileNavOpen(!isMobileNavOpen)}
      >
        <Menu size={20} />
      </button>
      {isMobileNavOpen && (
        <button
          type="button"
          className="mobile-nav-scrim"
          aria-label="Cerrar menú"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside className={`app-sidebar ${isMobileNavOpen ? 'sidebar-open' : ''}`}>
        <NavLink to="/dashboard" className="brand-lockup" onClick={() => setMobileNavOpen(false)}>
          <span className="brand-mark">✦</span>
          <span className="brand-text">
            CODEQUEST<small>KIDS</small>
          </span>
        </NavLink>
        <div className="sidebar-label">TU ESPACIO</div>
        <nav className="side-nav" aria-label="Navegación principal">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              <Icon size={19} strokeWidth={1.9} />
              <span>{label}</span>
              {label === 'Misiones' && <span className="nav-count">30</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-quest-card">
          <div className="sidebar-quest-stars">✦ ✦ ✦</div>
          <strong>Un paso a la vez</strong>
          <p>La curiosidad es tu mejor superpoder.</p>
        </div>
        <NavLink
          to="/profile"
          onClick={() => setMobileNavOpen(false)}
          className={`sidebar-profile ${location.pathname === '/profile' ? 'sidebar-profile-active' : ''}`}
        >
          <span className="sidebar-avatar">{avatar ?? '✨'}</span>
          <span className="sidebar-profile-copy">
            <strong>{name ?? 'Tu perfil'}</strong>
            <small>Ver perfil</small>
          </span>
          <BookOpenCheck size={16} className="sidebar-profile-icon" />
        </NavLink>
        <div className="sidebar-footnote">
          <span className="online-indicator" /> Tu progreso, siempre tuyo
        </div>
      </aside>
    </>
  );
}
