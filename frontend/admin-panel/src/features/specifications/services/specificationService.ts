// Specification lists (metals, purity, diamond shape …).
// Backend: GET /api/admin/specifications, PUT /api/admin/specifications/{id}
import { createResource } from '@/services/createResource';
import type { SpecificationGroup } from '@/types/models';

export const specificationService = createResource<SpecificationGroup>('specifications', '/admin/specifications', 'spec');
