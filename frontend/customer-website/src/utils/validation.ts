// Small form-validation helpers shared by every form on the site.
export const isEmail = (value: string): boolean => /^\S+@\S+\.\S+$/.test(value.trim());
export const isPhone = (value: string): boolean => /^[\d\s()+-]{7,}$/.test(value.trim());
export const isBlank = (value: string): boolean => value.trim().length === 0;

/** Field name → error message. An empty object means the form is valid. */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export const hasErrors = <T,>(errors: FormErrors<T>): boolean => Object.keys(errors).length > 0;
