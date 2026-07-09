export interface FooterServiceItem {
  slug: string;
  name: string;
}

export interface FooterServicesResponse {
  items: FooterServiceItem[];
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export async function getFooterServices(): Promise<FooterServiceItem[]> {
  const apiBase = getApiBase();
  const res = await $fetch<FooterServicesResponse>(`${apiBase}/volt12/services/footer`);
  return res.items ?? [];
}
