<template>
  <v-container>
    <v-main v-if="role !== 1" class="pa-6 pt-4">
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

      <!-- Leave Approval + Chart -->
      <v-row class="mb-6" dense>
        <v-col cols="12" md="5">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-h6">Leave Record</v-card-title>
            <v-data-table
              :headers="leaveHeader"
              :items="memberLeave"
              class="elevation-0"
            >
              <template #[`item.status`]="{ item }">
                <v-chip color="warning" text-color="black" size="small" label>{{
                  item.status
                }}</v-chip>
              </template>
              <template #[`item.action`]="">
                <v-btn icon size="x-small" color="green">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn icon size="x-small" color="red">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="12" md="7">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-h6">Fine Record</v-card-title>
            <BaseTable :headers="fineHeader" :items="memberFine">
              <template #[`item.time`]="{ item }">
                <span
                  class="time-box d-inline-flex justify-center align-center"
                >
                  <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
                  {{ item.time }}
                </span>
              </template>
              <template #[`item.fine`]="{ item }">
                <span
                  class="money-box d-inline-flex justify-center align-center"
                >
                  {{ item.fine + ' Ks' }}
                </span>
              </template>
              <template #[`item.total`]="{ item }">
                <span
                  class="money-box d-inline-flex justify-center align-center"
                >
                  {{ item.total + ' Ks' }}
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
    </v-main>
  </v-container>
</template>

<script setup>
import { borderClass } from '@/utils/border';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useMemberStore } from '@/stores/member/member.js';

const authStore = useAuthStore();
const { t, locale } = useI18n();
const memberStore = useMemberStore();
const staff = authStore.loginStaff;

const staffId = staff.id;
const role = staff.sort_key;
const memberLeave = ref([]);
const memberFine = ref([]);

const fineHeader = computed(() => {
  const lan = locale.value;
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
      title: t('memberFine.form.total'),
      key: 'total',
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

const fetch = async () => {
  const payload = { leave: {}, over_time: {}, fine: {} };
  if (role !== 1) {
    payload.id = staffId;
  }
  await memberStore.fetchMember(payload);
  const leaves = memberStore.getMembers[0]?.leave;
  const fines = memberStore.getMembers[0]?.fine;

  const tmpArr = leaves.map((item) => ({
    leave_type: item?.leave_type,
    leave_date: item?.leave_date,
    duration: item?.duration,
  }));
  memberLeave.value = [...tmpArr];

  const tmpArr1 = fines.map((item) => ({
    date: item?.date,
    time: item?.time,
    total: item?.total,
    count: item?.count,
    fine: item?.amount,
  }));
  memberFine.value = [...tmpArr1];
};
fetch();
</script>

<style scoped>
.empty {
  background-color: transparent;
}
</style>
