<template>
  <h3 class="ml-2 mt-2">
    <slot />
    <v-chip v-if="id" class="ma-2" label x-small>{{ id }}</v-chip>
  </h3>
</template>

<script setup lang="ts">
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
  color: rgb(0, 0, 0);
}
</style>
