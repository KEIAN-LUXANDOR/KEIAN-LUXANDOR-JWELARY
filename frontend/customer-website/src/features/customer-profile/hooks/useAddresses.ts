'use client';

import { useCallback, useEffect, useState } from 'react';
import { createId } from '@/utils/text';
import type { Address, AddressInput } from '../types/profileTypes';
import { getAddresses, saveAddresses } from '../services/profileService';

/** Address book for one customer: load, add, remove, choose default. */
export default function useAddresses(customerId: string | null) {
  const [state, setState] = useState<{ id: string | null; addresses: Address[] }>({ id: null, addresses: [] });

  useEffect(() => {
    if (!customerId) return undefined;
    let cancelled = false;
    getAddresses(customerId).then((addresses) => !cancelled && setState({ id: customerId, addresses }));
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const ready = customerId !== null && state.id === customerId;
  const addresses = ready ? state.addresses : [];

  const persist = useCallback(
    async (next: Address[]) => {
      if (!customerId) return;
      const saved = await saveAddresses(customerId, next);
      setState({ id: customerId, addresses: saved });
    },
    [customerId],
  );

  const addAddress = (input: AddressInput, makeDefault = false) => {
    const isDefault = makeDefault || addresses.length === 0;
    const created: Address = { ...input, id: createId('ADR'), isDefault };
    return persist([...addresses.map((a) => (isDefault ? { ...a, isDefault: false } : a)), created]);
  };

  const removeAddress = (id: string) => {
    const rest = addresses.filter((a) => a.id !== id);
    if (rest.length && !rest.some((a) => a.isDefault)) rest[0] = { ...rest[0], isDefault: true };
    return persist(rest);
  };

  const setDefault = (id: string) => persist(addresses.map((a) => ({ ...a, isDefault: a.id === id })));

  return { addresses, ready, addAddress, removeAddress, setDefault, defaultAddress: addresses.find((a) => a.isDefault) ?? null };
}
