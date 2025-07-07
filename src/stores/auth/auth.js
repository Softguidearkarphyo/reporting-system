import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/plugins/axios';

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
      localStorage.setItem('staff-role', staff.value.role);
    } catch (error) {
      // handle or rethrow error so component can handle
      throw error;
    }
  }

  async function fetchStaff() {
    try {
      const res = await api.get('/staff');
      staff.value = res.data;
    } catch (error) {
      // handle or rethrow error so component can handle
      throw error;
    }
  }

  function logout() {
    token.value = null;
    staff.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('staff-role');
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
