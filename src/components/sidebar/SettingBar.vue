<template>
  <v-navigation-drawer
    location="right"
    app
    clipped
    width="320"
    elevation="0"
    :model-value="props.setting"
    temporary
    @update:model-value="(val) => emit('update:setting', val)"
    color="surface"
  >
    <v-list-subheader class="mx-4 font-weight-bold text-font">
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
        <v-btn
          variant="outlined"
          @click="setTheme(name)"
          :class="{ 'selected-theme': selectedColor === name }"
          icon
          color="secondary"
          class="rounded-lg border-2 w-100 h-80"
        >
          <v-avatar :color="color.light" size="23"></v-avatar>
        </v-btn>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>
<script setup>
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
});

const init = () => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) theme.global.name.value = savedTheme;
};
onMounted(init);
</script>

<style scoped>
.v-navigation-drawer {
  position: fixed !important;
  height: 100vh !important;
}
</style>
