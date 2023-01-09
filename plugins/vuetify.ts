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
      defaultTheme: 'dark',
    }
  });
  nuxt.vueApp.use(vuetify);
});