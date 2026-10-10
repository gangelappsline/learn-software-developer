import { describe, expect, it } from 'vitest';
import { onboardingSchema } from './onboardingSchema';

describe('onboardingSchema', () => {
  it('accepts a valid profile', () => {
    const result = onboardingSchema.safeParse({
      name: 'María José',
      age: 11,
      referralSource: 'Profesor',
    });
    expect(result.success).toBe(true);
  });

  it('rejects digits in names and ages outside the range', () => {
    expect(
      onboardingSchema.safeParse({ name: 'Alex7', age: 10, referralSource: 'Colegio' }).success,
    ).toBe(false);
    expect(
      onboardingSchema.safeParse({ name: 'Alex', age: 18, referralSource: 'Colegio' }).success,
    ).toBe(false);
  });

  it('requires a description when the referral source is Otro', () => {
    expect(
      onboardingSchema.safeParse({ name: 'Noa', age: 12, referralSource: 'Otro' }).success,
    ).toBe(false);
    expect(
      onboardingSchema.safeParse({
        name: 'Noa',
        age: 12,
        referralSource: 'Otro',
        referralOther: 'Mi profe',
      }).success,
    ).toBe(true);
  });
});
