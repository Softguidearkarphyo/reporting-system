<template>
  <v-app>
    <v-main
      class="d-flex justify-center align-center fill-height"
      style="background: #e3f2fd"
    >
      <v-container>
        <v-row justify="center">
          <v-col cols="12" xs="10" sm="8" md="6" lg="4" xl="3">
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
                  <v-icon size="36" color="primary">mdi-lock</v-icon>
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
                  width="371px"
                  class="mb-7"
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
                  width="371px"
                  class="mb-10"
                ></BaseTextField>

                <v-card-actions class="justify-center pa-0">
                  <BaseButton type="submit" width="100%">LOGIN</BaseButton>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth.js';

import { onMounted } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const router = useRouter();
const authStore = useAuthStore();

const { loginStaff, isLoggedIn, staffName, staffRole } = authStore;

const username = ref('');
const password = ref('');
const error = ref('');
onMounted(() => {
  theme.global.name.value = 'light';
});

const handleLogin = async () => {
  error.value = '';
  try {
    await authStore.login(username.value, password.value);
    router.push('/reporting-system/dashboard');
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response) {
        error.value = e.response.data.message || 'Login failed';
      } else if (e.request) {
        error.value = 'API server not responding';
      } else {
        error.value = 'Login error: ' + e.message;
      }
    } else {
      error.value = 'Unexpected login error';
    }
  }
};
</script>

<style scoped></style>
