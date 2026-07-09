import type { User } from '~/types/user';

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

function authFetch<T>(url: string, opts?: any): Promise<T> {
  return $fetch<T>(url, { credentials: 'include', ...opts });
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone?: string,
  cart?: Record<number, number>,
  compare?: number[],
): Promise<User> {
  const apiBase = getApiBase();
  const body: Record<string, any> = { name, email, password };
  if (phone) body.phone = phone;
  if (cart && Object.keys(cart).length > 0) body.cart = cart;
  if (compare && compare.length > 0) body.compare = compare;
  const res = await authFetch<{ success: boolean; user: User; error?: string }>(`${apiBase}/volt12/auth/register`, {
    method: 'POST',
    body,
  });
  return res.user!;
}

export async function login(
  email: string,
  password: string,
  cart?: Record<number, number>,
  compare?: number[],
): Promise<User> {
  const apiBase = getApiBase();
  const body: Record<string, any> = { email, password };
  // гостевые корзина и сравнение переезжают в аккаунт (сервер объединяет их с серверными)
  if (cart && Object.keys(cart).length > 0) body.cart = cart;
  if (compare && compare.length > 0) body.compare = compare;
  const res = await authFetch<{ success: boolean; user: User; error?: string }>(`${apiBase}/volt12/auth/login`, {
    method: 'POST',
    body,
  });
  return res.user!;
}

export async function logout(): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/logout`, { method: 'POST' });
}

export async function sendVerificationEmail(): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/send-verification`, { method: 'POST' });
}

export async function verifyEmail(code: string): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/verify-email`, { method: 'POST', body: { code } });
}

export async function updateProfile(data: { name?: string; phone?: string }): Promise<User> {
  const apiBase = getApiBase();
  const res = await authFetch<{ success: boolean; user: User; error?: string }>(`${apiBase}/volt12/auth/update-profile`, {
    method: 'POST',
    body: data,
  });
  return res.user!;
}

export async function requestPasswordChange(newPassword: string): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/request-password-change`, {
    method: 'POST',
    body: { new_password: newPassword },
  });
}

export async function confirmPasswordChange(code: string): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/confirm-password-change`, {
    method: 'POST',
    body: { code },
  });
}

export async function forgotPassword(email: string): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/forgot-password`, {
    method: 'POST',
    body: { email },
  });
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
  const apiBase = getApiBase();
  await authFetch(`${apiBase}/volt12/auth/reset-password`, {
    method: 'POST',
    body: { email, code, new_password: newPassword },
  });
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
