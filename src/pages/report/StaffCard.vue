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

            <div class="d-flex justify-space-around mt-5">
              <v-btn
                color="primary"
                class="circle-btn"
                icon
                density="comfortable"
                @click="downloadCard"
              >
                <v-tooltip
                  color="primary"
                  activator="parent"
                  location="bottom"
                  :text="t('staffCard.download')"
                  transition="fade-transition"
                  open-delay="300"
                ></v-tooltip>
                <v-icon>tabler:IconDownload</v-icon>
              </v-btn>
              <v-btn
                color="error"
                icon
                density="comfortable"
                @click="resetImage"
              >
                <v-tooltip
                  activator="parent"
                  location="bottom"
                  :text="t('staffCard.reset')"
                  transition="fade-transition"
                  open-delay="300"
                ></v-tooltip>
                <v-icon>tabler:IconRefresh</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-actions>
      </ParentCard>
    </v-col>
    <v-col col="12" md="4">
      <ParentCard height="650px">
        <BaseTitle class="mb-4">{{ t('staffCard.edit') }}</BaseTitle>
        <v-file-input
          ref="fileInput"
          v-model="imageFile"
          accept="image/*"
          @change="onFileChange"
          :disabled="isProcessing"
          clearable
          style="display: none"
        >
        </v-file-input>
        <v-btn
          color="primary"
          v-if="originalImageUrl || cropped"
          variant="text"
          icon
          class="clear"
          @click="clearImages"
        >
          <v-tooltip
            activator="parent"
            location="top"
            :text="t('staffCard.cross')"
            transition="fade-transition"
            open-delay="300"
          ></v-tooltip>
          <v-icon>tabler:IconX</v-icon></v-btn
        >
        <v-card variant="outlined">
          <div class="text-center pa-8">
            <div v-if="isProcessing" class="scanning-overlay">
              <div :class="['fingerprint', { scanning: isScanning }]"></div>
            </div>

            <!-- Content -->
            <template v-if="!resultImageUrl && !originalImageUrl">
              <v-card-text @click="triggerFileInput" style="cursor: pointer">
                {{ t('staffCard.label') }}
              </v-card-text>
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
              max-width="380"
              contain
              draggable="true"
              @dragstart="handleDragStart"
            />

            <v-img
              v-else-if="originalImageUrl"
              :src="originalImageUrl"
              max-height="350"
              max-width="380"
              contain
              draggable="false"
            />
          </div>
        </v-card>

        <v-card-actions class="mt-6">
          <v-row class="w-100" dense>
            <v-col cols="3">
              <v-btn
                color="primary"
                icon
                density="comfortable"
                :disabled="!imageFile || isProcessing"
                @click="removeBackground"
                ><v-tooltip
                  activator="parent"
                  location="bottom"
                  :text="t('staffCard.remove')"
                  transition="fade-transition"
                  open-delay="300"
                ></v-tooltip>
                <v-icon>tabler:IconPhoto</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                color="primary"
                icon
                density="comfortable"
                :disabled="!isEnhancing"
                @click="enhanceImage"
              >
                <v-tooltip
                  activator="parent"
                  location="bottom"
                  :text="t('staffCard.retouch')"
                  transition="fade-transition"
                  open-delay="300"
                ></v-tooltip>
                <v-icon>tabler:IconWand</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                v-if="showCropper"
                color="primary"
                icon
                density="comfortable"
                :disabled="isProcessing || isEnhancing"
                @click="cropImage"
              >
                <v-tooltip
                  activator="parent"
                  location="bottom"
                  :text="t('staffCard.crop')"
                  transition="fade-transition"
                  open-delay="300"
                ></v-tooltip>
                <v-icon>tabler:IconCrop</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="3" v-if="resultImageUrl">
              <v-btn
                color="primary"
                icon
                density="comfortable"
                :disabled="isProcessing"
                @click="downloadImage"
              >
                <v-tooltip
                  activator="parent"
                  location="bottom"
                  :text="t('staffCard.download')"
                  transition="fade-transition"
                  open-delay="300"
                ></v-tooltip>
                <v-icon>tabler:IconDownload</v-icon>
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
const fileInput = ref(null);
const isScanning = ref(false);

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

function triggerFileInput() {
  fileInput.value.click();
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

function onFileChange(event) {
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
}

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
  isScanning.value = true;
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
          'X-Api-Key': 'fzkpnP5pr7pVCLKEEKrMbRDF',
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
        isScanning.value = false;
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

::v-deep(.v-btn) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

::v-deep(.circle-btn .v-btn__content) {
  color: white !important;
}

.clear {
  top: 80px;
  left: 450px;
  z-index: 1;
  margin: 0;
  display: block;
  position: absolute;
}

.scanning-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.fingerprint {
  width: 350px;
  height: 388px;
  position: relative;
}

.fingerprint.scanning::after {
  content: '';
  left: -20px;
  position: absolute;
  width: 350px;
  height: 4px;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 215, 0, 0),
    rgba(220, 53, 69, 0.8)
  );
  animation: scanning 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-shadow:
    0 0 5px rgba(255, 215, 0, 0.8),
    0 0 15px rgba(220, 53, 69, 0.6);
  border-radius: 2px;
  transform-origin: center;
}

@keyframes scanDown {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

@keyframes scanUp {
  0% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

.fingerprint.scanning::after {
  animation:
    scanDown 0.8s linear forwards,
    scanUp 0.8s linear 0.8s forwards infinite;
}
</style>
