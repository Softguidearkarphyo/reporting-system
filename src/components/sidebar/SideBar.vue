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
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <v-list-subheader class="mx-4 font-weight-bold">
        <v-icon left>mdi-palette</v-icon>
        Theme
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
          <v-list class="py-0" lines="one" density="compact" min-width="120">
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
        <v-app-bar-nav-icon @click="toggleTheme" color="secondary">
          <v-icon size="25" v-if="!isDark">mdi-weather-sunny</v-icon>
          <v-icon size="20" v-else>mdi-moon-waning-crescent</v-icon>
        </v-app-bar-nav-icon>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import { colorThemes } from '../../custom-theme/color';
const { t } = useI18n();
const props = defineProps({ drawer: Boolean });
const group = ref(true);

const theme = useTheme();
const selectedColor = ref(localStorage.getItem('selectedColor') || 'teal');

const setTheme = (colorName) => {
  const newThemes = {
    light: {
      ...theme.themes.value.light,
      colors: {
        ...theme.themes.value.light.colors,
        primary: colorThemes[colorName].light,
      },
    },
    dark: {
      ...theme.themes.value.dark,
      colors: {
        ...theme.themes.value.dark.colors,
        primary: colorThemes[colorName].dark,
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

const isDark = computed(() => theme.global.name.value === 'dark');

const init = () => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) theme.global.name.value = savedTheme;
};
const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem('app-theme', newTheme);
};
onMounted(init);

const navbars = computed(() => [
  {
    title: t('sidebar.dashboard'),
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

const settings = computed(() => [
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
