'use client';

import { useMemo, useState, type FormEvent } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/Badge';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import DataTable, { type Column } from '@/components/tables/DataTable';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { NumberField, SelectField, TextAreaField, TextField } from '@/components/forms/Field';
import Toggle from '@/components/forms/Toggle';
import useResource from '@/hooks/useResource';
import useDisclosure from '@/hooks/useDisclosure';
import { useToast } from '@/lib/providers/ToastProvider';
import { categoryService } from '@/features/categories/services/categoryService';
import type { DiscountType, Offer } from '@/types/models';
import { formatDate, fromDateInput, toDateInput } from '@/utils/format';
import { hasErrors, isBlank, type FormErrors } from '@/utils/validation';
import { omitId } from '@/utils/object';
import { offerService } from '../services/offerService';
import { discountLabel, METAL_OPTIONS, offerStatus, offerTarget } from '../utils/offerUtils';

type OfferInput = Omit<Offer, 'id'>;

const blankOffer = (): OfferInput => {
  const start = new Date();
  const end = new Date(Date.now() + 14 * 86400000);
  return { name: '', description: '', discountType: 'percent', value: 10, appliesTo: 'all', target: '', startsAt: start.toISOString(), endsAt: end.toISOString(), active: true };
};

function OfferForm({ initial, categories, onSave, onClose }: { initial: OfferInput; categories: { value: string; label: string }[]; onSave: (o: OfferInput) => Promise<void>; onClose: () => void }) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<FormErrors<OfferInput>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof OfferInput>(k: K, value: OfferInput[K]) => setV((x) => ({ ...x, [k]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FormErrors<OfferInput> = {};
    if (isBlank(v.name)) errs.name = 'Enter a name';
    if (!(v.value > 0)) errs.value = 'Must be more than 0';
    else if (v.discountType === 'percent' && v.value > 90) errs.value = 'A percentage offer can be at most 90%';
    if (v.appliesTo !== 'all' && !v.target) errs.target = 'Choose what the offer applies to';
    if (!v.startsAt) errs.startsAt = 'Choose a start date';
    if (!v.endsAt) errs.endsAt = 'Choose an end date';
    else if (v.startsAt && v.endsAt < v.startsAt) errs.endsAt = 'Must be after the start date';
    setErrors(errs);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      await onSave(v);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <TextField id="o-name" label="Name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} full />
      <TextAreaField id="o-desc" label="Description (shown on the website)" value={v.description} onChange={(e) => set('description', e.target.value)} full />
      <SelectField id="o-type" label="Discount type" value={v.discountType} onChange={(e) => set('discountType', e.target.value as DiscountType)} options={[{ value: 'percent', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed amount ($)' }]} />
      <NumberField id="o-value" label={v.discountType === 'percent' ? 'Percent off' : 'Dollars off'} value={v.value} onValueChange={(x) => set('value', x ?? 0)} min={0} error={errors.value} />
      <SelectField
        id="o-applies"
        label="Applies to"
        value={v.appliesTo}
        onChange={(e) => setV((x) => ({ ...x, appliesTo: e.target.value as OfferInput['appliesTo'], target: '' }))}
        options={[{ value: 'all', label: 'Everything' }, { value: 'category', label: 'One category' }, { value: 'metal', label: 'One metal' }]}
      />
      {v.appliesTo !== 'all' ? (
        <SelectField id="o-target" label={v.appliesTo === 'metal' ? 'Metal' : 'Category'} value={v.target} onChange={(e) => set('target', e.target.value)} error={errors.target} options={[{ value: '', label: 'Choose…' }, ...(v.appliesTo === 'metal' ? METAL_OPTIONS : categories)]} />
      ) : (
        <div />
      )}
      <TextField id="o-start" label="Starts" type="date" value={toDateInput(v.startsAt)} onChange={(e) => set('startsAt', fromDateInput(e.target.value))} error={errors.startsAt} />
      <TextField id="o-end" label="Ends" type="date" value={toDateInput(v.endsAt)} onChange={(e) => set('endsAt', fromDateInput(e.target.value))} error={errors.endsAt} />
      <div className="field--full">
        <Toggle checked={v.active} onChange={(x) => set('active', x)} label="Active" description="Switch off to pause the offer without deleting it." />
      </div>
      <div className="form-actions field--full">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Save offer
        </Button>
      </div>
    </form>
  );
}

/** /offers — automatic discounts on products. */
export default function OfferManager() {
  const { items, loading, error, create, update, remove } = useResource(offerService);
  const { items: categories } = useResource(categoryService);
  const modal = useDisclosure<Offer>();
  const [toDelete, setToDelete] = useState<Offer | null>(null);
  const toast = useToast();
  const catName = useMemo(() => {
    const map = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
    return (slug: string) => map[slug] ?? slug;
  }, [categories]);

  const columns: Column<Offer>[] = [
    {
      key: 'name',
      header: 'Offer',
      sortValue: (o) => o.name,
      render: (o) => (
        <div className="wrap">
          <div className="cell-title">{o.name}</div>
          <div className="cell-sub">{o.description}</div>
        </div>
      ),
    },
    { key: 'discount', header: 'Discount', sortValue: (o) => o.value, render: (o) => discountLabel(o.discountType, o.value) },
    { key: 'target', header: 'Applies to', render: (o) => offerTarget(o, catName) },
    { key: 'dates', header: 'Dates', sortValue: (o) => o.startsAt, render: (o) => `${formatDate(o.startsAt)} – ${formatDate(o.endsAt)}` },
    { key: 'status', header: 'Status', sortValue: (o) => offerStatus(o), render: (o) => <StatusBadge status={offerStatus(o)} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (o) => (
        <span className="row-actions">
          <IconButton icon="edit" label={`Edit ${o.name}`} onClick={() => modal.open(o)} />
          <IconButton icon="trash" label={`Delete ${o.name}`} tone="danger" onClick={() => setToDelete(o)} />
        </span>
      ),
    },
  ];

  const editing = modal.item;
  return (
    <>
      <PageHeader
        title="Offers"
        description="Automatic discounts — no code needed. For codes customers type in, use Coupons."
        actions={
          <Button icon="plus" onClick={() => modal.open(null)}>
            Add offer
          </Button>
        }
      />
      <DataTable caption="Offers" columns={columns} rows={items} rowKey={(o) => o.id} loading={loading} error={error} emptyTitle="No offers yet" />
      <Modal open={modal.isOpen} onClose={modal.close} title={editing ? `Edit ${editing.name}` : 'Add offer'}>
        <OfferForm
          key={editing?.id ?? 'new'}
          initial={editing ? omitId(editing) : blankOffer()}
          categories={categories.map((c) => ({ value: c.slug, label: c.name }))}
          onClose={modal.close}
          onSave={async (values) => {
            if (editing) await update(editing.id, values);
            else await create(values);
            toast(editing ? 'Offer saved' : 'Offer added');
          }}
        />
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete offer?"
        message={`“${toDelete?.name}” will stop applying straight away.`}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          await remove(toDelete.id);
          toast('Offer deleted');
        }}
      />
    </>
  );
}
