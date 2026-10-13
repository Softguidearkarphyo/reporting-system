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
        v-bind="{ ...activatorProps, ...$attrs }"
        :model-value="formattedValue"
        :style="{ width: textFieldWidth }"
        :label="label"
        readonly
        :disabled="disabled"
        variant="underlined"
        @click="menu = true"
      >
        <template v-slot:prepend>
          <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
        </template>
      </v-text-field>
    </template>

    <VueDatePicker
      :model-value="internalTime"
      @update:model-value="onSelect"
      time-picker
      inline
      hide-input-icon
      no-calendar
      :auto-apply="false"
      :time-picker-options="{
        hours: { min: 0, max: 23, step: 1 },
        minutes: { min: 0, max: 59, step: 1 }
      }"
    />
  </v-menu>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: null,
  },
  label: { 
    type: String, 
    default: 'Time' 
  },
  width: { 
    type: String, 
    default: '400px' 
  },
  textWidth: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  prependIcon: [String, Object],
  prependIconColor: {
    type: String,
    default: 'primary',
  },
});

const emit = defineEmits(['update:modelValue', 'input', 'change']);
const menu = ref(false);
const internalTime = ref(null);

const textFieldWidth = computed(() => props.textWidth || props.width);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const parts = val.split(':').map(Number);
      if (parts.length >= 2 && !parts.some(isNaN)) {
        const date = new Date();
        date.setHours(parts[0], parts[1], parts[2] || 0);
        internalTime.value = date;
      } else {
        internalTime.value = null;
      }
    } else {
      internalTime.value = null;
    }
  },
  { immediate: true }
);

const formattedValue = computed(() => {
  if (!(internalTime.value instanceof Date) || isNaN(internalTime.value)) {
    return '';
  }
  return internalTime.value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
});

const formatTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

const onSelect = (val) => {
  let date;
  if (val && typeof val === 'object' && 'hours' in val) {
    date = new Date();
    date.setHours(val.hours, val.minutes, val.seconds || 0);
  } else if (val instanceof Date) {
    date = val;
  } else {
    return;
  }

  if (isNaN(date.getTime())) return;

  internalTime.value = date;

  const formatted = formatTime(date);
  emit('update:modelValue', formatted);
  emit('input', formatted);  
  emit('change', formatted);
  menu.value = false;
};
</script>

<style scoped>
:deep(.dp__outer_menu_wrap) {
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 12px;
  min-width: 180px;
  overflow: visible !important;
  z-index: 9999 !important;
}

:deep(.dp__time_col) {
  width: 48px;
  margin: 0 6px;
}

:deep(.dp__time_col_reg) {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.87);
  transition: background 0.2s;
}

:deep(.dp__active_time) {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 6px;
  font-weight: 500;
}
</style>