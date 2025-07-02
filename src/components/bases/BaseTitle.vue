<template>
  <h3 class="mt-2">
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
  color: black;
}
</style>
