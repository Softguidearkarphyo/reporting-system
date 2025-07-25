<template>
  <div class="align-center">
    <v-select
      v-bind="{ ...attrs }"
      :items="items"
      :label="label"
      multiple
      :clearable="clearable"
      variant="underlined"
      :style="{ width }"
      :item-title="itemTitle"
      :item-value="itemValue"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #prepend>
        <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
      </template>

      <template #selection="{ item, index }">
        <v-chip
          v-if="index === 0 && items.length !== modelValue.length"
          :class="{ 'text-truncate': !!chipResizeWidth }"
          :style="chipResizeWidth ? { maxWidth: chipResizeWidth } : {}"
        >
          {{ item.title }}
        </v-chip>
        <span
          v-if="index === 1 && items.length !== modelValue.length"
          class="grey--text text-caption"
        >
          (+{{ modelValue.length - 1 }} others)
        </span>
        <v-chip v-if="index === 0 && items.length === modelValue.length">
          ーー All ーー
        </v-chip>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
  label: String,
  clearable: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '300px',
  },
  itemTitle: {
    type: String,
    default: 'name',
  },
  itemValue: {
    type: String,
    default: 'id',
  },
  prependIcon: String,
  prependIconColor: {
    type: String,
    default: 'primary',
  },
  chipWidth: {
    type: Number,
    required: false,
    default: undefined,
  },
});

defineEmits(['update:modelValue']);

const attrs = useAttrs();
const chipResizeWidth = computed(() => {
  if (props.modelValue?.length > 1 && props.chipWidth) {
    const selectCount = props.modelValue.length;
    const extraCount = selectCount - 1;
    const charCount = extraCount.toString()?.length;
    if (charCount > 1) {
      return props.chipWidth - 5 * (charCount - 1) + 'px';
    }
    return props.chipWidth + 'px';
  }
  return undefined;
});
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
::v-deep(.text-truncate) .v-chip__content {
  overflow: hidden;
  text-overflow: ellipsis !important;
  white-space: nowrap;
  display: inline-block;
}
::v-deep(.v-select--multiple .v-field__input) {
  flex-wrap: nowrap !important;
}
::v-deep(.v-select *) {
  pointer-events: all !important;
}
</style>
