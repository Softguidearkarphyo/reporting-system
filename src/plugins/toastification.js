import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default {
  install(app) {
    app.use(Toast, {
      position: POSITION.TOP_CENTER,
      timeout: 1800,
      closeOnClick: false,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      draggable: false,
      draggablePercent: 0.6,
      hideProgressBar: true,
      closeButton: false,
      icon: true,
      rtl: false,
    });
  },
};
