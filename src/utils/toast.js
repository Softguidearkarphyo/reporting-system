import { useToast } from 'vue-toastification';

const baseToast = useToast();

export const toast = {
  success(message, options = {}) {
    baseToast.success(message, { timeout: 2000, ...options });
  },
  error(message, options = {}) {
    baseToast.error(message, { timeout: 2000, ...options });
  },
};
