import type { SeoData } from '~/types/product';

export const SITE_NAME = 'Мастер 12 Вольт';

export interface SeoInput {
  /** Полный title страницы (вместе с «— Мастер 12 Вольт») */
  title?: string | null;
  /** Сырое описание: можно передавать HTML — теги будут вырезаны, текст обрезан до ~160 символов */
  description?: string | null;
  keywords?: string | null;
  /** URL картинки для превью в соцсетях (og:image). Относительный путь будет дополнен до абсолютного */
  image?: string | null;
  noindex?: boolean;
  nofollow?: boolean;
  /** Абсолютный canonical URL; если не задан — siteUrl + путь страницы без query-параметров */
  canonical?: string | null;
  type?: 'website' | 'product';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

export function buildSeoDescription(raw?: string | null, max = 160): string | undefined {
  if (!raw) return undefined;
  const text = stripHtml(raw);
  return text ? truncate(text, max) : undefined;
}

/**
 * Единая точка SEO для страницы: title/description/keywords, robots
 * (index/noindex, follow/nofollow), canonical и автогенерация Open Graph
 * и Twitter Card из тех же данных.
 *
 * Блок seo из API можно передавать напрямую через seoFromApi().
 */
export function useSeo(input: () => SeoInput) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string).replace(/\/+$/, '');

  const canonical = computed(() => input().canonical || `${siteUrl}${route.path}`);
  const robots = computed(() =>
    `${input().noindex ? 'noindex' : 'index'}, ${input().nofollow ? 'nofollow' : 'follow'}`);
  const description = computed(() => buildSeoDescription(input().description));
  const image = computed(() => {
    const img = input().image;
    if (!img) return undefined;
    if (/^https?:\/\//i.test(img)) return img;
    return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`;
  });

  useSeoMeta({
    title: () => input().title ?? undefined,
    description: () => description.value,
    keywords: () => input().keywords ?? undefined,
    robots: () => robots.value,
    ogTitle: () => input().title ?? undefined,
    ogDescription: () => description.value,
    ogImage: () => image.value,
    ogUrl: () => canonical.value,
    ogType: () => input().type ?? 'website',
    ogSiteName: SITE_NAME,
    ogLocale: 'ru_RU',
    twitterCard: 'summary_large_image',
    twitterTitle: () => input().title ?? undefined,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
  });

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  });
}

/**
 * Преобразует блок seo из API в часть SeoInput (title/description/keywords
 * подставляются только если заполнены в админке — иначе остаются fallback'и вызывающего).
 */
export function seoFromApi(seo: SeoData | null | undefined): Partial<SeoInput> {
  if (!seo) return {};
  return {
    ...(seo.meta_title ? { title: seo.meta_title } : {}),
    ...(seo.meta_description ? { description: seo.meta_description } : {}),
    ...(seo.meta_keywords ? { keywords: seo.meta_keywords } : {}),
    ...(seo.canonical_url ? { canonical: seo.canonical_url } : {}),
    noindex: seo.noindex,
    nofollow: seo.nofollow,
  };
}
