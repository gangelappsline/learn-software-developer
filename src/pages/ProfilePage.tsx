import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useShallow } from 'zustand/react/shallow';
import {
  BookOpenCheck,
  Check,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Volume2,
  VolumeX,
  Accessibility,
  UserRoundPlus,
} from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useUIStore } from '@/stores/uiStore';
import { languages } from '@/data/languages';
import { AGE_GROUPS } from '@/lib/constants';
import { Badge, Button, Card } from '@/components/ui';
import { AVATARS } from '@/lib/constants';
import { XPBar } from '@/components/gamification';

export default function ProfilePage() {
  const navigate = useNavigate();
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const profiles = useSessionStore(useShallow((state) => Object.values(state.profiles)));
  const selectProfile = useSessionStore((state) => state.selectProfile);
  const signOut = useSessionStore((state) => state.signOut);
  const setPreferredLanguage = useSessionStore((state) => state.setPreferredLanguage);
  const setAvatar = useSessionStore((state) => state.setAvatar);
  const soundEnabled = useUIStore((state) => state.soundEnabled);
  const dyslexiaFont = useUIStore((state) => state.dyslexiaFont);
  const setSoundEnabled = useUIStore((state) => state.setSoundEnabled);
  const setDyslexiaFont = useUIStore((state) => state.setDyslexiaFont);
  const ageLabel = AGE_GROUPS.find((group) => group.id === profile?.ageGroup)?.label ?? '—';
  if (!profile) return null;
  const changeProfile = () => {
    signOut();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="profile-page">
      <section className="page-intro profile-intro">
        <div>
          <div className="intro-icon intro-icon-purple">
            <BookOpenCheck size={20} />
          </div>
          <span className="section-kicker">TU ESPACIO SEGURO</span>
          <h2>Tu perfil de creador</h2>
          <p>Todo tu progreso se guarda aquí, en este dispositivo, solo para ti.</p>
        </div>
      </section>
      <div className="profile-layout-grid">
        <div className="profile-main-column">
          <Card className="profile-identity-card">
            <div className="profile-avatar-large">{profile.avatar}</div>
            <div className="profile-identity-copy">
              <span className="section-kicker">
                NIVEL {profile.level} · {ageLabel}
              </span>
              <h2>{profile.name}</h2>
              <p>
                Miembro explorador desde{' '}
                {new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(
                  new Date(profile.createdAt),
                )}
              </p>
              <div className="profile-identity-badges">
                <Badge tone="purple">{profile.completedMissions.length} misiones</Badge>
                <Badge tone="mint">{profile.badges.length} insignias</Badge>
                <Badge tone="orange">🔥 {profile.streak} días</Badge>
              </div>
            </div>
            <span className="profile-identity-sparkle">✦</span>
          </Card>
          <Card className="profile-avatar-customizer">
            <div className="profile-card-heading">
              <div>
                <span className="section-kicker">CAMBIA CUANDO QUIERAS</span>
                <h3>Elige tu compañero</h3>
                <p>Un avatar que te acompañe en tus misiones.</p>
              </div>
            </div>
            <div className="profile-avatar-options">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  className={`profile-avatar-option ${profile.avatar === avatar ? 'profile-avatar-option-selected' : ''}`}
                  onClick={() => setAvatar(avatar)}
                  aria-label={`Elegir avatar ${avatar}`}
                  aria-pressed={profile.avatar === avatar}
                >
                  {avatar}
                  {profile.avatar === avatar && <Check size={12} />}
                </button>
              ))}
            </div>
          </Card>
          <Card className="profile-progress-card">
            <div className="profile-card-heading">
              <div>
                <span className="section-kicker">TU PROGRESO</span>
                <h3>Creciendo misión a misión</h3>
              </div>
              <strong className="profile-xp-total">
                {profile.xp.toLocaleString('es')} <small>XP</small>
              </strong>
            </div>
            <XPBar xp={profile.xp} level={profile.level} />
          </Card>
          <Card className="profile-languages-card">
            <div className="profile-card-heading">
              <div>
                <span className="section-kicker">TUS PREFERENCIAS</span>
                <h3>Lenguajes favoritos</h3>
                <p>Elige las rutas que quieres ver primero.</p>
              </div>
            </div>
            <div className="profile-language-list">
              {languages.map((language) => {
                const selected = profile.preferredLanguages.includes(language.id);
                return (
                  <button
                    key={language.id}
                    type="button"
                    className={`profile-language-toggle ${selected ? 'profile-language-selected' : ''}`}
                    onClick={() => setPreferredLanguage(language.id)}
                    aria-pressed={selected}
                  >
                    <span>{language.emoji}</span>
                    <span>{language.name}</span>
                    {selected && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          </Card>
          <Card className="profile-settings-card">
            <div className="profile-card-heading">
              <div>
                <span className="section-kicker">A TU MANERA</span>
                <h3>Accesibilidad y ambiente</h3>
                <p>Pequeñas opciones para sentirte cómodo aprendiendo.</p>
              </div>
            </div>
            <label className="setting-toggle-row">
              <span className="setting-icon">
                {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </span>
              <span className="setting-copy">
                <strong>Efectos de sonido</strong>
                <small>Sonido opcional para algunas celebraciones</small>
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(event) => setSoundEnabled(event.target.checked)}
              />
              <span className="toggle-visual" />
            </label>
            <label className="setting-toggle-row">
              <span className="setting-icon">
                <Accessibility size={18} />
              </span>
              <span className="setting-copy">
                <strong>Fuente amigable con dislexia</strong>
                <small>Más espacio entre letras y líneas</small>
              </span>
              <input
                type="checkbox"
                checked={dyslexiaFont}
                onChange={(event) => setDyslexiaFont(event.target.checked)}
              />
              <span className="toggle-visual" />
            </label>
          </Card>
        </div>
        <aside className="profile-side-column">
          <Card className="privacy-card">
            <span className="privacy-shield">
              <ShieldCheck size={21} />
            </span>
            <span className="section-kicker">PRIVACIDAD PRIMERO</span>
            <h3>Tu aventura es tuya.</h3>
            <p>
              CodeQuest guarda tu nombre, progreso y borradores de código en el almacenamiento local
              de este dispositivo. No hay cuentas públicas.
            </p>
            <div className="privacy-card-foot">
              <span className="online-indicator" /> Datos guardados en este dispositivo
            </div>
          </Card>
          <Card className="multi-profile-card">
            <div className="profile-card-heading">
              <div>
                <span className="section-kicker">PERFILES LOCALES</span>
                <h3>¿Quién más juega?</h3>
              </div>
              <span className="profile-count-pill">{profiles.length}</span>
            </div>
            <p className="multi-profile-description">
              Cada hermano o compañero tiene progreso independiente.
            </p>
            <div className="other-profiles-list">
              {profiles
                .filter((item) => item.id !== profile.id)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="other-profile-row"
                    onClick={() => {
                      selectProfile(item.id);
                      navigate('/dashboard', { replace: true });
                    }}
                  >
                    <span className="other-profile-avatar">{item.avatar}</span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        Nivel {item.level} · {item.age} años
                      </small>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<UserRoundPlus size={15} />}
              onClick={changeProfile}
              type="button"
            >
              Añadir / cambiar perfil
            </Button>
          </Card>
          <Button
            variant="danger"
            className="signout-button"
            icon={<LogOut size={17} />}
            onClick={changeProfile}
            type="button"
          >
            Cerrar sesión / Cambiar usuario
          </Button>
          <p className="signout-note">El progreso de todos los perfiles se conserva.</p>
        </aside>
      </div>
      <motion.div className="profile-footer-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span>💡</span> Un buen programador también sabe cuándo hacer una pausa. ¡Vuelve cuando
        quieras!
      </motion.div>
    </div>
  );
}
