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

    <!-- Leave Summary Cards -->
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

    <!-- Detailed Leave Records Table -->
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

      <BaseTable :headers="headers" :items="filteredMemberLeaves" :loading="loading">
        <!-- Leave Date Column -->
        <template #[`item.leave_date`]="{ item }">
          <span class="font-weight-medium">{{ item.leave_date }}</span>
        </template>

        <!-- Leave Type Column -->
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

        <!-- Day Count Column -->
        <template #[`item.day_count`]="{ item }">
          {{ item.day_count }} Day(s)
        </template>

        <!-- Reason Column -->
        <template #[`item.reason`]="{ item }">
          {{ item.reason || '-' }}
        </template>
      </BaseTable>
    </ParentCard>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLeaveStore } from '@/stores/leave/leave.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const leaveStore = useLeaveStore();

const search = ref('');
const loading = ref(false);
const memberLeaves = ref([]);

const employeeInfo = computed(() => {
  if (memberLeaves.value.length > 0) {
    const first = memberLeaves.value[0];
    return {
      eng_name: first.eng_name,
      jp_name: first.jp_name,
    };
  }
  return {};
});

const leaveSummary = computed(() => {
  return memberLeaves.value[0]?.leave_record_summary || {};
});

const headers = computed(() => {
  const tmpHeaders = [
    { title: t('creatLeave.form.leave_date'), key: 'leave_date' },
    { title: t('creatLeave.table.leave_type'), key: 'leave_type' },
    { title: t('creatLeave.table.duration'), key: 'duration' },
    { title: t('creatLeave.form.day_count'), key: 'day_count' },
    { title: t('creatLeave.table.reason'), key: 'reason' },
  ];

  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title.toUpperCase(),
  }));
});

const filteredMemberLeaves = computed(() => {
  if (!search.value) return memberLeaves.value;
  const q = search.value.toLowerCase();
  return memberLeaves.value.filter(
    (item) =>
      item.leave_date?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q)
  );
});

// Watcher matching your specified pattern
watch(
  () => route.params.recId,
  async (recId) => {
    if (recId) {
      loading.value = true;
      try {
        const res = await leaveStore.fetchLeave({
          rec_id: parseInt(recId),
        });
        memberLeaves.value = res?.data || res || [];
      } catch (e) {
        console.error('Error fetching member leave details:', e);
        memberLeaves.value = [];
      } finally {
        loading.value = false;
      }
    } else {
      memberLeaves.value = [];
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