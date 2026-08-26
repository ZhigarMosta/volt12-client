export interface LegalPage {
  id: number;
  name: string;
  slug: string;
  /** HTML из редактора админки, вставляется через v-html */
  text: string;
  /** Дата последней правки в формате YYYY-MM-DD */
  updated_at: string | null;
}

export interface LegalPagesResponse {
  items: LegalPage[];
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

// Отдаёт только опубликованные страницы, уже в порядке табов — на фронте не сортируем.
// Данные публичные, credentials не нужны.
export async function getLegalPages(): Promise<LegalPage[]> {
  const apiBase = getApiBase();
  const res = await $fetch<LegalPagesResponse>(`${apiBase}/volt12/legal_pages`);
  return res.items ?? [];
}
