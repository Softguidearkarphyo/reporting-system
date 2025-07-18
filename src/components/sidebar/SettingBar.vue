<template>
  <v-navigation-drawer
    location="right"
    app
    clipped
    width="320"
    elevation="0"
    :model-value="props.setting"
    temporary
    @update:model-value="(val) => emit('update:setting', val)"
  >
    <perfect-scrollbar>
      <v-list class="px-6">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Home"
          value="home"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-forum"
          title="About"
          value="about"
        ></v-list-item>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
<script setup>
const props = defineProps({
  setting: Boolean,
});

const emit = defineEmits(['update:setting']);
</script>

<style scoped>
.v-navigation-drawer {
  position: fixed !important;
  height: 100vh !important;
}
</style>
