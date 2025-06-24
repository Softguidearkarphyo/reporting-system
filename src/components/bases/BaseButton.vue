<template>
  <v-btn
    :class="addClass"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    v-bind="attrs"
    :rounded="round"
  >
    <template v-if="icon" #prepend>
      <v-icon dark left>{{ icon }}</v-icon>
    </template>
    <slot />
  </v-btn>
</template>
<script setup>
import { useAttrs } from 'vue';
defineProps({
  color: {
    type: String,
    default: 'primary',
  },
  variant: {
    type: String,
    default: 'elevated',
  },
  addClass: {
    type: Array,
    default: () => ['ma-2'],
  },
  icon: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  round: {
    type: String,
    default: 'xs',
  },
});
const attrs = useAttrs();
</script>
<style scoped>
::v-deep(.v-btn__content) {
  color: white !important;
}
</style>
