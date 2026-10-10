import { useWatch, type UseFormReturn } from 'react-hook-form';
import { AGE_GROUPS } from '@/lib/constants';
import type { OnboardingValues } from '@/lib/validators/onboardingSchema';

export function StepAge({ form }: { form: UseFormReturn<OnboardingValues> }) {
  const selectedAge = useWatch({ control: form.control, name: 'age' }) ?? 10;
  const error = form.formState.errors.age?.message;
  const ageLabel =
    AGE_GROUPS.find((group) => selectedAge >= group.min && selectedAge <= group.max)?.label ??
    '6–17 años';
  const isChild = selectedAge <= 11;
  return (
    <div className="form-row">
      <div className="field-group">
        <label className="field-label" htmlFor="age">
          ¿Cuántos años tienes?
        </label>
        <div className="age-input-wrap">
          <input
            id="age"
            className={`form-input ${error ? 'input-error' : ''}`}
            type="number"
            min={6}
            max={17}
            step={1}
            inputMode="numeric"
            {...form.register('age', { valueAsNumber: true })}
          />
          <span>años</span>
        </div>
        {error && <span className="field-error">{error}</span>}
        <span className="field-help">
          Retos pensados para {isChild ? 'explorar jugando' : 'crear cosas reales'}.
        </span>
      </div>
      <div className="age-preview">
        <span>{isChild ? '🌈' : '🚀'}</span>
        <strong>{ageLabel}</strong>
        <small>{isChild ? 'Modo explorador' : 'Modo creador'}</small>
      </div>
    </div>
  );
}
