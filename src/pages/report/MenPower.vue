<template>
  <BaseTitle class="mb-3">{{ t('menPower.title') }}</BaseTitle>

  <Form
    ref="formRef"
    :validation-schema="menPowerSchema"
    :validate-on-change="true"
  >
    <!-- Filter Controls Row -->
    <v-row align="center" class="my-3">
      <!-- Start Date Picker -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <Field name="start_date" v-slot="{ field, errorMessage }">
          <BaseDatePicker
            v-model="field.value"
            v-bind="field"
            location="bottom"
            :label="t('menPower.form.startDate')"
            :error-messages="errorMessage"
            prependIcon="mdi-calendar-month"
            class="w-100"
            @update:model-value="getList()"
          ></BaseDatePicker>
        </Field>
      </v-col>

      <!-- End Date Picker -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <Field name="end_date" v-slot="{ field, errorMessage }">
          <BaseDatePicker
            v-model="field.value"
            v-bind="field"
            location="bottom"
            :label="t('menPower.form.endDate')"
            :error-messages="errorMessage"
            prependIcon="mdi-calendar-month"
            class="w-100"
            @update:model-value="getList()"
          ></BaseDatePicker>
        </Field>
      </v-col>

      <!-- Export Button -->
      <v-col cols="12" sm="4" md="2">
        <BaseButton
          @click="exportFile"
          :disabled="!items.length"
          class="w-100"
        >
          Export
        </BaseButton>
      </v-col>
    </v-row>
  </Form>

  <!-- Data Table Container -->
  <ParentCard>
    <BaseTable :headers="headers" :items="items" :pagination="false">
    </BaseTable>
  </ParentCard>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useMenPowerStoreStore } from '@/stores/menpower/menpower.js';
import { getMenPowerSchema } from '@/plugins/validations/menpower.js';
import { changeDateTimeZone } from '@/utils/helper';
import { exportExcel } from '@/excel-export/menpower/excel';

const menPowerStore = useMenPowerStoreStore();
const menPowerSchema = computed(() => getMenPowerSchema(t));
const { t, locale } = useI18n();
const formRef = ref(null);
const items = ref([]);
const formData = ref({
  start_date: null,
  end_date: null,
});
const startDate = computed(() => formRef.value?.values?.start_date);
const endDate = computed(() => formRef.value?.values?.end_date);
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('menPower.table.cd'),
      key: 'cd',
    },
    {
      title: t('menPower.table.name'),
      key: isJapanese ? 'jp_name' : 'eng_name',
      sortable: false,
    },
    {
      title: t('menPower.table.men'),
      key: 'men',
      sortable: true,
    },
    {
      title: t('menPower.table.hours'),
      key: 'hours',
      sortable: true,
    },
    {
      title: t('menPower.table.days'),
      key: 'days',
      sortable: true,
    },
  ];
  return tmpHeaders;
});

const fetch = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  formRef.value?.setValues({
    start_date: changeDateTimeZone(startDate),
    end_date: changeDateTimeZone(endDate),
  });
  getList();
};

onMounted(() => {
  fetch();
});

const getList = async () => {
  const { valid } = await formRef.value?.validate();
  if (valid) {
    await menPowerStore.fetchMenPower({
      start_date: startDate.value,
      end_date: endDate.value,
    });
    items.value = [...menPowerStore.getMenPower];
  }
};
const exportFile = () => {
  exportExcel(startDate.value, endDate.value, menPowerStore.getMenPower);
};
</script>
