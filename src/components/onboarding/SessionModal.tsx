import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, LockKeyhole, Sparkles, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { onboardingSchema, type OnboardingValues } from '@/lib/validators/onboardingSchema';
import { AVATARS } from '@/lib/constants';
import { StepName } from './StepName';
import { StepAge } from './StepAge';
import { StepSource } from './StepSource';
import { AvatarPicker } from './AvatarPicker';
import { useSessionStore } from '@/stores/sessionStore';
import { Button, Modal } from '@/components/ui';
import type { UserProfile } from '@/types';

interface SessionModalProps {
  open: boolean;
  hasProfiles: boolean;
  profiles: UserProfile[];
}

export function SessionModal({ open, hasProfiles, profiles }: SessionModalProps) {
  const navigate = useNavigate();
  const createProfile = useSessionStore((state) => state.createProfile);
  const selectProfile = useSessionStore((state) => state.selectProfile);
  const [mode, setMode] = useState<'auto' | 'choose' | 'create'>('auto');
  const [step, setStep] = useState<1 | 2>(1);
  const [draft, setDraft] = useState<OnboardingValues | null>(null);
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: '', age: 10, referralOther: '' },
    mode: 'onTouched',
  });
  const isChoosingProfile = mode === 'choose' || (mode === 'auto' && hasProfiles);

  const startCreate = () => {
    form.reset({ name: '', age: 10, referralOther: '' });
    setDraft(null);
    setAvatar(AVATARS[0]);
    setStep(1);
    setMode('create');
  };

  const continueFromDetails = form.handleSubmit((values) => {
    setDraft(values);
    setStep(2);
  });

  const finishOnboarding = () => {
    if (!draft?.referralSource) return;
    createProfile({
      name: draft.name,
      age: draft.age,
      referralSource: draft.referralSource,
      ...(draft.referralOther ? { referralOther: draft.referralOther } : {}),
      avatar,
    });
    setDraft(null);
    setStep(1);
    setMode('choose');
    navigate('/dashboard', { replace: true });
    void confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#7968e7', '#4dcbb5', '#ffb86b'],
    });
    toast.success('¡Tu aventura empieza ahora!', {
      description: 'Tu perfil se guarda de forma privada en este dispositivo.',
    });
  };

  const continueProfile = (profile: UserProfile) => {
    selectProfile(profile.id);
    navigate('/dashboard', { replace: true });
    toast.success(`¡Bienvenido de vuelta, ${profile.name}!`);
  };

  return (
    <Modal open={open} label="Empezar en CodeQuest Kids" blocking className="onboarding-modal">
      <div className="onboarding-brand">
        <span className="brand-mark">✦</span>
        <span>
          CODEQUEST <b>KIDS</b>
        </span>
      </div>
      {isChoosingProfile ? (
        <div className="profile-choice">
          <span className="eyebrow">TU AVENTURA, A TU RITMO</span>
          <h1>¿Quién va a jugar hoy?</h1>
          <p className="modal-subtitle">
            Elige un perfil. Cada persona tiene su propio progreso en este dispositivo.
          </p>
          <div className="profile-choice-list">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className="profile-choice-card"
                onClick={() => continueProfile(profile)}
              >
                <span className="profile-choice-avatar">{profile.avatar}</span>
                <span className="profile-choice-copy">
                  <strong>{profile.name}</strong>
                  <small>
                    {profile.age} años · Nivel {profile.level}
                  </small>
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="lg"
            icon={<UserPlus size={18} />}
            onClick={startCreate}
            type="button"
          >
            Crear otro perfil
          </Button>
          <p className="privacy-note">
            <LockKeyhole size={14} /> Los perfiles y el progreso no salen de este dispositivo.
          </p>
        </div>
      ) : (
        <>
          <div className="onboarding-progress-row">
            <span className="eyebrow">PASO {step} DE 2</span>
            <div className="onboarding-steps" aria-label={`Paso ${step} de 2`}>
              <span className={step >= 1 ? 'step-active' : ''} />
              <span className={step >= 2 ? 'step-active' : ''} />
            </div>
          </div>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <h1>¡Hola, futuro creador!</h1>
                <p className="modal-subtitle">
                  Cuéntanos un poquito sobre ti para preparar retos a tu nivel.
                </p>
                <form className="onboarding-form" onSubmit={continueFromDetails} noValidate>
                  <StepName form={form} />
                  <StepAge form={form} />
                  <StepSource form={form} />
                  <Button
                    type="submit"
                    size="lg"
                    className="onboarding-submit"
                    icon={<ArrowRight size={18} />}
                  >
                    Continuar
                  </Button>
                  <p className="privacy-note">
                    <LockKeyhole size={14} /> Tu información se queda en este dispositivo.
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="avatar"
                className="avatar-step"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="avatar-preview-large">{avatar}</div>
                <h1>Elige tu compañero</h1>
                <p className="modal-subtitle">
                  Puedes cambiarlo cuando quieras. Elige el que te haga sonreír.
                </p>
                <AvatarPicker value={avatar} onChange={setAvatar} />
                <div className="avatar-step-actions">
                  <Button
                    variant="ghost"
                    icon={<ArrowLeft size={16} />}
                    onClick={() => setStep(1)}
                    type="button"
                  >
                    Atrás
                  </Button>
                  <Button
                    size="lg"
                    icon={<Sparkles size={17} />}
                    onClick={finishOnboarding}
                    type="button"
                  >
                    ¡A empezar!
                  </Button>
                </div>
                <p className="privacy-note">
                  <LockKeyhole size={14} /> Perfil privado · Sin anuncios · Siempre puedes cambiar
                  de usuario.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Modal>
  );
}
