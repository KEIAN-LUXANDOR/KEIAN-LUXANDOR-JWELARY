// Compact "Sort by" dropdown.
interface SortSelectProps<K extends string> {
  value: K;
  options: { value: K; label: string }[];
  onChange: (value: K) => void;
  className?: string;
}

export default function SortSelect<K extends string>({ value, options, onChange, className = 'plp__sort' }: SortSelectProps<K>) {
  return (
    <label className={className}>
      <span className="visually-hidden">Sort by</span>
      <select value={value} onChange={(e) => onChange(e.target.value as K)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            Sort: {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
