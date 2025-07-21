<template>
  <v-navigation-drawer
    :rail="drawer"
    permanent
    app
    clipped
    elevation="0"
    :width="isRail ? 90 : 318"
    color="surface"
    left
    @update:rail="(val) => (isRail = val)"
  >
    <div class="scroll-container">
      <PerfectScrollbar>
        <v-list class="py-4 pa-6">
          <v-list-item
            v-for="(item, index) in navbars"
            :key="index"
            :to="item.path"
            link
            exact
            density="compact"
            class="mb-1"
            rounded
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon" size="20" />
            </template>
            <v-list-item-title class="px-9">{{ item.title }}</v-list-item-title>
          </v-list-item>

          <!-- Admin Setting  -->
          <v-list-group v-if="role === ADMIN" v-model="group" no-action>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                rounded
                density="compact"
                class="mb-1"
              >
                <template v-slot:prepend>
                  <v-icon
                    icon="tabler:IconSettings"
                    class="d-flex justify-center admin_icon"
                    size="20"
                  />
                </template>
                <v-list-item-title class="px-9">{{
                  $t('sidebar.adminsetting')
                }}</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(item, index) in settings"
              :key="index"
              :to="item.path"
              link
              exact
              rounded
              density="compact"
              class="mb-1"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon" class="child_icon" size="20" />
              </template>
              <v-list-item-title class="px-9">{{
                item.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>
      </PerfectScrollbar>
    </div>
  </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { ADMIN } from '@/utils/constant';

const { t } = useI18n();
const authStore = useAuthStore();
defineProps({ drawer: Boolean });
const group = ref(true);
const role = ref(authStore.staffRole);
const isRail = ref(false);

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
]);
</script>
<!-- <style scoped>
.navigation-drawer-fixed {
  position: fixed !important;
  top: 0;
  bottom: 0;
  height: 100vh !important;
  /* padding: 20px; */
  box-sizing: border-box;
}

.scroll-container {
  height: calc(100vh - 170px) !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.v-navigation-drawer--rail {
  width: 90px !important;
}

.v-theme--dark .color {
  border: 1px solid rgba(173, 173, 173, 0.336) !important;
}

.v-list-item-title {
  font-size: 13px !important;
  text-transform: uppercase !important;
  margin-left: 10px !important;
}
.v-icon {
  margin-inline-start: 2px !important;
}
.v-list-item:hover:not(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.v-list-item.v-list-item--active {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white;
}

.v-list-item.v-list-item--active:hover {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white;
}
.v-icon {
  font-size: 18px;
}
::v-deep(.v-list-item__spacer) {
  display: none !important;
}
.v-list-group__items .v-list-item {
  padding-inline-start: 19px !important;
  margin: 0 0 2px;
}
</style> -->

<style scoped>
.navigation-drawer-fixed {
  position: fixed !important;
  top: 0;
  bottom: 0;
  height: 100vh !important;
}

.scroll-container {
  height: calc(100vh - 170px) !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.v-navigation-drawer--rail .v-list-item {
  justify-content: center;
  padding-left: 0;
}

.v-navigation-drawer--rail .v-icon {
  margin-inline-start: 38px !important;
}

.v-navigation-drawer--rail {
  width: 90px !important;
}

.v-navigation-drawer--rail .admin_icon {
  margin-inline-start: 60px !important;
}

.v-navigation-drawer--rail .v-list-group__items .v-list-item .child_icon {
  margin-left: 9px !important;
}

.v-navigation-drawer--rail .v-list-group__items .v-list-item {
  padding-inline: 0 !important;
  justify-content: center;
}

.v-list-item-title {
  font-size: 13px !important;
  text-transform: uppercase !important;
}

.v-list-item.v-list-item--active {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.v-icon {
  font-size: 18px;
}

.v-navigation-drawer--rail .v-list-item:hover:not(.v-list-item--active) {
  background-color: none;
  color: rgb(var(--v-theme-primary)) !important;
}

.v-list-item.v-list-item--active {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

::v-deep(.v-list-item__spacer) {
  display: none !important;
}

.v-list-group__items .v-list-item {
  padding-inline-start: 19px !important;
  margin: 0 0 2px;
}

.v-theme--dark .color {
  border: 1px solid rgba(173, 173, 173, 0.336) !important;
}
</style>
