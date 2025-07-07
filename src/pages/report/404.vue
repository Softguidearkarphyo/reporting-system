<template>
  <v-app>
    <div
      class="error-container"
      :style="{ background: $vuetify.theme.current.colors.background }"
    >
      <div v-for="i in 6" :key="i" class="bubble" :class="`bubble-${i}`"></div>

      <div class="main">
        <h1>404</h1>
        <p>
          {{ t('message.error404Text') }}<br />
          {{ t('message.error404Text2') }}
        </p>
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          to="/reporting-system/dashboard"
          >Go back</v-btn
        >
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import { onMounted } from 'vue';
import { useTheme } from 'vuetify';

const { t, locale } = useI18n();
const theme = useTheme();
onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme');
  const savedLang = localStorage.getItem('lang');
  theme.global.name.value = savedTheme ? 'dark' : 'light';
  if (savedLang) {
    locale.value = savedLang;
  }
});
</script>

<style scoped>
.error-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 5;
  color: rgb(var(--v-theme-font)) !important;
  text-shadow: 0 30px 10px rgba(0, 0, 0, 0.15);
}

p {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 17px;
}

h1 {
  font-size: 95px;
  margin: 0;
}

.bubble {
  background: linear-gradient(#ec5dc1, #d61a6f);
  border-radius: 50%;
  box-shadow: 0 30px 15px rgba(0, 0, 0, 0.15);
  position: absolute;
}

.bubble::before {
  content: '';
  background: linear-gradient(#ec5dc1, #d61a6f);
  border-radius: 50%;
  box-shadow: 0 30px 15px rgba(0, 0, 0, 0.15);
  position: absolute;
}

.bubble-1 {
  background: linear-gradient(#ec5dc1, #d61a6f);
  top: 15vh;
  left: 15vw;
  height: 22vmin;
  width: 22vmin;
}

.bubble-1::before {
  background: rgb(var(--v-theme-primary)) !important;
  width: 13vmin;
  height: 13vmin;
  bottom: -25vh;
  right: -10vmin;
}

.bubble-2 {
  top: 20vh;
  left: 38vw;
  height: 10vmin;
  width: 10vmin;
  background: rgb(var(--v-theme-primary)) !important;
}

.bubble-2::before {
  width: 5vmin;
  height: 5vmin;
  bottom: -10vh;
  left: -8vmin;
}

.bubble-3 {
  background: rgb(var(--v-theme-primary)) !important;
  top: 12vh;
  right: 30vw;
  height: 13vmin;
  width: 13vmin;
}

.bubble-3::before {
  width: 3vmin;
  height: 3vmin;
  bottom: -15vh;
  left: -18vmin;
  z-index: 6;
}

.bubble-4 {
  top: 25vh;
  right: 18vw;
  height: 18vmin;
  width: 18vmin;
}

.bubble-4::before {
  background: rgb(var(--v-theme-primary)) !important;
  width: 7vmin;
  height: 7vmin;
  bottom: -10vmin;
  left: -15vmin;
}

.bubble-5 {
  top: 60vh;
  right: 18vw;
  height: 28vmin;
  width: 28vmin;
}

.bubble-5::before {
  width: 10vmin;
  height: 10vmin;
  bottom: 5vmin;
  left: -25vmin;
}
.bubble-6 {
  background: rgb(var(--v-theme-primary)) !important;
  top: 68vh;
  left: 35vw;
  height: 8vmin;
  width: 8vmin;
}
</style>
