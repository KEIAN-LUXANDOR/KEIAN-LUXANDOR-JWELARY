'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Button from '@/components/buttons/Button';
import FormSection from '@/components/forms/FormSection';
import { NumberField, SelectField, TextAreaField, TextField } from '@/components/forms/Field';
import TagInput from '@/components/forms/TagInput';
import Card from '@/components/common/Card';
import useResource from '@/hooks/useResource';
import useAsync from '@/hooks/useAsync';
import { METALS, PRODUCT_STATUSES } from '@/lib/constants';
import { categoryService } from '@/features/categories/services/categoryService';
import { specificationService } from '@/features/specifications/services/specificationService';
import { metalRateService } from '@/features/pricing/services/pricingService';
import { rateFor, suggestedPrice } from '@/features/pricing/utils/pricing';
import { getSettings } from '@/features/settings/services/settingsService';
import type { Metal, ProductInput, ProductStatus, SpecificationGroup } from '@/types/models';
import { formatCurrency } from '@/utils/format';
import { hasErrors, type FormErrors } from '@/utils/validation';
import { isRingType, validateProduct } from '../utils/productUtils';

interface ProductFormProps {
  initial: ProductInput;
  existingSkus: string[];
  submitLabel: string;
  onSubmit: (values: ProductInput) => Promise<void>;
  onCancel: () => void;
  extraActions?: React.ReactNode;
}

const valuesOf = (groups: SpecificationGroup[], key: SpecificationGroup['key']) => groups.find((g) => g.key === key)?.values ?? [];
const withBlank = (values: string[], blank = '—') => [{ value: '', label: blank }, ...values.map((v) => ({ value: v, label: v }))];

/** Add / edit a product. Used by /products/add and /products/[id]. */
export default function ProductForm({ initial, existingSkus, submitLabel, onSubmit, onCancel, extraActions }: ProductFormProps) {
  const [values, setValues] = useState<ProductInput>(initial);
  const [errors, setErrors] = useState<FormErrors<ProductInput>>({});
  const [busy, setBusy] = useState(false);
  const { items: categories } = useResource(categoryService);
  const { items: specs } = useResource(specificationService);
  const { items: rates } = useResource(metalRateService);
  const { data: settings } = useAsync('settings', getSettings);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setValues((v) => ({ ...v, [key]: value }));
  const setSpec = <K extends keyof ProductInput['specs']>(key: K, value: ProductInput['specs'][K]) => setValues((v) => ({ ...v, specs: { ...v.specs, [key]: value } }));

  const suggestion = useMemo(
    () => (settings ? suggestedPrice(values.weightGrams, rateFor(rates, values.metal), settings.makingChargePercent) : 0),
    [values.weightGrams, values.metal, rates, settings],
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateProduct(values, existingSkus);
    setErrors(errs);
    if (hasErrors(errs)) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ ...values, name: values.name.trim(), sku: values.sku.trim().toUpperCase() });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-layout" onSubmit={submit} noValidate>
      <div className="form-stack">
        <FormSection title="Product details">
          <TextField id="name" label="Name" value={values.name} onChange={(e) => set('name', e.target.value)} error={errors.name} full />
          <TextField id="sku" label="Style # (SKU)" value={values.sku} onChange={(e) => set('sku', e.target.value)} error={errors.sku} hint="Must be unique, e.g. KL-RI-042" />
          <TextField id="type" label="Type" value={values.type} onChange={(e) => set('type', e.target.value)} error={errors.type} hint="Shown on the website, e.g. Ring, Stud Earrings" />
          <SelectField id="category" label="Category" value={values.category} onChange={(e) => set('category', e.target.value)} options={categories.map((c) => ({ value: c.slug, label: c.name }))} />
          <TextField id="badge" label="Badge (optional)" value={values.badge} onChange={(e) => set('badge', e.target.value)} hint="e.g. New, Bestseller" />
          <TextAreaField id="description" label="Description" value={values.description} onChange={(e) => set('description', e.target.value)} full />
        </FormSection>

        <FormSection title="Metal & price">
          <SelectField id="metal" label="Metal" value={values.metal} onChange={(e) => set('metal', e.target.value as Metal)} options={METALS.map((m) => ({ value: m.value, label: m.label }))} />
          <NumberField id="weight" label="Metal weight (grams)" value={values.weightGrams} onValueChange={(v) => set('weightGrams', v ?? 0)} min={0} step="0.1" error={errors.weightGrams} />
          <NumberField id="price" label="Price (USD)" value={values.price} onValueChange={(v) => set('price', v ?? 0)} min={0} error={errors.price} />
          <NumberField id="compareAt" label="Compare-at price (optional)" value={values.compareAtPrice} onValueChange={(v) => set('compareAtPrice', v)} min={0} error={errors.compareAtPrice} hint="Shown crossed out when the product is on sale" />
          {suggestion > 0 && (
            <p className="alert alert--info field--full">
              Suggested price from today’s {METALS.find((m) => m.value === values.metal)?.label} rate and {settings?.makingChargePercent}% making charge:{' '}
              <strong>{formatCurrency(suggestion)}</strong> (before stones).{' '}
              <button type="button" className="link" onClick={() => set('price', suggestion)}>
                Use this
              </button>
            </p>
          )}
        </FormSection>

        <FormSection title="Specifications" description="Lists come from the Specifications page.">
          <SelectField id="shape" label="Diamond shape" value={values.specs.diamondShape} onChange={(e) => setSpec('diamondShape', e.target.value)} options={withBlank(valuesOf(specs, 'diamondShape'), 'No diamond')} />
          <NumberField id="carat" label="Total carat weight" value={values.specs.caratWeight} onValueChange={(v) => setSpec('caratWeight', v)} min={0} step="0.01" />
          <SelectField id="color" label="Diamond color" value={values.specs.diamondColor} onChange={(e) => setSpec('diamondColor', e.target.value)} options={withBlank(valuesOf(specs, 'diamondColor'))} />
          <SelectField id="clarity" label="Diamond clarity" value={values.specs.diamondClarity} onChange={(e) => setSpec('diamondClarity', e.target.value)} options={withBlank(valuesOf(specs, 'diamondClarity'))} />
          {isRingType(values.type) && (
            <div className="field field--full">
              <span className="field__label">Ring sizes offered</span>
              <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                {valuesOf(specs, 'ringSize').map((size) => (
                  <label key={size} className="check">
                    <input
                      type="checkbox"
                      checked={values.specs.ringSizes.includes(size)}
                      onChange={(e) => setSpec('ringSizes', e.target.checked ? [...values.specs.ringSizes, size] : values.specs.ringSizes.filter((s) => s !== size))}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        <FormSection title="Photos & tags">
          <TagInput id="images" label="Photo addresses" values={values.images} onChange={(v) => set('images', v)} placeholder="/images/ring.webp or https://…" />
          <TagInput id="tags" label="Collections / tags" values={values.tags} onChange={(v) => set('tags', v)} placeholder="gifts, new-arrivals …" />
        </FormSection>
      </div>

      <div className="form-stack">
        <Card title="Status">
          <SelectField
            id="status"
            label="Visibility"
            value={values.status}
            onChange={(e) => set('status', e.target.value as ProductStatus)}
            options={PRODUCT_STATUSES.map((s) => ({ value: s, label: s === 'active' ? 'Active (on the website)' : s === 'draft' ? 'Draft (hidden)' : 'Archived' }))}
          />
        </Card>
        <Card title="Inventory">
          <div className="form-grid">
            <NumberField id="stock" label="In stock" value={values.stock} onValueChange={(v) => set('stock', v ?? 0)} min={0} step="1" error={errors.stock} />
            <NumberField id="lowStock" label="Low-stock alert at" value={values.lowStockThreshold} onValueChange={(v) => set('lowStockThreshold', v ?? 0)} min={0} step="1" />
          </div>
        </Card>
        <Card title="Preview">
          <div className="image-preview">{values.images[0] ? <img src={values.images[0]} alt={values.name || 'Product photo'} /> : 'No photo yet'}</div>
        </Card>
        <div className="form-actions">
          {extraActions}
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={busy}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
