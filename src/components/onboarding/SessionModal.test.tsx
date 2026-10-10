import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionModal } from './SessionModal';
import { useSessionStore } from '@/stores/sessionStore';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

function renderOnboarding() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <SessionModal open hasProfiles={false} profiles={[]} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  useSessionStore.setState({ profiles: {}, currentProfileId: null, hasHydrated: true });
});

describe('SessionModal', () => {
  it('blocks progress until the onboarding form is valid', async () => {
    renderOnboarding();
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(await screen.findByText('Escribe al menos 2 letras.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Elige tu compañero' })).not.toBeInTheDocument();
  });

  it('collects details, offers an avatar, and creates an age-based profile', async () => {
    renderOnboarding();
    fireEvent.change(screen.getByLabelText('¿Cómo te llamas?'), { target: { value: 'Luna' } });
    fireEvent.change(screen.getByLabelText('¿Cuántos años tienes?'), { target: { value: '14' } });
    fireEvent.change(screen.getByLabelText('¿Cómo conociste CodeQuest?'), {
      target: { value: 'Profesor' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(await screen.findByRole('heading', { name: 'Elige tu compañero' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: '🤖' }));
    fireEvent.click(screen.getByRole('button', { name: /a empezar/i }));
    const state = useSessionStore.getState();
    const profile = state.currentProfileId ? state.profiles[state.currentProfileId] : undefined;
    expect(profile?.name).toBe('Luna');
    expect(profile?.ageGroup).toBe('12-14');
    expect(profile?.avatar).toBe('🤖');
    expect(profile?.tourCompleted).toBe(false);
  });
});
