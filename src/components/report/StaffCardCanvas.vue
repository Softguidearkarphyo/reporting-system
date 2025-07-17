<template>
  <div ref="exportCard" class="staff_card" crossorigin="anonymous">
    <div class="row">
      <div col="12">
        <div class="sg-header">
          <p class="sg-text">SoftGuide</p>
          <p class="sg-team">Software Development Team</p>
        </div>
        <div
          @dragover.prevent="handleDragOver"
          @drop="handleDrop"
          class="pre_photo1_div"
        >
          <img v-if="dropped" :src="droppedImgUrl" class="dropped-img" />
        </div>
        <div v-for="member in members" :key="member.id" :value="member">
          <div class="info1">
            <p type="text" name="img_jpn_name1" id="img_jpn_name1">
              {{ member.jp_name }}
            </p>
            <p type="text" name="img_name1" id="img_name1">
              {{ member.eng_name }}
            </p>
          </div>
          <div class="info1_id">
            <p id="img_position1_label">Position :</p>
            <p type="text" name="img_position1" id="img_position1">
              {{ member.position }}
            </p>
            <p id="img_e_id_1_label">
              ID<span class="id_label">:</span>{{ member.staff_no }}
            </p>
            <p type="text" name="img_e_id_1" id="img_e_id_1"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import html2canvas from 'html2canvas';
const dropped = ref(false);
const droppedImgUrl = ref(null);
const exportCard = ref(null);
const emit = defineEmits(['dropped-image']);
const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
});
function handleDragOver(event) {
  event.preventDefault();
}
console.log(props.members, 'props');

function handleDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  if (data) {
    droppedImgUrl.value = data;
    emit('dropped-image', data);
    dropped.value = true;
  }
}

const downloadAsImage = async () => {
  if (!exportCard?.value) {
    console.warn('Image not found');
    return;
  }
  try {
    const canvas = await html2canvas(exportCard.value, {
      useCORS: true,
      allowTaint: false,
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `staff-card-${Date.now()}.png`;
    link.click();
  } catch (error) {
    console.error('Download failed:', error);
  }
};

defineExpose({ downloadAsImage });
</script>

<style scoped>
.staff_card {
  background-image: url('/card.jpg');
  background-size: 298px 397px;
  width: 295px;
  height: 400px;
  background-repeat: no-repeat;
  margin: auto;
}
.row > div[col='12'] {
  padding: 1px;
}

.sg-header {
  text-align: center;
  width: 295px;
  margin-top: 52px;
}

.sg-text {
  font-size: 20px;
  font-weight: 700;
  color: #079906;
  letter-spacing: -0.5px;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}
.sg-team {
  font-size: 15px;
  font-weight: 600;
  color: #079906;
  margin-top: -2px !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

.info1,
.info2 {
  position: absolute;
  top: 240px;
  width: 100%;
  margin-left: 15px;
}
#img_position1_label {
  position: absolute;
  top: 306px;
  margin-left: 59px;
  font-size: 12.5px !important;
  color: white;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}
#img_position1 {
  position: absolute;
  top: 306px;
  margin-left: 82px;
  font-size: 12.5px !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}
#img_e_id_1_label {
  position: absolute;
  top: 334px;
  margin-left: 59px;
  font-size: 12.5px !important;
  color: white;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}
.id_label {
  margin-left: 37px;
}
#img_e_id_1 {
  position: absolute;
  top: 334px;
  margin-left: 83px;
  font-size: 12.5px !important;
}

#pre_photo1 {
  width: 100%;
  border-radius: 50% !important;
}

.pre_photo1_div {
  width: 113px;
  height: 113px;
  margin-left: 91px;
  margin-top: 11px;
}

#img_jpn_name1,
#img_name1 {
  font-size: 15px;
  font-weight: bold;
  margin: 0 0 5px;
  color: white;
  display: flex;
  justify-content: center;
}

#img_position1,
#img_e_id_1 {
  font-size: 11px;
  color: white;
}
</style>
