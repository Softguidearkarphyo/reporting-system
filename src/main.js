import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import router from './routes/route';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import './assets/fonts/font.css';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');
