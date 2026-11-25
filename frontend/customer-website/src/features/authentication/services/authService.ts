// ─────────────────────────────────────────────────────────────
// Login / registration.
//
// With NEXT_PUBLIC_CUSTOMER_API=true, calls the Spring Boot backend:
//   POST /api/auth/login     { email, password } → Customer
//   POST /api/auth/register  { firstName, lastName, email, password } → Customer
//   POST /api/auth/logout
// The backend should keep the session in an HttpOnly cookie.
//
// Without a backend this is a DEMO ONLY mock: it keeps a list of
// registered customers in localStorage and does NOT check passwords.
// Never ship the mock to production.
// ─────────────────────────────────────────────────────────────
import { apiPost, isApiEnabled } from '@/services/apiClient';
import { loadJSON, saveJSON } from '@/utils/storage';
import { createId } from '@/utils/text';
import type { Customer, LoginInput, RegisterInput } from '../types/authTypes';

const MOCK_CUSTOMERS_KEY = 'kl.mock.customers';

export class AuthError extends Error {}

export async function login(input: LoginInput): Promise<Customer> {
  if (isApiEnabled) return apiPost<Customer>('/auth/login', input);

  const customers = loadJSON<Customer[]>(MOCK_CUSTOMERS_KEY, []);
  const found = customers.find((c) => c.email.toLowerCase() === input.email.trim().toLowerCase());
  if (!found) throw new AuthError('No account found for this email. Please create an account.');
  return found;
}

export async function register(input: RegisterInput): Promise<Customer> {
  if (isApiEnabled) return apiPost<Customer>('/auth/register', input);

  const customers = loadJSON<Customer[]>(MOCK_CUSTOMERS_KEY, []);
  const email = input.email.trim().toLowerCase();
  if (customers.some((c) => c.email.toLowerCase() === email)) {
    throw new AuthError('An account with this email already exists. Please sign in.');
  }
  const customer: Customer = { id: createId('CUS'), firstName: input.firstName.trim(), lastName: input.lastName.trim(), email };
  saveJSON(MOCK_CUSTOMERS_KEY, [...customers, customer]);
  return customer;
}

export async function logout(): Promise<void> {
  if (isApiEnabled) await apiPost<void>('/auth/logout', {});
}

/** Keeps the mock customer list in step with profile edits. */
export function saveMockCustomer(customer: Customer): void {
  if (isApiEnabled) return;
  const customers = loadJSON<Customer[]>(MOCK_CUSTOMERS_KEY, []);
  saveJSON(
    MOCK_CUSTOMERS_KEY,
    customers.map((c) => (c.id === customer.id ? customer : c)),
  );
}
