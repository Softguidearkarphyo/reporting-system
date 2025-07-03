<template>
  <div class="align-center mb-5">
    <v-text-field
      v-model="internalValue"
      class="custom-input"
      :label="label"
      :type="inputType"
      :append-inner-icon="
        showToggle
          ? isVisible
            ? 'mdi-eye-off-outline'
            : 'mdi-eye-outline'
          : null
      "
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      variant="plain"
      @click:append-inner="toggleVisibility"
      dense
      hide-details
      :style="{ width }"
    >
      <template v-slot:prepend>
        <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
      </template>
      <slot />
    </v-text-field>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  width: {
    type: String,
    default: '400px',
  },
  autocomplete: String,
  maxlength: [Number, String],
  prependIcon: [String, Object],
  appendIcon: [String, Object],
  appendIconColor: {
    type: String,
    default: 'primary',
  },
  prependIconColor: {
    type: String,
    default: 'primary',
  },
});
import { ref, computed, watch } from 'vue';
const isVisible = ref(false);
const showToggle = computed(() => props.type === 'password');

const inputType = computed(() => {
  if (props.type === 'password') {
    return isVisible.value ? 'text' : 'password';
  }
  return 'text';
});
function toggleVisibility() {
  isVisible.value = !isVisible.value;
}

const emit = defineEmits(['update:modelValue']);
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style scoped>
::v-deep(.custom-input .v-field__field) {
  padding: 0 !important;
  border-bottom: 1px solid;
  background: transparent !important;
  box-shadow: none !important;
}
::v-deep(.custom-input .v-field--focused .v-field__field) {
  border-bottom: 2px solid #03c9d7 !important;
}
::v-deep(.custom-input .v-field__outline),
::v-deep(.custom-input .v-field__overlay),
::v-deep(.custom-input .v-field__field::before),
::v-deep(.custom-input .v-field__field::after) {
  border: none !important;
  box-shadow: none !important;
  background: none !important;
  content: none !important;
}
::v-deep(.v-label) {
  text-transform: uppercase !important;
}
::v-deep(.custom-input .v-field.v-field--focused .v-label) {
  color: #03c9d7 !important;
}
::v-deep(.custom-input .v-label) {
  font-weight: 400;
  font-size: 13px;
  transition: color 0.3s ease;
}
::v-deep(input:-webkit-autofill) {
  transition: background-color 9999s ease-in-out 0s;
}
</style>
