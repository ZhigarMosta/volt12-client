/**
 * robots.txt редактируется в админке (Sylius) и хранится в БД бэкенда.
 * Строка Sitemap добавляется автоматически, если не задана вручную.
 * Кэш 5 минут — правки в админке применяются с этой задержкой.
 */
export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBase = (config.public.apiBase as string).replace(/\/+$/, '');
  const siteUrl = (config.public.siteUrl as string).replace(/\/+$/, '');

  let body = 'User-agent: *\nDisallow:';
  try {
    body = await $fetch<string>(`${apiBase}/volt12/robots`, { responseType: 'text' });
  } catch {
    // API недоступен — отдаём разрешающий fallback, чтобы не закрыть сайт от роботов
  }

  if (!/^\s*sitemap:/im.test(body)) {
    body = `${body.trimEnd()}\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  }

  setHeader(event, 'content-type', 'text/plain; charset=utf-8');
  return body;
}, { maxAge: 300, swr: true });
