<template>
  <v-app-bar app dark clipped-left>
    <v-app-bar-nav-icon @click="toggle">
      <v-icon>mdi-view-headline</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>SOFTGUIDE</v-toolbar-title>
    <v-app-bar-nav-icon @click="toggleTheme">
      <v-icon size="25" v-if="!isDark">mdi-weather-sunny</v-icon>
      <v-icon size="20" v-else>mdi-moon-waning-crescent</v-icon>
    </v-app-bar-nav-icon>
    <ProfileIcon />
  </v-app-bar>
</template>
<script setup>
import ProfileIcon from '../../components/navbar/ProfileIcon.vue';
import { defineProps, defineEmits } from 'vue';
import { useTheme } from 'vuetify';
import { computed } from 'vue';
const props = defineProps({ drawer: Boolean });
const emit = defineEmits(['update:drawer']);
const toggle = () => {
  emit('update:drawer', !props.drawer);
};
const theme = useTheme();
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
</script>
<style scoped>
.v-toolbar-title {
  font-weight: bold !important;
  color: #018a94;
}
::v-deep(.v-icon) {
  color: #018a94 !important;
}
</style>
