// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    nitro: {
      preset: "node-server",
    },
    css: [
      "vuetify/lib/styles/main.sass",
      "@mdi/font/css/materialdesignicons.min.css",
    ],
    build: {
      transpile: ["vuetify", "chart.js"],
    },
    modules: ['@nuxtjs/google-fonts'],
    googleFonts: {
      families: {
        Roboto: [100,300,400,500,700,900],
      },
    },
  })