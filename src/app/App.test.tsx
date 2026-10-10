import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { Providers } from './providers';
import { useSessionStore } from '@/stores/sessionStore';

describe('application session guard', () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({ profiles: {}, currentProfileId: null, hasHydrated: true });
  });

  it('shows the blocking onboarding dialog when no profile exists', async () => {
    render(
      <Providers>
        <App />
      </Providers>,
    );
    expect(
      await screen.findByRole('dialog', { name: 'Empezar en CodeQuest Kids' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '¡Hola, futuro creador!' })).toBeInTheDocument();
  });
});
