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
      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1">
          <v-card-title class="text-h6">Leave Record</v-card-title>
          <BaseTable
            :headers="leaveHeader"
            :items="memberLeave"
            class="elevation-0"
          >
            <template #[`item.status`]="{ item }">
              <v-chip color="warning" text-color="black" size="small" label>{{
                item.status
              }}</v-chip>
            </template>
            <template #[`item.action`]="{ item }">
              <v-btn icon size="x-small" color="green">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn icon size="x-small" color="red">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </BaseTable>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1">
          <v-card-title class="text-h6">Fine Record</v-card-title>
          <BaseTable :headers="fineHeader" :items="memberFine">
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
              <span
                class="time-box d-inline-flex justify-center align-center p-2 rounded-pill"
              >
                {{ item.count }}
              </span>
              <v-icon
                v-if="item.count > 2"
                :style="{
                  color: item.count > 3 ? '#d00000' : '#ffba08',
                }"
                class="ms-1"
                >{{
                  item.count > 3
                    ? 'mdi-fire-alert'
                    : 'mdi-alert-decagram-outline'
                }}
              </v-icon>
            </template>
            <template #[`item.action`]="{ item }">
              <span class="d-flex justify-left align-center p-0">
                <BaseButton
                  elevation="0"
                  color=""
                  class="delete-btn"
                  size="small"
                  :add-class="['ma-1']"
                  @click.stop="showConfirmDelete(item.id)"
                >
                  <v-icon icon="tabler:IconTrash" size="15" />
                </BaseButton>
              </span>
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
      <v-col cols="4">
        <v-card class="card-chart" outlined>
          <v-card-title class="text-h6">Leave Record</v-card-title>
          <v-list>
            <v-list-item v-for="(member, index) in members" :key="index">
              <template #prepend>
                <v-avatar size="40">
                  <v-img :src="member.avatar"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title>{{ member.name }}</v-list-item-title>
              <template #append>
                <v-chip :color="member.teamColor" size="small">{{ member.team }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
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
          <v-col cols="8">
            <v-card class="card-chart" outlined>
              <v-card-title>Overview</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <canvas id="overviewChart"></canvas>
              </v-card-text>
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

const { t, locale } = useI18n();
const authStore = useAuthStore();
const memberStore = useMemberStore();
const menPowerStore = useMenPowerStoreStore();

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

const fineHeader = computed(() => {
  const tmpHeaders = [
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
    title: header.title.toUpperCase(),
  }));
});

const leaveHeader = [
  { title: 'Leave Type', key: 'leave_type' },
  { title: 'Leave Date', key: 'leave_date' },
  { title: 'Duration', key: 'duration' },
];

const leaveTypes = [
  { name: 'Sick', remaining: 8 },
  { name: 'Casual', remaining: 8 },
  { name: 'Earned', remaining: 8 },
  { name: 'Comp off', remaining: 8 },
  { name: 'Annual', remaining: 8 },
];

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

  await memberStore.fetchMember(payload);

  const leaves = memberStore.getMembers?.[0]?.leave || [];
  const fines = memberStore.getMembers?.[0]?.fine || [];

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

  memberLeave.value = leaves.map((item) => ({
    leave_type: item?.leave_type,
    leave_date: item?.leave_date,
    duration: item?.duration,
  }));

  memberFine.value = fines.map((item) => ({
    date: item?.date,
    time: item?.time,
    total: item?.total,
    count: item?.count,
    fine: item?.amount,
  }));

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
</style>