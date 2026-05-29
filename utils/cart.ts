import type { CartItem } from '~/types/cart';
import {
  getCartList,
  addToCart as apiAdd,
  updateCartItem,
  removeCartItem,
  removeManyCartItems,
  clearCart as apiClear,
} from '~/services/cartApi';

export function useCart() {
  const items = ref<CartItem[]>([]);
  const loading = ref(false);

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
    // оптимистичное удаление
    const prev = [...items.value];
    items.value = items.value.filter((i) => i.id !== id);
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
    // оптимистичное удаление
    items.value = items.value.filter((i) => !set.has(i.id));
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
    // оптимистичный апдейт
    item.quantity += 1;
    try {
      await updateCartItem(id, item.quantity);
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
      try {
        await updateCartItem(id, item.quantity);
      } catch {
        item.quantity = prevQty;
      }
    } else {
      await removeItem(id);
    }
  }

  async function clearAll() {
    const prev = [...items.value];
    items.value = [];
    try {
      await apiClear();
    } catch {
      items.value = prev;
    }
  }

  return { items, loading, load, addItem, removeItem, removeItems, increaseQty, decreaseQty, clearAll };
}
