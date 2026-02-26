import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/plugins/axios';
import { profileImgPath } from '@/utils/helper';

export const useAuthStore = defineStore('auth', () => {
  const staff = ref(null);

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
      const res = await api.get('/reporting-system/staff/get'); 
      staff.value = res.data;
      return staff.value;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        staff.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('staff-role');
      }
      throw error;
    }
  }

  async function logout() {
    try {
      staff.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('staff-role');
      sessionStorage.removeItem('profileImg');
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