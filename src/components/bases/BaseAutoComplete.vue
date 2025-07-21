<template>
  <v-autocomplete
    v-bind="attrs"
    closable-chips
    multiple
    :label="label"
    :items="items"
    :width="width"
    class="mt-n2"
    :model-value="modelValue"
    variant="underlined"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:prepend>
      <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
    </template>
    <template #selection="{ item, index }">
      <v-chip
        v-if="index === 0 && items.length !== modelValue.length"
        :class="{ 'text-truncate': chipWidth }"
        :style="chipResizeWidth ? { maxWidth: chipResizeWidth } : {}"
      >
        {{ item.title }}
      </v-chip>
      <span
        v-if="index === 1 && items.length !== modelValue.length"
        class="grey--text text-caption"
      >
        (+{{ modelValue.length - 1 }} more)
      </span>
      <v-chip v-if="index === 0 && items.length === modelValue.length">
        ーー {{ t('common.all') }} ーー
      </v-chip>
    </template>
    <slot />
  </v-autocomplete>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    required: true,
  },
  label: {
    required: false,
    default: 'select',
  },
  width: {
    type: String,
    required: false,
    default: '400',
  },
  prependIcon: [String, Object],
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
const attrs = useAttrs();
const { t } = useI18n();
const chipResizeWidth = computed(() => {
  if (props.modelValue?.length > 1 && props.chipWidth) {
    const selectCount = props.modelValue.length;
    const extraCount = selectCount - 1;
    const charCount = extraCount.toString()?.length;
    if (selectCount > 1 && charCount > 1) {
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
::v-deep(.text-truncate .v-chip__content) {
  overflow: hidden;
  text-overflow: ellipsis !important;
  white-space: nowrap;
  display: inline-block;
}
.v-autocomplete .v-field .v-field__input {
  flex-wrap: nowrap !important;
}
</style>
