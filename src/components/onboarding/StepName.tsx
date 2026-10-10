import type { UseFormReturn } from 'react-hook-form';
import type { OnboardingValues } from '@/lib/validators/onboardingSchema';

export function StepName({ form }: { form: UseFormReturn<OnboardingValues> }) {
  const error = form.formState.errors.name?.message;
  return (
    <div className="onboarding-field-step">
      <label className="field-label" htmlFor="name">
        ¿Cómo te llamas?
      </label>
      <input
        id="name"
        className={`form-input ${error ? 'input-error' : ''}`}
        placeholder="Tu nombre"
        autoComplete="given-name"
        autoFocus
        maxLength={30}
        {...form.register('name')}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
