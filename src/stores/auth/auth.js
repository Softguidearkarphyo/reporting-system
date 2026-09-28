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
  const staffName = computed(() => (staff.value ? staff.value.eng_name : ''));
  const staffRole = computed(() => (staff.value ? String(staff.value.role) : localStorage.getItem('staff-role')));

  async function login(username, password) {
    try {
      await api.get('../sanctum/csrf-cookie');
      const res = await api.post('/login', { username, password });

      staff.value = res.data.staff;
      const profileImg = staff.value?.staff_image_url 
        || (staff.value?.staff_image ? `http://localhost:8080/images/staffs/${staff.value.staff_image}` : null) 
        || profileImgPath(staff.value.eng_name);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('staff-id', String(staff.value.id));
      localStorage.setItem('staff-role', String(staff.value.role));
      sessionStorage.setItem('profileImg', profileImg);

      return staff.value;
    } catch (error) {
      throw error;
    }
  }

  async function fetchStaff() {
    try {
      const token = localStorage.getItem('token');
      const savedStaffId = localStorage.getItem('staff-id');

      if (!token) {
        staff.value = null;
        return null;
      }

      const res = await api.post('/reporting-system/staff/get');

      if (Array.isArray(res.data)) {
        if (savedStaffId) {
          staff.value = res.data.find((s) => String(s.id) === String(savedStaffId)) || null;
        } else {
          staff.value = null;
        }
      } else {
        staff.value = res.data?.data || res.data;
      }

      if (staff.value?.id) {
        localStorage.setItem('staff-id', String(staff.value.id));
      }
      if (staff.value?.role !== undefined) {
        localStorage.setItem('staff-role', String(staff.value.role));
      }

      return staff.value;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        staff.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('staff-role');
        localStorage.removeItem('staff-id');
        sessionStorage.removeItem('profileImg');

        if (router) {
          router.push('/login');
        }
      }
      return null;
    }
  }

  async function logout() {
    staff.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('staff-role');
    localStorage.removeItem('staff-id');
    sessionStorage.removeItem('profileImg');
    if (router) {
      router.push('/login');
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