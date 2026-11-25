// ─────────────────────────────────────────────────────────────
// One place that talks to the Spring Boot backend.
// The website calls /api/...; Next.js forwards it to the backend
// (BACKEND_URL, default http://localhost:8080 — see next.config.ts).
// ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 404) throw new ApiError(404, 'not-found');
  if (!res.ok) throw new ApiError(res.status, `Server error ${res.status}`);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const apiGet = <T,>(path: string) => request<T>('GET', path);
export const apiPost = <T,>(path: string, body: unknown) => request<T>('POST', path, body);
export const apiPut = <T,>(path: string, body: unknown) => request<T>('PUT', path, body);
export const apiDelete = <T,>(path: string) => request<T>('DELETE', path);

/**
 * Accounts, orders and payments are not in the backend yet, so for now they are
 * saved in this browser only. When the Spring Boot backend has those endpoints
 * (listed at the top of each feature's services file), set
 * NEXT_PUBLIC_CUSTOMER_API=true in .env.local to use them.
 */
export const isApiEnabled = process.env.NEXT_PUBLIC_CUSTOMER_API === 'true';
