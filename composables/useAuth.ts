import type { User } from '~/types/user';
import { getMe, login, logout, register } from '~/services/authApi';
import { useClientContactStore } from '~/stores/clientContact';

let fetched = false;

function syncUserToClientContact(user: User | null) {
  if (!import.meta.client || !user) return;
  useClientContactStore().setFromUser(user);
}

export function useAuth() {
  const user = useState<User | null>('auth:user', () => null);
  const loading = useState('auth:loading', () => true);
  const isAuthenticated = computed(() => user.value !== null);

  async function fetchUser() {
    if (fetched) return;
    fetched = true;
    loading.value = true;
    user.value = await getMe();
    syncUserToClientContact(user.value);
    loading.value = false;
  }

  function readLocalStore() {
    try {
      const cartRaw = localStorage.getItem('cart');
      const compareRaw = localStorage.getItem('compare');
      const cart: Record<number, number> = cartRaw ? JSON.parse(cartRaw) : {};
      const compareParsed = compareRaw ? JSON.parse(compareRaw) : [];
      // compare может быть массивом [1,2,3] или объектом {1:true, 2:true}
      const compare: number[] = Array.isArray(compareParsed)
        ? compareParsed.map(Number).filter(n => !isNaN(n))
        : Object.keys(compareParsed).map(Number).filter(n => !isNaN(n));
      return { cart, compare };
    } catch {
      return { cart: {}, compare: [] };
    }
  }

  function clearLocalStore() {
    localStorage.removeItem('cart');
    localStorage.removeItem('compare');
  }

  async function loginUser(email: string, password: string) {
    const { cart, compare } = readLocalStore();
    user.value = await login(email, password, cart, compare);
    syncUserToClientContact(user.value);
    clearLocalStore();
    window.location.reload();
  }

  async function registerUser(name: string, email: string, password: string, phone?: string) {
    const { cart, compare } = readLocalStore();
    user.value = await register(name, email, password, phone, cart, compare);
    syncUserToClientContact(user.value);
    clearLocalStore();
    window.location.reload();
  }

  async function logoutUser() {
    await logout();
    user.value = null;
    window.location.reload();
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
