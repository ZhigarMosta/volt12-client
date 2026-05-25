const RECENTLY_VIEWED_KEY = 'recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

export function useRecentlyViewedIds() {
  return useLocalStorageRef<number[]>(RECENTLY_VIEWED_KEY, []);
}

export function pushRecentlyViewedId(recentlyViewed: Ref<number[]>, productId: number) {
  const next = [productId, ...recentlyViewed.value.filter((id) => id !== productId)];
  recentlyViewed.value = next.slice(0, MAX_RECENTLY_VIEWED);
}
