'use client';

import { useEffect } from 'react';

export default function useEscapeKey(handler: () => void, active = true): void {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handler();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, active]);
}
