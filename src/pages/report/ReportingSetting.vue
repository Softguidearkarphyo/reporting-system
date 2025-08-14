<template>
  <div>
    <BaseTitle class="mb-3">
      {{ t('workHourReportSetting.title') }}
    </BaseTitle>
    <div class="d-flex justify-space-between align-center" style="width: 100%">
      <BaseSelect
        v-if="role === ADMIN"
        v-model="selectedEmployee"
        :label="t('workHourReportSetting.employee')"
        :items="employees"
        prependIcon="mdi-account"
        :width="'320px'"
        item-title="name"
        item-value="id"
      >
      </BaseSelect>
      <div class="mt-4 ml-1 mb-6 text-h5 staff-name" v-else>
        {{ employeeName }}
      </div>
      <div>
        <v-btn
          icon
          color="primary"
          class="circle-btn mr-5"
          density="comfortable"
          @click="openDialog"
        >
          <v-icon> tabler:IconEdit </v-icon>
          <v-tooltip activator="parent" location="bottom">{{
            t('common.edit')
          }}</v-tooltip>
        </v-btn>
      </div>
    </div>
    <v-row>
      <v-col cols="12"
        ><v-carousel
          v-model="carouselIndex"
          hide-delimiters
          show-arrows="hover"
          style="height: auto"
        >
          <v-carousel-item
            v-for="dayOfTheWeek in daysOfTheWeek"
            :key="dayOfTheWeek.id"
            :value="dayOfTheWeek.id"
          >
            <ParentCard>
              <h3 class="color-primary text-center text-uppercase">
                {{ dayOfTheWeek.name }}
              </h3>

              <BaseTable
                :headers="headers"
                :items="dateTaskGroups?.[dayOfTheWeek.id]"
                :items-count="itemsCount"
                :style="{ minHeight: windowHeight }"
                :pagination="false"
                class="mx-auto dense-table mt-6"
              >
                <template #[`item.period`]="{ item }">
                  <span class="period-box">
                    {{ format12Hour(item.period) }}
                  </span>
                </template>
              </BaseTable>
            </ParentCard></v-carousel-item
          >
        </v-carousel></v-col
      >
    </v-row>
    <v-dialog v-model="showEditForm" max-width="450" persistent>
      <v-card class="rounded pa-4">
        <Form
          ref="formRef"
          :validation-schema="reportingSettingSchema"
          @submit="submit"
        >
          <v-row>
            <v-col cols="12">
              <v-row class="pt-3">
                <v-col
                  cols="12"
                  class="d-flex justify-space-between items-center"
                >
                  <div class="text-h5 staff-name ml-2">
                    {{ employeeName }}
                  </div>

                  <v-icon
                    color="primary"
                    class="mr-3 cursor-pointer close-btn"
                    @click="showEditForm = false"
                    >mdi-close</v-icon
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <Field name="day" v-slot="{ field, errorMessage }">
                    <BaseMultiSelect
                      v-model="selectedDay"
                      v-bind="field"
                      :label="t('workHourReport.form.day')"
                      :items="daysOfTheWeek"
                      prependIcon="tabler:IconCalendar"
                      item-title="name"
                      item-value="id"
                      class="mb-n4"
                      width="95%"
                      style="margin-left: 4px"
                      :error-messages="errorMessage"
                    >
                    </BaseMultiSelect>
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
                      prependIcon="tabler:IconWorldPlus"
                      item-title="name"
                      item-value="id"
                      class="mb-n2"
                      width="95%"
                      style="margin-left: 4px"
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
                      prependIcon="tabler:IconChecklist "
                      item-title="name"
                      item-value="id"
                      class="mt-n2"
                      width="95%"
                      style="margin-left: 4px"
                      :error-messages="errorMessage"
                    >
                    </BaseSelect>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="mt-n3">
                  <Field
                    name="timeSelectionMode"
                    rules=""
                    v-slot="{ errorMessage }"
                  >
                    <v-radio-group
                      v-model="timeSelectionMode"
                      inline
                      class="mb-n8"
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
              <v-row v-if="timeSelectionMode === 0" class="mt-5">
                <v-col cols="12">
                  <Field name="period" v-slot="{ field, errorMessage }">
                    <BaseMultiSelect
                      v-model="selectedPeriod"
                      v-bind="field"
                      :label="t('workHourReport.form.period')"
                      :items="periods"
                      prependIcon="tabler:IconClockHour9"
                      item-title="name"
                      item-value="id"
                      width="95%"
                      style="margin-left: 4px"
                      :error-messages="errorMessage"
                    >
                    </BaseMultiSelect>
                  </Field>
                </v-col>
              </v-row>
              <v-row v-else class="mt-5">
                <v-col cols="6">
                  <Field name="startTime" v-slot="{ field, errorMessage }">
                    <BaseSelect
                      v-model="field.value"
                      v-bind="field"
                      :label="t('workHourReport.form.startTime')"
                      :items="timeSlots"
                      prependIcon="tabler:IconClockHour5"
                      item-title="name"
                      item-value="name"
                      width="100%"
                      style="margin-left: 4px"
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
                      width="100%"
                      class="ml-n4"
                      :error-messages="errorMessage"
                    >
                    </BaseSelect>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div
                    class="d-flex justify-space-between mb-2"
                    style="margin-left: 3px; width: 98%"
                  >
                    <BaseButton
                      color="primary"
                      density="compact"
                      @click="overTime = overTime > 0 ? overTime - 0.5 : 0"
                      ><v-icon>mdi-minus</v-icon></BaseButton
                    >
                    <div class="mt-2">
                      {{
                        overTime === 0
                          ? t('workHourReport.form.overTime')
                          : t('workHourReport.form.overTimeCount', {
                              duration: overTime,
                            })
                      }}
                    </div>
                    <BaseButton
                      color="primary"
                      density="compact"
                      @click="overTime = overTime + 0.5"
                      ><v-icon>mdi-plus</v-icon></BaseButton
                    >
                  </div>
                </v-col>
              </v-row>
              <v-row
                ><v-col cols="12">
                  <div class="mt-2 mb-2" style="margin-left: 1px">
                    <BaseButton type="submit" style="width: 95%">
                      {{ t('common.submit') }}
                    </BaseButton>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </Form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useReportingStore } from '@/stores/reporting/reporting.js';
import { getReportingSettingSchema } from '@/plugins/validations/reporting-setting.js';
import { ADMIN } from '@/utils/constant';
import { timeSlots, periods } from '@/utils/data';
import {
  changeDateTimeZone,
  generatePeriods,
  generateExtraPeriods,
  format12Hour,
  fillPeriods,
} from '@/utils/helper';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const reportingStore = useReportingStore();
const router = useRouter();
const role = authStore.staffRole;
const staff = authStore.loginStaff;
const employeeName = computed(() =>
  locale.value === 'ja'
    ? selectedEmployeeInfo.value?.jp_name
    : selectedEmployeeInfo.value?.eng_name
);
const reportingSettingSchema = computed(() =>
  getReportingSettingSchema(t, timeSelectionMode.value, role === ADMIN)
);
const daysOfTheWeek = computed(() => {
  return [
    {
      id: 0,
      name: t('workHourReportSetting.days.sun'),
    },
    {
      id: 1,
      name: t('workHourReportSetting.days.mon'),
    },
    {
      id: 2,
      name: t('workHourReportSetting.days.tue'),
    },
    {
      id: 3,
      name: t('workHourReportSetting.days.wed'),
    },
    {
      id: 4,
      name: t('workHourReportSetting.days.thurs'),
    },
    {
      id: 5,
      name: t('workHourReportSetting.days.fri'),
    },
    {
      id: 6,
      name: t('workHourReportSetting.days.sat'),
    },
  ];
});
const formRef = ref(null);
const timeSelectionMode = ref(0);
const selectedDates = ref([]);
const selectedDay = ref([]);
const search = ref('');
const deleteTarget = ref(undefined);
const updateTarget = ref(undefined);
const checkPrjCds = ref([]);
let originalItems = [];
const showEditForm = ref(false);
const employeeItems = ref([]);
const selectedEmployee = ref([]);
const selectedEmployeeInfo = computed(() => {
  if (role === ADMIN) {
    return employeeItems.value?.find(
      (item) => item.id === selectedEmployee.value
    );
  } else {
    return employeeItems.value?.[0];
  }
});
const showSavedBookmark = computed(() => {
  if (role === ADMIN) {
    return (
      selectedEmployeeInfo.value?.length > 0 &&
      selectedEmployeeInfo.value?.every(
        (employee) => employee.task_performance_setting?.length > 0
      )
    );
  }
  return selectedEmployeeInfo.value?.[0]?.task_performance_setting?.length > 0;
});
const selectedPeriod = ref([1, 2]);
const isDayMultiple = ref(true);
const currentEmployee = ref();
const dateTaskGroups = computed(() => {
  return selectedEmployeeInfo.value?.task_performance_setting;
});
const carouselIndex = ref(0);
const overTime = ref(0);
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
const selectedIsoDates = computed(() => {
  if (isDayMultiple.value) {
    return selectedDates.value
      ?.map((date) => changeDateTimeZone(date))
      ?.sort((a, b) => new Date(a) - new Date(b));
  } else {
    return [changeDateTimeZone(selectedDates.value)];
  }
});
const headers = computed(() => {
  return [
    {
      title: t('workHourReport.table.period'),
      key: 'period',
      sortable: false,
    },
    {
      title: t('workHourReport.table.project_cd'),
      key: 'project_cd',
      sortable: false,
    },
    {
      title: t('workHourReport.table.project_name'),
      key: isJapanese.value ? 'project_jp_name' : 'project_eng_name',
      sortable: false,
    },
    {
      title: t('workHourReport.table.task'),
      key: isJapanese.value ? 'task_jp_name' : 'task_eng_name',
      sortable: false,
    },
  ];
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
  await reportingStore.fetchTask();
  taskItems.value = [...reportingStore.getTasks];
  await getList();
  selectedEmployee.value = employeeItems.value?.[0]?.id;
};

fetch();

const openDialog = async () => {
  showEditForm.value = true;
  await nextTick();
  selectedPeriod.value = [1, 2];
  formRef.value?.setValues({
    day: selectedDay.value,
    period: selectedPeriod.value,
  });
};
const clearDates = () => {
  selectedDates.value = [];
};
const getList = async () => {
  const memberPayload = {
    project: {},
    task: {},
    task_performance_setting: {},
  };
  if (role !== ADMIN) {
    memberPayload.id = staff.id;
  }
  await reportingStore.fetchMember(memberPayload);
  const tmpMembers = reportingStore.getMembers?.map((member) => {
    const workReportPerDay = {};
    daysOfTheWeek.value?.forEach((day) => {
      const workReportThisDay = member.task_performance_setting
        ?.filter((item) => item.day === day.id)
        ?.map((item) => ({
          staff_id: item?.staff_id,
          day: item?.day,
          period: item?.period,
          project_id: item?.project_id,
          project_cd: item?.project?.cd,
          project_eng_name: item?.project?.eng_name,
          project_jp_name: item?.project?.jp_name,
          task_id: item?.task_id,
          task_cd: item?.task?.cd,
          task_eng_name: item?.task?.cd + '：' + item?.task?.eng_name,
          task_jp_name: item?.task?.cd + '：' + item?.task?.jp_name,
        }));
      workReportThisDay.sort((a, b) => a.period?.localeCompare(b.period));
      workReportPerDay[day.id] = workReportThisDay;
    });
    const tmpItem = {
      id: member?.id,
      eng_name: member?.eng_name,
      jp_name: member?.jp_name,
      sort_key: member?.sort_key,
      task_performance_setting: workReportPerDay,
    };
    return tmpItem;
  });
  tmpMembers?.sort((a, b) => {
    if (!a.sort_key) return 1;
    if (!b.sort_key) return -1;
    return a.sort_key - b.sort_key;
  });
  employeeItems.value = [...tmpMembers];
  employeeItems.value?.forEach((employee) => {
    employee.task_performance_setting = fillPeriods(
      employee.task_performance_setting
    );
  });
};
const submit = async (values) => {
  let data = [];
  let totalPeriods = [];
  if (timeSelectionMode.value === 0) {
    selectedPeriod.value?.forEach((selectedPeriod) => {
      const currentPeriod = periods.value?.find(
        (period) => period.id === selectedPeriod
      );
      if (currentPeriod) {
        totalPeriods.push(
          ...generatePeriods(currentPeriod.startTime, currentPeriod.finishTime)
        );
      }
    });
  } else {
    totalPeriods = generatePeriods(values.startTime, values.finishTime);
  }
  if (overTime.value > 0) {
    totalPeriods.push(
      ...generateExtraPeriods(
        totalPeriods[totalPeriods.length - 1],
        overTime.value
      )
    );
  }
  if (values.project) {
    selectedDay.value?.forEach((day) => {
      totalPeriods?.forEach((period) => {
        data.push({
          day: day,
          staff_id: selectedEmployee.value,
          project_id: values.project,
          task_id: values.task,
          period: period,
        });
      });
    });
    await reportingStore.saveSetting({ create_array: data });
  } else {
    selectedDay.value?.forEach((day) => {
      totalPeriods?.forEach((period) => {
        data.push({
          day: day,
          staff_id: selectedEmployee.value,
          period: period,
        });
      });
    });
    await reportingStore.discardSetting({ delete_array: data });
  }
  showEditForm.value = false;
  await getList();
};
const goToReporting = () => {
  router.push({ name: 'reporting' });
};
watch(
  () => carouselIndex.value,
  (val) => {
    selectedDay.value = [val];
  },
  { immediate: true }
);
</script>

<style scoped>
.staff-name {
  color: rgb(var(--v-theme-primary));
}
::v-deep(.v-table .v-table__wrapper table tbody tr td) {
  font-size: 0.75rem !important;
}
::v-deep(.circle-btn .v-btn__content) {
  color: white !important;
}
::v-deep(.v-window__left) {
  position: absolute !important;
  top: 8px !important;
  left: 15px !important;
}
::v-deep(.v-window__right) {
  position: absolute;
  top: 8px !important;
  right: 15px !important;
}
.close-btn:hover {
  transform: scale(1.2);
  transition: transform 0.3s ease;
}
.close-btn {
  transition: transform 0.3s ease;
}
</style>
