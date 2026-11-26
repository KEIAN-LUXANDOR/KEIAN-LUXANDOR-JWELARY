'use client';

import { useState, type FormEvent } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/Badge';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import DataTable, { type Column } from '@/components/tables/DataTable';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { NumberField, SelectField, TextField } from '@/components/forms/Field';
import Toggle from '@/components/forms/Toggle';
import useResource from '@/hooks/useResource';
import useDisclosure from '@/hooks/useDisclosure';
import { useToast } from '@/lib/providers/ToastProvider';
import { couponStatus, discountLabel } from '@/features/offers/utils/offerUtils';
import type { Coupon, DiscountType } from '@/types/models';
import { formatCurrency, formatDate, fromDateInput, toDateInput } from '@/utils/format';
import { omitId } from '@/utils/object';
import { hasErrors, type FormErrors } from '@/utils/validation';
import { couponService } from '../services/couponService';
import { normalizeCode, validateCoupon, type CouponInput } from '../utils/couponUtils';

const blankCoupon = (): CouponInput => ({
  code: '',
  description: '',
  discountType: 'percent',
  value: 10,
  minOrder: 0,
  usageLimit: null,
  usedCount: 0,
  expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  active: true,
});

function CouponForm({ initial, takenCodes, onSave, onClose }: { initial: CouponInput; takenCodes: string[]; onSave: (c: CouponInput) => Promise<void>; onClose: () => void }) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<FormErrors<CouponInput>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof CouponInput>(k: K, value: CouponInput[K]) => setV((x) => ({ ...x, [k]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateCoupon(v, takenCodes);
    setErrors(errs);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      await onSave({ ...v, code: normalizeCode(v.code) });
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <TextField id="c-code" label="Code" value={v.code} onChange={(e) => set('code', e.target.value.toUpperCase())} error={errors.code} hint="What customers type at checkout" />
      <TextField id="c-desc" label="Description (for staff)" value={v.description} onChange={(e) => set('description', e.target.value)} />
      <SelectField id="c-type" label="Discount type" value={v.discountType} onChange={(e) => set('discountType', e.target.value as DiscountType)} options={[{ value: 'percent', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed amount ($)' }]} />
      <NumberField id="c-value" label={v.discountType === 'percent' ? 'Percent off' : 'Dollars off'} value={v.value} onValueChange={(x) => set('value', x ?? 0)} min={0} error={errors.value} />
      <NumberField id="c-min" label="Minimum order ($)" value={v.minOrder} onValueChange={(x) => set('minOrder', x ?? 0)} min={0} error={errors.minOrder} hint="0 = no minimum" />
      <NumberField id="c-limit" label="Usage limit" value={v.usageLimit} onValueChange={(x) => set('usageLimit', x)} min={1} step="1" error={errors.usageLimit} hint="Leave empty for no limit" />
      <TextField id="c-exp" label="Expires" type="date" value={toDateInput(v.expiresAt)} onChange={(e) => set('expiresAt', fromDateInput(e.target.value))} hint="Leave empty to never expire" />
      <div className="field" style={{ alignSelf: 'end' }}>
        <Toggle checked={v.active} onChange={(x) => set('active', x)} label="Active" />
      </div>
      <div className="form-actions field--full">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Save coupon
        </Button>
      </div>
    </form>
  );
}

/** /coupons — codes customers enter at checkout. */
export default function CouponManager() {
  const { items, loading, error, create, update, remove } = useResource(couponService);
  const modal = useDisclosure<Coupon>();
  const [toDelete, setToDelete] = useState<Coupon | null>(null);
  const toast = useToast();

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Code',
      sortValue: (c) => c.code,
      render: (c) => (
        <div>
          <code className="cell-title">{c.code}</code>
          <div className="cell-sub">{c.description}</div>
        </div>
      ),
    },
    { key: 'discount', header: 'Discount', sortValue: (c) => c.value, render: (c) => discountLabel(c.discountType, c.value) },
    { key: 'min', header: 'Min. order', align: 'right', sortValue: (c) => c.minOrder, render: (c) => (c.minOrder ? formatCurrency(c.minOrder) : '—') },
    { key: 'used', header: 'Used', align: 'right', sortValue: (c) => c.usedCount, render: (c) => <span className="num">{c.usageLimit ? `${c.usedCount} / ${c.usageLimit}` : c.usedCount}</span> },
    { key: 'expires', header: 'Expires', sortValue: (c) => c.expiresAt, render: (c) => (c.expiresAt ? formatDate(c.expiresAt) : 'Never') },
    { key: 'status', header: 'Status', sortValue: (c) => couponStatus(c), render: (c) => <StatusBadge status={couponStatus(c)} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c) => (
        <span className="row-actions">
          <IconButton icon="edit" label={`Edit ${c.code}`} onClick={() => modal.open(c)} />
          <IconButton icon="trash" label={`Delete ${c.code}`} tone="danger" onClick={() => setToDelete(c)} />
        </span>
      ),
    },
  ];

  const editing = modal.item;
  return (
    <>
      <PageHeader
        title="Coupons"
        description="Codes customers type at checkout."
        actions={
          <Button icon="plus" onClick={() => modal.open(null)}>
            Add coupon
          </Button>
        }
      />
      <DataTable caption="Coupons" columns={columns} rows={items} rowKey={(c) => c.id} loading={loading} error={error} emptyTitle="No coupons yet" />
      <Modal open={modal.isOpen} onClose={modal.close} title={editing ? `Edit ${editing.code}` : 'Add coupon'}>
        <CouponForm
          key={editing?.id ?? 'new'}
          initial={editing ? omitId(editing) : blankCoupon()}
          takenCodes={items.filter((c) => c.id !== editing?.id).map((c) => c.code)}
          onClose={modal.close}
          onSave={async (values) => {
            if (editing) await update(editing.id, values);
            else await create(values);
            toast(editing ? 'Coupon saved' : `Coupon ${values.code} added`);
          }}
        />
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete coupon?"
        message={`Customers will no longer be able to use ${toDelete?.code}.`}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          await remove(toDelete.id);
          toast('Coupon deleted');
        }}
      />
    </>
  );
}
