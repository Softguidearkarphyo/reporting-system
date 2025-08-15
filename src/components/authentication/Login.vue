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
              class="pt-5 pb-5 px-6"
              elevation="8"
              rounded="lg"
              width="100%"
              max-width="420"
              style="box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08)"
            >
              <div class="d-flex justify-center mb-4">
                <v-icon
                  icon="tabler:IconLockFilled"
                  size="36"
                  color="primary"
                />
              </div>
              <Form
                @submit="handleLogin"
                :validation-schema="loginCreateSchema"
              >
                <Field name="username" v-slot="{ field, errorMessage }">
                  <BaseTextField
                    v-bind="field"
                    v-model="username"
                    :label="t('login.username')"
                    type="text"
                    variant="plain"
                    dense
                    autocomplete="username"
                    prependIcon="mdi-account"
                    width="371px"
                    class="mb-3"
                    :error-messages="errorMessage || apiErrors.username"
                  ></BaseTextField>
                </Field>
                <Field name="password" v-slot="{ field, errorMessage }">
                  <BaseTextField
                    v-bind="field"
                    v-model="password"
                    :label="t('login.password')"
                    type="password"
                    variant="plain"
                    dense
                    autocomplete="current-password"
                    prependIcon="mdi-lock"
                    width="371px"
                    class="mb-3"
                    :error-messages="errorMessage || apiErrors.password"
                  ></BaseTextField>
                </Field>

                <v-card-actions class="justify-center pa-0">
                  <BaseButton type="submit" width="100%">LOGIN</BaseButton>
                </v-card-actions>
              </Form>
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
import { loginSchema } from '@/plugins/validations/login.js';
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const theme = useTheme();
const router = useRouter();
const authStore = useAuthStore();

const { loginStaff, isLoggedIn, staffName, staffRole } = authStore;

const username = ref('');
const password = ref('');
const error = ref('');
const apiErrors = reactive({
  username: '',
  password: '',
});

const isEditMode = ref(false);
const loginCreateSchema = computed(() => loginSchema(t, isEditMode.value));
onMounted(() => {
  theme.global.name.value = 'light';
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    locale.value = savedLang;
  }
});

const handleLogin = async () => {
  error.value = '';
  apiErrors.username = '';
  apiErrors.password = '';
  try {
    const pos = await getCurrentPosition();
    await authStore.login(
      username.value,
      password.value,
      pos?.coords?.latitude,
      pos?.coords?.longitude
    );
    router.push('/reporting-system/dashboard');
  } catch (e) {
    if (e.response?.status === 422) {
      if (e.response.data?.message) {
        apiErrors.username = t('validation.username_mismatch');
      }
    } else if (e.response?.status === 401) {
      if (e.response.data?.message) {
        apiErrors.password = t('validation.password_mismatch');
      }
    }
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

const getCurrentPosition = (
  options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};
</script>

<style scoped></style>
