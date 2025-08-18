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
  async function login(username, password, lat, lon) {
    try {
      const res = await api.post('/login', { username, password, lat, lon });
      token.value = res.data.token;
      staff.value = res.data.staff;
      localStorage.setItem('token', token.value);
      sessionStorage.setItem('staffname', staff.value.eng_name);
      const profileImg =
        staff.value?.staff_image_url || profileImgPath(staff.value.eng_name);
      sessionStorage.setItem('profileImg', profileImg);
      sessionStorage.setItem('role', staff.value.role);
    } catch (error) {
      token.value = null;
      staff.value = null;
      localStorage.removeItem('token');
      sessionStorage.removeItem('staffname');
      sessionStorage.removeItem('profileImg');
      sessionStorage.removeItem('role');
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

  async function setStaff(newStaff) {
    staff.value = newStaff;
    sessionStorage.setItem('staffname', staff.value.eng_name);
    const profileImg = profileImgPath(staff.value.eng_name);
    sessionStorage.setItem('profileImg', profileImg);
    sessionStorage.setItem('role', staff.value.role);
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
    setStaff,
  };
});
