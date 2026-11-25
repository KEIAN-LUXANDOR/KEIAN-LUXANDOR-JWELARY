import { isBlank, isEmail, type FormErrors } from '@/utils/validation';
import type { LoginInput, RegisterInput } from '../types/authTypes';

export const MIN_PASSWORD = 8;

export const validateLogin = (v: LoginInput): FormErrors<LoginInput> => {
  const e: FormErrors<LoginInput> = {};
  if (!isEmail(v.email)) e.email = 'Enter a valid email';
  if (isBlank(v.password)) e.password = 'Enter your password';
  return e;
};

export const validateRegister = (v: RegisterInput & { confirm: string }): FormErrors<RegisterInput & { confirm: string }> => {
  const e: FormErrors<RegisterInput & { confirm: string }> = {};
  if (isBlank(v.firstName)) e.firstName = 'Required';
  if (isBlank(v.lastName)) e.lastName = 'Required';
  if (!isEmail(v.email)) e.email = 'Enter a valid email';
  if (v.password.length < MIN_PASSWORD) e.password = `Use at least ${MIN_PASSWORD} characters`;
  if (v.confirm !== v.password) e.confirm = 'Passwords do not match';
  return e;
};

/** Only allow redirects back into this site after login. */
export const safeNext = (next: string | null | undefined, fallback = '/profile'): string =>
  next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
