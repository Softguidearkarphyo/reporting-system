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
            :disabled="isLoading"
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
            :disabled="isLoading"
            @update:model-value="getList()"
          ></BaseDatePicker>
        </Field>
      </v-col>

      <!-- Export Button -->
      <v-col cols="12" sm="4" md="2">
        <BaseButton
          @click="exportFile"
          :disabled="!items.length || isLoading"
          class="w-100"
        >
          Export
        </BaseButton>
      </v-col>
    </v-row>
  </Form>

  <!-- Data Table Container with :loading="isLoading" -->
  <ParentCard>
    <BaseTable :headers="headers" :items="items" :pagination="false" :loading="isLoading">
    </BaseTable>
  </ParentCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMenPowerStoreStore } from '@/stores/menpower/menpower.js';
import { getMenPowerSchema } from '@/plugins/validations/menpower.js';
import { changeDateTimeZone } from '@/utils/helper';
import { exportExcel } from '@/excel-export/menpower/excel';

const menPowerStore = useMenPowerStoreStore();
const { t, locale } = useI18n();

const formRef = ref(null);
const items = ref([]);
const isLoading = ref(false);

const menPowerSchema = computed(() => getMenPowerSchema(t));

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
    isLoading.value = true;
    try {
      await menPowerStore.fetchMenPower({
        start_date: startDate.value,
        end_date: endDate.value,
      });
      items.value = [...menPowerStore.getMenPower];
    } catch (error) {
      console.error('Error fetching man power list:', error);
    } finally {
      isLoading.value = false;
    }
  }
};

const exportFile = () => {
  exportExcel(startDate.value, endDate.value, menPowerStore.getMenPower);
};
</script>