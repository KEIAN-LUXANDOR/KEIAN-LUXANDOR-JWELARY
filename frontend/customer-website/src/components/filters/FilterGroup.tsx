// A titled group of checkboxes, e.g. "Metal" or "Price".
interface Option {
  value: string;
  label: string;
}

interface FilterGroupProps {
  legend: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
}

export default function FilterGroup({ legend, options, selected, onToggle }: FilterGroupProps) {
  return (
    <fieldset>
      <legend className="eyebrow">{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className="check">
          <input type="checkbox" checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
