// Customers. Backend: GET /api/admin/customers, GET/PUT /api/admin/customers/{id}
import { createResource } from '@/services/createResource';
import type { Customer } from '@/types/models';

export const customerService = createResource<Customer>('customers', '/admin/customers', 'cus');
