'use client';

import { useEffect } from 'react';

/** Calls `handler` when the Escape key is pressed (only while `active`). */
export default function useEscapeKey(handler: () => void, active = true): void {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, active]);
}
