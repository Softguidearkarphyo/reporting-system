import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/route';
import { createPinia } from 'pinia';
import api from './plugins/axios';

import './assets/fonts/font.css';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
import toastification from './plugins/toastification';
import './assets/toast.css';

import { createI18n } from 'vue-i18n';
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
app.use(createPinia());
app.use(toastification);
app.use(i18n);
app.config.globalProperties.$axios = api;
app.mount('#app');
