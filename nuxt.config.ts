export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
        }
    },
    css: ['~/assets/css/reset.css', '~/assets/css/variables.css'],
    modules: ['@nuxtjs/tailwindcss'],
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
