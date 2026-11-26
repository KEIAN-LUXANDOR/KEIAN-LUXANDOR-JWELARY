'use client';

import { useMemo, useState, type FormEvent } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/Badge';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { SelectField, TextField } from '@/components/forms/Field';
import Toggle from '@/components/forms/Toggle';
import useResource from '@/hooks/useResource';
import useDisclosure from '@/hooks/useDisclosure';
import { useToast } from '@/lib/providers/ToastProvider';
import type { Banner, BannerPlacement } from '@/types/models';
import { omitId } from '@/utils/object';
import { hasErrors, isBlank, type FormErrors } from '@/utils/validation';
import { bannerService } from '../services/bannerService';

type BannerInput = Omit<Banner, 'id'>;

const PLACEMENTS: { value: BannerPlacement; label: string; help: string }[] = [
  { value: 'home-hero', label: 'Home — main banner', help: 'Large photo at the top of the home page' },
  { value: 'home-campaign', label: 'Home — campaign', help: 'Wide banner below “Shop by Category”' },
  { value: 'home-story', label: 'Home — story', help: 'Photo and text in the “Our Story” section' },
];

function BannerForm({ initial, onSave, onClose }: { initial: BannerInput; onSave: (b: BannerInput) => Promise<void>; onClose: () => void }) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<FormErrors<BannerInput>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof BannerInput>(k: K, value: BannerInput[K]) => setV((x) => ({ ...x, [k]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FormErrors<BannerInput> = {};
    if (isBlank(v.title)) errs.title = 'Enter a title';
    if (isBlank(v.image)) errs.image = 'Enter the photo address';
    if (!isBlank(v.ctaLabel) && isBlank(v.ctaLink)) errs.ctaLink = 'Where should the button go?';
    else if (!isBlank(v.ctaLink) && !/^(\/|https?:\/\/)/.test(v.ctaLink)) errs.ctaLink = 'Start with / for a website page, or https://';
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
      <TextField id="b-title" label="Title" value={v.title} onChange={(e) => set('title', e.target.value)} error={errors.title} />
      <TextField id="b-sub" label="Small text above the title" value={v.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
      <SelectField id="b-place" label="Where it shows" value={v.placement} onChange={(e) => set('placement', e.target.value as BannerPlacement)} options={PLACEMENTS} hint={PLACEMENTS.find((p) => p.value === v.placement)?.help} />
      <TextField id="b-img" label="Photo address" value={v.image} onChange={(e) => set('image', e.target.value)} error={errors.image} hint="e.g. /banners/heroBanner.webp (from the website’s public folder) or https://…" />
      <TextField id="b-cta" label="Button text" value={v.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} />
      <TextField id="b-link" label="Button link" value={v.ctaLink} onChange={(e) => set('ctaLink', e.target.value)} error={errors.ctaLink} hint="e.g. /collections/signature" />
      <div className="field field--full">
        <span className="field__label">Preview</span>
        <div className="image-preview" style={{ aspectRatio: '16 / 6' }}>
          {v.image ? <img src={v.image} alt="" /> : 'No photo yet'}
        </div>
      </div>
      <div className="field--full">
        <Toggle checked={v.active} onChange={(x) => set('active', x)} label="Show on the website" />
      </div>
      <div className="form-actions field--full">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Save banner
        </Button>
      </div>
    </form>
  );
}

/** /banners — homepage banners, grouped by where they show. */
export default function BannerManager() {
  const { items, loading, error, create, update, remove } = useResource(bannerService);
  const modal = useDisclosure<Banner>();
  const [toDelete, setToDelete] = useState<Banner | null>(null);
  const toast = useToast();

  const groups = useMemo(() => PLACEMENTS.map((p) => ({ ...p, banners: items.filter((b) => b.placement === p.value).sort((a, b) => a.position - b.position) })), [items]);

  const move = async (list: Banner[], index: number, dir: -1 | 1) => {
    const a = list[index];
    const b = list[index + dir];
    if (!a || !b) return;
    await update(a.id, { position: b.position });
    await update(b.id, { position: a.position });
  };

  const editing = modal.item;
  return (
    <>
      <PageHeader
        title="Banners"
        description="Photos and text on the website’s home page. When a spot has several active banners, the first one shows."
        actions={
          <Button icon="plus" onClick={() => modal.open(null)}>
            Add banner
          </Button>
        }
      />
      {loading ? (
        <Loading />
      ) : error ? (
        <EmptyState icon="alert" title="Could not load banners" text={error} />
      ) : (
        groups.map((g) => (
          <Card key={g.value} title={g.label}>
            <p className="muted" style={{ marginTop: -8, marginBottom: 16 }}>
              {g.help}
            </p>
            {g.banners.length === 0 ? (
              <EmptyState icon="image" title="No banner here yet" />
            ) : (
              <div className="banner-grid">
                {g.banners.map((b, i) => (
                  <article key={b.id} className="banner-card">
                    <div className="banner-card__img">
                      <img src={b.image} alt="" />
                      <StatusBadge status={b.active ? (i === g.banners.findIndex((x) => x.active) ? 'Live' : 'Scheduled') : 'Inactive'} />
                    </div>
                    <div className="banner-card__body">
                      {b.subtitle && <span className="cell-sub">{b.subtitle}</span>}
                      <h3 className="banner-card__title">{b.title}</h3>
                      {b.ctaLabel && (
                        <span className="cell-sub">
                          Button: {b.ctaLabel} → {b.ctaLink}
                        </span>
                      )}
                    </div>
                    <div className="banner-card__foot">
                      <Toggle checked={b.active} hideLabel label={`Show ${b.title}`} onChange={async (active) => {
                          await update(b.id, { active });
                          toast(active ? 'Banner shown' : 'Banner hidden');
                        }} />
                      <span className="row-actions">
                        <IconButton icon="arrowUp" label="Move earlier" disabled={i === 0} onClick={() => move(g.banners, i, -1)} />
                        <IconButton icon="arrowDown" label="Move later" disabled={i === g.banners.length - 1} onClick={() => move(g.banners, i, 1)} />
                        <IconButton icon="edit" label={`Edit ${b.title}`} onClick={() => modal.open(b)} />
                        <IconButton icon="trash" label={`Delete ${b.title}`} tone="danger" onClick={() => setToDelete(b)} />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
        ))
      )}
      <Modal open={modal.isOpen} onClose={modal.close} title={editing ? 'Edit banner' : 'Add banner'} size="lg">
        <BannerForm
          key={editing?.id ?? 'new'}
          initial={editing ? omitId(editing) : { title: '', subtitle: '', image: '', ctaLabel: '', ctaLink: '', placement: 'home-hero', position: items.length + 1, active: true }}
          onClose={modal.close}
          onSave={async (values) => {
            if (editing) await update(editing.id, values);
            else await create({ ...values, position: Math.max(0, ...items.filter((b) => b.placement === values.placement).map((b) => b.position)) + 1 });
            toast(editing ? 'Banner saved' : 'Banner added');
          }}
        />
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete banner?"
        message={`“${toDelete?.title}” will be removed from the website.`}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          await remove(toDelete.id);
          toast('Banner deleted');
        }}
      />
    </>
  );
}
