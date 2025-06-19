<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="center">
    <template v-slot:activator="{ props }">
      <v-text-field
        v-bind="props"
        v-model="formattedDate"
        :label="label"
        :readonly="true"
        :style="style"
        :error-messages="errorMessages"
        :hide-details="isHideDetails"
        prepend-inner-icon="mdi-calendar"
        :class="customClass"
      />
    </template>

    <div class="position-relative">
      <v-date-picker
        v-model="model"
        :color="color"
        :width="xs ? width - 30 : 'auto'"
        height="auto"
        show-adjacent-months
        title=""
        @update:model-value="onDateChange"
      />
      <v-btn
        class="position-absolute top-0 right-0"
        color="white"
        icon="mdi-close"
        size="small"
        variant="text"
        @click="menu = false"
      ></v-btn>
    </div>
  </v-menu>
</template>

<script setup>
import { ref, watch, defineProps, defineExpose } from "vue";
import { useDisplay } from "vuetify";

// Props
const props = defineProps({
  modelValue: [String, Date],
  label: String,
  color: String,
  errorMessages: [String, Array],
  isHideDetails: { type: Boolean, default: true },
  style: Object,
  customClass: String,
});

// Emit
const emit = defineEmits(["update:modelValue"]);

// Vuetify display
const { width, xs } = useDisplay();

// Refs
const model = ref(props.modelValue ? new Date(props.modelValue) : null);
const formattedDate = ref(formatDate(model.value));
const menu = ref(false);

// Expose ref if needed
defineExpose({ model });

// Watcher for syncing props and local state
watch(
  () => props.modelValue,
  (val) => {
    model.value = val ? new Date(val) : null;
    formattedDate.value = formatDate(model.value);
  },
  { immediate: true }
);

watch(model, (val) => {
  emit("update:modelValue", val);
  formattedDate.value = formatDate(val);
  menu.value = false;
});

// Handle date change
function onDateChange(val) {
  model.value = val;
}

// Format date
function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const month = `0${d.getMonth() + 1}`.slice(-2);
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
@media only screen and (max-width: 600px) {
  .v-overlay__content:has(> .v-date-picker) {
    left: 0 !important;
  }
}
</style>
