import { createApp } from "vue";
import index from "./pages/index.vue";
import { createVuetify } from "vuetify";
import router from "./routes/route";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(index);
app.use(router);
app.use(vuetify);
app.mount("#app");
