<template>
  <div>
    <BaseTitle class="mb-3">
      {{ t('workHourReport.title') }}
    </BaseTitle>
    <ParentCard class="pa-2">
      <Form ref="formRef" :validation-schema="reportingSchema" @submit="submit">
        <v-row>
          <v-col cols="6" md="4" lg="3">
            <v-date-picker
              v-model="selectedDates"
              class="mx-auto"
              rounded="lg"
              hide-header
              multiple
            >
            </v-date-picker>
          </v-col>
          <v-col cols="6" md="4" lg="3">
            <v-row>
              <v-col cols="12">
                <Field
                  name="employee"
                  v-slot="{ field: { value, ...field }, errorMessage }"
                >
                  <BaseAutoComplete
                    v-model="selectedEmployee"
                    v-bind="field"
                    :label="t('workHourReport.form.employee')"
                    :items="employees"
                    prependIcon="mdi-account"
                    item-title="name"
                    item-value="id"
                    width="90%"
                    :chip-width="195"
                    :error-messages="errorMessage"
                  >
                  </BaseAutoComplete>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Field name="project" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('workHourReport.form.project')"
                    :items="projects"
                    prependIcon="mdi-microsoft-teams"
                    item-title="name"
                    item-value="id"
                    width="90%"
                    :error-messages="errorMessage"
                  >
                  </BaseSelect>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Field name="task" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('workHourReport.form.task')"
                    :items="tasks"
                    prependIcon="mdi-clipboard-text"
                    item-title="name"
                    width="90%"
                    item-value="id"
                    :error-messages="errorMessage"
                  >
                  </BaseSelect>
                </Field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" md="4" lg="3">
            <v-row>
              <v-col cols="12">
                <Field
                  name="timeSelectionMode"
                  rules=""
                  v-slot="{ errorMessage }"
                >
                  <v-radio-group
                    v-model="timeSelectionMode"
                    inline
                    class="mt-2 ml-n2"
                    :error-messages="errorMessage"
                  >
                    <v-radio
                      :label="t('workHourReport.form.auto')"
                      :value="0"
                      color="primary"
                      class="radio-btn mr-5"
                    ></v-radio>
                    <v-radio
                      :label="t('workHourReport.form.manual')"
                      :value="1"
                      color="primary"
                      class="radio-btn"
                    ></v-radio>
                  </v-radio-group>
                </Field>
              </v-col>
            </v-row>
            <v-row v-if="timeSelectionMode === 0">
              <v-col cols="12">
                <Field name="period" v-slot="{ field, errorMessage }">
                  <BaseMultiSelect
                    v-model="selectedPeriod"
                    v-bind="field"
                    :label="t('workHourReport.form.period')"
                    :items="periods"
                    prependIcon="mdi-clock"
                    item-title="name"
                    width="90%"
                    item-value="id"
                    :error-messages="errorMessage"
                  >
                  </BaseMultiSelect>
                </Field>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="6">
                <Field name="startTime" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('workHourReport.form.startTime')"
                    :items="timeSlots"
                    prependIcon="mdi-clock-time-nine"
                    item-title="name"
                    item-value="name"
                    width="90%"
                    :error-messages="errorMessage"
                  >
                  </BaseSelect>
                </Field>
              </v-col>
              <v-col cols="6">
                <Field name="finishTime" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('workHourReport.form.finishTime')"
                    :items="timeSlots"
                    item-title="name"
                    item-value="name"
                    width="90%"
                    class="ml-n4"
                    :error-messages="errorMessage"
                  >
                  </BaseSelect>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="ml-n2">
                  <BaseButton type="submit" style="width: 90%">
                    {{ t('common.submit') }}
                  </BaseButton>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="3">
            <v-row>
              <v-col cols="4" md="4" lg="12">
                <div>
                  <BaseButton style="width: 80%" class="rounded-pill">
                    {{ t('common.autoFill') }}
                  </BaseButton>
                </div>
              </v-col>
              <v-col cols="4" md="4" lg="12">
                <div class="mt-6">
                  <BaseButton style="width: 80%" class="rounded-pill">
                    {{ t('common.saveSetting') }}
                  </BaseButton>
                </div>
              </v-col>
              <v-col cols="4" md="4" lg="12">
                <div class="mt-6">
                  <BaseButton style="width: 80%" class="rounded-pill">
                    {{ t('common.download') }}
                  </BaseButton>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </Form>
    </ParentCard>

    <ParentCard>
      <BaseTable
        :headers="headers"
        :items="[]"
        :items-count="itemsCount"
        :style="{ minHeight: windowHeight }"
        :pagination="false"
      >
        <template #item.position="{ item }">
          <div
            class="rounded-pill py-1 px-1 text-center mx-auto"
            :style="{
              backgroundColor: item.position?.color,
              width: '75px',
              fontSize: '11px',
            }"
          >
            {{ item.position?.name }}
          </div>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex justify-end">
            <BaseButton
              elevation="0"
              @click.stop="scrollToEdit(item.id)"
              color=""
              class="edit-btn"
              size="small"
            >
              <v-icon> mdi-pencil </v-icon>
            </BaseButton>
            <BaseButton
              elevation="0"
              @click.stop="showConfirmDelete(item.id)"
              color=""
              class="delete-btn"
              size="small"
            >
              <v-icon> mdi-trash-can</v-icon>
            </BaseButton>
          </div>
        </template>
      </BaseTable>
    </ParentCard>

    <BaseConfirmDelete
      v-model="warnDateSelection"
      :text="t('workHourReport.warnDateRequiredText')"
      :class="{ 'd-none': !warnDateSelection }"
      :hide-cancel-btn="true"
      @yes="warnDateSelection = false"
      @no="warnDateSelection = false"
    ></BaseConfirmDelete>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useReportingStore } from '@/stores/reporting/reporting.js';
import { getReportingSchema } from '@/plugins/validations/reporting.js';
import { ADMIN } from '@/utils/constant';
import { timeSlots, periods } from '@/utils/data';
import { changeDateTimeZone } from '@/utils/helper';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const reportingStore = useReportingStore();
const reportingSchema = computed(() =>
  getReportingSchema(t, timeSelectionMode.value)
);
const role = authStore.staffRole;
const formRef = ref(null);
const timeSelectionMode = ref(0);
const selectedDates = ref([]);
const isEditMode = ref(false);
const search = ref('');
const warnDateSelection = ref(false);
const deleteTarget = ref(undefined);
const updateTarget = ref(undefined);
const checkPrjCds = ref([]);
let originalItems = [];
const employeeItems = ref([]);
const selectedEmployee = ref([]);
const selectedPeriod = ref([1, 2]);
const employees = computed(() => {
  return employeeItems.value?.map((item) => ({
    ...item,
    name: `${isJapanese.value ? item.jp_name : item.eng_name}`,
  }));
});
const isJapanese = computed(() => locale.value === 'ja');
const projectItems = ref([]);
const projects = computed(() => {
  return projectItems.value?.map((item) => ({
    ...item,
    name: `${item.cd} : ${isJapanese.value ? item.jp_name : item.eng_name}`,
  }));
});
const taskItems = ref([]);
const tasks = computed(() => {
  return taskItems.value?.map((item) => ({
    ...item,
    name: `${item.cd} : ${isJapanese.value ? item.jp_name : item.eng_name}`,
  }));
});
const headers = computed(() => {
  const tmpHeaders = [
    {
      title: t('addProject.table.cd'),
      key: 'cd',
    },
    {
      title: t('addProject.table.name'),
      key: isJapanese.value ? 'jp_name' : 'eng_name',
      sortable: false,
    },
  ];
  if (role === ADMIN) {
    tmpHeaders.push({
      title: t('memberList.table.action'),
      key: 'action',
      align: 'center',
      sortable: false,
      width: '10%',
    });
  }
  return tmpHeaders;
});
let windowHeight, itemsCount;
if (window.innerWidth > 1366) {
  windowHeight = window.innerHeight / 1.4;
  itemsCount = 10;
} else {
  windowHeight = window.innerHeight / 1.8;
  itemsCount = 5;
}

const fetch = async () => {
  formRef.value?.resetForm();
  await reportingStore.fetchProject();
  projectItems.value = [...reportingStore.getProjects];
  await reportingStore.fetchMember();
  const tmpMembers = [...reportingStore.getMembers];
  tmpMembers?.sort((a, b) => {
    if (!a.sort_key) return 1;
    if (!b.sort_key) return -1;
    return a.sort_key - b.sort_key;
  });
  employeeItems.value = [...tmpMembers];
  await reportingStore.fetchTask();
  taskItems.value = [...reportingStore.getTasks];
  selectPreviousOfficeDays();
};

fetch();

function selectPreviousOfficeDays() {
  const result = [];
  let current = new Date();
  result.push(new Date());
  while (result.length < 5) {
    current.setDate(current.getDate() - 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      result.push(new Date(current));
    }
  }
  selectedDates.value = result.reverse();
}
function generatePeriods(startTime, endTime) {
  const slots = [];
  let id = 1;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const start = new Date();
  start.setHours(startHour, startMin, 0, 0);
  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);
  end.setMinutes(end.getMinutes() - 30);
  while (start <= end) {
    const hours = start.getHours().toString().padStart(2, '0');
    const minutes = start.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    start.setMinutes(start.getMinutes() + 30);
  }
  return slots;
}
const submit = async (values) => {
  console.log(values);
  console.log(selectedDates.value);
  if (selectedDates.value?.length === 0) {
    warnDateSelection.value = true;
  } else {
    let data = [];
    let totalPeriods = [];
    const totalDates = selectedDates.value?.map((date) =>
      changeDateTimeZone(date)
    );
    if (timeSelectionMode.value === 0) {
      selectedPeriod.value?.forEach((selectedPeriod) => {
        const currentPeriod = periods.value?.find(
          (period) => period.id === selectedPeriod
        );
        if (currentPeriod) {
          totalPeriods.push(
            ...generatePeriods(
              currentPeriod.startTime,
              currentPeriod.finishTime
            )
          );
        }
      });
    } else {
      totalPeriods = generatePeriods(values.startTime, values.finishTime);
    }

    selectedEmployee.value?.forEach((employee) => {
      totalDates?.forEach((date) => {
        totalPeriods?.forEach((period) => {
          data.push({
            date: date,
            staff_id: employee,
            project_id: values.project,
            task_id: values.task,
            period: period,
          });
        });
      });
    });
    await reportingStore.createTaskPerformance({ create_array: data });
  }
  // if (isEditMode.value) {
  //   await projectStore.updateProject({ id: updateTarget.value, ...values });
  // } else {
  //   await projectStore.createProject(values);
  // }
  // fetch();
};
</script>

<style>
.radio-btn .mdi-radiobox-blank {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
