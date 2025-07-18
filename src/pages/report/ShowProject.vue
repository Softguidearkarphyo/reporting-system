<template>
  <v-container>
    <BaseTitle class="mb-4"> {{ t('showProject.title') }} </BaseTitle>
    <ParentCard class="pa-4 mb-4">
      <Form
      ref="formRef"
        :validation-schema="projectSchema"
        @submit="submit"
      >
        <v-row class="mt-2">
          <v-col cols="12" class="px-2" md="3" >
            <Field name="end_date" v-slot="{ field, errorMessage }">
              <BaseDatePicker
                v-model="field.value"
                v-bind="field"
                :label="t('showProject.end_date')"
                class="mx-auto"
                prependIcon="mdi-calendar-month"
                :width="'330px'"
                :error-messages="errorMessage"
              ></BaseDatePicker>
            </Field>
          </v-col>
          <v-col cols="12" class="px-2" md="3" >
            <Field name="week_date" v-slot="{ field, errorMessage }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('showProject.week_date')"
                class="mx-auto"
                :items="week_date"
                item-title="name"
                item-value="id"
                prependIcon="mdi-seat"
                :width="'330px'"
                :error-messages="errorMessage"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="5" class="ml-2 mt-n1">
            <BaseButton
              type="submit"
            >
              {{ t('common.search') }}
            </BaseButton>
            <BaseButton v-if="originalItems.length > 0 && searchFlg" :width="'100px'">EXCEL</BaseButton>
          </v-col>
        </v-row>
      </Form>
    </ParentCard>

    <div class="d-flex align-center justify-space-between mb-3 mt-5">
        <BaseTitle>{{ t('showProject.title') }}</BaseTitle>
      <div>
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          variant="underlined"
          color="primary"
          width="300px"
          style="margin-right: 40px;"
          prepend-icon="mdi-magnify"
        />
      </div>
    </div>

    <v-card>
      <BaseTable
        :headers="headers"
        :items="originalItems"
      >
        <template #[`item.user_id`]="{ item }">
          <div v-if="searchFlg"
            class="rounded-pill py-1 px-1 text-center mx-auto"
            :style="{
              backgroundColor: item.position?.color,
              width: '75px',
              fontSize: '11px',
            }"
          >
            {{ item.user_id }}
          </div>
        </template>
        <template #[`item.user_name`]="{ item }">
          <div v-if="searchFlg"
            class="rounded-pill py-1 px-1 text-center mx-auto"
            :style="{
              backgroundColor: item.position?.color,
              width: '75px',
              fontSize: '11px',
            }"
          >
            {{ item.user_name }}
          </div>
        </template>
        <template #[`item.total_working_hour`]="{ item }">
          <div v-if="searchFlg"
            class="rounded-pill py-1 px-1 text-center mx-auto"
            :style="{
              backgroundColor: item.position?.color,
              width: '75px',
              fontSize: '11px',
            }"
          >
            {{ item.total_working_hour }}
          </div>
        </template>        
      </BaseTable>
    </v-card>
  </v-container>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import BaseDatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseButton from '../../components/bases/BaseButton.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
import { showProjectSchema } from '@/plugins/validations/show-project.js';
import { week_date } from '@/utils/data';

const { t } = useI18n();
const projectSchema = computed(() => showProjectSchema(t));
const search = ref('');
const searchFlg = ref(false);
const formData = ref({
  end_date: null,
  week_date: null,
});
const originalItems = ref([]);
const headers = computed(() => [
  { title: t('showProject.table.user_name'), key: 'user_id', align: 'center' },
  { title: t('showProject.table.user_id'), key: 'user_name', align: 'center', sortable: false },
  { title: t('showProject.table.total_working_hour'), key: 'total_working_hour', align: 'center', sortable: false }
]);

const getItems = [
  { user_id: 'TS', user_name: 'AA', total_working_hour: 20, created_at: '12-07-2025' },
  { user_id: 'Tb', user_name: 'AA', total_working_hour: 10, created_at: '26-06-2025' },
  { user_id: 'T', user_name: 'AA', total_working_hour: 5, created_at: '19-06-2025' },
  { user_id: 'Test', user_name: 'AA', total_working_hour: 10, created_at: '10-07-2025' },
];

onMounted(() => {
  originalItems.value = [...getItems];
  searchFlg.value = true;
});

const submit = (values) => {
  formData.value.end_date = values.end_date;
  formData.value.week_date = values.week_date;

  const endDate = new Date(values.end_date);
  const weekKey = values.week_date;

  let subtractDays = 0;
  if (weekKey === 1) subtractDays = 7;
  else if (weekKey === 2) subtractDays = 14;
  else if (weekKey === 3) subtractDays = 21;
  else if (weekKey === 4) subtractDays = 28;

  const targetDate = new Date(endDate);
  targetDate.setDate(targetDate.getDate() - subtractDays);
  const formattedTarget = formatDate(targetDate);
console.log(formattedTarget);

  const filteredItems = getItems.filter(item => item.created_at === formattedTarget);
  if (filteredItems.length > 0) {
    originalItems.value = filteredItems;
    searchFlg.value = true;
  } else {
    originalItems.value = [];
    searchFlg.value = false;
  }
};

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}
watch(
  () => search.value,
  (newVal) => {
    if (newVal) {
      originalItems.value = getItems.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(newVal.toLowerCase())
        )
      );
    } else {
      originalItems.value = [...getItems];
    }
  }
);

</script>
<style scoped>
::v-deep(.v-input__control) {
  width: 300px;
}
</style> 

