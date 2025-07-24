<template>
  <div class="align-center">
    <v-select
      v-bind="selectAttrs"
      :label="label"
      :style="{ width }"
      variant="underlined"
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
const props = defineProps({
  label: {
    type: String,
    default: 'select',
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
  addEmptySelect: {
    type: Boolean,
    default: true,
  },
  attrName: {
    type: Object,
    default: () => ({ id: '', name: '' }),
  },
});
const attrs = useAttrs();
const selectAttrs = computed(() => {
  const tmpAttrs = { ...attrs };
  if (!Array.isArray(tmpAttrs.items)) {
    tmpAttrs.items = [];
  }
  if (props.addEmptySelect) {
    tmpAttrs.items = [props.attrName, ...tmpAttrs.items];
  }
  return tmpAttrs;
});
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
::v-deep(.v-select *) {
  pointer-events: all !important;
}
</style>
