<template>
  <div>
    <BaseTitle class="mb-3">
      {{ t('workHourReport.title') }}
    </BaseTitle>
    <v-row>
      <v-col cols="6"
        ><ParentCard>
          <Form
            ref="formRef"
            :validation-schema="reportingSchema"
            @submit="submit"
          >
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-col cols="12" class="relative mb-n1">
                    <v-date-picker
                      v-model="selectedDates"
                      rounded="lg"
                      hide-header
                      :multiple="isDayMultiple"
                      :style="{
                        transform: 'scale(1.1)',
                        transformOrigin: 'top left',
                        height: '90%',
                      }"
                    >
                    </v-date-picker>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="d-flex justify-center mb-n3">
                    <span
                      class="mr-5 mt-4"
                      :style="{
                        fontSize: '1rem',
                        color: !isDayMultiple
                          ? 'rgb(var(--v-theme-primary))'
                          : '',
                        fontWeight: !isDayMultiple ? 800 : '',
                      }"
                      >{{ t('workHourReport.form.single') }}</span
                    >
                    <v-switch
                      v-model="isDayMultiple"
                      color="primary"
                      :value="true"
                    ></v-switch>
                    <span
                      class="ml-5 mt-4"
                      :style="{
                        fontSize: '1rem',
                        color: isDayMultiple
                          ? 'rgb(var(--v-theme-primary))'
                          : '',
                        fontWeight: isDayMultiple ? 800 : '',
                      }"
                      >{{ t('workHourReport.form.multiple') }}</span
                    >
                  </v-col>
                </v-row>
                <v-row
                  ><v-col cols="12" class="d-flex justify-space-around">
                    <v-btn
                      icon
                      color="primary"
                      class="circle-btn"
                      density="comfortable"
                      :disabled="selectedEmployee.length === 0"
                      @click="applySetting"
                    >
                      <v-icon> tabler:IconPlayerPlay </v-icon>
                      <v-tooltip
                        activator="parent"
                        location="bottom"
                        color="primary"
                        >{{ t('common.autoFill') }}</v-tooltip
                      >
                    </v-btn>
                    <v-btn
                      icon
                      color="primary"
                      class="circle-btn"
                      density="comfortable"
                      @click="viewSetting"
                    >
                      <v-icon> tabler:IconSettings </v-icon>
                      <v-tooltip activator="parent" location="bottom">{{
                        t('common.viewSetting')
                      }}</v-tooltip>
                    </v-btn>
                    <v-btn
                      icon
                      color="primary"
                      class="circle-btn"
                      density="comfortable"
                    >
                      <v-icon> tabler:IconCloudDown </v-icon>
                      <v-tooltip activator="parent" location="bottom">{{
                        t('common.download')
                      }}</v-tooltip>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row
                  ><v-col cols="12">
                    <div class="d-flex justify-center" style="margin-top: 14px">
                      <BaseButton
                        type="button"
                        style="width: 90%"
                        @click="clearDates"
                      >
                        {{ t('workHourReport.dateClear') }}
                      </BaseButton>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row class="pt-3">
                  <v-col cols="12">
                    <Field
                      name="employee"
                      v-slot="{ field: { value, ...field }, errorMessage }"
                    >
                      <span class="d-none">{{ value }}</span>
                      <BaseAutoComplete
                        v-if="role === ADMIN"
                        v-model="selectedEmployee"
                        v-bind="field"
                        :label="t('workHourReport.form.employee')"
                        :items="employees"
                        prependIcon="tabler:IconUser"
                        item-title="name"
                        item-value="id"
                        width="90%"
                        :chip-width="195"
                        :error-messages="errorMessage"
                      >
                      </BaseAutoComplete>
                      <div class="mt-4 mb-6 text-h5 staff-name" v-else>
                        {{ staffName }}
                      </div>
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
                        width="90%"
                        class="mt-n2"
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
                        width="90%"
                        item-value="id"
                        :error-messages="errorMessage"
                      >
                      </BaseSelect>
                    </Field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="mb-n6 mt-n3">
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
                        prependIcon="tabler:IconClockHour9"
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
                        prependIcon="tabler:IconClockHour5"
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
                    <div
                      class="d-flex justify-space-between ml-n2 mt-n2"
                      style="width: 95%"
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
                    <div class="ml-n2 mt-2 mb-2">
                      <BaseButton type="submit" style="width: 90%">
                        {{ t('common.submit') }}
                      </BaseButton>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </Form>
        </ParentCard></v-col
      >
      <v-col cols="6"
        ><v-carousel
          v-if="selectedIsoDates.length > 0"
          v-model="carouselIndex"
          hide-delimiters
          :show-arrows="isDayMultiple ? 'hover' : false"
          style="height: auto"
        >
          <v-carousel-item
            v-for="(selectedIsoDate, index) in selectedIsoDates"
            :key="selectedIsoDate"
            :value="index"
          >
            <ParentCard>
              <h3 class="color-primary text-center mb-4">
                {{ selectedIsoDate }}
              </h3>

              <BaseTable
                :headers="headers"
                :items="dateTaskGroups?.[selectedIsoDate]"
                :items-count="itemsCount"
                :style="{ minHeight: windowHeight }"
                :pagination="false"
                style="width: 92%"
                class="mx-auto dense-table"
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
const staffName = computed(() =>
  locale.value === 'ja' ? staff?.jp_name : staff?.eng_name
);
const reportingSchema = computed(() =>
  getReportingSchema(t, timeSelectionMode.value, role === ADMIN)
);
const formRef = ref(null);
const timeSelectionMode = ref(0);
const selectedDates = ref([]);
const search = ref('');
const warnDateSelection = ref(false);
const deleteTarget = ref(undefined);
const updateTarget = ref(undefined);
const checkPrjCds = ref([]);
let originalItems = [];
const employeeItems = ref([]);
const selectedEmployee = ref([]);
const selectedEmployeeInfo = computed(() => {
  if (role === ADMIN) {
    return employeeItems.value?.filter((item) =>
      selectedEmployee.value?.includes(item.id)
    );
  } else {
    return employeeItems.value;
  }
});
const selectedPeriod = ref([1, 2]);
const isDayMultiple = ref(true);
const currentEmployee = ref();
const dateTaskGroups = ref({});
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
  selectPreviousOfficeDays();
};

fetch();

const selectPreviousOfficeDays = () => {
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
};
const clearDates = () => {
  selectedDates.value = [];
};
const getList = async () => {
  const memberPayload = {
    task_performance: {},
    project: {},
    task: {},
    task_performance_setting: {},
  };
  if (role !== ADMIN) {
    memberPayload.id = staff.id;
  }
  await reportingStore.fetchMember(memberPayload);
  const tmpMembers = reportingStore.getMembers?.map((member) => {
    const task_performance = member.task_performance?.map((task_perf) => ({
      staff_id: task_perf?.staff_id,
      date: task_perf?.date,
      period: task_perf?.period,
      project_id: task_perf?.project_id,
      project_cd: task_perf?.project?.cd,
      project_eng_name: task_perf?.project?.eng_name,
      project_jp_name: task_perf?.project?.jp_name,
      task_id: task_perf?.task_id,
      task_cd: task_perf?.task?.cd,
      task_eng_name: task_perf?.task?.cd + '：' + task_perf?.task?.eng_name,
      task_jp_name: task_perf?.task?.cd + '：' + task_perf?.task?.jp_name,
    }));
    const tmpItem = {
      id: member?.id,
      eng_name: member?.eng_name,
      jp_name: member?.jp_name,
      sort_key: member?.sort_key,
      task_performance: task_performance,
      task_performance_setting: member.task_performance_setting,
    };
    return tmpItem;
  });
  tmpMembers?.sort((a, b) => {
    if (!a.sort_key) return 1;
    if (!b.sort_key) return -1;
    return a.sort_key - b.sort_key;
  });
  employeeItems.value = [...tmpMembers];
  selectedEmployee.value = [staff.id];
  await nextTick();
  selectedPeriod.value = [1, 2];
  formRef.value?.setValues({
    employee: selectedEmployee.value,
    period: selectedPeriod.value,
  });
  groupDates();
};
const submit = async (values) => {
  if (selectedIsoDates.value?.length === 0) {
    warnDateSelection.value = true;
  } else {
    let data = [];
    let totalPeriods = [];
    const totalDates = selectedIsoDates.value;
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
    if (overTime.value > 0) {
      totalPeriods.push(
        ...generateExtraPeriods(
          totalPeriods[totalPeriods.length - 1],
          overTime.value
        )
      );
    }
    const targetEmployees =
      role === ADMIN ? selectedEmployee.value : [staff.id];
    if (values.project) {
      targetEmployees?.forEach((employee) => {
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
    } else {
      targetEmployees?.forEach((employee) => {
        totalDates?.forEach((date) => {
          totalPeriods?.forEach((period) => {
            data.push({
              date: date,
              staff_id: employee,
              period: period,
            });
          });
        });
      });
      await reportingStore.deleteTaskPerformance({ delete_array: data });
    }
  }
  await getList();
};
const groupDates = () => {
  if (role !== ADMIN) {
    currentEmployee.value = employeeItems.value?.[0];
  } else if (selectedEmployee.value?.length === 1) {
    currentEmployee.value = employeeItems.value?.find(
      (item) => item.id === selectedEmployee.value[0]
    );
  } else {
    currentEmployee.value = undefined;
  }
  dateTaskGroups.value = currentEmployee.value?.task_performance?.reduce(
    (acc, task) => {
      if (selectedIsoDates.value?.includes(task.date)) {
        if (!acc[task.date]) {
          acc[task.date] = [];
        }
        acc[task.date].push(task);
      }
      return acc;
    },
    {}
  );
  Object.keys(dateTaskGroups.value).forEach((date) => {
    dateTaskGroups.value[date].sort((a, b) => a.period.localeCompare(b.period));
  });
  dateTaskGroups.value = fillPeriods(dateTaskGroups.value);
  const lastDate = isDayMultiple.value
    ? selectedDates.value[selectedDates.value?.length - 1]
    : selectedDates.value;
  if (lastDate) {
    const index = selectedIsoDates.value?.indexOf(changeDateTimeZone(lastDate));
    if (index !== -1) {
      carouselIndex.value = index;
    }
  }
};
const applySetting = async () => {
  const settings = [];
  selectedEmployeeInfo.value?.forEach((info) => {
    selectedIsoDates.value?.forEach((dateStr) => {
      const date = new Date(dateStr);
      const day = date.getDay();
      const employeeSettings = info?.task_performance_setting
        ?.filter((setting) => setting.day === day)
        ?.map((setting) => ({
          date: dateStr,
          period: setting.period,
          project_id: setting.project_id,
          staff_id: setting.staff_id,
          task_id: setting.task_id,
        }));
      settings.push(...employeeSettings);
    });
  });
  await reportingStore.createTaskPerformance({ create_array: settings });
  await getList();
};
const saveSetting = async () => {
  if (dateTaskGroups.value) {
    const latestByWeekday = {};
    Object.entries(dateTaskGroups.value)?.forEach(([dateStr, data]) => {
      const date = new Date(dateStr);
      const weekday = date.getDay();
      if (
        !latestByWeekday?.[weekday] ||
        new Date(dateStr) > new Date(latestByWeekday?.[weekday]?.date)
      ) {
        latestByWeekday[weekday] = {
          date: dateStr,
          data: data,
        };
      }
    });
    const settingItems = [];
    Object.entries(latestByWeekday)?.forEach(([weekday, obj]) => {
      const items = obj.data?.map((item) => ({
        day: weekday,
        staff_id: item.staff_id,
        project_id: item.project_id,
        task_id: item.task_id,
        period: item.period,
      }));
      settingItems.push(...items);
    });
    settingItems.sort((a, b) => a.day - b.day);
    await reportingStore.saveSetting({ create_array: settingItems });
    await getList();
  }
};
const discardSetting = async () => {
  await reportingStore.discardSetting({
    delete_array: role === ADMIN ? selectedEmployee.value : [staff.id],
  });
  await getList();
};
const viewSetting = async () => {
  router.push({ name: 'reporting-setting' });
};
watch(
  () => formRef.value?.values?.project,
  (val) => {
    if (!val && formRef.value?.values?.task) {
      formRef.value.setFieldValue('task', '');
    }
  }
);
watch(
  () => isDayMultiple.value,
  (val) => {
    if (!val) {
      const lastDay = selectedDates.value.pop();
      selectedDates.value = lastDay;
    } else {
      selectedDates.value = [selectedDates.value];
    }
  }
);
watch([() => selectedIsoDates.value, () => selectedEmployee.value], () => {
  groupDates();
});
</script>

<style scoped>
::v-deep(
  .v-date-picker-month__day:not(.v-date-picker-month__day--selected)
    .v-btn.v-date-picker-month__day-btn:hover
) {
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
::v-deep(.v-date-picker-month__day--selected .v-btn) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}
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
  top: 15px !important;
  left: 15px !important;
  color: rgb(var(--v-theme-primary));
}
::v-deep(.v-window__right) {
  position: absolute;
  top: 15px !important;
  right: 15px !important;
  color: rgb(var(--v-theme-primary));
}
/* .v-tooltip > ::v-deep(.v-overlay__content) {
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
  color: rgb(var(--v-theme-primary)) !important;
} */
</style>
