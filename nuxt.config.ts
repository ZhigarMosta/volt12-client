export default defineNuxtConfig({
    devServer: {
        host: '127.0.0.1'
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8100'
        }
    },
    css: ['~/assets/css/reset.css', '~/assets/css/variables.css'],
    modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@pinia/nuxt'],
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