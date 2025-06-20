<template>
  <v-text-field :style="{ minWidth: width + ' !important ' }"></v-text-field>
</template>
<script setup>
defineProps({
  width: {
    type: String,
    default: '40px',
  },
});
// const attrs = useAttrs();
</script>
