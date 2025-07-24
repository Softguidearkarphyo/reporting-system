<template>
  <v-card elevation="2" class="mb-4 gradientborder" color="surface">
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Comment for upcoming cases
.gradientborder {
  box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid var(--gradient-border);
  border-radius: 12px;
  position: relative;
} */
</style>
