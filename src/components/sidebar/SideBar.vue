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
          <v-list-item value="reporting" v-bind="props">
            <v-list-item-title>REPORTING</v-list-item-title>
          </v-list-item>
        </template>

        <v-sheet rounded="md" width="200" elevation="10">
          <v-list class="py-0" lines="one" density="compact">
            <v-list-item
              v-for="(item, index) in secNavbars"
              :key="index"
              :to="item.path"
              link
              exact
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-sheet>
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
]);

const secNavbars = ref([
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
::v-deep(.v-list-item:hover:not(.v-list-item--active)) {
  background-color: rgba(3, 201, 215, 0.2);
  color: #03c9d7 !important;
}

::v-deep(.v-list-item.v-list-item--active) {
  background-color: #03c9d7 !important;
  color: white;
}

::v-deep(.v-list-item.v-list-item--active:hover) {
  background-color: #03c9d7 !important;
  color: white;
}
</style>
