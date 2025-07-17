<template>
  <div>
    <div ref="croppieContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Croppie from 'croppie';

const props = defineProps({
  imageUrl: String,
  viewport: {
    type: Object,
    default: () => ({ width: 113, height: 113, type: 'circle' }),
  },
  boundary: {
    type: Object,
    default: () => ({ width: 300, height: 300 }),
  },
});

const emit = defineEmits(['cropped']);

const croppieContainer = ref(null);
const croppieInstance = ref(null);

onMounted(() => {
  croppieInstance.value = new Croppie(croppieContainer.value, {
    viewport: props.viewport,
    boundary: props.boundary,
    enableZoom: true,
    showZoomer: true,
  });

  if (props.imageUrl) {
    croppieInstance.value.bind({ url: props.imageUrl });
  }
});

watch(
  () => props.imageUrl,
  (url) => {
    if (url && croppieInstance.value) {
      croppieInstance.value.bind({ url });
    }
  }
);

onBeforeUnmount(() => {
  if (croppieInstance.value) {
    croppieInstance.value.destroy();
    croppieInstance.value = null;
  }
});

const getResult = () => {
  return new Promise((resolve, reject) => {
    if (!croppieInstance.value) {
      reject(new Error('Croppie instance not available'));
      return;
    }

    croppieInstance.value
      .result({
        type: 'blob',
        size: 'viewport',
        format: 'png',
        quality: 0.9,
      })
      .then((blob) => {
        resolve(blob);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

defineExpose({ getResult });
</script>
