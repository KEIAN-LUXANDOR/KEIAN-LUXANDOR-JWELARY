import FilterGroup from '@/components/filters/FilterGroup';
import { PRICE_BANDS } from '../utils/productHelpers';

interface ProductFiltersProps {
  metalOptions: string[];
  metals: string[];
  prices: string[];
  onToggleMetal: (metal: string) => void;
  onTogglePrice: (bandId: string) => void;
  onClear: () => void;
  /** Hide the metal group on single-metal pages (e.g. /diamond-gold). */
  showMetal?: boolean;
}

export default function ProductFilters({ metalOptions, metals, prices, onToggleMetal, onTogglePrice, onClear, showMetal = true }: ProductFiltersProps) {
  const activeCount = metals.length + prices.length;
  return (
    <aside className="plp__filters" aria-label="Filters">
      {showMetal && (
        <FilterGroup legend="Metal" options={metalOptions.map((m) => ({ value: m, label: m }))} selected={metals} onToggle={onToggleMetal} />
      )}
      <FilterGroup legend="Price" options={PRICE_BANDS.map((b) => ({ value: b.id, label: b.label }))} selected={prices} onToggle={onTogglePrice} />
      {activeCount > 0 && (
        <button className="link-underline" onClick={onClear}>
          Clear all
        </button>
      )}
    </aside>
  );
}
