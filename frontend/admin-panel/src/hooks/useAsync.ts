'use client';

import { useEffect, useState } from 'react';

/** Runs an async loader once per `key` (e.g. dashboard numbers). */
export default function useAsync<T>(key: string, load: () => Promise<T>) {
  const [state, setState] = useState<{ key: string | null; data: T | null; error: string | null }>({ key: null, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => !cancelled && setState({ key, data, error: null }))
      .catch((err: unknown) => !cancelled && setState({ key, data: null, error: err instanceof Error ? err.message : 'Could not load' }));
    return () => {
      cancelled = true;
    };
    // `load` is recreated every render; `key` describes what to load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const loading = state.key !== key;
  return { data: loading ? null : state.data, loading, error: loading ? null : state.error };
}
