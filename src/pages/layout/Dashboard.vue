<template>
  <v-app>
    <TopNavbar @toggle="toggleDrawer" />
    <SideBar :drawer="drawer" :rail="rail" @update:drawer="drawer = $event" />
    <SettingBar v-model:setting="setting" />
    <MainContent v-model:setting="setting" />
  </v-app>
</template>
<script setup>
import { useDisplay } from 'vuetify';

const drawer = ref(true);
const rail = ref(false);
const setting = ref(false);
const display = useDisplay();

function toggleDrawer() {
  if (display.smAndDown.value) {
    drawer.value = !drawer.value;
  } else {
    rail.value = !rail.value;
  }
}
</script>
<style scoped></style>
