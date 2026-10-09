<template>
  <v-main v-if="!isAdmin" class="pa-6 pt-4">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="pa-4 elevation-1" rounded="lg">
          <div class="d-flex flex-column flex-sm-row align-center justify-space-between">
            <div class="d-flex align-center mb-3 mb-sm-0">
              <v-avatar color="primary-lighten-5" size="48" class="mr-3">
                <v-icon icon="mdi-map-marker-radius" color="primary" size="28" />
              </v-avatar>
              <div>
                <div class="text-h6 font-weight-bold">{{ t('common.daily_attendance_check_in') }}</div>
                <div class="text-caption text-grey-darken-1">
                  <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                  {{ currentTime }}
                </div>
              </div>
            </div>

            <div class="attendance-container">
              <v-btn color="primary" :loading="isCheckingIn" :disabled="isCheckingIn" @click="handleCheckIn"
                class="btn-checkin">
                {{ isCheckingIn ? t('common.checking_in') : t('common.check_in') }}
              </v-btn>
            </div>
          </div>

          <!-- <v-alert
            v-if="statusMessage.text"
            :type="statusMessage.type"
            variant="tonal"
            density="compact"
            closable
            class="mt-3"
            @click:close="statusMessage.text = ''"
          >
            {{ statusMessage.text }}
          </v-alert> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6" justify="space-between">
      <v-col v-for="(type, i) in leaveTypes" :key="i" cols="12" sm="6" md="2" class="px-1">
        <v-card :class="borderClass" class="pa-3" rounded elevation="1">
          <div class="d-flex align-center">
            <v-progress-circular :model-value="(type.remaining || 0) * 12.5" color="primary" size="60" width="6">
              {{ type.remaining || 0 }}
            </v-progress-circular>
            <div class="ml-4">
              <div class="text-caption">Remaining</div>
              <div class="text-h6 font-weight-bold">{{ type.name }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6" dense>
      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1">
          <v-card-title class="text-h6 pa-4 text-uppercase">{{ t('sidebar.leaverecords') }}</v-card-title>
          <v-divider></v-divider>

          <BaseTable v-if="memberLeave && memberLeave.length" :headers="leaveHeader" :items="memberLeave"
            :items-per-page="-1" hide-default-footer class="elevation-0 pa-2 no-scroll-table">
            <template #[`item.eng_name`]="{ item }">
              <span class="font-weight-medium text-truncate d-block">{{ item.eng_name }}</span>
            </template>

            <template #[`item.total_paid_days`]="{ item }">
              <span class="status d-inline-flex justify-center align-center">
                {{ item.total_paid_days }} {{ item.total_paid_days === 1 ? 'day' : 'days' }}
              </span>
            </template>

            <template #[`item.total_unpaid_days`]="{ item }">
              <span class="status1 d-inline-flex justify-center align-center">
                {{ item.total_unpaid_days }} {{ item.total_unpaid_days === 1 ? 'day' : 'days' }}
              </span>
            </template>

            <template #[`item.total_days`]="{ item }">
              <span class="font-weight-bold">{{ item.total_days }}</span>
            </template>

            <template #[`item.total_records`]="{ item }">
              <span class="time-box d-inline-flex justify-center align-center px-2 py-1 rounded-pill">
                {{ item.total_records }}
              </span>
            </template>
          </BaseTable>

          <v-card-text v-else class="text-center pa-8 text-grey">
            <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-calendar-blank-outline</v-icon>
            <div class="text-body-1">No leave records found</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1">
          <v-card-title class="text-h6 pa-4 text-uppercase">{{ t('common.fineRecord') }}</v-card-title>
          <v-divider></v-divider>

          <BaseTable v-if="memberFine && memberFine.length" :headers="fineHeader" :items="memberFine"
            :items-per-page="-1" hide-default-footer class="elevation-0 pa-2 no-scroll-table">
            <template #[`item.eng_name`]="{ item }">
              <span class="font-weight-medium text-truncate d-block">{{ item.eng_name }}</span>
            </template>

            <template #[`item.time`]="{ item }">
              <span class="time-box d-inline-flex justify-center align-center">
                <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
                {{ item.time }}
              </span>
            </template>

            <template #[`item.fine`]="{ item }">
              <span class="money-box d-inline-flex justify-center align-center">
                {{ item.fine + ' Ks' }}
              </span>
            </template>

            <template #[`item.count`]="{ item }">
              <span class="time-box d-inline-flex justify-center align-center p-2 rounded-pill">
                {{ item.count }}
              </span>
              <v-icon v-if="item.count > 2" :style="{ color: item.count > 3 ? '#d00000' : '#ffba08' }" class="ms-1">
                {{ item.count > 3 ? 'mdi-fire-alert' : 'mdi-alert-decagram-outline' }}
              </v-icon>
            </template>
          </BaseTable>

          <!-- Empty State -->
          <v-card-text v-else class="text-center pa-8 text-grey">
            <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-file-document-outline</v-icon>
            <div class="text-body-1">No fine records found</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-main>

  <!-- Admin Dashboard -->
  <v-main v-else class="pa-6 pt-4">
    <!-- Charts Row -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card outlined class="h-100">
          <v-card-title class="text-uppercase text-subtitle-1 font-weight-bold">
            {{ t('sidebar.projectmenpower') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <canvas id="menPowerChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined class="h-100">
          <v-card-title class="text-uppercase text-subtitle-1 font-weight-bold">
            {{ t('common.employeeSkill') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <canvas id="leaveChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined class="h-100">
          <v-card-title class="text-uppercase text-subtitle-1 font-weight-bold">
            {{ t('addMemberSkill.table.japanese_level') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <canvas id="fineChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Records Row -->
    <v-row>
      <!-- Leave Record (2/3 Width) -->
      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1">
          <v-card-title class="text-h6 pa-4 text-uppercase">{{ t('sidebar.leaverecords') }}</v-card-title>
          <v-divider></v-divider>

          <BaseTable v-if="memberLeave && memberLeave.length" :headers="leaveHeader" :items="memberLeave"
            :items-per-page="-1" hide-default-footer class="elevation-0 pa-2 no-scroll-table">
            <template #[`item.eng_name`]="{ item }">
              <span class="font-weight-medium text-truncate d-block">{{ item.eng_name }}</span>
            </template>

            <template #[`item.total_paid_days`]="{ item }">
              <span class="status d-inline-flex justify-center align-center">
                {{ item.total_paid_days }} {{ item.total_paid_days === 1 ? 'day' : 'days' }}
              </span>
            </template>

            <template #[`item.total_unpaid_days`]="{ item }">
              <span class="status1 d-inline-flex justify-center align-center">
                {{ item.total_unpaid_days }} {{ item.total_unpaid_days === 1 ? 'day' : 'days' }}
              </span>
            </template>

            <template #[`item.total_days`]="{ item }">
              <span class="font-weight-bold">{{ item.total_days }}</span>
            </template>

            <template #[`item.total_records`]="{ item }">
              <span class="time-box d-inline-flex justify-center align-center px-2 py-1 rounded-pill">
                {{ item.total_records }}
              </span>
            </template>
          </BaseTable>

          <!-- Empty State -->
          <v-card-text v-else class="text-center pa-8 text-grey">
            <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-calendar-blank-outline</v-icon>
            <div class="text-body-1">No leave records found</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Fine Record (1/3 Width) -->
      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1">
          <v-card-title class="text-h6 pa-4 text-uppercase">{{ t('common.fineRecord') }}</v-card-title>
          <v-divider></v-divider>

          <BaseTable v-if="memberFine && memberFine.length" :headers="fineHeader" :items="memberFine"
            :items-per-page="-1" hide-default-footer class="elevation-0 pa-2 no-scroll-table">
            <template #[`item.eng_name`]="{ item }">
              <span class="font-weight-medium text-truncate d-block">{{ item.eng_name }}</span>
            </template>

            <template #[`item.total_fines_amount`]="{ item }">
              <span class="money-box d-inline-flex justify-center align-center font-weight-bold">
                {{ item.total_fines_amount ? item.total_fines_amount.toLocaleString() : 0 }} Ks
              </span>
            </template>

            <template #[`item.total_fine_records`]="{ item }">
              <span class="time-box d-inline-flex justify-center align-center p-2 rounded-pill">
                {{ item.total_fine_records }}
              </span>
              <v-icon v-if="item.total_fine_records > 2"
                :style="{ color: item.total_fine_records > 3 ? '#d00000' : '#ffba08' }" class="ms-1">
                {{ item.total_fine_records > 3 ? 'mdi-fire-alert' : 'mdi-alert-decagram-outline' }}
              </v-icon>
            </template>
          </BaseTable>

          <!-- Empty State -->
          <v-card-text v-else class="text-center pa-8 text-grey">
            <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-file-document-outline</v-icon>
            <div class="text-body-1">No fine records found</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { borderClass } from '@/utils/border';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useMemberStore } from '@/stores/member/member.js';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useMenPowerStoreStore } from '@/stores/menpower/menpower.js';
import { ADMIN } from '@/utils/constant';
import { useLeaveStore } from '@/stores/leave/leave';
import { useMemberFineStore } from '@/stores/member/member-fine.js';
import { getDeviceMetaData } from '@/utils/deviceDetector';

const { t } = useI18n();
const lan = ref('en');
const authStore = useAuthStore();
const router = useRouter();
const memberStore = useMemberStore();
const menPowerStore = useMenPowerStoreStore();
const leaveStore = useLeaveStore();
const fineStore = useMemberFineStore();

const staff = computed(() => authStore.loginStaff);
const staffId = computed(() => staff.value?.id);
const leaveTypes = ref([]);

const role = computed(() => {
  const r = authStore.staffRole ?? localStorage.getItem('staff-role');
  return r !== null && r !== undefined ? String(r) : '';
});

const isAdmin = computed(() => role.value === String(ADMIN));
const japaneseLevel = ref({});
const majorSkill = ref({});
const memberLeave = ref([]);
const memberFine = ref([]);
const menPower = ref({});

const isCheckingIn = ref(false);
const currentTime = ref('');
let timer = null;
// const statusMessage = reactive({ type: '', text: '' });

const chartInstances = {};




const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const detectLaptopDevice = async () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) return false;

  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      const isPluggedDesktopPattern = battery.charging === true && battery.level === 1 && battery.dischargingTime === Infinity;
      if (!isPluggedDesktopPattern) return true;
    } catch (e) {
      console.warn('Battery API error:', e);
    }
  }

  return navigator.maxTouchPoints > 0;
};

const getCoordinates = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: null, longitude: null, accuracy: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || null,
        });
      },
      (error) => {
        console.warn('GPS Error or Permission Denied:', error.message);
        resolve({ latitude: null, longitude: null, accuracy: null });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
};

const handleCheckIn = async () => {
  // statusMessage.text = '';
  isCheckingIn.value = true;

  try {
    const deviceData = await getDeviceMetaData();
    const isLaptop = await detectLaptopDevice();
    const coords = await getCoordinates();


    // console.log('Device Data:', deviceData);
    // console.log('Is Laptop:', isLaptop);
    // console.log('Coordinates:', coords);
    const res = await authStore.checkIn({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      is_laptop: deviceData?.isLaptop ?? isLaptop,
      device_uuid: deviceData?.deviceUUID || '',
    });

    console.log('Check-In Response:', res);
    if (res.status === 'success') {
      router.push({ name: 'attendance' });
    }
    // statusMessage.type = 'success';
    // statusMessage.text = res.message;
  } catch (err) {
    console.error('Check-In Error:', err);
  } finally {
    isCheckingIn.value = false;
  }
};

const leaveHeader = computed(() => {
  const tmpHeaders = [
    { title: t('creatLeave.table.name'), key: 'eng_name', sortable: true },
    { title: t('creatLeave.table.paidDays'), key: 'total_paid_days' },
    { title: t('creatLeave.table.unpaidDays'), key: 'total_unpaid_days' },
    { title: t('creatLeave.form.total_days'), key: 'total_days' },
  ];
  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title ? header.title.toUpperCase() : '',
  }));
});

const fineHeader = computed(() => {
  const tmpHeaders = [
    {
      title: t('memberFine.form.name'),
      key: lan.value === 'ja' ? 'jp_name' : 'eng_name',
      align: 'left',
    },
    {
      title: t('memberFine.totalFineAmount'),
      key: 'total_fines_amount',
      align: 'left',
      sortable: true,
    },
    {
      title: t('memberFine.totalFineCount'),
      key: 'total_fine_records',
      align: 'left',
      sortable: true,
    },
  ];

  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title ? header.title.toUpperCase() : '',
  }));
});

const fetchData = async () => {
  if (!staff.value) {
    await authStore.fetchStaff();
  }

  const payload = { leave: {}, over_time: {}, fine: {} };

  if (!isAdmin.value) {
    payload.id = staffId.value;
  } else {
    payload.skill_sheet = {};
  }

  await leaveStore.fetchLeaveRecord();
  const allLeaveRecords = leaveStore.getLeaveRecords || [];

  const groupedLeaveMap = allLeaveRecords.reduce((acc, record) => {
    const staffId = record.staff_id || record.id;
    const name = record.eng_name || '-';

    if (!acc[staffId]) {
      acc[staffId] = {
        staff_id: staffId,
        eng_name: name,
        total_paid_days: 0,
        total_unpaid_days: 0,
        total_days: 0,
        total_records: 0,
      };
    }

    (record.leaves || []).forEach((item) => {
      const dayCount = Number(item.day_count || 0);
      const isPaid = Number(item.leave_type) === 1;

      if (isPaid) {
        acc[staffId].total_paid_days += dayCount;
      } else {
        acc[staffId].total_unpaid_days += dayCount;
      }

      acc[staffId].total_days += dayCount;
      acc[staffId].total_records += 1;
    });

    return acc;
  }, {});

  memberLeave.value = Object.values(groupedLeaveMap);

  const fineRes = await fineStore.fetchMemberFine();
  const fineList = Array.isArray(fineRes?.data?.data)
    ? fineRes.data.data
    : Array.isArray(fineRes?.data)
      ? fineRes.data
      : [];

  const groupedFineMap = fineList.reduce((acc, item) => {
    if (Number(item.status) === 1) return acc;

    const sId = item.staff_id || item.staff?.id;
    const name = item.staff?.eng_name || item.eng_name || '-';
    const amount = Number(item.amount || item.fine || 0);

    if (!acc[sId]) {
      acc[sId] = {
        staff_id: sId,
        eng_name: name,
        total_fines_amount: 0,
        total_fine_records: 0,
      };
    }

    acc[sId].total_fines_amount += amount;
    acc[sId].total_fine_records += 1;

    return acc;
  }, {});

  memberFine.value = Object.values(groupedFineMap);

  await memberStore.fetchMember(payload);

  const tmpArr1 = (memberStore.getMembers || []).map((item) => ({
    id: item.skill_sheet?.japanese_level?.id,
    name: item.skill_sheet?.japanese_level?.name,
  }));

  japaneseLevel.value = tmpArr1.reduce((acc, item) => {
    if (item.name) acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  const tmpArr2 = (memberStore.getMembers || []).map((item) => ({
    id: item.skill_sheet?.major_tech_stack?.id,
    name: item.skill_sheet?.major_tech_stack?.name,
  }));

  majorSkill.value = tmpArr2.reduce((acc, item) => {
    if (item.name) acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  await menPowerStore.fetchMenPower();
  (menPowerStore.getMenPower || []).forEach((mp) => {
    menPower.value[mp.eng_name] = mp.hours;
  });
};

const createOrUpdateChart = (canvasId, config) => {
  const el = document.getElementById(canvasId);
  if (!el) return;

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  const ctx = el.getContext('2d');
  chartInstances[canvasId] = new Chart(ctx, config);
};

const renderPieChart = (canvasId, labels, data) => {
  createOrUpdateChart(canvasId, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, borderWidth: 0 }] },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 15,
            font: { size: 12, weight: 'bold' },
          },
        },
        datalabels: {
          color: '#fff',
          font: { weight: 'bold', size: 14 },
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((a, b) => Number(a) + Number(b), 0);
            if (!total) return '0%';
            return `${((Number(value) / total) * 100).toFixed(1)}%`;
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
};

const renderChart = (canvasId, labels, data) => {
  createOrUpdateChart(canvasId, {
    type: 'polarArea',
    data: { labels, datasets: [{ data, borderWidth: 0 }] },
    options: {
      responsive: true,
      scales: { r: { ticks: { display: false }, pointLabels: { display: true } } },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, pointStyle: 'rect', boxWidth: 12, boxHeight: 12 },
        },
      },
    },
  });
};

const renderChart1 = (canvasId, labels, data) => {
  createOrUpdateChart(canvasId, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, borderWidth: 0 }] },
    options: {
      responsive: true,
      cutout: '50%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 15,
            font: { size: 12, weight: 'bold' },
          },
        },
        datalabels: {
          color: '#fff',
          font: { weight: 'bold', size: 14 },
          formatter: (value, context) => {
            const dataset = context.chart.data.datasets[0].data.map(Number);
            const total = dataset.reduce((a, b) => a + b, 0);
            if (!total) return '0%';
            return `${((Number(value) / total) * 100).toFixed(1)}%`;
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
};

onMounted(async () => {
  updateClock();
  timer = setInterval(updateClock, 1000);

  await fetchData();

  if (isAdmin.value) {
    await nextTick();

    const skillLabel = Object.keys(majorSkill.value).sort(
      (a, b) => parseInt(a.slice(1) || 0) - parseInt(b.slice(1) || 0)
    );
    const skillData = skillLabel.map((label) => majorSkill.value[label]);

    const JapaneseLevelLabel = Object.keys(japaneseLevel.value).sort(
      (a, b) => parseInt(a.slice(1) || 0) - parseInt(b.slice(1) || 0)
    );
    const japaneseLevelData = JapaneseLevelLabel.map((label) => japaneseLevel.value[label]);

    const menPowerLabel = Object.keys(menPower.value);
    const menPowerData = menPowerLabel.map((label) => menPower.value[label]);

    renderChart('leaveChart', skillLabel, skillData);
    renderPieChart('fineChart', JapaneseLevelLabel, japaneseLevelData);
    renderChart1('menPowerChart', menPowerLabel, menPowerData);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  Object.values(chartInstances).forEach((instance) => instance?.destroy());
});
</script>

<style scoped>
.empty {
  background-color: transparent;
}

#leaveChart,
#fineChart,
#menPowerChart {
  max-width: 380px;
  max-height: 320px;
}

.no-scroll-table :deep(.v-table__wrapper) {
  overflow: hidden !important;
  max-height: none !important;
}

.no-scroll-table :deep(table) {
  table-layout: fixed;
  width: 100%;
}

.no-scroll-table :deep(td),
.no-scroll-table :deep(th) {
  white-space: nowrap;
}
</style>