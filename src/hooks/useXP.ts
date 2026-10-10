import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { Mission } from '@/types';
import { useSessionStore } from '@/stores/sessionStore';
import { useGamificationStore } from '@/stores/gamificationStore';
import { useUIStore } from '@/stores/uiStore';
import { badges } from '@/data/badges';

export function useXP() {
  const completeMission = useSessionStore((state) => state.completeMission);
  const setLastAward = useGamificationStore((state) => state.setLastAward);
  const soundEnabled = useUIStore((state) => state.soundEnabled);

  const playCelebrationSound = () => {
    if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext) return;
    try {
      const context = new window.AudioContext();
      [659, 784, 988].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const startAt = context.currentTime + index * 0.09;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.055, startAt + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.2);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + 0.21);
      });
      window.setTimeout(() => void context.close(), 600);
    } catch {
      // Algunos navegadores desactivan Web Audio; la animación sigue dando feedback.
    }
  };

  const awardMission = (mission: Mission) => {
    const award = completeMission(mission);
    if (!award) {
      toast.info('Esta misión ya está en tu colección. ¡Prueba otra!');
      return null;
    }
    setLastAward(award);
    playCelebrationSound();
    void confetti({
      particleCount: 90,
      spread: 72,
      origin: { y: 0.68 },
      colors: ['#7968e7', '#4dcbb5', '#ffb86b', '#ff7f98'],
    });
    toast.success(`¡Misión completada! +${award.xpEarned} XP y +${award.coinsEarned} CodeCoins`, {
      description: award.unlockedBadgeIds.length
        ? `Insignia nueva: ${badges.find((badge) => badge.id === award.unlockedBadgeIds[0])?.name ?? 'desbloqueada'}`
        : `Racha de ${award.streak} ${award.streak === 1 ? 'día' : 'días'}`,
    });
    return award;
  };

  return { awardMission };
}
