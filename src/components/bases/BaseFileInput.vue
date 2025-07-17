<template>
  <v-file-input
    v-bind="$attrs"
    color="primary"
    :label="label"
    variant="underlined"
    dense
    :style="{ width }"
    :prepend-icon="null"
  >
    <template v-slot:prepend>
      <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
    </template>
    <slot />
  </v-file-input>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

const props = defineProps({
  label: String,
  width: {
    type: String,
    default: '400px',
  },
  prependIcon: [String, Object],
  prependIconColor: {
    type: String,
    default: 'primary',
  },
});
</script>

<style scoped>
::v-deep(.v-label) {
  text-transform: uppercase !important;
  font-weight: 400;
  font-size: 13px;
  transition: color 0.3s ease;
}
::v-deep(input:-webkit-autofill) {
  transition: background-color 9999s ease-in-out 0s;
}
</style>
