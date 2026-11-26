// ─────────────────────────────────────────────────────────────
// The single connection to the Spring Boot backend.
// The admin panel calls /api/...; Next.js forwards it to BACKEND_URL
// (default http://localhost:8080 — see next.config.ts).
// ─────────────────────────────────────────────────────────────

/** true when NEXT_PUBLIC_ADMIN_API=true; otherwise the demo data in lib/mock is used. */
export const useBackend = process.env.NEXT_PUBLIC_ADMIN_API === 'true';

const TOKEN_KEY = 'kl-admin.token';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const authToken = {
  get: (): string | null => (typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY)),
  set: (token: string | null) => {
    if (typeof window === 'undefined') return;
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = authToken.get();
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(res.status, text || `${method} ${path} failed (${res.status})`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  get: <T,>(path: string) => request<T>('GET', path),
  post: <T,>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T,>(path: string, body: unknown) => request<T>('PUT', path, body),
  patch: <T,>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T,>(path: string) => request<T>('DELETE', path),
};
