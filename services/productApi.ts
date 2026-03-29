import type {
  Product,
  PopularCatalog,
  Catalog,
  CatalogItemsParams,
  CatalogItemsFilters,
  CatalogItemsResponse,
  CatalogCharacteristics,
  Feedback
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
