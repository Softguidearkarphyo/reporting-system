<template>
  <v-text-field
    v-bind="$attrs"
    class="custom-input"
    color="primary"
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
    variant="underlined"
    @click:append-inner="toggleVisibility"
    dense
    :style="{ width }"
  >
    <template v-slot:prepend>
      <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
    </template>
    <slot />
  </v-text-field>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

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
</script>

<style scoped>
::v-deep(.v-label) {
  text-transform: uppercase !important;
}
.custom-input .v-label {
  font-weight: 400;
  font-size: 13px;
  transition: color 0.3s ease;
}
::v-deep(input:-webkit-autofill) {
  transition: background-color 9999s ease-in-out 0s;
}
</style>
