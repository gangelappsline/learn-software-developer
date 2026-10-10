import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, CircleUserRound, Settings2 } from 'lucide-react';
import { CoinCounter } from '@/components/gamification/CoinCounter';
import { StreakFlame } from '@/components/gamification/StreakFlame';
import { useSessionStore } from '@/stores/sessionStore';
import { Button } from '@/components/ui';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tu aventura',
  '/missions': 'Misiones',
  '/languages': 'Rutas de código',
  '/achievements': 'Tus insignias',
  '/leaderboard': 'Desafío de aula',
  '/profile': 'Tu perfil',
};

export function TopBar({
  name,
  avatar,
  streak,
  coins,
}: {
  name?: string | undefined;
  avatar?: string | undefined;
  streak: number;
  coins: number;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useSessionStore((state) => state.signOut);
  const title = pageTitles[location.pathname] ?? 'CodeQuest';
  const changeProfile = () => {
    signOut();
    navigate('/dashboard', { replace: true });
  };
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <span className="topbar-kicker">TU MUNDO DE CÓDIGO</span>
        <h1>{title}</h1>
      </div>
      <div className="topbar-tools">
        <StreakFlame streak={streak} compact />
        <CoinCounter coins={coins} compact />
        <span className="topbar-divider" />
        <div className="profile-dropdown-wrap">
          <Button
            variant="ghost"
            className="top-profile-button"
            onClick={() => navigate('/profile')}
            type="button"
            aria-label={`Abrir perfil de ${name ?? 'usuario'}`}
          >
            <span className="top-profile-avatar">{avatar ?? '✨'}</span>
            <span className="top-profile-name">{name ?? 'Perfil'}</span>
            <ChevronDown size={15} />
          </Button>
          <button type="button" className="top-change-profile" onClick={changeProfile}>
            <Settings2 size={15} /> Cambiar usuario
          </button>
        </div>
        <button
          className="top-profile-mobile"
          type="button"
          onClick={() => navigate('/profile')}
          aria-label="Abrir perfil"
        >
          <CircleUserRound size={21} />
        </button>
      </div>
    </header>
  );
}
