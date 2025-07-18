<template>
  <v-app>
    <TopNavbar v-model:drawer="drawer" />
    <SideBar :drawer="drawer" />
    <SettingBar v-model:setting="setting" />
    <MainContent v-model:setting="setting" />
  </v-app>
</template>
<script setup>
const drawer = ref(true);
const setting = ref(false);
</script>
<style scoped></style>
