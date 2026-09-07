import { useAuthStore } from '@/stores/auth/auth.js';
import { profileImgPath } from '@/utils/helper';

export async function initPlugin() {
  const authStore = useAuthStore();
  if (localStorage.getItem('token')) {
    try {
      await authStore.fetchStaff();
    } catch (error) {
      console.warn('Initial auth fetch failed:', error);
      await authStore.logout();
    }
  }
}
