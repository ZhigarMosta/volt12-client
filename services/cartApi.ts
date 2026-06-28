import type { CartItem } from '~/types/cart';

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

function mapApiItem(raw: any, apiBase: string): CartItem {
  const ci = raw.catalog_item ?? raw.catalogItem ?? {};
  const rawImages: any[] =
    ci.images ?? ci.catalogItemImages ?? ci.catalog_item_images ?? [];

  const images = rawImages
    .map((img: any, idx: number) => {
      const link = img.img_link ?? img.imgLink ?? '';
      if (!link) return null;
      const url = /^https?:\/\//i.test(link)
        ? link
        : `${apiBase}/${link.replace(/^\/+/, '')}`;
      return {
        url,
        alt: img.alt ?? '',
        title: img.title ?? '',
        position: typeof img.position === 'number' ? img.position : idx,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.position - b.position) as CartItem['images'];

  return {
    id: raw.id ?? ci.id,
    catalogItemId: ci.id,
    name: ci.name ?? '',
    price: ci.price ?? 0,
    slug: ci.slug ?? '',
    images,
    quantity: raw.count ?? raw.quantity ?? 1,
  };
}

export async function getCartList(): Promise<CartItem[]> {
  const apiBase = getApiBase();
  try {
    let localItems: { id: number; count: number }[] = [];
    if (process.client) {
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          const parsed: Record<number, number> = JSON.parse(stored);
          localItems = Object.entries(parsed)
            .map(([id, count]) => ({ id: Number(id), count }))
            .filter(({ id, count }) => !isNaN(id) && count > 0);
        }
      } catch {}
    }

    const res = await $fetch<{ success: boolean; items: any[] }>(
      `${apiBase}/volt12/cart/list`,
      {
        method: 'POST',
        credentials: 'include',
        body: { items: localItems },
      }
    );
    return (res.items ?? []).map((i) => mapApiItem(i, apiBase));
  } catch (e) {
    console.error('[cart] getCartList error:', e);
    return [];
  }
}

export async function addToCart(catalogItemId: number, count = 1): Promise<number | null> {
  const apiBase = getApiBase();
  const res = await $fetch<{ success: boolean; item?: { id: number } }>(`${apiBase}/volt12/cart/add`, {
    method: 'POST',
    credentials: 'include',
    body: { catalog_item_id: catalogItemId, count },
  });
  return res.item?.id ?? null;
}

export async function updateCartItem(catalogItemId: number, count: number): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/cart/update`, {
    method: 'POST',
    credentials: 'include',
    body: { catalog_item_id: catalogItemId, count },
  });
}

export async function removeCartItem(id: number): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/cart/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function removeCartItems(ids: number[]): Promise<number> {
  const apiBase = getApiBase();
  const res = await $fetch<{ success: boolean; removed: number }>(
    `${apiBase}/volt12/cart/remove-many`,
    {
      method: 'DELETE',
      credentials: 'include',
      body: { ids },
    }
  );
  return res.removed ?? 0;
}

export async function removeManyCartItems(ids: number[]): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/cart/remove-many`, {
    method: 'DELETE',
    credentials: 'include',
    body: { ids },
  });
}

export async function clearCart(): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/cart/clear`, {
    method: 'DELETE',
    credentials: 'include',
  });
}
