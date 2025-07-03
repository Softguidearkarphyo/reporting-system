// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    staff: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    loginStaff: (state) => state.staff,
    isLoggedIn: (state) => !!state.token,
    staffName: (state) => (state.staff ? state.staff.name : ''),
    staffRole: (state) => (state.staff ? state.staff.role : ''),
  },
  actions: {
    async login(username, password) {
      const res = await api.post('/login', { username, password });
      //   const res = await this.$axios.post('/login', { username, password });
      this.token = res.data.token;
      this.staff = res.data.staff;
      localStorage.setItem('token', this.token);
      localStorage.setItem('staff-role', this.staff.role);
    },

    async fetchStaff() {
      const res = await api.get('/staff');
      this.staff = res.data;
    },

    logout() {
      this.token = null;
      this.staff = null;
      localStorage.removeItem('token');
      localStorage.removeItem('staff-role');
    },
  },
});
