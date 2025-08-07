<template>
  <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>
  <ParentCard height="115px">
    <v-row class="align-center" dense>
      <v-col cols="12" md="12">
        <div class="d-flex flex-wrap align-center justify-space-around">
          <BaseSelect
            v-if="!selectedMember"
            v-model="selectedMemberId"
            :label="t('creatLeave.options.employee')"
            :items="memberList"
            item-value="id"
            item-title="name"
            prependIcon="tabler:IconUserCog"
            :width="'250px'"
            @change="selectMember"
          />
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
            v-if="showNewEmployee"
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
        <Form
          ref="formRef"
          :validation-schema="LeaveFormSchema"
          @submit="submitLeave"
        >
          <v-row v-if="selectedPotion === 'potions1'" dense>
            <v-col cols="12" md="6">
              <Field name="leave_type">
                <BaseSelect
                  v-model="formData.leave_type"
                  :label="t('creatLeave.form.leave_type')"
                  class="mx-auto"
                  :items="leaveTypes"
                  item-title="name"
                  prependIcon="tabler:IconSpeakerphone"
                  :width="'400px'"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="6">
              <template v-if="multipleLeave">
                <Field name="start_date">
                  <BaseDatePicker
                    v-model="formData.start_date"
                    :label="t('creatLeave.form.start_date')"
                    class="mx-auto"
                    prependIcon="tabler:IconCalendarPin"
                    :width="'400px'"
                  ></BaseDatePicker>
                </Field>
              </template>
              <template v-else>
                <Field name="leave_date" v-slot="{ errorMessage }">
                  <BaseDatePicker
                    v-model="formData.leave_date"
                    :label="t('creatLeave.form.leave_date')"
                    class="mx-auto"
                    prependIcon="tabler:IconCalendarPin"
                    :width="'400px'"
                    :error-messages="errorMessage"
                  ></BaseDatePicker>
                </Field>
              </template>
            </v-col>
          </v-row>
          <v-row dense v-if="selectedPotion === 'potions1'">
            <v-col cols="12" md="6">
              <template v-if="multipleLeave">
                <Field name="end_date">
                  <BaseDatePicker
                    v-model="formData.end_date"
                    :label="t('creatLeave.form.end_date')"
                    class="mx-auto"
                    prependIcon="tabler:IconCalendarPin"
                    :width="'400px'"
                  ></BaseDatePicker>
                </Field>
              </template>
              <template v-else>
                <Field name="duration">
                  <BaseSelect
                    v-model="formData.duration"
                    :label="t('creatLeave.form.duration')"
                    class="mx-auto"
                    :items="leaveDurations"
                    item-title="name"
                    prependIcon="tabler:IconClockQuestion"
                    :width="'400px'"
                  />
                </Field>
              </template>
            </v-col>
            <v-col cols="12" md="6">
              <Field name="reason">
                <BaseTextField
                  v-model="formData.reason"
                  :label="t('creatLeave.form.reason')"
                  class="mx-auto"
                  type="text"
                  variant="plain"
                  prependIcon="tabler:IconHelpCircle"
                  :width="'400px'"
                ></BaseTextField>
              </Field>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-start ml-5">
              <v-switch
                v-model="multipleLeave"
                class="custom-switch-label"
                label="MULTIPLE LEAVE"
                color="primary"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row dense v-if="selectedPotion === 'potions2'">
            <v-col cols="12" md="6">
              <Field name="permanent_date" v-slot="{ errorMessage }">
                <BaseDatePicker
                  v-model="formData.permanent_date"
                  :label="t('creatLeave.form.permanent_date')"
                  class="mx-auto"
                  prependIcon="tabler:IconCalendarPin"
                  :error-messages="errorMessage"
                  :width="'400px'"
                ></BaseDatePicker
              ></Field>
            </v-col>
            <v-col cols="12" md="6">
              <BaseButton
                type="button"
                @click="calculateOffDay"
                style="width: 200px"
                v-if="selectedPotion === 'potions2'"
              >
                {{ t('creatLeave.form.calculate') }}
              </BaseButton>
            </v-col>
          </v-row>
          <Form
            :validation-schema="LeaveFormSchema"
            ref="otFormRef"
            @submit="submitOt"
          >
            <v-row v-if="selectedPotion === 'potions3'" dense>
              <v-col cols="12" md="6">
                <Field name="ot_date" v-slot="{ errorMessage }">
                  <BaseDatePicker
                    v-model="formData.ot_date"
                    :label="t('creatLeave.form.ot_date')"
                    class="mx-auto"
                    prependIcon="tabler:IconCalendarPin"
                    :width="'400px'"
                    :error-messages="errorMessage"
                  ></BaseDatePicker>
                </Field>
              </v-col>
              <v-col cols="12" md="6">
                <Field name="ot_time" v-slot="{ errorMessage }">
                  <BaseSelect
                    v-model="formData.ot_time"
                    :label="t('creatLeave.form.ot_time')"
                    class="mx-auto"
                    :items="otList"
                    item-title="name"
                    prependIcon="tabler:IconAlarm"
                    :error-messages="errorMessage"
                    :width="'400px'"
                  />
                </Field>
              </v-col>
            </v-row>
          </Form>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <BaseButton
                v-if="selectedPotion === 'potions1'"
                type="submit"
                @click="submitLeave"
                style="width: 200px"
              >
                {{ t('common.submit') }} leave
              </BaseButton>
              <BaseButton
                v-if="selectedPotion === 'potions3'"
                type="button"
                @click="submitOt"
                style="width: 200px"
              >
                {{ t('common.submit') }} ot
              </BaseButton>
            </v-col>
          </v-row>
        </Form>
      </ParentCard>
    </v-col>

    <v-col cols="12" md="5">
      <ParentCard>
        <BaseTitle v-if="selectedPotion === 'potions1'">{{
          t('creatLeave.title')
        }}</BaseTitle>
        <BaseTitle v-if="selectedPotion === 'potions2'">{{
          t('creatLeave.title4')
        }}</BaseTitle>
        <BaseTitle v-if="selectedPotion === 'potions3'">{{
          t('creatLeave.title3')
        }}</BaseTitle>
        <BaseTable
          v-if="selectedPotion === 'potions1'"
          :headers="multiHeaders1"
          :items="leaveRequests"
          items-per-page="10"
          class="elevation-1"
        >
        </BaseTable>
        <BaseTable
          v-if="selectedPotion === 'potions2'"
          :headers="multiHeaders2"
          :items="leaveRecords"
          items-per-page="10"
          class="elevation-1"
        >
        </BaseTable>
        <BaseTable
          v-if="selectedPotion === 'potions3'"
          :headers="multiHeaders3"
          :items="overtimes"
          items-per-page="10"
          class="elevation-1"
        >
        </BaseTable>
      </ParentCard>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMemberStore } from '@/stores/member/member.js';
import { useLeaveStore } from '@/stores/leave/leave.js';
import { useLeaveRecordStore } from '@/stores/leaveRecord/leaveRecord.js';
import { useOverTimeStore } from '@/stores/overtime/overtime.js';
import { leaveSchema } from '@/plugins/validations/leave.js';
import { Form, Field } from 'vee-validate';

const { t, locale } = useI18n();

// Store
const memberStore = useMemberStore();
const leaveStore = useLeaveStore();
const leaveRecordStore = useLeaveRecordStore();
const overTimeStore = useOverTimeStore();

// Ref
const selectedPotion = ref('potions1');
const selectedMemberId = ref(null);
const isChecked = ref(true);
const multipleLeave = ref(false);
const showNewEmployee = ref(false);
const formRef = ref(null);
const formData = ref({
  staff_id: '',
  permanent_date: null,
  leave_date: null,
  start_date: null,
  end_date: null,
  duration: '',
  reason: '',
  ot_date: null,
  ot_time: null,
  offDays: 0,
});

// Data
const memberList = ref([]);
const checkID = ref([]);
const leaveRequests = ref([]);
const leaveRecords = ref([]);
const overtimes = ref([]);

// Computed
const LeaveFormSchema = computed(() => leaveSchema(t, checkID.value));

const selectedMember = computed(() => {
  if (!memberList.value || !selectedMemberId.value) return null;
  return memberList.value.find((item) => item.id === selectedMemberId.value);
});

const selectName = computed(() =>
  selectedMember.value ? selectedMember.value.name : ''
);

const multiHeaders1 = computed(() => {
  const tmpHeaders = [
    {
      title: t('creatLeave.form.name'),
      key: 'eng_name',
    },
    {
      title: t('creatLeave.form.leave_type'),
      key: 'leave_type',
    },
    {
      title: t('creatLeave.form.leave_date'),
      key: 'leave_date',
    },
    {
      title: t('creatLeave.form.total_days'),
      key: 'day_count',
    },
    {
      title: t('creatLeave.form.duration'),
      key: 'duration',
    },
    {
      title: t('creatLeave.form.reason'),
      key: 'reason',
    },
  ];
  return tmpHeaders;
});

const multiHeaders2 = computed(() => {
  const tmpHeaders = [
    {
      title: t('creatLeave.form.name'),
      key: 'eng_name',
    },
    {
      title: t('creatLeave.form.permanent_date'),
      key: 'permanent_date',
    },
    {
      title: t('creatLeave.form.offdays'),
      key: 'total_leaves',
    },
  ];
  return tmpHeaders;
});

const multiHeaders3 = computed(() => {
  const tmpHeaders = [
    {
      title: t('creatLeave.form.name'),
      key: 'eng_name',
    },
    {
      title: t('creatLeave.form.ot_date'),
      key: 'ot_date',
    },
    {
      title: t('creatLeave.form.ot_time'),
      key: 'ot_time',
    },
  ];
  return tmpHeaders;
});

// Array Data
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

const otList = [
  { id: 1, name: 'Half Day' },
  { id: 2, name: '30 Minutes' },
  { id: 3, name: '1 Hour' },
  { id: 4, name: '1 Hour 30 Minutes' },
  { id: 5, name: '2 Hours' },
  { id: 6, name: '2 Hours 30 Minutes' },
  { id: 7, name: '3 Hours' },
  { id: 8, name: '3 Hours 30 Minutes' },
];

// Method
function onCheckboxChange(value) {
  if (!value) {
    selectedMemberId.value = null;
    isChecked.value = true;
  }
}

// const setSubmitType = (type) => {
//   console.log('Setting submit type to:', type);
//   submitType.value = type;
// };

// const formSubmit = async (values) => {
//   console.log('test');

//   if (submitType.value === 'ot') {
//     await submitOt(values);
//   }
// };

const fetchData = async () => {
  try {
    await memberStore.fetchMember();
    const tmpMembers = memberStore.getMembers?.map((member) => ({
      id: member.id,
      name: member.eng_name,
    }));
    tmpMembers?.sort((a, b) => {
      if (!a.sort_key) return 1;
      if (!b.sort_key) return -1;
      return a.sort_key - b.sort_key;
    });

    await leaveStore.fetchLeave();
    const tmpLeave = (leaveStore.getLeaves ?? []).map((leave) => ({
      eng_name: leave.eng_name,
      ...leave,
    }));

    await leaveRecordStore.fetchLeaveRecord();
    const tmpLeaveRecord = leaveRecordStore.getLeaveRecord?.map((record) => ({
      permanent_date: record.permanent_date,
      eng_name: record.eng_name,
      total_leaves: record.total_leaves,
    }));

    await overTimeStore.fetchOverTime();
    const tmpOverTime = overTimeStore.getOverTime?.map((ot) => ({
      eng_name: ot.eng_name,
      ot_date: ot.ot_date,
      ot_time: ot.ot_time,
    }));

    overtimes.value = tmpOverTime || [];
    leaveRecords.value = tmpLeaveRecord || [];
    memberList.value = tmpMembers || [];
    leaveRequests.value = tmpLeave || [];
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

const selectMember = async (id) => {
  try {
    const fetchedMembers = memberStore.getMembers || [];
    if (!fetchedMembers.length) {
      await fetchData();
    }
    const selectedMember = fetchedMembers.find((member) => member.id === id);
    const current = new Date();
    const currentYear = new Date(current.getFullYear(), 0, 1);
    if (selectedMember) {
      formData.value.permanent_date = selectedMember.permanent_date;
      const isInitial = new Date(selectedMember.permanent_date) >= currentYear;
      showNewEmployee.value = isInitial;
      if (!isInitial) {
        selectedPotion.value = null;
      }
    } else {
      showNewEmployee.value = false;
      selectedPotion.value = null;
    }
  } catch (error) {
    console.error('Error selecting members:', error);
  }
};

async function submitLeave() {
  try {
    if (selectedMemberId.value) {
      const payload = {
        staff_id: selectedMemberId.value,
        leave_type: formData.value.leave_type,
        reason: formData.value.reason,
      };

      if (multipleLeave.value) {
        payload.start_date = formData.value.start_date;
        payload.end_date = formData.value.end_date;
        payload.duration = 'full';
      } else {
        payload.leave_date = formData.value.leave_date;
        payload.duration = formData.value.duration;
      }
      await leaveStore.createLeave(payload);
      fetchData();
    }
  } catch (error) {
    console.error('Error creating leave:', error);
  }
}

const submitOt = async () => {
  try {
    const payload = {
      staff_id: selectedMemberId.value,
      ot_date: formData.value.ot_date,
      ot_time: formData.value.ot_time,
    };
    await overTimeStore.createOverTime(payload);
    fetchData();
  } catch (error) {
    console.error('Error creating Over Time:', error);
  }
};

function calculateOffDay() {
  calculateLeaves(formData.value.permanent_date);
}

const calculateLeaves = async (dateStr) => {
  const date = new Date(dateStr);
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const yearEnd = new Date(date.getFullYear(), 11, 31);
  const totalDays = (yearEnd - yearStart) / (1000 * 60 * 60 * 24) + 1;
  const remainingDays = (yearEnd - date) / (1000 * 60 * 60 * 24) + 1;
  const leave = Math.round((remainingDays / totalDays) * 10 * 2) / 2;
  formData.value.offDays = leave;
  const permanent_date = formData.value.permanent_date;

  try {
    if (selectedMemberId.value) {
      const payload = {
        staff_id: selectedMemberId.value,
        permanent_date: permanent_date,
        remain_leaves: leave,
        total_leaves: leave,
      };
      await leaveRecordStore.createLeaveRecord(payload);
      fetchData();
    }
  } catch (error) {
    console.error('Error creating leave Record:', error);
  }
};

onMounted(async () => {
  await fetchData();
});

// function calculateOffDay() {
//   const permanent = new Date(formData.value.permanent_date);
//   const current = new Date();
//   const currentYear = current.getFullYear();
//   const joinedYear = permanent.getFullYear();

//   let offdays = 0;

//   if (joinedYear < currentYear) {
//     const monthDiff =
//       (current.getFullYear() - permanent.getFullYear()) * 12 +
//       (current.getMonth() - permanent.getMonth());

//     const fullYears = Math.floor(monthDiff / 12);
//     const remainingMonths = monthDiff % 12;

//     offdays = fullYears * 10 + Math.floor(remainingMonths / 6) * 5;
//   } else if (joinedYear === currentYear) {
//     const joinMonth = permanent.getMonth();
//     const joinDay = permanent.getDate();
//     let monthsWorked = 12 - joinMonth;

//     if (joinDay > 15) {
//       monthsWorked -= 0.5;
//     }
//     offdays = Math.floor((monthsWorked / 12) * 10 * 2) / 2;
//   } else {
//     offdays = 0;
//   }
//   formData.value.offdays = offdays;
// }
</script>
<style>
.custom-checkbox .v-label {
  font-size: 0.7rem;
  font-weight: 900;
  color: rgb(var(--v-theme-primary));
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
