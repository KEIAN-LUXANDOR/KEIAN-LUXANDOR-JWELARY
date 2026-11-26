interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  /** Hide the label visually (e.g. inside a table row) but keep it for screen readers. */
  hideLabel?: boolean;
}

/** On / off switch. */
export default function Toggle({ checked, onChange, label, description, hideLabel }: ToggleProps) {
  return (
    <label className="toggle">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-checked={checked} />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <span className={hideLabel ? 'visually-hidden' : 'toggle__text'}>
        {label}
        {description && !hideLabel && <span className="toggle__desc">{description}</span>}
      </span>
    </label>
  );
}
