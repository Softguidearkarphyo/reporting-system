<template>
  <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>

  <ParentCard height="115px">
    <v-row class="align-center" dense>
      <v-col cols="12">
        <div class="d-flex flex-wrap align-center justify-space-around">
          <BaseSelect v-if="!selectedMember" v-model="selectedMemberId" :label="t('creatLeave.options.employee')"
            :items="memberList" item-value="id" item-title="name" prependIcon="tabler:IconUserCog" width="250px"
            @update:modelValue="selectMember" />

          <v-checkbox v-else v-model="isChecked" :label="t('creatLeave.options.selected_name') +
            selectName
            " hide-details color="primary" class="custom-checkbox" @update:modelValue="onCheckboxChange" />

          <v-checkbox v-model="selectedPotion" color="primary" :label="t('creatLeave.options.existing')"
            value="potions1" hide-details class="custom-checkbox" />

          <v-checkbox v-if="showNewEmployee" v-model="selectedPotion" color="primary"
            :label="t('creatLeave.options.new')" value="potions2" hide-details class="custom-checkbox" />

          <v-checkbox v-model="selectedPotion" color="primary" :label="t('creatLeave.options.ot')" value="potions3"
            hide-details class="custom-checkbox" />
        </div>
      </v-col>
    </v-row>
  </ParentCard>


  <v-row v-if="selectedMember && selectedPotion" dense>
    <v-col cols="12" md="5">
      <ParentCard>
        <v-row dense>
          <v-col class="d-flex justify-center">
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

        <Form v-if="selectedPotion === 'potions1'" ref="LeaveFormRef" :key="`leave-form-${multipleLeave}`"
          :validation-schema="LeaveFormSchema" :initial-values="leaveInitialValues" @submit="submitLeave">

          <v-row dense>

            <v-col cols="12" md="6">
              <Field v-if="!multipleLeave" name="leave_date" v-slot="{
                value,
                handleChange,
                errorMessage
              }">
                <BaseDatePicker :model-value="value" :label="t('creatLeave.form.leave_date')
                  " class="mx-auto" prependIcon="tabler:IconCalendarPin" width="300px" :error-messages="errorMessage"
                  clearable @update:modelValue="
                    (date) => {
                      handleChange(date);
                      formData.leave_date = date;
                    }
                  " />
              </Field>

              <Field v-else name="multi_date" v-slot="{
                value,
                handleChange,
                errorMessage
              }">
                <BaseMultDate :model-value="value || []" :label="t('creatLeave.form.leave_date')
                  " class="mx-auto" prependIcon="tabler:IconCalendarPin" width="300px" :multiple="true"
                  :error-messages="errorMessage" @update:modelValue="
                    (dates) => {
                      const selectedDates = Array.isArray(dates)
                        ? dates
                        : [];

                      handleChange(selectedDates);
                      formData.multi_date = selectedDates;

                      updateMultipleDuration(
                        selectedDates
                      );
                    }
                  " />
              </Field>
            </v-col>


            <v-col cols="12" md="6">
              <Field v-if="multipleLeave" name="duration" v-slot="{ errorMessage }">
                <BaseTextField :model-value="durationCount" :label="t('creatLeave.form.duration')
                  " class="mx-auto" prependIcon="tabler:IconClockQuestion" width="300px" :error-messages="errorMessage"
                  readonly />
              </Field>

              <Field v-else name="duration" v-slot="{
                value,
                handleChange,
                errorMessage
              }">
                <BaseSelect :model-value="value" :label="t('creatLeave.form.duration')
                  " class="mx-auto" :items="durationHour" item-value="id" item-title="name"
                  prependIcon="tabler:IconClockQuestion" width="300px" :error-messages="errorMessage"
                  @update:modelValue="
                    (duration) => {
                      handleChange(duration);
                      formData.duration = duration;
                    }
                  " />
              </Field>
            </v-col>
          </v-row>


          <v-row dense>
            <v-col cols="12" md="6">
              <Field name="reason" v-slot="{
                value,
                handleChange,
                errorMessage
              }">
                <BaseTextField :model-value="value" :label="t('creatLeave.form.reason')
                  " class="mx-auto" type="text" variant="plain" prependIcon="tabler:IconHelpCircle" width="300px"
                  :error-messages="errorMessage" @update:modelValue="
                    (reason) => {
                      handleChange(reason);
                      formData.reason = reason;
                    }
                  " />
              </Field>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-start">
              <v-switch v-model="multipleLeave" class="custom-switch-label" :label="t('creatLeave.form.multiple_leave')
                " color="primary" hide-details @update:modelValue="
                  changeMultipleLeave
                " />
            </v-col>

            <v-col class="d-flex justify-center">
              <BaseButton type="submit" style="width: 200px">
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </Form>



        <Form v-if="selectedPotion === 'potions2'" ref="LeaveRecordFormRef" :validation-schema="LeaveRecordFormSchema"
          :initial-values="leaveRecordInitialValues" @submit="submitLeaveRecord">
          <v-row dense>
            <v-col cols="12" md="6">
              <Field name="permanent_date" v-slot="{
                value,
                handleChange,
                errorMessage
              }">
                <BaseDatePicker :model-value="value" :label="t(
                  'creatLeave.form.permanent_date'
                )
                  " class="mx-auto" prependIcon="tabler:IconCalendarPin" width="300px" :error-messages="errorMessage"
                  clearable @update:modelValue="
                    (date) => {
                      handleChange(date);
                      formData.permanent_date = date;
                    }
                  " />
              </Field>
            </v-col>

            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <BaseButton type="submit" style="width: 200px">
                {{ t('creatLeave.form.calculate') }}
              </BaseButton>
            </v-col>
          </v-row>
        </Form>


        <Form v-if="selectedPotion === 'potions3'" ref="OtFormRef" :validation-schema="OtFormSchema"
          :initial-values="otInitialValues" @submit="submitOt">
          <v-row dense>
            <v-col cols="12" md="6">
              <Field name="ot_date" v-slot="{
                value,
                handleChange,
                errorMessage
              }">
                <BaseDatePicker :model-value="value" :label="t('creatLeave.form.ot_date')
                  " class="mx-auto" prependIcon="tabler:IconCalendarPin" width="300px" :error-messages="errorMessage"
                  clearable @update:modelValue="
                    (date) => {
                      handleChange(date);
                      formData.ot_date = date;
                    }
                  " />
              </Field>
            </v-col>

            <v-col cols="12" md="6">
              <Field name="ot_time" v-slot="{
                value,
                handleChange,
                errorMessage
              }">
                <BaseSelect :model-value="value" :label="t('creatLeave.form.ot_time')
                  " class="mx-auto" :items="durationHour" item-value="id" item-title="name"
                  prependIcon="tabler:IconAlarm" width="300px" :error-messages="errorMessage" @update:modelValue="
                    (time) => {
                      handleChange(time);
                      formData.ot_time = time;
                    }
                  " />
              </Field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col class="d-flex justify-center">
              <BaseButton type="submit" style="width: 200px">
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </Form>
      </ParentCard>
    </v-col>


    <v-col cols="12" md="7">
      <ParentCard>
        <BaseTitle v-if="selectedPotion === 'potions1'">
          {{ t('creatLeave.title') }}
        </BaseTitle>

        <BaseTitle v-if="selectedPotion === 'potions2'">
          {{ t('creatLeave.title4') }}
        </BaseTitle>

        <BaseTitle v-if="selectedPotion === 'potions3'">
          {{ t('creatLeave.title3') }}
        </BaseTitle>

        <BaseTable v-if="selectedPotion === 'potions1'" :headers="multiHeaders1" :items="leaveRequests"
          items-per-page="10" class="elevation-1">
          <template #[`item.leave_type`]="{ item }">
            <span v-if="item.leave_type === 1" class="status d-inline-flex justify-center align-center">
              paid
            </span>

            <span v-else class="status1 d-inline-flex justify-center align-center">
              unpaid
            </span>
          </template>

          <template #[`item.duration`]="{ item }">
            <span v-if="item.duration == 1">
              Full day
            </span>

            <span v-else-if="item.duration == 2">
              Half day
            </span>

            <span v-else-if="item.duration == 3">
              3 Hrs : 30 Min
            </span>

            <span v-else-if="item.duration == 4">
              3 Hrs
            </span>

            <span v-else-if="item.duration == 5">
              2 Hrs : 30 Min
            </span>

            <span v-else-if="item.duration == 6">
              2 Hrs
            </span>

            <span v-else-if="item.duration == 7">
              1 Hrs : 30 Min
            </span>

            <span v-else-if="item.duration == 8">
              1 Hrs
            </span>

            <span v-else-if="item.duration == 9">
              30 Min
            </span>

            <span v-else>
              {{ item.duration }}
            </span>
          </template>
        </BaseTable>

        <BaseTable v-if="selectedPotion === 'potions2'" :headers="multiHeaders2" :items="leaveRecords"
          items-per-page="10" class="elevation-1" />

        <BaseTable v-if="selectedPotion === 'potions3'" :headers="multiHeaders3" :items="overtimes" items-per-page="10"
          class="elevation-1" />
      </ParentCard>
    </v-col>
  </v-row>
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
import {
  useLeaveRecordStore,
} from '@/stores/leaveRecord/leaveRecord.js';
import {
  useOverTimeStore,
} from '@/stores/overtime/overtime.js';

import {
  leaveSchema,
  leaveRecordSchema,
  otSchema,
} from '@/plugins/validations/leave.js';

import {
  durationHour,
} from '@/utils/date.js';


const {
  t,
  locale,
} = useI18n();


const memberStore = useMemberStore();
const leaveStore = useLeaveStore();
const leaveRecordStore =
  useLeaveRecordStore();
const overTimeStore =
  useOverTimeStore();

const LeaveFormRef = ref(null);
const LeaveRecordFormRef = ref(null);
const OtFormRef = ref(null);


const selectedPotion = ref('potions1');

const selectedMemberId = ref(null);

const isChecked = ref(true);

const multipleLeave = ref(false);

const showNewEmployee = ref(false);

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


const leaveInitialValues = computed(() => ({
  leave_date: formData.value.leave_date,
  multi_date: formData.value.multi_date,
  duration: formData.value.duration,
  reason: formData.value.reason,
}));

const leaveRecordInitialValues = computed(() => ({
  permanent_date:
    formData.value.permanent_date,
}));

const otInitialValues = computed(() => ({
  ot_date: formData.value.ot_date,
  ot_time: formData.value.ot_time,
}));

const LeaveFormSchema = computed(() =>
  leaveSchema(
    t,
    multipleLeave.value
  )
);

const LeaveRecordFormSchema = computed(() =>
  leaveRecordSchema(t)
);

const OtFormSchema = computed(() =>
  otSchema(t)
);

const durationCount = computed(() => {
  if (
    !Array.isArray(
      formData.value.multi_date
    )
  ) {
    return 0;
  }

  return formData.value.multi_date.length;
});

const selectedMember = computed(() => {
  if (
    !memberList.value ||
    !selectedMemberId.value
  ) {
    return null;
  }

  return memberList.value.find(
    (member) =>
      member.id === selectedMemberId.value
  );
});

const selectName = computed(() => {
  return selectedMember.value
    ? selectedMember.value.name
    : '';
});

const memberList = computed(() => {
  const isJapanese =
    locale.value === 'ja';

  return (
    memberStore.getMembers
      ?.map((member) => ({
        id: member.id,

        name: isJapanese
          ? member.jp_name
          : member.eng_name,

        sort_key: member.sort_key,
      }))
      ?.sort((a, b) => {
        if (!a.sort_key) {
          return 1;
        }

        if (!b.sort_key) {
          return -1;
        }

        return (
          a.sort_key - b.sort_key
        );
      }) || []
  );
});

const leaveRequests = computed(() => {
  const isJapanese =
    locale.value === 'ja';

  return (
    leaveStore.getLeaves ?? []
  ).map((leave) => ({
    ...leave,

    name: isJapanese
      ? leave.jp_name
      : leave.eng_name,
  }));
});

const leaveRecords = computed(() => {
  const isJapanese =
    locale.value === 'ja';

  return (
    leaveRecordStore
      .getLeaveRecord ?? []
  ).map((record) => ({
    permanent_date:
      record.permanent_date,

    name: isJapanese
      ? record.jp_name
      : record.eng_name,

    offDays:
      record.total_leaves,
  }));
});

const overtimes = computed(() => {
  const isJapanese =
    locale.value === 'ja';

  return (
    overTimeStore.getOverTime ?? []
  ).map((ot) => ({
    name: isJapanese
      ? ot.jp_name
      : ot.eng_name,

    ot_date: ot.ot_date,

    ot_time: ot.ot_time,
  }));
});

const multiHeaders1 = computed(() => [
  {
    title: t('creatLeave.form.name'),
    key: 'name',
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
]);

const multiHeaders2 = computed(() => [
  {
    title: t('creatLeave.form.name'),
    key: 'name',
  },
  {
    title: t(
      'creatLeave.form.permanent_date'
    ),
    key: 'permanent_date',
  },
  {
    title: t(
      'creatLeave.form.offdays'
    ),
    key: 'offDays',
  },
]);

const multiHeaders3 = computed(() => [
  {
    title: t('creatLeave.form.name'),
    key: 'name',
  },
  {
    title: t('creatLeave.form.ot_date'),
    key: 'ot_date',
  },
  {
    title: t('creatLeave.form.ot_time'),
    key: 'ot_time',
  },
]);

function changeMultipleLeave(value) {
  if (value) {
    formData.value.leave_date = null;

    if (
      !Array.isArray(
        formData.value.multi_date
      )
    ) {
      formData.value.multi_date = [];
    }

    formData.value.duration =
      durationCount.value > 0
        ? String(durationCount.value)
        : '';
  } else {
    formData.value.multi_date = [];

    formData.value.duration = '';
  }

  if (LeaveFormRef.value) {
    LeaveFormRef.value.resetForm({
      values: {
        leave_date:
          formData.value.leave_date,

        multi_date:
          formData.value.multi_date,

        duration:
          formData.value.duration,

        reason:
          formData.value.reason,
      },
    });
  }
}

function updateMultipleDuration(
  selectedDates
) {
  const dates = Array.isArray(
    selectedDates
  )
    ? selectedDates
    : [];

  formData.value.multi_date = dates;

  formData.value.duration =
    dates.length > 0
      ? String(dates.length)
      : '';

  if (LeaveFormRef.value) {
    LeaveFormRef.value.setFieldValue(
      'duration',
      formData.value.duration
    );
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

  if (LeaveFormRef.value) {
    LeaveFormRef.value.resetForm();
  }

  if (LeaveRecordFormRef.value) {
    LeaveRecordFormRef.value.resetForm();
  }

  if (OtFormRef.value) {
    OtFormRef.value.resetForm();
  }
}

const fetchData = async () => {
  try {
    await Promise.all([
      memberStore.fetchMember(),

      leaveStore.fetchLeave(),

      leaveRecordStore.fetchLeaveRecord(),

      overTimeStore.fetchOverTime(),
    ]);
  } catch (error) { }
};

const selectMember = async (id) => {
  try {
    if (!memberStore.getMembers?.length) {
      await memberStore.fetchMember();
    }

    const member =
      memberStore.getMembers.find(
        (item) => item.id === id
      );

    if (!member) {
      showNewEmployee.value = false;

      selectedPotion.value = null;

      return;
    }

    formData.value.staff_id = id;

    formData.value.permanent_date =
      member.permanent_date;

    const isInitial = true;

    showNewEmployee.value =
      isInitial;

    if (!isInitial) {
      selectedPotion.value = null;
    }
  } catch (error) { }
};

async function submitLeave(
  values,
  { resetForm }
) {
  try {
    if (!selectedMemberId.value) {
      return;
    }

    let payload;

    if (multipleLeave.value) {
      const dates =
        Array.isArray(values.multi_date)
          ? values.multi_date
          : [];

      if (!dates.length) {
        return;
      }

      payload = {
        staff_id:
          selectedMemberId.value,

        multi_date: dates,

        duration: 'Full Day',

        reason:
          values.reason || '',
      };
    } else {
      payload = {
        staff_id:
          selectedMemberId.value,

        leave_date:
          values.leave_date,

        duration:
          values.duration,

        reason:
          values.reason || '',
      };
    }

    // console.log(
    //   'SUBMIT LEAVE PAYLOAD:',
    //   JSON.stringify(
    //     payload,
    //     null,
    //     2
    //   )
    // );

    await leaveStore.createLeave(
      payload
    );

    await fetchData();

    resetForm({
      values: {
        leave_date: null,
        multi_date: [],
        duration: '',
        reason: '',
      },
    });

    formData.value.leave_date =
      null;

    formData.value.multi_date =
      [];

    formData.value.duration =
      '';

    formData.value.reason =
      '';
  } catch (error) { }
}

async function submitLeaveRecord(
  values,
  { resetForm }
) {
  try {
    if (!selectedMemberId.value) {
      return;
    }

    const payload = {
      staff_id:
        selectedMemberId.value,

      permanent_date:
        values.permanent_date,
    };

    // console.log(
    //   'LEAVE RECORD PAYLOAD:',
    //   JSON.stringify(
    //     payload,
    //     null,
    //     2
    //   )
    // );

    await leaveRecordStore.createLeaveRecord(
      payload
    );

    await fetchData();

    resetForm();
  } catch (error) { }
}

async function submitOt(
  values,
  { resetForm }
) {
  try {
    if (!selectedMemberId.value) {
      return;
    }

    const payload = {
      staff_id:
        selectedMemberId.value,

      ot_date: values.ot_date,

      ot_time: values.ot_time,
    };

    // console.log(
    //   'OVERTIME PAYLOAD:',
    //   JSON.stringify(
    //     payload,
    //     null,
    //     2
    //   )
    // );

    await overTimeStore.createOverTime(
      payload
    );

    await fetchData();

    resetForm();

    formData.value.ot_date = null;

    formData.value.ot_time = null;
  } catch (error) { }
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
</style>
