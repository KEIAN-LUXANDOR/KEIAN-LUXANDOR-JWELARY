import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  full?: boolean;
}

const Wrapper = ({ id, label, error, full, children }: BaseProps & { children: ReactNode }) => (
  <div className={`field ${full ? 'field--full' : ''}`}>
    <label htmlFor={id}>{label}</label>
    {children}
    {error && (
      <span className="field-error" id={`${id}-error`}>
        {error}
      </span>
    )}
  </div>
);

/** Label + input + error message. */
export function TextField({ id, label, error, full, ...input }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper id={id} label={label} error={error} full={full}>
      <input id={id} className="input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...input} />
    </Wrapper>
  );
}

export function TextAreaField({ id, label, error, full, ...input }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper id={id} label={label} error={error} full={full}>
      <textarea id={id} className="input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...input} />
    </Wrapper>
  );
}

export function SelectField({
  id,
  label,
  error,
  full,
  options,
  ...select
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <Wrapper id={id} label={label} error={error} full={full}>
      <select id={id} className="input" {...select}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}
