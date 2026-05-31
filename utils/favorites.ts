import type { FavoriteItem } from '~/types/favorite';
import {
  getFavoritesList,
  addToFavorites as apiAdd,
  removeFavoriteItem,
  removeManyFavoriteItems,
} from '~/services/favoritesApi';

export function useFavorites() {
  const items = ref<FavoriteItem[]>([]);
  const loading = ref(true);

  async function load() {
    loading.value = true;
    try {
      items.value = await getFavoritesList();
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
    try {
      await removeFavoriteItem(id);
    } catch {
      items.value = prev;
    }
  }

  async function removeItems(ids: number[]) {
    if (!ids.length) return;
    const set = new Set(ids);
    const prev = [...items.value];
    items.value = items.value.filter((i) => !set.has(i.id));
    try {
      await removeManyFavoriteItems(ids);
    } catch {
      items.value = prev;
    }
  }

  return { items, loading, load, addItem, removeItem, removeItems };
}
