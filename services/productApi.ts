import type { Product, PopularCatalog, CatalogItemsParams } from '~/types/product';

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
  const API_BASE_URL = getApiBase();
  return await $fetch<Product[]>(`${API_BASE_URL}/volt12/popular_catalog_items`);
}

/**
 * Получает URL изображения продукта
 */
export function getProductImageUrl(product: Product): string {
  const API_BASE_URL = getApiBase();
  if (product.catalogItemImages && product.catalogItemImages.length > 0) {
    return `${API_BASE_URL}/${product.catalogItemImages[0].img_link}`;
  }
  return '/icons/test.png';
}

/**
 * Получает Title изображения продукта
 */
export function getProductImageTitle(product: Product): string {
    const API_BASE_URL = getApiBase();
    if (product.catalogItemImages && product.catalogItemImages.length > 0) {
        return product.catalogItemImages[0].title
    }
}

export interface CatalogItemsResponse {
  items: Product[];
}

/**
 * Получает список популярных каталогов
 */
export async function getPopularCatalogs(): Promise<PopularCatalog[]> {
  const API_BASE_URL = getApiBase();
  return await $fetch<PopularCatalog[]>(`${API_BASE_URL}/volt12/popular_catalogs`);
}

/**
 * Получает товары из каталога
 */
export async function getCatalogItems(params: CatalogItemsParams): Promise<Product[]> {
  const API_BASE_URL = getApiBase();
  const response = await $fetch<CatalogItemsResponse>(`${API_BASE_URL}/volt12/catalog_items`, {
    method: 'POST',
    body: {
      catalogId: params.catalogId,
      limit: params.limit
    }
  });
  return response.items;
}
