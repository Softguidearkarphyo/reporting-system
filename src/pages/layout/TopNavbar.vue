<template>
  <v-app-bar color="surface" elevation="0" flat clipped-left>
    <v-app-bar-nav-icon @click="toggle">
      <v-icon>mdi-view-headline</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>SOFTGUIDE</v-toolbar-title>
    <v-app-bar-nav-icon @click="toggleTheme" color="secondary">
      <v-icon size="25" v-if="!isDark">mdi-weather-sunny</v-icon>
      <v-icon size="20" v-else>mdi-moon-waning-crescent</v-icon>
    </v-app-bar-nav-icon>
    <v-app-bar-nav-icon @click="setLang">
      <v-icon>mdi-translate</v-icon>
    </v-app-bar-nav-icon>
    <ProfileIcon />
  </v-app-bar>
</template>
<script setup>
import ProfileIcon from '../../components/navbar/ProfileIcon.vue';
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const props = defineProps({ drawer: Boolean });
const emit = defineEmits(['update:drawer']);
const theme = useTheme();
const toggle = () => {
  emit('update:drawer', !props.drawer);
};
const currentLang = ref(localStorage.getItem('lang') || locale.value);
locale.value = currentLang.value;

const isDark = computed(() => theme.global.name.value === 'dark');

const init = () => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) theme.global.name.value = savedTheme;
};
const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem('app-theme', newTheme);
};
onMounted(init);

watch(currentLang, (newLang) => {
  locale.value = newLang;
  localStorage.setItem('lang', newLang);
});

function setLang() {
  currentLang.value = currentLang.value === 'en' ? 'ja' : 'en';
}
</script>
<style scoped>
.v-app-bar {
  position: fixed !important;
}
.v-toolbar-title {
  font-weight: bold !important;
  color: rgb(var(--v-theme-secondary));
}
::v-deep(.v-icon) {
  color: rgb(var(--v-theme-secondary)) !important;
}
.v-theme--light .v-app-bar {
  border-bottom: 1px solid rgba(97, 97, 97, 0.336) !important;
}
.v-theme--dark .v-app-bar {
  border-bottom: 1px solid rgba(173, 173, 173, 0.336) !important;
}
</style>
