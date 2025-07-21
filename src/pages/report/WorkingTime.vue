<template>
  <v-container>
    <BaseTitle class="mb-3">{{ t('workingTime.title1') }}</BaseTitle>
    <ParentCard>
      <Form
        ref="formRef"
        :validation-schema="searchWithDateSchema"
        @submit="filterByDate"
      >
        <v-row class="mt-3">
          <v-col cols="12" sm="6" lg="3" class="pa-1">
            <Field name="start_date" v-slot="{ field, errorMessage }">
              <BaseDatePicker
                v-model="field.value"
                v-bind="field"
                :label="t('workingTime.start_date')"
                :width="'100%'"
                :error-messages="errorMessage"
                prependIcon="mdi-calendar-month"
              ></BaseDatePicker>
            </Field>
          </v-col>
          <v-col cols="12" sm="6" lg="3" class="pa-1">
            <Field name="end_date" v-slot="{ field, errorMessage }">
              <BaseDatePicker
                v-model="field.value"
                v-bind="field"
                :label="t('workingTime.end_date')"
                :width="'100%'"
                :error-messages="errorMessage"
                prependIcon="mdi-calendar-month"
              ></BaseDatePicker>
            </Field>
          </v-col>
          <v-col cols="12" sm="6" lg="3" class="gap-2">
            <BaseButton type="submit" :width="'150px'" class="mx-6">{{
              t('common.search')
            }}</BaseButton>
            <BaseButton v-if="items.length > 0 && hasSearched" :width="'150px'"
              >EXCEL</BaseButton
            >
          </v-col>
        </v-row>
      </Form>
    </ParentCard>
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
    <v-card>
      <BaseTable
        :headers="headers"
        :items="items"
        :style="{ minHeight: windowHeight }"
        :items-count="itemsCount"
      >
        <template #[`item.staffName`]="{ item }">
          {{ item.staffName }}
        </template>
        <template #[`item.workingHours`]="{ item }">
          <span>{{ item.workingHours }} {{ t('workingTime.hour') }} </span>
        </template>
      </BaseTable>
    </v-card>
  </v-container>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import { Form, Field } from 'vee-validate';
import BaseButton from '../../components/bases/BaseButton.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
import BaseTable from '../../components/bases/BaseTable.vue';
import { dateSchema } from '@/plugins/validations/working-time.js';
const { t, locale } = useI18n();
const formRef = ref(null);
const hasSearched = ref(false);
const search = ref('');
const formData = ref({
  start_date: null,
  end_date: null,
});
let originalItems = [];
const getData = ref([
  { id: 1, staffName: 'John Doe', workingHours: 40, date: '2025-07-01' },
  { id: 2, staffName: 'Jane Smith', workingHours: 35, date: '2025-07-02' },
  { id: 3, staffName: 'Robert Johnson', workingHours: 42, date: '2025-07-03' },
  { id: 4, staffName: 'Emily Davis', workingHours: 38, date: '2025-07-04' },
  { id: 5, staffName: 'Michael Brown', workingHours: 45, date: '2025-01-05' },
]);
const items = ref([...getData.value]);
const searchWithDateSchema = computed(() => dateSchema(t));
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('workingTime.staffName'),
      key: 'staffName',
    },
    {
      title: t('workingTime.workingHours'),
      key: 'workingHours',
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
const filterByDate = (values) => {
  formData.value.start_date = values.start_date;
  formData.value.end_date = values.end_date;
  hasSearched.value = true;

  const startDate = new Date(values.start_date);
  const endDate = new Date(values.end_date);

  items.value = getData.value.filter((staff) => {
    const staffDate = new Date(staff.date);
    return staffDate >= startDate && staffDate <= endDate;
  });
};
originalItems = [...items.value];
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
