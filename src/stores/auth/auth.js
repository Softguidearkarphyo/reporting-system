import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/plugins/axios';
import { profileImgPath } from '@/utils/helper';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null);
  const staff = ref(null);

  // Getters
  const loginStaff = computed(() => staff.value);
  const isLoggedIn = computed(() => !!token.value);
  const staffName = computed(() => (staff.value ? staff.value.name : ''));
  const staffRole = computed(() => (staff.value ? staff.value.role : ''));

  // Actions
  async function login(username, password) {
    try {
      const res = await api.post('/login', { username, password });
      token.value = res.data.token;
      staff.value = res.data.staff;
      localStorage.setItem('token', token.value);
      sessionStorage.setItem('staffname', staff.value.eng_name);
      const profileImg = profileImgPath(staff.value.eng_name);
      sessionStorage.setItem('profileImg', profileImg);
    } catch (error) {
      token.value = null;
      staff.value = null;
      localStorage.removeItem('token');
      sessionStorage.removeItem('staffname');
      sessionStorage.removeItem('profileImg');
      throw error;
    }
  }

  async function fetchStaff() {
    try {
      const res = await api.get('/user');
      staff.value = res.data;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    token.value = null;
    staff.value = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('staffname');
    sessionStorage.removeItem('profileImg');
  }

  return {
    token,
    staff,
    loginStaff,
    isLoggedIn,
    staffName,
    staffRole,
    login,
    fetchStaff,
    logout,
  };
});
