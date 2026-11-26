'use client';

import { useState, type FormEvent } from 'react';
import PageHeader from '@/components/common/PageHeader';
import FormSection from '@/components/forms/FormSection';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Card from '@/components/common/Card';
import Button from '@/components/buttons/Button';
import { NumberField, TextField } from '@/components/forms/Field';
import Toggle from '@/components/forms/Toggle';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import useAsync from '@/hooks/useAsync';
import { useToast } from '@/lib/providers/ToastProvider';
import { useBackend } from '@/services/apiClient';
import type { StoreSettings } from '@/types/models';
import { hasErrors, isBlank, isEmail, type FormErrors } from '@/utils/validation';
import { getSettings, resetDemoData, saveSettings } from '../services/settingsService';

function Form({ initial }: { initial: StoreSettings }) {
  const [v, setV] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState<FormErrors<StoreSettings>>({});
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const toast = useToast();
  const set = <K extends keyof StoreSettings>(k: K, value: StoreSettings[K]) => setV((x) => ({ ...x, [k]: value }));
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FormErrors<StoreSettings> = {};
    if (isBlank(v.storeName)) errs.storeName = 'Enter the store name';
    if (!isEmail(v.supportEmail)) errs.supportEmail = 'Enter a valid email';
    if (v.taxPercent < 0 || v.taxPercent > 30) errs.taxPercent = 'Between 0 and 30';
    if (v.shippingFlat < 0) errs.shippingFlat = 'Can’t be negative';
    if (v.makingChargePercent < 0) errs.makingChargePercent = 'Can’t be negative';
    if (!/^[A-Z0-9-]{1,6}$/.test(v.orderPrefix)) errs.orderPrefix = '1–6 capital letters, numbers or dashes';
    setErrors(errs);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      const result = await saveSettings(v);
      setSaved(result);
      setV(result);
      toast('Settings saved');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-stack" onSubmit={submit} noValidate>
      <FormSection title="Store">
        <TextField id="s-name" label="Store name" value={v.storeName} onChange={(e) => set('storeName', e.target.value)} error={errors.storeName} />
        <TextField id="s-currency" label="Currency" value={v.currency} disabled hint="Prices are in US dollars" />
        <TextField id="s-email" label="Customer service email" type="email" value={v.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} error={errors.supportEmail} />
        <TextField id="s-phone" label="Customer service phone" value={v.supportPhone} onChange={(e) => set('supportPhone', e.target.value)} />
      </FormSection>
      <FormSection title="Orders, tax & shipping">
        <TextField id="s-prefix" label="Order number prefix" value={v.orderPrefix} onChange={(e) => set('orderPrefix', e.target.value.toUpperCase())} error={errors.orderPrefix} hint="e.g. KL- gives KL-10045" />
        <NumberField id="s-tax" label="Sales tax (%)" value={v.taxPercent} onValueChange={(x) => set('taxPercent', x ?? 0)} min={0} step="0.25" error={errors.taxPercent} />
        <NumberField id="s-ship" label="Shipping charge ($)" value={v.shippingFlat} onValueChange={(x) => set('shippingFlat', x ?? 0)} min={0} error={errors.shippingFlat} hint="0 = complimentary shipping" />
        <NumberField id="s-free" label="Free shipping over ($)" value={v.freeShippingThreshold} onValueChange={(x) => set('freeShippingThreshold', x ?? 0)} min={0} hint="0 = always free" />
      </FormSection>
      <FormSection title="Catalogue">
        <NumberField id="s-making" label="Making charge (%)" value={v.makingChargePercent} onValueChange={(x) => set('makingChargePercent', x ?? 0)} min={0} step="0.5" error={errors.makingChargePercent} hint="Used for suggested prices" />
        <NumberField id="s-low" label="Default low-stock alert" value={v.lowStockThreshold} onValueChange={(x) => set('lowStockThreshold', x ?? 0)} min={0} step="1" hint="For new products" />
      </FormSection>
      <FormSection title="Email me when…">
        <div className="field--full form-stack" style={{ gap: 14 }}>
          <Toggle checked={v.notifyNewOrder} onChange={(x) => set('notifyNewOrder', x)} label="A new order is placed" />
          <Toggle checked={v.notifyLowStock} onChange={(x) => set('notifyLowStock', x)} label="A product runs low on stock" />
          <Toggle checked={v.notifyNewReview} onChange={(x) => set('notifyNewReview', x)} label="A review is waiting for approval" />
        </div>
      </FormSection>
      <div className="form-actions">
        <Button variant="secondary" disabled={!dirty || busy} onClick={() => setV(saved)}>
          Undo changes
        </Button>
        <Button type="submit" disabled={!dirty} loading={busy}>
          Save settings
        </Button>
      </div>

      {!useBackend && (
        <Card title="Demo data">
          <div className="form-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="muted">The admin panel is using demo data saved in this browser. Resetting brings back the original products, orders and customers.</p>
            <Button variant="danger" icon="refresh" onClick={() => setConfirmReset(true)}>
              Reset demo data
            </Button>
          </div>
        </Card>
      )}
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="All changes you made in the admin panel on this browser will be lost."
        confirmLabel="Reset"
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData();
          window.location.reload();
        }}
      />
    </form>
  );
}

/** /settings */
export default function SettingsForm() {
  const { data, loading, error } = useAsync('settings', getSettings);
  return (
    <>
      <PageHeader title="Settings" description="Store details, tax, shipping and notifications." />
      {loading ? <Loading /> : error || !data ? <EmptyState icon="alert" title="Could not load settings" text={error ?? undefined} /> : <Form initial={data} />}
    </>
  );
}
