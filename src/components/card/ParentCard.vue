<template>
  <v-card elevation="2" class="mb-4" rounded="lg" color="side">
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
<script setup></script>
<style scoped>
.v-card {
  box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08);
}
</style>
