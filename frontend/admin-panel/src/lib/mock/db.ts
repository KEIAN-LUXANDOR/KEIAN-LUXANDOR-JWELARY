// ─────────────────────────────────────────────────────────────
// Demo database kept in this browser's localStorage.
// Used while NEXT_PUBLIC_ADMIN_API is not "true".
// "Reset demo data" in Settings puts the original data back.
// ─────────────────────────────────────────────────────────────
import type { Entity } from '@/types/models';
import { createSeedData, type CollectionName, type MockDatabase } from './seed';

const STORAGE_KEY = 'kl-admin.mockdb.v1';
let memory: MockDatabase | null = null;

const load = (): MockDatabase => {
  if (memory) return memory;
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memory = JSON.parse(raw) as MockDatabase;
        return memory;
      }
    } catch {
      /* fall through to fresh data */
    }
  }
  memory = createSeedData();
  persist();
  return memory;
};

const persist = () => {
  if (typeof window === 'undefined' || !memory) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* storage full or blocked — keep working in memory */
  }
};

/** Pretend network delay so loading states can be seen and tested. */
const delay = <T,>(value: T, ms = 120): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

type Item<K extends CollectionName> = MockDatabase[K][number];

export const mockDb = {
  list<K extends CollectionName>(name: K): Promise<MockDatabase[K]> {
    return delay(load()[name]);
  },
  get<K extends CollectionName>(name: K, id: string): Promise<Item<K> | null> {
    const found = (load()[name] as Entity[]).find((x) => x.id === id) ?? null;
    return delay(found as Item<K> | null);
  },
  create<K extends CollectionName>(name: K, item: Item<K>): Promise<Item<K>> {
    const db = load();
    (db[name] as Entity[]).unshift(item);
    persist();
    return delay(item);
  },
  update<K extends CollectionName>(name: K, id: string, patch: Partial<Item<K>>): Promise<Item<K>> {
    const db = load();
    const list = db[name] as Entity[];
    const index = list.findIndex((x) => x.id === id);
    if (index === -1) return Promise.reject(new Error('Not found'));
    list[index] = { ...list[index], ...patch, id };
    persist();
    return delay(list[index] as Item<K>);
  },
  remove<K extends CollectionName>(name: K, id: string): Promise<void> {
    const db = load();
    const all = db as unknown as Record<string, Entity[]>;
    all[name] = all[name].filter((x) => x.id !== id);
    persist();
    return delay(undefined);
  },
  /** Throw away changes and start again with the original demo data. */
  reset(): void {
    memory = createSeedData();
    persist();
  },
};
