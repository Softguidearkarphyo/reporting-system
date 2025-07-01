<template>
  <div class="align-center mb-5">
    <v-text-field
      v-bind="$attrs"
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
      :rules="rules"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      variant="underlined"
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
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  width: {
    type: String,
    default: '400px',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  autocomplete: String,
  maxlength: [Number, String],
  prependIcon: [String, Object],
  appendIcon: [String, Object],
  appendIconColor: {
    type: String,
    default: 'main',
  },
  prependIconColor: {
    type: String,
    default: 'main',
  },
});
import { ref, computed, watch } from 'vue';
const emit = defineEmits(['update:modelValue']);
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
</script>

<style scoped>
::v-deep(.custom-input .v-field__field) ::v-deep(.v-field--variant-underlined) {
  padding: 0 !important;
  border-bottom: 1px solid #121313;
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
  color: black !important;
  font-weight: 400;
  font-size: 13px;
  transition: color 0.3s ease;
}
</style>
