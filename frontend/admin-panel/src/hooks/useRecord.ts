'use client';

import { useEffect, useState } from 'react';
import type { Resource } from '@/services/createResource';
import type { Entity } from '@/types/models';

/** Loads one record by id (e.g. an order on /orders/[id]). `found` is false when it doesn't exist. */
export default function useRecord<T extends Entity>(resource: Resource<T>, id: string) {
  const [state, setState] = useState<{ id: string | null; record: T | null; error: string | null }>({ id: null, record: null, error: null });

  useEffect(() => {
    let cancelled = false;
    resource
      .get(id)
      .then((record) => !cancelled && setState({ id, record, error: null }))
      .catch((err: unknown) => !cancelled && setState({ id, record: null, error: err instanceof Error ? err.message : 'Could not load' }));
    return () => {
      cancelled = true;
    };
  }, [resource, id]);

  const loading = state.id !== id;
  return {
    record: loading ? null : state.record,
    setRecord: (record: T) => setState({ id, record, error: null }),
    loading,
    error: loading ? null : state.error,
    found: !loading && !state.error && state.record !== null,
  };
}
