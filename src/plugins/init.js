import { useAuthStore } from '@/stores/auth/auth.js';

export async function initPlugin() {
  const authStore = useAuthStore();
  await authStore.fetchStaff();
}
