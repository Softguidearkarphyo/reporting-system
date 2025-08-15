<template>
  <BaseTitle class="mb-4"> {{ t('showProject.title') }} </BaseTitle>
  <ParentCard class="pa-4 mb-4">
    <v-row>
      <v-col cols="10" md="10" class="mx-auto">
        <Form ref="formRef" :validation-schema="projectSchema" @submit="submit">
           <div class="d-flex align-center justify-space-evenly">
                <Field name="end_date" v-slot="{ field, errorMessage }">
                  <BaseDatePicker
                    v-model="field.value"
                    v-bind="field"
                    :label="t('showProject.end_date')"
                    prependIcon="mdi-calendar-month"
                    :width="'330px'"
                    :error-messages="errorMessage"
                    style="flex: none;"
                  ></BaseDatePicker>
                </Field>
                <Field name="week_date" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('showProject.week_date')"
                    :items="week_date"
                    item-title="name"
                    item-value="id"
                    prependIcon="mdi-calendar-week"
                    :width="'330px'"
                    :error-messages="errorMessage"
                    style="flex: none;"
                  >
                  </BaseSelect>
                </Field>
                <div style="width: 300px; flex: none;" class="d-flex justify-space-between" >
                  <BaseButton type="submit" :width="'100px'">
                    {{ t('common.search') }}
                  </BaseButton>
                  <BaseButton :width="'100px'" @click="clearFormTable()">{{
                      t('common.clear')
                    }}</BaseButton>
                </div>
            </div>
        </Form>
      </v-col>
    </v-row>
  </ParentCard>
  <div v-if="initialData">
    <v-row class="align-center">
    <v-col cols="6" md="7" lg="9" class="d-flex justify-start">
      <BaseTitle> {{  t('showProject.title') }} </BaseTitle>
    </v-col>
    <v-col cols="6" md="5" lg="3" class="d-flex justify-end">
      <BaseTextField
        v-model="search"
        :label="t('common.search')"
        color="primary"
        prepend-icon="mdi-magnify"
        class="mb-n5"
        type="text"
        variant="plain"
        dense
      >
      </BaseTextField>
      <BaseButton
        @click="excelExport(items,{ t, locale })"
        :disabled="!items.length"
        style="width: 100px"
      >
          {{t('common.excel')}}
      </BaseButton>
    </v-col>
  </v-row>
    <div v-for="week in items" :key="week.weekLabel" class="mb-3">
      <h2 class="ms-3">{{ week.weekLabel }}</h2>
        <v-card class="mb-2 pa-5">
        <v-row>
          <v-col
            v-for="project in week.projects"
            :key="project.project_id"
            cols="6"
            md="6"
          >
              <h3 class="mb-2">
                {{ projectNameLang ? project.project_eng : project.project_jp }}
              </h3>

              <BaseTable :headers="headers" :items="project.project_info">
                <template #[`item.periods`]="{ item }">
                  <span>
                    {{ item.periods[0] }} {{ t('workingTime.hour') }}
                    {{
                      item.periods[1] == 5
                        ? '30 ' + t('workingTime.minutes')
                        : ''
                    }}
                  </span>
                </template>
              </BaseTable>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { excelExport } from '@/excel-export/showproject/excel'
import { useI18n } from 'vue-i18n';
import { showProjectSchema } from '@/plugins/validations/show-project.js';
import { week_date } from '@/utils/data';
import { useShowProject } from '@/stores/projectHour/project-user-hour.js';

const { t, locale } = useI18n();
const projectSchema = computed(() => showProjectSchema(t));
const search = ref('');
const searchFlg = ref(false);
const formRef = ref(null);
const items = ref([]);
const showProject = useShowProject();
const initialData = ref(false);
let originalItems = [];

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

const projectNameLang = computed((project)=>{
  const currentLang = locale.value === 'en';
  return currentLang 
})

onMounted(() => {
  searchFlg.value = true;
});

const submit = async (values) => {
  const projectWorkHour = await showProject.fetchProjecthour(values);
  initialData.value = projectWorkHour.data.length > 0 ? true : false;

  const weekRangeMap = getWeekRangeMap(values.end_date, values.week_date);
  const weekGroups = {};

  projectWorkHour.data.forEach((entry) => {
    const { date, staff_id, jp_name, eng_name, project_id, project_eng, project_jp } = entry;
    const hours = 0.5;

    const weekLabel = weekRangeMap[date];

    if (!weekGroups[weekLabel]) {
      weekGroups[weekLabel] = { weekLabel, projects: {} };
    }

    if (!weekGroups[weekLabel].projects[project_id]) {
      weekGroups[weekLabel].projects[project_id] = {
        project_id,
        project_eng,
        project_jp,
        staffMap: {}
      };
    }

    if (!weekGroups[weekLabel].projects[project_id].staffMap[staff_id]) {
      weekGroups[weekLabel].projects[project_id].staffMap[staff_id] = {
        staff_id,
        eng_name,
        jp_name,
        totalHour: 0
      };
    }

    weekGroups[weekLabel].projects[project_id].staffMap[staff_id].totalHour += hours;
  });

  const groupedResult = Object.values(weekGroups).map(week => ({
    weekLabel: week.weekLabel,
    projects: Object.values(week.projects).map(project => ({
      project_id: project.project_id,
      project_eng: project.project_eng,
      project_jp: project.project_jp,
      project_info: Object.values(project.staffMap).map(staff => ({
        staff_id: staff.staff_id,
        eng_name: staff.eng_name,
        jp_name: staff.jp_name,
        periods: hourMinConvert(staff.totalHour)
      }))
    }))
  }));

  items.value = groupedResult;
  originalItems = [...groupedResult];
};

function hourMinConvert(hour) {
  if (hour.toString().includes('.')) {
    const arr = hour.toString().split('.');
    return arr;
  }
  return [hour];
}

function getWeekRangeMap(inputDate, weeks) {
  const map = {};
  let endDate = new Date(inputDate);

    const format = (d) => d.toISOString().slice(0, 10);

      for (let i = 0; i < weeks; i++) {
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6); 

        const rangeLabel = `${format(endDate)} to ${format(startDate)}`;

        let loopDate = new Date(endDate);
        while (loopDate >= startDate) {
          map[format(loopDate)] = rangeLabel;
          loopDate.setDate(loopDate.getDate() - 1);
        }

        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() - 1);
      }

  return map; 
}

const clearFormTable = () => {
  formRef.value.resetForm();
  initialData.value = false;
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
