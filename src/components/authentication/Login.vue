<template>
  <v-app>
    <v-main
      class="d-flex justify-center align-center"
      style="height: 100vh; background: #e3f2fd"
    >
      <v-card
        class="pa-6"
        elevation="10"
        rounded="lg"
        width="100%"
        max-width="420"
        style="box-shadow: 0 10px 30px rgba(33, 150, 243, 0.2)"
      >
        <div class="d-flex justify-center mb-5">
          <v-avatar size="64" color="transparent">
            <v-icon size="36" class="gradient-icon">mdi-lock</v-icon>
          </v-avatar>
        </div>

        <v-form @submit.prevent="handleLogin">
          <BaseTextField
            v-model="username"
            label="username"
            type="text"
            variant="plain"
            dense
            autocomplete="username"
            prependIcon="mdi-account"
            hide-details
          ></BaseTextField>
          <BaseTextField
            v-model="password"
            label="password"
            type="password"
            variant="plain"
            dense
            autocomplete="current-password"
            prependIcon="mdi-lock"
            hide-details
          ></BaseTextField>

          <v-card-actions class="justify-center pa-0">
            <BaseButton type="submit" width="100%">LOGIN</BaseButton>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/auth/auth.js';
import { mapActions, mapGetters } from 'pinia';
import axios from 'axios';

export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  computed: {
    ...mapGetters(useAuthStore, [
      'loginStaff',
      'isLoggedIn',
      'staffName',
      'staffRole',
    ]),
  },

  methods: {
    ...mapActions(useAuthStore, ['login']),
    async handleLogin() {
      this.error = '';
      try {
        await this.login(this.username, this.password);
        this.$router.push('/dashboard');
      } catch (e) {
        if (axios.isAxiosError(e)) {
          alret('oops');
          if (e.response) {
            this.error = e.response.data.message || 'Login failed';
          } else if (e.request) {
            this.error = 'API server not responding';
          } else {
            this.error = 'Login error: ' + e.message;
          }
        } else {
          this.error = 'Unexpected login error';
        }
      }
    },
  },
};
</script>

<style scoped>
.gradient-icon {
  background: linear-gradient(90deg, #02e2f1, #5de6f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 1px 1px #02e2f1(33, 150, 243, 0.5));
}

.gradient-btn:hover {
  background: linear-gradient(90deg, #1976d2, #1e88e5);
}
</style>
