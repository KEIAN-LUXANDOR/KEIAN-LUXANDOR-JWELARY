'use client';

import { useCallback, useState } from 'react';

/** Open / close state for a modal that edits one item (or a new one when `item` is null). */
export default function useDisclosure<T>() {
  const [state, setState] = useState<{ open: boolean; item: T | null }>({ open: false, item: null });
  const open = useCallback((item: T | null = null) => setState({ open: true, item }), []);
  const close = useCallback(() => setState({ open: false, item: null }), []);
  return { isOpen: state.open, item: state.item, open, close };
}
