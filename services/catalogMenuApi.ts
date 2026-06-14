export interface CatalogMenuItem {
  id: number;
  name: string;
  slug: string;
  position: number;
  items: { id: number; name: string; slug: string; position: number }[];
}

export interface CatalogMenuService {
  id: number;
  name: string;
  slug: string;
  position: number;
}

export interface CatalogMenuResponse {
  success: boolean;
  catalogs: CatalogMenuItem[];
  services: CatalogMenuService[];
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export async function getCatalogMenu(): Promise<CatalogMenuResponse> {
  const apiBase = getApiBase();
  return $fetch<CatalogMenuResponse>(`${apiBase}/volt12/catalog-menu`);
}

export interface SearchImage {
  id?: number;
  alt?: string;
  title?: string;
  position?: number;
  img_link?: string;
  imgLink?: string;
}

export interface SearchItem {
  id: number;
  type: 'product' | 'service';
  name: string;
  slug: string;
  img_link: string | SearchImage | null;
}

export interface SearchResponse {
  success: boolean;
  items: SearchItem[];
}

export async function searchMenu(name: string, signal?: AbortSignal): Promise<SearchItem[]> {
  if (!name.trim()) return [];
  const apiBase = getApiBase();
  const res = await $fetch<SearchResponse>(`${apiBase}/volt12/search`, {
    query: { name },
    signal,
  });
  return res.items ?? [];
}

function buildImgUrl(link: string): string {
  if (!link) return '';
  if (/^https?:\/\//i.test(link)) return link;
  const apiBase = getApiBase();
  return `${apiBase}/${link.replace(/^\/+/, '')}`;
}

export function extractImgUrl(source: string | SearchImage | null | undefined): string {
  if (!source) return '';
  if (typeof source === 'string') return buildImgUrl(source);
  const link = source.img_link ?? source.imgLink ?? '';
  return link ? buildImgUrl(link) : '';
}

// Backwards-compat alias
export const resolveImgLink = extractImgUrl;
