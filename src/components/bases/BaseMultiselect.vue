<template>
  <div class="align-center">
    <v-select
      v-bind="attrs"
      :items="items"
      :label="label"
      :multiple="multiple"
      :chips="chips"
      :clearable="clearable"
      :style="{ width }"
    >
      <template v-slot:prepend>
        <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
      </template>
      <slot />
    </v-select>
  </div>
</template>
<script setup>
import { useAttrs } from 'vue';
defineProps({
  label: {
    type: String,
    default: 'select',
  },
  items: [String, Object],
  multiple: {
    type: Boolean,
    default: true,
  },
  chips: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
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
const attrs = useAttrs();
</script>
<style scoped>
::v-deep(.v-field-label) {
  text-transform: uppercase !important;
  font-weight: 400;
  font-size: 13px;
  transition: color 0.3s ease;
}
::v-deep(.v-field.v-field--focused .v-field__append-inner) {
  color: rgb(var(--v-theme-primary)) !important;
}
::v-deep(.v-field.v-field--focused .v-field-label) {
  color: rgb(var(--v-theme-primary)) !important;
}
::v-deep(.v-field.v-field--focused .v-field__outline) {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
