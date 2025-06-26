<template>
  <div class="align-center mb-5">
    <v-select
      v-bind="attrs"
      :items="items"
      :label="label"
      :multiple="multiple"
      :chips="chips"
      :clearable="clearable"
      :style="{ width }"
    >
      <template v-slot:prepend>
        <v-icon :color="prependIconColor">{{ prependIcon }}</v-icon>
      </template>
      <slot />
    </v-select>
  </div>
</template>
<script setup>
import { useAttrs } from 'vue';
defineProps({
  label: {
    type: String,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  chips: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '400px',
  },
  prependIcon: [String, Object],
  prependIconColor: {
    type: String,
    default: 'main',
  },
});
const attrs = useAttrs();
</script>
<style scoped>
.v-select {
  color: black;
}
</style>
