export default defineNuxtConfig({
    runtimeConfig: {
        public: {apiBase: 'http://127.0.0.1:8000'}
    },
    css: ['~/assets/css/reset.css', '~/assets/css/variables.css'],
    modules: ['@nuxtjs/tailwindcss'],
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
})
