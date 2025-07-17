<template>
  <v-navigation-drawer
    :model-value="props.drawer"
    app
    clipped
    :temporary="$vuetify.display.smAndDown"
    color="surface"
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
          <!-- <v-icon>{{ item.icon }}</v-icon> -->
          <v-icon :icon="item.icon" size="20" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- Admin Setting  -->
      <v-list-group v-if="role === ADMIN" v-model="group" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" rounded density="compact" class="mb-1">
            <template v-slot:prepend>
              <v-icon icon="tabler:IconSettings" size="20" />
            </template>
            <v-list-item-title>{{
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
          density="compact"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="20" />
            <!-- <v-icon>{{ item.icon }}</v-icon> -->
            <!-- <v-icon icon="tabler:IconEdit" size="20" color="primary" /> -->
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <v-list-subheader class="mx-4 font-weight-bold text-font">
        <v-icon left color="primary">mdi-palette</v-icon>
        {{ $t('sidebar.theme') }}
      </v-list-subheader>
      <div class="d-flex align-center pa-2 gap-2">
        <v-menu offset-y>
          <template #activator="{ props: paletteProps }">
            <v-btn
              v-bind="paletteProps"
              variant="outlined"
              class="rounded-lg mx-1 border-2 text-capitalize"
              color="secondary"
            >
              <v-icon>mdi-palette-outline</v-icon>
              <v-icon
                v-if="selectedColor"
                :color="colorThemes[selectedColor].light"
                class="ml-2"
              >
                mdi-circle
              </v-icon>
            </v-btn>
          </template>
          <v-list
            class="py-0 color"
            lines="one"
            density="compact"
            min-width="120"
          >
            <v-list-item
              v-for="(color, name) in colorThemes"
              :key="name"
              @click="setTheme(name)"
              :class="{ 'v-list-item--active': selectedColor === name }"
            >
              <template #prepend>
                <v-icon
                  :color="color.light"
                  :class="{ 'selected-theme-icon': selectedColor === name }"
                >
                  mdi-circle
                </v-icon>
              </template>
              <v-list-item-title class="text-capitalize ml-2">
                {{ name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          variant="outlined"
          class="rounded-lg mx-1 border-2 text-capitalize"
          color="secondary"
          @click="setLightTheme"
        >
          <v-icon size="25">mdi-weather-sunny</v-icon>
        </v-btn>
        <v-btn
          variant="outlined"
          class="rounded-lg mx-1 border-2 text-capitalize"
          color="secondary"
          @click="setDarkTheme"
        >
          <v-icon size="20">mdi-moon-waning-crescent</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import { colorThemes } from '../../custom-theme/color';
import { useAuthStore } from '@/stores/auth/auth.js';
import { ADMIN } from '@/utils/constant';

const { t } = useI18n();
const authStore = useAuthStore();
const props = defineProps({ drawer: Boolean });
const group = ref(true);
const role = ref(authStore.staffRole);

const theme = useTheme();
const selectedColor = ref(localStorage.getItem('selectedColor') || 'limeGreen');

const setTheme = (colorName) => {
  const newThemes = {
    light: {
      ...theme.themes.value.light,
      colors: {
        ...theme.themes.value.light.colors,
        primary: colorThemes[colorName].light,
        secondary: colorThemes[colorName].secondaryLight,
      },
    },
    dark: {
      ...theme.themes.value.dark,
      colors: {
        ...theme.themes.value.dark.colors,
        primary: colorThemes[colorName].dark,
        secondary: colorThemes[colorName].secondaryDark,
      },
    },
  };

  theme.themes.value = newThemes;

  selectedColor.value = colorName;
  localStorage.setItem('selectedColor', colorName);

  requestAnimationFrame(() => {
    theme.global.name.value = theme.global.name.value;
  });
};

onMounted(() => {
  setTheme(selectedColor.value);
});

const init = () => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) theme.global.name.value = savedTheme;
};
const setLightTheme = () => {
  theme.global.name.value = 'light';
  localStorage.setItem('app-theme', 'light');
};

const setDarkTheme = () => {
  theme.global.name.value = 'dark';
  localStorage.setItem('app-theme', 'dark');
};
onMounted(init);

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
<style scoped>
.v-navigation-drawer {
  position: fixed !important;
  height: 93vh !important;
}

.v-theme--dark .color {
  border: 1px solid rgba(173, 173, 173, 0.336) !important;
}

.v-list-item-title {
  font-size: 13px !important;
  text-transform: uppercase !important;
  margin-left: 10px !important;
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
  padding-inline-start: 18px !important;
}
</style>
