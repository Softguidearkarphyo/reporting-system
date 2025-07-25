export const isRgbActive = ref(false);
export const borderClass = computed(() =>
  isRgbActive.value ? 'gradientborder' : ''
);
