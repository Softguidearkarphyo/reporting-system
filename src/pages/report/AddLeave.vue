<template>
  <v-container>
    <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>
    <ParentCard>
      <v-row class="align-center" dense>
        <v-col cols="12" md="2">
          <div class="d-flex justify-end font-weight-medium">
            {{ t('creatLeave.options.selection') }}
          </div>
        </v-col>
        <v-col cols="12" md="10">
          <div class="d-flex flex-wrap align-center justify-space-around">
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
    <v-row dense>
      <v-col cols="12" md="7">
        <ParentCard>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form1.name')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconUserCog"
                :width="'400px'"
              />
            </v-col>
            <v-col cols="12" md="6" v-if="selectedPotion === 'potions1'">
              <BaseSelect
                :label="t('creatLeave.form1.leave_type')"
                class="mx-auto"
                :items="leaveTypes"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconSpeakerphone"
                :width="'400px'"
              />
            </v-col>
            <v-col md="6" v-if="selectedPotion === 'potions2'">
              <BaseDatePicker
                v-model="form2.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form2.permanent_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
            <v-col md="6" v-if="selectedPotion === 'potions3'">
              <BaseSelect
                :label="t('creatLeave.form3.ot_time')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconAlarm"
                :width="'400px'"
              />
            </v-col>
          </v-row>
          <v-row dense v-if="selectedPotion === 'potions1'">
            <!-- Two horizontal input fields -->
            <v-col cols="12" md="6">
              <BaseDatePicker
                v-model="form2.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form1.start_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
            <v-col cols="12" md="6">
              <BaseTextField
                v-model="form1.reason"
                v-bind="field"
                :label="t('creatLeave.form1.reason')"
                class="mx-auto"
                type="text"
                variant="plain"
                prependIcon="tabler:IconHelpCircle"
                :width="'400px'"
              ></BaseTextField>
            </v-col>
          </v-row>
          <v-row dense v-if="selectedPotion === 'potions1'">
            <v-col cols="12" md="6">
              <div class="d-flex" style="margin-left: 15px">
                <v-checkbox
                  v-model="checkedDuration"
                  :label="t('creatLeave.options.existing')"
                  hide-details
                  class="custom-checkbox"
                  color="primary"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6" v-if="checkedDuration">
              <BaseSelect
                :label="t('creatLeave.form1.part_time')"
                class="mx-auto"
                :items="leaveDurations"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconClockQuestion"
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
            <template #item.status="{ item }">
              <v-chip color="orange lighten-4" text-color="orange" small>
                {{ item.status }}
              </v-chip>
            </template>

            <template #item.actions="{ item }">
              <v-btn icon color="success" @click="approveLeave(item)">
                <v-icon>mdi-check-circle</v-icon>
              </v-btn>
              <v-btn icon color="error" @click="rejectLeave(item)">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </ParentCard>

        <!-- <ParentCard>
          <v-row class="justify-center" dense>
            <v-col>
              <BaseSelect
                :label="t('creatLeave.form1.name')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconUserCog"
                :width="'400px'"
              />
            </v-col>
            <v-col>
              <BaseDatePicker
                v-model="form2.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form2.permanent_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
            <v-col>
              <BaseSelect
                :label="t('creatLeave.form3.ot_time')"
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
        </ParentCard> -->
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
  // { title: 'Name', key: 'name' },
  { title: 'Leave Type', key: 'type' },
  { title: 'Start Date', key: 'start' },
  { title: 'End Date', key: 'end' },
  { title: 'Status', key: 'status' },
  // { title: 'Action', key: 'actions', sortable: false },
];

const leaveRequests = ref([
  {
    name: 'Jessica',
    type: 'Sick Leave',
    start: 'First Half',
    end: 'First Half',
    status: 'Pending',
  },
  {
    name: 'Jenny',
    type: 'Sick Leave',
    start: '15 July 2023',
    end: '15 July 2023',
    status: 'Pending',
  },
  {
    name: 'John',
    type: 'Casual Leave',
    start: '15 July 2023',
    end: '18 July 2023',
    status: 'Pending',
  },
  {
    name: 'Jack',
    type: 'Earned Leave',
    start: '20 July 2023',
    end: '23 July 2023',
    status: 'Pending',
  },
]);

const potions = [
  { title: 'Potion 1', value: 'potions1' },
  { title: 'Potion 2', value: 'potions2' },
  { title: 'Potion 3', value: 'potions3' },
];
const leaveTypes = [
  { id: 1, name: 'Annual Leave' },
  { id: 2, name: 'Sick Leave' },
  { id: 3, name: 'Maternity Leave' },
  { id: 4, name: 'Paternity Leave' },
  { id: 5, name: 'Unpaid Leave' },
  // Add more leave types as needed
];
const leaveDurations = [
  { id: 1, name: 'Half Day' },
  { id: 2, name: '1 Day' },
  { id: 3, name: '2 Days' },
  { id: 4, name: '1 Week' },
  { id: 5, name: 'More than 1 Week' },
];

const dropdownItems = ['Option 1', 'Option 2', 'Option 3'];

const selectedPotion = ref('potions1');
const checkedDuration = ref(false);

// Potion 1 form state
const form1 = ref({ select: '', input: '' });

// Potion 2 form state with checkboxes pre-checked as false
const form2 = ref({
  select: '',
  input: '',
  optionA: false, // change to true here if you want it pre-checked
  optionB: false,
  aSelect: '',
  bInput1: '',
  bInput2: '',
});

// Potion 3 form state
const form3 = ref({ select: '', number: '', text: '' });

const submittedData = ref([]);

const headers = [
  { title: 'Potion Type', key: 'type' },
  { title: 'Details', key: 'data' },
];

const memberList = computed(() => {
  const isJapanese = locale.value === 'ja';
  return (
    memberStore.getMembers?.map((member) => ({
      id: member.id,
      name: isJapanese ? member.jp_name : member.eng_name,
    })) || []
  );
});

function approveLeave(item) {
  item.status = 'Approved';
}

function rejectLeave(item) {
  item.status = 'Rejected';
}
</script>
<style>
.custom-checkbox .v-label {
  font-size: 0.7rem; /* Label font size */
  /* font-weight: 600; */
}
.v-data-table .v-btn {
  margin-left: 4px;
}

.custom-checkbox .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
