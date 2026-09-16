import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/plugins/axios';
import { profileImgPath } from '@/utils/helper';
import { useRouter } from 'vue-router'; 

export const useAuthStore = defineStore('auth', () => {
  const staff = ref(null);
  const router = useRouter();

  const loginStaff = computed(() => staff.value);
  const isLoggedIn = computed(() => !!staff.value);
  const staffName = computed(() => (staff.value ? staff.value.name : ''));
  const staffRole = computed(() => (staff.value ? staff.value.role : ''));

  async function login(username, password) {
    try {
      await api.get('../sanctum/csrf-cookie');
      const res = await api.post('/login', { username, password });

      staff.value = res.data.staff;
      const profileImg = staff.value?.staff_image_url || profileImgPath(staff.value.eng_name);

      localStorage.setItem('token', res.data.token);
      sessionStorage.setItem('profileImg', profileImg);
      localStorage.setItem('staff-role', staff.value.role);

      return staff.value;
    } catch (error) {
      throw error;
    }
  }



  async function fetchStaff() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        staff.value = null;
        return null;
      }

      const res = await api.post('/reporting-system/staff/get');

      staff.value = res.data;
      // staff.value = res.data?.data || res.data;

      if (staff.value?.role !== undefined) {
        localStorage.setItem('staff-role', String(staff.value.role));
      }

      return staff.value;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        staff.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('staff-role');
        sessionStorage.removeItem('profileImg');

        if (router) {
          router.push('/login');
        }
      }
      return null;
    }
  }
  async function logout() {
    try {
      staff.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('staff-role');
      sessionStorage.removeItem('profileImg');
      if (router) {
        router.push('/login');
      }
    } catch (error) {
      throw error;
    }
  }

  return {
    staff,
    loginStaff,
    isLoggedIn,
    staffName,
    staffRole,
    login,
    fetchStaff,
    logout
  };
});