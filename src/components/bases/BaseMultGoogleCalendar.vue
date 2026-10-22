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
        :model-value="formattedValue"
        @update:model-value="$emit('update:modelValue',$event)"
        :style="{ width: textFieldWidth }"
        :label="label"
        readonly
        :disabled="disabled"
        variant="underlined"
        :clearable="clearable"
        :error-messages="errorMessages"
        @click="menu = true"
        @click:clear="$emit('update:modelValue', multiple ? [] : null)"
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
        :model-value="internalValue"
        @update:model-value="onDateSelected"
        color="primary"
        :multiple="multiple"
        :disabled="disabled"
        :allowed-dates="allowedDates"
      />
    </div>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: [String, Date, Array],
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
  textWidth: {
    type: String,
    default: '',
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
  prependIcon: [String, Object],
  prependIconColor: {
    type: String,
    default: 'primary',
  },
  countryCode: {
    type: String,
    default: 'MM',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const menu = ref(false);
const internalValue = ref(null);
const holidays = ref([]);

const textFieldWidth = computed(() => props.textWidth || props.width);

// Display label formatting based on multiple vs single selection
const formattedValue = computed(() => {
  if (!props.modelValue) return '';

  if (props.multiple && Array.isArray(props.modelValue)) {
    const length = props.modelValue.length;
    if (length === 0) return '';
    if (length === 1) return props.modelValue[0];
    return `${props.modelValue[0]} (+${length - 1} more)`;
  }

  return props.modelValue;
});

// Fetch holidays from public API
async function fetchHolidays(year) {
  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/publicholidays/${year}/${props.countryCode}`
    );

    if (!response.ok) {
      console.warn(`Failed to fetch holidays: Server returned status ${response.status}`);
      holidays.value = [];
      return;
    }

    const text = await response.text();
    if (!text) {
      holidays.value = [];
      return;
    }

    const data = JSON.parse(text);
    holidays.value = data.map((h) => h.date);
  } catch (error) {
    console.error('Failed to parse or fetch holidays:', error);
    holidays.value = [];
  }
}

onMounted(() => {
  const currentYear = new Date().getFullYear();
  fetchHolidays(currentYear);
});

// Disable Weekends (Sat/Sun) and Holidays
function allowedDates(date) {
  const d = new Date(date);
  const day = d.getDay();

  // Disable weekends
  if (day === 0 || day === 6) {
    return false;
  }

  // Disable public holidays
  const formatted = formatDate(d);
  if (holidays.value.includes(formatted)) {
    return false;
  }

  return true;
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      internalValue.value = props.multiple
        ? Array.isArray(val)
          ? val.map((d) => new Date(d))
          : [new Date(val)]
        : new Date(val);
    } else {
      internalValue.value = props.multiple ? [] : null;
    }
  },
  { immediate: true }
);

function onDateSelected(val) {
  if (props.multiple) {
    const formattedDates = Array.isArray(val) ? val.map((date) => formatDate(date)) : [];
    emit('update:modelValue', formattedDates);
  } else {
    emit('update:modelValue', formatDate(val));
    menu.value = false;
  }
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