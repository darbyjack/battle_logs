// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: [
      "vuetify/lib/styles/main.sass",
      "@mdi/font/css/materialdesignicons.min.css",
    ],
    build: {
      transpile: ["vuetify", "chart.js"],
    },
    modules: ['nuxt-font-loader'],
    fontLoader: {
      local: [
        {
          src: '/fonts/roboto.woff2',
          family: 'Roboto',
          weight: '100 300 400 500 700 900',
          display: 'swap',
          style: 'normal',
          fallback: 'sans-serif',
          class: 'font-roboto'
        }
      ]
    }
  })