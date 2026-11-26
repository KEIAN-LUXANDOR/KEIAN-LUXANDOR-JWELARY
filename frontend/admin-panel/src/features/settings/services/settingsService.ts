// Store settings (one record). Backend: GET /api/admin/settings, PUT /api/admin/settings
import { api, useBackend } from '@/services/apiClient';
import { mockDb } from '@/lib/mock/db';
import type { StoreSettings } from '@/types/models';

export async function getSettings(): Promise<StoreSettings> {
  if (useBackend) return api.get<StoreSettings>('/admin/settings');
  const [settings] = await mockDb.list('settings');
  return settings;
}

export async function saveSettings(settings: StoreSettings): Promise<StoreSettings> {
  if (useBackend) return api.put<StoreSettings>('/admin/settings', settings);
  return mockDb.update('settings', settings.id, settings);
}

/** Demo mode only: throw away all changes and load the original demo data. */
export function resetDemoData(): void {
  mockDb.reset();
}
