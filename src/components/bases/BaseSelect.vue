<template>
  <div class="align-center mb-5">
    <v-select
      v-bind="attrs"
      :items="items"
      :label="label"
      :style="{ width }"
    >
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
  width: {
    type: String,
    default: '400px',
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
  color: #03c9d7 !important;
}
::v-deep(.v-field.v-field--focused .v-field-label) {
  color: #03c9d7 !important;
}
::v-deep(.v-field.v-field--focused .v-field__outline) {
  color: #03c9d7 !important;
}
</style>
