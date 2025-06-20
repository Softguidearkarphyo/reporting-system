<template>
  <v-navigation-drawer v-if="drawer" app clipped>
    <v-list v-for="navbar in navbars" :key="navbar.title" nav>
      <v-list-item :to="navbar.path" link>
        <v-list-item-title>{{ navbar.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({ drawer: Boolean });

const navbars = ref([
  {
    title: 'DASHBOARD',
    path: '/report/dashboard',
  },
  {
    title: 'REPORTS',
    path: '/report/show',
  },
  {
    title: 'WEEKLY WORK TIME',
    path: '/report/member',
  },
  {
    title: 'ADD MEMBER',
    path: '/report/addmember',
  },
  {
    title: 'MEMBER REPORTS',
    path: '/report/showProject',
  },
  {
    title: 'PROJECT MANPOWER',
    path: '/report/showMenPower',
  },
  {
    title: '6 MONTHS SUMMARY',
    path: '/report/showProjectWithDate',
  },
  {
    title: 'REPORTING',
    path: '/reporting',
  },
]);
</script>
<style scoped>
::v-deep(.v-list-item-title) {
  font-size: 15px !important;
  text-transform: uppercase !important;
}
</style>
