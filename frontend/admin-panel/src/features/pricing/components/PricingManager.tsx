'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import MetalSwatch from '@/components/common/MetalSwatch';
import Button from '@/components/buttons/Button';
import DataTable, { type Column } from '@/components/tables/DataTable';
import TableToolbar from '@/components/tables/TableToolbar';
import FilterSelect from '@/components/forms/FilterSelect';
import { NumberField } from '@/components/forms/Field';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import useResource from '@/hooks/useResource';
import useAsync from '@/hooks/useAsync';
import { useToast } from '@/lib/providers/ToastProvider';
import { METALS } from '@/lib/constants';
import { productService } from '@/features/products/services/productService';
import { categoryService } from '@/features/categories/services/categoryService';
import { getSettings, saveSettings } from '@/features/settings/services/settingsService';
import type { MetalRate, Product } from '@/types/models';
import { formatCurrency, formatCurrencyExact, formatDateTime } from '@/utils/format';
import { metalRateService } from '../services/pricingService';
import { adjustPrice, rateFor, suggestedPrice } from '../utils/pricing';

function RateRow({ rate, onSave }: { rate: MetalRate; onSave: (value: number) => Promise<void> }) {
  const [value, setValue] = useState<number | null>(rate.ratePerGram);
  const [busy, setBusy] = useState(false);
  const dirty = value !== rate.ratePerGram && value != null && value > 0;
  return (
    <li className="list-row">
      <div>
        <MetalSwatch metal={rate.metal} />
        <div className="cell-sub">Updated {formatDateTime(rate.updatedAt)}</div>
      </div>
      <span className="row-actions" style={{ alignItems: 'center', gap: 8 }}>
        <span className="muted">$</span>
        <input
          className="inline-input num"
          type="number"
          min={0}
          step="0.01"
          value={value ?? ''}
          aria-label={`${rate.metal} price per gram`}
          onChange={(e) => setValue(e.target.value === '' ? null : Number(e.target.value))}
        />
        <span className="muted">/ g</span>
        <Button
          size="sm"
          disabled={!dirty}
          loading={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onSave(value!);
            } finally {
              setBusy(false);
            }
          }}
        >
          Save
        </Button>
      </span>
    </li>
  );
}

/** /pricing — metal rates, making charge, and product prices. */
export default function PricingManager() {
  const { items: rates, update: updateRate } = useResource(metalRateService);
  const { items: products, loading, error, update: updateProduct } = useResource(productService);
  const { items: categories } = useResource(categoryService);
  const [settingsVersion, setSettingsVersion] = useState(0);
  const { data: settings } = useAsync(`settings-${settingsVersion}`, getSettings);
  const toast = useToast();

  const [making, setMaking] = useState<number | null>(null);
  const makingValue = making ?? settings?.makingChargePercent ?? 0;
  const [metal, setMetal] = useState('');
  const [category, setCategory] = useState('');
  const [percent, setPercent] = useState<number | null>(5);
  const [confirm, setConfirm] = useState(false);

  const rows = useMemo(() => products.filter((p) => (!metal || p.metal === metal) && (!category || p.category === category)), [products, metal, category]);
  const suggestion = (p: Product) => suggestedPrice(p.weightGrams, rateFor(rates, p.metal), makingValue);

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortValue: (p) => p.name,
      render: (p) => (
        <div>
          <div className="cell-title">{p.name}</div>
          <div className="cell-sub">
            {p.sku} · {p.weightGrams} g
          </div>
        </div>
      ),
    },
    { key: 'metal', header: 'Metal', sortValue: (p) => p.metal, render: (p) => <MetalSwatch metal={p.metal} /> },
    { key: 'metalValue', header: 'Metal value', align: 'right', sortValue: (p) => p.weightGrams * rateFor(rates, p.metal), render: (p) => <span className="num muted">{formatCurrency(p.weightGrams * rateFor(rates, p.metal))}</span> },
    { key: 'suggested', header: 'Metal + making', align: 'right', sortValue: suggestion, render: (p) => <span className="num muted">{formatCurrency(suggestion(p))}</span> },
    { key: 'price', header: 'Selling price', align: 'right', sortValue: (p) => p.price, render: (p) => <strong className="num">{formatCurrency(p.price)}</strong> },
  ];

  const target = metal || category ? `${rows.length} products shown` : `all ${rows.length} products`;

  return (
    <>
      <PageHeader title="Pricing" description="Today’s metal rates, making charge and bulk price changes." />
      <div className="grid-2">
        <Card title="Metal rates (USD per gram)">
          <ul className="list-plain">
            {METALS.map((m) => {
              const rate = rates.find((r) => r.metal === m.value);
              return rate ? (
                <RateRow
                  key={`${rate.id}-${rate.ratePerGram}`}
                  rate={rate}
                  onSave={async (value) => {
                    await updateRate(rate.id, { ratePerGram: value, updatedAt: new Date().toISOString() });
                    toast(`${m.label} rate saved: ${formatCurrencyExact(value)} / g`);
                  }}
                />
              ) : null;
            })}
          </ul>
        </Card>
        <Card title="Making charge">
          <div className="form-stack" style={{ gap: 14 }}>
            <p className="muted">Added on top of the metal value to suggest prices in the product form.</p>
            <NumberField id="making" label="Making charge (%)" value={makingValue} onValueChange={setMaking} min={0} step="0.5" />
            <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
              <Button
                disabled={!settings || making === null || making === settings.makingChargePercent}
                onClick={async () => {
                  if (!settings || making === null) return;
                  await saveSettings({ ...settings, makingChargePercent: making });
                  setMaking(null);
                  setSettingsVersion((v) => v + 1);
                  toast('Making charge saved');
                }}
              >
                Save making charge
              </Button>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--c-line)', width: '100%' }} />
            <p className="field__label">Change prices in bulk</p>
            <p className="muted">Use the filters below the table to choose which products. Prices are rounded to end in 9.</p>
            <div className="form-actions" style={{ justifyContent: 'flex-start', alignItems: 'end' }}>
              <NumberField id="bulk" label="Change by (%)" value={percent} onValueChange={setPercent} step="1" hint="Use a minus number to lower prices" />
              <Button variant="secondary" disabled={!percent || rows.length === 0} onClick={() => setConfirm(true)}>
                Apply to {target}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <TableToolbar>
        <FilterSelect label="Metal" value={metal} onChange={setMetal} options={[{ value: '', label: 'All metals' }, ...METALS.map((m) => ({ value: m.value, label: m.label }))]} />
        <FilterSelect label="Category" value={category} onChange={setCategory} options={[{ value: '', label: 'All categories' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]} />
      </TableToolbar>
      <DataTable caption="Product prices" columns={columns} rows={rows} rowKey={(p) => p.id} loading={loading} error={error} pageSize={20} />

      <ConfirmDialog
        open={confirm}
        title="Change prices?"
        message={`${(percent ?? 0) > 0 ? 'Raise' : 'Lower'} the price of ${target} by ${Math.abs(percent ?? 0)}%.`}
        confirmLabel="Change prices"
        danger={false}
        onClose={() => setConfirm(false)}
        onConfirm={async () => {
          const now = new Date().toISOString();
          for (const p of rows) await updateProduct(p.id, { price: adjustPrice(p.price, percent ?? 0), updatedAt: now });
          toast(`${rows.length} prices updated`);
        }}
      />
    </>
  );
}
