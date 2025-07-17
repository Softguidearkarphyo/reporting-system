<template>
  <div class="align-center">
    <v-select
      v-bind="attrs"
      :items="items"
      :item-value="itemValue"
      :item-title="itemText"
      :label="label"
      :style="{ width }"
      @update:modelValue="handleChange"
    >
      <template v-slot:prepend>
        <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
      </template>
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
  itemValue: {
    type: String,
    default: 'id',
  },
  itemText: {
    type: String,
    default: 'name',
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
const emit = defineEmits(['change']);
const handleChange = (value) => {
  emit('change', value);
};
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
