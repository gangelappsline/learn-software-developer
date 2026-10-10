import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Flame, Sparkles, Trophy, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useSessionStore } from '@/stores/sessionStore';
import { Button, Modal } from '@/components/ui';

const tourSteps = [
  {
    emoji: '🗺️',
    title: 'Tu mapa de aventuras',
    copy: 'En Misiones encontrarás retos cortitos, pistas y proyectos para tu edad.',
    icon: <Sparkles size={18} />,
  },
  {
    emoji: '⚡',
    title: 'Cada reto te hace crecer',
    copy: 'Gana XP, sube de nivel y guarda tus monedas. Aquí no hay vidas que perder.',
    icon: <Trophy size={18} />,
  },
  {
    emoji: '🔥',
    title: 'Vuelve cuando quieras',
    copy: 'Tu racha celebra la constancia, no la perfección. Aprender a tu ritmo también cuenta.',
    icon: <Flame size={18} />,
  },
];

export function TourOverlay({ open }: { open: boolean }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const setTourCompleted = useSessionStore((state) => state.setTourCompleted);
  const finish = () => {
    setTourCompleted(true);
    navigate('/dashboard', { replace: true });
    void confetti({
      particleCount: 120,
      spread: 88,
      origin: { y: 0.72 },
      colors: ['#7968e7', '#4dcbb5', '#ffb86b', '#ff7f98'],
    });
  };
  const content = tourSteps[step]!;
  return (
    <Modal open={open} label="Tour de CodeQuest" blocking className="tour-modal">
      <div className="tour-orbit">
        <span>{content.emoji}</span>
        <i />
        <b />
      </div>
      <div className="tour-step-counter">
        {step + 1} / {tourSteps.length}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="tour-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <span className="eyebrow">UNA VISITA RÁPIDA</span>
          <h2>{content.title}</h2>
          <p>{content.copy}</p>
        </motion.div>
      </AnimatePresence>
      <div className="tour-progress">
        <span style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }} />
      </div>
      <div className="tour-actions">
        {step > 0 ? (
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => setStep((current) => current - 1)}
            type="button"
          >
            Atrás
          </Button>
        ) : (
          <span />
        )}
        {step < tourSteps.length - 1 ? (
          <Button
            icon={<ArrowRight size={16} />}
            onClick={() => setStep((current) => current + 1)}
            type="button"
          >
            Siguiente
          </Button>
        ) : (
          <Button icon={<Sparkles size={16} />} onClick={finish} type="button">
            ¡Vamos!
          </Button>
        )}
      </div>
      <button type="button" className="tour-skip" onClick={finish}>
        <X size={13} /> Saltar y empezar
      </button>
    </Modal>
  );
}
