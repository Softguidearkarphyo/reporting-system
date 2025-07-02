<template>
  <v-menu
    v-model="menu"
    min-width="auto"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    location="center"
  >
    <template v-slot:activator="{ props }">
      <div class="mx-auto" :style="{ width }">
        <v-text-field
          :ref="refName"
          v-bind="props"
          :label="label"
          v-model="formattedDate"
          readonly
          @click="menu = true"
        >
          <template v-slot:prepend>
            <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
          </template>
        </v-text-field>
      </div>
    </template>

    <div>
      <v-date-picker
        hide-header
        :style="{ minWidth: minWidth, maxWidth: maxWidth, width: width }"
        show-adjacent-months
        hide-details
        @update:model-value="onDateSelected"
        color="main"
      />
    </div>
  </v-menu>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
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
  modelValue: {
    type: [String, Date],
    required: false,
  },
  refName: {
    type: String,
    default: null,
  },
  tableName: {
    type: String,
    default: 'bodyDataTable',
  },
  prependIcon: [String, Object],
  prependIconColor: {
    type: String,
    default: 'main',
  },
});

const emit = defineEmits(['update:modelValue']);

const menu = ref(false);
const model = ref(props.modelValue ? new Date(props.modelValue) : null);

const formattedDate = ref(formatDate(model.value));

watch(
  () => props.modelValue,
  (val) => {
    model.value = val ? new Date(val) : null;
    formattedDate.value = formatDate(model.value);
  },
  { immediate: true }
);

function onDateSelected(val) {
  model.value = val;
  emit('update:modelValue', val);
  formattedDate.value = formatDate(val);
  menu.value = false;
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
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
  background-color: #00bcd4 !important;
  color: white !important;
}
::v-deep(.v-field__outline::after) {
  border-bottom: 2px solid #00bcd4 !important;
}
</style>
