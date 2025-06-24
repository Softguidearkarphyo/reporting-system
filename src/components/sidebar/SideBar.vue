<template>
  <v-navigation-drawer
    :model-value="props.drawer"
    app
    clipped
    :temporary="$vuetify.display.smAndDown"
  >
    <v-list v-for="navbar in navbars" :key="navbar.title" nav>
      <v-list-item :to="navbar.path" link exact>
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
    title: 'dashboard',
    path: '/report/dashboard',
  },
  {
    title: 'reports',
    path: '/report/show',
  },
  {
    title: 'weekly work time',
    path: '/report/member',
  },
  {
    title: 'add member',
    path: '/report/addmember',
  },
  {
    title: 'member reports',
    path: '/report/showProject',
  },
  {
    title: 'project menpower',
    path: '/report/showMenPower',
  },
  {
    title: '6 months summary',
    path: '/report/showProjectWithDate',
  },
  {
    title: 'reporting',
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
