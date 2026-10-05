<template>
  <BaseTitle class="mb-3">{{ t('creatLeave.title') }}</BaseTitle>

  <ParentCard>
    <v-row align="center" justify="start" class="py-1 ga-2 ga-md-4">
      <v-col cols="12" sm="6" md="4" lg="3">
        <BaseSelect
          v-if="!selectedMember"
          v-model="selectedMemberId"
          :label="t('creatLeave.options.employee')"
          :items="memberList"
          item-value="id"
          item-title="name"
          prependIcon="tabler:IconUserCog"
          class="w-100"
          @update:modelValue="selectMember"
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
      </v-col>

      <!-- Option Checkboxes -->
      <v-col cols="12" sm="auto" class="d-flex flex-wrap align-center ga-3">
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
      </v-col>
    </v-row>
  </ParentCard>

  <!-- Main Content Layout -->
  <v-row v-if="selectedMember && selectedPotion" class="mt-2">
    <!-- Form Side -->
    <v-col cols="12" lg="5">
      <ParentCard>
        <v-row dense>
          <v-col cols="12" class="text-center mb-2">
            <BaseTitle v-if="selectedPotion === 'potions1'" style="font-size: 15px">
              {{ t('creatLeave.title1') }}
            </BaseTitle>

            <BaseTitle v-else-if="selectedPotion === 'potions2'" style="font-size: 15px">
              {{ t('creatLeave.title2') }}
            </BaseTitle>

            <BaseTitle v-else style="font-size: 15px">
              {{ t('creatLeave.title3') }}
            </BaseTitle>
          </v-col>
        </v-row>

        <!-- Form 1: Leave Creation -->
        <Form
          v-if="selectedPotion === 'potions1'"
          ref="LeaveFormRef"
          :key="`leave-form-${multipleLeave}`"
          :validation-schema="LeaveFormSchema"
          :initial-values="leaveInitialValues"
          @submit="submitLeave"
        >
          <v-row dense>
            <v-col cols="12" sm="6">
              <Field
                v-if="!multipleLeave"
                name="leave_date"
                v-slot="{ value, handleChange, errorMessage }"
              >
                <BaseDatePicker
                  :model-value="value"
                  :label="t('creatLeave.form.leave_date')"
                  prependIcon="tabler:IconCalendarPin"
                  class="w-100"
                  :error-messages="errorMessage"
                  clearable
                  @update:modelValue="
                    (date) => {
                      handleChange(date);
                      formData.leave_date = date;
                    }
                  "
                />
              </Field>

              <Field
                v-else
                name="multi_date"
                v-slot="{ value, handleChange, errorMessage }"
              >
                <BaseMultDate
                  :model-value="value || []"
                  :label="t('creatLeave.form.leave_date')"
                  prependIcon="tabler:IconCalendarPin"
                  class="w-100"
                  :multiple="true"
                  :error-messages="errorMessage"
                  @update:modelValue="
                    (dates) => {
                      const selectedDates = Array.isArray(dates) ? dates : [];
                      handleChange(selectedDates);
                      formData.multi_date = selectedDates;
                      updateMultipleDuration(selectedDates);
                    }
                  "
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field v-if="multipleLeave" name="duration" v-slot="{ errorMessage }">
                <BaseTextField
                  :model-value="durationCount"
                  :label="t('creatLeave.form.duration')"
                  prependIcon="tabler:IconClockQuestion"
                  class="w-100"
                  :error-messages="errorMessage"
                  readonly
                />
              </Field>

              <Field
                v-else
                name="duration"
                v-slot="{ value, handleChange, errorMessage }"
              >
                <BaseSelect
                  :model-value="value"
                  :label="t('creatLeave.form.duration')"
                  class="w-100"
                  :items="durationHour"
                  item-value="id"
                  item-title="name"
                  prependIcon="tabler:IconClockQuestion"
                  :error-messages="errorMessage"
                  @update:modelValue="
                    (duration) => {
                      handleChange(duration);
                      formData.duration = duration;
                      if ([3, 4, 5, 6, 7, 8, 9].includes(Number(duration))) {
                        multipleLeave = false;
                      }
                    }
                  "
                />
              </Field>
            </v-col>
          </v-row>

          <v-row dense align="center">
            <v-col cols="12" sm="6">
              <Field
                name="reason"
                v-slot="{ value, handleChange, errorMessage }"
              >
                <BaseTextField
                  :model-value="value"
                  :label="t('creatLeave.form.reason')"
                  class="w-100"
                  type="text"
                  variant="plain"
                  prependIcon="tabler:IconHelpCircle"
                  :error-messages="errorMessage"
                  @update:modelValue="
                    (reason) => {
                      handleChange(reason);
                      formData.reason = reason;
                    }
                  "
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6" class="d-flex justify-start align-center my-2 my-sm-0">
              <v-switch
                v-model="multipleLeave"
                class="custom-switch-label"
                :label="t('creatLeave.form.multiple_leave')"
                color="primary"
                hide-details
                :disabled="isShortLeaveSelected"
                @update:modelValue="changeMultipleLeave"
              />
            </v-col>

            <v-col cols="12" class="d-flex justify-center mt-3">
              <BaseButton type="submit" class="w-100" style="max-width: 200px">
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </Form>

        <!-- Form 2: Permanent Leave Calculation -->
        <Form
          v-if="selectedPotion === 'potions2'"
          ref="LeaveRecordFormRef"
          :validation-schema="LeaveRecordFormSchema"
          :initial-values="leaveRecordInitialValues"
          @submit="submitLeaveRecord"
        >
          <v-row dense align="center">
            <v-col cols="12" sm="6">
              <Field name="permanent_date" v-slot="{ value, errorMessage }">
                <BaseDatePicker
                  :model-value="value"
                  :label="t('creatLeave.form.permanent_date')"
                  class="w-100"
                  prependIcon="tabler:IconCalendarPin"
                  :error-messages="errorMessage"
                  readonly
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6" class="d-flex align-center justify-center mt-2 mt-sm-0">
              <BaseButton type="submit" class="w-100" style="max-width: 200px">
                {{ t('creatLeave.form.calculate') }}
              </BaseButton>
            </v-col>
          </v-row>
        </Form>

        <!-- Form 3: Overtime Creation -->
        <Form
          v-if="selectedPotion === 'potions3'"
          ref="OtFormRef"
          :validation-schema="OtFormSchema"
          :initial-values="otInitialValues"
          @submit="submitOt"
        >
          <v-row dense>
            <v-col cols="12" sm="6">
              <Field
                name="ot_date"
                v-slot="{ value, handleChange, errorMessage }"
              >
                <BaseDatePicker
                  :model-value="value"
                  :label="t('creatLeave.form.ot_date')"
                  class="w-100"
                  prependIcon="tabler:IconCalendarPin"
                  :error-messages="errorMessage"
                  clearable
                  @update:modelValue="
                    (date) => {
                      handleChange(date);
                      formData.ot_date = date;
                    }
                  "
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field
                name="ot_time"
                v-slot="{ value, handleChange, errorMessage }"
              >
                <BaseSelect
                  :model-value="value"
                  :label="t('creatLeave.form.ot_time')"
                  class="w-100"
                  :items="durationHour"
                  item-value="id"
                  item-title="name"
                  prependIcon="tabler:IconAlarm"
                  :error-messages="errorMessage"
                  @update:modelValue="
                    (time) => {
                      handleChange(time);
                      formData.ot_time = time;
                    }
                  "
                />
              </Field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" class="d-flex justify-center mt-3">
              <BaseButton type="submit" class="w-100" style="max-width: 200px">
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </Form>
      </ParentCard>
    </v-col>

    <!-- Table Side -->
    <v-col cols="12" lg="7">
      <ParentCard>
        <BaseTitle v-if="selectedPotion === 'potions1'" class="mb-3">
          {{ t('creatLeave.title') }}
        </BaseTitle>

        <BaseTitle v-if="selectedPotion === 'potions2'" class="mb-3">
          {{ t('creatLeave.title4') }}
        </BaseTitle>

        <BaseTitle v-if="selectedPotion === 'potions3'" class="mb-3">
          {{ t('creatLeave.title3') }}
        </BaseTitle>

        <!-- Leave Requests Table -->
        <BaseTable
          v-if="selectedPotion === 'potions1'"
          :headers="multiHeaders1"
          :items="leaveRequests"
          items-per-page="10"
          class="elevation-1"
        >
          <!-- Leave Type (Paid / Unpaid / Short Leave) -->
          <template #[`item.leave_type`]="{ item }">
            <span
              v-if="item.leave_type === 1"
              class="status d-inline-flex justify-center align-center"
            >
              paid
            </span>
            <span
              v-else-if="item.leave_type === 3"
              class="status-short d-inline-flex justify-center align-center"
            >
              short 
            </span>
            <span
              v-else
              class="status1 d-inline-flex justify-center align-center"
            >
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
        </BaseTable>

        <!-- Leave Records Table -->
        <BaseTable
          v-if="selectedPotion === 'potions2'"
          :headers="multiHeaders2"
          :items="leaveRecords"
          items-per-page="10"
          class="elevation-1"
        />

        <!-- Overtime Table -->
        <BaseTable
          v-if="selectedPotion === 'potions3'"
          :headers="multiHeaders3"
          :items="overtimes"
          items-per-page="10"
          class="elevation-1"
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
            <span class="d-inline-flex align-center flex-wrap ga-2 py-1">
              <span
                class="status-label d-inline-flex align-center px-3 py-1 rounded-pill text-caption font-weight-medium"
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

              <span v-if="item.status === 2 || item.status === 3" class="d-inline-flex align-center">
                <v-switch
                  color="primary"
                  density="compact"
                  :hide-details="true"
                  :model-value="item.isComplete"
                  @update:model-value="onSwitchChange(item)"
                  style="transform: scale(0.75);"
                />
              </span>
            </span>
          </template>

          <!-- Action Column Slot -->
          <template #[`item.action`]="{ item }">
            <span class="d-flex justify-start align-center p-0">
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
      </ParentCard>
    </v-col>
  </v-row>

  <!-- Confirmation Dialogs -->
  <BaseConfirmDelete
    v-model="confirmDelete"
    :text="t('memberFine.deleteConfirmText')"
    :class="{ 'd-none': !confirmDelete }"
    @yes="
      confirmDelete = false;
      deleteOvertime();
    "
    @no="
      confirmDelete = false;
      deleteTarget = undefined;
    "
  />

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
import {
  ref,
  computed,
  onMounted,
} from 'vue';

import {
  Form,
  Field,
} from 'vee-validate';

import { useI18n } from 'vue-i18n';

import { useMemberStore } from '@/stores/member/member.js';
import { useLeaveStore } from '@/stores/leave/leave.js';
import { useLeaveRecordStore } from '@/stores/leaveRecord/leaveRecord.js';
import { useOverTimeStore } from '@/stores/overtime/overtime.js';

import {
  leaveSchema,
  leaveRecordSchema,
  otSchema,
} from '@/plugins/validations/leave.js';

import { durationHour } from '@/utils/date.js';

const { t, locale } = useI18n();

const memberStore = useMemberStore();
const leaveStore = useLeaveStore();
const leaveRecordStore = useLeaveRecordStore();
const overTimeStore = useOverTimeStore();

const LeaveFormRef = ref(null);
const LeaveRecordFormRef = ref(null);
const OtFormRef = ref(null);

const selectedPotion = ref('potions1');
const selectedMemberId = ref(null);
const isChecked = ref(true);
const multipleLeave = ref(false);
const showNewEmployee = ref(false);
const switchTarget = ref(null);
const deleteTarget = ref(undefined);
const confirmDelete = ref(undefined);
const confirmChange = ref(undefined);

const formData = ref({
  staff_id: '',
  permanent_date: null,
  leave_date: null,
  multi_date: [],
  duration: '',
  reason: '',
  ot_date: null,
  ot_time: null,
  offDays: 0,
  firstHalfLeave: 0,
  secondHalfLeave: 0,
});

const isShortLeaveSelected = computed(() => {
  return [3, 4, 5, 6, 7, 8, 9].includes(Number(formData.value.duration));
});

const leaveInitialValues = computed(() => ({
  leave_date: formData.value.leave_date,
  multi_date: formData.value.multi_date,
  duration: formData.value.duration,
  reason: formData.value.reason,
}));

const leaveRecordInitialValues = computed(() => ({
  permanent_date: formData.value.permanent_date,
}));

const otInitialValues = computed(() => ({
  ot_date: formData.value.ot_date,
  ot_time: formData.value.ot_time,
}));

const LeaveFormSchema = computed(() =>
  leaveSchema(t, multipleLeave.value)
);

const LeaveRecordFormSchema = computed(() =>
  leaveRecordSchema(t)
);

const OtFormSchema = computed(() =>
  otSchema(t)
);

const durationCount = computed(() => {
  if (!Array.isArray(formData.value.multi_date)) {
    return 0;
  }
  return formData.value.multi_date.length;
});

const selectedMember = computed(() => {
  if (!memberList.value || !selectedMemberId.value) {
    return null;
  }
  return memberList.value.find((member) => member.id === selectedMemberId.value);
});

const selectName = computed(() => {
  return selectedMember.value ? selectedMember.value.name : '';
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

const leaveRequests = computed(() => {
  const isJapanese = locale.value === 'ja';

  return (leaveStore.getLeaves ?? []).map((leave) => ({
    ...leave,
    name: isJapanese ? leave.jp_name : leave.eng_name,
  }));
});

const leaveRecords = computed(() => {
  const isJapanese = locale.value === 'ja';

  return (leaveRecordStore.getLeaveRecord ?? []).map((record) => ({
    permanent_date: record.permanent_date,
    name: isJapanese ? record.jp_name : record.eng_name,
    offDays: record.total_leaves,
  }));
});

const overtimes = computed(() => {
  const isJapanese = locale.value === 'ja';

  const statusMap = {
    0: { text: 'Pending', icon: 'mdi-timer-sand', color: '#ff9800', bg: 'rgba(var(--v-theme-pending), 0.2)' },
    1: { text: 'Reject', icon: 'mdi-close-circle-outline', color: '#d00000', bg: 'rgba(208, 0, 0, 0.2)' },
    2: { text: 'Accept', icon: 'mdi-checkbox-marked-circle-outline', color: '#1e88e5', bg: 'rgba(30, 136, 229, 0.2)' },
    3: { text: 'Complete', icon: 'mdi-check-circle-outline', color: '#789f00ff', bg: 'rgba(var(--v-theme-complete), 0.2)' }
  };

  return (overTimeStore.getOverTime ?? []).map((ot) => {
    const rawStatus = Number(ot.status ?? 0);
    const meta = statusMap[rawStatus] || statusMap[0];

    return {
      id: ot.id,
      name: isJapanese ? ot.jp_name : ot.eng_name,
      ot_date: ot.ot_date,
      ot_time: ot.ot_time,
      status: rawStatus,
      statusLabel: meta.text,
      statusIcon: meta.icon,
      statusColor: meta.color,
      statusBg: meta.bg,
      isComplete: rawStatus === 3
    };
  });
});

const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};

const deleteOvertime = async () => {
  try {
    await overTimeStore.deleteOvertime({ id: deleteTarget.value });
    deleteTarget.value = undefined;
    await overTimeStore.fetchOverTime();
  } catch (error) {
    console.error('Error deleting member overtime:', error);
  }
};

const onSwitchChange = (item) => {
  switchTarget.value = item;
  confirmChange.value = true;
};

const onStatusSwitchChange = async (item, newValue) => {
  if (!item || !item.id) return;
  const updatedStatus = newValue ? 3 : 2;

  try {
    await overTimeStore.updateOverTimeStatus({
      id: item.id,
      status: updatedStatus
    });
    await overTimeStore.fetchOverTime();
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

const multiHeaders1 = computed(() => [
  { title: t('creatLeave.form.name'), key: 'name' },
  { title: t('creatLeave.form.leave_type'), key: 'leave_type' },
  { title: t('creatLeave.form.leave_date'), key: 'leave_date' },
  { title: t('creatLeave.form.total_days'), key: 'day_count' },
  { title: t('creatLeave.form.duration'), key: 'duration' },
  { title: t('creatLeave.form.reason'), key: 'reason' },
]);

const multiHeaders2 = computed(() => [
  { title: t('creatLeave.form.name'), key: 'name' },
  { title: t('creatLeave.form.permanent_date'), key: 'permanent_date' },
  { title: t('creatLeave.form.offdays'), key: 'offDays' },
]);

const multiHeaders3 = computed(() => [
  { title: t('creatLeave.form.name'), key: 'name' },
  { title: t('creatLeave.form.ot_date'), key: 'ot_date' },
  { title: t('creatLeave.form.ot_time'), key: 'ot_time' },
  { title: t('memberFine.form.status'), key: 'status' },
  { title: t('memberFine.form.action'), key: 'action' },
]);

function changeMultipleLeave(value) {
  if (value) {
    formData.value.leave_date = null;
    if (!Array.isArray(formData.value.multi_date)) {
      formData.value.multi_date = [];
    }
    formData.value.duration = durationCount.value > 0 ? String(durationCount.value) : '';
  } else {
    formData.value.multi_date = [];
    formData.value.duration = '';
  }

  if (LeaveFormRef.value) {
    LeaveFormRef.value.resetForm({
      values: {
        leave_date: formData.value.leave_date,
        multi_date: formData.value.multi_date,
        duration: formData.value.duration,
        reason: formData.value.reason,
      },
    });
  }
}

function updateMultipleDuration(selectedDates) {
  const dates = Array.isArray(selectedDates) ? selectedDates : [];
  formData.value.multi_date = dates;
  formData.value.duration = dates.length > 0 ? String(dates.length) : '';

  if (LeaveFormRef.value) {
    LeaveFormRef.value.setFieldValue('duration', formData.value.duration);
  }
}

function onCheckboxChange(value) {
  if (!value) {
    selectedMemberId.value = null;
    isChecked.value = true;
    selectedPotion.value = null;
    resetAllForms();
  }
}

function resetAllForms() {
  formData.value.leave_date = null;
  formData.value.multi_date = [];
  formData.value.duration = '';
  formData.value.reason = '';
  formData.value.permanent_date = null;
  formData.value.ot_date = null;
  formData.value.ot_time = '';

  if (LeaveFormRef.value) LeaveFormRef.value.resetForm();
  if (LeaveRecordFormRef.value) LeaveRecordFormRef.value.resetForm();
  if (OtFormRef.value) OtFormRef.value.resetForm();
}

const fetchData = async () => {
  try {
    await Promise.all([
      memberStore.fetchMember(),
      leaveStore.fetchLeave(),
      leaveRecordStore.fetchLeaveRecord(),
      overTimeStore.fetchOverTime(),
    ]);
  } catch (error) {}
};

const selectMember = async (id) => {
  try {
    if (!memberStore.getMembers?.length) {
      await memberStore.fetchMember();
    }

    const member = memberStore.getMembers.find((item) => item.id === id);

    if (!member) {
      showNewEmployee.value = false;
      selectedPotion.value = null;
      return;
    }

    formData.value.staff_id = id;
    formData.value.permanent_date = member.permanent_date;
    showNewEmployee.value = true;
  } catch (error) {}
};

async function submitLeave(values, { resetForm }) {
  try {
    if (!selectedMemberId.value) return;

    let payload;

    if (multipleLeave.value) {
      const dates = Array.isArray(values.multi_date) ? values.multi_date : [];
      if (!dates.length) return;

      payload = {
        staff_id: selectedMemberId.value,
        multi_date: dates,
        duration: 'Full Day',
        reason: values.reason || '',
      };
    } else {
      payload = {
        staff_id: selectedMemberId.value,
        leave_date: values.leave_date,
        duration: values.duration,
        reason: values.reason || '',
      };
    }

    await leaveStore.createLeave(payload);

    await fetchData();

    resetForm({
      values: {
        leave_date: null,
        multi_date: [],
        duration: '',
        reason: '',
      },
    });

    formData.value.leave_date = null;
    formData.value.multi_date = [];
    formData.value.duration = '';
    formData.value.reason = '';
  } catch (error) {}
}

async function submitLeaveRecord(values, { resetForm }) {
  try {
    if (!selectedMemberId.value) return;

    const payload = {
      staff_id: selectedMemberId.value,
      permanent_date: values.permanent_date,
    };

    await leaveRecordStore.createLeaveRecord(payload);
    await fetchData();
    resetForm();
  } catch (error) {}
}

async function submitOt(values, { resetForm }) {
  try {
    if (!selectedMemberId.value) return;

    const payload = {
      staff_id: selectedMemberId.value,
      ot_date: values.ot_date,
      ot_time: values.ot_time,
    };

    await overTimeStore.createOverTime(payload);
    await fetchData();

    resetForm();
    formData.value.ot_date = null;
    formData.value.ot_time = null;
  } catch (error) {}
}

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

.status-short {
  background-color: rgba(30, 136, 229, 0.2);
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 800;
  color: #1e88e5;
  /* text-transform: uppercase; */
}
</style>