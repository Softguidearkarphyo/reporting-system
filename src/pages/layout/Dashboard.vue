<template>
  <v-container>
    <TopNavbar />
    <v-row no-gutters>
      <v-col cols="12" md="2">
        <SideBar />
      </v-col>
      <v-col cols="12" md="10" class="pa-4">
        <MainContent />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import SideBar from '../../components/sidebar/SideBar.vue';
import TopNavbar from '../layout/TopNavbar.vue';
import MainContent from '../layout/MainContent.vue';
</script>
