<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Admin View -->
    <template v-if="isAdmin">
      <v-row class="align-center" density="compact">
        <v-col cols="6" md="7" lg="9" class="d-flex justify-start">
          <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>
        </v-col>
        <v-col cols="6" md="5" lg="3" class="d-flex justify-end">
          <BaseTextField
            v-model="search"
            :label="t('common.search')"
            color="primary"
            prepend-icon="mdi-magnify"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>

      <ParentCard>
        <BaseTable
          v-if="filteredAdminLeaveList && filteredAdminLeaveList.length"
          :headers="adminHeaders"
          :items="filteredAdminLeaveList"
          :loading="loading"
        >
          <template #[`item.name`]="{ item }">
            <div>
              <div class="font-weight-medium text-gray-900">{{ item.eng_name || '-' }}</div>
              <div class="text-caption text-gray-500" v-if="item.jp_name">({{ item.jp_name }})</div>
            </div>
          </template>

          <template #[`item.leave_type`]="{ item }">
            <span v-if="item.leave_type === 1" class="status d-inline-flex justify-center align-center">
              paid
            </span>
            <span v-else class="status1 d-inline-flex justify-center align-center">
              unpaid
            </span>
          </template>

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

          <template #[`item.day_count`]="{ item }">
            {{ item.day_count }} Day(s)
          </template>

          <template #[`item.reason`]="{ item }">
            {{ item.reason || '-' }}
          </template>

          <template #[`item.action`]="{ item }">
            <div class="d-flex justify-end">
              <v-btn icon size="small" variant="text" color="primary" @click.stop="pushToView(item.rec_id)">
                <v-icon icon="tabler:IconEye" size="18" />
              </v-btn>
            </div>
          </template>
        </BaseTable>

        <!-- Admin Table Empty State -->
        <div v-else class="text-center pa-8 text-gray-500">
          <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-calendar-blank-outline</v-icon>
          <div class="text-body-1">No leave records found</div>
        </div>
      </ParentCard>
    </template>

    <!-- User View -->
    <template v-else>
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex align-center">
          <h2 class="text-h5 font-weight-bold mb-0 d-flex align-center ga-2">
            <span>{{ employeeInfo.eng_name || authStore.staff?.eng_name || 'My Leave Details' }}</span>
            <span v-if="employeeInfo.jp_name || authStore.staff?.jp_name" class="text-body-1 text-gray-500">
              ({{ employeeInfo.jp_name || authStore.staff?.jp_name }})
            </span>
          </h2>
        </v-col>
      </v-row>

      <!-- Metric Summary Cards -->
      <div class="d-flex flex-wrap flex-md-nowrap ga-3 mb-3">
        <v-card class="pa-4 rounded-lg flex-1-1" elevation="1">
          <div class="text-caption font-weight-medium text-gray-500 mb-1">TOTAL USED</div>
          <div class="d-flex align-baseline">
            <span class="text-h4 font-weight-bold text-primary me-2">
              {{ leaveSummary.total_used ?? 0 }}
            </span>
            <span class="text-body-2 text-gray-500">/ {{ leaveSummary.total_leaves ?? 0 }} Days</span>
          </div>
        </v-card>

        <v-card class="pa-4 rounded-lg flex-1-1" elevation="1">
          <div class="text-caption font-weight-medium text-gray-500 mb-1">REMAIN LEAVES</div>
          <div class="d-flex align-baseline">
            <span class="text-h4 font-weight-bold text-info me-2">
              {{ leaveSummary.remain_leaves ?? 0 }}
            </span>
            <span class="text-body-2 text-gray-500">Days</span>
          </div>
        </v-card>

        <v-card class="pa-4 rounded-lg flex-1-1" elevation="1">
          <div class="text-caption font-weight-medium text-gray-500 mb-1">FIRST ANNUAL</div>
          <div class="d-flex align-baseline">
            <span class="text-h4 font-weight-bold text-warning me-2">
              {{ leaveSummary.first_annual ?? 0 }}
            </span>
            <span class="text-body-2 text-gray-500">Days</span>
          </div>
        </v-card>

        <v-card class="pa-4 rounded-lg flex-1-1" elevation="1">
          <div class="text-caption font-weight-medium text-gray-500 mb-1">SECOND ANNUAL</div>
          <div class="d-flex align-baseline">
            <span class="text-h4 font-weight-bold text-success me-2">
              {{ leaveSummary.second_annual ?? 0 }}
            </span>
            <span class="text-body-2 text-gray-500">Days</span>
          </div>
        </v-card>

        <v-card class="pa-4 rounded-lg flex-1-1" elevation="1">
          <div class="text-caption font-weight-medium text-gray-500 mb-1">TOTAL OVERTIME</div>
          <div class="d-flex align-baseline">
            <span class="text-h4 font-weight-bold text-purple me-2">
              {{ totalOvertimeFormatted }}
            </span>
          </div>
        </v-card>
      </div>

      <v-row>
        <!-- 2/3 Width Space: ON LEAVE RECORDS -->
        <v-col cols="12" md="8">
          <ParentCard class="elevation-1 rounded-lg h-100">
            <v-row class="align-center mb-3">
              <v-col cols="6" md="7">
                <h3 class="text-subtitle-1 font-weight-bold text-uppercase tracking-wide">
                  {{ t('creatLeave.title4') || 'ON LEAVE RECORDS' }}
                </h3>
              </v-col>
              <v-col cols="6" md="5" class="d-flex justify-end">
                <BaseTextField
                  v-model="search"
                  :label="t('common.search')"
                  color="primary"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="rounded-lg"
                />
              </v-col>
            </v-row>

            <BaseTable
              v-if="filteredUserLeaveList && filteredUserLeaveList.length"
              :headers="userHeaders"
              :items="filteredUserLeaveList"
              :loading="loading"
            >
              <template #[`item.leave_date`]="{ item }">
                <span class="font-weight-medium text-body-2">{{ item.leave_date }}</span>
              </template>

              <template #[`item.leave_type`]="{ item }">
                <span
                  v-if="item.leave_type === 1"
                  class="status d-inline-flex justify-center align-center px-3 py-1 rounded-pill text-caption font-weight-bold text-uppercase bg-success-lighten-5 text-success"
                >
                  paid
                </span>
                <span
                  v-else
                  class="status1 d-inline-flex justify-center align-center px-3 py-1 rounded-pill text-caption font-weight-bold text-uppercase bg-warning-lighten-5 text-warning"
                >
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

            <!-- User Leave Records Empty State -->
            <div v-else class="text-center pa-8 text-gray-500">
              <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-calendar-blank-outline</v-icon>
              <div class="text-body-1">No leave records found</div>
            </div>
          </ParentCard>
        </v-col>

        <!-- 1/3 Width Space: OVERTIME RECORDS -->
        <v-col cols="12" md="4">
          <ParentCard class="elevation-1 rounded-lg h-100">
            <v-row class="align-center mb-3">
              <v-col cols="12">
                <h3 class="text-subtitle-1 font-weight-bold text-uppercase tracking-wide">
                  {{ t('creatLeave.title3') || 'OVERTIME RECORDS' }}
                </h3>
              </v-col>
            </v-row>

            <BaseTable
              v-if="overtimes && overtimes.length"
              :headers="multiHeaders3"
              :items="overtimes"
              items-per-page="10"
            >
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
                    }"
                  >
                    <v-icon size="16" class="mr-1" :color="item.statusColor">
                      {{ item.statusIcon }}
                    </v-icon>
                    {{ item.statusLabel }}
                  </span>

                  <span v-if="item.status === 0" class="d-inline-flex align-center">
                    <v-switch
                      color="primary"
                      density="compact"
                      :hide-details="true"
                      :model-value="item.isComplete"
                      @update:model-value="onSwitchChange(item)"
                      style="transform: scale(0.75); margin-top: 0; margin-bottom: 0;"
                    />
                  </span>
                </span>
              </template>
            </BaseTable>

            <!-- Overtime Records Empty State -->
            <div v-else class="text-center pa-8 text-gray-500">
              <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-clock-outline</v-icon>
              <div class="text-body-1">No overtime records found</div>
            </div>
          </ParentCard>
        </v-col>
      </v-row>
    </template>
  </div>

  <BaseConfirmDelete
    v-model="confirmChange"
    :text="t('memberFine.statusConfirmText')"
    :class="{ 'd-none': !confirmChange }"
    @yes="
      confirmChange = false;
      if (switchTarget) {
        onStatusSwitchChange(switchTarget, !switchTarget.isComplete);
        switchTarget = null;
      }
    "
    @no="
      confirmChange = false;
      switchTarget = null;
    "
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useLeaveStore } from '@/stores/leave/leave.js';
import { useOverTimeStore } from '@/stores/overtime/overtime';
import { ADMIN } from '@/utils/constant';

const { t } = useI18n();
const authStore = useAuthStore();
const leaveStore = useLeaveStore();
const overTimeStore = useOverTimeStore();
const router = useRouter();

const search = ref('');
const loading = ref(false);
const memberRecord = ref(null);
const overTimeRecords = ref([]);
const confirmChange = ref(undefined);
const switchTarget = ref(null);
const otHoursMap = {
  1: 8,     // Full day
  2: 4,     // Half day
  3: 3.5,   // 3 Hrs 30 Min
  4: 3,     // 3 Hrs
  5: 2.5,   // 2 Hrs 30 Min
  6: 2,     // 2 Hrs
  7: 1.5,   // 1 Hr 30 Min
  8: 1,     // 1 Hr
  9: 0.5    // 30 Min
};

const getStoredStaffId = () => {
  return localStorage.getItem('staff-id');
};

const role = computed(() => {
  const r =
    authStore.staffRole ??
    authStore.staff?.role ??
    authStore.staff?.staff_role ??
    localStorage.getItem('staff-role');

  return r !== null && r !== undefined ? Number(r) : null;
});

const isAdmin = computed(() => role.value === ADMIN);

// Headers Setup
const adminHeaders = computed(() => [
  { title: t('creatLeave.table.name').toUpperCase(), key: 'name', sortable: true },
  { title: t('creatLeave.form.leave_date').toUpperCase(), key: 'leave_date' },
  { title: t('creatLeave.table.leave_type').toUpperCase(), key: 'leave_type' },
  { title: t('creatLeave.table.duration').toUpperCase(), key: 'duration' },
  { title: t('creatLeave.form.total_days').toUpperCase(), key: 'day_count' },
  { title: t('creatLeave.table.reason').toUpperCase(), key: 'reason' },
  { title: t('memberList.table.action').toUpperCase(), key: 'action', align: 'end', sortable: false },
]);

const userHeaders = computed(() => [
  { title: t('creatLeave.form.leave_date').toUpperCase(), key: 'leave_date' },
  { title: t('creatLeave.table.leave_type').toUpperCase(), key: 'leave_type' },
  { title: t('creatLeave.table.duration').toUpperCase(), key: 'duration' },
  { title: t('creatLeave.form.total_days').toUpperCase(), key: 'day_count' },
  { title: t('creatLeave.table.reason').toUpperCase(), key: 'reason' },
]);

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
]);

const employeeInfo = computed(() => ({
  eng_name: memberRecord.value?.eng_name || authStore.staff?.eng_name,
  jp_name: memberRecord.value?.jp_name || authStore.staff?.jp_name,
}));

const leaveSummary = computed(() => memberRecord.value || {});

const adminLeaveList = computed(() => leaveStore.leaves || leaveStore.getLeaves || []);

const filteredAdminLeaveList = computed(() => {
  if (!search.value) return adminLeaveList.value;
  const q = search.value.toLowerCase();
  return adminLeaveList.value.filter(
    (item) =>
      item.eng_name?.toLowerCase().includes(q) ||
      item.jp_name?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q)
  );
});

const onSwitchChange = (item) => {
  switchTarget.value = item;
  confirmChange.value = true;
};

// User Leave Computeds
const userLeaveList = computed(() => memberRecord.value?.leaves || []);

const filteredUserLeaveList = computed(() => {
  if (!search.value) return userLeaveList.value;
  const q = search.value.toLowerCase();
  return userLeaveList.value.filter(
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
      statusLabel = 'Accept';
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

const onStatusSwitchChange = async (item) => {
  if (!item || !item.id) return;

  try {
    await overTimeStore.updateOverTimeStatus({
      id: item.id,
      status: 2
    });
    await fetchData();
  } catch (error) {
    console.error('Failed to change status:', error);
  }
};
const totalOvertimeHours = computed(() => {
  return overTimeRecords.value.reduce((sum, item) => {
    const key = Number(item.ot_time);
    const hours = otHoursMap[key] ?? (parseFloat(item.ot_time) || 0);
    return sum + hours;
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

// const overtimeCount = computed(() => overTimeRecords.value.length);

const pushToView = (id) => {
  router.push({ name: 'view-leaves', params: { recId: id } });
};

const fetchData = async () => {
  loading.value = true;
  try {
    if (!authStore.staff) {
      await authStore.fetchStaff();
    }

    if (isAdmin.value) {
      const [leaveRes, otRes] = await Promise.all([
        leaveStore.fetchLeave({}),
        overTimeStore.fetchOverTime({})
      ]);

      const otData = otRes?.data || otRes || [];
      overTimeRecords.value = Array.isArray(otData) ? otData : [];
    } else {
      const staffId =
        authStore.staff?.staff_id ||
        authStore.staff?.rec_id ||
        authStore.staff?.id ||
        getStoredStaffId();

      if (staffId) {
        const parsedStaffId = parseInt(staffId);

        const [leaveRes, otRes] = await Promise.all([
          leaveStore.fetchLeaveRecord({ staff_id: parsedStaffId }),
          overTimeStore.fetchOverTime({ staff_id: parsedStaffId })
        ]);

        const otData = otRes?.data || otRes || [];
        overTimeRecords.value = Array.isArray(otData) ? otData : [];

        const rawData = leaveRes?.data || leaveRes || [];
        if (Array.isArray(rawData) && rawData.length > 0) {
          memberRecord.value = rawData[0];
        } else if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
          memberRecord.value = rawData;
        }
      } else {
        console.warn('No staff ID found in auth store or localStorage.');
      }
    }
  } catch (e) {
    console.error('Failed to fetch leave details:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchData();
});
</script>