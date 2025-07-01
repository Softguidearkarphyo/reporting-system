<template>
  <v-card
    elevation="2"
    class="mb-6 overflow-hidden"
    rounded="lg"
    :style="{ width }"
  >
    <v-card-item>
      <v-card-title class="text-18">Widget</v-card-title>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
<script setup>
defineProps({
  width: {
    type: String,
    default: '300px',
  },
});
</script>
