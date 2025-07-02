<template>
  <v-app>
    <TopNavbar v-model:drawer="drawer" />
    <SideBar :drawer="drawer" />
    <MainContent />
  </v-app>
</template>
<script setup>
import SideBar from '../../components/sidebar/SideBar.vue';
import TopNavbar from '../layout/TopNavbar.vue';
import MainContent from '../layout/MainContent.vue';
import { ref } from 'vue';
const drawer = ref(true);
</script>
<style scoped>
::v-deep(.v-main) {
  background-color: #f6f6f6 !important;
}
.Vue-Toastification__toast {
  min-width: 290px !important;
  min-height: 45px !important;
  padding: 12px 12px !important;
}
.Vue-Toastification__toast--error {
  background-color: hsl(0, 89%, 33%) !important;
}
.Vue-Toastification__toast-body {
  color: white !important;
  text-align: center;
}
</style>
