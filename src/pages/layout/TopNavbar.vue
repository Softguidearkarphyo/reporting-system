<template>
  <v-app-bar color="surface" app dark clipped-left>
    <v-app-bar-nav-icon @click="toggle">
      <v-icon>mdi-view-headline</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>SOFTGUIDE</v-toolbar-title>
    <v-app-bar-nav-icon @click="setLang">
      <v-icon>mdi-translate</v-icon>
    </v-app-bar-nav-icon>
    <ProfileIcon />
  </v-app-bar>
</template>
<script setup>
import ProfileIcon from '../../components/navbar/ProfileIcon.vue';
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const props = defineProps({ drawer: Boolean });
const emit = defineEmits(['update:drawer']);
const toggle = () => {
  emit('update:drawer', !props.drawer);
};
const currentLang = ref(localStorage.getItem('lang') || locale.value);
locale.value = currentLang.value;

watch(currentLang, (newLang) => {
  locale.value = newLang;
  localStorage.setItem('lang', newLang);
});

function setLang() {
  currentLang.value = currentLang.value === 'en' ? 'ja' : 'en';
}
</script>
<style scoped>
.v-toolbar-title {
  font-weight: bold !important;
  color: rgb(var(--v-theme-secondary));
}
::v-deep(.v-icon) {
  color: rgb(var(--v-theme-secondary)) !important;
}
</style>
