<template>
  <v-row>
    <v-col cols="12" md="8">
      <ParentCard>
        <v-card-title class="text-h5 mb-4"> Staff Card </v-card-title>
      </ParentCard>
    </v-col>
    <v-col cols="12" md="4">
      <ParentCard>
        <v-card-title class="text-h5 mb-4">
          Image Background Remover
        </v-card-title>

        <v-file-input
          v-model="imageFile"
          accept="image/*"
          label="Select an image"
          prepend-icon="mdi-camera"
          @change="onFileChange"
          :disabled="isProcessing"
          width="400px"
        ></v-file-input>

        <v-card variant="outlined" width="400px" height="400px">
          <v-card-title class="text-subtitle-1">Result</v-card-title>
          <div v-if="isProcessing" class="text-center pa-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <div class="mt-4">Removing background...</div>
          </div>
          <v-img
            v-else-if="resultImageUrl"
            :src="resultImageUrl"
            max-height="400"
            contain
          ></v-img>
          <v-card-text v-else class="text-center text-grey">
            Processed image will appear here
          </v-card-text>
        </v-card>

        <v-card-actions>
          <BaseButton
            color="primary"
            :disabled="!imageFile || isProcessing"
            @click="removeBackground"
          >
            Remove Background
          </BaseButton>
          <BaseButton
            v-if="resultImageUrl"
            :disabled="isProcessing"
            @click="downloadImage"
          >
            Download Result
          </BaseButton>
        </v-card-actions>
      </ParentCard>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import BaseButton from '@/components/bases/BaseButton.vue';

const imageFile = ref(null);
const originalImageUrl = ref('');
const resultImageUrl = ref('');
const isProcessing = ref(false);

const onFileChange = (files) => {
  const file = Array.isArray(files) ? files[0] : files;

  if (file) {
    originalImageUrl.value = URL.createObjectURL(file);
    resultImageUrl.value = '';
  } else {
    originalImageUrl.value = '';
    resultImageUrl.value = '';
  }
};

const removeBackground = async () => {
  if (!imageFile.value) return;

  isProcessing.value = true;
  resultImageUrl.value = '';

  try {
    const formData = new FormData();
    formData.append('image_file', imageFile.value);
    formData.append('size', 'auto');
    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          'X-Api-Key': '2HSzdpHhcLYHsUt8eKtv9qBb',
        },
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], { type: 'image/png' });
    resultImageUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error removing background:', error);
    alert('Failed to remove background. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

const downloadImage = () => {
  if (!resultImageUrl.value) return;

  const link = document.createElement('a');
  link.href = resultImageUrl.value;
  link.download = 'no-bg-image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped></style>
