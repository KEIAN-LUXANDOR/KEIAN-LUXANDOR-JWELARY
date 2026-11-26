'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Resource } from '@/services/createResource';
import type { Entity } from '@/types/models';

/**
 * Loads a list from a service and keeps it in step after create / update / delete.
 *   const { items, loading, error, create, update, remove } = useResource(couponService);
 */
export default function useResource<T extends Entity>(resource: Resource<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    resource
      .list()
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        setError(null);
      })
      .catch((err: unknown) => !cancelled && setError(err instanceof Error ? err.message : 'Could not load data'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [resource, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  const create = useCallback(
    async (input: Omit<T, 'id'>) => {
      const created = await resource.create(input);
      setItems((list) => [created, ...list]);
      return created;
    },
    [resource],
  );

  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      const updated = await resource.update(id, patch);
      setItems((list) => list.map((x) => (x.id === id ? updated : x)));
      return updated;
    },
    [resource],
  );

  const remove = useCallback(
    async (id: string) => {
      await resource.remove(id);
      setItems((list) => list.filter((x) => x.id !== id));
    },
    [resource],
  );

  return { items, loading, error, reload, create, update, remove, setItems };
}
