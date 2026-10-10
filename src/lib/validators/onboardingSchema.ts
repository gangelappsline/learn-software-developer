import { z } from 'zod';

const referralOptions = [
  'Colegio',
  'Redes sociales',
  'Amigo o familiar',
  'YouTube',
  'Búsqueda Google',
  'Profesor',
  'Otro',
] as const;

export const onboardingSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Escribe al menos 2 letras.')
      .max(30, 'El nombre debe tener 30 caracteres o menos.')
      .regex(/^[\p{L}\p{M}][\p{L}\p{M} '-]*$/u, 'Usa letras, espacios, apóstrofes o guiones.'),
    age: z
      .number()
      .int('La edad debe ser un número entero.')
      .min(6, 'La edad mínima es 6.')
      .max(17, 'La edad máxima es 17.'),
    referralSource: z
      .enum(referralOptions, { error: 'Elige una opción para continuar.' })
      .optional(),
    referralOther: z.string().trim().max(80, 'Escribe 80 caracteres o menos.').optional(),
  })
  .superRefine((data, context) => {
    if (!data.referralSource) {
      context.addIssue({
        code: 'custom',
        path: ['referralSource'],
        message: 'Elige una opción para continuar.',
      });
    }
    if (data.referralSource === 'Otro' && !data.referralOther) {
      context.addIssue({
        code: 'custom',
        path: ['referralOther'],
        message: 'Cuéntanos brevemente dónde.',
      });
    }
  });

export type OnboardingValues = z.infer<typeof onboardingSchema>;
