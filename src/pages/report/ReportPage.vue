<template>
  <BaseTitle class="mb-3">{{ t('workHourReport.title') }}</BaseTitle>

  <ParentCard>
    <v-row>
      <v-col cols="12" md="12">
        <Form ref="formRef" :validation-schema="searchWithDateSchema" @submit="filterByDate">
          <div class="d-flex flex-wrap align-center justify-space-around">
            <Field name="start_date" v-slot="{ field, errorMessage }">
              <BaseDatePicker v-model="field.value" v-bind="field" :label="t('workingTime.start_date')" :width="'400px'"
                :error-messages="errorMessage" prependIcon="mdi-calendar-month" style="flex: none"></BaseDatePicker>
            </Field>
            <Field name="end_date" v-slot="{ field, errorMessage }">
              <BaseDatePicker v-model="field.value" v-bind="field" :label="t('workingTime.end_date')" :width="'400px'"
                :error-messages="errorMessage" prependIcon="mdi-calendar-month" style="flex: none"></BaseDatePicker>
            </Field>
            <BaseButton type="submit" :width="'200px'" class="mx-6">{{
              t('common.search')
              }}</BaseButton>
            <BaseButton :width="'200px'" @click="clearFormTable()">{{
              t('common.clear')
              }}</BaseButton>
            <BaseButton :width="'200px'" @click="excelExport()">{{
              t('common.excel')
              }}</BaseButton>
          </div>
        </Form>
      </v-col>
    </v-row>
  </ParentCard>

  <!-- Output Task Performance Table -->
  <div v-if="initialData">
    <div class="d-flex justify-space-between align-center mt-3">
      <BaseTitle> {{ t('workingTime.title2') }} </BaseTitle>
      <div>
        <BaseTextField v-model="search" :label="t('common.search')" color="primary" width="300px"
          prepend-icon="mdi-magnify">
        </BaseTextField>
      </div>
    </div>
    <ParentCard>
      <BaseTable :headers="headers" :items="items">
        <template #[`item.periods`]="{ item }">
          <span>{{ item.periods[0] }} {{ t('workingTime.hour') }}
            {{
              item.periods[1] == 5 ? '30 ' + t('workingTime.minutes') : ''
            }}</span>
        </template>
      </BaseTable>
    </ParentCard>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field } from 'vee-validate';
import { dateSchema } from '@/plugins/validations/working-time.js';
import { useReportingStore } from '@/stores/reporting/reporting.js';
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

// import DatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';

const reportingStore = useReportingStore();
const { t, locale } = useI18n();

const formRef = ref(null);
const search = ref('');
const initialData = ref(false);
const items = ref([]);
let originalItems = [];

const searchWithDateSchema = computed(() => dateSchema(t));

const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  return [
    {
      title: t('workingTime.staffName'),
      key: isJapanese ? 'staff_jp_name' : 'staff_eng_name',
    },
    {
      title: t('workingTime.date'),
      key: 'date',
    },
    {
      title: t('workingTime.projectName') ,
      key: isJapanese ? 'project_jp_name' : 'project_eng_name',
    },
    {
      title: t('workingTime.taskName'),
      key: 'task_display',
    },
    {
      title: t('workingTime.period'),
      key: 'period',
    },
  ];
});

const filterByDate = async (values) => {
  try {
    const memberPayload = {
      start_date: values.start_date,
      end_date: values.end_date,
      task_performance: {},
      staff_project: {},
      task_performance_setting: {},
      project: {},
      task: {},
    };

    const response = await reportingStore.fetchMember(memberPayload);
    const members = response?.data || response || [];

    if (!members.length) {
      initialData.value = false;
      items.value = [];
      originalItems = [];
      return;
    }

    const formatTime12Hour = (timeStr) => {
      if (!timeStr || timeStr === '-') return '-';
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;

      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12;

      return `${hours}:${minutes} ${ampm}`;
    };

    const taskDetails = members.flatMap((staff) => {
      if (!Array.isArray(staff.task_performance) || staff.task_performance.length === 0) {
        return [{
          staff_id: staff.id,
          staff_eng_name: staff.eng_name,
          staff_jp_name: staff.jp_name,
          date: '-',
          period: '-',
          project_eng_name: '-',
          project_jp_name: '-',
          task_display: '-',
          task_eng_name: '-',
          task_jp_name: '-',
        }];
      }

      const filteredTasks = staff.task_performance.filter((tp) => {
        if (!tp.date) return false;
        return tp.date >= values.start_date && tp.date <= values.end_date;
      });

      if (filteredTasks.length === 0) {
        return [{
          staff_id: staff.id,
          staff_eng_name: staff.eng_name,
          staff_jp_name: staff.jp_name,
          date: '-',
          period: '-',
          project_eng_name: '-',
          project_jp_name: '-',
          task_display: '-',
          task_eng_name: '-',
          task_jp_name: '-',
        }];
      }

      return filteredTasks.map((tp) => {
        const projEng = tp.project?.eng_name || tp.project_eng_name || '-';
        const projJp = tp.project?.jp_name || tp.project_jp_name || projEng;

        const taskCode = tp.task?.cd || tp.task_cd || '';
        const taskEng = tp.task?.eng_name || tp.task_eng_name || '';
        const taskJp = tp.task?.jp_name || tp.task_jp_name || taskEng;

        const currentTaskName = locale.value === 'ja' ? taskJp : taskEng;

        let taskDisplay = '-';
        if (taskCode && currentTaskName) {
          taskDisplay = `${taskCode}：${currentTaskName}`;
        } else if (currentTaskName) {
          taskDisplay = currentTaskName;
        } else if (taskCode) {
          taskDisplay = taskCode;
        }

        return {
          staff_id: staff.id,
          staff_eng_name: staff.eng_name,
          staff_jp_name: staff.jp_name,
          date: tp.date || '-',
          period: formatTime12Hour(tp.period),
          project_eng_name: projEng,
          project_jp_name: projJp,
          task_display: taskDisplay,
          task_eng_name: taskEng,
          task_jp_name: taskJp,
        };
      });
    });

    initialData.value = true;
    items.value = taskDetails;
    originalItems = [...taskDetails];
  } catch (error) {
    console.error('Error fetching member task performances:', error);
  }
};

const clearFormTable = () => {
  if (formRef.value) formRef.value.resetForm();
  initialData.value = false;
  items.value = [];
  originalItems = [];
};

const excelExport = async () => {
  if (!items.value.length) return;

  try {
    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    const isEnglish = locale.value === 'en';

    sheet.cell('A1').value('No.').style({ bold: true, fill: 'D9E1F2' });
    sheet.cell('B1').value(t('workingTime.staffName') || 'Staff Name').style({ bold: true, fill: 'D9E1F2' });
    sheet.cell('C1').value(t('workingTime.date') || 'Date').style({ bold: true, fill: 'D9E1F2' });
    sheet.cell('D1').value(t('workingTime.projectName') || 'Project').style({ bold: true, fill: 'D9E1F2' });
    sheet.cell('E1').value(t('workingTime.taskName') || 'Task').style({ bold: true, fill: 'D9E1F2' });
    sheet.cell('F1').value(t('workingTime.period') || 'Period').style({ bold: true, fill: 'D9E1F2' });

    sheet.column(1).width(8);
    sheet.column(2).width(25);
    sheet.column(3).width(15);
    sheet.column(4).width(35);
    sheet.column(5).width(25);
    sheet.column(6).width(15);

    items.value.forEach((item, i) => {
      const row = i + 2;
      sheet.cell(`A${row}`).value(i + 1);
      sheet.cell(`B${row}`).value(isEnglish ? item.staff_eng_name : item.staff_jp_name);
      sheet.cell(`C${row}`).value(item.date);
      sheet.cell(`D${row}`).value(isEnglish ? item.project_eng_name : item.project_jp_name);
      sheet.cell(`E${row}`).value(item.task_display);
      sheet.cell(`F${row}`).value(item.period);
    });

    const blob = await workbook.outputAsync();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Task_Performance_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Excel Export failed:', error);
  }
};

watch(
  () => search.value,
  (newVal) => {
    if (newVal) {
      items.value = originalItems.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(newVal.toLowerCase())
        )
      );
    } else {
      items.value = [...originalItems];
    }
  }
);
</script>