import { useAuthStore } from '@/stores/auth/auth.js';
import { profileImgPath } from '@/utils/helper';

export async function initPlugin() {
  const authStore = useAuthStore();
  await authStore.fetchStaff();
  if (authStore.staff?.id) {
    const staff = authStore.staff;
    sessionStorage.setItem('staffname', staff.eng_name);
    const profileImg = staff.staff_image_url || profileImgPath(staff.eng_name);
    sessionStorage.setItem('profileImg', profileImg);
  }
}
