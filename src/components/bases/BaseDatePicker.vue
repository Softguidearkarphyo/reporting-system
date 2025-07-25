<template>
  <v-menu
    v-model="menu"
    min-width="auto"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    location="center"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-text-field
        :ref="refName"
        v-bind="{ ...activatorProps, ...$attrs }"
        :model-value="$attrs.modelValue ?? $attrs.value"
        @update:model-value="$emit('update:modelValue', $event)"
        :style="{ width }"
        :label="label"
        readonly
        variant="underlined"
        @click="menu = true"
      >
        <template v-slot:prepend>
          <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
        </template>
      </v-text-field>
    </template>
    <div>
      <v-date-picker
        hide-header
        :style="{ minWidth: minWidth, maxWidth: maxWidth, width: width }"
        show-adjacent-months
        hide-details
        @update:model-value="onDateSelected"
        color="primary"
        :multiple="multiple"
        :disabled="disabled"
      />
    </div>
  </v-menu>
</template>
<script setup>
const props = defineProps({
  modelValue: [String, Date],
  label: String,
  color: String,
  minWidth: {
    type: String,
    default: '190px',
  },
  maxWidth: {
    type: String,
    default: '310px',
  },
  width: {
    type: String,
    default: '400px',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  refName: {
    type: String,
    default: null,
  },
  tableName: {
    type: String,
    default: 'bodyDataTable',
  },
  multiple: {
    type: Boolean,
    default: false,
  },

  modelValue: {
    type: [String, Date],
    required: false,
  },
  prependIcon: [String, Object],
  prependIconColor: {
    type: String,
    default: 'primary',
  },
});

const emit = defineEmits(['update:modelValue']);

const menu = ref(false);
const model = ref(props.modelValue ? new Date(props.modelValue) : null);

watch(
  () => props.modelValue,
  (val) => {
    model.value = val ? new Date(val) : null;
  },
  { immediate: true }
);

function onDateSelected(val) {
  model.value = val;
  emit('update:modelValue', formatDate(val));
  menu.value = false;
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
</script>
<style scoped>
.v-overlay__content:has(> .v-date-picker) {
  min-width: auto !important;
}
.v-picker-title {
  padding: 0 !important;
}
::v-deep(.v-date-picker-month__day-btn:hover) {
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
::v-deep(.v-field__outline::after) {
  border-bottom: 2px solid rgb(var(--v-theme-primary)) !important;
}
::v-deep(.v-label) {
  font-weight: 400;
  font-size: 13px;
  transition: color 0.3s ease;
  text-transform: uppercase !important;
}
</style>
