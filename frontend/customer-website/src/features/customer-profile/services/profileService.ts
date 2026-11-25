// ─────────────────────────────────────────────────────────────
// Customer profile & address book.
// Backend endpoints (used when NEXT_PUBLIC_CUSTOMER_API=true):
//   PUT    /api/customers/me                { firstName, lastName, phone } → Customer
//   GET    /api/customers/me/addresses      → Address[]
//   PUT    /api/customers/me/addresses      Address[] → Address[]
// Without a backend, data is kept in this browser's localStorage.
// ─────────────────────────────────────────────────────────────
import { apiGet, apiPut, isApiEnabled } from '@/services/apiClient';
import { loadJSON, saveJSON } from '@/utils/storage';
import type { Customer } from '@/features/authentication/types/authTypes';
import { saveMockCustomer } from '@/features/authentication/services/authService';
import type { Address, ProfileInput } from '../types/profileTypes';

const addressKey = (customerId: string) => `kl.addresses.${customerId}`;

export async function updateProfile(customer: Customer, input: ProfileInput): Promise<Customer> {
  if (isApiEnabled) return apiPut<Customer>('/customers/me', input);
  const updated: Customer = { ...customer, firstName: input.firstName.trim(), lastName: input.lastName.trim(), phone: input.phone.trim() || undefined };
  saveMockCustomer(updated);
  return updated;
}

export async function getAddresses(customerId: string): Promise<Address[]> {
  if (isApiEnabled) return apiGet<Address[]>('/customers/me/addresses');
  return loadJSON<Address[]>(addressKey(customerId), []);
}

export async function saveAddresses(customerId: string, addresses: Address[]): Promise<Address[]> {
  if (isApiEnabled) return apiPut<Address[]>('/customers/me/addresses', addresses);
  saveJSON(addressKey(customerId), addresses);
  return addresses;
}
