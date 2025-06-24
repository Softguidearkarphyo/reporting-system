<template>
  <v-navigation-drawer
    :model-value="props.drawer"
    app
    clipped
    :temporary="$vuetify.display.smAndDown"
  >
    <v-list nav>
      <v-list-item
        v-for="(item, index) in navbars"
        :key="index"
        :to="item.path"
        link
        exact
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
      <v-menu :location="location">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({ drawer: Boolean });
const location = ref('end');

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
  font-weight: bold !important;
}
</style>
