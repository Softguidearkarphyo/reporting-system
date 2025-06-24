<template>
  <v-app-bar app dark clipped-left>
    <v-app-bar-nav-icon @click="toggle">
      <v-icon>mdi-view-headline</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>SOFTGUIDE</v-toolbar-title>
    <ProfileIcon />
  </v-app-bar>
</template>
<script setup>
import ProfileIcon from '../../components/navbar/ProfileIcon.vue';
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
  color: #000000;
}
</style>
