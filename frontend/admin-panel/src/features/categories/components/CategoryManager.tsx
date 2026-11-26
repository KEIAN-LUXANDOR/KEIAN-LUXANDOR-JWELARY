'use client';

import { useMemo, useState, type FormEvent } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import DataTable, { type Column } from '@/components/tables/DataTable';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { NumberField, TextAreaField, TextField } from '@/components/forms/Field';
import Toggle from '@/components/forms/Toggle';
import useResource from '@/hooks/useResource';
import useDisclosure from '@/hooks/useDisclosure';
import { useToast } from '@/lib/providers/ToastProvider';
import { productService } from '@/features/products/services/productService';
import type { Category } from '@/types/models';
import { slugify } from '@/utils/text';
import { hasErrors, isBlank, type FormErrors } from '@/utils/validation';
import { categoryService } from '../services/categoryService';

type CategoryInput = Omit<Category, 'id'>;

function CategoryForm({ initial, takenSlugs, onSave, onClose }: { initial: CategoryInput; takenSlugs: string[]; onSave: (c: CategoryInput) => Promise<void>; onClose: () => void }) {
  const [values, setValues] = useState(initial);
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));
  const [errors, setErrors] = useState<FormErrors<CategoryInput>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FormErrors<CategoryInput> = {};
    if (isBlank(values.name)) errs.name = 'Enter a name';
    if (isBlank(values.slug)) errs.slug = 'Enter a web address';
    else if (takenSlugs.includes(values.slug)) errs.slug = 'Another category already uses this address';
    setErrors(errs);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      await onSave({ ...values, name: values.name.trim() });
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="form-grid">
      <TextField
        id="cat-name"
        label="Name"
        value={values.name}
        error={errors.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value, slug: slugEdited ? v.slug : slugify(e.target.value) }))}
      />
      <TextField
        id="cat-slug"
        label="Web address"
        value={values.slug}
        error={errors.slug}
        hint={`Website page: /collections/${values.slug || '…'}`}
        onChange={(e) => {
          setSlugEdited(true);
          setValues((v) => ({ ...v, slug: slugify(e.target.value) }));
        }}
      />
      <TextAreaField id="cat-desc" label="Description" value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} full />
      <NumberField id="cat-pos" label="Menu position" value={values.position} onValueChange={(p) => setValues((v) => ({ ...v, position: p ?? 1 }))} min={1} step="1" />
      <div className="field" style={{ alignSelf: 'end' }}>
        <Toggle checked={values.active} onChange={(active) => setValues((v) => ({ ...v, active }))} label="Show on website" />
      </div>
      <div className="form-actions field--full">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Save
        </Button>
      </div>
    </form>
  );
}

/** /products/categories */
export default function CategoryManager() {
  const { items, loading, error, create, update, remove } = useResource(categoryService);
  const { items: products } = useResource(productService);
  const modal = useDisclosure<Category>();
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const toast = useToast();

  const counts = useMemo(() => products.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {}), [products]);
  const sorted = useMemo(() => [...items].sort((a, b) => a.position - b.position), [items]);

  const columns: Column<Category>[] = [
    { key: 'position', header: '#', width: '56px', sortValue: (c) => c.position, render: (c) => <span className="num muted">{c.position}</span> },
    {
      key: 'name',
      header: 'Category',
      sortValue: (c) => c.name,
      render: (c) => (
        <div>
          <div className="cell-title">{c.name}</div>
          <div className="cell-sub">/collections/{c.slug}</div>
        </div>
      ),
    },
    { key: 'description', header: 'Description', render: (c) => <span className="muted wrap" style={{ display: 'block' }}>{c.description}</span> },
    { key: 'products', header: 'Products', align: 'right', sortValue: (c) => counts[c.slug] ?? 0, render: (c) => <span className="num">{counts[c.slug] ?? 0}</span> },
    {
      key: 'active',
      header: 'On website',
      render: (c) => (
        <Toggle
          checked={c.active}
          hideLabel
          label={`Show ${c.name} on website`}
          onChange={async (active) => {
            await update(c.id, { active });
            toast(active ? `${c.name} is visible` : `${c.name} is hidden`);
          }}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c) => (
        <span className="row-actions">
          <IconButton icon="edit" label={`Edit ${c.name}`} onClick={() => modal.open(c)} />
          <IconButton icon="trash" label={`Delete ${c.name}`} tone="danger" onClick={() => setToDelete(c)} />
        </span>
      ),
    },
  ];

  const editing = modal.item;
  const inUse = toDelete ? counts[toDelete.slug] ?? 0 : 0;

  return (
    <>
      <PageHeader
        title="Categories"
        description="Groups used in the website menu and filters."
        back={{ href: '/products', label: 'Products' }}
        actions={
          <Button icon="plus" onClick={() => modal.open(null)}>
            Add category
          </Button>
        }
      />
      <DataTable caption="Categories" columns={columns} rows={sorted} rowKey={(c) => c.id} loading={loading} error={error} />
      <Modal open={modal.isOpen} onClose={modal.close} title={editing ? `Edit ${editing.name}` : 'Add category'}>
        <CategoryForm
          key={editing?.id ?? 'new'}
          initial={editing ? { name: editing.name, slug: editing.slug, description: editing.description, active: editing.active, position: editing.position } : { name: '', slug: '', description: '', active: true, position: items.length + 1 }}
          takenSlugs={items.filter((c) => c.id !== editing?.id).map((c) => c.slug)}
          onClose={modal.close}
          onSave={async (values) => {
            if (editing) await update(editing.id, values);
            else await create(values);
            toast(editing ? 'Category saved' : 'Category added');
          }}
        />
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete category?"
        message={
          inUse
            ? `${inUse} products are in “${toDelete?.name}”. Move them to another category first.`
            : `“${toDelete?.name}” will be removed from the website menu. This can’t be undone.`
        }
        confirmLabel={inUse ? 'OK' : 'Delete'}
        danger={!inUse}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete || inUse) return;
          await remove(toDelete.id);
          toast('Category deleted');
        }}
      />
    </>
  );
}
