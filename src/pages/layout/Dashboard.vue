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
  background-color: #e3f2fd !important;
}
</style>
