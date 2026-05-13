import type {
  Product,
  PopularCatalog,
  Catalog,
  CatalogItemsParams,
  CatalogItemsFilters,
  CatalogItemsResponse,
  CatalogCharacteristics,
  Feedback,
  ServicesResponse
} from '~/types/product';

/**
 * Получает базовый URL API из runtime config
 */
function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

/**
 * Получает список популярных товаров
 */
export async function getPopularProducts(): Promise<Product[]> {
  const apiBase = getApiBase();
  return await $fetch<Product[]>(`${apiBase}/volt12/popular_catalog_items`);
}

/**
 * Получает список популярных каталогов
 */
export async function getPopularCatalogs(): Promise<PopularCatalog[]> {
  const apiBase = getApiBase();
  return await $fetch<PopularCatalog[]>(`${apiBase}/volt12/popular_catalogs`);
}

/**
 * Получает список всех каталогов
 */
export async function getCatalogs(): Promise<Catalog[]> {
  const apiBase = getApiBase();
  return await $fetch<Catalog[]>(`${apiBase}/volt12/catalogs`);
}

/**
 * Получает характеристики каталога (с группами и без)
 */
export async function getCatalogCharacteristics(catalogId: number): Promise<CatalogCharacteristics> {
  const apiBase = getApiBase();
  return await $fetch<CatalogCharacteristics>(`${apiBase}/volt12/catalog_characteristics`, {
    method: 'POST',
    body: { catalogId }
  });
}

/**
 * Получает товары из каталога с фильтрами и пагинацией
 */
export async function getCatalogItems(params: CatalogItemsFilters): Promise<CatalogItemsResponse> {
  const apiBase = getApiBase();
  return await $fetch<CatalogItemsResponse>(`${apiBase}/volt12/catalog_items`, {
    method: 'POST',
    body: params
  });
}

/**
 * Получает отзывы с карт
 */
export async function getFeedbackFromMap(): Promise<Feedback[]> {
  const apiBase = getApiBase();
  return await $fetch<Feedback[]>(`${apiBase}/volt12/feedback_from_map`);
}

/**
 * Получает URL изображения продукта
 */
export function getProductImageUrl(product: Product): string {
  const apiBase = getApiBase();
  if (product.catalogItemImages?.length > 0) {
    return `${apiBase}/${product.catalogItemImages[0].img_link}`;
  }
  return '/icons/test.png';
}

/**
 * Получает Title изображения продукта
 */
export function getProductImageTitle(product: Product): string | undefined {
  if (product.catalogItemImages?.length > 0) {
    return product.catalogItemImages[0].title;
  }
  return undefined;
}

export async function addToCompare(catalogItemId: number): Promise<void> {
  const apiBase = getApiBase();
  await $fetch(`${apiBase}/volt12/compare/add`, {
    method: 'POST',
    credentials: 'include',
    body: { catalog_item_id: catalogItemId }
  });
}

export async function getCompareList(): Promise<any[]> {
  const apiBase = getApiBase();
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>(`${apiBase}/volt12/compare/list`, {
      credentials: 'include'
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getServices(params: {
  service_group_id?: number | null;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ServicesResponse> {
  const apiBase = getApiBase();
  try {
    return await $fetch<ServicesResponse>(`${apiBase}/volt12/services`, {
      method: 'POST',
      body: {
        service_group_id: params.service_group_id ?? null,
        search: params.search ?? '',
        page: params.page ?? 1,
        limit: params.limit ?? 12,
      }
    });
  } catch {
    return {
      items: [],
      groups: [],
      meta: { total_items: 0, total_pages: 0, current_page: 1, limit: 12 }
    };
  }
}
