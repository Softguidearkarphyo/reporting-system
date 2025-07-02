<template>
  <v-navigation-drawer
    :model-value="props.drawer"
    app
    clipped
    :temporary="$vuetify.display.smAndDown"
    color="side"
  >
    <v-list nav>
      <v-list-item
        v-for="(item, index) in navbars"
        :key="index"
        :to="item.path"
        link
        exact
        density="compact"
      >
        <template v-slot:prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- Admin Setting  -->
      <v-list-group v-model="group" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" rounded density="compact" class="mb-1">
            <template v-slot:prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>Admin Settings</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="(item, index) in settings"
          :key="index"
          :to="item.path"
          link
          exact
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({ drawer: Boolean });
const group = ref(true);

const navbars = ref([
  {
    title: 'dashboard',
    path: '/reporting-system/dashboard',
    icon: 'mdi-view-dashboard-outline',
  },
  {
    title: 'member lists',
    path: '/reporting-system/member-lists',
    icon: 'mdi-account-group-outline',
  },
  {
    title: 'leave records',
    path: '/reporting-system/leaves',
    icon: 'mdi-account-cancel-outline',
  },
  {
    title: 'reporting',
    path: '/reporting-system/reporting',
    icon: 'mdi-timer-plus-outline',
  },
]);

const settings = ref([
  {
    title: 'reports',
    path: '/reporting-system/show',
    icon: 'mdi-chart-line',
  },
  {
    title: 'weekly work time',
    path: '/reporting-system/members',
    icon: 'mdi-account-clock-outline',
  },
  {
    title: 'member reports',
    path: '/reporting-system/show-projects',
    icon: 'mdi-account-details-outline',
  },
  {
    title: 'project menpower',
    path: '/reporting-system/show-men-powers',
    icon: 'mdi-account-multiple-outline',
  },
  {
    title: '6 months summary',
    path: '/reporting-system/show-project-date',
    icon: 'mdi mdi-clock-fast',
  },
  {
    title: 'add project',
    path: '/reporting-system/add-projects',
    icon: 'mdi-web',
  },
  {
    title: 'add member',
    path: '/reporting-system/add-members',
    icon: 'mdi-account-plus-outline',
  },
  {
    title: 'add leave',
    path: '/reporting-system/add-leaves',
    icon: 'mdi-account-arrow-right-outline',
  },
  {
    title: 'member fine',
    path: '/reporting-system/member-fine',
    icon: 'mdi-account-alert-outline',
  },
]);
</script>
<style scoped>
/* .v-list-item {
  color: #11142d !important;
} */
.v-list-item-title {
  font-size: 13px !important;
  text-transform: uppercase !important;
  margin-left: 10px !important;
}
.v-list-item:hover:not(.v-list-item--active) {
  background-color: #03c9d733 !important;
  color: #03c9d7 !important;
}

.v-list-item.v-list-item--active {
  background-color: #03c9d7 !important;
  color: white;
}

.v-list-item.v-list-item--active:hover {
  background-color: #03c9d7 !important;
  color: white;
}
.v-icon {
  font-size: 18px;
}
::v-deep(.v-list-item__spacer) {
  display: none !important;
}
.v-list-group__items .v-list-item {
  padding-inline-start: 18px !important;
}
</style>
