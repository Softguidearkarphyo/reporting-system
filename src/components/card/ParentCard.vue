<template>
  <v-card elevation="2" :class="borderClass" color="surface">
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
<script setup>
import { borderClass } from '@/utils/border';
</script>
<style scoped>
.v-card {
  border-radius: 1px;
  margin-bottom: 8px;
}

/* Comment for upcoming cases
.gradientborder {
  box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08);
} */
</style>
