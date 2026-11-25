'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { OverlayName } from '@/types/common';

// Global UI state: which overlay is open (search, appointment, chat, mobile menu)
// plus a lightweight toast message.
interface UIContextValue {
  overlay: OverlayName | null;
  open: (name: OverlayName) => void;
  close: () => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<OverlayName | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const open = useCallback((name: OverlayName) => setOverlay(name), []);
  const close = useCallback(() => setOverlay(null), []);

  const value = useMemo(() => ({ overlay, open, close, toast, showToast }), [overlay, open, close, toast, showToast]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = (): UIContextValue => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
};
