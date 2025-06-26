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

        <v-form>
          <BaseTextField
            label="username"
            type="text"
            variant="plain"
            dense
            autocomplete="username"
            prependIcon="mdi-account"
            hide-details
            width="371px"
          ></BaseTextField>
          <BaseTextField
            label="password"
            type="password"
            variant="plain"
            dense
            autocomplete="current-password"
            prependIcon="mdi-lock"
            hide-details
            width="371px"
          ></BaseTextField>

          <v-card-actions class="justify-center pa-0">
            <BaseButton to="/report/dashboard" @click="login" width="100%"
              >LOGIN</BaseButton
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import BaseTextField from '../bases/BaseTextField.vue';
import BaseButton from '../bases/BaseButton.vue';

function login() {
  alert('Login clicked!');
}
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
