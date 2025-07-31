<template>
  <BaseTitle>MenPower</BaseTitle>
  <ParentCard>
    <Form>
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
        <v-col cols="12" sm="6" lg="3" class="d-flex justify-start pa-1">
          <Field name="eng_name" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              type="text"
              variant="plain"
              prependIcon="mdi-format-letter-case"
              :style="{ maxWidth: '120px' }"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" sm="6" lg="3" class="pa-1 d-flex align-center">
          <BaseButton type="submit" :width="'150px'" class="ml-sm-0 ml-lg-6">
            {{ t('common.search') }}
          </BaseButton>
        </v-col>
      </v-row>
    </Form>
  </ParentCard>
  <ParentCard>
    <BaseTable
      :headers="headers"
      :items="items"
      :height="windowHeight"
      :items-count="itemsCount"
    >
    </BaseTable>
  </ParentCard>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/project/project.js';

const projectStore = useProjectStore();
const { t, locale } = useI18n();
const items = ref([]);
const formData = ref({
  start_date: null,
  end_date: null,
});
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('addProject.table.cd'),
      key: 'cd',
    },
    {
      title: t('addProject.table.name'),
      key: isJapanese ? 'jp_name' : 'eng_name',
      sortable: false,
    },
    {
      title: 'Average Hr',
      sortable: false,
    },
    {
      title: 'Total Hr',
      sortable: false,
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

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    await projectStore.fetchProject();
    items.value = [...projectStore.getProjects];
  } catch (err) {
    console.error(err);
  }
};
</script>
