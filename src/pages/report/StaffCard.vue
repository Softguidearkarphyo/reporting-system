<template>
  <BaseTitle>Staff Card</BaseTitle>
  <v-row>
    <v-col col="12" md="8">
      <ParentCard height="650px">
        <StaffCardCanvas
          ref="cardImage"
          @dropped-image="updateDroppedImage"
          :members="members"
        />
        <v-card-actions class="mt-5 d-flex justify-center">
          <div class="my-6">
            <BaseSelect
              v-model="selectedItem"
              :label="t('staffCard.name')"
              class="mx-auto"
              :items="memberList"
              item-value="id"
              item-title="name"
              prependIcon="mdi-account"
              @change="selectMember"
            />

            <v-row class="mt-6" justify="center" align="center">
              <v-col cols="auto">
                <v-btn color="primary" variant="outlined" @click="downloadCard">
                  <v-icon start>mdi-download</v-icon>
                  {{ t('staffCard.download') }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn color="error" variant="outlined" @click="resetImage">
                  <v-icon start>mdi-refresh</v-icon>
                  {{ t('staffCard.reset') }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-actions>
      </ParentCard>
    </v-col>
    <v-col col="12" md="4">
      <ParentCard height="650px">
        <BaseTitle class="mb-4">{{ t('staffCard.edit') }}</BaseTitle>
        <BaseFileInput
          v-model="imageFile"
          accept="image/*"
          :label="t('staffCard.image')"
          prepend-icon="mdi-camera"
          @change="onFileChange"
          @click:clear="clearImages"
          :disabled="isProcessing"
          clearable
        >
        </BaseFileInput>

        <v-row>
          <v-col cols="12">
            <v-card variant="outlined">
              <div class="text-center pa-8">
                <template v-if="isProcessing">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                  />
                  <div class="mt-4">Removing background...</div>
                </template>
                <CroppieWrapper
                  v-else-if="resultImageUrl && !cropped"
                  ref="cropper"
                  :image-url="resultImageUrl"
                />
                <v-img
                  v-else-if="resultImageUrl"
                  :src="resultImageUrl"
                  max-height="350"
                  contain
                  draggable="true"
                  @dragstart="handleDragStart"
                />

                <v-img
                  v-else-if="originalImageUrl"
                  :src="originalImageUrl"
                  max-height="350"
                  contain
                  draggable="false"
                />
                <v-card-text v-else>{{ t('staffCard.label') }}</v-card-text>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-row no-gutters class="w-100" dense>
            <v-col cols="3">
              <v-btn
                color="primary"
                block
                :disabled="!imageFile || isProcessing"
                @click="removeBackground"
              >
                {{ t('staffCard.remove') }}
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                color="primary"
                block
                :disabled="!isEnhancing"
                @click="enhanceImage"
              >
                {{ t('staffCard.retouch') }}
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                v-if="showCropper"
                color="primary"
                block
                :disabled="isProcessing || isEnhancing"
                @click="cropImage"
              >
                {{ t('staffCard.crop') }}
              </v-btn>
            </v-col>
            <v-col cols="3" v-if="resultImageUrl">
              <v-btn block :disabled="isProcessing" @click="downloadImage">
                {{ t('staffCard.download') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </ParentCard>
    </v-col>
  </v-row>
</template>

<script setup>
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { position } from '@/utils/data';
import { useMemberStore } from '@/stores/member/member.js';
const { t, locale } = useI18n();
const memberStore = useMemberStore();
const imageFile = ref(null);
const originalImageUrl = ref('');
const resultImageUrl = ref('');
const enhancedImage = ref('');
const isEnhancing = ref(false);
const isProcessing = ref(false);
const cropped = ref('');
const cropper = ref(null);
const enhancementType = ref('general');
const enhancementStrength = ref(50);
const cardImage = ref(null);
const members = ref([]);
const selectedItem = ref(null);
const selectedId = ref(null);

onMounted(() => {
  fetchData();
});

const memberList = computed(() => {
  const isJapanese = locale.value === 'ja';
  return (
    memberStore.getMembers?.map((member) => ({
      id: member.id,
      name: isJapanese ? member.jp_name : member.eng_name,
    })) || []
  );
});

const fetchData = async () => {
  try {
    await memberStore.fetchMember();
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

const selectMember = async (id) => {
  try {
    const fetchedMembers = memberStore.getMembers || [];
    const selectedMember = fetchedMembers.find((member) => member.id === id);

    if (!selectedMember) {
      members.value = [];
      return;
    }
    const tmpMembers = [
      {
        id: selectedMember.id,
        eng_name: selectedMember.eng_name,
        jp_name: selectedMember.jp_name,
        staff_no: selectedMember.staff_no,
        position:
          position.value?.find((pos) => pos.id === selectedMember.position)
            ?.name || [],
      },
    ];
    members.value = tmpMembers;
  } catch (error) {
    console.error('Error selecting members:', error);
    members.value = [];
  }
};

function resetImage() {
  selectedItem.value = null;
  members.value = [];
  cardImage.value.reset();
}

function handleDragStart(event) {
  const src = event.target.getAttribute('src');
  event.dataTransfer.setData('text/plain', src);
}

async function updateDroppedImage(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const imageBlob = await response.blob();
    const imageFile = new File([imageBlob], 'dropped-image.png', {
      type: imageBlob.type,
      lastModified: Date.now(),
    });
    imageFile.value = imageFile;
  } catch (error) {
    console.error('Failed to update image:', error);
  }
}
const downloadCard = () => {
  if (cardImage.value) {
    cardImage.value.downloadAsImage();
  }
};

const showCropper = computed(() => {
  return (enhancedImage.value || resultImageUrl.value) && !cropped.value;
});

const onFileChange = (event) => {
  const file = event.target.files ? event.target.files[0] : event;
  if (file) {
    originalImageUrl.value = URL.createObjectURL(file);
    resultImageUrl.value = '';
    imageFile.value = file;
    cropped.value = '';
  } else {
    originalImageUrl.value = '';
    resultImageUrl.value = '';
    imageFile.value = null;
    cropped.value = '';
  }
};

const clearImages = () => {
  [originalImageUrl.value, resultImageUrl.value, enhancedImage.value]
    .filter((url) => url && url.startsWith('blob:'))
    .forEach((url) => URL.revokeObjectURL(url));
  originalImageUrl.value = '';
  resultImageUrl.value = '';
  enhancedImage.value = '';
  cropped.value = null;
  imageFile.value = null;
  isProcessing.value = false;
  isEnhancing.value = false;
};

const removeBackground = async () => {
  if (!imageFile.value) return;

  isProcessing.value = true;
  resultImageUrl.value = '';

  try {
    const formData = new FormData();
    formData.append('image_file', imageFile.value);
    formData.append('size', 'regular');

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          'X-Api-Key': 'zYmQYkz5e5ATgftFnFiX9AsK',
        },
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], { type: 'image/png' });
    const noBgUrl = URL.createObjectURL(blob);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = '#C8C8CB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        resultImageUrl.value = URL.createObjectURL(blob);
        isProcessing.value = false;
      }, 'image/png');
    };

    img.src = noBgUrl;
  } catch (error) {
    console.error('Error removing background:', error);
    alert('Failed to remove background. Please try again.');
    isProcessing.value = false;
  }
};

const enhanceImage = async () => {
  if (!originalImageUrl.value) return;

  isEnhancing.value = true;
  enhancedImage.value = '';
  cropped.value = null;

  try {
    const response = await fetch(originalImageUrl.value);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('image', blob, imageFile.value?.name || 'image.jpg');
    formData.append('type', enhancementType.value);
    formData.append('strength', enhancementStrength.value.toString());

    const { data } = await axios.post(
      'https://api.vyro.ai/v2/image/enhance',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'api-key': '',
        },
      }
    );

    if (data.output_url) {
      enhancedImage.value = data.output_url;
    } else if (data.image) {
      enhancedImage.value = `data:image/png;base64,${data.image}`;
    } else {
      enhancedImage.value = URL.createObjectURL(new Blob([data]));
    }
  } catch (error) {
    console.error('Error enhancing image:', error);
    alert('Failed to enhance image. Please try again.');
  } finally {
    isEnhancing.value = false;
  }
};

const cropImage = async () => {
  try {
    const blob = await cropper.value.getResult();
    const croppedUrl = URL.createObjectURL(blob);

    if (resultImageUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(resultImageUrl.value);
    }

    cropped.value = croppedUrl;
    resultImageUrl.value = croppedUrl;
  } catch (error) {
    console.error('Crop failed:', error);
    alert('Crop failed: ' + error.message);
  }
};

const downloadImage = () => {
  try {
    if (!resultImageUrl.value) return;
    const link = document.createElement('a');
    link.href = resultImageUrl.value;
    link.download = 'staff-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
</script>

<style scoped>
.v-card {
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>
