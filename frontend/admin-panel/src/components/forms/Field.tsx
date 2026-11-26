import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  full?: boolean;
}

/** Label + control + hint / error, used by every form field. */
export function FieldWrapper({ id, label, error, hint, full, children }: FieldProps & { children: ReactNode }) {
  return (
    <div className={`field ${full ? 'field--full' : ''} ${error ? 'field--error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {children}
      {error ? (
        <span className="field__error" id={`${id}-error`}>
          {error}
        </span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string) => (error ? `${id}-error` : undefined);

export function TextField({ id, label, error, hint, full, ...input }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldWrapper id={id} label={label} error={error} hint={hint} full={full}>
      <input id={id} className="input" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error)} {...input} />
    </FieldWrapper>
  );
}

export function NumberField({
  id,
  label,
  error,
  hint,
  full,
  value,
  onValueChange,
  ...input
}: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & { value: number | null; onValueChange: (value: number | null) => void }) {
  return (
    <FieldWrapper id={id} label={label} error={error} hint={hint} full={full}>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        className="input"
        value={value ?? ''}
        onChange={(e) => onValueChange(e.target.value === '' ? null : Number(e.target.value))}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error)}
        {...input}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({ id, label, error, hint, full, ...input }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldWrapper id={id} label={label} error={error} hint={hint} full={full}>
      <textarea id={id} className="input input--textarea" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error)} {...input} />
    </FieldWrapper>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  full,
  options,
  ...select
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <FieldWrapper id={id} label={label} error={error} hint={hint} full={full}>
      <select id={id} className="input" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error)} {...select}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
