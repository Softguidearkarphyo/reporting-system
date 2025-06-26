<template>
  <v-card elevation="5" class="mb-4" rounded="lg">
    <v-card-item class="pa-0">
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title class="pl-7 pt-7 mb-sm-6 mb-4">Parent Card</v-card-title>
      </div>
      <div class="" style="padding: 50px">
        <slot />
      </div>
    </v-card-item>
  </v-card>
</template>
<script setup></script>
