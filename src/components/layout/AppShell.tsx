import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SessionModal, TourOverlay } from '@/components/onboarding';
import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useSessionStore } from '@/stores/sessionStore';
import { useStreak } from '@/hooks/useStreak';
import { useUIStore } from '@/stores/uiStore';

export function AppShell() {
  const { ready, requiresOnboarding, hasProfiles, profile } = useSessionGuard();
  const profiles = useSessionStore(useShallow((state) => Object.values(state.profiles)));
  const { streak } = useStreak();
  const dyslexiaFont = useUIStore((state) => state.dyslexiaFont);
  const theme = profile && profile.age >= 12 ? 'teen' : 'kids';
  const initialSessionChecked = useRef(false);

  useEffect(() => {
    if (!ready || initialSessionChecked.current) return;
    initialSessionChecked.current = true;
    if (profile?.tourCompleted) {
      toast.success(`¡Bienvenido de vuelta, ${profile.name}!`, {
        description: 'Tu aventura sigue justo donde la dejaste.',
      });
    }
  }, [profile, ready]);

  if (!ready) {
    return (
      <div className="boot-screen">
        <span className="brand-mark">✦</span>
        <strong>Preparando tu aventura…</strong>
        <span className="boot-sparkle">✧</span>
      </div>
    );
  }

  return (
    <div
      className={`app-shell theme-${theme} ${dyslexiaFont ? 'font-dyslexia' : ''}`}
      data-theme={theme}
    >
      <Sidebar avatar={profile?.avatar} name={profile?.name} />
      <div className="app-main">
        <Navbar
          name={profile?.name}
          avatar={profile?.avatar}
          streak={streak}
          coins={profile?.coins ?? 0}
        />
        <motion.main
          className="page-content"
          key={profile?.id ?? 'guest'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <Outlet />
        </motion.main>
      </div>
      <SessionModal open={requiresOnboarding} hasProfiles={hasProfiles} profiles={profiles} />
      <TourOverlay open={Boolean(profile && !profile.tourCompleted)} />
    </div>
  );
}
