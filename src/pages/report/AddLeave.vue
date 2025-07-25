<template>
  <v-container>
    <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>
    <ParentCard>
      <v-row class="align-center" dense>
        <v-col cols="12" md="12">
          <div class="d-flex flex-wrap align-center justify-space-around">
            <div v-if="!selectedMember" class="d-flex align-center">
              <BaseSelect
                v-model="selectedMemberId"
                :label="t('creatLeave.options.employee')"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconUserCog"
                :width="'250px'"
              />
            </div>
            <v-checkbox
              v-else
              v-model="isChecked"
              :label="t('creatLeave.options.selected_name') + selectName"
              hide-details
              color="primary"
              class="custom-checkbox"
              @update:modelValue="onCheckboxChange"
            />
            <v-checkbox
              v-model="selectedPotion"
              color="primary"
              :label="t('creatLeave.options.existing')"
              value="potions1"
              hide-details
              class="custom-checkbox"
            />
            <v-checkbox
              v-model="selectedPotion"
              color="primary"
              :label="t('creatLeave.options.new')"
              value="potions2"
              hide-details
              class="custom-checkbox"
            />
            <v-checkbox
              v-model="selectedPotion"
              color="primary"
              :label="t('creatLeave.options.ot')"
              value="potions3"
              hide-details
              class="custom-checkbox"
            />
          </div>
        </v-col>
      </v-row>
    </ParentCard>
    <v-row dense v-if="selectedMember && selectedPotion">
      <v-col cols="12" md="7">
        <ParentCard>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <BaseTitle
                v-if="selectedPotion === 'potions1'"
                style="font-size: 15px"
                >{{ t('creatLeave.title1') }}</BaseTitle
              >
              <BaseTitle
                v-else-if="selectedPotion === 'potions2'"
                style="font-size: 15px"
                >{{ t('creatLeave.title2') }}</BaseTitle
              >
              <BaseTitle v-else style="font-size: 15px">{{
                t('creatLeave.title3')
              }}</BaseTitle>
            </v-col>
          </v-row>
          <v-row v-if="selectedPotion === 'potions1'" dense>
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form.leave_type')"
                class="mx-auto"
                :items="leaveTypes"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconSpeakerphone"
                :width="'400px'"
              />
            </v-col>
            <v-col cols="12" md="6">
              <BaseDatePicker
                v-model="permanent_date"
                v-bind="field"
                :label="t('creatLeave.form.leave_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
                :multiple="true"
              ></BaseDatePicker>
            </v-col>
          </v-row>
          <v-row dense v-if="selectedPotion === 'potions1'">
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form.duration')"
                class="mx-auto"
                :items="leaveDurations"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconClockQuestion"
                :width="'400px'"
              />
            </v-col>
            <v-col cols="12" md="6">
              <BaseTextField
                v-model="permanent_date"
                v-bind="field"
                :label="t('creatLeave.form.reason')"
                class="mx-auto"
                type="text"
                variant="plain"
                prependIcon="tabler:IconHelpCircle"
                :width="'400px'"
              ></BaseTextField>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-start ml-5">
              <v-switch
                class="custom-switch-label"
                label="MULTIPLE LEAVE"
                color="primary"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row dense v-if="selectedPotion === 'potions2'">
            <v-col cols="12" md="6">
              <BaseDatePicker
                v-model="form.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form.permanent_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
            <v-col cols="12" md="6">
              <BaseDatePicker
                v-model="form.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form.permanent_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
          </v-row>
          <v-row v-if="selectedPotion === 'potions3'" dense>
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form.ot_date')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconAlarm"
                :width="'400px'"
              />
            </v-col>
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form.ot_time')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconAlarm"
                :width="'400px'"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <BaseButton type="submit" style="width: 200px">
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </ParentCard>
      </v-col>

      <!-- Second Card: 1/3 width -->
      <v-col cols="12" md="5">
        <ParentCard>
          <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>

          <v-data-table
            v-if="selectedPotion === 'potions2'"
            :headers="headers1"
            :items="leaveRequests"
            items-per-page="10"
            class="elevation-1"
          >
            <template #[`item.status`]="{ item }">
              <v-chip color="orange lighten-4" text-color="orange" small>
                {{ item.status }}
              </v-chip>
            </template>

            <template #[`item.actions`]="{ item }">
              <v-btn icon color="success" @click="approveLeave(item)">
                <v-icon>mdi-check-circle</v-icon>
              </v-btn>
              <v-btn icon color="error" @click="rejectLeave(item)">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </ParentCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMemberStore } from '@/stores/member/member.js';
const { t, locale } = useI18n();
const memberStore = useMemberStore();

const headers1 = [
  { title: 'LEAVE DATE', key: 'type' },
  { title: 'LEAVE DATE', key: 'date' },
  { title: 'REASON', key: 'reason' },
  { title: 'ACTION', key: 'action' },
];
const form = ref({
  name: '',
  leave_type: '',
  leave_date: [],
  duration: '',
  reason: '',
  ot_date: '',
  ot_time: '',
  permanent_date: '',
});

const leaveRequests = ref([
  {
    name: 'Jessica',
    type: 'Sick Leave',
    date: 'First Half',
    reason: 'First Half',
    action: 'Pending',
  },
  {
    name: 'Jenny',
    type: 'Sick Leave',
    date: '15 July 2023',
    reason: '15 July 2023',
    action: 'Pending',
  },
  {
    name: 'John',
    type: 'Casual Leave',
    date: '15 July 2023',
    reason: '18 July 2023',
    action: 'Pending',
  },
  {
    name: 'Jack',
    type: 'Earned Leave',
    date: '20 July 2023',
    reason: '23 July 2023',
    action: 'Pending',
  },
]);

const leaveTypes = [
  { id: 1, name: 'Annual Leave' },
  { id: 2, name: 'Sick Leave' },
  { id: 3, name: 'Maternity Leave' },
  { id: 4, name: 'Paternity Leave' },
  { id: 5, name: 'Unpaid Leave' },
];
const leaveDurations = [
  { id: 1, name: 'Half Day' },
  { id: 2, name: '30 Minutes' },
  { id: 3, name: '1 Hour' },
  { id: 4, name: '1 Hour 30 Minutes' },
  { id: 5, name: '2 Hours' },
  { id: 6, name: '2 Hours 30 Minutes' },
  { id: 7, name: '3 Hours' },
  { id: 8, name: '3 Hours 30 Minutes' },
];

const selectedPotion = ref('potions1');
const checkedDuration = ref(false);

const memberList = ref([
  { id: 1, name: 'WIN LAE LAE KHAING' },
  { id: 2, name: 'KHIN SHIN SIN MAY' },
  { id: 23, name: '休暇登録休暇登録休暇登録' },
]);

const selectedMemberId = ref(null);
const isChecked = ref(true);

const selectedMember = computed(() =>
  memberList.value.find((item) => item.id === selectedMemberId.value)
);
const selectName = computed(() =>
  selectedMember.value ? selectedMember.value.name : ''
);
const permanent_date = ref([]);

const submittedData = ref([]);

// const memberList = computed(() => {
//   const isJapanese = locale.value === 'ja';
//   return (
//     memberStore.getMembers?.map((member) => ({
//       id: member.id,
//       name: isJapanese ? member.jp_name : member.eng_name,
//     })) || []
//   );
// });

function onCheckboxChange(value) {
  if (!value) {
    selectedMemberId.value = null;
    isChecked.value = true;
  }
}
</script>
<style>
.custom-checkbox .v-label {
  font-size: 0.7rem; /* Label font size */
  font-weight: 900;
  color: rgb(var(--v-theme-primary)); /* Label color */
}
.v-data-table .v-btn {
  margin-left: 4px;
}

.custom-checkbox .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}
.custom-switch-label .v-label {
  font-size: 13px;
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}
</style>
