import Icon from '@/components/common/Icon';

export default function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search' }: { value: string; onChange: (value: string) => void; placeholder?: string; label?: string }) {
  return (
    <label className="search-input">
      <Icon name="search" size={16} />
      <span className="visually-hidden">{label}</span>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}
