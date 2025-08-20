import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/route';
import { createPinia } from 'pinia';
import api from './plugins/axios';
import { initPlugin } from './plugins/init';
import 'croppie/croppie.css';
import '../public/fonts/font.css';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
import toastification from './plugins/toastification';
import veeValidatePlugin from './plugins/vee-validate';
import './assets/toast.css';
import './assets/common.css';
import './assets/scrollbar.css';
import { createI18n } from 'vue-i18n';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import en from './locales/en';
import ja from './locales/ja';
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ja,
  },
});
const app = createApp(App);
app.use(router);
app.use(vuetify);
app.component('PerfectScrollbar', PerfectScrollbar);
app.use(createPinia());
app.use(toastification);
app.use(veeValidatePlugin);
app.use(i18n);
app.config.globalProperties.$axios = api;
initPlugin().then(() => {
  app.mount('#app');
});
