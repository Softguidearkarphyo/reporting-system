import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/route';
import { createPinia } from 'pinia';
import api from './plugins/axios';

import './assets/fonts/font.css';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(createPinia());
app.config.globalProperties.$axios = api;
app.mount('#app');
