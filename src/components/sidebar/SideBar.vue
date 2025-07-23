<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="emit('update:drawer', $event)"
    :rail="!display.smAndDown.value && rail"
    :permanent="!display.smAndDown.value"
    :temporary="display.smAndDown.value"
    app
    clipped
    color="surface"
  >
    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, index) in navbars"
        :key="index"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.title"
        link
        exact
        density="compact"
        class="mb-1"
        rounded
      ></v-list-item>

      <v-list-group v-if="role === ADMIN">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="tabler:IconSettings"
            :title="$t('sidebar.adminsetting')"
            class="list-item mb-1"
          ></v-list-item>
        </template>
        <v-list-item
          v-for="(item, index) in settings"
          :key="index"
          :to="item.path"
          :title="item.title"
          :value="item.title"
          link
          exact
          density="compact"
          class="mb-1"
          rounded
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { ADMIN } from '@/utils/constant';
import { useDisplay } from 'vuetify';

const display = useDisplay();
const { t } = useI18n();
const authStore = useAuthStore();
const props = defineProps({
  drawer: Boolean,
  rail: Boolean,
});
const emit = defineEmits(['update:drawer']);
const role = ref(authStore.staffRole);

const navbars = computed(() => [
  {
    title: t('sidebar.dashboard'),
    path: '/reporting-system/dashboard',
    icon: 'tabler:IconLayoutDashboard',
  },
  {
    title: t('sidebar.employeelists'),
    path: '/reporting-system/employee-lists',
    icon: 'tabler:IconUsersGroup',
  },
  {
    title: t('sidebar.leaverecords'),
    path: '/reporting-system/leave-records',
    icon: 'tabler:IconFileReport',
  },
  {
    title: t('sidebar.employeecompetency'),
    path: '/reporting-system/employee-competency',
    icon: 'tabler:IconAward',
  },
  {
    title: t('sidebar.reporting'),
    path: '/reporting-system/reporting',
    icon: 'tabler:IconReport',
  },
]);

const settings = computed(() => [
  {
    title: t('sidebar.reports'),
    path: '/reporting-system/show',
    icon: 'tabler:IconReportAnalytics',
  },
  {
    title: t('sidebar.weeklyworktime'),
    path: '/reporting-system/weekly-work-time',
    icon: 'tabler:IconClockPause',
  },
  {
    title: t('sidebar.employeereports'),
    path: '/reporting-system/employee-reports',
    icon: 'tabler:IconUserStar',
  },
  {
    title: t('sidebar.projectmenpower'),
    path: '/reporting-system/show-men-powers',
    icon: 'tabler:IconUserHexagon',
  },
  {
    title: t('sidebar.sixmonthssummary'),
    path: '/reporting-system/show-project-date',
    icon: 'tabler:IconHexagonNumber6',
  },
  {
    title: t('sidebar.newproject'),
    path: '/reporting-system/new-projects',
    icon: 'tabler:IconWorldPlus',
  },
  {
    title: t('sidebar.newemployee'),
    path: '/reporting-system/new-employee',
    icon: 'tabler:IconUsersPlus',
  },
  {
    title: t('sidebar.newemployeeleave'),
    path: '/reporting-system/new-employee-leave',
    icon: 'tabler:IconTextPlus',
  },
  {
    title: t('sidebar.newfinerecord'),
    path: '/reporting-system/new-fine-record',
    icon: 'tabler:IconFolderPlus',
  },
  {
    title: t('sidebar.newemployeecard'),
    path: '/reporting-system/new-employee-card',
    icon: 'tabler:IconLibraryPlus',
  },
  {
    title: t('sidebar.newemployeeskills'),
    path: '/reporting-system/new-employee-skills',
    icon: 'tabler:IconCubePlus',
  },
  {
    title: t('sidebar.show_project'),
    path: '/reporting-system/show-project-search',
    icon: 'mdi-account-details-outline',
  },
]);
</script>
<style scoped>
::v-deep(.v-navigation-drawer) {
  height: 100vh !important;
  overflow-y: auto !important;
}

::v-deep(.v-list) {
  padding-bottom: 20px;
}

::v-deep(.v-list-item-title) {
  font-size: 13px !important;
  text-transform: uppercase !important;
}

::v-deep(
  .v-navigation-drawer:not(.v-navigation-drawer--rail)
    .v-navigation-drawer__content
) {
  max-width: 100% !important;
}

::v-deep(.v-list-item.v-list-item--active) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

::v-deep(.v-list-item:hover:not(.v-list-item--active)) {
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
.v-list-group__items .v-list-item {
  padding-inline-start: 10px !important;
  margin: 0 0 2px;
}
.v-navigation-drawer--rail .v-list-group__items .v-list-item {
  padding-inline-end: 36px !important;
}
.v-navigation-drawer--rail .v-list-group__items .v-list-item {
  background: transparent !important;
  color: rgb(var(--v-theme-font)) !important;
  box-shadow: none !important;
}

.v-navigation-drawer--rail .v-list-group__items .v-list-item:hover {
  color: rgb(var(--v-theme-primary)) !important;
}
.v-navigation-drawer--rail
  .v-list-group__items
  .v-list-item.v-list-item--active {
  color: rgb(var(--v-theme-primary)) !important;
}
::v-deep(.v-list-item__overlay) {
  all: unset !important;
  display: none !important;
}
</style>
