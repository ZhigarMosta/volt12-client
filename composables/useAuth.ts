import type { User } from '~/types/user';
import { getMe, login, logout, register } from '~/services/authApi';

let fetched = false;

export function useAuth() {
  const user = useState<User | null>('auth:user', () => null);
  const loading = useState('auth:loading', () => true);
  const isAuthenticated = computed(() => user.value !== null);

  async function fetchUser() {
    if (fetched) return;
    fetched = true;
    loading.value = true;
    user.value = await getMe();
    loading.value = false;
  }

  async function loginUser(email: string, password: string) {
    user.value = await login(email, password);
  }

  async function registerUser(name: string, email: string, password: string, phone?: string) {
    user.value = await register(name, email, password, phone);
  }

  async function logoutUser() {
    await logout();
    user.value = null;
  }

  if (import.meta.client && !fetched) {
    fetchUser();
  }

  return {
    user,
    loading,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    fetchUser
  };
}
