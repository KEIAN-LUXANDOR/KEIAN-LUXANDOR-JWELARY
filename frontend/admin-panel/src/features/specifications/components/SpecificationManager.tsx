'use client';

import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/buttons/Button';
import TagInput from '@/components/forms/TagInput';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import type { SpecificationGroup } from '@/types/models';
import { specificationService } from '../services/specificationService';

function SpecCard({ group, onSave }: { group: SpecificationGroup; onSave: (values: string[]) => Promise<void> }) {
  const [values, setValues] = useState(group.values);
  const [busy, setBusy] = useState(false);
  const dirty = values.join('|') !== group.values.join('|');
  const locked = group.key === 'metal';

  return (
    <Card
      title={group.name}
      actions={
        !locked && (
          <Button
            size="sm"
            disabled={!dirty}
            loading={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onSave(values);
              } finally {
                setBusy(false);
              }
            }}
          >
            Save
          </Button>
        )
      }
    >
      <p className="muted" style={{ marginBottom: 12 }}>
        {group.description}
      </p>
      {locked ? (
        <>
          <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
            {group.values.map((v) => (
              <span key={v} className="chip" style={{ paddingRight: 10 }}>
                {v}
              </span>
            ))}
          </div>
          <p className="field__hint" style={{ marginTop: 10 }}>
            Keian’s four metals are fixed, because prices and the website’s metal pages depend on them.
          </p>
        </>
      ) : (
        <TagInput id={`spec-${group.id}`} label={`${group.name} values`} values={values} onChange={setValues} />
      )}
    </Card>
  );
}

/** /specifications — the lists of choices used in the product form. */
export default function SpecificationManager() {
  const { items, loading, error, update } = useResource(specificationService);
  const toast = useToast();

  return (
    <>
      <PageHeader title="Specifications" description="The choices shown in the product form: purity, diamond shape, colour, clarity, ring sizes and finish." />
      {loading ? (
        <Loading />
      ) : error ? (
        <EmptyState icon="alert" title="Could not load specifications" text={error} />
      ) : (
        <div className="spec-grid">
          {items.map((g) => (
            <SpecCard
              key={`${g.id}-${g.values.join('|')}`}
              group={g}
              onSave={async (values) => {
                await update(g.id, { values });
                toast(`${g.name} saved`);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
