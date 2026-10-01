<template>
  <BaseTitle class="mb-4"> {{ t('showProject.title') }} </BaseTitle>
  <ParentCard class="pa-4 mb-4">
    <v-row>
      <v-col cols="12" sm="11" md="10" class="mx-auto">
        <Form ref="formRef" :validation-schema="projectSchema" @submit="submit">
          <!-- Responsive Grid Layout for Form Controls -->
          <v-row class="align-center justify-center">
            
            <!-- Start / Week Date Selection + Checkbox -->
            <v-col cols="12" md="5" class="d-flex align-center">
              <div class="flex-grow-1">
                <Field name="start_date" v-slot="{ field, errorMessage }" v-if="checkboxFlg">
                  <BaseDatePicker
                    v-model="field.value"
                    v-bind="field"
                    :label="t('showProject.start_date')"
                    prependIcon="mdi-calendar-month"
                    :error-messages="errorMessage"
                    class="w-100"
                  ></BaseDatePicker>
                </Field>
                <Field name="week_date" v-slot="{ field, errorMessage }" v-if="!checkboxFlg">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('showProject.week_date')"
                    :items="week_date"
                    item-title="name"
                    item-value="id"
                    prependIcon="mdi-calendar-week"
                    :error-messages="errorMessage"
                    class="w-100"
                  >
                  </BaseSelect>
                </Field>
              </div>
              <div class="ms-2 flex-shrink-0">
                <v-checkbox
                  v-model="checkboxFlg"
                  hide-details 
                  @click="toggleField()" >
                  <v-tooltip activator="parent" location="top">month filter</v-tooltip>
                </v-checkbox>
              </div>
            </v-col>

            <!-- End Date Selection -->
            <v-col cols="12" md="4">
              <Field name="end_date" v-slot="{ field, errorMessage }">
                <BaseDatePicker
                  v-model="field.value"
                  v-bind="field"
                  :label="t('showProject.end_date')"
                  prependIcon="mdi-calendar-month"
                  :error-messages="errorMessage"
                  class="w-100"
                ></BaseDatePicker>
              </Field>
            </v-col>

            <!-- Action Buttons -->
            <v-col cols="12" md="3" class="d-flex justify-space-between justify-md-end ga-2">
              <BaseButton type="submit" class="flex-grow-1 flex-md-grow-0" style="min-width: 100px;">
                {{ t('common.search') }}
              </BaseButton>
              <BaseButton class="flex-grow-1 flex-md-grow-0" style="min-width: 100px;" @click="clearFormTable()">
                {{ t('common.clear') }}
              </BaseButton>
            </v-col>

          </v-row>
        </Form>
      </v-col>
    </v-row>
  </ParentCard>

  <div v-if="initialData">
    <!-- Search & Export Header Section -->
    <v-row class="align-center mb-2">
      <v-col cols="12" sm="6" md="7" lg="8" class="d-flex justify-start">
        <BaseTitle> {{ t('showProject.title') }} </BaseTitle>
      </v-col>
      <v-col cols="12" sm="6" md="5" lg="4" class="d-flex align-center justify-end ga-3">
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          color="primary"
          prepend-icon="mdi-magnify"
          type="text"
          variant="plain"
          dense
          class="w-100"
        >
        </BaseTextField>
        <BaseButton
          @click="excelExport(items,{ t, locale }, checkboxFlg)"
          :disabled="!items.length"
          style="min-width: 100px;"
          class="flex-shrink-0"
        >
          {{ t('common.excel') }}
        </BaseButton>
      </v-col>
    </v-row>

    <!-- Project Cards Grid -->
    <div v-for="week in items" :key="week.weekLabel" class="mb-3">
      <h2 class="ms-3">{{ week.weekLabel }}</h2>
      <v-card class="mb-2 pa-3 pa-md-5">
        <v-row>
          <v-col
            v-for="project in week.projects"
            :key="project.project_id"
            cols="12"
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
import { startOfMonth as getStartOfMonth, endOfMonth as getEndOfMonth,format } from 'date-fns';

const { t, locale } = useI18n();
const checkboxFlg = ref(false)
const projectSchema = computed(() => showProjectSchema(t, checkboxFlg));
const search = ref('')
const searchFlg = ref(false)
const formRef = ref(null)
const items = ref([]) 
const showProject = useShowProject()
const initialData = ref(false)
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

const projectNameLang = computed(()=>{
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

    const weekLabel = checkboxFlg.value == true ? getMonth(date) : weekRangeMap[date];
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

        const rangeLabel = `${format(endDate)} ~ ${format(startDate)}`;

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
  checkboxFlg.value = false;
};

const getMonth = (date)=>{
  const dateChange = new Date(date)
  const startOfMonth = format(getStartOfMonth(dateChange), 'yyyy-MM-dd');
  const lastOfMonth = format(getEndOfMonth(dateChange), 'yyyy-MM-dd');
  return `${startOfMonth} ~ ${lastOfMonth}`;
}

const toggleField = ()=>{
  checkboxFlg.value = !checkboxFlg.value;
}

watch(
  () => search.value,
  (newVal) => {
    if (newVal) {
      const dateSearch = originalItems.filter((item) =>{
         Object.values(item).some((val) =>
          String(val).toLowerCase().includes(newVal.toLowerCase())
        )
        if(!dateSearch){
          const projectSearch = originalItems.project.filter((e)=> {

          })
        }
    })   
    } else {
      items.value = [...originalItems];
    }
    window._rowIndex = 0;
  }
);
</script>
