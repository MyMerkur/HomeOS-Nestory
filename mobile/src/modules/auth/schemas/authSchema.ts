import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'En az 2 karakter').max(80),
  email: z.string().trim().toLowerCase().email('Geçerli bir e-posta girin'),
  password: z.string().min(8, 'En az 8 karakter'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Geçerli bir e-posta girin'),
  password: z.string().min(1, 'Şifre gerekli'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
