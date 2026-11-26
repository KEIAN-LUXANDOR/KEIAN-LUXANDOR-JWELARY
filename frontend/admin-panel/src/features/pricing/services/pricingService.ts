// Metal rates (USD per gram). Backend: GET /api/admin/pricing/metal-rates, PUT /api/admin/pricing/metal-rates/{id}
import { createResource } from '@/services/createResource';
import type { MetalRate } from '@/types/models';

export const metalRateService = createResource<MetalRate>('metalRates', '/admin/pricing/metal-rates', 'rate');
