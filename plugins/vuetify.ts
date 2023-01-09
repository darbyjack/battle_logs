import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createVuetify } from "vuetify";

export default defineNuxtPlugin((nuxt) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
          },
        },
      },
    },  
  });
  nuxt.vueApp.use(vuetify);
});