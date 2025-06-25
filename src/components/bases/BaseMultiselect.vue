<template>
  <div>
    <v-select
      v-bind="attrs"
      v-on="$listeners"
      :items="items"
      :label="label"
      :multiple="multiple"
      :chips="chips"
      :clearable="clearable"
      :style="{ width: width }"
    >
      <slot />
    </v-select>
  </div>
</template>
<script setup>
import { useAttrs } from 'vue';
defineProps({
  label: {
    type: String,
    default: 'Select',
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
    default: '300px',
  },
});
const attrs = useAttrs();
</script>
<style scoped>
.v-select {
  color: black;
}
</style>
