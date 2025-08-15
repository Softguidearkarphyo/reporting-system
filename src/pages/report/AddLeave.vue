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
    <v-col cols="12" md="5">
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
              <template v-if="multipleLeave">
                <Field name="start_date">
                  <BaseMultDate
                    v-model="formData.start_date"
                    :label="t('creatLeave.form.leave_date')"
                    class="mx-auto"
                    prependIcon="tabler:IconCalendarPin"
                    :width="'300px'"
                    :multiple="true"
                  ></BaseMultDate>
                </Field>
              </template>
              <template v-else>
                <Field name="leave_date" v-slot="{ errorMessage }">
                  <BaseDatePicker
                    v-model="formData.leave_date"
                    :label="t('creatLeave.form.leave_date')"
                    class="mx-auto"
                    prependIcon="tabler:IconCalendarPin"
                    :width="'300px'"
                    :error-messages="errorMessage"
                  ></BaseDatePicker>
                </Field>
              </template>
            </v-col>
            <v-col cols="12" md="6">
              <template v-if="multipleLeave">
                <Field name="duration">
                  <BaseTextField
                    v-model="durationCount"
                    :label="t('creatLeave.form.duration')"
                    class="mx-auto"
                    item-title="name"
                    prependIcon="tabler:IconClockQuestion"
                    :width="'300px'"
                    readonly
                  />
                </Field>
              </template>
              <template v-else>
                <Field name="duration">
                  <BaseSelect
                    v-model="formData.duration"
                    :label="t('creatLeave.form.duration')"
                    class="mx-auto"
                    :items="durationHour"
                    item-value="id"
                    item-title="name"
                    prependIcon="tabler:IconClockQuestion"
                    :width="'300px'"
                  />
                </Field>
              </template>
            </v-col>
          </v-row>
          <v-row dense v-if="selectedPotion === 'potions1'">
            <v-col cols="12" md="6">
              <Field name="reason">
                <BaseTextField
                  v-model="formData.reason"
                  :label="t('creatLeave.form.reason')"
                  class="mx-auto"
                  type="text"
                  variant="plain"
                  prependIcon="tabler:IconHelpCircle"
                  :width="'300px'"
                ></BaseTextField>
              </Field>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-start">
              <v-switch
                v-model="multipleLeave"
                class="custom-switch-label"
                :label="t('creatLeave.form.multiple_leave')"
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
                  :width="'300px'"
                ></BaseDatePicker
              ></Field>
            </v-col>
            <v-col cols="12" md="6">
              <BaseButton
                type="button"
                @click="calculateLeaves"
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
                    :width="'300px'"
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
                    :items="durationHour"
                    item-title="name"
                    prependIcon="tabler:IconAlarm"
                    :error-messages="errorMessage"
                    :width="'300px'"
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
                {{ t('common.submit') }}
              </BaseButton>
              <BaseButton
                v-if="selectedPotion === 'potions3'"
                type="button"
                @click="submitOt"
                style="width: 200px"
              >
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </Form>
      </ParentCard>
    </v-col>

    <v-col cols="12" md="7">
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
          <template #[`item.leave_type`]="{ item }">
            <span
              v-if="item.leave_type === 1"
              class="status d-inline-flex justify-center align-center"
            >
              paid
            </span>
            <span
              v-else
              class="status1 d-inline-flex justify-center align-center"
            >
              unpaid
            </span>
          </template>
          <template #[`item.duration`]="{ item }">
            <span v-if="item.duration == 1"> Full day </span>
            <span v-else-if="item.duration == 2"> Half day </span>
            <span v-else-if="item.duration == 3"> 3 Hrs : 30 Min </span>
            <span v-else-if="item.duration == 4"> 3 Hrs </span>
            <span v-else-if="item.duration == 5"> 2 Hrs : 30 Min </span>
            <span v-else-if="item.duration == 6"> 2 Hrs </span>
            <span v-else-if="item.duration == 7"> 1 Hrs : 30 Min </span>
            <span v-else-if="item.duration == 8"> 1 Hrs </span>
            <span v-else-if="item.duration == 9"> 30 Min </span>
          </template>
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
import { durationHour } from '@/utils/date.js';

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
  start_date: [],
  duration: '',
  reason: '',
  ot_date: null,
  ot_time: null,
  offDays: 0,
  firstHalfLeave: 0,
  secondHalfLeave: 0,
});

// Data
const checkID = ref([]);
const leaveRequests = ref([]);
const leaveRecords = ref([]);
const overtimes = ref([]);

// Computed
const LeaveFormSchema = computed(() => leaveSchema(t, checkID.value));

const durationCount = computed(() => formData.value.start_date.length);

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
      key: 'offDays',
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

const memberList = computed(() => {
  const isJapanese = locale.value === 'ja';
  return (
    memberStore.getMembers
      ?.map((member) => ({
        id: member.id,
        name: isJapanese ? member.jp_name : member.eng_name,
        sort_key: member.sort_key,
      }))
      ?.sort((a, b) => {
        if (!a.sort_key) return 1;
        if (!b.sort_key) return -1;
        return a.sort_key - b.sort_key;
      }) || []
  );
});

// Method
function onCheckboxChange(value) {
  if (!value) {
    selectedMemberId.value = null;
    isChecked.value = true;
  }
}

// Data Fetch
const fetchData = async () => {
  try {
    await memberStore.fetchMember();
    await leaveStore.fetchLeave();
    const tmpLeave = (leaveStore.getLeaves ?? []).map((leave) => ({
      eng_name: leave.eng_name,
      ...leave,
    }));

    await leaveRecordStore.fetchLeaveRecord();
    const tmpLeaveRecord = leaveRecordStore.getLeaveRecord?.map((record) => ({
      permanent_date: record.permanent_date,
      eng_name: record.eng_name,
      offDays: record.total_leaves,
    }));

    await overTimeStore.fetchOverTime();
    const tmpOverTime = overTimeStore.getOverTime?.map((ot) => ({
      eng_name: ot.eng_name,
      ot_date: ot.ot_date,
      ot_time: ot.ot_time,
    }));

    overtimes.value = tmpOverTime || [];
    leaveRecords.value = tmpLeaveRecord || [];
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

// Submit Process
async function submitLeave() {
  try {
    if (selectedMemberId.value) {
      const payload = {
        staff_id: selectedMemberId.value,
        reason: formData.value.reason,
      };

      if (multipleLeave.value) {
        payload.start_date = formData.value.start_date;
        payload.duration = 'Full Day';
      } else {
        payload.leave_date = formData.value.leave_date;
        payload.duration = formData.value.duration;
      }
      await leaveStore.createLeave(payload);
      fetchData();
      formData.value.leave_date = '';
      formData.value.duration = '';
      formData.value.start_date = '';
      formData.value.reason = '';
    }
  } catch (error) {
    console.error('Error creating leave:', error);
  }
}

const calculateLeaves = async () => {
  try {
    if (selectedMemberId.value) {
      const payload = {
        staff_id: selectedMemberId.value,
        permanent_date: formData.value.permanent_date,
      };
      await leaveRecordStore.createLeaveRecord(payload);
      fetchData();
    }
  } catch (error) {
    console.error('Error creating leave Record:', error);
  }
};

const submitOt = async () => {
  try {
    const payload = {
      staff_id: selectedMemberId.value,
      ot_date: formData.value.ot_date,
      ot_time: formData.value.ot_time,
    };
    await overTimeStore.createOverTime(payload);
    fetchData();
    formData.value.ot_date = '';
    formData.value.ot_time = '';
  } catch (error) {
    console.error('Error creating Over Time:', error);
  }
};

onMounted(async () => {
  await fetchData();
});
</script>
<style>
.custom-checkbox .v-label {
  font-size: 0.7rem !important;
  font-weight: 900 !important;
  color: rgb(var(--v-theme-primary)) !important;
}
.v-data-table .v-btn {
  margin-left: 4px !important;
}

.custom-checkbox .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}
.custom-switch-label .v-label {
  font-size: 13px !important;
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600 !important;
}
.v-switch {
  transform: scale(0.8);
  transform-origin: left center;
  margin-left: 7px;
  text-transform: uppercase;
}
.status {
  background-color: rgba(var(--v-theme-complete), 0.2);
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 800;
  color: rgba(var(--v-theme-complete));
}
.status1 {
  background-color: rgba(var(--v-theme-error), 0.2);
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 800;
  color: rgba(var(--v-theme-error));
}
</style>
