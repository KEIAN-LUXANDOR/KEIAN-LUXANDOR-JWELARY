// Small form-validation helpers shared by every form.
export const isEmail = (value: string): boolean => /^\S+@\S+\.\S+$/.test(value.trim());
export const isBlank = (value: string | null | undefined): boolean => !value || value.trim().length === 0;

/** Field name → error message. An empty object means the form is valid. */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export const hasErrors = <T,>(errors: FormErrors<T>): boolean => Object.values(errors).some(Boolean);
