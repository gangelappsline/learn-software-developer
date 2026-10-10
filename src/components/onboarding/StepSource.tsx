import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { OnboardingValues } from '@/lib/validators/onboardingSchema';

export function StepSource({ form }: { form: UseFormReturn<OnboardingValues> }) {
  const referral = useWatch({ control: form.control, name: 'referralSource' });
  const sourceError = form.formState.errors.referralSource?.message;
  const otherError = form.formState.errors.referralOther?.message;
  return (
    <div className="onboarding-field-step">
      <label className="field-label" htmlFor="referralSource">
        ¿Cómo conociste CodeQuest?
      </label>
      <select
        id="referralSource"
        className={`form-input form-select ${sourceError ? 'input-error' : ''}`}
        defaultValue=""
        {...form.register('referralSource', { setValueAs: (value: string) => value || undefined })}
      >
        <option value="">Elige una opción…</option>
        <option>Colegio</option>
        <option>Redes sociales</option>
        <option>Amigo o familiar</option>
        <option>YouTube</option>
        <option>Búsqueda Google</option>
        <option>Profesor</option>
        <option>Otro</option>
      </select>
      {sourceError && <span className="field-error">{sourceError}</span>}
      {referral === 'Otro' && (
        <div className="conditional-field">
          <label className="field-label" htmlFor="referralOther">
            ¿Dónde nos encontraste?
          </label>
          <input
            id="referralOther"
            className={`form-input ${otherError ? 'input-error' : ''}`}
            placeholder="Cuéntanos brevemente"
            maxLength={80}
            {...form.register('referralOther')}
          />
          {otherError && <span className="field-error">{otherError}</span>}
        </div>
      )}
    </div>
  );
}
