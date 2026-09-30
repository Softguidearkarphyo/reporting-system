<template>
  <div class="member-leave-detail p-6 bg-gray-50 min-h-screen">
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center">
        <v-btn icon variant="text" color="primary" class="me-2" @click="goBack">
          <v-icon icon="tabler:IconArrowLeft" size="22" />
        </v-btn>

        <h2 class="text-h5 font-weight-bold mb-0 d-flex align-center ga-2">
          <span>{{ employeeInfo.eng_name || 'Employee Leave Details' }}</span>
          <span v-if="employeeInfo.jp_name" class="text-body-1 text-gray-500">
            ({{ employeeInfo.jp_name }})
          </span>
        </h2>
      </v-col>
    </v-row>

    <div class="d-flex flex-wrap ga-4 mb-6">
      <v-card class="pa-4 rounded-lg flex-1-0" elevation="1">
        <div class="text-caption font-weight-medium text-gray-500 mb-1">TOTAL USED</div>
        <div class="d-flex align-baseline">
          <span class="text-h4 font-weight-bold text-primary me-2">
            {{ leaveSummary.total_used ?? 0 }}
          </span>
          <span class="text-body-2 text-gray-500">/ {{ leaveSummary.total_leaves ?? 0 }} Days</span>
        </div>
      </v-card>

      <v-card class="pa-4 rounded-lg flex-1-0" elevation="1">
        <div class="text-caption font-weight-medium text-gray-500 mb-1">REMAIN LEAVES</div>
        <div class="d-flex align-baseline">
          <span class="text-h4 font-weight-bold text-info me-2">
            {{ leaveSummary.remain_leaves ?? 0 }}
          </span>
          <span class="text-body-2 text-gray-500">Days</span>
        </div>
      </v-card>

      <v-card class="pa-4 rounded-lg flex-1-0" elevation="1">
        <div class="text-caption font-weight-medium text-gray-500 mb-1">FIRST ANNUAL</div>
        <div class="d-flex align-baseline">
          <span class="text-h4 font-weight-bold text-warning me-2">
            {{ leaveSummary.first_annual ?? 0 }}
          </span>
          <span class="text-body-2 text-gray-500">Days</span>
        </div>
      </v-card>

      <v-card class="pa-4 rounded-lg flex-1-0" elevation="1">
        <div class="text-caption font-weight-medium text-gray-500 mb-1">SECOND ANNUAL</div>
        <div class="d-flex align-baseline">
          <span class="text-h4 font-weight-bold text-success me-2">
            {{ leaveSummary.second_annual ?? 0 }}
          </span>
          <span class="text-body-2 text-gray-500">Days</span>
        </div>
      </v-card>

      <v-card class="pa-4 rounded-lg flex-1-0" elevation="1">
        <div class="text-caption font-weight-medium text-gray-500 mb-1">TOTAL OVERTIME</div>
        <div class="d-flex align-baseline">
          <span class="text-h4 font-weight-bold text-purple me-2">
            {{ totalOvertimeFormatted }}
          </span>
        </div>
      </v-card>
    </div>
    <v-row>
      <v-col cols="12" md="8">
        <ParentCard class="elevation-1 rounded-lg h-100">
          <v-row class="align-center mb-3">
            <v-col cols="6" md="7">
              <h3 class="text-subtitle-1 font-weight-bold text-uppercase tracking-wide">
                {{ t('creatLeave.title4') || 'ON LEAVE RECORDS' }}
              </h3>
            </v-col>
            <v-col cols="6" md="5" class="d-flex justify-end">
              <BaseTextField v-model="search" :label="t('common.search')" color="primary"
                prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" hide-details class="rounded-lg" />
            </v-col>
          </v-row>

          <BaseTable :headers="headers" :items="filteredMemberLeaves" :loading="loading">
            <template #[`item.leave_date`]="{ item }">
              <span class="font-weight-medium text-body-2">{{ item.leave_date }}</span>
            </template>

            <template #[`item.leave_type`]="{ item }">
              <span v-if="item.leave_type === 1"
                class="status d-inline-flex justify-center align-center px-3 py-1 rounded-pill text-caption font-weight-bold text-uppercase bg-success-lighten-5 text-success">
                paid
              </span>
              <span v-else
                class="status1 d-inline-flex justify-center align-center px-3 py-1 rounded-pill text-caption font-weight-bold text-uppercase bg-warning-lighten-5 text-warning">
                unpaid
              </span>
            </template>

            <template #[`item.duration`]="{ item }">
              <span class="text-body-2 text-medium-emphasis">
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
              </span>
            </template>

            <template #[`item.day_count`]="{ item }">
              <span class="font-weight-medium text-body-2">{{ item.day_count }} Day(s)</span>
            </template>

            <template #[`item.reason`]="{ item }">
              <span class="text-body-2 text-medium-emphasis">
                {{ item.reason || '-' }}
              </span>
            </template>
          </BaseTable>
        </ParentCard>
      </v-col>

      <v-col cols="12" md="4">
        <ParentCard class="elevation-1 rounded-lg h-100">
          <v-row class="align-center mb-3">
            <v-col cols="12">
              <h3 class="text-subtitle-1 font-weight-bold text-uppercase tracking-wide">
                {{ t('creatLeave.otTitle') || 'OVERTIME RECORDS' }}
              </h3>
            </v-col>
          </v-row>

          <BaseTable :headers="multiHeaders3" :items="overtimes" :loading="loading" items-per-page="10">
            <template #[`item.ot_time`]="{ item }">
              <span v-if="item.ot_time == 1">Full day</span>
              <span v-else-if="item.ot_time == 2">Half day</span>
              <span v-else-if="item.ot_time == 3">3 Hrs : 30 Min</span>
              <span v-else-if="item.ot_time == 4">3 Hrs</span>
              <span v-else-if="item.ot_time == 5">2 Hrs : 30 Min</span>
              <span v-else-if="item.ot_time == 6">2 Hrs</span>
              <span v-else-if="item.ot_time == 7">1 Hrs : 30 Min</span>
              <span v-else-if="item.ot_time == 8">1 Hrs</span>
              <span v-else-if="item.ot_time == 9">30 Min</span>
              <span v-else>{{ item.ot_time }}</span>
            </template>

            <template #[`item.status`]="{ item }">
              <span class="d-inline-flex align-center py-1">
                <span
                  class="status-label d-inline-flex align-center px-3 py-1 mr-2 rounded-pill text-caption font-weight-medium"
                  :style="{
                    backgroundColor: item.statusBg,
                    color: item.statusColor,
                    lineHeight: 1.2
                  }">
                  <v-icon size="16" class="mr-1" :color="item.statusColor">
                    {{ item.statusIcon }}
                  </v-icon>
                  {{ item.statusLabel }}
                </span>

                <span v-if="item.status === 2" class="d-inline-flex align-center">
                  <v-switch color="primary" density="compact" :hide-details="true" :model-value="item.isComplete"
                    @update:model-value="onSwitchChange(item)"
                    style="transform: scale(0.75); margin-top: 0; margin-bottom: 0;" />
                </span>
              </span>
            </template>
            <template #[`item.action`]="{ item }">
              <span class="d-flex justify-left align-center p-0">
                <BaseButton elevation="0" color="" class="delete-btn" size="small" :add-class="['ma-1']"
                  @click.stop="showConfirmDelete(item.id)">
                  <v-icon icon="tabler:IconTrash" size="15" />
                </BaseButton>
              </span>
            </template>
          </BaseTable>
        </ParentCard>
      </v-col>
    </v-row>
  </div>
  <BaseConfirmDelete v-model="confirmDelete" :text="t('memberFine.deleteConfirmText')"
    :class="{ 'd-none': !confirmDelete }" @yes="
      confirmDelete = false;
    deleteOvertime();
    " @no="
      confirmDelete = false;
    deleteTarget = undefined;
    " />


  <BaseConfirmDelete v-model="confirmChange" :text="t('memberFine.statusConfirmText')"
    :class="{ 'd-none': !confirmChange }" @yes="
      confirmChange = false;
    if (switchTarget) {
      onStatusSwitchChange(switchTarget, !switchTarget.isComplete);
      switchTarget = null;
    }
    " @no="
      confirmChange = false;
    switchTarget = null;
    " />
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'; // 1. Fixed missing onMounted import
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLeaveStore } from '@/stores/leave/leave.js';
import { useOverTimeStore } from '@/stores/overtime/overtime.js';
import { useAuthStore } from '@/stores/auth/auth.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const leaveStore = useLeaveStore();
const overTimeStore = useOverTimeStore();

const search = ref('');
const loading = ref(false);
const memberLeaves = ref([]);
const overTimeRecords = ref([]);

const switchTarget = ref(null);
const deleteTarget = ref(undefined);
const confirmDelete = ref(false);
const confirmChange = ref(false);

const otHoursMap = {
  1: 8,
  2: 4,
  3: 3.5,
  4: 3,
  5: 2.5,
  6: 2,
  7: 1.5,
  8: 1,
  9: 0.5
};

const employeeInfo = computed(() => {
  if (memberLeaves.value.length > 0) {
    const first = memberLeaves.value[0];
    return {
      eng_name: first.eng_name,
      jp_name: first.jp_name
    };
  }
  return {};
});

const leaveSummary = computed(() => {
  return memberLeaves.value[0]?.leave_record_summary || {};
});

// Headers
const headers = computed(() => {
  const tmpHeaders = [
    { title: t('creatLeave.form.leave_date'), key: 'leave_date' },
    { title: t('creatLeave.table.leave_type'), key: 'leave_type' },
    { title: t('creatLeave.table.duration'), key: 'duration' },
    { title: t('creatLeave.form.day_count'), key: 'day_count' },
    { title: t('creatLeave.table.reason'), key: 'reason' }
  ];

  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title.toUpperCase()
  }));
});

const multiHeaders3 = computed(() => [
  {
    title: t('creatLeave.form.ot_date'),
    key: 'ot_date',
  },
  {
    title: t('creatLeave.form.ot_time'),
    key: 'ot_time',
  },
  {
    title: t('memberFine.form.status'),
    key: 'status',
  },
  {
    title: t('memberFine.form.action'),
    key: 'action',
  },
]);

const getStoredStaffId = () => {
  return localStorage.getItem('staff-id');
};

// Fallback staff ID from store or localStorage
const staffId = computed(() => {
  return (
    authStore.staff?.staff_id ||
    authStore.staff?.rec_id ||
    authStore.staff?.id ||
    getStoredStaffId()
  );
});

const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};

const filteredMemberLeaves = computed(() => {
  if (!search.value) return memberLeaves.value;
  const q = search.value.toLowerCase();
  return memberLeaves.value.filter(
    (item) =>
      item.leave_date?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q)
  );
});

const overtimes = computed(() => {
  return overTimeRecords.value.map((item) => {
    let statusLabel = 'Pending';
    let statusColor = '#E6A23C';
    let statusBg = '#FDF6EC';
    let statusIcon = 'mdi-clock-outline';

    if (item.status === 2) {
      statusLabel = 'Approved';
      statusColor = '#409EFF';
      statusBg = '#ECF5FF';
      statusIcon = 'mdi-check-circle-outline';
    } else if (item.status === 3) {
      statusLabel = 'Completed';
      statusColor = '#67C23A';
      statusBg = '#F0F9EB';
      statusIcon = 'mdi-checkbox-marked-circle-outline';
    } else if (item.status === 4) {
      statusLabel = 'Rejected';
      statusColor = '#F56C6C';
      statusBg = '#FEF0F0';
      statusIcon = 'mdi-close-circle-outline';
    }

    return {
      ...item,
      statusLabel,
      statusColor,
      statusBg,
      statusIcon,
      isComplete: item.status === 3
    };
  });
});

const totalOvertimeHours = computed(() => {
  return overTimeRecords.value.reduce((sum, item) => {
    const key = Number(item.ot_time);
    const hours = otHoursMap[key] ?? (parseFloat(item.ot_time) || 0);
    return sum + (isNaN(hours) ? 0 : hours);
  }, 0);
});

const totalOvertimeFormatted = computed(() => {
  const total = totalOvertimeHours.value;
  const hours = Math.floor(total);
  const minutes = Math.round((total - hours) * 60);

  if (minutes > 0) {
    return `${hours} Hrs : ${minutes} Min`;
  }
  return `${hours} Hrs`;
});

const onSwitchChange = (item) => {
  switchTarget.value = item;
  confirmChange.value = true;
};

const onStatusSwitchChange = async (item) => {
  if (!item || !item.id) return;
  const newStatus = item.status === 3 ? 2 : 3;

  try {
    await overTimeStore.updateOverTimeStatus({
      id: item.id,
      status: newStatus
    });
    fetchOvertimeData(route.params.recId);
  } catch (error) {
    console.error('Failed to change overtime status:', error);
  }
};

const fetchOvertimeData = async (staffIdParam) => {
  try {
    const res = await overTimeStore.fetchOverTime({ staff_id: parseInt(staffIdParam) });
    const data = res?.data || res || [];
    overTimeRecords.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Error fetching member overtime details:', e);
    overTimeRecords.value = [];
  }
};

watch(
  () => route.params.recId,
  async (recId) => {
    if (recId) {
      loading.value = true;
      try {
        const parsedId = parseInt(recId);
        const [leaveRes] = await Promise.all([
          leaveStore.fetchLeave({ rec_id: parsedId }),
          fetchOvertimeData(parsedId)
        ]);
        memberLeaves.value = leaveRes?.data || leaveRes || [];
      } catch (e) {
        console.error('Error fetching member details:', e);
        memberLeaves.value = [];
      } finally {
        loading.value = false;
      }
    } else {
      memberLeaves.value = [];
      overTimeRecords.value = [];
    }
  },
  { immediate: true }
);

const goBack = () => {
  router.back();
};
</script>
<style scoped>
.status {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status1 {
  background-color: #ffebee;
  color: #c62828;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}
</style>