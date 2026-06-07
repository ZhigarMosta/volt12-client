import type { FavoriteItem } from '~/types/favorite';
import type { CartItemImage } from '~/types/cart';

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

function mapApiItem(raw: any, apiBase: string): FavoriteItem {
  const ci = raw.catalog_item ?? raw.catalogItem ?? {};
  const rawImages: any[] =
    ci.images ?? ci.catalogItemImages ?? ci.catalog_item_images ?? [];

  const images: CartItemImage[] = rawImages
    .map((img: any, idx: number) => {
      const link = img.img_link ?? img.imgLink ?? '';
      if (!link) return null;
      const url = /^https?:\/\//i.test(link)
        ? link
        : `${apiBase}/${link.replace(/^\/+/, '')}`;
      return {
        url,
        alt: img.alt ?? '',
        position: typeof img.position === 'number' ? img.position : idx,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.position - b.position) as CartItemImage[];

  return {
    id: raw.id,
    catalogItemId: ci.id,
    name: ci.name ?? '',
    price: ci.price ?? 0,
    slug: ci.slug ?? '',
    images,
  };
}

export async function getFavoritesList(): Promise<FavoriteItem[]> {
  const apiBase = getApiBase();
  try {
    const res = await $fetch<{ success: boolean; items: any[] }>(
      `${apiBase}/volt12/favorites/list`,
      { credentials: 'include' }
    );
    return (res.items ?? []).map((i) => mapApiItem(i, apiBase));
  } catch {
    return [];
  }
}

export async function addToFavorites(catalogItemId: number): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/favorites/add`, {
    method: 'POST',
    credentials: 'include',
    body: { catalog_item_id: catalogItemId },
  });
}

export async function removeFavoriteItem(id: number): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/favorites/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function removeFromFavorites(catalogItemId: number): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/favorites/remove`, {
    method: 'POST',
    credentials: 'include',
    body: { catalog_item_id: catalogItemId },
  });
}

export async function removeManyFavoriteItems(ids: number[]): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/favorites/remove-many`, {
    method: 'DELETE',
    credentials: 'include',
    body: { ids },
  });
}
