import type { Ref } from 'vue';
import type { CartItem } from '~/types/cart';
import {
  getCartList,
  addToCart as apiAdd,
  updateCartItem,
  removeCartItem,
  removeManyCartItems,
} from '~/services/cartApi';

function readLocalCart(): Record<number, number> {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function writeLocalCart(data: Record<number, number>) {
  localStorage.setItem('cart', JSON.stringify(data));
}

export function useCart(isAuthenticated: Ref<boolean> = ref(false)) {
  const items = ref<CartItem[]>([]);
  const loading = ref(true);

  async function load() {
    loading.value = true;
    try {
      items.value = await getCartList();
    } finally {
      loading.value = false;
    }
  }

  async function addItem(catalogItemId: number) {
    await apiAdd(catalogItemId);
    await load();
  }

  async function removeItem(id: number) {
    const prev = [...items.value];
    items.value = items.value.filter((i) => i.id !== id);

    if (!isAuthenticated.value) {
      const item = prev.find((i) => i.id === id);
      if (item) {
        const cart = readLocalCart();
        delete cart[item.catalogItemId];
        writeLocalCart(cart);
      }
      return;
    }

    try {
      await removeCartItem(id);
    } catch {
      items.value = prev;
    }
  }

  async function removeItems(ids: number[]) {
    if (!ids.length) return;
    const set = new Set(ids);
    const prev = [...items.value];
    const toRemove = prev.filter((i) => set.has(i.id));
    items.value = prev.filter((i) => !set.has(i.id));

    if (!isAuthenticated.value) {
      const cart = readLocalCart();
      for (const item of toRemove) {
        delete cart[item.catalogItemId];
      }
      writeLocalCart(cart);
      return;
    }

    try {
      await removeManyCartItems(ids);
    } catch {
      items.value = prev;
    }
  }

  async function increaseQty(id: number) {
    const item = items.value.find((i) => i.id === id);
    if (!item) return;
    const prevQty = item.quantity;
    item.quantity += 1;

    if (!isAuthenticated.value) {
      const cart = readLocalCart();
      cart[item.catalogItemId] = item.quantity;
      writeLocalCart(cart);
      return;
    }

    try {
      await updateCartItem(item.catalogItemId, item.quantity);
    } catch {
      item.quantity = prevQty;
    }
  }

  async function decreaseQty(id: number) {
    const item = items.value.find((i) => i.id === id);
    if (!item) return;
    if (item.quantity > 1) {
      const prevQty = item.quantity;
      item.quantity -= 1;

      if (!isAuthenticated.value) {
        const cart = readLocalCart();
        cart[item.catalogItemId] = item.quantity;
        writeLocalCart(cart);
        return;
      }

      try {
        await updateCartItem(item.catalogItemId, item.quantity);
      } catch {
        item.quantity = prevQty;
      }
    } else {
      await removeItem(id);
    }
  }

  return { items, loading, load, addItem, removeItem, removeItems, increaseQty, decreaseQty };
}
