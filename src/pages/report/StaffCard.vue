<template>
  <BaseTitle>Staff Card</BaseTitle>
  <v-row>
    <v-col col="12" md="8">
      <ParentCard>
        <StaffCardCanvas
          ref="cardImage"
          @dropped-image="updateDroppedImage"
          :members="members"
        />
        <v-card-actions class="mt-5">
          <v-row no-gutters dense>
            <v-col cols="6">
              <BaseSelect
                :label="t('addMemberSkill.form.name')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-text="name"
                prependIcon="mdi-account"
                :width="'400px'"
                @change="selectMember"
              />
            </v-col>
            <v-col cols="3">
              <v-btn @click="downloadCard"> Download </v-btn>
            </v-col>
            <v-col cols="3">
              <!-- <v-btn @click="resetImage"> Reset </v-btn> -->
            </v-col>
          </v-row>
        </v-card-actions>
      </ParentCard>
    </v-col>
    <v-col col="12" md="4">
      <ParentCard>
        <BaseTitle class="mb-4">Photo Editing</BaseTitle>
        <BaseFileInput
          v-model="imageFile"
          accept="image/*"
          label="Select an image"
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
                  max-height="400"
                  contain
                  draggable="true"
                  @dragstart="handleDragStart"
                />

                <v-img
                  v-else-if="originalImageUrl"
                  :src="originalImageUrl"
                  max-height="400"
                  contain
                  draggable="false"
                />
                <v-card-text v-else> Please select an image </v-card-text>
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
                Remove BG
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                color="primary"
                block
                :disabled="!isEnhancing"
                @click="enhanceImage"
              >
                Retouch
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
                Crop
              </v-btn>
            </v-col>
            <v-col cols="3" v-if="resultImageUrl">
              <v-btn block :disabled="isProcessing" @click="downloadImage">
                Download
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
      'https://api.picsart.io/tools/1.0/enhance/face',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'api-key':
            'eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtMTViNzNhMDgtMDdkMi00NWE2LTkyYzUtMjM5YzBjN2JlYjNmIiwiYXVkIjoiNDkwMjQ3ODMyMDA1MTAxIiwibmJmIjoxNzUyNTUxODg4LCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiNDkwMjQ3ODMyMDA1MTAxIiwiaWF0IjoxNzUyNTUxODg3LCJqdGkiOiJiZDgzMDgyNS01OGRhLTQzYWItYTYxZi0wYzgxMzFkZDRjOGEifQ.Pbb91_jVM847MHW58f5WDiIWXNR2EYtLRo59v1Ll6Rm9OFlncIpQxpP5MvRsUcGq05MNMqNlFBXMRzCVpVgMk8qiIE6eD-PZNL9iK_TZNEmTfz9CpOgCSvW8OVVk4KHiFNXN3qFTYA83M3yWxcZ476RTuyNxZ9A6G3e1rEqAsiehMYSqqYMHAufb1cHHzj-VQ95lNju5ODjbRI0pNB0kfXs-knMEzb8ZReqH36Sqcntz-M36QbZixPEbmvDGWWl7lilFPwIfjZ8Qo1mWTusPLRdOt6DeoNS2hsNmPnZEQkGmQe2jNZb4Rd67fVG5FTGu7fehXzS4klStI-kpCV1Jbg',
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
