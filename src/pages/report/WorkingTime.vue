<template>
  <BaseTitle class="mb-3">{{ t('workingTime.title1') }}</BaseTitle>
  <ParentCard>
    <v-row>
      <v-col cols="12" md="12">
        <Form
          ref="formRef"
          :validation-schema="searchWithDateSchema"
          @submit="filterByDate">
          <div class="d-flex flex-wrap align-center justify-space-around">
              <Field name="start_date" v-slot="{ field, errorMessage }">
                <BaseDatePicker
                  v-model="field.value"
                  v-bind="field"
                  :label="t('workingTime.start_date')"
                  :width="'400px'"
                  :error-messages="errorMessage"
                  prependIcon="mdi-calendar-month"
                  style="flex: none"
                ></BaseDatePicker>
              </Field>
              <Field name="end_date" v-slot="{ field, errorMessage }">
                <BaseDatePicker
                  v-model="field.value"
                  v-bind="field"
                  :label="t('workingTime.end_date')"
                  :width="'400px'"
                  :error-messages="errorMessage"
                  prependIcon="mdi-calendar-month"
                  style="flex: none"
                ></BaseDatePicker>
              </Field>
              <BaseButton type="submit" :width="'200px'" class="mx-6">{{
                t('common.search')
              }}</BaseButton>
               <BaseButton :width="'200px'" @click="clearFormTable()"
                >{{t('common.clear')}}</BaseButton
              >
              <BaseButton :width="'200px'" @click="excelExport()"
                >{{t('common.excel')}}</BaseButton
              >
          </div>
        </Form>
      </v-col>
    </v-row>
  </ParentCard>
  <div v-if="initialData">
    <div class="d-flex justify-space-between align-center mt-3">
      <BaseTitle> {{ t('workingTime.title2') }} </BaseTitle>
      <div>
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          color="primary"
          width="300px"
          prepend-icon="mdi-magnify"
        >
        </BaseTextField>
      </div>
    </div>
    <ParentCard>
      <BaseTable
        :headers="headers"
        :style="{ minHeight: windowHeight }"
        :items-count="itemsCount"
        :items="items"
      >
        <template #[`item.periods`]="{ item }">
          <span>{{ item.periods[0] }}  {{ t('workingTime.hour') }} {{ item.periods[1] }}  {{ t('workingTime.minutes') }}</span>
        </template>
      </BaseTable>
    </ParentCard>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import { Form, Field } from 'vee-validate';
import { dateSchema } from '@/plugins/validations/working-time.js';
import { useReportingStore } from '@/stores/reporting/reporting.js';
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

const reportingStore = useReportingStore();
const { t, locale } = useI18n();
const formRef = ref(null);
const search = ref('');
const initialData = ref(false)
let originalItems = [];
const items = ref(null);
const searchWithDateSchema = computed(() => dateSchema(t));
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('workingTime.staffName'),
      key: isJapanese ? 'jp_name' : 'eng_name',
    },
    {
      title: t('workingTime.workingHours'),
      key: 'periods',
    },
  ];
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

const filterByDate = async (values) => {
  try {
  const workTimes = await reportingStore.fetchWorkTime(values)
  initialData.value = workTimes.data.length === 0 ? false : true;
  const staffPeriods = {};

  workTimes.data.forEach(entry => {
    const staffId = entry.staff_id;
    const jp_name = entry.jp_name;
    const eng_name = entry.eng_name;
    const minutes = timeToMinutes(entry.periods);

    if (!staffPeriods[staffId]) {
      staffPeriods[staffId] = {
        staff_id: staffId,
        eng_name: eng_name,
        jp_name: jp_name,
        totalMinutes: 0,
      };
    }

    staffPeriods[staffId].totalMinutes += minutes;
  });

  const result = Object.values(staffPeriods).map((staff) => ({
    staff_id: staff.staff_id,
    eng_name: staff.eng_name,
    jp_name: staff.jp_name,
    periods: minutesToTimeStr(staff.totalMinutes),
  }));

  items.value = result;
  originalItems = [...result];

  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

function timeToMinutes(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTimeStr(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourArr = [hours, minutes];
  return hourArr
}

const clearFormTable = () => {
  formRef.value.resetForm();
  initialData.value = false
};

const excelExport = () => {
  XlsxPopulate.fromBlankAsync().then(workbook => {
    const sheet = workbook.sheet(0);

    // Set headers with styles and width
    sheet.cell("A1").value("No").style({ bold: true, fill: "D9E1F2" });
    sheet.cell("B1").value("English Name").style({ bold: true, fill: "D9E1F2" });
    sheet.cell("C1").value("Japanese Name").style({ bold: true, fill: "D9E1F2" });
    sheet.cell("D1").value("Worked Period").style({ bold: true, fill: "D9E1F2" });
    sheet.column(1).width(10); 
    sheet.column(2).width(30); 
    sheet.column(3).width(30);
    sheet.column(4).width(30);

    // Fill in data
    items.value.forEach((e, i) => {
      const row = i + 2;
      sheet.cell(`A${row}`).value(i+1);
      sheet.cell(`B${row}`).value(e.eng_name);
      sheet.cell(`C${row}`).value(e.jp_name);
      sheet.cell(`D${row}`).value(`${e.periods[0]} Hr : ${e.periods[1]} mins`);
    });

    // Export file
    workbook.outputAsync().then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Working_Hours_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  });
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
    window._rowIndex = 0;
  }
);
</script>
