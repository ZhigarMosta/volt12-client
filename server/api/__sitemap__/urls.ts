import { defineSitemapEventHandler } from '#imports';

interface BackendSitemapItem {
  loc: string;
  lastmod?: string;
}

/**
 * Источник динамических URL для sitemap.xml: категории, товары и услуги
 * из API бэкенда (опубликованные и не закрытые noindex).
 */
export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig();
  const apiBase = (config.public.apiBase as string).replace(/\/+$/, '');

  try {
    const res = await $fetch<{ items: BackendSitemapItem[] }>(`${apiBase}/volt12/sitemap`);
    return (res.items ?? []).map((item) => ({
      loc: item.loc,
      ...(item.lastmod ? { lastmod: item.lastmod } : {}),
    }));
  } catch {
    return [];
  }
});
