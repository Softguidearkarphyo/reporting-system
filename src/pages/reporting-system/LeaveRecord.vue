<template>
  <div class="leave-management-view p-6 bg-gray-50 min-h-screen">
    <template v-if="isAdmin">
      <v-row class="align-center mb-3">
        <v-col cols="6" md="7" lg="9" class="d-flex justify-start">
          <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>
        </v-col>
        <v-col cols="6" md="5" lg="3" class="d-flex justify-end">
          <BaseTextField
            v-model="search"
            :label="t('common.search')"
            color="primary"
            prepend-icon="mdi-magnify"
          />
        </v-col>
      </v-row>

      <ParentCard>
        <BaseTable :headers="adminHeaders" :items="filteredAdminLeaveList" :loading="loading">
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
              <v-btn
                icon
                size="small"
                variant="text"
                color="primary"
                @click.stop="pushToView(item.rec_id)"
              >
                <v-icon icon="tabler:IconEye" size="18" />
              </v-btn>
            </div>
          </template>
        </BaseTable>
      </ParentCard>
    </template>

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

      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 rounded-lg" elevation="1">
            <div class="text-caption font-weight-medium text-gray-500 mb-1">TOTAL USED</div>
            <div class="d-flex align-baseline">
              <span class="text-h4 font-weight-bold text-primary me-2">
                {{ leaveSummary.total_used ?? 0 }}
              </span>
              <span class="text-body-2 text-gray-500">/ {{ leaveSummary.total_leaves ?? 0 }} Days</span>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 rounded-lg" elevation="1">
            <div class="text-caption font-weight-medium text-gray-500 mb-1">REMAIN LEAVES</div>
            <div class="d-flex align-baseline">
              <span class="text-h4 font-weight-bold text-info me-2">
                {{ leaveSummary.remain_leaves ?? 0 }}
              </span>
              <span class="text-body-2 text-gray-500">Days</span>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 rounded-lg" elevation="1">
            <div class="text-caption font-weight-medium text-gray-500 mb-1">FIRST ANNUAL</div>
            <div class="d-flex align-baseline">
              <span class="text-h4 font-weight-bold text-warning me-2">
                {{ leaveSummary.first_annual ?? 0 }}
              </span>
              <span class="text-body-2 text-gray-500">Days</span>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 rounded-lg" elevation="1">
            <div class="text-caption font-weight-medium text-gray-500 mb-1">SECOND ANNUAL</div>
            <div class="d-flex align-baseline">
              <span class="text-h4 font-weight-bold text-success me-2">
                {{ leaveSummary.second_annual ?? 0 }}
              </span>
              <span class="text-body-2 text-gray-500">Days</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <ParentCard>
        <v-row class="align-center mb-3">
          <v-col cols="6" md="8">
            <h3 class="text-subtitle-1 font-weight-bold">
              {{ t('creatLeave.title4') || 'ON LEAVE RECORDS' }}
            </h3>
          </v-col>
          <v-col cols="6" md="4" class="d-flex justify-end">
            <BaseTextField
              v-model="search"
              :label="t('common.search')"
              color="primary"
              prepend-icon="mdi-magnify"
              density="compact"
            />
          </v-col>
        </v-row>

        <BaseTable :headers="userHeaders" :items="filteredUserLeaveList" :loading="loading">
          <template #[`item.leave_date`]="{ item }">
            <span class="font-weight-medium">{{ item.leave_date }}</span>
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
        </BaseTable>
      </ParentCard>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useLeaveStore } from '@/stores/leave/leave.js';
import { ADMIN } from '@/utils/constant';

const { t } = useI18n();
const authStore = useAuthStore();
const leaveStore = useLeaveStore();
const router = useRouter();

const search = ref('');
const loading = ref(false);

const memberRecord = ref(null);

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

const adminHeaders = computed(() => [
  { title: t('creatLeave.table.name').toUpperCase(), key: 'name', sortable: true },
  { title: t('creatLeave.form.leave_date').toUpperCase(), key: 'leave_date' },
  { title: t('creatLeave.table.leave_type').toUpperCase(), key: 'leave_type' },
  { title: t('creatLeave.table.duration').toUpperCase(), key: 'duration' },
  { title: t('creatLeave.form.total_days').toUpperCase(), key: 'day_count' },
  { title: t('creatLeave.table.reason').toUpperCase(), key: 'reason' },
  { title: t('memberList.table.action').toUpperCase(), key: 'action', align: 'end', sortable: false },
]);

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

const userHeaders = computed(() => [
  { title: t('creatLeave.form.leave_date').toUpperCase(), key: 'leave_date' },
  { title: t('creatLeave.table.leave_type').toUpperCase(), key: 'leave_type' },
  { title: t('creatLeave.table.duration').toUpperCase(), key: 'duration' },
  { title: t('creatLeave.form.day_count').toUpperCase(), key: 'day_count' },
  { title: t('creatLeave.table.reason').toUpperCase(), key: 'reason' },
]);

const employeeInfo = computed(() => {
  return {
    eng_name: memberRecord.value?.eng_name || authStore.staff?.eng_name,
    jp_name: memberRecord.value?.jp_name || authStore.staff?.jp_name,
  };
});

const leaveSummary = computed(() => {
  return memberRecord.value || {};
});

const userLeaveList = computed(() => {
  return memberRecord.value?.leaves || [];
});

const filteredUserLeaveList = computed(() => {
  if (!search.value) return userLeaveList.value;
  const q = search.value.toLowerCase();
  return userLeaveList.value.filter(
    (item) =>
      item.leave_date?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q)
  );
});

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
      await leaveStore.fetchLeave({});
    } else {
      const staffId =
        authStore.staff?.staff_id ||
        authStore.staff?.rec_id ||
        authStore.staff?.id ||
        getStoredStaffId();

      if (staffId) {
        const response = await leaveStore.fetchLeaveRecord({ 
          staff_id: parseInt(staffId),
        });

        const rawData = response?.data || response || [];
        console.log("hi d ", rawData);
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