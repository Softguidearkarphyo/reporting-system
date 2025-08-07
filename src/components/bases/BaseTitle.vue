<template>
  <h3 class="ml-2 mt-2 mb-3">
    <slot />
    <v-chip v-if="id" class="ma-2" label x-small>{{ id }}</v-chip>
  </h3>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: '',
    required: false,
  },
});
</script>

<style scoped>
h3 {
  color: rgb(var(--v-theme-titlecolor));
  text-transform: uppercase; /* Capitalize all letters */
  letter-spacing: 1px;
  /* font-weight: 700; */
  font-size: 1rem; /* Adjust font size as needed */
}
</style>
