import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default {
  install(app) {
    app.use(Toast, {
      position: POSITION.TOP_CENTER,
      timeout: 2000,
      closeOnClick: false,
      pauseOnFocusLoss: true,
      pauseOnHover: false,
      draggable: false,
      hideProgressBar: true,
      closeButton: false,
      icon: true,
      maxToasts: 1,
      newestOnTop: true,
      filterBeforeCreate: (toast, toasts) => {
        if (toasts.filter((t) => t.type === toast.type).length !== 0) {
          return false;
        }
        return toast;
      },
    });
  },
};
