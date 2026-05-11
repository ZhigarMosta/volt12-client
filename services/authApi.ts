import type { User } from '~/types/user';

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

function authFetch<T>(url: string, opts?: any): Promise<T> {
  return $fetch<T>(url, { credentials: 'include', ...opts });
}

export async function register(name: string, email: string, password: string, phone?: string): Promise<User> {
  const apiBase = getApiBase();
  const res = await authFetch<{ success: boolean; user: User; error?: string }>(`${apiBase}/volt12/auth/register`, {
    method: 'POST',
    body: { name, email, password, phone }
  });
  return res.user!;
}

export async function login(email: string, password: string): Promise<User> {
  const apiBase = getApiBase();
  const res = await authFetch<{ success: boolean; user: User; error?: string }>(`${apiBase}/volt12/auth/login`, {
    method: 'POST',
    body: { email, password }
  });
  return res.user!;
}

export async function logout(): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/logout`, { method: 'POST' });
}

export async function getMe(): Promise<User | null> {
  const apiBase = getApiBase();
  try {
    const res = await authFetch<{ success: boolean; user: User }>(`${apiBase}/volt12/auth/me`);
    return res.user ?? null;
  } catch {
    return null;
  }
}
