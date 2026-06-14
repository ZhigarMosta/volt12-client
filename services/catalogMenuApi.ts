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
