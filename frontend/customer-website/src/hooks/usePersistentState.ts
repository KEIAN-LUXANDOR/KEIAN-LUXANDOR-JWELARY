'use client';

import { useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON } from '@/utils/storage';

/**
 * useState that is saved to localStorage.
 * Starts with `initial` on the server and first render (so HTML matches),
 * then loads the saved value after mount. `ready` is false until then.
 */
export default function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    // Loading from localStorage can only happen in the browser, after mount.
    setValue(loadJSON<T>(key, initialRef.current));
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (ready) saveJSON(key, value);
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}
