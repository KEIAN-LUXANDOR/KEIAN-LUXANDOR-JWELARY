// ─────────────────────────────────────────────────────────────
// Standard list / get / create / update / delete for one kind of record.
// Each feature service is built from this, e.g.
//   export const couponService = createResource<Coupon>('coupons', '/admin/coupons');
// → GET/POST /api/admin/coupons, GET/PUT/DELETE /api/admin/coupons/{id}
// ─────────────────────────────────────────────────────────────
import { mockDb } from '@/lib/mock/db';
import type { CollectionName, MockDatabase } from '@/lib/mock/seed';
import type { Entity } from '@/types/models';
import { createId } from '@/utils/text';
import { api, useBackend } from './apiClient';

export interface Resource<T extends Entity> {
  list: () => Promise<T[]>;
  get: (id: string) => Promise<T | null>;
  create: (input: Omit<T, 'id'>) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function createResource<T extends Entity>(collection: CollectionName, endpoint: string, idPrefix = collection.slice(0, 3)): Resource<T> {
  if (useBackend) {
    return {
      list: () => api.get<T[]>(endpoint),
      get: (id) => api.get<T>(`${endpoint}/${encodeURIComponent(id)}`),
      create: (input) => api.post<T>(endpoint, input),
      update: (id, patch) => api.put<T>(`${endpoint}/${encodeURIComponent(id)}`, patch),
      remove: (id) => api.delete<void>(`${endpoint}/${encodeURIComponent(id)}`),
    };
  }
  type Row = MockDatabase[typeof collection][number];
  return {
    list: () => mockDb.list(collection) as unknown as Promise<T[]>,
    get: (id) => mockDb.get(collection, id) as unknown as Promise<T | null>,
    create: (input) => mockDb.create(collection, { ...input, id: createId(idPrefix) } as unknown as Row) as unknown as Promise<T>,
    update: (id, patch) => mockDb.update(collection, id, patch as Partial<Row>) as unknown as Promise<T>,
    remove: (id) => mockDb.remove(collection, id),
  };
}
