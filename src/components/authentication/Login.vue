<template>
  <v-app>
    <v-overlay
      :model-value="isLoading"
      class="align-center justify-center"
      persistent
      scrim="#e3f2fd"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
        width="6"
      ></v-progress-circular>
    </v-overlay>

    <v-main
      class="d-flex justify-center align-center fill-height pa-4 pa-sm-6"
      style="background: #e3f2fd"
    >
      <v-container class="pa-0">
        <v-row justify="center" align="center" no-gutters>
          <v-col cols="12" sm="10" md="8" lg="5" xl="4">
            <v-card
              class="pa-4 pa-sm-6 pa-md-8 mx-auto"
              elevation="8"
              rounded="lg"
              width="100%"
              max-width="440"
              style="box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08)"
            >
              <div class="d-flex justify-center mb-4">
                <v-icon
                  icon="tabler:IconLockFilled"
                  size="36"
                  color="primary"
                />
              </div>

              <!-- General API Error Alert Banner (Server Down, Network Error, Unexpected Error) -->
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                density="compact"
                closable
                class="mb-4 text-caption"
                @click:close="error = ''"
              >
                {{ error }}
              </v-alert>

              <Form
                @submit="handleLogin"
                :validation-schema="loginCreateSchema"
              >
                <!-- Username Field -->
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
                    class="mb-3 w-100"
                    :disabled="isLoading"
                    :error-messages="errorMessage || apiErrors.username"
                  ></BaseTextField>
                </Field>

                <!-- Password Field with Show/Hide Toggle -->
                <Field name="password" v-slot="{ field, errorMessage }">
                  <BaseTextField
                    v-bind="field"
                    v-model="password"
                    :label="t('login.password')"
                    :type="showPassword ? 'text' : 'password'"
                    variant="plain"
                    dense
                    autocomplete="current-password"
                    prependIcon="mdi-lock"
                    @click:append-inner="showPassword = !showPassword"
                    class="mb-3 w-100"
                    :disabled="isLoading"
                    :error-messages="errorMessage || apiErrors.password"
                  ></BaseTextField>
                </Field>

                <!-- Submit Button with Loading Indicator -->
                <v-card-actions class="justify-center pa-0 mt-2">
                  <BaseButton
                    type="submit"
                    block
                    class="w-100"
                    :disabled="isLoading"
                  >
                    LOGIN
                  </BaseButton>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth.js';
import { loginSchema } from '@/plugins/validations/login.js';
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

//loading
const isLoading = ref(false);

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
  
  // loading
  isLoading.value = true;

  try {
    const [lat, lon] = await getCurrentPosition();
    await authStore.login(
      username.value,
      password.value,
      lat,
      lon
    );
    await router.push('/reporting-system/dashboard');
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
  } finally {
    
    isLoading.value = false;
  }
};

const getCurrentPosition = async () => {
  try {
    let lat = 0, lon = 0;
    const response = await axios.get(`http://ip-api.com/json`);
    if (response.data) {
      lat = response.data.lat || 0;
      lon = response.data.lon || 0;
    }
    return [lat, lon];
  } catch (error) {
    console.error('Error fetching location:', error);
    return [0, 0];
  }
};
</script>

<style scoped></style>
