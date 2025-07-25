<template>
  <v-navigation-drawer
    location="right"
    app
    clipped
    width="288"
    elevation="0"
    :model-value="props.setting"
    temporary
    @update:model-value="(val) => emit('update:setting', val)"
    color="surface"
  >
    <v-list-subheader class="mx-4">
      <v-icon left color="primary">mdi-palette</v-icon>
      {{ $t('sidebar.theme') }}
    </v-list-subheader>

    <v-row class="d-flex justify-center ma-0 pa-2" dense>
      <v-col
        v-for="(color, name) in colorThemes"
        :key="name"
        cols="4"
        class="d-flex justify-center"
      >
        <v-sheet class="rounded-lg text-center px-3 py-2">
          <v-btn
            variant="text"
            @click="setTheme(name)"
            :class="{ 'selected-theme': selectedColor === name }"
            icon
            color="secondary"
          >
            <v-avatar :color="color.light" size="23"
              ><svg
                v-if="selectedColor === name"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-tabler icon-tabler-check"
                width="18px"
                height="18px"
                viewBox="0 0 25 23"
                stroke-width="3"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                color="white"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12l5 5l10 -10"></path>
              </svg>
            </v-avatar>
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <v-list-subheader class="mx-4">
      <v-icon left color="primary">mdi-palette</v-icon>
      Button Layout
    </v-list-subheader>
    <v-row class="d-flex justify-center ma-0 pa-2" dense>
      <v-col>
        <v-sheet class="rounded-lg text-center px-3 py-2">
          <v-btn variant="text">Middle</v-btn>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="rounded-lg text-center px-3 py-2">
          <v-btn variant="text">End</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <v-list-subheader class="mx-4">
      <v-icon left color="primary">mdi-palette</v-icon>
      Card Border with
    </v-list-subheader>
    <v-row class="d-flex justify-center ma-0 pa-2" dense>
      <v-col>
        <v-sheet class="rounded-lg text-center px-3 py-2" @click="defaultClick">
          <v-btn variant="text">Border</v-btn>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="rounded-lg text-center px-3 py-2" @click="rgbClick">
          <v-btn variant="text">RGB</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <v-list-subheader class="mx-4">
      <v-icon left color="primary">mdi-palette</v-icon>
      Card with
    </v-list-subheader>
    <v-row class="d-flex justify-center ma-0 pa-2" dense>
      <v-col>
        <v-sheet class="rounded-lg text-center px-3 py-2">
          <v-btn variant="text">Shadow</v-btn>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="rounded-lg text-center px-3 py-2">
          <v-btn variant="text">None</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>
<script setup>
import { isRgbActive } from '@/utils/border';
import { useTheme } from 'vuetify';
import { colorThemes } from '../../custom-theme/color';
const props = defineProps({
  setting: Boolean,
});
const emit = defineEmits(['update:setting']);
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
  const savedState = localStorage.getItem('RGB-Active');
  if (savedState !== null) {
    isRgbActive.value = savedState ? JSON.parse(savedState) : false;
  }
});

function rgbClick() {
  isRgbActive.value = true;
  localStorage.setItem('RGB-Active', JSON.parse(true));
}

function defaultClick() {
  isRgbActive.value = false;
  localStorage.setItem('RGB-Active', JSON.parse(false));
}
</script>

<style scoped>
.v-navigation-drawer {
  position: fixed !important;
  height: 100vh !important;
}
.v-sheet {
  border: 1px solid rgba(var(--v-theme-font), 0.1) !important;
  box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08);
}
.v-list-subheader {
  font-weight: bold;
  text-transform: uppercase;
}
.v-sheet:hover {
  scale: 1.06;
}
</style>
