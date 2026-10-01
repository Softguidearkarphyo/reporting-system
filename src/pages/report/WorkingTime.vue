<template>
  <BaseTitle class="mb-3">{{ t('workingTime.title1') }}</BaseTitle>

  <ParentCard>
    <v-row>
      <v-col cols="12">
        <Form
          ref="formRef"
          :validation-schema="searchWithDateSchema"
          @submit="filterByDate"
        >
          <v-row align="center">
            <!-- Start Date Picker -->
            <v-col cols="12" sm="6" md="4">
              <Field name="start_date" v-slot="{ field, errorMessage }">
                <BaseDatePicker
                  v-model="field.value"
                  v-bind="field"
                  :label="t('workingTime.start_date')"
                  :error-messages="errorMessage"
                  prependIcon="mdi-calendar-month"
                  class="w-100"
                ></BaseDatePicker>
              </Field>
            </v-col>

            <!-- End Date Picker -->
            <v-col cols="12" sm="6" md="4">
              <Field name="end_date" v-slot="{ field, errorMessage }">
                <BaseDatePicker
                  v-model="field.value"
                  v-bind="field"
                  :label="t('workingTime.end_date')"
                  :error-messages="errorMessage"
                  prependIcon="mdi-calendar-month"
                  class="w-100"
                ></BaseDatePicker>
              </Field>
            </v-col>

            <!-- Action Buttons Group -->
            <v-col cols="12" md="4">
              <v-row density="compact">
                <v-col cols="12" sm="4">
                  <BaseButton type="submit" class="w-100">
                    {{ t('common.search') }}
                  </BaseButton>
                </v-col>
                <v-col cols="12" sm="4">
                  <BaseButton class="w-100" @click="clearFormTable()">
                    {{ t('common.clear') }}
                  </BaseButton>
                </v-col>
                <v-col cols="12" sm="4">
                  <BaseButton class="w-100" @click="excelExport()">
                    {{ t('common.excel') }}
                  </BaseButton>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </Form>
      </v-col>
    </v-row>
  </ParentCard>

  <!-- Output Task Performance Table -->
  <div v-if="initialData" class="mt-4">
    <!-- Header Title and Search Bar -->
    <div
      class="d-flex flex-column flex-md-row justify-space-between align-md-center ga-3 mb-3"
    >
      <BaseTitle>{{ t('workingTime.title2') }}</BaseTitle>

      <div class="w-100 w-md-auto" style="min-width: 260px">
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          color="primary"
          prepend-icon="mdi-magnify"
          hide-details
          class="w-100"
        ></BaseTextField>
      </div>
    </div>

    <!-- Data Table Container -->
    <ParentCard>
      <BaseTable :headers="headers" :items="items">
        <template #[`item.periods`]="{ item }">
          <span>
            {{ item.periods[0] }} {{ t('workingTime.hour') }}
            {{ item.periods[1] == 5 ? '30 ' + t('workingTime.minutes') : '' }}
          </span>
        </template>
      </BaseTable>
    </ParentCard>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import { Form, Field } from 'vee-validate';
// import { dateSchema } from '@/plugins/validations/working-time.js';
import { useReportingStore } from '@/stores/reporting/reporting.js';
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import { getMenPowerSchema } from '@/plugins/validations/menpower.js';

const reportingStore = useReportingStore();
const { t, locale } = useI18n();
const formRef = ref(null);
const search = ref('');
const initialData = ref(false);
let originalItems = [];
const items = ref(null);
const searchWithDateSchema = computed(() => getMenPowerSchema(t));
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

const filterByDate = async (values) => {
  try {
    const workTimes = await reportingStore.fetchWorkTime(values);
    initialData.value = workTimes.data.length === 0 ? false : true;
    const staffPeriods = {};

    workTimes.data.forEach((entry) => {
      const staffId = entry.staff_id;
      const jp_name = entry.jp_name;
      const eng_name = entry.eng_name;
      const hours = +0.5;

      if (!staffPeriods[staffId]) {
        staffPeriods[staffId] = {
          staff_id: staffId,
          eng_name: eng_name,
          jp_name: jp_name,
          totalHour: 0,
        };
      }
      staffPeriods[staffId].totalHour += hours;
    });

    const result = Object.values(staffPeriods).map((staff) => ({
      staff_id: staff.staff_id,
      eng_name: staff.eng_name,
      jp_name: staff.jp_name,
      periods: hourMinConvert(staff.totalHour),
    }));


    items.value = result;
    originalItems = [...result];
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

function hourMinConvert(hour) {
  if (hour.toString().includes('.')) {
    const arr = hour.toString().split('.');
    return arr;
  }
  return [hour];
}

const clearFormTable = () => {
  formRef.value.resetForm();
  initialData.value = false;
};

const excelExport = () => {
  XlsxPopulate.fromBlankAsync().then((workbook) => {
    const sheet = workbook.sheet(0);
    const isENglish = locale.value === 'en';
    // Set headers with styles and width
    sheet
      .cell('A1')
      .value(t('common.no'))
      .style({ bold: true, fill: 'D9E1F2' });
    sheet
      .cell('B1')
      .value(t('workingTime.staffName'))
      .style({ bold: true, fill: 'D9E1F2' });
    sheet
      .cell('C1')
      .value(t('workingTime.workingHours'))
      .style({ bold: true, fill: 'D9E1F2' });
    sheet.column(1).width(10);
    sheet.column(2).width(30);
    sheet.column(3).width(30);

    // Fill in data
    items.value.forEach((e, i) => {
      const row = i + 2;
      sheet.cell(`A${row}`).value(i + 1);
      sheet.cell(`B${row}`).value(isENglish ? e.eng_name : e.jp_name);
      sheet
        .cell(`C${row}`)
        .value(
          e.periods[0] +
            t('workingTime.hour') +
            ' ' +
            (e.periods[1] ? e.periods[1] + t('workingTime.hour') : '')
        );
    });

    // Export file
    workbook.outputAsync().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${t('workingTime.title2')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
