<template>
  <v-app-bar app dark clipped-left>
    <v-app-bar-nav-icon @click="toggle">
      <v-icon>mdi-view-headline</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>SOFTGUIDE</v-toolbar-title>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon variant="text" class="ma-0 pa-0">
          <v-app-bar-nav-icon>
            <v-icon size="32">mdi-account-circle-outline</v-icon>
          </v-app-bar-nav-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item to="/" link>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({ drawer: Boolean });
const emit = defineEmits(['update:drawer']);
const toggle = () => {
  emit('update:drawer', !props.drawer);
};
</script>
<style scoped>
::v-deep(.v-toolbar-title) {
  font-weight: bold !important;
}
</style>
