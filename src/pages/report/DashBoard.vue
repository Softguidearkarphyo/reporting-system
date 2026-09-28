<template>
  <v-main v-if="!isAdmin" class="pa-6 pt-4">
    <v-row class="mb-6" justify="space-between">
      <v-col
        v-for="(type, i) in leaveTypes"
        :key="i"
        cols="12"
        sm="6"
        md="2"
        class="px-1"
      >
        <v-card :class="borderClass" class="pa-3" rounded elevation="1">
          <div class="d-flex align-center">
            <v-progress-circular
              :model-value="type.remaining * 12.5"
              color="primary"
              size="60"
              width="6"
            >
              {{ type.remaining }}
            </v-progress-circular>
            <div class="ml-4">
              <div class="text-caption">Remaining</div>
              <div class="text-h6 font-weight-bold">{{ type.name }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Leave Record + Fine Record -->
<v-row class="mb-6" dense>
  <!-- Leave Record (Full Width) -->
  <v-col cols="12">
    <v-card rounded="lg" elevation="1">
      <v-card-title class="text-h6 pa-4">Leave Record</v-card-title>
      <v-divider></v-divider>

      <BaseTable
        :headers="leaveHeader"
        :items="memberLeave"
        :items-per-page="-1"
        hide-default-footer
        class="elevation-0 pa-2 no-scroll-table"
      >
        <!-- Employee Name -->
        <template #[`item.eng_name`]="{ item }">
          <span class="font-weight-medium text-truncate d-block">{{ item.eng_name }}</span>
        </template>

        <!-- Leave Type: Paid / Unpaid -->
        <template #[`item.leave_type`]="{ item }">
          <span v-if="item.leave_type === 1" class="status d-inline-flex justify-center align-center">
            paid
          </span>
          <span v-else class="status1 d-inline-flex justify-center align-center">
            unpaid
          </span>
        </template>

        <!-- Duration Mapping -->
        <template #[`item.duration`]="{ item }">
          <span v-if="item.duration == 1">Full day</span>
          <span v-else-if="item.duration == 2">Half day</span>
          <span v-else-if="item.duration == 3">3 Hrs : 30 Min</span>
          <span v-else-if="item.duration == 4">3 Hrs</span>
          <span v-else-if="item.duration == 5">2 Hrs : 30 Min</span>
          <span v-else-if="item.duration == 6">2 Hrs</span>
          <span v-else-if="item.duration == 7">1 Hrs : 30 Min</span>
          <span v-else-if="item.duration == 8">1 Hrs</span>
          <span v-else-if="item.duration == 9">30 Min</span>
          <span v-else>{{ item.duration }}</span>
        </template>

        <!-- Reason -->
        <template #[`item.reason`]="{ item }">
          <span>{{ item.reason || '-' }}</span>
        </template>
      </BaseTable>
    </v-card>
  </v-col>

  <!-- Fine Record (Full Width) -->
  <v-col cols="12">
    <v-card rounded="lg" elevation="1">
      <v-card-title class="text-h6 pa-4">Fine Record</v-card-title>
      <v-divider></v-divider>
      
      <BaseTable 
        :headers="fineHeader" 
        :items="memberFine" 
        :items-per-page="-1"
        hide-default-footer
        class="elevation-0 pa-2 no-scroll-table"
      >
        <!-- Employee Name Slot -->
        <template #[`item.eng_name`]="{ item }">
          <span class="font-weight-medium text-truncate d-block">{{ item.eng_name }}</span>
        </template>

        <!-- Time Slot -->
        <template #[`item.time`]="{ item }">
          <span class="time-box d-inline-flex justify-center align-center">
            <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
            {{ item.time }}
          </span>
        </template>

        <!-- Fine Amount Slot -->
        <template #[`item.fine`]="{ item }">
          <span class="money-box d-inline-flex justify-center align-center">
            {{ item.fine + ' Ks' }}
          </span>
        </template>

        <!-- Count & Alert Icon Slot -->
        <template #[`item.count`]="{ item }">
          <span class="time-box d-inline-flex justify-center align-center p-2 rounded-pill">
            {{ item.count }}
          </span>
          <v-icon
            v-if="item.count > 2"
            :style="{ color: item.count > 3 ? '#d00000' : '#ffba08' }"
            class="ms-1"
          >
            {{ item.count > 3 ? 'mdi-fire-alert' : 'mdi-alert-decagram-outline' }}
          </v-icon>
        </template>
      </BaseTable>
    </v-card>
  </v-col>
</v-row>
  </v-main>

  <v-main v-else class="pa-6 pt-4">
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="6">
            <v-card outlined>
              <v-card-title>Project Men Power</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <canvas id="menPowerChart"></canvas>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card outlined>
              <v-card-title>Employees' Skill</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <canvas id="leaveChart"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <BaseTable
  :headers="leaveHeader"
  :items="memberLeave"
  class="elevation-0 pa-2"
>
  <!-- Employee Name -->
  <template #[`item.eng_name`]="{ item }">
    <span class="font-weight-medium">{{ item.eng_name }}</span>
  </template>

  <!-- Leave Type: Paid / Unpaid -->
  <template #[`item.leave_type`]="{ item }">
    <span v-if="item.leave_type === 1" class="status d-inline-flex justify-center align-center">
      paid
    </span>
    <span v-else class="status1 d-inline-flex justify-center align-center">
      unpaid
    </span>
  </template>

  <!-- Duration Mapping -->
  <template #[`item.duration`]="{ item }">
    <span v-if="item.duration == 1">Full day</span>
    <span v-else-if="item.duration == 2">Half day</span>
    <span v-else-if="item.duration == 3">3 Hrs : 30 Min</span>
    <span v-else-if="item.duration == 4">3 Hrs</span>
    <span v-else-if="item.duration == 5">2 Hrs : 30 Min</span>
    <span v-else-if="item.duration == 6">2 Hrs</span>
    <span v-else-if="item.duration == 7">1 Hrs : 30 Min</span>
    <span v-else-if="item.duration == 8">1 Hrs</span>
    <span v-else-if="item.duration == 9">30 Min</span>
    <span v-else>{{ item.duration }}</span>
  </template>

  <!-- Reason -->
  <template #[`item.reason`]="{ item }">
    <span>{{ item.reason || '-' }}</span>
  </template>
</BaseTable>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="4">
            <v-card class="card-chart" outlined>
              <v-card-title>Japanese Level</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <canvas id="fineChart"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
  <v-card rounded="lg" elevation="1">
    <v-card-title class="text-h6 pa-4">Fine Record</v-card-title>
    <v-divider></v-divider>

    <BaseTable 
      :headers="fineHeader" 
      :items="memberFine" 
      :items-per-page="-1"
      hide-default-footer
      class="elevation-0 pa-2 no-scroll-table"
    >
      <!-- Employee Name Slot -->
      <template #[`item.eng_name`]="{ item }">
        <span class="font-weight-medium text-truncate d-block">{{ item.eng_name }}</span>
      </template>

      <!-- Time Slot -->
      <template #[`item.time`]="{ item }">
        <span class="time-box d-inline-flex justify-center align-center">
          <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
          {{ item.time }}
        </span>
      </template>

      <!-- Fine Amount Slot -->
      <template #[`item.fine`]="{ item }">
        <span class="money-box d-inline-flex justify-center align-center">
          {{ item.fine + ' Ks' }}
        </span>
      </template>

      <!-- Count & Alert Icon Slot -->
      <template #[`item.count`]="{ item }">
        <span class="time-box d-inline-flex justify-center align-center p-2 rounded-pill">
          {{ item.count }}
        </span>
        <v-icon
          v-if="item.count > 2"
          :style="{ color: item.count > 3 ? '#d00000' : '#ffba08' }"
          class="ms-1"
        >
          {{ item.count > 3 ? 'mdi-fire-alert' : 'mdi-alert-decagram-outline' }}
        </v-icon>
      </template>
    </BaseTable>
  </v-card>
</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { borderClass } from '@/utils/border';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useMemberStore } from '@/stores/member/member.js';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useMenPowerStoreStore } from '@/stores/menpower/menpower.js';
import { ADMIN } from '@/utils/constant';
import { useLeaveStore } from '@/stores/leave/leave';
import {useMemberFineStore} from '@/stores/member/member-fine.js'

const { t, locale } = useI18n();
const lan = ref('en');
const authStore = useAuthStore();
const memberStore = useMemberStore();
const menPowerStore = useMenPowerStoreStore();
const leaveStore = useLeaveStore();
const fineStore = useMemberFineStore();
const staff = computed(() => authStore.loginStaff);
const staffId = computed(() => staff.value?.id);

// Safe Role Computed
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
const members = ref([]); // Admin View Member List 


const leaveHeader = computed(() => {
  const tmpHeaders = [
    { title: t('creatLeave.table.name'), key: 'eng_name', sortable: true },
    { title: t('creatLeave.form.leave_date'), key: 'leave_date' },
    { title: t('creatLeave.table.leave_type'), key: 'leave_type' },
    { title: t('creatLeave.table.duration'), key: 'duration' },
    { title: t('creatLeave.form.total_days'), key: 'day_count' },
    { title: t('creatLeave.table.reason'), key: 'reason' },
  ];
  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title ? header.title.toUpperCase() : '',
  }));
});

// const fineHeader = computed(() => {
//   const tmpHeaders = [
//     { title: t('creatLeave.table.name'), key: 'eng_name', sortable: true },
//     { title: t('creatLeave.form.date'), key: 'date' },
//     { title: t('creatLeave.form.time'), key: 'time' },
//     { title: t('creatLeave.table.count'), key: 'count' },
//     { title: t('creatLeave.table.fine'), key: 'fine' },
//   ];
//   return tmpHeaders.map((header) => ({
//     ...header,
//     title: header.title ? header.title.toUpperCase() : '',
//   }));
// });

// Fine Header Computed Property
const fineHeader = computed(() => {
  const tmpHeaders = [
    {
      title: t('memberFine.form.name'),
      key: lan.value === 'ja' ? 'jp_name' : 'eng_name',
      align: 'left',
    },
    {
      title: t('memberFine.form.date'),
      key: 'date',
      align: 'left',
      sortable: true,
      sortDirection: 'desc',
    },
    {
      title: t('memberFine.form.time'),
      key: 'time',
      align: 'left',
    },
    {
      title: t('memberFine.form.fine'),
      key: 'fine',
      align: 'left',
    },
   
    {
      title: t('memberFine.form.count'),
      key: 'count',
      align: 'left',
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

  // 1. Fetch Leave Data
  await leaveStore.fetchLeaveRecord();
  const allLeaveRecords = leaveStore.getLeaveRecords || [];

  memberLeave.value = allLeaveRecords.flatMap((record) =>
    (record.leaves || []).map((item) => ({
      id: item.id,
      eng_name: record.eng_name || '',
      leave_date: item.leave_date,
      leave_type: item.leave_type,
      duration: item.duration,
      day_count: item.day_count,
      reason: item.reason || '-',
    }))
  );

  // 2. Fetch Fine Data (Handle nested response object)
  const fineRes = await fineStore.fetchMemberFine();
  
  // Safely extract array from fineRes.data.data or fineRes.data
  const fineList = Array.isArray(fineRes?.data?.data)
    ? fineRes.data.data
    : Array.isArray(fineRes?.data)
    ? fineRes.data
    : [];

  memberFine.value = fineList.map((item) => ({
    id: item.id,
    eng_name: item.staff?.eng_name || '-',
    date: item.date,
    time: item.time,
    count: item.count,
    fine: item.amount,
  }));

  // 3. Fetch Member Skill & Japanese Level Data
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

  // 4. Fetch Man Power
  await menPowerStore.fetchMenPower();
  (menPowerStore.getMenPower || []).forEach((mp) => {
    menPower.value[mp.eng_name] = mp.hours;
  });
};

const renderPieChart = (canvasId, labels, data) => {
  const el = document.getElementById(canvasId);
  if (!el) return;
  const ctx = el.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          borderWidth: 0,
        },
      ],
    },
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
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14,
          },
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (a, b) => Number(a) + Number(b),
              0
            );
            if (!total) return '0%';
            const percentage = ((Number(value) / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
};

const renderChart = (canvasId, labels, data) => {
  const el = document.getElementById(canvasId);
  if (!el) return;
  const ctx = el.getContext('2d');
  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels,
      datasets: [
        {
          data,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          ticks: {
            display: false,
          },
          pointLabels: {
            display: true,
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'rect',
            boxWidth: 12,
            boxHeight: 12,
          },
        },
      },
    },
  });
};

const renderChart1 = (canvasId, labels, data) => {
  const el = document.getElementById(canvasId);
  if (!el) return;
  const ctx = el.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          borderWidth: 0,
        },
      ],
    },
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
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14,
          },
          formatter: (value, context) => {
            const dataset = context.chart.data.datasets[0].data.map(Number);
            const total = dataset.reduce((a, b) => a + b, 0);
            if (!total) return '0%';
            const percentage = ((Number(value) / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
};

onMounted(async () => {
  await fetchData();

  const skillLabel = Object.keys(majorSkill.value).sort(
    (a, b) => parseInt(a.slice(1) || 0) - parseInt(b.slice(1) || 0)
  );
  const skillData = skillLabel.map((label) => majorSkill.value[label]);

  const JapaneseLevelLabel = Object.keys(japaneseLevel.value).sort(
    (a, b) => parseInt(a.slice(1) || 0) - parseInt(b.slice(1) || 0)
  );
  const japaneseLevelData = JapaneseLevelLabel.map(
    (label) => japaneseLevel.value[label]
  );

  const menPowerLabel = Object.keys(menPower.value);
  const menPowerData = menPowerLabel.map((label) => menPower.value[label]);

  if (isAdmin.value) {
    renderChart('leaveChart', skillLabel, skillData);
    renderPieChart('fineChart', JapaneseLevelLabel, japaneseLevelData);
    renderChart1('menPowerChart', menPowerLabel, menPowerData);
  }
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