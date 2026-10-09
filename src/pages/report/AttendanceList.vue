<template>
  <v-row class="align-center" density="compact">
    <v-col cols="12" sm="6" md="7" lg="8" class="d-flex align-center ga-2">
      <BaseTitle class="my-0">{{ t('attendance.title1') }}</BaseTitle>
      <span class="text-subtitle-2 text-grey-darken-1 font-weight-medium">
        ({{ todayFormatted }})
      </span>
    </v-col>
  </v-row>

  <ParentCard class="mt-4">
    <BaseTable v-if="items.length > 0" :headers="headers" :items="items" :density="true">
      <template #[`item.staff`]="{ item }">
        <div class="d-flex align-center">
          <v-avatar size="37" class="mr-3">
            <v-img
              v-if="item.staff?.staff_image_url && item.staff?.staff_image_url !== 'undefined'"
              :src="item.staff.staff_image_url"
            />
            <v-img
              v-else
              class="profileImage"
              :src="profileImgPath(isJapanese ? item.staff?.jp_name : item.staff?.eng_name)"
            />
          </v-avatar>
          <div>
            <div class="font-weight-medium">
              {{ isJapanese ? item.staff?.jp_name : item.staff?.eng_name }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ item.staff?.position?.name }}
            </div>
          </div>
        </div>
      </template>

      <template #[`item.date`]="{ item }">
        <span>{{ formatDate(item.date) }}</span>
      </template>

      <template #[`item.check_in_time`]="{ item }">
        <span class="font-weight-medium">{{ formatTime(item.check_in_time) }}</span>
      </template>

      <template #[`item.status`]="{ item }">
        <v-chip
          :color="isLate(item.check_in_time) ? 'warning' : 'success'"
          size="small"
          label
          class="font-weight-medium"
        >
          <v-icon
            start
            size="14"
            :icon="isLate(item.check_in_time) ? 'mdi-clock-alert-outline' : 'mdi-check-circle-outline'"
          />
          {{ getStatusText(item.check_in_time) }}
        </v-chip>
      </template>

      <template #[`item.device_type`]="{ item }">
        <div class="d-flex align-center ga-1 text-capitalize">
          <v-icon size="16" color="grey-darken-1" :icon="getDeviceIcon(item.device_type)" />
          <span>{{ item.device_type }}</span>
        </div>
      </template>

      <template #[`item.action`]="{ item }">
        <span class="d-flex justify-center p-0">
          <BaseButton
            v-if="isAdmin"
            elevation="0"
            @click.stop="showConfirmDelete(item.id)"
            color=""
            class="delete-btn"
            size="small"
            :style="{ width }"
            :add-class="['ma-1']"
          >
            <v-icon icon="tabler:IconTrash" size="15" />
          </BaseButton>
        </span>
      </template>
    </BaseTable>

    <div v-else class="text-center py-10 my-4">
      <v-icon icon="tabler:IconCalendarX" size="56" color="grey-lighten-1" class="mb-3" />
      <div class="text-h6 text-grey-darken-1 font-weight-medium">
        No attendance records found for today
      </div>
    </div>
  </ParentCard>

  <BaseConfirmDelete
    v-model="confirmDelete"
    :text="t('attendance.deleteConfirmText')"
    :class="{ 'd-none': !confirmDelete }"
    @yes="confirmDelete = false; deleteRecord();"
    @no="confirmDelete = false; deleteTarget = undefined;"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useAttendanceStore } from '@/stores/attendance/attendance.js';
import { ADMIN } from '@/utils/constant';
import { profileImgPath } from '@/utils/helper';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const attendanceStore = useAttendanceStore();
const router = useRouter();

const role = computed(() => authStore.staffRole || localStorage.getItem('staff-role'));
const isAdmin = computed(() => String(role.value) === String(ADMIN));
const isJapanese = computed(() => locale.value === 'ja');

const confirmDelete = ref(false);
const deleteTarget = ref(undefined);
const search = ref('');
const items = ref([]);
const width = '10px';
let originalItems = [];

const todayFormatted = computed(() => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date().toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'en-US', options);
});

const headers = computed(() => {
  const tmpHeaders = [
    {
      title: t('attendance.table.staff'),
      key: 'staff',
      sortable: true,
    },
    {
      title: t('attendance.table.date'),
      key: 'date',
      sortable: false,
    },
    {
      title: t('attendance.table.checkInTime'),
      key: 'check_in_time',
      sortable: true,
    },
    {
      title: t('attendance.table.status'),
      key: 'status',
      sortable: true,
    },
    {
      title: t('attendance.table.deviceType'),
      key: 'device_type',
      sortable: false,
    },
  ];

  if (String(role.value) === String(ADMIN)) {
    tmpHeaders.push({
      title: t('attendance.table.action'),
      key: 'action',
      align: 'center',
      sortable: false,
      width: '10%',
    });
  }
  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title.toUpperCase(),
  }));
});

// Time & Status Logic
const isLate = (timeString) => {
  if (!timeString) return false;
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const cutoffMinutes = 8 * 60 + 30;
  return totalMinutes > cutoffMinutes;
};

const getStatusText = (timeString) => {
  if (!timeString) return '-';
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const cutoffMinutes = 8 * 60 + 30;

  if (totalMinutes > cutoffMinutes) {
    const diff = totalMinutes - cutoffMinutes;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return hrs > 0 ? `Late (${hrs}h ${mins}m)` : `Late (${mins}m)`;
  }
  return 'On Time';
};

const formatTime = (timeString) => {
  if (!timeString) return '-';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHours = h % 12 || 12;
  return `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getDeviceIcon = (deviceType) => {
  switch (deviceType?.toLowerCase()) {
    case 'laptop':
      return 'mdi-laptop';
    case 'mobile':
      return 'mdi-cellphone';
    case 'tablet':
      return 'mdi-tablet';
    default:
      return 'mdi-desktop-classic';
  }
};

const fetch = async () => {
  await attendanceStore.fetchAttendances();
  items.value = [...(attendanceStore.getAttendances || [])];
  originalItems = [...items.value];
};

onMounted(async () => {
  if (!authStore.staff) {
    await authStore.fetchStaff();
  }
  await fetch();
});

const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};

const deleteRecord = async () => {
  await attendanceStore.deleteAttendance({ id: deleteTarget.value });
  deleteTarget.value = undefined;
  fetch();
};

watch(
  () => search.value,
  (newVal) => {
    if (newVal) {
      const query = newVal.toLowerCase();
      items.value = originalItems.filter((item) => {
        const staffName = (isJapanese.value ? item.staff?.jp_name : item.staff?.eng_name) || '';
        return (
          staffName.toLowerCase().includes(query) ||
          item.date?.includes(query) ||
          item.device_type?.toLowerCase().includes(query)
        );
      });
    } else {
      items.value = [...originalItems];
    }
  }
);
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style>