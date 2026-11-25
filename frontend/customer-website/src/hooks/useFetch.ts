'use client';

import { useEffect, useState } from 'react';

interface FetchState<T> {
  key: string | undefined;
  data: T | null;
  error: Error | null;
}

export interface FetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// Loads data once per `key` and reports { data, loading, error }.
// Example: const { data, loading } = useFetch(() => fetchProducts('rings'), 'rings');
export default function useFetch<T>(loader: () => Promise<T>, key: string): FetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ key: undefined, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => {
        if (!cancelled) setState({ key, data, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ key, data: null, error: error instanceof Error ? error : new Error(String(error)) });
      });
    return () => {
      cancelled = true;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const loading = state.key !== key;
  return {
    data: loading ? null : state.data,
    error: loading ? null : state.error,
    loading,
  };
}
