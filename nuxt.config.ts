export default defineNuxtConfig({
    devServer: {
        host: '127.0.0.1'
    },
    app: {
        head: {
            htmlAttrs: { lang: 'ru' }
        }
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8100',
            // Абсолютный адрес сайта для canonical и og:url; в проде задаётся через NUXT_PUBLIC_SITE_URL
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000'
        }
    },
    site: {
        // Используется модулем sitemap для абсолютных URL
        url: process.env.NUXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000',
        name: 'Мастер 12 Вольт',
    },
    sitemap: {
        // Динамические URL (категории, товары, услуги) приходят из API бэкенда,
        // поэтому sitemap обновляется сам при добавлении контента (кэш 10 минут)
        sources: ['/api/__sitemap__/urls'],
        exclude: ['/cart', '/checkout', '/profile', '/orders', '/orders/**', '/compare', '/favorites'],
        cacheMaxAgeSeconds: 600,
    },
    css: ['~/assets/css/reset.css', '~/assets/css/variables.css'],
    modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@pinia/nuxt', '@nuxtjs/sitemap'],
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
        {
            path: '~/widgets',
            pathPrefix: false,
        },
    ],
})